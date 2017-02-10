import {Subject, IObserver} from "rx";
import {Event, IProjectionRunner, ProjectionStats, Snapshot, Dictionary} from "prettygoat";

class MockProjectionRunner<T> implements IProjectionRunner<T> {
    state:T;
    stats = new ProjectionStats();

    constructor() {

    }

    notifications() {
        return null;
    }

    run(snapshot?:Snapshot<T|Dictionary<T>>):void {

    }

    stop():void {
    }

    pause():void {
    }

    resume():void {
    }

    dispose():void {

    }

}

export default MockProjectionRunner