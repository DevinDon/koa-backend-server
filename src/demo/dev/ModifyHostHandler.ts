import { BaseHandler } from '../../main';

export class ModifyHostHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {
    this.args[0] = 'Argument has been modified.';
    return next();
  }

}
