/** CORS, Cross-origin resource sharing 跨域请求. */
export interface CORS {
  'Access-Control-Allow-Headers': string;
  'Access-Control-Allow-Methods': string[];
  'Access-Control-Allow-Origin': string;
}

/** 路径名: 路径处理方式. */
export interface RouterPaths {
  [index: string]: {
    path: string | RegExp | (string | RegExp)[];
    ware: any;
    cors?: CORS;
  };
}

/** 所有的路由路径. */
export interface AllPaths {
  DELETE?: RouterPaths;
  GET?: RouterPaths;
  HEAD?: RouterPaths;
  OPTIONS?: RouterPaths;
  PATCH?: RouterPaths;
  POST?: RouterPaths;
  PUT?: RouterPaths;
}

/** 接受的请求方法. */
export type Methods = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
