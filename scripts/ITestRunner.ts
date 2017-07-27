import {IProjectionDefinition, Event} from "prettygoat";
import {interfaces} from "inversify";
import {ISubscription} from "rxjs/Subscription";

interface ITestRunner<T> extends ISubscription {
    of(constructor: interfaces.Newable<IProjectionDefinition<T>> | IProjectionDefinition<T>): ITestRunner<T>;
    fromEvents(events: Event[]): ITestRunner<T>;
    fromRawEvents(events: any[]): ITestRunner<T>;
    startWith(initialState: T): ITestRunner<T>;
    stopAt(date: Date): ITestRunner<T>;
    run(): Promise<T>;
}

export default ITestRunner
