# Change Log

## 0.13.7 => 0.13.8

- fix(handlers/pool): fix pool max config

## 0.13.6 => 0.13.7

- perf(handlers/pool): add pool compose trace

## 0.13.5 => 0.13.6

- feat(rester): add reset methods

## 0.13.4 => 0.13.5

- perf(declares): remove declares

## 0.13.3 => 0.13.4

- fix(handlers/cors): fix cors headers

## 0.13.1 => 0.13.2

- feat(response): add redirect response

## 0.13.0 => 0.13.1

- chore(npm): update deps
- docs(readme): update readme & usage

## 0.12.10 => 0.13.0

- refactor(app): refactor project structure
- refactor(decorators/injector): refactor injector methods
- perf(core/rester): use yaml instead of json config
- chore(eslint): update lint config
- refactor(core): refactor core components
- perf(demo): remove useless demo & update new demo
- perf(handlers): optimize config & scheam handler
- perf(core): inject logger & rester instance in views & controllers
  - [x] perf(demo/simple): view
  - [x] perf(demo/entity): entity & view
  - [x] perf(demo/exception): more exceptions
  - [x] perf(demo/static): serve static files
  - [x] perf(demo/upload): parse upload data
  - [x] perf(demo/full): full project

## 0.12.8 => 0.12.10

- feat(handler): support handler config & add logger & resource handler

## 0.12.7 => 0.12.8

- fix(injector): fix view decorator

## 0.12.6 => 0.12.7

- perf(hook): add init hook for controller

## 0.12.5 => 0.12.6

- perf(decorator): add try catch block

## 0.12.4 => 0.12.5

- perf(decorator): add init hook after controller init

## 0.12.3 => 0.12.4

- perf(util/validator): add type declare to params
- fix(util/body-parser): catch JSON parse error
- perf(rester): await database connection before listen

## 0.12.2 => 0.12.3

- fix(handler/exception): add response header with type json

## 0.12.1 => 0.12.2

- fix(handler/exception): stringify exception content

## 0.12.0 => 0.12.1

- feat(@util/validator): check required params in fields

## 0.11.1 => 0.12.0

- fix(decorator/mapping): fix POST mapping decorator description
- perf(handler/router): use ':variable' instead of '{{variable}}

## 0.11.0 => 0.11.1

- perf(@util/validator): null check function only need an object param

## 0.10.24 => 0.11.0

- perf(database): support multi connections
- feat(@util): add new utils, such params check

## 0.10.23 => 0.10.24

- feat(util/body-parser): parts to object

## 0.10.22 => 0.10.23

- perf(handler/exception): display router path for exception

## 0.10.21 => 0.10.22

- feat(util/body-parser): able to parse x-www-form-urlencoded

## 0.10.19 => 0.10.21

- feat(util): export all from util, use `import {} from '@rester/core/util`
- fix(handler): all global handler will run thought exception

## 0.10.18 => 0.10.19

- feat(rester): add connection field

## 0.10.17 => 0.10.18

- feat(handler/parameter): add zone param injector
- fix(handler/base): fix prop init

## 0.10.16 => 0.10.17

- feat(handler/base): add zone for each request

## 0.10.14 => 0.10.16

- fix(util/body-parser): fix parse of content type

## 0.10.13 => 0.10.14

- perf(handle/pool): handle compose exception
- perf(handle/exception): optimize exception output
- perf(rester): default in dev mode

## 0.10.12 => 0.10.13

- feat(handler/exception): determine whether to display stack info through the debug flag

## 0.10.11 => 0.10.12

- feat(decorator): support custom parameter handler

## 0.10.10 => 0.10.11

- fix(handler/exception): exception should log detail, with stack and other information, ISSUE [28](https://github.com/DevinDon/rester-core/issues/28)

## 0.10.9 => 0.10.10

- chore(npm): remove optional deps

## 0.10.8 => 0.10.9

- perf(handler/parameter): when content length > 10m, user should parse it by self

## 0.10.7 => 0.10.8

- fix(handler/exception): exception content should be stringify

## 0.10.6 => 0.10.7

- fix(handler/schema): schema should not overwrite existing request headers

## 0.10.5 => 0.10.6

- feat(rester): load config & save to rester.zone

## 0.10.3 => 0.10.5

- feat(handler/parameter): add body parser

## 0.10.2 => 0.10.3

- perf(main): add '/' before path

## 0.10.0 => 0.10.2

- perf(handler/exception): add warn & error message when server exception

## 0.9.6 => 0.10.0

- refactor: refactor MVC Arch Mode, PR [#25](https://github.com/DevinDon/rester-core/pull/25)
- fix(handler/exception): fix exception handler

## 0.9.5 => 0.9.6

- perf(handler): configurable exception handler, PR [#24](https://github.com/DevinDon/rester-core/pull/24), ISSUE [#23](https://github.com/DevinDon/rester-core/issues/23)

## 0.9.4 => 0.9.5

- perf(rester): perf load config method

## 0.9.3 => 0.9.4

- perf(rester): support retry when db connect failed, PR [#22](https://github.com/DevinDon/rester-core/pull/22)

## 0.9.2 => 0.9.3

- perf(handler/base): perf handler config, PR [#21](https://github.com/DevinDon/rester-core/pull/21)
- fix(handler/cors): fix cors handler, PR [#21](https://github.com/DevinDon/rester-core/pull/21)

## 0.9.1 => 0.9.2

- chore(npm): add typeorm to deps

## 0.9.0 => 0.9.1

- perf(handler): perf return type of handler#init & config

## 0.8.2 => 0.9.0

- feat(rester): add chained call methods, PR [#6](https://github.com/DevinDon/rester-core/pull/6), ISSUE [#11](https://github.com/DevinDon/rester-core/issues/11)
- feat(handler/base): configurable handler support, PR [#10](https://github.com/DevinDon/rester-core/pull/10), ISSUE [#9](https://github.com/DevinDon/rester-core/issues/9)
- fix(decorator/mapping): fix the error that multi-mapping not works, PR [#16](https://github.com/DevinDon/rester-core/pull/16), ISSUE [#13](https://github.com/DevinDon/rester-core/issues/13)
- feat(decorator/handler): multi-handler support, PR [#17](https://github.com/DevinDon/rester-core/pull/17), ISSUE [#14](https://github.com/DevinDon/rester-core/issues/14)
- feat(handler/cors): CORS support, PR [#19](https://github.com/DevinDon/rester-core/pull/19), ISSUE [#15](https://github.com/DevinDon/rester-core/issues/15)
- feat(rester): JSON config file support, ISSUE [#20](https://github.com/DevinDon/rester-core/issues/20)
- perf: some optimizations, PR [#19](https://github.com/DevinDon/rester-core/pull/19)

## 0.8.1 => 0.8.2

- fix(rester): fix return declaration of config* methods, PR [#11](https://github.com/DevinDon/rester-core/pull/11)

## 0.8.0 => 0.8.1

- docs: fix readme document

## 0.7.4 => 0.8.0

- feat: work like spring boot
- chore: change package name to `@rester/core`

## 0.7.3 => 0.7.4

- fix: fix database connection exception

## 0.7.2 => 0.7.3

- chore: perf package
- refactor: refactor option

## 0.7.1 => 0.7.2

- perf: perf next function
- chore: update typescript to 3.4.1

## 0.7.0 => 0.7.1

- refactor: refactor project

## 0.6.0 => 0.7.0

- feat: add development / production mode in Server Config
- refactor: refactor namespace / module
- perf: show middleware name when use
- fix: fix some bugs & update package

## 0.5.7 => 0.6.0

- perf: deprecated api version, use accept header to instead
- feat: use node-color-log to be default logger
- fix: fix message output when database connection failed
- fix: catch redis connection failed
- refactor: replace the project name with 'rester'

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
