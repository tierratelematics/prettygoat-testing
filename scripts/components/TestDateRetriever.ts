import {IDateRetriever} from "prettygoat";

//Needed to force processing the events as historical
class TestDateRetriever implements IDateRetriever {

    getDate(): Date {
        return new Date(Number.MAX_VALUE);
    }
}

export default TestDateRetriever