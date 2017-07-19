import {IStreamFactory, Event, WhenBlock} from "prettygoat";
import {Observable} from "rxjs";
import {injectable} from "inversify";
import {isString} from "lodash";

@injectable()
class TestStreamFactory implements IStreamFactory {

    private events: Event[] = [];

    from(lastEvent: Date, completions?: Observable<string>, definition?: WhenBlock<any>): Observable<Event> {
        return Observable
            .from(this.events)
            .map(event => {
                if (isString(event.timestamp))
                    event.timestamp = new Date(event.timestamp);
                return event;
            });
    }

    setEvents(events: Event[]) {
        this.events = events;
    }

}

export default TestStreamFactory
