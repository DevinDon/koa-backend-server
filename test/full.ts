import { KBSAddress, KBSDatabase, KBSRouter, KBSSession, Server } from '../src';
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
