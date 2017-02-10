import {IProjection, IProjectionRunner, IProjectionRunnerFactory} from "prettygoat";

export default class MockProjectionRunnerFactory implements IProjectionRunnerFactory {

    create<T>(projection: IProjection<T>): IProjectionRunner<T> {
        return undefined;
    }

}