# Koa Backend Server

[![NPM](https://nodei.co/npm/koa-backend-server.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/koa-backend-server/)

KBS, Koa Backend Server with **TypeScript**.

## Version

**WARNING: This project is currently in an *UNSTABLE* version.**

[Latest Version 0.2.4](https://www.npmjs.com/package/koa-backend-server/v/0.2.4)

## Change log

[Full Change Log](https://github.com/DevinDon/koa-backend-server/blob/master/dist/CHANGELOG.md)

### 0.2.3 => 0.2.4

- Now you can set your API version as the perfix.
- RESTful methods supported.

## Installation

- *This package*

```shell
npm i --save koa-backend-server
```

- *Development dependencies*

```shell
npm i --save-dev @types/node typescript ts-node
```

- **DO NOT install koa again!**

## Usage

### **Quick start**

It will create a HTTP server which is listening on port 80, and set POST Router `postPaths`.

```typescript
import { Server } from 'koa-backend-server';
import { User } from './entity';
import { postPaths } from './post';

const server = new Server({
  database: true, // use ormconfig.json to create connection, or use ConnectionOptions
  host: 0.0.0.0, // default to 0.0.0.0
  keys: ['test'], // if undefined, it will disable session middleware
  // options: { /* ... */ }, // only need in HTTPS / HTTP2 mode
  paths: { POST: postPaths }, // if undefined, it will disable router middleware
  port: 80, // default to 80
  type: 'HTTP', // default to 'HTTP'
  version: 'v1' // API version
});
```

### **Step by step config**

#### 0. First of all, you should know about the KBS config

- *Here is the [KBS config interface](https://github.com/DevinDon/koa-backend-server/blob/master/src/type/index.ts).*

```typescript
/** KBS config. */
interface KBSConfig {
  /** Database. */
  database?: ConnectionOptions | boolean;
  /** Host. */
  host?: string;
  /** Cookie & Session secret keys. */
  keys?: string[];
  /** HTTPS / HTTP2 options. */
  options?: ServerOptions | SecureServerOptions;
  /** Router paths. */
  paths?: AllPaths;
  /** Port. */
  port?: number;
  /** Type of KBS, default to 'HTTP'. */
  type?: 'HTTP' | 'HTTPS' | 'HTTP2';
  /** API version. */
  version?: string;
}
```

#### 1. (Optional) Connect database by [typeorm](https://www.npmjs.com/package/typeorm).

- *Using [ormconfig.json](https://www.npmjs.com/package/typeorm#quick-start) to create connection.*

```typescript
const database: boolean = true;
```
- *and you should create ormconfig.json file in root dir like this (DO NOT forget to remove comment):*
```json
{
  "type": "mysql", // database type
  "host": "localhost", // database host
  "port": 3306, // database port
  "username": "username", // database username
  "password": "password", // database password
  "database": "database", // database name
  "synchronize": false, // only turn on when you wanna create database, if true you will lost all data of this database
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
const database: ConnectionOptions = {
  name: 'default', // use 'default'
  type: 'mysql', // database type
  host: 'localhost', // database host
  port: 3306, // database port
  username: 'username', // database username
  password: 'password', // database password
  database: 'database', // database name
  synchronize: false, // only turn on when you're in dev
  logging: true, // show query logs
  entities: [ // entites, means table(SQL) or document(NOSQL)
    User
  ]
};
```

#### 2. (Optional) Set the session keys.

```typescript
const keys: string[] = ['your', 'secret', 'keys'];
```

#### 3. (Optional) Create router path handlers.

- *Here is the [router path interface](https://github.com/DevinDon/koa-backend-server/blob/master/src/type/index.ts).*

```typescript
interface RouterPaths {
  [index: string]: IMiddleware | AMiddleware | any;
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
import postPaths from './post';

const paths: AllPaths = {
  GET: {
    '/': async (c, next) => {
      const result = User.find();
      c.body = {
        status: result ? true : false,
        data: result
      };
      next();
    }
  },
  POST: postPaths // in other source file
};
```

#### 4. (Optional) Set your API version.

```typescript
const version: string = 'v1';
```

#### 5. Choose a type of server.

```typescript
const type: 'HTTP' | 'HTTPS' | 'HTTP2' = 'HTTP';
```

#### 6. Listening on somewhere.

- *Anywhere you want.*

```typescript
const host: string = 'localhost';
const port: number = 8080;
```

- *Or use default value.*

```typescript
// host is default to '0.0.0.0'
// port is default to 80
```

#### 7. And now, it looks like this.

- *Enter point: index.ts*

```typescript
import { AllPaths, Server } from '../dist';
import { User } from './entity';
import postPaths from './post';

const database: boolean = true;

const keys: string[] = ['your', 'secret', 'keys'];

const paths: AllPaths = {
  GET: {
    '/': async (c, next) => {
      const result = User.find();
      c.body = {
        status: result ? true : false,
        data: result
      };
      next();
    }
  },
  POST: postPaths
};

const host: string = 'localhost';
const port: number = 80;
const type: 'HTTP' | 'HTTPS' | 'HTTP2' = 'HTTP';
const version: string = 'v1';

const server: Server = new Server({
  database,
  host,
  keys,
  paths,
  port,
  type,
  version
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

### Advanced usage

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
