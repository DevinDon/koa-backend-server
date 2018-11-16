import { KoaHTTP, logger, KoaRouter } from '../dist';
import getPaths from './get';
import postPaths from './post';

const app = new KoaHTTP();

app.use(logger);
app.use(new KoaRouter({ GET: getPaths, POST: postPaths }).routes());

app.listening();
