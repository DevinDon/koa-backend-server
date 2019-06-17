# Rester

**How do you think about Spring Boot?**

**In Node.js & TypeScript!**

# Attention

<span style="color: red">**:warning: WARNING: This project is currently in an *UNSTABLE* phase.**</span>

> :loudspeaker: Attention: The **STABLE** version will arrive at 1.0.0.

# Installation

This project has released on [NPMJS.COM, @rester/rester](https://www.npmjs.com/package/@rester/rester).

```shell
npm i --save @rester/rester
```

> :loudspeaker: ​The **Command-Line Interface** will be coming soon. Watch [@rester/cli](https://www.npmjs.com/package/@rester/cli).

# Usage

Use **Rester** just like **Spring Boot**.

## Quick Start

```typescript
import { Controller, GET, Rester } from '@rester/rester';

@Controller()
class DemoController {

  @GET('/')
  index() {
    return { hello: 'world' };
  }

}

const server = new Rester()
  .configControllers.add(DemoController).end()
  .listen();
```

## Full Usage

See the [full usage](https://github.com/DevinDon/rester/blob/master/docs/README.md) here.

> :card_index_dividers: See more [demo](https://github.com/DevinDon/rester/blob/master/src/demo) here.

# Feature

## Decorator support

Coding like Spring Boot!

### @Controller

Use this decorator to mark the controller.

### @Method

Use these decorators to mark the methods mapping.

Such as `@GET('/path')`, `@POST('/where')`, `@PUT('/put')` and so on.

### @Parameter

Use these decorators to mark the injectable parameters.

Such as `@PathQuery('key')`, `@PathVariable('key')`, `@RequestBody('application/json')`, `@RequestHeader('header')` and so on.

### @Service

Just like its name.

### @Handler

Set the hander(like middleware) for the controllers & method mappings.

> :sparkles: See [issue #4](https://github.com/DevinDon/rester/issues/4) for detail.

# Change log

> :bookmark_tabs: See [change log](https://github.com/DevinDon/koa-backend-server/blob/master/docs/CHANGELOG.md) for detail.

# Author

IInfinity 夜寒苏, [Email](mailto:I.INF@Outlook.com), [Github](https://github.com/DevinDon), [Home Page (Under construction)](https://don.red).

# License

[THE MIT LICENSE](https://github.com/DevinDon/rester/blob/master/LICENSE) for code.

[THE CC-BY-NC-4.0 LICENSE](https://github.com/DevinDon/rester/blob/master/docs/LICENSE) for documents.
