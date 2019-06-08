import { BaseHandler } from '../../main';

export class ModifyPrefixHandler extends BaseHandler {

  async handle<T>(next: () => Promise<T>): Promise<T> {
    next();
    return 'response has been changed!' as any;
  }

}
