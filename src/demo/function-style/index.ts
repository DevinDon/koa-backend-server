import { Rester } from '../../main';
import { UserEntity } from './user/user.entity';
import { UserView } from './user/user.view';

const rester = new Rester();

rester
  .configViews
  .add(UserView)
  .end();

rester
  .configDatabase
  .setType('postgres')
  .setHost('t-1.don.red')
  .setPort(5432)
  .setUsername('shared')
  .setPassword('shared')
  .setDatabase('shared')
  .setEntities([UserEntity])
  .setLogging(true)
  .setSynchronize(true)
  .end();

rester.listen();
