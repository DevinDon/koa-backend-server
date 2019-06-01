import { IncomingMessage, ServerResponse } from 'http';
import { HTTP500Exception } from '../Exception';

export class BaseHandler {

  protected request?: IncomingMessage;
  protected response?: ServerResponse;

  init(request?: IncomingMessage, response?: ServerResponse): this {
    this.request = request;
    this.response = response;
    return this;
  }

  handle(): string {
    throw new HTTP500Exception('Handle method has not been override.', { request: this.request!, response: this.response! });
  }

}
