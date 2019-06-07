import { MetadataKey, Method } from '../@types';
import { ParamInjection, ParamInjectionType } from '../decorator/Controller';
import { HTTP400Exception, HTTP404Exception } from '../Exception';
import { Route, Router } from '../Router';
import { BaseHandler } from './BaseHandler';

/**
 * Core handler.
 */
export class CoreHandler extends BaseHandler {

  /** Param injectors, function. */
  private paramInjectors: { [index in ParamInjectionType]: (name: string, route: Route) => any } = {
    PARAM$HTTP$REQUEST: () => this.request!,
    PARAM$HTTP$RESPONSE: () => this.response!,
    PARAM$PATH$QUERY: (name: string, route: Route) => {
      const queryObject = Router.format({ method: this.request!.method as Method, path: this.request!.url! }).queryObject;
      return queryObject && queryObject[name];
    },
    PARAM$PATH$VARIABLE: (name: string, route: Route) => Router.format({ method: this.request!.method as Method, path: this.request!.url! }).pathArray![route.mapping.pathArray!.indexOf(`{{${name}}}`)],
    PARAM$REQUEST$BODY: async (): Promise<any> => new Promise<any>((resolve, reject) => {
      let data: Buffer = Buffer.allocUnsafe(0);
      this.request!.on('data', (chunk: Buffer) => data = Buffer.concat([data, chunk]));
      // TODO: JSON schema & validate
      this.request!.on('end', () => {
        let result;
        switch (this.request!.headers['content-type']) {
          case 'application/json': result = JSON.parse(data.toString()); break;
          default: result = data.toString(); break;
        }
        resolve(result);
      });
      this.request!.on('error', error => reject(error));
    }),
    PARAM$REQUEST$HEADER: (value: string) => this.request!.headers[value.toLowerCase()]
  };

  /**
   * Core handle method.
   *
   * @param {Next<T>} next Next function, to go to next handler.
   * @returns {Promise<T>} Result for this handler.
   */
  async handle<T>(next: () => Promise<T>): Promise<T> {
    // TODO: refactor by content-type handler
    // content-type default to application/json
    this.response!.setHeader('content-type', 'application/json');
    // if route exist
    if (this.route) {
      /** Parameter injection array. */
      const parameterInjections: ParamInjection[] | undefined = Reflect.getMetadata(MetadataKey.Parameter, this.route.target.prototype, this.route.name);
      /** Arguments, or undefined. */
      this.args = parameterInjections
        ? parameterInjections.map(v => this.paramInjectors[v.type](v.value, this.route!))
        : [];
      try {
        // await promise args, such as `body`
        for (let i = 0; i < this.args.length; i++) {
          if (this.args[i] instanceof Promise) {
            this.args[i] = await this.args[i];
          }
        }
      } catch (error) {
        // bad request cannot be parsed, throw 400
        throw new HTTP400Exception(`Bad request ${error}.`);
      }
      return next();
    }
    throw new HTTP404Exception(`Can't ${this.request!.method!.toUpperCase()} ${this.request!.url!}`, { request: this.request!, response: this.response! });
  }

}
