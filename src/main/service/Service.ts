import 'reflect-metadata';
import { Method, Path } from '../@types';
import { DI } from '../decorator/DI';

const ROUTER$SERVICE = 'ROUTER:SERVICE';
const ROUTER$CORS = 'ROUTER:CORS';
const ROUTER$METHOD = 'ROUTER:METHOD';
const ROUTER$PATH = 'ROUTER:PATH';
const ROUTER$SESSION = 'ROUTER:SESSION';

function baseParam(metadataKey: any) {
  return (): ParameterDecorator => (target, key, index) => Reflect.defineMetadata(metadataKey, index, target, key);
}

export const Session = baseParam(ROUTER$SESSION);

function baseMethod(method: Method) {
  return (path: string = ''): MethodDecorator => (target, name, descriptor) => {
    Reflect.defineMetadata(ROUTER$PATH, path, descriptor.value!);
    Reflect.defineMetadata(ROUTER$METHOD, method, descriptor.value!);
  };
}

export const Delete = baseMethod('DELETE');
export const Get = baseMethod('GET');
export const Head = baseMethod('HEAD');
export const Options = baseMethod('OPTIONS');
export const Patch = baseMethod('PATCH');
export const Post = baseMethod('POST');
export const Put = baseMethod('PUT');

export function Service(path: string = ''): ClassDecorator {
  return target => {
    Reflect.defineMetadata(ROUTER$SERVICE, path, target);
    const service = DI.generate(target);
    const paths: Path[] = Object.getOwnPropertyNames(target.prototype)
      .filter(v => v !== 'constructor')
      .map<Path>(name => ({
        method: Reflect.getMetadata(ROUTER$METHOD, target.prototype[name]),
        path: Reflect.getMetadata(ROUTER$PATH, target.prototype[name]),
        // ware: async (context, next) => {
        //   await next();
        //   context.body = service[name].bind(service);
        // }
        name: ''
      }));
    console.log('');
    // Router.load(...paths);
  };
}

// export function CORS(option: CORSOption): MethodDecorator {
//   return (target, name, descriptor) => Reflect.defineMetadata(ROUTER$CORS, option, descriptor.value!);
// }

@Service('/class')
class ABC {

  @Get('/def')
  // @CORS({
  //   'Access-Control-Allow-Headers': '',
  //   'Access-Control-Allow-Methods': [],
  //   'Access-Control-Allow-Origin': ''
  // })
  def(@Session() session: any) {
    session.hello();
  }

  @Post('/ghi')
  ghi() { }

}
