import "reflect-metadata";
import expect = require("expect.js");
import * as TypeMoq from "typemoq";
import ITestRunner from "../scripts/ITestRunner";
import TestRunner from "../scripts/TestRunner";
import MockProjection from "./fixtures/MockProjection";
import MockObjectContainer from "./fixtures/MockObjectContainer";
import {IObjectContainer, IProjectionRunnerFactory, IProjectionRunner, Event} from "prettygoat";
import MockProjectionRunnerFactory from "./fixtures/MockProjectionRunnerFactory";
import TestStreamFactory from "../scripts/components/TestStreamFactory";
import MockProjectionRunner from "./fixtures/MockProjectionRunner";
import {Observable} from "rx";
import MockEventDeserializer from "./fixtures/MockEventDeserializer";

describe("Given a test runner", () => {

    let subject: ITestRunner<number>;
    let objectContainer: TypeMoq.IMock<IObjectContainer>;
    let runnerFactory: TypeMoq.IMock<IProjectionRunnerFactory>;
    let projectionRunner: TypeMoq.IMock<IProjectionRunner<number>>;

    beforeEach(() => {
        projectionRunner = TypeMoq.Mock.ofType(MockProjectionRunner);
        runnerFactory = TypeMoq.Mock.ofType(MockProjectionRunnerFactory);
        objectContainer = TypeMoq.Mock.ofType(MockObjectContainer);
        subject = new TestRunner<number>(new TestStreamFactory(new MockEventDeserializer()), objectContainer.object, () => null, {}, runnerFactory.object);
    });

    function publishReadModel(observer, type, payload, date) {
        observer.onNext({
            type: type,
            payload: payload,
            timestamp: date,
            splitKey: null
        });
    }

    context("when a projection is already registered", () => {
        beforeEach(() => {
            runnerFactory.setup(r => r.create(TypeMoq.It.isAny())).returns(() => projectionRunner.object);
            objectContainer.setup(o => o.get(TypeMoq.It.isAny())).returns(() => new MockProjection());
            objectContainer.setup(o => o.contains("prettygoat:definitions:test")).returns(() => true);
        });
        it("should unbind it", () => {
            subject.of(MockProjection);
            objectContainer.verify(o => o.remove("prettygoat:definitions:test"), TypeMoq.Times.once());
        });
    });

    context("when a projection is supplied", () => {
        beforeEach(() => {
            runnerFactory.setup(r => r.create(TypeMoq.It.isAny())).returns(() => projectionRunner.object);
            objectContainer.setup(o => o.get(TypeMoq.It.isAny())).returns(() => new MockProjection());
            subject.of(MockProjection);
        });

        context("and a stop date is not provided", () => {
            it("should throw an error", (done) => {
                subject.run().catch(error => {
                    done();
                });
            });
        });

        context("and an initial state is given", () => {
            beforeEach(() => {
                projectionRunner.setup(p => p.notifications()).returns(() => Observable.create<Event>(observer => {
                    publishReadModel(observer, "Mock", 50, new Date(1));
                    publishReadModel(observer, "Mock", 100, new Date(100));
                }));
            });
            it("should run the projection starting from that state", async() => {
                subject
                    .startWith(50)
                    .fromEvents([{
                        type: "test",
                        payload: 50,
                        splitKey: null,
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
                projectionRunner.setup(p => p.notifications()).returns(() => Observable.create<Event>(observer => {
                    publishReadModel(observer, "Mock", 10, new Date(1));
                    publishReadModel(observer, "Mock", 30, new Date(100));
                    publishReadModel(observer, "Mock", 70, new Date(200));
                }));
            });
            it("should process those events", async() => {
                subject
                    .fromEvents([{
                        type: "test",
                        payload: 20,
                        splitKey: null,
                        timestamp: new Date(100)
                    }, {
                        type: "test",
                        payload: 40,
                        splitKey: null,
                        timestamp: new Date(200)
                    }])
                    .stopAt(new Date(200));
                let state = await subject.run();
                expect(state).to.be(70);
            });
        });

        context("when the projection is running past the stop date", () => {
            beforeEach(() => {
                projectionRunner.setup(p => p.notifications()).returns(() => Observable.create<Event>(observer => {
                    publishReadModel(observer, "Mock", 10, new Date(1));
                    publishReadModel(observer, "Mock", 30, new Date(100));
                    publishReadModel(observer, "Mock", 70, new Date(200));
                }));
            });
            it("should stop the projection", async() => {
                subject
                    .fromEvents([{
                        type: "test",
                        payload: 20,
                        splitKey: null,
                        timestamp: new Date(100)
                    }, {
                        type: "test",
                        payload: 40,
                        splitKey: null,
                        timestamp: new Date(200)
                    }])
                    .stopAt(new Date(150));
                let state = await subject.run();
                expect(state).to.be(30);
            });
        });

        context("when a list of raw events is given", () => {
            beforeEach(() => {
                projectionRunner.setup(p => p.notifications()).returns(() => Observable.create<Event>(observer => {
                    publishReadModel(observer, "Mock", 10, new Date(1));
                    publishReadModel(observer, "Mock", 30, new Date(100));
                    publishReadModel(observer, "Mock", 70, new Date(200));
                }));
            });
            it("should parse and process those events", async() => {
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

    context("when a projection is not supplied", () => {
        it("should throw an error", (done) => {
            subject.run().catch(error => {
                done();
            });
        });
    });
});