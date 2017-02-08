import {Event, IProjectionDefinitionn} from "prettygoat";

interface ITestRunner<T> {
    of(projection: IProjectionDefinition<T>): ITestRunner<T>;
    fromEvents(events: Event[]): ITestRunner<T>;
    fromRawEvents(events: any[]): ITestRunner<T>;
    startWith(initialState: T): ITestRunner<T>;
    stopAt(date:Date):ITestRunner<T>;
    run(): Promise<T>;
}

export default ITestRunner