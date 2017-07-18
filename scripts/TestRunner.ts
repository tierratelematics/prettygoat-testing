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
import {inject, interfaces, injectable, optional} from "inversify";
import TestStreamFactory from "./TestStreamFactory";
import {Disposable} from "rx";
import {map, last, cloneDeep, isFunction} from "lodash";

@injectable()
class TestRunner<T> implements ITestRunner<T> {

    private projection: IProjection<T>;
    private initialState: T;
    private stopDate: Date;
    private events: Event[] = [];
    private rawEvents: any[] = [];
    private subscription: Disposable;

    constructor(@inject("IStreamFactory") private streamFactory: TestStreamFactory,
                @inject("IObjectContainer") private container: IObjectContainer,
                @inject("Factory<ITickScheduler>") private tickSchedulerFactory: interfaces.Factory<ITickScheduler>,
                @inject("ITickSchedulerHolder") private tickSchedulerHolder: Dictionary<ITickScheduler>,
                @inject("IProjectionRunnerFactory") private runnerFactory: IProjectionRunnerFactory,
                @inject("IEventDeserializer") @optional() private deserializer?: IEventDeserializer) {

    }

    of(constructor: interfaces.Newable<IProjectionDefinition<T>> | IProjectionDefinition<T>): ITestRunner<T> {
        let tickScheduler = <ITickScheduler>this.tickSchedulerFactory();
        let projectionDefinition: IProjectionDefinition<T>;
        if (!isFunction(constructor)) {
            projectionDefinition = <IProjectionDefinition<T>> constructor;
        } else {
            const key = `prettygoat:definitions:test`;
            if (this.container.contains(key))
                this.container.remove(key);
            this.container.set(key, constructor);
            projectionDefinition = this.container.get<IProjectionDefinition<T>>(key);
        }
        this.projection = projectionDefinition.define(tickScheduler);
        this.tickSchedulerHolder[this.projection.name] = tickScheduler;
        return this;
    }

    fromEvents(events: Event[]): ITestRunner<T> {
        this.events = events;
        return this;
    }

    fromRawEvents(events: any[]): ITestRunner<T> {
        this.rawEvents = events;
        return this;
    }

    startWith(initialState: T): ITestRunner<T> {
        this.initialState = initialState;
        return this;
    }

    run(): Promise<T> {
        if (!this.projection)
            return Promise.reject(new Error("Missing projection to run"));
        if (!this.events.length && !this.rawEvents.length)
            return Promise.reject(new Error("Cannot run a projection without events"));

        return new Promise((resolve, reject) => {
            let events = this.events.length ? this.events : this.deserializeEvents(this.rawEvents);
            if (!this.stopDate) this.stopDate = last(events).timestamp;
            this.streamFactory.setEvents(events);

            let runner = this.runnerFactory.create(this.projection),
                lastState: T = null;
            this.subscription = runner.notifications().subscribe(notification => {
                let readModel = notification[0];
                if (+readModel.timestamp === +this.stopDate) this.flushState(resolve, runner.state);
                if (+readModel.timestamp > +this.stopDate) this.flushState(resolve, lastState);
                lastState = runner.state;
            }, error => reject(error));
            runner.run(this.initialState ? new Snapshot(this.initialState, null) : null);
        });
    }

    private deserializeEvents(events: any[]): Event[] {
        return map<any, Event>(events, event => this.deserializer.toEvent(event));
    }

    private flushState(resolve: Function, state: T) {
        resolve(cloneDeep(state));
        this.subscription.dispose();
    }

    stopAt(date: Date): ITestRunner<T> {
        this.stopDate = date;
        return this;
    }

    unsubscribe(): void {
        if (this.subscription) {
            this.subscription.dispose();
            this.subscription = null;
        }
    }

}

export default TestRunner
