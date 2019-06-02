export function Handler(): ClassDecorator {
  return target => {
    // const pool: HandlerPool = Injector.generate(HandlerPool);
    // const handlers: BaseHandler[] = Reflect.getMetadata(MetadataKey.Handler, HandlerPool) || [];
    // Reflect.defineMetadata(MetadataKey.Handler, handlers, HandlerPool);
  };
}
