import { IncomingMessage, ServerResponse } from 'http';
import { Injectable } from '../decorator';
import { CoreHandler } from './CoreHandler';

@Injectable()
export class CoreHandlerPool {

  max = 100 * 100;
  pool: CoreHandler[] = [];

  constructor() {
    for (let i = 0; i < 10; i++) {
      this.pool.push(new CoreHandler());
    }
  }

  take(request: IncomingMessage, response: ServerResponse): CoreHandler {
    return (this.pool.pop() || new CoreHandler()).init(request, response);
  }

  give(handler: CoreHandler): number {
    return this.pool.length < this.max ? this.pool.push(handler) : 0;
  }

}
