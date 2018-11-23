# Change Log

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
