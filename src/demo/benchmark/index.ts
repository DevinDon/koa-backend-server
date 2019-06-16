import { createServer } from 'http';

const server = createServer((request, response) => {
  console.log(1);
  response.end(JSON.stringify({ hello: 'world' }));
}).listen(8080);
