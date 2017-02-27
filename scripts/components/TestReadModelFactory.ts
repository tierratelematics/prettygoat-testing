import {IReadModelFactory, IWhen, Event} from "prettygoat";
import {Observable} from "rx";
import {injectable} from "inversify";

@injectable()
class TestReadModelFactory implements IReadModelFactory {

    private readModels: Event[] = [];

    setReadModels(readModels: Event[]) {
        this.readModels = readModels;
    }

    asList(): any[] {
        return this.readModels;
    }

    publish(event: Event): void {

    }

    from(lastEvent: Date, completions?: Observable<string>, definition?: IWhen<any>): Observable<Event> {
        return Observable.empty<Event>();
    }

}

export default TestReadModelFactory