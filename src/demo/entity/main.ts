import { Rester } from '../../main';
import { AccessEntity } from './access.entity';
import './access.view';

const rester = new Rester();

rester.addEntities(AccessEntity);

rester.bootstrap();
