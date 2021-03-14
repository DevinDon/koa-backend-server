import { ExceptionHandler, LoggerHandler, ParameterHandler, Rester, RouterHandler, SchemaHandler } from '../../main';
import { AccessEntity } from './access.entity';
import './access.view';

const rester = new Rester();

rester.addEntities(AccessEntity);
rester.addHandlers(
  ExceptionHandler,
  SchemaHandler,
  RouterHandler,
  ParameterHandler,
  LoggerHandler,
);

rester.bootstrap();
