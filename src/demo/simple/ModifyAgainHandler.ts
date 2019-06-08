import { BaseHandler } from '../../main';

export class ModifyAgainHandler extends BaseHandler {

  async handle<T>(next: () => Promise<T>): Promise<T> {
    next();
    return 'response has been changed again!' as any;
  }

}
