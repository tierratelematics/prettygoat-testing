import {IMatcher, IProjection, IReadModelFactory, IStreamFactory, IDateRetriever, ProjectionRunner} from "prettygoat";

export default class PublishProjectionRunner<T> extends ProjectionRunner<T> {

    constructor(protected projection: IProjection<T>, protected stream: IStreamFactory, protected matcher: IMatcher, protected readModelFactory: IReadModelFactory,
                protected tickScheduler: IStreamFactory, protected dateRetriever: IDateRetriever) {
        super(projection, stream, matcher, readModelFactory, tickScheduler, dateRetriever);
    }


    protected subscribeToStateChanges() {

    }
}
