import { BaseEntity } from 'typeorm';
import { ControllerType, ViewType } from '../decorators';

type EntityType = Function & typeof BaseEntity;

export interface ResterModule<M> {
  models?: M[];
  entities?: EntityType[] | [string, ...EntityType[]];
  controllers?: ControllerType[];
  views?: ViewType[];
}
