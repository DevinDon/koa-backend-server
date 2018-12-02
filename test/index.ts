import { Server } from '../src';
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
    version: 'v1' // API version, the prefix of all paths
  },
  session: { // if undefined, it will disable koa session
    keys: ['your', 'secret', 'keys'] // session keys to encrypt the cookies
  }
});
