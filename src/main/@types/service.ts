/** CORS, Cross-origin resource sharing. */
export interface CORSOption {
  'Access-Control-Allow-Headers': string;
  'Access-Control-Allow-Methods': string[];
  'Access-Control-Allow-Origin': string;
}

/** Allowed HTTP methods. */
export type Method = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';

// CONST

/** Allow all CORS. */
export const ALLOW_ALL_CORS: CORSOption = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
  'Access-Control-Allow-Origin': '*'
};
