import {IEventDeserializer} from "prettygoat";
import {Event} from "prettygoat";

export default class MockEventDeserializer implements IEventDeserializer {
    toEvent(row): Event {
        return null;
    }
}