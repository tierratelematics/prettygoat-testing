import {interfaces} from "inversify";
import {Observable, IDisposable} from "rx";
import {Dictionary, IWhen, Event, IStreamFactory, IEventDeserializer, ITickScheduler, IModule} from "prettygoat";

export interface ITestRunner<T> extends IDisposable {
    of(constructor: interfaces.Newable<IProjectionDefinition<T>>): ITestRunner<T>;
    fromEvents(TestEvent: TestEvent[]): ITestRunner<T>;
    withDependencies(events: TestEvent[]): ITestRunner<T>;
    fromRawEvents(events: any[]): ITestRunner<T>;
    startWith(initialState: T): ITestRunner<T>;
    stopAt(date: Date): ITestRunner<T>;
    run(): Promise<T>;
}

declare class TestStreamFactory implements IStreamFactory {

    constructor(deserializer: IEventDeserializer);

    from(lastEvent: Date, completions?: Observable<string>, definition?: IWhen<any>): Observable<Event>;

    setEvents(events: Event[]);

    setRawEvents(events: any[]);

}

export class TestRunner<T> implements ITestRunner<T> {

    private projection: IProjection<T>;
    private initialState: T;
    private stopDate: Date;
    private events: Event[] = [];
    private rawEvents: any[] = [];

    constructor(streamFactory: TestStreamFactory, container: IObjectContainer,
                tickSchedulerFactory: interfaces.Factory<ITickScheduler>, tickSchedulerHolder: Dictionary<ITickScheduler>,
                runnerFactory: IProjectionRunnerFactory) {

    }

    of(constructor: interfaces.Newable<IProjectionDefinition<T>>): ITestRunner<T>;

    fromEvents(events: TestEvent[]): ITestRunner<T>;

    withDependencies(events: TestEvent[]): ITestRunner<T>;

    fromRawEvents(events: any[]): ITestRunner<T>;

    startWith(initialState: T): ITestRunner<T>;

    run(): Promise<T>;

    stopAt(date: Date): ITestRunner<T>;

    dispose(): void;
}

export class TestEnvironment {

    setup(modules: IModule[] = []);

    runner(): ITestRunner;
}

export class TestEvent {
    type: string;
    payload: any;
    timestamp: Date;

    constructor(type: string, payload: any, timestamp: Date);
}