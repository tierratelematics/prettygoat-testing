import {IReadModelFactory, IWhen, Event} from "prettygoat";
import {Observable} from "rx";

class TestReadModelFactory implements IReadModelFactory {

    asList(): any[] {
        return [];
    }

    publish(event: Event): void {
    }

    from(lastEvent: Date, completions?: Observable<string>, definition?: IWhen<any>): Observable<Event> {
        return Observable.empty<Event>();
    }

}

export default TestReadModelFactory