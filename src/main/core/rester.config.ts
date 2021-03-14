import { Level } from '@iinfinity/logger';
import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { ServerException } from '../exceptions';
import { DatabaseConfig, HTTP2ServerConfig, HTTPSServerConfig } from '../interfaces';

/**
 * Address config.
 *
 * - protocol: 'HTTP' | 'HTTPS' | 'HTTP2'
 * - host: string
 * - port: number
 * - ssl?: HTTPS.ServerOptions | HTTP2.SecureServerOptions
 * - proxy?: boolean
 */
export interface AddressConfig {
  /** Rester Server protocol. */
  protocol: 'HTTP' | 'HTTPS' | 'HTTP2';
  /** Rester Server host. */
  host: string;
  /** Rester Server port. */
  port: number;
  /** Rester Server ssl config, only required in secure server (HTTPS or HTTP2). */
  ssl?: HTTPSServerConfig | HTTP2ServerConfig;
  /** In proxy mode or not. */
  proxy?: boolean;
}

/**
 * Handler poll config.
 *
 * - max: max handlers per categories
 */
export interface HandlerPoolConfig {
  max: number;
}

/**
 * Logger config.
 *
 * - level: logger level, default in production is `INFO`, else `ALL`
 *   - `ALL | OFF | DEBUG | INFO | WARN | ERROR`
 * - trace: exception stack trace, default in production mode = `false`, else `true`
 */
export interface LoggerConfig {
  level: Level;
  trace: boolean;
  outputLog?: string;
  errorLog?: string;
}

export interface ZoneConfig {
  [index: string]: any;
}

/** Rester config. */
export interface ResterConfig {

  addresses: AddressConfig[];
  databases: DatabaseConfig[];
  handlerPool: HandlerPoolConfig;
  logger: LoggerConfig;

}

export const PROD_CONFIG_FILENAME = 'rester.yaml';
export const LOCAL_CONFIG_FILENAME = 'rester.local.yaml';

export const DEFAULT_DEV_CONFIG: ResterConfig = {
  addresses: [{
    protocol: 'HTTP',
    host: 'localhost',
    port: 8080,
  }],
  databases: [{
    type: 'sqlite',
    name: 'default',
    database: 'dev.db',
    synchronize: true,
    logger: 'debug',
  }],
  handlerPool: {
    max: 128,
  },
  logger: {
    level: Level.ALL,
    trace: true,
  },
};

export const DEFAULT_PROD_CONFIG: ResterConfig = {
  addresses: [{
    protocol: 'HTTP',
    host: 'localhost',
    port: 8080,
  }],
  databases: [{
    type: 'sqlite',
    name: 'default',
    database: 'rester.db',
    key: 'rester',
  }],
  handlerPool: {
    max: 4096,
  },
  logger: {
    level: Level.INFO,
    trace: false,
    outputLog: 'output.log',
    errorLog: 'error.log',
  },
};

/**
 * Load config from `rester.yaml` & `rester.local.yaml`.
 *
 * 1. read & parse `rester.yaml`, nullable
 * 2. read & parse `rester.local.yaml`, nullable
 * 3. assign `default config` & `rester.yaml` & `rester.local.yaml` & `input config`
 */
export const loadResterConfig: (inputConfig?: Partial<ResterConfig>) => ResterConfig = (inputConfig = {}) => {
  const mode = process.env.NODE_ENV || 'DEV';
  try {
    const productionConfig: Partial<ResterConfig> = existsSync(PROD_CONFIG_FILENAME)
      ? load(readFileSync(PROD_CONFIG_FILENAME).toString()) as ResterConfig
      : {};
    const localConfig: Partial<ResterConfig> = existsSync(LOCAL_CONFIG_FILENAME)
      ? load(readFileSync(LOCAL_CONFIG_FILENAME).toString()) as ResterConfig
      : {};
    return Object.assign(
      {},
      mode === 'PROD' ? DEFAULT_PROD_CONFIG : DEFAULT_DEV_CONFIG,
      productionConfig,
      inputConfig,
    );
  } catch (error) {
    throw new ServerException('config loading failed, detail: ' + error);
  }
};
