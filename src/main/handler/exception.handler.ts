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
      .catch((exception: HTTPException | Error) => {
        if (exception instanceof HTTPException) {
          this.rester.configLogger.get().error(`HTTP Exception: ${exception.code} ${exception.message}\n${JSON.stringify(exception.content)}`);
        } else {
          this.rester.configLogger.get().error(`Internal Exception: ${exception.name} ${exception.message}\n${exception.stack}`);
          exception = new HTTP500Exception('Internal Server Error');
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
