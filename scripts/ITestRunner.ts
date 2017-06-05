import {IProjectionDefinition} from "prettygoat";
import {interfaces} from "inversify";
import {IDisposable} from "rx";
import TestEvent from "./TestEvent";

interface ITestRunner<T> extends IDisposable {
    of(constructor: interfaces.Newable<IProjectionDefinition<T>> | IProjectionDefinition<T>): ITestRunner<T>;
    fromEvents(events: TestEvent[]): ITestRunner<T>;
    fromRawEvents(events: any[]): ITestRunner<T>;
    withDependencies(events: TestEvent[]):ITestRunner<T>;
    startWith(initialState: T): ITestRunner<T>;
    stopAt(date:Date):ITestRunner<T>;
    run(): Promise<T>;
}

export default ITestRunner