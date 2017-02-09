import {Event, IProjectionDefinition} from "prettygoat";
import {interfaces} from "inversify";

interface ITestRunner<T> {
    of(constructor:interfaces.Newable<IProjectionDefinition<T>>): ITestRunner<T>;
    fromEvents(events: Event[]): ITestRunner<T>;
    fromRawEvents(events: any[]): ITestRunner<T>;
    startWith(initialState: T): ITestRunner<T>;
    stopAt(date:Date):ITestRunner<T>;
    run(): Promise<T>;
}

export default ITestRunner