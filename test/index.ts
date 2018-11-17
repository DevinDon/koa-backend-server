import { Router, Server, Session } from '../dist';
import { postPaths } from './post';

// const server = new Server();
// const router = new Router({ POST: postPaths });
// const session = new Session(server.app);

// server.use(session.ware);
// server.use(router.ware);

// server.listen(80);
const server = new Server();
server.default({ POST: postPaths });
