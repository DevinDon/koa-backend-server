import { Logger } from '@iinfinity/logger';

export class BaseView {

  private logger!: Logger;

  async init(): Promise<void> {
    this.logger.debug('View initial succeed');
  }

}
