import { BaseHandler } from '../../main';

export class LogHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {
    console.log(`Arguments: ${this.args}`);
    console.log(`Route: ${this.request.method}${this.request.url}`);
    const result = await next();
    console.log(`Result: ${result}`);
    return result;
  }

}
