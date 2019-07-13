import { HandlerType } from '../decorator';
import { HTTP500Exception, HTTPException } from '../exception';
import { Rester } from '../rester';
import { BaseHandler } from './base.handler';

export interface ExceptionConfig {
  response: string;
}

export class ExceptionHandler extends BaseHandler {

  static config(rester: Rester, config?: ExceptionConfig): HandlerType {
    rester.zone.exception = config || { response: JSON.stringify({ status: false }) };
    return ExceptionHandler;
  }

  handle(next: () => Promise<any>): Promise<any> {
    return next()
      .catch((exception: HTTPException) => {
        if (!(exception instanceof HTTPException)) { // default to 500
          exception = new HTTP500Exception('Internal Server Error');
        }
        if (!exception.content) { // response content default to {}
          exception.content = this.rester.zone.exception.response;
        }
        this.response.statusCode = exception.code;
        this.response.statusMessage = exception.message!;
        return exception.content;
      });
  }

}
