import { HTTP500Exception, HTTPException } from '../exception.temp';
import { BaseHandler } from './BaseHandler';

export class ExceptionHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {
    return next()
      .catch((exception: HTTPException) => {
        if (!(exception instanceof HTTPException)) { // default to 500
          exception = new HTTP500Exception('Internal Server Error');
        }
        if (!exception.content) { // response content default to {}
          exception.content = '{}';
        }
        this.response.statusCode = exception.code;
        this.response.statusMessage = exception.message!;
        return exception.content;
      });
  }

}
