import { BaseHandler } from '../../main';

export class ModifyHostHandler extends BaseHandler {

  async handle<T>(next: () => Promise<T>): Promise<T> {
    this.args[0] = 'Argument has been modified.';
    return next();
  }

}
