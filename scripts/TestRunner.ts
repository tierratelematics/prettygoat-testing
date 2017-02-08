import ITestRunner from "./ITestRunner";

class TestRunner implements ITestRunner {
    
    of(projection: IProjection<T>): ITestRunner<T> {
        return undefined;
    }

    events(events: Event[]): ITestRunner<T> {
        return undefined;
    }

    rawEvents(events: any[]): ITestRunner<T> {
        return undefined;
    }

    startWith(initialState: T): ITestRunner<T> {
        return undefined;
    }

    run(): T {
        return undefined;
    }

}

export default TestRunner