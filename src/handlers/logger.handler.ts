import { BaseHandler } from './base.handler';

export class LoggerHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {
    this.rester.logger.debug(`${this.mapping.method} ${this.mapping.path} ${this.mapping.query || ''}`);
    return next();
  }

}
