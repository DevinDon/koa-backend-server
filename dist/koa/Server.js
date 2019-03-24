"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const http_1 = __importDefault(require("http"));
const http2_1 = __importDefault(require("http2"));
const https_1 = __importDefault(require("https"));
const koa_1 = __importDefault(require("koa"));
const koa_static_1 = __importDefault(require("koa-static"));
const redisession_1 = require("redisession");
const database_1 = require("../database");
const middleware_1 = require("../middleware");
const util_1 = require("../util");
/**
 * KBS, Koa Backend Server.
 */
class Server {
    /**
     * Create a KBS, Koa Backend Server.
     * @param {KBSConfig} config KBS Server options.
     */
    constructor(config) {
        // Load config from profile.
        try {
            // Default in development mode, use `npm start prod` to enable production mode.
            const prod = Boolean(process.argv.find(v => v === 'prod'));
            console.log(`${util_1.now()}\tKoa Backend Server is on ${prod ? 'production' : 'development'} mode.`);
            const json = JSON.parse(fs_1.readFileSync(prod ? 'server.config.json' : 'server.config.dev.json').toString());
            // The profile will cover config.
            this.config = Object.assign({}, json, config);
            for (const key in this.config) {
                if (this.config.hasOwnProperty(key)) {
                    Object.assign(this.config[key], json[key]);
                }
            }
        }
        catch (err) {
            console.log(`${util_1.now()}\tProfile server.config.json not found or cannot be parse, disable it. Detail: ${err}`);
            this.config = config || {};
        }
        // Init KBS.
        this.init();
    }
    /**
     * Init KBS.
     * @returns {Promise<void>} Void.
     */
    async init() {
        this.application = new koa_1.default();
        // Create server.
        if (this.config.address) { // Select portocol.
            switch (this.config.address.portocol) {
                case 'HTTP':
                    this.server = http_1.default.createServer(this.application.callback());
                    break;
                case 'HTTP2':
                    this.server = http2_1.default.createSecureServer(this.config.address.ssl || {}, this.application.callback());
                    break;
                case 'HTTPS':
                    this.server = https_1.default.createServer(this.config.address.ssl || {}, this.application.callback());
                    break;
                default:
                    this.server = http_1.default.createServer(this.application.callback());
                    console.log(`${util_1.now()}\tUnkoown portocol or unset portocol: ${this.config.address.portocol}, use default portocol HTTP`);
                    break;
            }
            this.app.proxy = Boolean(this.config.address.proxy);
        }
        else { // Default to HTTP.
            this.server = http_1.default.createServer(this.application.callback());
            console.log(`${util_1.now()}\tUse default portocol HTTP`);
        }
        // Create database connection or not.
        if (this.config.database) {
            this.database = new database_1.Database(this.config.database);
        }
        else {
            console.log(`${util_1.now()}\tDatabase not connected.`);
        }
        // Use session middleware or not.
        if (this.config.session) {
            this.session = new redisession_1.RediSession(this.application, this.config.session);
            this.use(this.session.ware);
        }
        else {
            console.log(`${util_1.now()}\tSession service not provided.`);
        }
        // Config router or not.
        if (this.config.router) {
            this.router = new middleware_1.Router(this.config.router.paths, this.config.router.version);
            this.use(this.router.ware);
            if (this.config.router.static && this.config.router.static.path) {
                this.use(koa_static_1.default(this.config.router.static.path, this.config.router.static.options));
                console.log(`${util_1.now()}\tStatic resource path: ${this.config.router.static.path}`);
            }
            else {
                console.log(`${util_1.now()}\tStatic server service not provided.`);
            }
        }
        else {
            console.warn(`${util_1.now()}\tRouting service not provided.`);
        }
    }
    /**
     * Use middlewares.
     * @param {Middleware[]} middlewares Middlewares.
     * @returns {Server} This server.
     */
    use(...middlewares) {
        for (const middleware of middlewares) {
            this.application.use(middleware);
            console.log(`${util_1.now()}\tUse middleware: ${middleware.name || middleware.toString()}`);
        }
        return this;
    }
    /**
     * Listening on some where.
     * @param {number} port Listening port, default to 8080.
     * @param {string} host The listening host, default to 0.0.0.0.
     * @returns {Promise<Server>} This server.
     */
    async listen(host, port) {
        if (this.database) {
            console.log(`${util_1.now()}\tConnecting to database, please wait...`);
            await this.database.connect();
            console.log(`${util_1.now()}\tDatabase connected.`);
        }
        this.server.listen(port = port || (this.config.address && this.config.address.port) || 8080, host = host || (this.config.address && this.config.address.host) || '0.0.0.0', () => console.log(`${util_1.now()}\tServer online, address is ${host}:${port}`));
        return this;
    }
    /**
     * @returns {Koa} This Koa instance.
     */
    get app() {
        return this.application;
    }
}
exports.Server = Server;
exports.default = Server;
