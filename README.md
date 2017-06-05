# Prettygoat-testing

Unit test prettygoat's projections without Cassandra.

## Installation

`
$ npm install prettygoat-testing
`

## Usage

```typescript
import {TestEnvironment, ITestRunner} from "prettygoat-testing";
import {Projection} from "./Projection";

describe("Given a projection", () => {

    let environment: TestEnvironment;
    let runner: ITestRunner<T>;

    before(() => {
        environment = new TestEnvironment();
        environment.setup();
    });

    beforeEach(() => {
        runner = environment.runner();
    });

    context("when something happens", () => {
        it("should do this", async () => {
            const events = require("./fixtures/events.json");
            let state = await runner
                .of(Projection) // Or pass an already newed projection
                .fromEvents(events)
                .stopAt(new Date(400))
                .run();
            //assert something
        });
    });
});
```

## License

Copyright 2016 Tierra SpA

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
