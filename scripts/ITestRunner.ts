import {IProjectionDefinition, Event, IReadModelDefinition} from "prettygoat";
import {interfaces} from "inversify";
import {ISubscription} from "rxjs/Subscription";

export interface ITestRunner<T> extends ISubscription {
    of(constructor: ReadModelOrProjection<T> | interfaces.Newable<ReadModelOrProjection<T>>): ITestRunner<T>;
    fromEvents(events: Event[]): ITestRunner<T>;
    fromRawEvents(events: any[]): ITestRunner<T>;
    startWith(initialState: T): ITestRunner<T>;
    stopAt(date: Date): ITestRunner<T>;
    run(): Promise<T>;
}

export type ReadModelOrProjection<T> = IProjectionDefinition<T> | IReadModelDefinition<T>;
