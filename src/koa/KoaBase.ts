import Koa from 'koa';
import { logger } from '../middleware';

export class KoaBase extends Koa {

  constructor() {
    super();
  }

  public init() {
    this.use(logger);
  }

}
