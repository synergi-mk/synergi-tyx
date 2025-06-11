import { Schema } from '../decorators/schema';
import { Field } from '../decorators/type';
import { IEnumMetadata } from '../metadata/enum';
import { IDesignMetadata, IFieldMetadata } from '../metadata/field';
import { IArgMetadata } from '../metadata/input';
import { IResultMetadata } from '../metadata/result';
import { ITypeMetadata } from '../metadata/type';
import { IVarMetadata, IVarResolution, VarKind, VarRole } from '../metadata/var';
import { Class, SchemaResolvers } from '../types/core';
import { SchemaUtils } from './utils';

@Schema()
export class VarResolutionSchema implements IVarResolution {
  @Field(String) kind: VarKind;
  @Field((type) => VarMetadataSchema) target: IVarMetadata;
  @Field() js: string;
  @Field() idl: string;
  @Field() gql: string;
}

@Schema()
export class VarMetadataSchema implements IVarMetadata {
  @Field(String) kind: VarKind;
  @Field(String) ref?: Class;
  @Field((type) => VarResolutionSchema) res?: IVarResolution;

  public static RESOLVERS: SchemaResolvers<IVarMetadata> = {
    ref: (obj) => SchemaUtils.label(obj.ref),
  };
}

@Schema()
export class ArgMetadataSchema implements IArgMetadata {
  @Field(0) index: number;
  @Field() name: string;
  @Field(String) kind: VarKind;
  @Field(String) design: Class;
  @Field(String) ref?: Class;
  @Field() defined: boolean;
  @Field((type) => VarMetadataSchema) item?: IVarMetadata;
  @Field((type) => VarResolutionSchema) res: IVarResolution;

  public static RESOLVERS: SchemaResolvers<IArgMetadata> = {
    design: (obj) => SchemaUtils.label(obj.design),
    ref: (obj) => SchemaUtils.label(obj.ref)
  };
}

@Schema()
export class ResultMetadataSchema implements IResultMetadata {
  @Field(String) kind: VarKind;
  @Field(String) design: Class;
  @Field() promise: boolean;
  @Field(String) ref?: Class;
  @Field() defined: boolean;
  @Field((type) => VarMetadataSchema) item?: IVarMetadata;
  @Field((type) => VarResolutionSchema) res: IVarResolution;

  public static RESOLVERS: SchemaResolvers<IResultMetadata> = {
    design: (obj) => SchemaUtils.label(obj.design),
    ref: (obj) => SchemaUtils.label(obj.ref),
  };
}

@Schema()
export class EnumMetadataSchema implements IEnumMetadata {
  @Field() name: string;
  @Field(String) kind: VarKind;
  @Field(String) ref: any;
  @Field([String]) options: string[];

  public static RESOLVERS: SchemaResolvers<IEnumMetadata> = {
    ref: (obj) => SchemaUtils.label(obj.ref),
  };
}

@Schema()
export class FieldMetadataSchema implements IFieldMetadata {
  @Field(String) kind: VarKind;
  @Field() name: string;
  @Field(String) role: VarRole;
  @Field() mandatory: boolean;
  @Field(Object) design: IDesignMetadata;
  @Field(String) ref?: Class;
  @Field((ref) => VarMetadataSchema) item?: IVarMetadata;
  @Field((ref) => VarResolutionSchema) res: IVarResolution;

  public static RESOLVERS: SchemaResolvers<IFieldMetadata> = {
    ref: (obj) => SchemaUtils.label(obj.ref),
  };
}

@Schema()
export class TypeMetadataSchema implements ITypeMetadata {
  @Field(String) kind: VarKind;
  @Field() name: string;
  @Field(String) target: Class;
  @Field((ref) => VarMetadataSchema) item: never;
  @Field((list) => [FieldMetadataSchema]) members: Record<string, IFieldMetadata>;

  public static RESOLVERS: SchemaResolvers<ITypeMetadata> = {
    target: (obj) => SchemaUtils.label(obj.target),
    members: (obj, args) => SchemaUtils.filter(obj.members, args),
  };
}
