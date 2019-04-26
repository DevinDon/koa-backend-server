import { logger } from '@iinfinity/logger';
import { ConnectionOptions, createConnections, createConnection } from 'typeorm';
import { User } from './entity/mysql/user.entity';
import { Group } from './entity/postgres/group.entity';

const configPG: ConnectionOptions = {
  type: 'postgres',
  host: 'a-1.don.red',
  port: 5432,
  username: 'publicuser',
  password: 'publicuser',
  database: 'public',
  synchronize: true,
  logging: true,
  entities: [
    // 'src/demo/orm/entity/postgres/**/*.entity.ts'
    Group
  ],
  migrations: [],
  subscribers: []
};

const configMy: ConnectionOptions = {
  type: 'mysql',
  host: 'cdb-mnalfxb8.bj.tencentcdb.com',
  port: 10018,
  username: 'database',
  password: 'database',
  database: 'database',
  synchronize: true,
  logging: true,
  entities: [
    // 'src/demo/orm/entity/mysql/**/*.entity.ts'
    User
  ],
  migrations: [],
  subscribers: []
};

async function hello() {
  await createConnections([configPG, configMy]);
  const user = {
    name: 'test user'
  };
  const group = {
    name: 'test group'
  };
  await User.insert(user);
  await Group.insert(group);
  logger.info(await User.findOne(user));
  logger.info(await Group.findOne(group));
}

hello();
