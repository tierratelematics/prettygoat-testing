import {IStreamFactory, Event, ICassandraDeserializer} from "prettygoat";
import {Observable} from "rx";
import {inject} from "inversify";
import {isString} from "lodash";

class TestStreamFactory implements IStreamFactory {

    private events: Event[] = [];
    private rawEvents: any[] = [];

    constructor(@inject("ICassandraDeserializer") private cassandraDeserializer: ICassandraDeserializer) {

    }

    from(lastEvent: Date, completions?: Observable<string>, definition?: IWhen<any>): Observable<Event> {
        if (!this.events.length && !this.rawEvents.length)
            throw new Error("Cannot run a projection without events");
        let parseRawEvents = !!this.rawEvents.length;
        return Observable
            .from(parseRawEvents ? this.rawEvents : this.events)
            .map(event => {
                if (parseRawEvents)
                    event = this.cassandraDeserializer.toEvent(event);
                if (isString(event.timestamp))
                    event.timestamp = new Date(event.timestamp);
                return event;
            });
    }

    setEvents(events: Event[]) {
        this.events = events;
    }

    setRawEvents(events: any[]) {
        this.rawEvents = events;
    }

}

export default TestStreamFactory