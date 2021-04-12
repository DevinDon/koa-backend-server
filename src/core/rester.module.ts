import { BaseEntity } from '@rester/orm';
import { ControllerType, ViewType } from '../decorators';

type EntityType = Function & typeof BaseEntity;

export interface ResterModule {
  models?: any[];
  entities?: EntityType[] | [string, ...EntityType[]];
  controllers?: ControllerType[];
  views?: ViewType[];
}
