import ITestRunner from "./ITestRunner";
import {IProjectionDefinition, Event, IObjectContainer, Dictionary} from "prettygoat";
import {inject, interfaces} from "inversify";
import TestStreamFactory from "./components/TestStreamFactory";

class TestRunner<T> implements ITestRunner<T> {

    private projection: IProjection<T>;
    private initialState: T;
    private stopDate: Date;

    constructor(@inject("IStreamFactory") private streamFactory: TestStreamFactory,
                @inject("IObjectContainer") private container: IObjectContainer,
                @inject("Factory<ITickScheduler>") private tickSchedulerFactory: interfaces.Factory<ITickScheduler>,
                @inject("ITickSchedulerHolder") private tickSchedulerHolder: Dictionary<ITickScheduler>) {

    }

    of(constructor: IProjectionDefinition<T>): ITestRunner<T> {
        const key = `prettygoat:definitions:test`;
        this.container.set(key, constructor);
        let tickScheduler = this.tickSchedulerFactory();
        this.projection = this.container.get<IProjectionDefinition<T>>(key).define(tickScheduler);
        this.tickSchedulerHolder[this.projection.name] = tickScheduler;
        return this;
    }

    fromEvents(events: Event[]): ITestRunner<T> {
        this.streamFactory.setEvents(events);
        return this;
    }

    fromRawEvents(events: any[]): ITestRunner<T> {
        this.streamFactory.setRawEvents(events);
        return this;
    }

    startWith(initialState: T): ITestRunner<T> {
        this.initialState = initialState;
        return this;
    }

    run(): T {
        if (!this.projection)
            throw new Error("Missing projection to run");
        return null;
    }

    stopAt(date: Date): ITestRunner<T> {
        this.stopDate = date;
        return this;
    }

}

export default TestRunner