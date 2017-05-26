import {injectable, inject} from "inversify";
import {
    IDateRetriever,
    ITickScheduler,
    Dictionary,
    Matcher,
    IReadModelFactory,
    SplitProjectionRunner,
    IStreamFactory,
    IProjection,
    ProjectionRunner,
    IProjectionRunner,
    IProjectionRunnerFactory
} from "prettygoat";
import PublishProjectionRunner from "./PublishProjectionRunner";

@injectable()
class TestProjectionRunnerFactory implements IProjectionRunnerFactory {

    constructor(@inject("IStreamFactory") private streamFactory: IStreamFactory,
                @inject("IReadModelFactory") private readModelFactory: IReadModelFactory,
                @inject("IProjectionRunnerHolder") private holder: Dictionary<IProjectionRunner<any>>,
                @inject("ITickSchedulerHolder") private tickSchedulerHolder: Dictionary<ITickScheduler>,
                @inject("IDateRetriever") private dateRetriever: IDateRetriever) {

    }

    create<T>(projection: IProjection<T>): IProjectionRunner<T> {
        let definitionMatcher = new Matcher(projection.definition);
        let projectionRunner: IProjectionRunner<T>;
        if (!projection.split)
            projectionRunner = new PublishProjectionRunner<T>(projection, this.streamFactory, definitionMatcher, this.readModelFactory,
                this.tickSchedulerHolder[projection.name], this.dateRetriever);
        else
            projectionRunner = new SplitProjectionRunner<T>(projection, this.streamFactory, definitionMatcher,
                new Matcher(projection.split), this.readModelFactory, this.tickSchedulerHolder[projection.name],
                this.dateRetriever);
        this.holder[projection.name] = projectionRunner;
        return projectionRunner;
    }

}

export default TestProjectionRunnerFactory