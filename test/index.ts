// import { Router, Server, Session } from '../dist';
// import { postPaths } from './post';

// const server = new Server();
// const router = new Router({ POST: postPaths });
// const session = new Session(server.app);

// server.use(session.ware);
// server.use(router.ware);

// server.listen(80);

import { Server, Database } from '../dist';
import { postPaths } from './post';
import { User } from './entity';

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

const server = new Server();
server.default({ POST: postPaths });
