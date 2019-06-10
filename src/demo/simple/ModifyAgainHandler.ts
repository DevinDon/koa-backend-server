import { BaseHandler } from '../../main';

export class ModifyAgainHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {
    next();
    return 'response has been changed again!';
  }

}
