# Change Log

## 0.5.6 => 0.5.7

- docs: update LICENSE
- perf: update author information
- perf: default in development mode
- perf: it is recommended to use code for configuration first

## 0.5.5 => 0.5.6

- feat: update dependencies version

## 0.5.4 => 0.5.5

- fix: fix retry interval

## 0.5.3 => 0.5.4

- feat: add database startup error catch and retry

## 0.5.2 => 0.5.3

- feat: add proxy support in koa application
- feat: support dev mode, use config file server.config.dev.json

## 0.5.1 => 0.5.2

- refactor: update types

## 0.5.0 => 0.5.1

- feat: add CORS_ALLOW_ALL static property in KoaRouter

## 0.4.7 => 0.5.0

- perf: never use KoaBody in OPTIONS and HEAD method
- perf: provide more help information
- feat: support for using server.config.json(cover other) to configure KBS
- feat: use server.config.json instead of ormconfig.json

## 0.4.7 => 0.4.8

- Fixed namespace koa.

## 0.4.6 => 0.4.7

- Now the Server.use method will return the KBS instance.

## 0.4.4 => 0.4.6

- Fixed cookie expires time.
- Now you can set prefix in optional.

## 0.4.3 => 0.4.4

- Fixed cookie expires time.

## 0.4.0 => 0.4.3

- Fixed koa body declare.

## 0.3.5 => 0.4.0

- Remove koa-session package.
- Use redisession package with redis supported.
- **Remove interface AMiddleware, use default interface Middleware.**
- Rewrite CORS middleware.
- Now you should use the KBS.listen() method to start listening.

## 0.3.4 => 0.3.5

- Add types declare into dependencies so that you don't need to install them by yourself.

## 0.3.3 => 0.3.4

- Update dependencies.
- Add static files supported.

## 0.3.2 => 0.3.3

- Use next() method in CORS middleware.
- Finally, it works!

## 0.3.1 => 0.3.2

- Correct wrong override response.
- If no necessary, don't call next() method in middleware.

## 0.3.0 => 0.3.1

- Correct CORS OPTIONS status code.

## 0.2.4 => 0.3.0

- Rewrite interface KBSConfig.
- Rewrite interface RouterPaths.
  - Add regular expression support.
  - Add CORS (Cross-origin resource sharing) support.
  - Optimized loadPaths method.
- Use a separate file to define interfaces or types.

## 0.2.3 => 0.2.4

- Now you can set your API version as the perfix.
- RESTful methods supported.

## 0.2.2 => 0.2.3

- Use [ormconfig.json](https://www.npmjs.com/package/typeorm#quick-start) to save the database information.

## 0.2.1 => 0.2.2

- Nothing, just update this document.

## 0.2.0 => 0.2.1

- Use constructor to connect database.

## 0.1.1 => 0.2.0

- Rewrite KBS constructor method.
- Remove KBS default method.
- Add comments in d.ts.

## 0.1.0 => 0.1.1

- The listening host default to 0.0.0.0 now.

## 2018.11.17-update-2 => 0.1.0

- **Use semantic versioning rules.**
- Add typeorm database supports.
- Other optimizations.

## 2018.11.17-update-1 => 2018.11.17-update-2

- Fix bug: Property 'body' does not exist on type 'Request'. (New interface AMiddleware)
- Add default method to fast start server.
- Add session middleware.
- Use format property to get middleware.
  - `new Middleware().ware`
- Update usage.

## 2018.11.17 => 2018.11.17-update-1

- Update usage.
- Remove some useless dependencies.

## 2018.11.16 => 2018.11.17

- Rewrite frame.
- Remove useless middlewares.
