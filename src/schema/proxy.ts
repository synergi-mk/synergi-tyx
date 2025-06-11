import { Schema } from '../decorators/schema';
import { Field } from '../decorators/type';
import { IApiMetadata } from '../metadata/api';
import { IProxyMetadata } from '../metadata/proxy';
import { IHandlerMetadata, IInjectMetadata, IServiceMetadata } from '../metadata/service';
import { Class, SchemaResolvers } from '../types/core';
import { ApiMetadataSchema } from './api';
import { HandlerMetadataSchema, InjectMetadataSchema, ServiceMetadataSchema } from './service';
import { SchemaUtils } from './utils';

@Schema()
export class ProxyMetadataSchema implements IProxyMetadata {
  @Field(String) target: Class;
  @Field() name: string;
  @Field() final: boolean;
  @Field() alias: string;
  @Field() inline: boolean;
  @Field((ref) => ApiMetadataSchema) api: IApiMetadata;
  @Field((ref) => ServiceMetadataSchema) base: IServiceMetadata;

  @Field() application: string = undefined;
  @Field() functionName: string = undefined;

  @Field((list) => [InjectMetadataSchema]) dependencies: Record<string, IInjectMetadata>;
  @Field((item) => [HandlerMetadataSchema]) handlers: Record<string, IHandlerMetadata>;

  @Field((ref) => HandlerMetadataSchema) initializer: IHandlerMetadata;
  @Field((ref) => HandlerMetadataSchema) selector: IHandlerMetadata;
  @Field((ref) => HandlerMetadataSchema) activator: IHandlerMetadata;
  @Field((ref) => HandlerMetadataSchema) releasor: IHandlerMetadata;

  @Field() source: string;

  public static RESOLVERS: SchemaResolvers<IProxyMetadata> = {
    target: (obj) => SchemaUtils.label(obj.target),
    dependencies: (obj, args) => SchemaUtils.filter(obj.dependencies, args),
    handlers: (obj, args) => SchemaUtils.filter(obj.handlers, args),
    source: (obj) => obj.target.toString(),
  };
}
