import { IncomingMessage } from 'http';
import { HTTP401Exception } from '../../exceptions';

export const parseToken = (input: string) => {

  if (typeof input !== 'string') {
    throw new HTTP401Exception('Invalid token.');
  }

  const [, token] = input.split(' ');
  if (!token) {
    throw new HTTP401Exception('Invalid token.');
  }

  return token;

};

export const parseTokenFromRequest = (request: IncomingMessage) => {
  return parseToken(request.headers['authorization']!);
};
