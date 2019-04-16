import { Level } from '@iinfinity/logger';
import { logger } from '@iinfinity/redion';
import { Option, Rester } from '../../main';
import PATH from './router';
import { statistic } from './ware';

logger.setLevel(Level.INFO);

/** Devlopment config. */
const option: Option = {
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
    logging: false, // log db records
    entities: [
      'src/demo/full/entity/**/*.entity.ts'
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
  session: { // local session
    domain: 'localhost',
    name: 'session.id',
    expire: 3600,
    secert: ['your', 'secert', 'keys']
  },
  environment: 'prod'
};

const server = new Rester(option);
// Use example statistic middleware
server.use({
  'Statistic': statistic
});

server.listen();
