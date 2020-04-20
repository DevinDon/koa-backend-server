import { createServer, IncomingMessage, ServerResponse } from 'http';
import { createInterface } from 'readline';
import { createWriteStream } from 'fs';

const keymap = {
  CR: 0x0d,
  LF: 0x0a,
  DASH: 0x2d
};

const server = createServer(handler);

server.listen(8080);



function handler(request: IncomingMessage, response: ServerResponse) {

  // if (!request.headers['content-disposition']) {
  //   return 0;
  // }

  // const boundary = Buffer.from(
  //   request.headers['content-disposition']
  //     .match(/boundary=(.*)/)![1]
  // );

  // request.on('data', (chunk: Buffer) => {

  //   console.log('CHUNK: ' + chunk.length);

  //   const length = chunk.length;
  //   let start = 0; // data start
  //   let end = length; // data end

  //   for (let i = 0; i < length; i++) {
  //     if (chunk[i] === keymap.DASH) {

  //     }
  //   }

  // });

  request.pipe(createWriteStream('test.file'));

  // request.on('data', (chunk: Buffer) => console.log(`DATA: ${chunk.length}`));
  // request.on('end', () => console.log('END'));

}
