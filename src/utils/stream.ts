import { ServerResponse } from 'http';
import { pipeline, Readable, Writable } from 'stream';

export class BufferStream extends Readable {

  constructor(private buffer: Buffer) {
    super();
  }

  _read() {
    this.push(this.buffer);
    this.push(null);
    this.buffer = null as any;
  }

}

export const pipelines: <R extends Readable, W extends Writable>(from: R, to: W) => Promise<any> =
  async (from, to) => new Promise(
    (resolve, reject) => pipeline(from, to, error => error ? reject(error) : resolve(undefined)),
  );

export const writes: <T>(value: T, response: ServerResponse) => Promise<any> =
  async (value, response) => new Promise(
    (resolve, reject) => response.write(value, error => error ? reject(error) : resolve(undefined)),
  );
