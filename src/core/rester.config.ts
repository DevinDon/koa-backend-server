import { Level } from '@rester/logger';
import { ResterORMConfig } from '@rester/orm';
import { existsSync, readFileSync } from 'fs';
import YAML from 'yaml';
import { ServerException } from '../exceptions';
import { HTTP2ServerConfig, HTTPSServerConfig } from '../interfaces';
import { isProd } from '../utils';

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
  logout?: string;
  logerr?: string;
}

export interface ZoneConfig {
  [index: string]: any;
}

/** Rester config. */
export interface ResterConfig {

  addresses: AddressConfig[];
  databases: ResterORMConfig[];
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
  databases: [],
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
  databases: [],
  handlerPool: {
    max: 4096,
  },
  logger: {
    level: Level.INFO,
    trace: false,
    logout: 'output.log',
    logerr: 'error.log',
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
  try {
    const productionConfig: Partial<ResterConfig> = existsSync(PROD_CONFIG_FILENAME)
      ? YAML.parse(readFileSync(PROD_CONFIG_FILENAME).toString()) as ResterConfig
      : {};
    const localConfig: Partial<ResterConfig> = existsSync(LOCAL_CONFIG_FILENAME)
      ? YAML.parse(readFileSync(LOCAL_CONFIG_FILENAME).toString()) as ResterConfig
      : {};
    return Object.assign(
      {},
      isProd() ? DEFAULT_PROD_CONFIG : DEFAULT_DEV_CONFIG,
      productionConfig,
      localConfig,
      inputConfig,
    );
  } catch (error) {
    throw new ServerException('config loading failed, detail: ' + error);
  }
};
