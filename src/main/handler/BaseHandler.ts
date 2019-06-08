import { IncomingMessage, ServerResponse } from 'http';
import { Route } from '../Router';

export interface HandlerOption {
  request: IncomingMessage;
  response: ServerResponse;
  route: Route;
}

export abstract class BaseHandler {

  protected args!: any[];
  protected request!: IncomingMessage;
  protected response!: ServerResponse;
  protected route!: Route;

  /**
   * Init handler with rdequest & response.
   *
   * If call init() without arguments, it mean set request, response & route to undefined.
   *
   * @param {Request} request Incoming message.
   * @param {Response} response Server response.
   * @returns {this} This handler instance.
   */
  init(option?: HandlerOption): this {
    if (option) { // init handler with request, response & route
      this.request = option.request;
      this.response = option.response;
      this.route = option.route;
    } else { // init handler in order to gc
      this.args = undefined as any;
      this.request = undefined as any;
      this.response = undefined as any;
      this.route = undefined as any;
    }
    return this;
  }

  inherit<THandler extends BaseHandler>(handler: THandler): this {
    this.request = handler.request;
    this.response = handler.response;
    this.route = handler.route;
    return this;
  }

  async abstract handle<T>(next: () => Promise<T>): Promise<T>;

  async run(): Promise<any> {
    return this.route!.controller[this.route!.name](...this.args!);
  }

}
