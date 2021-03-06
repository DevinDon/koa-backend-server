import { Rester } from '../core/rester';
import { HandlerType } from '../decorators';
import { MetadataKey, Method, Route } from '../interfaces';
import { BaseHandler } from './base.handler';
import { RouterHandler } from './router.handler';

/**
 * CORS config.
 */
export interface CORSConfig {
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Methods': string;
  'Access-Control-Allow-Headers': string;
  'Access-Control-Max-Age': number;
}

const DEFAULT_CORS_CONFIG = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': 86400,
};

/**
 * CORS handler, require RouterHandler.
 */
export class CORSHandler extends BaseHandler {

  /**
   * Config & init CORS handler of rester instance.
   *
   * @param rester Rester instance.
   */
  static init(rester: Rester): HandlerType {
    // CORS config
    CORSHandler.config(CORSHandler.configuration);
    CORSHandler.configuration.cors || (CORSHandler.configuration.cors = DEFAULT_CORS_CONFIG);
    /** If CORS handler on global. */
    const allCORS = rester.handlers.includes(CORSHandler);
    // map all views
    rester.views
      .forEach(view => {
        const handlersOnView: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, view) || [];
        /** If CORS handler on view. */
        const allCORSOnView = handlersOnView.includes(CORSHandler);
        /** Get routes. */
        const routes: Route[] = Reflect.getMetadata(MetadataKey.View, view) || [];
        // for each & set OPTIONS mapping
        routes
          .filter(route => allCORS || allCORSOnView || route.handlers.includes(CORSHandler))
          .filter((route, index, array) => index === array.findIndex(v => v.mapping.path === route.mapping.path))
          .map(route => ({
            view: undefined as any,
            handlers: route.handlers,
            mapping: {
              method: Method.OPTIONS,
              path: route.mapping.path,
            },
            name: undefined as any,
            target: undefined as any,
          }))
          .forEach(route => RouterHandler.set(route, RouterHandler.configuration.route));
      });
    return CORSHandler;
  }

  async handle(next: () => Promise<any>): Promise<any> {
    for (const header in CORSHandler.configuration.cors) {
      if (Object.prototype.hasOwnProperty.call(CORSHandler.configuration.cors, header)) {
        this.response.setHeader(header, CORSHandler.configuration.cors[header]);
      }
    }
    return next();
  }

}
