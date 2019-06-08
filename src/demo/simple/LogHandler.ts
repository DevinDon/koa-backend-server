import { BaseHandler } from '../../main';

export class LogHandler extends BaseHandler {

  async handle<T>(next: () => Promise<T>): Promise<T> {
    console.log(`Arguments: ${this.args}`);
    console.log(`Route: ${this.request.method}${this.request.url}`);
    const result = await next();
    console.log(`Result: ${result}`);
    return result;
  }

}
