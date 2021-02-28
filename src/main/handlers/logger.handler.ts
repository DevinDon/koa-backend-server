import { BaseHandler } from './base.handler';

export class LoggerHandler extends BaseHandler {

  private logger = this.rester.configLogger.get();

  async handle(next: () => Promise<any>): Promise<any> {
    this.logger.debug(`${this.mapping.method} ${this.mapping.path} ${this.mapping.query || ''}`);
    return next();
  }

}
