import { Server, Router } from '../dist';
import POSTPATHS from './post';

const server = new Server();
const router = new Router({ POST: POSTPATHS });

server.use(router.routes());
server.listen(80);
