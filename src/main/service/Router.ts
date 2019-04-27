import KoaRouter from 'koa-router';
import KoaBody from 'koa-body';
import { Path } from '../@types';
import { Middleware } from 'koa';
import { logger } from '..';

export module Router {

  const router = new KoaRouter();
  const body = KoaBody();

  export function load(...paths: Path[]) {
    for (const path of paths) {
      switch (path.method) {
        case 'DELETE':
          router.delete(path.value, body, path.ware);
          break;
        case 'GET':
          router.get(path.value, path.ware);
          break;
        case 'HEAD':
          router.head(path.value, path.ware);
          break;
        case 'OPTIONS':
          router.options(path.value, path.ware);
          break;
        case 'PATCH':
          router.patch(path.value, body, path.ware);
          break;
        case 'POST':
          router.post(path.value, body, path.ware);
          break;
        case 'PUT':
          router.put(path.value, body, path.ware);
          break;
        default:
          logger.warn(`Unkown method: ${path.method}`);
          break;
      }
    }
  }

  export const ware: Middleware = router.middleware() as Middleware;

}

export default Router;
