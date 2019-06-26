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
  static config(option: CORSConfig): void {
    this.option = option;
  }

  /**
   * Init CORS of rester instance.
   *
   * @param rester Rester instance.
   */
  static init(rester: Rester): void {
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
          .filter(route => route.mapping.method !== Method.OPTIONS)
          .forEach(route => {
            if (allCORS || allCORSOnController || route.handlers.includes(CORSHandler)) {
              RouterHandler.set(
                {
                  controller: undefined as any,
                  handlers: route.handlers,
                  mapping: {
                    method: Method.OPTIONS,
                    path: route.mapping.path
                  },
                  name: undefined as any,
                  target: route.target
                },
                rester.zone.router
              );
            }
          });
      });
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
