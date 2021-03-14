import { Logger } from '@iinfinity/logger';

export class BaseController {

  public logger!: Logger;

  async init(): Promise<void> {
    this.logger.debug('Controller initial succeed');
  }

}
