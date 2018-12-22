import { Server } from '../src';
import postPaths from './post';

const server = new Server({
  address: {
    portocol: 'HTTP', // Required, HTTP, HTTPS or HTTP2.
    host: '0.0.0.0', // Optional, default to 0.0.0.0.
    port: 80, // Optional, default to 80.
    // ssl: {cert: 'CERT', key: 'KEY'} // Required if portocol is HTTPS or HTTP2.
  },
  database: { // If undefined, it will disable database connection
    ormconfig: true, // If true, it will use ormconfig.json to connect database, and the connection options will be ignore
    // options: { // Your own database options.
    //   name: 'default',
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   database: 'database',
    //   username: 'username',
    //   password: 'password',
    //   synchronize: true, // auto generate database table (or document), but you may lost all data of this database
    //   logging: true, // log all query statements
    //   entities: [/** your own entities */]
    // }
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
  session: { // If undefined, it will disable redisession.
    name: 'session.id', // cookie name
    domain: 'your.domain', // domain
    httpOnly: true,
    secert: ['keys'], // secert keys
    redis: { // redis connection options
      host: 'your.redis.address',
      port: 6379
    }
  }
});

// Start listening.
server.listen();
