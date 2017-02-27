import ITestRunner from "./ITestRunner";
import {
    IProjectionDefinition,
    Event,
    IObjectContainer,
    Dictionary,
    IProjectionRunnerFactory,
    ITickScheduler,
    IProjection,
    Snapshot,
    IEventDeserializer
} from "prettygoat";
import {inject, interfaces, injectable} from "inversify";
import TestStreamFactory from "./components/TestStreamFactory";
import {Disposable} from "rx";
import TestEvent from "./TestEvent";
import {map} from "lodash";
import TestReadModelFactory from "./components/TestReadModelFactory";

@injectable()
class TestRunner<T> implements ITestRunner<T> {

    private projection: IProjection<T>;
    private initialState: T|Dictionary<T>;
    private stopDate: Date;
    private events: TestEvent[] = [];
    private dependencies: TestEvent[] = [];
    private rawEvents: any[] = [];
    private subscription: Disposable;

    constructor(@inject("IStreamFactory") private streamFactory: TestStreamFactory,
                @inject("IReadModelFactory") private readModelFactory: TestReadModelFactory,
                @inject("IObjectContainer") private container: IObjectContainer,
                @inject("Factory<ITickScheduler>") private tickSchedulerFactory: interfaces.Factory<ITickScheduler>,
                @inject("ITickSchedulerHolder") private tickSchedulerHolder: Dictionary<ITickScheduler>,
                @inject("IProjectionRunnerFactory") private runnerFactory: IProjectionRunnerFactory,
                @inject("IEventDeserializer") private deserializer: IEventDeserializer) {

    }

    of(constructor: interfaces.Newable<IProjectionDefinition<T>>): ITestRunner<T> {
        const key = `prettygoat:definitions:test`;
        if (this.container.contains(key))
            this.container.remove(key);
        this.container.set(key, constructor);
        let tickScheduler = <ITickScheduler>this.tickSchedulerFactory();
        this.projection = this.container.get<IProjectionDefinition<T>>(key).define(tickScheduler);
        this.tickSchedulerHolder[this.projection.name] = tickScheduler;
        return this;
    }

    fromEvents(events: TestEvent[]): ITestRunner<T> {
        this.events = events;
        return this;
    }

    fromRawEvents(events: any[]): ITestRunner<T> {
        this.rawEvents = events;
        return this;
    }

    withDependencies(events: TestEvent[]): ITestRunner<T> {
        this.dependencies = events;
        return this;
    }

    startWith(initialState: T): ITestRunner<T> {
        this.initialState = initialState;
        return this;
    }

    run(): Promise<T> {
        if (!this.projection)
            return Promise.reject(new Error("Missing projection to run"));
        if (!this.stopDate)
            return Promise.reject(new Error("Missing required stop date"));
        if (!this.events.length && !this.rawEvents.length)
            return Promise.reject(new Error("Cannot run a projection without events"));

        return new Promise((resolve, reject) => {
            let events = this.events.length ? this.mapTestEvents(this.events) : this.deserializeEvents(this.rawEvents);
            this.streamFactory.setEvents(events);
            this.readModelFactory.setReadModels(this.mapTestEvents(this.dependencies));

            let runner = this.runnerFactory.create(this.projection),
                lastState: T|Dictionary<T> = null;
            this.subscription = runner.notifications().subscribe(readModel => {
                if (+readModel.timestamp === +this.stopDate)
                    resolve(runner.state);
                if (+readModel.timestamp > +this.stopDate)
                    resolve(lastState);
                lastState = runner.state;
            }, error => reject(error));
            runner.run(this.initialState ? new Snapshot(this.initialState, null) : null);
        });
    }

    stopAt(date: Date): ITestRunner<T> {
        this.stopDate = date;
        return this;
    }

    private mapTestEvents(events: TestEvent[]): Event[] {
        return map<TestEvent, Event>(events, event => {
            return {
                type: event.type,
                payload: event.payload,
                timestamp: event.timestamp,
                splitKey: null
            }
        })
    }

    private deserializeEvents(events: any[]): Event[] {
        return map<any, Event>(events, event => this.deserializer.toEvent(event));
    }

    dispose(): void {
        if (this.subscription) {
            this.subscription.dispose();
            this.subscription = null;
        }
    }

}

export default TestRunner