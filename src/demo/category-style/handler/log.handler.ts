import { BaseHandler } from '../../../main';

export class LogHandler extends BaseHandler {

  handle(next: () => Promise<any>): Promise<any> {
    console.log(`${new Date().toLocaleString()} ${'OK'.padEnd(3, ' ')} ${this.mapping.method.padEnd(10, ' ')} ${this.mapping.path.padEnd(20, ' ')} From ${this.request.connection.remoteAddress || 'unknown'}`);
    return next();
  }

}
