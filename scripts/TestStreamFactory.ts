import {IStreamFactory, Event, ProjectionQuery, IIdempotenceFilter} from "prettygoat";
import {Observable} from "rxjs";
import {injectable} from "inversify";
import {isString} from "lodash";

@injectable()
class TestStreamFactory implements IStreamFactory {

    private events: Event[] = [];

    from(query?: ProjectionQuery, idempotence?: IIdempotenceFilter, backpressureGate?: Observable<string>): Observable<Event> {
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
