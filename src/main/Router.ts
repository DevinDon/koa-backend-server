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

  /** Special path in router. `Map.get(''); Map.set('%');` */
  private static SpecialPath = { route: '', variable: '%' };

  /** Core router. `Map<Method, Map>` */
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
      /** Current router. */
      let router: Map<string, any> = Router.router;
      /** Special route, maybe undefined(not found). */
      let route: Route | undefined;
      /** Format path and then concat with method, result: `POST/sign/in` */
      const path = mapping.method + Router.format(mapping.path);
      // Split path by `/`, result: `['POST', 'sign', 'in']`
      path.split('/').filter(v => v.length > 0)
        // foreach & get router / route
        .forEach((v, i, a) => {
          // if string path doesn't exist, try to get variable path
          router = router.get(v) || router.get(Router.SpecialPath.variable);
          // if match end, return the route
          if (a.length === i + 1) {
            route = router.get(Router.SpecialPath.route);
          }
        });
      return route;
    } catch (exception) { // catch route not found exception
      console.log(`Route '${mapping.method}${mapping.path}' not found, ${exception}.`);
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
    /** Current router. */
    let router: Map<string, any> = Router.router;
    /** Format path and then concat with method, result: `POST/sign/in` */
    const path = mapping.method + Router.format(mapping.path);
    // Split path by `/`, result: `['POST', 'sign', 'in']`
    path.split('/').filter(v => v.length > 0)
      // foreach & get router / route
      .forEach((v, i, a) => {
        // if router has key of `v`, get it
        // else set `v` & get it
        router = (router.has(v) ? router : router.set(v, new Map())).get(v);
        // if match end, set the route
        if (a.length === i + 1) {
          router.set(Router.SpecialPath.route, route);
        }
      });
    // return route
    return route;
  }

}
