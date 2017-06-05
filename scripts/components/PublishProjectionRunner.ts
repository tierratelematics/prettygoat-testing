import {IMatcher, IProjection, IReadModelFactory, IProjectionStreamGenerator, ProjectionRunner} from "prettygoat";

export default class PublishProjectionRunner<T> extends ProjectionRunner<T> {

    constructor(protected projection: IProjection<T>, protected stream: IProjectionStreamGenerator, protected matcher: IMatcher,
                protected readModelFactory: IReadModelFactory) {
        super(projection, stream, matcher, readModelFactory);
    }


    protected subscribeToStateChanges() {

    }
}
