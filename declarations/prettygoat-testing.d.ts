import {interfaces} from "inversify";
import {Observable, IDisposable} from "rx";
import {
    WhenBlock,
    Event,
    IStreamFactory,
    IEventDeserializer,
    IModule,
    IProjectionDefinition
} from "prettygoat";

export interface ITestRunner<T> extends IDisposable {
    of(constructor: interfaces.Newable<IProjectionDefinition<T>> | IProjectionDefinition<T>): ITestRunner<T>;
    fromEvents(events: Event[]): ITestRunner<T>;
    withDependencies(events: Event[]): ITestRunner<T>;
    fromRawEvents(events: any[]): ITestRunner<T>;
    startWith(initialState: T): ITestRunner<T>;
    stopAt(date: Date): ITestRunner<T>;
    run(): Promise<T>;
}

declare class TestStreamFactory implements IStreamFactory {

    constructor(deserializer: IEventDeserializer);

    from(lastEvent: Date, completions?: Observable<string>, definition?: WhenBlock<any>): Observable<Event>;

    setEvents(events: Event[]);
}

export class TestRunner<T> implements ITestRunner<T> {

    of(constructor: interfaces.Newable<IProjectionDefinition<T>>): ITestRunner<T>;

    fromEvents(events: Event[]): ITestRunner<T>;

    withDependencies(events: Event[]): ITestRunner<T>;

    fromRawEvents(events: any[]): ITestRunner<T>;

    startWith(initialState: T): ITestRunner<T>;

    run(): Promise<T>;

    stopAt(date: Date): ITestRunner<T>;

    dispose(): void;
}

export class TestEnvironment {

    setup(modules?: IModule[]);

    runner<T>(): ITestRunner<T>;
}

export class Event {
    type: string;
    payload: any;
    timestamp: Date;

    constructor(type: string, payload: any, timestamp: Date);
}