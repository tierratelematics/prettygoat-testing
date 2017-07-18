import ITestRunner from "./ITestRunner";
import {IModule, PrettyGoatModule} from "prettygoat";
import {Container} from "inversify";
import TestModule from "./TestModule";
import {forEach} from "lodash";

class TestEnvironment {

    private container = new Container();

    setup(modules: IModule[] = []) {
        modules.unshift(new TestModule());
        modules.unshift(new PrettyGoatModule());
        forEach(modules, module => module.modules(this.container));
    }

    runner<T>(): ITestRunner<T> {
        return this.container.get<ITestRunner<T>>("ITestRunner");
    }
}

export default TestEnvironment
