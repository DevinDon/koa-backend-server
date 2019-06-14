import { BaseHandler } from '../../../main';

export class LogHandler extends BaseHandler {

  handle(next: () => Promise<any>): Promise<any> {
    console.log(`${new Date().toLocaleString()} ${this.route.mapping.method}${this.route.mapping.path} ${this.request.connection.remoteAddress}`);
    return next();
  }

}
