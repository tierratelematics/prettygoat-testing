import {IDateRetriever} from "prettygoat";
import {injectable} from "inversify";

//Needed to force processing the events as historical
@injectable()
class TestDateRetriever implements IDateRetriever {

    getDate(): Date {
        return new Date(Number.MAX_VALUE);
    }
}

export default TestDateRetriever