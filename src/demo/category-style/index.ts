import { Rester } from '../../main';
import { UserEntity } from './entity';
import { LogHandler } from './handler';
import { SignView } from './view';

const server = new Rester()
  .configViews
  .add(SignView)
  .end()
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
  .end()
  .configHandlers
  .add(LogHandler)
  .end()
  .listen();
