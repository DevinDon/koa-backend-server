import { Method } from './@types';

/**
 * Mapping, with method & path.
 */
export interface Mapping {
  method: Method;
  path: string;
}

/**
 * Route, with function name, target & controller instance.
 */
export interface Route {
  name: string;
  target: Function;
  controller: any;
}

/**
 * Router.
 *
 * Route is a single, basic unit.
 *
 * Routes is a set of route.
 *
 * Router is a module to control all routes.
 */
export class Router {

  /**
   * Core router, Map<Method, Map>.
   */
  private static router: Map<Method, Map<string, any>> = new Map();

  /**
   * Format route path.
   *
   * First, `replace(/\/+/g, '/')`
   *
   * And then, `replace(/\/+$/, '')`
   *
   * Example:
   *
   * Input: `//abc//def/`
   * Output: `/abc/def`
   *
   * Input: `///`
   * Output: `/`
   *
   * @param {string} path Mapping path.
   */
  private static format(path: string): string {
    return path.replace(/\/+/g, '/').replace(/(.+)\/$/, '$1');
  }

  /**
   * Get special route.
   *
   * @param {Mapping} mapping Mapping information.
   * @returns Route. If not found, return undefined.
   */
  static get(mapping: Mapping): Route | undefined {
    try {
      /** Such as: `POST/sign/in` */
      const path = mapping.method + Router.format(mapping.path);
      /** Such as: `['POST', 'sign', 'in']` */
      const arr = path.split('/').filter(v => v.length > 0);
      /** Maybe route, exception or `Method`. */
      const result = arr.reduce((previous, current, index, array): any => {
        // first step
        if (index === 1) {
          const router = Router.router.get(previous as Method)!.get(current);
          if (array.length === 2) { // get route
            return router.get('');
          }
          return router;
        } else {
          const router = (previous as any as Map<string, any>).get(current);
          if (array.length === index + 1) { // get route
            return router.get('');
          }
          return router;
        }
      });
      // If result is method, such as `POST/` to `['POST']` to `POST`,
      // it means get the root mapping
      if (result === mapping.method) {
        return Router.router.get(mapping.method)!.get('');
      }
      return result as any;
    } catch (exception) { // catch route not found exception
      return undefined;
    }
  }

  /**
   * Set mapping to core router.
   *
   * @param {Mapping} mapping Mapping information.
   * @param {Route} route Route.
   * @throws If the path already has a route, throw an error.
   */
  static set(mapping: Mapping, route: Route): Route {
    const path = mapping.method + Router.format(mapping.path);
    const result = path.split('/').filter(v => v.length > 0)
      .reduce((previous, current, index, array): any => {
        if (index === 1) {
          const router = Router.getMap(Router.getMap(Router.router, previous), current);
          if (array.length === 2) {
            if (router.has('')) { // route has already existed
              throw new Error(`${path} has already existed`);
            }
            router.set('', route); // set route
          }
          return router;
        } else {
          const router = Router.getMap(previous as any, current);
          if (array.length === index + 1) {
            if (router.has('')) { // route has already existed
              throw new Error(`${path} has already existed`);
            }
            router.set('', route); // set route
          }
          return router;
        }
      });
    if (result === mapping.method) {
      Router.getMap(Router.router, mapping.method).set('', route);
    }
    return route;
  }

}
