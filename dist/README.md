# Koa Backend Server

KBS, Koa Backend Server.

## Version

[0.2.1](https://www.npmjs.com/package/koa-backend-server/v/0.2.1)

## Change Log

[Full Change Log](CHANGELOG.md)

### 0.2.0 => 0.2.1

- Use constructor to connect database.

## Installation

Run `npm i --save koa-backend-server` to install this package.

You just need to run `npm i --save-dev @types/node @types/koa @types/koa-router @types/koa-session typescript ts-node` to install dev dependencies.

**DO NOT install koa again!**

## Usage

### Quick start

It will create a HTTP server which is listening on port 80, and set POST Router `postPaths`.

```typescript
import { Server } from 'koa-backend-server';
import { User } from './entity';
import { postPaths } from './post';

const server = new Server({
  database: {
    name: 'default', // use 'default'
    type: 'mysql', // database type
    host: 'localhost', // database host
    port: 3306, // database port
    username: 'user', // database user
    password: 'password', // database password
    database: 'database', // database name
    entities: [ // entites, means table(SQL) or document(NOSQL)
      User
    ],
    synchronize: false, // only turn on when you're in dev
    logging: false // show query logs
  },
  host: 0.0.0.0, // default to 0.0.0.0
  keys: ['test'], // default to ['default']
  // options: { /* ... */ }, // only need in HTTPS / HTTP2 mode
  paths: { POST: postPaths }, // default to {}
  port: 80, // default to 80
  type: 'HTTP' // default to 'HTTP'
});
```

### **Step by step config**

#### 0. The KBS config

- *Here is the KBS config interface.*

```typescript
/** KBS config. */
interface KBSConfig {
  /** Database. */
  database?: ConnectionOptions;
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
}
```

#### 1. (Optional) Connect database by [typeorm](https://www.npmjs.com/package/typeorm).

```typescript
const database: ConnectionOptions = {
  name: 'default', // use 'default'
  type: 'mysql', // database type
  host: 'localhost', // database host
  port: 3306, // database port
  username: 'user', // database user
  password: 'password', // database password
  database: 'database', // database name
  entities: [ // entites, means table(SQL) or document(NOSQL)
    User
  ],
  synchronize: false, // only turn on when you're in dev
  logging: false // show query logs
};
```

#### 2. (Optional) Set the session keys.

```typescript
const keys: string[] = ['your', 'secret', 'keys'];
```

#### 3. (Optional) Create router path handlers.

- *Here is the router path interface.*

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

- And the paths look like this.

```typescript
const paths: AllPaths = {
  GET: {
    '/path/you/wanna/get': (ctx, next) => { /* ... */ },
    '/path/other': (ctx, next) => { /* ... */ }
  }, POST: {
    '/path/you/wanna/post': (ctx, next) => { /* ... */ }
  }, PUT: {
    /* ... */
  }
};
```

#### 4. Choose a type of server.

```typescript
const type: 'HTTP' | 'HTTPS' | 'HTTP2' = 'HTTP';
```

#### 5. Listening on somewhere.

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

#### 6. And now, it looks like this.

```typescript
import { ConnectionOptions } from 'typeorm';
import { AllPaths, Server } from 'koa-backend-server';
import { User } from './entity';

const database: ConnectionOptions = { /* ... */ };

const keys: string[] = ['your', 'secret', 'keys'];

const paths: AllPaths = {
  GET: {
    '/path/you/wanna/get': (ctx, next) => { /* ... */ },
    '/path/other': (ctx, next) => { /* ... */ }
  }, POST: {
    '/path/you/wanna/post': (ctx, next) => { /* ... */ }
  }, PUT: {
    /* ... */
  }
};

const type: 'HTTP' | 'HTTPS' | 'HTTP2' = 'HTTP';

const host: string = 'localhost';
const port: number = 8080;

const server: Server = new Server({
  database,
  host,
  keys,
  paths,
  port,
  type
});

```

## Author

Devin Don, [Email](mailto:DevinDon@Foxmail.com), [Github](https://github.com/devindon/koa-backend-server), [My Home Page](https://don.red).

## License

[MIT License](LICENSE)
