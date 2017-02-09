import ITestRunner from "./ITestRunner";
import {IModule, PrettyGoatModule} from "prettygoat";
import {Container} from "inversify";
import TestModule from "./TestModule";
import {forEach} from "lodash";

class TestEnvironment {

    private container = new Container();

    setup(modules: IModule[] = []) {
        modules.unshift(new PrettyGoatModule());
        modules.unshift(new TestModule());
        forEach(modules => module.modules(this.container));
    }

    runner(): ITestRunner {
        return this.container.get<ITestRunner>("ITestRunner");
    }
}

export default TestEnvironment