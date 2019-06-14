import { IncomingMessage, ServerResponse } from 'http';
import { Route } from '../@types';

/**
 * Handler option.
 *
 * @property request.
 * @property response.
 * @property route.
 */
export interface HandlerOption {
  request: IncomingMessage;
  response: ServerResponse;
  route: Route;
}

/**
 * Abstract class BaseHandler.
 *
 * Base handler, custom handler class must extends it.
 *
 * @abstract `handle` Must implement this abstruct method.
 */
export abstract class BaseHandler {

  /** Arguments of controller method. */
  protected args!: any[];
  /** Mapping of this request. */
  protected mapping!: Mapping;
  /** Request instance. */
  protected request!: IncomingMessage;
  /** Response instance. */
  protected response!: ServerResponse;
  /** Route of this request. */
  route!: Route;

  /**
   * Create a new handler instance.
   *
   * @param {Rester} rester The rester instance to which this handler belongs.
   */
  constructor(protected rester: Rester) { }

  /**
   * Init handler with rdequest & response.
   *
   * If call init() without arguments, it mean set request, response & route to undefined.
   *
   * @param {HandlerOption} option Handler init option.
   * @returns {this} This handler instance.
   */
  init(option?: Partial<HandlerOption>): this {
    if (option) { // init handler with request, response & route
      this.request = option.request!;
      this.response = option.response!;
      this.route = option.route!;
    } else { // init handler in order to gc
      this.args = undefined as any;
      this.request = undefined as any;
      this.response = undefined as any;
      this.route = undefined as any;
    }
    return this;
  }

  /**
   * Inherit properties(args, request, response, route) from special handler.
   *
   * @param {THandler extends BaseHandler} handler Inherited object.
   * @returns {this} This handler instance.
   */
  inherit<THandler extends BaseHandler>(handler: THandler): this {
    this.args = handler.args;
    this.mapping = handler.mapping;
    this.request = handler.request;
    this.response = handler.response;
    this.route = handler.route;
    return this;
  }

  /**
   * Handle method.
   *
   * @param {() => Promise<any>} next Next handler, result should be returned.
   * @returns {Promise<any>} Handle result, normally it is response.
   */
  async abstract handle(next: () => Promise<any>): Promise<any>;

  /**
   * Run controller method with args.
   *
   * `this.route.controller[this.route.name](...this.args)`
   *
   * @returns {Promise<any>} Return a promise result.
   */
  async run(): Promise<any> {
    return this.route.controller[this.route.name](...this.args);
  }

}
