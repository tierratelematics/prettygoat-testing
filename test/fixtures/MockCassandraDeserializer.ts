import {ICassandraDeserializer} from "prettygoat";
import {Event} from "prettygoat";

export default class MockCassandraDeserializer implements ICassandraDeserializer {
    toEvent(row): Event {
        return null;
    }
}