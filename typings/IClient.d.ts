import { Method } from 'axios';
import { IContext } from '@community/scripts';

export declare namespace IClient {
  interface Generic<Type extends string, Model> {
    readonly type: Type;
  }

  interface ExportableInterface<Type extends string, Model> extends Generic<Type, Model> {
    export(token: string, context: IContext): Promise<Model[]>;
  }

  type Interface<Type extends string, Model> = Generic<Type, Model> | ExportableInterface<Type, Model>;

  interface Instance {
    async send(method: Method, path: string, token: string, data?: unknown);
  }

  interface Result<Data, Meta = never> {
    data: Data;
    included: unknown[];
    meta: Meta
  }

  interface Data<Type, Attributes, Relationships = unknown, Meta = never> {
    type: Type;
    id: string;
    attributes: Attributes;
    relationships: Relationships;
    meta: Meta;
  }

  type Relationship<Type> = {
    data: {
      type: Type;
      id: string;
    };
  };

  type Relationships<Type> = {
    data: Array<{
      type: Type;
      id: string;
    }>;
  };

  type Dump<Type, Model> = {
    type: Type;
    data: Model[];
  };
}
