import { logger } from '@iinfinity/logger';
import { BaseHandler } from '../../main';

export class LogHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {
    logger.log(`Arguments: ${this.args}`);
    logger.log(`Route: ${this.request.method}${this.request.url}`);
    const result = await next();
    logger.log(`Result: ${result}`);
    return result;
  }

}
