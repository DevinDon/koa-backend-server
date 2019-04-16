# Rester

A RESTful server with db & session support based Koa & TypeScript.

[FULL DOCUMENT IS HERE.](https://github.com/DevinDon/koa-backend-server/blob/master/docs/README.md)

# Attention

<span style="color: red">**WARNING: This project is currently in an *UNSTABLE* phase.**</span>

STABLE version will be 1.0.0 in future.

# Feature

- [ ] support for creating cluster servers
- [x] database support
- [x] redis session support
- [x] static file support
- [x] CORS router support
- [x] RESTful api support
- [x] local session storage by [Redion](https://github.com/DevinDon/redion)
- [ ] **Refactor project by DI & AOP, like Angular.**

# Change log

> [See Full Change Log on GitHub.](https://github.com/DevinDon/koa-backend-server/blob/master/docs/CHANGELOG.md)

## 0.7.3 => 0.7.4

- fix: fix database connection exception

## 0.6.0 => 0.7.0

- feat: add development / production mode in Server Config
- refactor: refactor namespace / module
- perf: show middleware name when use
- fix: fix some bugs & update package

# Installation

> *This project has released on [NPMJS.COM](https://www.npmjs.com/package/@iinfinity/rester).*

```shell
npm i --save @iinfinity/rester
```

**DO NOT install koa and other dependencies AGAIN!**

# Usage

## Quick Start

### 1. Install Rester

```shell
npm install --save @iinfinity/rester
```

### 2. Create index.ts file

And fill it with following code, see [source code](https://github.com/DevinDon/rester/blob/master/src/demo/simple/index.ts) on GitHub.

```typescript
import { RouterPaths, Rester, Option } from '@iinfinity/rester';

/** Router path. */
const GET: RouterPaths = {
  '/ get index': {
    path: '/',
    ware: async (c, next) => {
      next();
      c.body = 'Hello, world!';
    }
  }
};

/** Simple option. */
const option: Option = {
  router: {
    paths: { GET }
  }
};

const server = new Rester(option);

server.listen();
```

And then, run `ts-node index.ts` or `tsc && node dist` to start Rester.

Now, open your browser and enter `localhost:8080`, you will see `Hello, world!` on your screen.

See [Full Document](https://github.com/DevinDon/rester/tree/master/docs) for more help.

## Example

- [APP template with client Angular & server Rester *@latest*](https://github.com/DevinDon/app-template)
- [Blog Server *@0.5.0* (Named *koa-backend-server*)](https://github.com/DevinDon/blog-2018)
- [Demo](https://github.com/DevinDon/rester/tree/master/src/demo)

## **Advanced usage**

### Use your own middlewares.

```typescript
server.use({
  'Middleware name': middleware,
  'another one': ware,
  'again': ware3,
  /** ... */
});
```

# Thanks

[Koa: Expressive HTTP middleware framework for Node.JS.](https://www.npmjs.com/package/koa)

[Koa Body: A full-featured koa body parser middleware.](https://www.npmjs.com/package/koa-body)

[Koa Router: Router middleware for koa.](https://www.npmjs.com/package/koa-router)

[Koa Static: Koa static file serving middleware, wrapper for koa-send.](https://www.npmjs.com/package/koa-static)

[Logger: TypeScript / JavaScript logger.](https://www.npmjs.com/package/@iinfinity/logger)

[Redion: Session with redis.](https://www.npmjs.com/package/@iinfinity/redion)

[TypeORM: Cross-platform ORM framework.](https://www.npmjs.com/package/typeorm)

# License

[THE MIT LICENSE](https://github.com/DevinDon/rester/blob/master/LICENSE)

# Author

IInfinity, [Email](mailto:I.INF@Outlook.com), [Github](https://www.npmjs.com/package/@iinfinity/rester), [Home Page (Under construction)](https://don.red).
