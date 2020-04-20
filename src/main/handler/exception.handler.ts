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

  static init(rester: Rester, config?: any): HandlerType {
    ExceptionHandler.config(rester, config);
    return ExceptionHandler;
  }

  handle(next: () => Promise<any>): Promise<any> {
    return next()
      .catch((exception: HTTPException) => {
        if (!(exception instanceof HTTPException)) { // default to 500
          this.rester.configLogger.get().error(`Exception: ${JSON.stringify(exception)}`);
          exception = new HTTP500Exception('Internal Server Error');
        } else {
          this.rester.configLogger.get().warn(`Exception: ${exception.code} ${exception.message}.`);
        }
        if (!exception.content) { // response content default to {}
          exception.content = this.rester.zone.exception.response;
        }
        this.response.statusCode = exception.code;
        this.response.statusMessage = exception.message!;
        return typeof exception.content === 'string'
          ? exception.content
          : JSON.stringify(exception.content);
      });
  }

}
