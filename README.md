# Rester

**How do you think about Spring Boot?**

**In Node.js & TypeScript!**

> 📚 ​See the [full documents](https://github.com/DevinDon/rester-core/tree/master/docs) here.

# Attention

<span style="color: red">**:warning: WARNING: This project is currently in an *UNSTABLE* phase.**</span>

> 📢 Attention: The **STABLE** version will arrive at 1.0.0

# Installation

This project has released on [NPMJS.COM, @rester/core](https://www.npmjs.com/package/@rester/core).

```shell
npm i --save @rester/core
```

> 💫 ​The **Command-Line Interface** will be coming soon. Watch [@rester/cli](https://www.npmjs.com/package/@rester/cli).

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

> 🗂 See more [demo](https://github.com/DevinDon/rester-core/blob/master/src/demo) here.

# Feature

> ✨ See issue [#4](https://github.com/DevinDon/rester-core/issues/4) for detail.

# Change Log

> 📄 See [change log](https://github.com/DevinDon/rester-core/blob/master/docs/CHANGELOG.md) for detail.

## 0.10.10 => 0.10.11

- fix(handler/exception): exception should log detail, with stack and other information, ISSUE [28](https://github.com/DevinDon/rester-core/issues/28)

## 0.10.9 => 0.10.10

- chore(npm): remove optional deps

## 0.10.8 => 0.10.9

- perf(handler/parameter): when content length > 10m, user should parse it by self

## 0.10.7 => 0.10.8

- fix(handler/exception): exception content should be stringify

## 0.10.6 => 0.10.7

- fix(handler/schema): schema should not overwrite existing request headers

## 0.10.5 => 0.10.6

- feat(rester): load config & save to rester.zone

## 0.10.3 => 0.10.5

- feat(handler/parameter): add body parser

## 0.10.2 => 0.10.3

- perf(main): add '/' before path

## 0.10.0 => 0.10.2

- perf(handler/exception): add warn & error message when server exception

## 0.9.6 => 0.10.0

- refactor: refactor MVC Arch Mode, PR [#25](https://github.com/DevinDon/rester-core/pull/25)
- fix(handler/exception): fix exception handler

# Author

IInfinity 夜寒苏, [Email](mailto:I.INF@Outlook.com), [Github](https://github.com/DevinDon), [Home Page (Under construction)](https://blog.don.red).

# License

[THE MIT LICENSE](https://github.com/DevinDon/rester-core/blob/master/LICENSE) for code.

[THE CC-BY-NC-4.0 LICENSE](https://github.com/DevinDon/rester-core/blob/master/docs/LICENSE) for documents.
