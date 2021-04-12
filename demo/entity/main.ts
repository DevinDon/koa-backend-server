import { Rester, ResterModule } from '../../src';
import { AccessEntity } from './access.entity';
import { AccessView } from './access.view';

const AccessModule: ResterModule = {
  entities: [AccessEntity],
  views: [AccessView],
};

const rester = new Rester({ modules: [AccessModule] });

rester.bootstrap();
