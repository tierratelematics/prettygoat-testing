import {IReadModelDefinition, IReadModel} from "prettygoat";

export default class MockReadmodel implements IReadModelDefinition<number> {

    define(): IReadModel<number> {
        return {
            name: "Mock",
            definition: {
                $init: () => {
                    return 10;
                },
                test: (s, e: number) => {
                    s = s + e;
                    return s;
                }
            }
        };
    }
}
