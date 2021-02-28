/* eslint-disable no-case-declarations */
import { logger } from '@iinfinity/logger';

const boundary = 'ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC';
const iboundary = '--' + boundary;
const s1 = `
--ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC
Content-Disposition: form-data; name="city"

Santa colo
--ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC
Content-Disposition: form-data;name="desc"
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit

... 8bit data ...
--ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC
Content-Disposition: form-data;name="pic"; filename="photo.jpg"
Content-Type: application/octet-stream
Content-Transfer-Encoding: binary

... binary data of the jpg ...
--ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC--`;

const buffer = Buffer.from(s1);
const keys = {
  br: 0x0a,
  dash: 0x2d
};

const parts: any[] = [];
const part = {
  start: 0,
  end: 0
};
const line = {
  start: 0,
  end: 0
};

for (let i = 0; i < buffer.length; i++) {
  const c = buffer[i];
  logger.log(c.toString(16));
  switch (c) {
    case keys.br:
      // check if boundary
      const allowDash = buffer.length > i + 3;
      const isDash = buffer[i + 1] === keys.dash && buffer[i + 2] === keys.dash;
      if (allowDash && isDash) {
        logger.log('start with dash');
        const start = i + 3;
        const end = start + boundary.length;
        // check if out of buffer
        const allowBoundary = buffer.length >= end + 2;
        if (allowBoundary) {
          // get delimiter
          const delimiter = buffer.toString('utf8', start, end);
          // check if delimiter === boundary
          const tag2 = delimiter === boundary;
          if (tag2) {
            part.end = i;
            i = end;
            const data = buffer.toString('utf8', part.start, part.end);
            parts.push(parseData(data));
            part.start = i;
          }
        }
      } else {
        logger.log('start with data', line.start);
      }
      break;
    default:
      // default is data
      break;
  }
}

function parseData(data: string) {
  // const disposition = data.match(/Disposition: (.+?);/);
  const name = data.match(/name="(.+?)"/);
  const filename = data.match(/filename="(.+?)"/);
  const type = data.match(/Content-Type: (.+?)/);
  const encoding = data.match(/Content-Transfer-Encoding: (.*)/);
  return { name, filename, type, encoding };
}
