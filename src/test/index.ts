import { Server, ServerConfig } from '../../dist';
import PATH from './router';
import { statistic } from './ware';

/** Production config. */
const prodConfig: ServerConfig = {
  address: {
    portocol: 'HTTP',
    host: '0.0.0.0',
    port: 8080,
    proxy: true,
    ssl: {
      cert: 'CERT CONTENT',
      key: 'KEY CONTENT'
    }
  },
  database: {
    type: 'postgres',
    host: 'app-postgres',
    port: 5432,
    username: 'app',
    password: 'app',
    database: 'app',
    synchronize: true,
    logging: true,
    entities: [
      'entity/**/*.entity.js'
    ],
    migrations: [],
    subscribers: []
  },
  router: {
    static: {
      path: 'client'
    },
    paths: PATH
  },
  session: {
    domain: '',
    name: 'session.id',
    redis: {
      host: 'app-redis',
      port: 6379
    }
  },
  environment: 'prod'
};

/** Devlopment config. */
const devConfig: ServerConfig = {
  address: {
    portocol: 'HTTP',
    host: '0.0.0.0',
    port: 8080,
    proxy: true,
    ssl: {
      cert: 'CERT CONTENT',
      key: 'KEY CONTENT'
    }
  },
  database: {
    type: 'postgres',
    host: 'a-1.don.red',
    port: 5432,
    username: 'publicuser',
    password: 'publicuser',
    database: 'public',
    synchronize: true,
    logging: true,
    entities: [
      'src/test/entity/**/*.entity.ts'
    ],
    migrations: [],
    subscribers: []
  },
  router: {
    static: {
      path: 'client'
    },
    paths: PATH
  },
  session: {
    domain: 'localhost',
    name: 'session.id',
    redis: {
      host: 'a-1.don.red',
      port: 6379
    }
  },
  environment: 'dev'
};

const server = new Server(devConfig);
// Use example statistic middleware
server.use({
  'Statistic': statistic
});

server.listen();
