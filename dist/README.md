# Rester

A RESTful server with db & session support based Koa2 & TypeScript.

# Version

**WARNING: This project is currently in an *UNSTABLE* version.**

**WARNING: This project is currently in an *UNSTABLE* version.**

**WARNING: This project is currently in an *UNSTABLE* version.**

# Feature

- [ ] feat: support for creating cluster servers
- [x] feat: database support
- [x] feat: redis session support
- [x] feat: static file support
- [x] feat: CORS router support
- [x] feat: RESTful api support

# Change log

[Full Change Log](https://github.com/DevinDon/koa-backend-server/blob/master/dist/CHANGELOG.md)

## 0.5.7 => 0.6.0

- perf: deprecated api version, use accept header to instead
- feat: use node-color-log to be default logger
- fix: fix message output when database connection failed
- fix: catch redis connection failed
- refactor: replace the project name with 'rester'

# Installation

> *Rester on [NPM](https://www.npmjs.com/package/@iinfinity/rester)*

```shell
npm i --save @iinfinity/rester
```

> **DO NOT install koa and other dependencies AGAIN!**

# Usage

> See example:
>
> - [APP template with client Angular & server Rester](https://github.com/DevinDon/app-template)
>
> - [Blog Server](https://github.com/DevinDon/blog-2018)

## **Full config**

*It will create a HTTP server which is listening on port 8080.*

```typescript
import { Server } from '@iinfinity/rester';

const server = new Server({
  address: {
    portocol: 'HTTP', // Optional, HTTP, HTTPS or HTTP2.
    host: '0.0.0.0', // Optional, default to 0.0.0.0.
    port: 8080, // Optional, default to 8080.
    ssl: {cert: 'CERT', key: 'KEY'} // Required if portocol is HTTP2 or HTTPS.
  },
  database: { // If undefined, it will disable database connection
    name: 'default',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'database',
    username: 'username',
    password: 'password',
    synchronize: true, // auto generate database table (or document), but you may lost all data of this database
    logging: true, // log all query statements
    entities: ['somewhere/entity/**/*.entity.ts'] // your database table(entity)
  },
  router: { // If undefined, it will disable koa router.
    paths: { // router paths
      POST: {
        'index': {
          path: '/',
          ware: async (c, next) => {
            c.session.data = c.request.body;
            c.body = {
              status: Boolean(c.session),
              data: c.session
            };
            await User.insert({
              name: 'test',
              password: 'password',
              disable: false,
              value: 100
            });
            await next();
          }
        }
      }
    },
    static: { // Static files path.
      path: 'test/html/'
    }
  },
  session: { // If undefined, it will disable redisession.
    domain: 'your.domain',
    httpOnly: true,
    maxAge: 3600, // expire time, second
    name: 'session.id', // cookie key name
    redis: { // redis server
      host: 'your.redis.address',
      port: 6379
    },
    secert: ['your', 'secert', 'keys']
  }
});

// Start listening.
server.listen();
```

## **Step by step**

### 0. Know about the [interface KBSConfig](https://github.com/DevinDon/koa-backend-server/blob/master/src/type/server.ts).

```typescript
/** KBS config. */
export interface KBSConfig {
  /** KBS address. */
  address: KBSAddress;
  /** KBS database connection, if undefined it will disable the typeorm connection. */
  database?: KBSDatabase;
  /** KBS router, if undefined it will disable the koa router. */
  router?: KBSRouter;
  /** KBS session, if undefined it will disable the koa session. */
  session?: Options;
}
```

### 1. Set your address information.

> **Use [*KBSAddress*](https://github.com/DevinDon/koa-backend-server/blob/master/dist/type/server.d.ts) to configure your address info.**

```typescript
const address: KBSAddress = { // optional, default to http://0.0.0.0:8080
  portocol: 'HTTP', // optional, HTTP, HTTPS or HTTP2
  host: '0.0.0.0', // optional, default to 0.0.0.0
  port: 8080, // optional, default to 8080
  ssl: {cert: 'CERT', key: 'KEY'} // required if portocol is HTTPS or HTTP2
};
```

> **Or use [*server.config.json*](https://github.com/DevinDon/koa-backend-server/blob/master/server.config.json) to do this.**

```json
{
  "address": {
    "portocol": "HTTP",
    "host": "0.0.0.0",
    "port": 8080,
    "ssl": {
      "cert": "CERT content here if HTTP2/S",
      "key": "KEY content here if HTTP2/S"
    }
  }
}
```

*It will cover KBSDatabase config.*

### 2. (Optional) Connect database via [TypeORM](https://www.npmjs.com/package/typeorm).

> **Use [*KBSDatabase*](https://github.com/DevinDon/koa-backend-server/blob/master/dist/type/server.d.ts) to create connection.**

```typescript
const database: KBSDatabase = { // If undefined, it will disable database connection
  name: 'default',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'database',
  username: 'username',
  password: 'password',
  synchronize: true, // auto generate database table (or document), but you may lost all data of this database
  logging: true, // log all query statements
  entities: ['somewhere/entity/**/*.entity.ts'] // your database table(entity)
};
```

> **Or use [*server.config.json*](https://github.com/DevinDon/koa-backend-server/blob/master/server.config.json) to do this.**

```json
{
  "database": {
    "type": "mysql",
    "host": "your.database.host",
    "port": 3306,
    "username": "username",
    "password": "password",
    "database": "database",
    "synchronize": true,
    "logging": true,
    "entities": [
      "test/entity/**/*.entity.ts"
    ],
    "migrations": [],
    "subscribers": []
  }
}
```

*It will cover KBSDatabase config.*

### 3. (Optional but **important**) Set router paths.

> **Here is the [*router path interface*](https://github.com/DevinDon/koa-backend-server/blob/master/src/type/router.ts).**

```typescript
interface RouterPaths {
  [index: string]: {
    path: string | RegExp | (string | RegExp)[];
    ware: any;
    cors?: CORS;
    withoutPrefix: boolean;
  };
}
```

> **And the post path looks like this**.

```typescript
// post/index.ts
import { AMiddleware, now, RouterPaths } from '@iinfinity/rester';
import { User } from '../entity';
import test from './test';

const index: AMiddleware = async (c, next) => {
  const request = c.request.body;
  const insert = await User.insert({ name: now(), password: 'any' });
  const data = await User.find();
  c.session.user = data;
  c.body = {
    status: true,
    data
  };
  await next();
};

export const postPaths: RouterPaths = {
  '/test': {
    path: '/test',
    ware: test,
    cors: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': ['POST', 'OPTIONS', 'GET'],
      'Access-Control-Allow-Origin': '*'
    }
  },
  'all': {
    path: /\/.*/,
    ware: index,
    withoutPrefix: true
  }
};

export default postPaths;
```

> **Don't forget to define the [*KBSRouter*](https://github.com/DevinDon/koa-backend-server/blob/master/src/type/router.ts).**

```typescript
const router: KBSRouter = { // if undefined, it will disable koa router
  paths: { // router paths
    POST: postPaths
  },
  static: { // static files dir, without version prefix
    path: 'static/files/dir',
    options: { /* Some options. */ }
  }
};
```

> **The same way to use [*server.config.json*](https://github.com/DevinDon/koa-backend-server/blob/master/server.config.json) to do this.**

### 4. (Optional) Config your session options.

> **Use [*KBSSession*](https://github.com/DevinDon/koa-backend-server/blob/master/dist/type/server.d.ts) to do this.**

```typescript
const session: KBSSession = { // If undefined, it will disable redisession.
  domain: 'your.domain',
  httpOnly: true,
  maxAge: 3600, // expire time, second
  name: 'session.id', // cookie key name
  redis: { // redis server
    host: 'your.redis.address',
    port: 6379
  },
  secert: ['your', 'secert', 'keys']
};
```

> **The same way to use [*server.config.json*](https://github.com/DevinDon/koa-backend-server/blob/master/server.config.json) to do this.**

### 5. And now, it looks like this.

> **Enter point: [*test/index.ts*](https://github.com/DevinDon/koa-backend-server/blob/master/test/index.ts)**

```typescript
import { KBSAddress, KBSDatabase, KBSRouter, KBSSession, Server } from '@iinfinity/rester';
import postPaths from './post';

const address: KBSAddress = { // optional, default to http://0.0.0.0:8080
  portocol: 'HTTP', // optional, HTTP, HTTPS or HTTP2
  host: '0.0.0.0', // optional, default to 0.0.0.0
  port: 8080, // optional, default to 8080
  ssl: {cert: 'CERT', key: 'KEY'} // required if portocol is HTTPS or HTTP2
};

const database: KBSDatabase = { // If undefined, it will disable database connection
  name: 'default',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'database',
  username: 'username',
  password: 'password',
  synchronize: true, // auto generate database table (or document), but you may lost all data of this database
  logging: true, // log all query statements
  entities: ['somewhere/entity/**/*.entity.ts'] // your database table(entity)
};

const router: KBSRouter = { // if undefined, it will disable koa router
  paths: { // router paths
    POST: postPaths
  },
  static: { // static files dir, without version prefix
    path: 'static/files/dir',
    options: { /* Some options. */ }
  }
};

const session: KBSSession = { // If undefined, it will disable redisession.
  domain: 'your.domain',
  httpOnly: true,
  maxAge: 3600, // expire time, second
  name: 'session.id', // cookie key name
  redis: { // redis server
    host: 'your.redis.address',
    port: 6379
  },
  secert: ['your', 'secert', 'keys']
};

const server: Server = new Server({address, database, router, session});

server.listen();
```

> **See the [*Work tree*](https://github.com/DevinDon/koa-backend-server/).**

```text
┏━ src/
┃   ┣━ entity/
┃   ┃   ┣━ index.ts
┃   ┃   ┗━ user.entity.ts
┃   ┣━ post/
┃   ┃   ┃━ index.ts
┃   ┃   ┗━ test.ts
┃   ┗━ index.ts
┣━ .gitignore
┣━ LICENSE
┣━ package-lock.json
┣━ package.json
┣━ README.md
┣━ tsconfig.json
┗━ tslint.json
```

## **Advanced usage**

### Use your own middlewares.

```typescript
server.use(middlewareA, middlewareB, middlewareC, /* ... */);
```

### Some others

Emmm, maybe later?

# Thanks

[Koa](https://www.npmjs.com/package/koa)

[Koa Body](https://www.npmjs.com/package/koa-body)

[Koa Router](https://www.npmjs.com/package/koa-router)

[Koa Session](https://www.npmjs.com/package/koa-session)

[TypeORM](https://www.npmjs.com/package/typeorm)

# License

[MIT License](LICENSE)

# Author

IInfinity, [Email](mailto:I.INF@Outlook.com), [Github](https://github.com/devindon/koa-backend-server), [Home Page (Under construction)](https://don.red).
