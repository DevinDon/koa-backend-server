import { BaseHandler } from '../../main';

export class ModifyPrefixHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {
    next();
    return 'response has been changed!';
  }

}
