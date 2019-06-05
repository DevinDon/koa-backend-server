import { MetadataKey, Method } from '../@types';
import { ParamInjection, ParamInjectionType } from '../decorator/Controller';
import { HTTP400Exception, HTTP404Exception, HTTP500Exception, HTTPException } from '../Exception';
import { Mapping, Route, Router } from '../Router';
import { BaseHandler } from './BaseHandler';

/**
 * Core handler.
 */
export class CoreHandler extends BaseHandler {

  /** Param injectors, function. */
  private paramInjectors: { [index in ParamInjectionType]: (name: string, route: Route, mapping: Mapping) => any } = {
    PARAM$HTTP$REQUEST: () => this.request!,
    PARAM$HTTP$RESPONSE: () => this.response!,
    PARAM$PATH$QUERY: (name: string, route: Route, mapping: Mapping) => mapping.queryObject && mapping.queryObject[name],
    PARAM$PATH$VARIABLE: (name: string, route: Route, mapping: Mapping) => Router.format(mapping).pathArray![route.mapping.pathArray!.indexOf(`{{${name}}}`)],
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
   * @returns {Promise<string>} Stringify HTTP response.
   */
  async handle(): Promise<string> {
    try {
      // content-type default to application/json
      this.response!.setHeader('content-type', 'application/json');
      /** Formatted mapping. */
      const mapping: Mapping = Router.format({
        method: this.request!.method! as Method,
        path: this.request!.url!
      });
      /** Route. */
      const route = Router.get(mapping);
      if (route) {
        /** Params type array. */
        const params: ParamInjection[] | undefined = Reflect.getMetadata(MetadataKey.Parameter, route.target.prototype, route.name);
        /** Arguments, or undefined. */
        const args = params ? params.map(v => this.paramInjectors[v.type](v.value, route, mapping)) : [];
        try {
          // await promise args, such as `body`
          for (let i = 0; i < args.length; i++) {
            if (args[i] instanceof Promise) {
              args[i] = await args[i];
            }
          }
        } catch (error) {
          // bad request cannot be parsed, throw 400
          throw new HTTP400Exception(`Bad request ${error}.`);
        }
        // if controller mapping is Promise, await it(slow)
        const result = route.controller[route.name](...args);
        // TODO: use JSON schema instead of JSON stringify
        return JSON.stringify(result instanceof Promise ? await result : result);
      }
    } catch (error) {
      if (error instanceof HTTPException) {
        // error is HTTPException
        throw error;
      } else {
        // internal error, throw 500
        throw new HTTP500Exception(error, { request: this.request!, response: this.response! });
      }
    }
    // router not found, throw 404
    throw new HTTP404Exception(`CAN'T ${this.request!.method!.toUpperCase()} ${this.request!.url!}`, { request: this.request!, response: this.response! });
  }

}
