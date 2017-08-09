import "reflect-metadata";
import expect = require("expect.js");
import {IMock, Mock, Times, It} from "typemoq";
import TestRunner from "../scripts/TestRunner";
import MockProjection from "./fixtures/MockProjection";
import {IObjectContainer, IProjectionRunnerFactory, IProjectionRunner, IEventDeserializer} from "prettygoat";
import TestStreamFactory from "../scripts/TestStreamFactory";
import MockProjectionRunner from "./fixtures/MockProjectionRunner";
import {Observable} from "rxjs";
import {ITestRunner} from "scripts/ITestRunner";
import MockReadModel from "../../prettygoat/test/fixtures/definitions/MockReadModel";

describe("Given a test runner", () => {

    let subject: ITestRunner<number>;
    let objectContainer: IMock<IObjectContainer>;
    let runnerFactory: IMock<IProjectionRunnerFactory>;
    let projectionRunner: IMock<IProjectionRunner<number>>;
    let deserializer: IMock<IEventDeserializer>;

    beforeEach(() => {
        projectionRunner = Mock.ofType(MockProjectionRunner);
        runnerFactory = Mock.ofType<IProjectionRunnerFactory>();
        objectContainer = Mock.ofType<IObjectContainer>();
        deserializer = Mock.ofType<IEventDeserializer>();
        deserializer.setup(d => d.toEvent(It.isAny())).returns(() => null);
        subject = new TestRunner<number>(new TestStreamFactory(), objectContainer.object, runnerFactory.object, deserializer.object);
        runnerFactory.setup(r => r.create(It.isAny())).returns(() => projectionRunner.object);
    });

    function publishReadModel(runner, observer, type, payload, date) {
        runner.state = payload;
        observer.next([{
            type: type,
            payload: payload,
            timestamp: date
        }, null]);
    }

    context("when a projection is already registered", () => {
        beforeEach(() => {
            runnerFactory.setup(r => r.create(It.isAny())).returns(() => projectionRunner.object);
            objectContainer.setup(o => o.get(It.isAny())).returns(() => new MockProjection());
            objectContainer.setup(o => o.contains("prettygoat:definitions:test")).returns(() => true);
        });
        it("should unbind it", () => {
            subject.of(MockProjection);
            objectContainer.verify(o => o.remove("prettygoat:definitions:test"), Times.once());
        });
    });

    context("when a readmodel is provided", () => {
        beforeEach(() => {
            runnerFactory.setup(r => r.create(It.isAny())).returns(() => projectionRunner.object);
            objectContainer.setup(o => o.get(It.isAny())).returns(() => new MockReadModel());
            objectContainer.setup(o => o.contains("prettygoat:definitions:test")).returns(() => true);
            projectionRunner.setup(p => p.notifications()).returns(() => Observable.create(observer => {
                publishReadModel(projectionRunner.object, observer, "Mock", 50, new Date(1));
                publishReadModel(projectionRunner.object, observer, "Mock", 100, new Date(100));
            }));
        });
        it("should be used the same as a projection", async () => {
            subject
                .of(new MockReadModel())
                .startWith(50)
                .fromEvents([{
                    type: "test",
                    payload: 50,
                    timestamp: new Date(100)
                }]);
            let state = await subject.run();

            expect(state).to.be(100);
        });
    });

    context("when a projection is supplied", () => {
        beforeEach(() => {
            objectContainer.setup(o => o.get(It.isAny())).returns(() => new MockProjection());
            subject.of(MockProjection);
        });

        context("and a stop date is not provided", () => {
            beforeEach(() => {
                projectionRunner.setup(p => p.notifications()).returns(() => Observable.create(observer => {
                    publishReadModel(projectionRunner.object, observer, "Mock", 50, new Date(1));
                    publishReadModel(projectionRunner.object, observer, "Mock", 100, new Date(100));
                }));
            });
            it("should use the last timestamp of the provided events", async () => {
                subject
                    .startWith(50)
                    .fromEvents([{
                        type: "test",
                        payload: 50,
                        timestamp: new Date(100)
                    }]);
                let state = await subject.run();

                expect(state).to.be(100);
            });
        });

        context("and an initial state is given", () => {
            beforeEach(() => {
                projectionRunner.setup(p => p.notifications()).returns(() => Observable.create(observer => {
                    publishReadModel(projectionRunner.object, observer, "Mock", 50, new Date(1));
                    publishReadModel(projectionRunner.object, observer, "Mock", 100, new Date(100));
                }));
            });
            it("should run the projection starting from that state", async () => {
                subject
                    .startWith(50)
                    .fromEvents([{
                        type: "test",
                        payload: 50,
                        timestamp: new Date(100)
                    }])
                    .stopAt(new Date(100));
                let state = await subject.run();

                expect(state).to.be(100);
            });
        });

        context("when no events are given", () => {
            it("should throw an error", (done) => {
                subject.run().catch(error => {
                    done();
                });
            });
        });

        context("when a list of events is given", () => {
            beforeEach(() => {
                projectionRunner.setup(p => p.notifications()).returns(() => Observable.create(observer => {
                    publishReadModel(projectionRunner.object, observer, "Mock", 10, new Date(1));
                    publishReadModel(projectionRunner.object, observer, "Mock", 30, new Date(100));
                    publishReadModel(projectionRunner.object, observer, "Mock", 70, new Date(200));
                }));
            });
            it("should process those events", async () => {
                subject
                    .fromEvents([{
                        type: "test",
                        payload: 20,
                        timestamp: new Date(100)
                    }, {
                        type: "test",
                        payload: 40,
                        timestamp: new Date(200)
                    }])
                    .stopAt(new Date(200));
                let state = await subject.run();

                expect(state).to.be(70);
            });
        });

        context("when the projection is running past the stop date", () => {
            beforeEach(() => {
                projectionRunner.setup(p => p.notifications()).returns(() => Observable.create(observer => {
                    publishReadModel(projectionRunner.object, observer, "Mock", 10, new Date(1));
                    publishReadModel(projectionRunner.object, observer, "Mock", 30, new Date(100));
                    publishReadModel(projectionRunner.object, observer, "Mock", 70, new Date(200));
                }));
            });
            it("should stop the projection", async () => {
                subject
                    .fromEvents([{
                        type: "test",
                        payload: 20,
                        timestamp: new Date(100)
                    }, {
                        type: "test",
                        payload: 40,
                        timestamp: new Date(200)
                    }])
                    .stopAt(new Date(150));
                let state = await subject.run();

                expect(state).to.be(30);
            });
        });

        context("when a list of raw events is given", () => {
            beforeEach(() => {
                projectionRunner.setup(p => p.notifications()).returns(() => Observable.create(observer => {
                    publishReadModel(projectionRunner.object, observer, "Mock", 10, new Date(1));
                    publishReadModel(projectionRunner.object, observer, "Mock", 30, new Date(100));
                    publishReadModel(projectionRunner.object, observer, "Mock", 70, new Date(200));
                }));
            });
            it("should parse and process those events", async () => {
                subject
                    .fromRawEvents([{
                        payload: {
                            $manifest: "testRaw",
                            count: 20
                        },
                        timestamp: null
                    }, {
                        payload: {
                            $manifest: "testRaw",
                            count: 20
                        },
                        timestamp: null
                    }])
                    .stopAt(new Date(200));
                let state = await subject.run();

                expect(state).to.be(70);
            });
        });
    });

    context("when an already built projection is supplied", () => {
        beforeEach(() => {
            projectionRunner.setup(p => p.notifications()).returns(() => Observable.create(observer => {
                publishReadModel(projectionRunner.object, observer, "Mock", 10, new Date(1));
                publishReadModel(projectionRunner.object, observer, "Mock", 30, new Date(100));
                publishReadModel(projectionRunner.object, observer, "Mock", 70, new Date(200));
            }));
        });
        it("should work the same as the other way", async () => {
            let state = await subject
                .of(new MockProjection())
                .fromEvents([{
                    type: "test",
                    payload: 20,
                    timestamp: new Date(100)
                }, {
                    type: "test",
                    payload: 40,
                    timestamp: new Date(200)
                }])
                .stopAt(new Date(200))
                .run();

            expect(state).to.be(70);
        });
    });

    context("when a projection is not supplied", () => {
        it("should throw an error", (done) => {
            subject.run().catch(error => {
                done();
            });
        });
    });
});