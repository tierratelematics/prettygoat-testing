import "reflect-metadata";
import expect = require("expect.js");
import * as TypeMoq from "typemoq";
import ITestRunner from "../scripts/ITestRunner";
import TestRunner from "../scripts/TestRunner";
import MockProjection from "./fixtures/MockProjection";
import MockDate from "./fixtures/MockDate";
import MockObjectContainer from "./fixtures/MockObjectContainer";

describe("Given a test runner", () => {

    let subject: ITestRunner<number>;
    let objectContainer: TypeMoq.IMock<IObjectContainer>;

    beforeEach(() => {
        objectContainer = TypeMoq.Mock.ofType(MockObjectContainer);
        subject = new TestRunner<number>();
    });

    context("when a projection is supplied", () => {
        beforeEach(() => {
            objectContainer.setup(o => o.get(TypeMoq.It.isAny())).returns(() => new MockProjection().define());
            subject.of(MockProjection);
        });

        context("and a stop date is not provided", () => {
            it("should throw an error", () => {
                expect(async() => {
                    await subject.run();
                }).to.throwError();
            });
        });

        context("and an initial state is given", () => {
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
            it("should throw an error", () => {
                expect(async() => {
                    await subject.run();
                }).to.throwError();
            });
        });

        context("when a list of events is given", () => {
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
                    .stopAt(new Date(100));
                let state = await subject.run();
                expect(state).to.be(70);
            });
        });

        context("when a list of raw events is given", () => {
            it("should parse and process those events", async() => {
                subject
                    .fromRawEvents([{
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
                    .stopAt(new Date(100));
                let state = await subject.run();
                expect(state).to.be(70);
            });
        });
    });

    context("when a projection is not supplied", () => {
        it("should throw an error", () => {
            expect(async() => {
                await subject.run();
            }).to.throwError();
        });
    });
});