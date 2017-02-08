import {Event, IProjection} from "prettygoat";

interface ITestRunner<T> {
    of(projection: IProjection<T>): ITestRunner<T>;
    events(events: Event[]): ITestRunner<T>;
    rawEvents(events: any[]): ITestRunner<T>;
    startWith(initialState: T): ITestRunner<T>;
    run(): T;
}

export default ITestRunner