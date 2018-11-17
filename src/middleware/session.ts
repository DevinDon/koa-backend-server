import Koa, { Middleware } from 'koa';
import KoaSession, { opts } from 'koa-session';

export class Session {

  private session: Middleware;

  constructor(app: Koa, keys: string[] = ['default'], private config: Partial<opts> = { key: 'session', rolling: true }) {
    this.session = KoaSession(config, app);
    app.keys = keys;
  }

  public get ware(): Middleware {
    return this.session;
  }

}

export default Session;
