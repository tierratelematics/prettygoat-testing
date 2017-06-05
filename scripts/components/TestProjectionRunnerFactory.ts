import {injectable, inject} from "inversify";
import {
    Dictionary,
    Matcher,
    IReadModelFactory,
    SplitProjectionRunner,
    IProjection,
    IProjectionRunner,
    IProjectionRunnerFactory,
    IProjectionStreamGenerator,
} from "prettygoat";
import PublishProjectionRunner from "./PublishProjectionRunner";

@injectable()
class TestProjectionRunnerFactory implements IProjectionRunnerFactory {

    constructor(@inject("IProjectionStreamGenerator") private streamGenerator: IProjectionStreamGenerator,
                @inject("IReadModelFactory") private readModelFactory: IReadModelFactory,
                @inject("IProjectionRunnerHolder") private holder: Dictionary<IProjectionRunner<any>>) {

    }

    create<T>(projection: IProjection<T>): IProjectionRunner<T> {
        let definitionMatcher = new Matcher(projection.definition);
        let projectionRunner: IProjectionRunner<T>;
        if (!projection.split)
            projectionRunner = new PublishProjectionRunner<T>(projection, this.streamGenerator, definitionMatcher, this.readModelFactory);
        else
            projectionRunner = new SplitProjectionRunner<T>(projection, this.streamGenerator, definitionMatcher,
                new Matcher(projection.split), this.readModelFactory);
        this.holder[projection.name] = projectionRunner;
        return projectionRunner;
    }

}

export default TestProjectionRunnerFactory