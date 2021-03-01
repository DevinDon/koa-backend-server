import { Rester } from '../core';
import { HandlerType } from '../decorators';
import { BaseHandler } from '../handlers/base.handler';

export class LoggerHandler extends BaseHandler {

  private logger = this.rester.logger;

  async handle(next: () => Promise<any>): Promise<any> {
    this.logger.debug(`${this.mapping.method} ${this.mapping.path} ${this.mapping.query || ''}`);
    return next();
  }

}
