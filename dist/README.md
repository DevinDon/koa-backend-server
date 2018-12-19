# Koa Backend Server

[![NPM](https://nodei.co/npm/koa-backend-server.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/koa-backend-server/)

KBS, Koa Backend Server with **TypeScript**.

## Version

**WARNING: This project is currently in an *UNSTABLE* version.**

**WARNING: This project is currently in an *UNSTABLE* version.**

**WARNING: This project is currently in an *UNSTABLE* version.**

## Change log

[Full Change Log](https://github.com/DevinDon/koa-backend-server/blob/master/dist/CHANGELOG.md)

### 0.3.4 => 0.3.5

- Add types declare into dependencies so that you don't need to install them by yourself.

### 0.2.4 => 0.3.0

- Rewrite interface KBSConfig.
- Rewrite interface RouterPaths.
  - Add regular expression support.
  - Add CORS, Cross-origin resource sharing support.
  - Optimized loadPaths method.
- Use a separate file to define interfaces or types.

## Installation

- *This package*

```shell
npm i --save koa-backend-server
```

- *Development dependencies*

```shell
npm i --save-dev @types/node @types/koa @types/koa-router @types/koa-session typescript ts-node
```

- **DO NOT install koa again!**

## Usage

### **Quick start**

*It will create a HTTP server which is listening on port 80.*

```typescript
import { Server } from 'koa-backend-server';
import postPaths from './post';

const server = new Server({
  address: {
    portocol: 'HTTP', // required, HTTP, HTTPS or HTTP2
    host: '0.0.0.0', // optional, default to 0.0.0.0
    port: 80, // optional, default to 80
    // ssl: {cert: 'CERT', key: 'KEY'} // required if portocol is HTTPS or HTTP2
  },
  database: { // if undefined, it will disable database connection
    ormconfig: true, // if true, it will use ormconfig.json to connect database, and the connection options will be ignore
    options: {
      name: 'default',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'database',
      username: 'username',
      password: 'password',
      synchronize: true, // auto generate database table (or document), but you may lost all data of this database
      logging: true, // log all query statements
      entities: [/** your own entities */]
    }
  },
  router: { // if undefined, it will disable koa router
    paths: { // router paths
      POST: postPaths
    },
    static: { // static files dir, without version prefix
      path: 'static/files/dir',
      options: { /* Some options. */ }
    },
    version: 'v1' // API version, the prefix of all paths
  },
  session: { // if undefined, it will disable koa session
    keys: ['your', 'secret', 'keys'] // session keys to encrypt the cookies
  }
});
```

### **Step by step**

#### 0. Know about the [interface KBSConfig](https://github.com/DevinDon/koa-backend-server/blob/master/src/type/server.ts).

```typescript
/** KBS config. */
interface KBSConfig {
  /** KBS address. */
  address: KBSAddress;
  /** KBS database connection, if undefined it will disable the typeorm connection. */
  database?: KBSDatabase;
  /** KBS router, if undefined it will disable the koa router. */
  router?: KBSRouter;
  /** KBS session, if undefined it will disable the koa session. */
  session?: KBSSession;
}
```

#### 1. Set your address information.

```typescript
const address: KBSAddress = {
  portocol: 'HTTP', // required, HTTP, HTTPS or HTTP2
  host: '0.0.0.0', // optional, default to 0.0.0.0
  port: 80, // optional, default to 80
  // ssl: {cert: 'CERT', key: 'KEY'} // required if portocol is HTTPS or HTTP2
};
```

#### 2. (Optional) Connect database via [TypeORM](https://www.npmjs.com/package/typeorm).

- *Using [ormconfig.json](https://www.npmjs.com/package/typeorm#quick-start) to create connection.*

```typescript
const database: KBSDatabase = {
  ormconfig: true
};
```
- *and you should create ormconfig.json file in root dir like this **(DO NOT forget to remove comment)**:*
```json
{
  "type": "mysql", // database type
  "host": "localhost", // database host
  "port": 3306, // database port
  "username": "username", // database username
  "password": "password", // database password
  "database": "database", // database name
  "synchronize": true, // auto generate database table (or document), but you may lost all data of this database
  "logging": true, // show query logs
  "entities": [ // entites, means table(SQL) or document(NOSQL)
    "src/entity/**/*.entity.ts"
  ],
  "migrations": [],
  "subscribers": []
}
```

- *Or using ConnectionOptions to create connection.*

```typescript
const database: KBSDatabase = {
  options: {
    name: 'default',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'database',
    username: 'username',
    password: 'password',
    synchronize: true, // auto generate database table (or document), but you may lost all data of this database
    logging: true, // log all query statements
    entities: [/** your own entities */]
  }
};
```

#### 3. (Optional) Set router paths and API version.

- *Here is the [router path interface](https://github.com/DevinDon/koa-backend-server/blob/master/src/type/router.ts).*

```typescript
interface RouterPaths {
  [index: string]: {
    path: string | RegExp | (string | RegExp)[];
    ware: any;
    cors?: CORS;
  };
}

interface AllPaths {
  DELETE?: RouterPaths;
  GET?: RouterPaths;
  HEAD?: RouterPaths;
  OPTIONS?: RouterPaths;
  PATCH?: RouterPaths;
  POST?: RouterPaths;
  PUT?: RouterPaths;
}
```

- *And the paths look like this*.

```typescript
// post/index.ts
import { AMiddleware, now, RouterPaths } from 'koa-backend-server';
import { User } from '../entity';
import test from './test';

const index: AMiddleware = async (c, next) => {
  const request = c.request.body;
  const insert = await User.insert({ name: now(), password: 'any' });
  const data = await User.find();
  c.body = {
    status: true,
    data
  };
  next();
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
    ware: index
  }
};

export default postPaths;
```

- *Don't forget to define router.*

```typescript
// index.ts
const router: KBSRouter = { // if undefined, it will disable koa router
  paths: { // router paths
    POST: postPaths
  },
  static: { // static files dir, without version prefix
    path: 'static/files/dir',
    options: { /* Some options. */ }
  },
  version: 'v1' // API version, the prefix of all paths
}
```

#### 4. (Optional) Set the session keys.

```typescript
const keys: KBSSession = {
  keys: ['your', 'secret', 'keys']
};
```

#### 5. And now, it looks like this.

- *Enter point: index.ts*

```typescript
import { KBSAddress, KBSDatabase, KBSRouter, KBSSession, Server } from 'koa-backend-server';
import postPaths from './post';

const address: KBSAddress = {
  portocol: 'HTTP', // required, HTTP, HTTPS or HTTP2
  host: '0.0.0.0', // optional, default to 0.0.0.0
  port: 80, // optional, default to 80
  // ssl: {cert: 'CERT', key: 'KEY'} // required if portocol is HTTPS or HTTP2
};

const database: KBSDatabase = {
  options: {
    name: 'default',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'database',
    username: 'username',
    password: 'password',
    synchronize: true, // auto generate database table (or document), but you may lost all data of this database
    logging: true, // log all query statements
    entities: [/** your own entities */]
  }
};

const router: KBSRouter = { // if undefined, it will disable koa router
  paths: { // router paths
    POST: postPaths
  },
  static: { // static files dir, without version prefix
    path: 'static/files/dir',
    options: { /* Some options. */ }
  },
  version: 'v1' // API version, the prefix of all paths
};

const session: KBSSession = { // if undefined, it will disable koa session
  keys: ['your', 'secret', 'keys'] // session keys to encrypt the cookies
};

const server: Server = new Server({
  address,
  database,
  router,
  session
});
```

- *[Work tree](https://github.com/DevinDon/koa-backend-server/)*

```text
┏━ src/
┃   ┣━ entity/
┃   ┃   ┣━ index.ts
┃   ┃   ┗━ user.entity.ts
┃   ┣━ post/
┃   ┃   ┗━ index.ts
┃   ┗━ index.ts
┣━ .gitignore
┣━ LICENSE
┣━ ormconfig.json
┣━ package-lock.json
┣━ package.json
┣━ README.md
┣━ tsconfig.json
┗━ tslint.json
```

### **Advanced usage**

#### Use your own middlewares.

```typescript
server.use(middlewareA, middlewareB, middlewareC, /* ... */);
```

#### Some others

Emmm, maybe later?

## Author

Devin Don, [Email](mailto:DevinDon@Foxmail.com), [Github](https://github.com/devindon/koa-backend-server), [My Home Page(Under construction)](https://don.red).

## License

[MIT License](LICENSE)

## Thanks

[Koa](https://www.npmjs.com/package/koa)

[Koa Body](https://www.npmjs.com/package/koa-body)

[Koa Router](https://www.npmjs.com/package/koa-router)

[Koa Session](https://www.npmjs.com/package/koa-session)

[TypeORM](https://www.npmjs.com/package/typeorm)
