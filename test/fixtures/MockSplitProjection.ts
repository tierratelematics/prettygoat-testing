import {IProjectionDefinition, IProjection, Projection} from "prettygoat";

@Projection("Split")
export default class MockSplitProjection implements IProjectionDefinition<number> {

    define(): IProjection<number> {
        return {
            name: "Split",
            definition: {
                $init: () => {
                    return 0;
                },
                test: (s, e: any) => {
                    s = s + e.count;
                    return s;
                },
                Dependency: (s, e: any) => {
                    s = s + e.count;
                    return s;
                }
            },
            split: {
                test: (e: any) => e.id
            }
        }
    }

}