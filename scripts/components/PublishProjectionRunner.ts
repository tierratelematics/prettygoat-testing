import {IMatcher, IProjection, IReadModelFactory, IProjectionStreamGenerator, ProjectionRunner} from "prettygoat";
import {ISubject} from "rx";

export default class PublishProjectionRunner<T> extends ProjectionRunner<T> {

    constructor(protected projection: IProjection<T>, protected stream: IProjectionStreamGenerator, protected matcher: IMatcher,
                protected readModelFactory: IReadModelFactory, realtimeNotifier: ISubject<string>) {
        super(projection, stream, matcher, readModelFactory, realtimeNotifier);
    }


    protected subscribeToStateChanges() {

    }
}
