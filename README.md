# Rester

**How do you think about Spring Boot?**

**In Node.js & TypeScript!**

> :books: ​See the [full documents](https://github.com/DevinDon/rester/tree/master/docs) here.

# Attention

<span style="color: red">**:warning: WARNING: This project is currently in an *UNSTABLE* phase.**</span>

> :loudspeaker: Attention: The **STABLE** version will arrive at 1.0.0.

# Installation

This project has released on [NPMJS.COM, @rester/core](https://www.npmjs.com/package/@rester/core).

```shell
npm i --save @rester/core
```

> :dizzy: ​The **Command-Line Interface** will be coming soon. Watch [@rester/cli](https://www.npmjs.com/package/@rester/cli).

# Usage

Use **Rester** just like **Spring Boot**, and easier!

```typescript
import { Controller, GET, Rester } from '@rester/core';

@Controller()
class DemoController {

  /** GET http://localhost:8080 */
  @GET('/')
  index() {
    return { hello: 'world' };
  }

}

/** Create a rester server listening on http://localhost:8080. */
const server = new Rester()
  .configControllers.add(DemoController).end()
  .listen();
```

> :card_index_dividers: See more [demo](https://github.com/DevinDon/rester/blob/master/src/demo) here.

# Feature

> :sparkles: See [issue #4](https://github.com/DevinDon/rester/issues/4) for detail.

# Change Log

## 0.9.5 => 0.9.6

- perf(handler): configurable exception handler, PR [#24](https://github.com/DevinDon/rester/pull/24), ISSUE [#23](https://github.com/DevinDon/rester/issues/23)

## 0.8.2 => 0.9.0

- feat(rester): add chained call methods, PR [#6](https://github.com/DevinDon/rester/pull/6), ISSUE [#11](https://github.com/DevinDon/rester/issues/11)
- feat(handler/base): configurable handler support, PR [#10](https://github.com/DevinDon/rester/pull/10), ISSUE [#9](https://github.com/DevinDon/rester/issues/9)
- fix(decorator/mapping): fix the error that multi-mapping not works, PR [#16](https://github.com/DevinDon/rester/pull/16), ISSUE [#13](https://github.com/DevinDon/rester/issues/13)
- feat(decorator/handler): multi-handler support, PR [#17](https://github.com/DevinDon/rester/pull/17), ISSUE [#14](https://github.com/DevinDon/rester/issues/14)
- feat(handler/cors): CORS support, PR [#19](https://github.com/DevinDon/rester/pull/19), ISSUE [#15](https://github.com/DevinDon/rester/issues/15)
- feat(rester): JSON config file support, ISSUE [#20](https://github.com/DevinDon/rester/issues/20)
- perf: some optimizations, PR [#19](https://github.com/DevinDon/rester/pull/19)

> :bookmark_tabs: See [change log](https://github.com/DevinDon/koa-backend-server/blob/master/docs/CHANGELOG.md) for detail.

# Author

IInfinity 夜寒苏, [Email](mailto:I.INF@Outlook.com), [Github](https://github.com/DevinDon), [Home Page (Under construction)](https://don.red).

# License

[THE MIT LICENSE](https://github.com/DevinDon/rester/blob/master/LICENSE) for code.

[THE CC-BY-NC-4.0 LICENSE](https://github.com/DevinDon/rester/blob/master/docs/LICENSE) for documents.
