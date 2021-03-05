import { CORSHandler, Rester } from '../../main';
import { AccessEntity } from './access';
import { AphorismEntity } from './aphorism';

const rester = new Rester({
  addresses: [
    {
      host: '0.0.0.0',
      port: 8080,
      protocol: 'HTTP',
    },
    {
      host: '0.0.0.0',
      port: 8081,
      protocol: 'HTTP',
    },
  ],
  databases: [
    {
      name: 'default',
      type: 'mongodb',
      host: 'database.don.red',
      port: 27017,
      username: 'root',
      password: 'fuT9cnAKZd2JeFS4',
      database: 'demo',
      authSource: 'admin',
      logger: 'debug',
      synchronize: true,
    },
    {
      name: 'local',
      type: 'sqlite',
      database: 'demo.db',
      logger: 'debug',
      synchronize: true,
    },
  ],
});

rester.addEntities('local', AccessEntity);
rester.addEntities(AphorismEntity);
rester.addHandlers(CORSHandler);

rester.bootstrap();
