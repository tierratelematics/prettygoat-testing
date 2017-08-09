import {interfaces} from "inversify";
import {Observable} from "rxjs";
import {ISubscription} from "rxjs/Subscription";
import {
    WhenBlock,
    Event,
    IStreamFactory,
    IEventDeserializer,
    IModule,
    IProjectionDefinition,
    IReadModelDefinition,
    IReadModel,
    IProjection
} from "prettygoat";

export interface ITestRunner<T> extends ISubscription {
    of(constructor: ReadModelOrProjection<T> | interfaces.Newable<ReadModelOrProjectionDef<T>>): ITestRunner<T>;

    fromEvents(events: Event[]): ITestRunner<T>;

    fromRawEvents(events: any[]): ITestRunner<T>;

    startWith(initialState: T): ITestRunner<T>;

    stopAt(date: Date): ITestRunner<T>;

    run(): Promise<T>;
}

export type ReadModelOrProjectionDef<T> = IProjectionDefinition<T> | IReadModelDefinition<T>;

export type ReadModelOrProjection<T> = IProjection<T> | IReadModel<T>;

declare class TestStreamFactory implements IStreamFactory {

    constructor(deserializer: IEventDeserializer);

    from(lastEvent: Date, completions?: Observable<string>, definition?: WhenBlock<any>): Observable<Event>;

    setEvents(events: Event[]);
}

export class TestRunner<T> implements ITestRunner<T> {

    closed: boolean;

    of(constructor: ReadModelOrProjection<T> | interfaces.Newable<ReadModelOrProjectionDef<T>>): ITestRunner<T>;

    fromEvents(events: Event[]): ITestRunner<T>;

    withDependencies(events: Event[]): ITestRunner<T>;

    fromRawEvents(events: any[]): ITestRunner<T>;

    startWith(initialState: T): ITestRunner<T>;

    run(): Promise<T>;

    stopAt(date: Date): ITestRunner<T>;

    unsubscribe(): void;
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
