# Rester

**How do you think about Spring Boot?**

**In Node.js & TypeScript!**

> :books: ​See the [full documents](https://github.com/DevinDon/rester-core/tree/master/docs) here.

# Attention

<span style="color: red">**:warning: WARNING: This project is currently in an *UNSTABLE* phase.**</span>

> :loudspeaker: Attention: The **STABLE** version will arrive at 1.0.0

# Installation

This project has released on [NPMJS.COM, @rester/core](https://www.npmjs.com/package/@rester/core).

```shell
npm i --save @rester/core
```

> :dizzy: ​The **Command-Line Interface** will be coming soon. Watch [@rester/cli](https://www.npmjs.com/package/@rester/cli).

# Usage

Use **Rester** just like **Spring Boot**, and easier!

```typescript
import { View, GET, Rester } from '@rester/core';

@View()
class DemoView {

  /** GET http://localhost:8080 */
  @GET('/')
  index() {
    return { hello: 'world' };
  }

}

/** Create a rester server listening on http://localhost:8080. */
const server = new Rester()
  .configViews.add(DemoView).end()
  .listen();
```

> :card_index_dividers: See more [demo](https://github.com/DevinDon/rester-core/blob/master/src/demo) here.

# Feature

> :sparkles: See issue [#4](https://github.com/DevinDon/rester-core/issues/4) for detail.

# Change Log

## 0.10.2 => 0.10.3

- perf(main): add '/' before path

## 0.9.6 => 0.10.0

- refactor: refactor MVC Arch Mode, PR [#25](https://github.com/DevinDon/rester-core/pull/25)
- fix(handler/exception): fix exception handler

> :bookmark_tabs: See [change log](https://github.com/DevinDon/rester-core/blob/master/docs/CHANGELOG.md) for detail.

# Author

IInfinity 夜寒苏, [Email](mailto:I.INF@Outlook.com), [Github](https://github.com/DevinDon), [Home Page (Under construction)](https://blog.don.red).

# License

[THE MIT LICENSE](https://github.com/DevinDon/rester-core/blob/master/LICENSE) for code.

[THE CC-BY-NC-4.0 LICENSE](https://github.com/DevinDon/rester-core/blob/master/docs/LICENSE) for documents.
