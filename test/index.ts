import Axios from 'axios';
import http2 from 'http2';
import { Agent } from 'https';

const domain = 'http://localhost';

Axios
  .get(`${domain}`)
  .then(v => console.log(`get index: ${v.data}`))
  .catch(e => console.error(e));

Axios
  .post(`${domain}`, { time: Date.now() - 1000000 })
  .then(v => console.log(`post index: ${v.data}`))
  .catch(e => console.error(e));

Axios
  .post(`${domain}/test`, { test: '123test' })
  .then(v => console.log(`post test: ${v.data}`))
  .catch(e => console.error(e));
