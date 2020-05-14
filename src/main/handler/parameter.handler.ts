import { IncomingMessage, ServerResponse } from 'http';
import { MetadataKey } from '../@types';
import { ParamInjection, ParamInjectionType } from '../decorator';
import { HTTP400Exception, HTTP404Exception } from '../exception';
import { BodyParser } from '../util/body-parser';
import { BaseHandler } from './base.handler';

/**
 * Parameter handler.
 *
 * Inject parameter to view method.
 *
 * @extends BaseHandler
 */
export class ParameterHandler extends BaseHandler {

  /** HTTP request body parser */
  private parser = new BodyParser();

  /** Parameter injectors, function. */
  private parameterInjectors: { [index in ParamInjectionType]: (name: string) => any } = {
    /**
     * Inject HTTP request instance.
     *
     * @returns {IncomingMessage} Request instance.
     */
    PARAM$HTTP$REQUEST: (): IncomingMessage => this.request,
    /**
     * Inject HTTP response instance.
     *
     * @returns {ServerResponse} Response instance.
     */
    PARAM$HTTP$RESPONSE: (): ServerResponse => this.response,
    /**
     * Inject path query object.
     *
     * @returns {string | undefined} Query value of special key, maybe undefined.
     */
    PARAM$PATH$QUERY: (key: string): string | undefined => this.mapping.queryObject && this.mapping.queryObject[key],
    /**
     * Inject path variable.
     *
     * @returns {string} Path variable.
     */
    PARAM$PATH$VARIABLE: (key: string): string => this.mapping.pathArray![this.route.mapping.pathArray!.indexOf(`{{${key}}}`)],
    /**
     * Inject request body object, should await it to get result.
     *
     * @returns {Promise<any>} Request body promise object.
     */
    PARAM$REQUEST$BODY: (type?: string): Promise<any> => new Promise<any>((resolve, reject) => {
      if (+this.request.headers['content-length']! > 10 * 1024 * 1024) { // if size > 10m, should parse it yourself
        resolve();
      } else {
        let data: Buffer = Buffer.allocUnsafe(0);
        this.request.on('data', (chunk: Buffer) => data = Buffer.concat([data, chunk]));
        // TODO: JSON schema & validate
        this.request.on('end', () => resolve(
          this.parser
            .setContentType(type || this.request.headers['content-type'] || '')
            .parse(data)
        ));
        this.request.on('error', error => reject(error));
      }
    }),
    /**
     * Inject special request header.
     *
     * @returns {string | string[] | undefined} Header value of special key, or undefined.
     */
    PARAM$REQUEST$HEADER: (key: string): string | string[] | undefined => this.request.headers[key.toLowerCase()]
  };

  /**
   * Parameter handle method.
   *
   * @param {Next<T>} next Next function, to go to next handler.
   * @returns {Promise<T>} Result for this handler.
   * @throws {HTTP404Exception} Not found exception.
   */
  async handle(next: () => Promise<any>): Promise<any> {
    // if route exist
    if (this.route) {
      /** Parameter injection array. */
      const parameterInjections: ParamInjection[] | undefined = this.route.target && Reflect.getMetadata(MetadataKey.Parameter, this.route.target.prototype, this.route.name);
      /** Arguments, or undefined. */
      this.args = parameterInjections ? parameterInjections.map(v => this.parameterInjectors[v.type](v.value)) : [];
      try {
        // await promise args, such as `body`
        for (let i = 0, length = this.args.length; i < length; i++) {
          if (this.args[i] instanceof Promise) {
            this.args[i] = await this.args[i];
          }
        }
      } catch (exception) {
        // bad request cannot be parsed, throw 400
        throw new HTTP400Exception(`Bad Request`);
      }
      return next();
    }
    // throw 404 not found exception
    throw new HTTP404Exception(`Can't ${this.request.method} ${this.request.url!}`);
  }

}
