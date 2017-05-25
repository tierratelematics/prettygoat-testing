import {IModule, IServiceLocator, IProjectionRegistry} from "prettygoat";
import {interfaces} from "inversify";
import TestDateRetriever from "./components/TestDateRetriever";
import TestStreamFactory from "./components/TestStreamFactory";
import TestReadModelFactory from "./components/TestReadModelFactory";
import TestRunner from "./TestRunner";
import ITestRunner from "./ITestRunner";

class TestModule implements IModule {

    modules = (container: interfaces.Container) => {
        container.rebind("IDateRetriever").to(TestDateRetriever).inSingletonScope();
        container.rebind("IReadModelFactory").to(TestReadModelFactory).inSingletonScope();
        container.bind<ITestRunner<any>>("ITestRunner").to(TestRunner);
        try {
            container.rebind("IStreamFactory").to(TestStreamFactory).inSingletonScope();
        } catch (error) {
            container.bind("IStreamFactory").to(TestStreamFactory).inSingletonScope();
        }
    };

    register(registry: IProjectionRegistry, serviceLocator?: IServiceLocator, overrides?: any): void {

    }

}

export default TestModule