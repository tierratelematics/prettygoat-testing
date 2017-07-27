import {IProjectionRunner, ProjectionStats, Snapshot} from "prettygoat";

class MockProjectionRunner<T> implements IProjectionRunner<T> {
    state: T;
    stats = new ProjectionStats();
    closed = false;

    constructor() {

    }

    notifications() {
        return null;
    }

    run(snapshot?: Snapshot<T>): void {

    }

    stop(): void {
    }

    unsubscribe(): void {

    }

}

export default MockProjectionRunner
