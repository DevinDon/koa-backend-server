import { IncomingMessage, ServerResponse } from 'http';
import { Injectable } from '../decorator';
import { BaseHandler } from './BaseHandler';

@Injectable()
export class HandlerPool {

  max = 100 * 100;
  pool: BaseHandler[] = [];

  constructor() {
    for (let i = 0; i < 10; i++) {
      this.pool.push(new BaseHandler());
    }
  }

  take(request: IncomingMessage, response: ServerResponse): BaseHandler {
    return (this.pool.pop() || new BaseHandler()).init(request, response);
  }

  give(handler: BaseHandler): number {
    return this.pool.length < this.max ? this.pool.push(handler) : 0;
  }

}
