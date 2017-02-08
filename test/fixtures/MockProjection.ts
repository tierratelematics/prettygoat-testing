import {IProjectionDefinition, IProjection, Projection} from "prettygoat";

@Projection("Mock")
export default class MockProjection implements IProjectionDefinition<number> {

    define(): IProjection<number> {
        return {
            name: "Mock",
            definition: {
                $init: () => {
                    return 10;
                },
                test: (s, e) => {
                    s = s + e;
                    return s;
                },
                "testRaw": (s, e) => {
                    s = s + e.count;
                    return s;
                }
            }
        }
    }

}