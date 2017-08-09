import {
    Event,
    IObjectContainer,
    IProjectionRunnerFactory,
    IProjection,
    Snapshot,
    IEventDeserializer,
    IProjectionFactory
} from "prettygoat";
import {inject, interfaces, injectable, optional} from "inversify";
import TestStreamFactory from "./TestStreamFactory";
import {ISubscription} from "rxjs/Subscription";
import {map, last, cloneDeep, isFunction} from "lodash";
import {ITestRunner, ReadModelOrProjection, ReadModelOrProjectionDef} from "./ITestRunner";

@injectable()
class TestRunner<T> implements ITestRunner<T> {

    closed = false;
    private projection: IProjection<T>;
    private initialState: T;
    private stopDate: Date;
    private events: Event[] = [];
    private rawEvents: any[] = [];
    private subscription: ISubscription;

    constructor(@inject("IStreamFactory") private streamFactory: TestStreamFactory,
                @inject("IProjectionRunnerFactory") private runnerFactory: IProjectionRunnerFactory,
                @inject("IProjectionFactory") private projectionFactory: IProjectionFactory,
                @inject("IEventDeserializer") @optional() private deserializer?: IEventDeserializer) {

    }

    of(constructor: ReadModelOrProjection<T> | interfaces.Newable<ReadModelOrProjectionDef<T>>): ITestRunner<T> {
        this.projection = !isFunction(constructor) ? <IProjection<T>> constructor : this.projectionFactory.create(constructor);
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
        this.subscription.unsubscribe();
    }

    stopAt(date: Date): ITestRunner<T> {
        this.stopDate = date;
        return this;
    }

    unsubscribe(): void {
        this.closed = true;
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

}

export default TestRunner
