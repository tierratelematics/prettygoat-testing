import "reflect-metadata";
import expect = require("expect.js");
import ITestRunner from "../scripts/ITestRunner";
import TestRunner from "../scripts/TestRunner";
import MockProjection from "./fixtures/MockProjection";
import MockDate from "./fixtures/MockDate";

describe("Given a test runner", () => {

    let subject: ITestRunner;

    beforeEach(() => {
        subject = new TestRunner();
    });

    context("when a projection is supplied", () => {
        beforeEach(() => {
            subject.of(MockProjection);
        });

        context("and an initial state is given", () => {
            it("should run the projection starting from that state", () => {
                subject.startWith(50).events([]);
                expect(subject.run()).to.be(50);
            });
        });

        context("when a list of events is given", () => {
            it("should process those events", () => {
                subject.events([{
                    type: "test",
                    payload: 20,
                    splitKey: null,
                    timestamp: null
                }, {
                    type: "test",
                    payload: 40,
                    splitKey: null,
                    timestamp: null
                }]);
                expect(subject.run()).to.be(70);
            });
        });

        context("when a list of raw events is given", () => {
            it("should parse and process those events", () => {
                subject.rawEvents([{
                    payload: {
                        $manifest: "testRaw",
                        count: 20
                    },
                    timestamp: new MockDate()
                }, {
                    payload: {
                        $manifest: "testRaw",
                        count: 40
                    },
                    timestamp: new MockDate()
                }]);
                expect(subject.run()).to.be(70);
            });
        });
    });

    context("when a projection is not supplied", () => {
        it("should throw an error", () => {
            expect(() => {
                subject.run();
            }).to.throwError();
        });
    });
});