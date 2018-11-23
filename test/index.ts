import { ConnectionOptions } from 'typeorm';
import { AllPaths, Server } from '../dist';
import { User } from './entity';

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
