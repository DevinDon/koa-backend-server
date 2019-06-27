import { MetadataKey, Method, Route } from '../@types';
import { HandlerType } from '../decorator';
import { Rester } from '../rester';
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

/**
 * CORS handler, require RouterHandler.
 */
export class CORSHandler extends BaseHandler {

  static option = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': 86400
  };

  /**
   * Config option.
   *
   * @param {CORSConfig} option Handler option.
   */
  static config(option: CORSConfig): typeof CORSHandler {
    this.option = option;
    return CORSHandler;
  }

  /**
   * Init CORS of rester instance.
   *
   * @param rester Rester instance.
   */
  static init(rester: Rester): typeof CORSHandler {
    CORSHandler.config({} as any);
    /** If CORS handler on global. */
    const allCORS = rester.configHandlers.get().includes(CORSHandler);
    // map all controllers
    rester.configControllers.get()
      .forEach(controller => {
        const handlersOnController: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, controller) || [];
        /** If CORS handler on controller. */
        const allCORSOnController = handlersOnController.includes(CORSHandler);
        /** Get routes. */
        const routes: Route[] = Reflect.getMetadata(MetadataKey.Controller, controller) || [];
        // for each & set OPTIONS mapping
        routes
          .filter(route => allCORS || allCORSOnController || route.handlers.includes(CORSHandler))
          .filter((route, index, array) => index === array.findIndex(v => v.mapping.path === route.mapping.path))
          .map(route => route.mapping.path)
          .forEach(path => RouterHandler.set(
            {
              controller: undefined as any,
              handlers: [],
              mapping: {
                method: Method.OPTIONS,
                path
              },
              name: undefined as any,
              target: undefined as any
            },
            rester.zone.router
          ));
      });
    return CORSHandler;
  }

  handle(next: () => Promise<any>): Promise<any> {
    for (const header in CORSHandler.option) {
      if (CORSHandler.option.hasOwnProperty(header)) {
        this.response.setHeader(header, CORSHandler.option[header]);
      }
    }
    return next();
  }

}
