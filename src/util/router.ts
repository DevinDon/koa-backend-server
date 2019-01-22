import { CORS } from '../@types';

/** Allow all CORS. */
export const CORS_ALLOW_ALL: CORS = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
  'Access-Control-Allow-Origin': '*'
};
