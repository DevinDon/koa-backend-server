import { BaseHandler } from '../../main';
import delay from '@iinfinity/delay';

export class DelayHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {
    await delay(1000);
    return next();
  }

}
