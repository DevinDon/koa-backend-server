import { Database, Server } from '../dist';
import { User } from './entity';
import { postPaths } from './post';

const database = new Database({
  name: 'default',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'docker',
  password: 'docker',
  database: 'docker',
  entities: [
    User
  ],
  synchronize: true,
  logging: true
});

const server = new Server({
  type: 'HTTP',
  keys: ['test'],
  paths: { POST: postPaths }
});
