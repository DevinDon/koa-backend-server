import type { MetadataKey } from '../constants';

type MetadataMap = Map<ClassType, ClassMetadataObject>;

type ClassType = Partial<Function>;

type ClassMetadataObject = {
  constructor: PrototypeMetadataObject;
  [prototype: string]: PrototypeMetadataObject;
}

interface PrototypeMetadataObject {
  [metadataKey: string]: any;
}

export class Metadata {

  static PROTOTYPE_CONSTRUCTOR = 'constructor';

  private static storage: MetadataMap = new Map();

  static get<T>(target: ClassType, prototype: keyof ClassMetadataObject, metadataKey: MetadataKey): T | undefined {
    const classMetadataObject = this.storage.get(target);
    return classMetadataObject !== undefined && classMetadataObject[prototype] !== undefined
      ? classMetadataObject[prototype]![metadataKey]
      : undefined;
  }

  static set<T>(target: ClassType, prototype: keyof ClassMetadataObject, metadataKey: MetadataKey, value: T): void {
    const classMetadataObject: ClassMetadataObject = this.storage.get(target) || {};
    const prototypeMetadataObject: PrototypeMetadataObject = Object.assign(
      {},
      classMetadataObject[prototype] || {},
      { [metadataKey]: value },
    );
    const newerClassMetadataObject: ClassMetadataObject = Object.assign(
      {},
      classMetadataObject,
      { [prototype]: prototypeMetadataObject },
    );
    this.storage.set(target, newerClassMetadataObject);
  }

}
