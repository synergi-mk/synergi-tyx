import { Di } from '../import';
import { Metadata } from '../metadata/registry';
import { ServiceMetadata } from '../metadata/service';
import { Class } from '../types/core';
import { Utils } from '../utils';

// tslint:disable:function-name

// TODO (name?: string, ...apis: Function[])
// TODO: Selector
export function Service(alias?: string | Class): ClassDecorator {
  return (target) => {
    Metadata.trace(Service, { api: alias }, target);
    const tmp = Utils.isClass(alias) ? alias.name : alias;
    const meta = ServiceMetadata.define(target).commit(tmp);
    return Di.Service(meta.alias)(target);
  };
}

export function Inject(resource?: string): PropertyDecorator & ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, index?: number) => {
    if (typeof propertyKey === 'symbol') throw new TypeError('propertyKey must be string');
    // propertyKey = propertyKey || "<constructor>";
    Metadata.trace(Inject, { resource }, target, propertyKey, index);
    const constructor = Utils.isClass(target) ? target as Function : target.constructor;
    ServiceMetadata.define(constructor).inject(propertyKey, index, resource);
    return Di.Inject(resource)(target, propertyKey, index);
  };
}

/**
 * Decorate method providing service initialization.
 */
export function Initialize(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Metadata.trace(Handler, {}, target);
    if (typeof propertyKey !== 'string') throw new TypeError('propertyKey must be string');
    ServiceMetadata.define(target.constructor).setInitializer(propertyKey, descriptor);
  };
}

/**
 * Decorate method providing per request activation.
 */
export function Selector(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Metadata.trace(Selector, {}, target);
    if (typeof propertyKey !== 'string') throw new TypeError('propertyKey must be string');
    ServiceMetadata.define(target.constructor).setSelector(propertyKey, descriptor);
  };
}

/**
 * Decorate method providing per request activation.
 */
export function Activate(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Metadata.trace(Activate, {}, target);
    if (typeof propertyKey !== 'string') throw new TypeError('propertyKey must be string');
    ServiceMetadata.define(target.constructor).setActivator(propertyKey, descriptor);
  };
}

/**
 * Decorate method providing per request release.
 */
export function Release(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Metadata.trace(Release, {}, target);
    if (typeof propertyKey !== 'string') throw new TypeError('propertyKey must be string');
    ServiceMetadata.define(target.constructor).setReleasor(propertyKey, descriptor);
  };
}

// TODO: (api: Function, method?: string)
/**
 * Decorate methods providing Api implementation.
 */
export function Handler(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Metadata.trace(Handler, {}, target);
    if (typeof propertyKey !== 'string') throw new TypeError('propertyKey must be string');
    ServiceMetadata.define(target.constructor).addHandler(propertyKey, descriptor);
  };
}
