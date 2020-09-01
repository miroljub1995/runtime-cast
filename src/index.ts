import * as Joi from '@hapi/joi'

class T {
  static object<T extends { [key: string]: Type<unknown> }>(obj: T) {
    const objectKeys: Joi.SchemaMap = {}
    for (const [key, value] of Object.entries(obj)) {
      objectKeys[key] = value.getJoiSchema()
    }

    return new Type<T>(Joi.object(objectKeys).required())
  }

  static boolean() {
    return new Type<boolean>(Joi.boolean().required())
  }

  static string() {
    return new Type<string>(Joi.string().required())
  }

  static number() {
    return new Type<number>(Joi.number().required())
  }

  static array<T>(obj: Type<T>) {
    return new Type<T[]>(Joi.array().items(obj.getJoiSchema()).required())
  }

  static union<T1, T2>(t1: Type<T1>, t2: Type<T2>): Type<T1 | T2>
  static union<T1, T2, T3>(t1: Type<T1>, t2: Type<T2>, t3: Type<T3>): Type<T1 | T2 | T3>
  static union<T1, T2, T3, T4>(t1: Type<T1>, t2: Type<T2>, t3: Type<T3>, t4: Type<T4>): Type<T1 | T2 | T3 | T4>
  static union<T1, T2, T3, T4, T5>(t1: Type<T1>, t2: Type<T2>, t3: Type<T3>, t4: Type<T4>, t5: Type<T5>): Type<T1 | T2 | T3 | T4 | T5>
  static union<T1, T2, T3, T4, T5>(t1: Type<T1>, t2: Type<T2>, t3?: Type<T3>, t4?: Type<T4>, t5?: Type<T5>) {
    let altSchemas = [t1.getJoiSchema(), t2.getJoiSchema()]
    if (typeof t3 !== 'undefined')
      altSchemas = [...altSchemas, t3.getJoiSchema()]
    if (typeof t4 !== 'undefined')
      altSchemas = [...altSchemas, t4.getJoiSchema()]
    if (typeof t5 !== 'undefined')
      altSchemas = [...altSchemas, t5.getJoiSchema()]
    return new Type<T1 | T2 | T3 | T4 | T5>(Joi.alternatives(altSchemas).required())
  }
}

export type TypeOf<T> = T extends Type<infer U> ?
  U extends object ? { [K in keyof U]: TypeOf<U[K]> } : U :
  T extends object ? { [K in keyof T]: TypeOf<T[K]> } : T

class Type<T> {
  constructor(private schema: Joi.AnySchema) {
  }

  optional() {
    return new Type<T | undefined>(this.schema.optional())
  }

  nullable() {
    return new Type<T | null>(this.schema.allow(null))
  }

  getJoiSchema() {
    return this.schema
  }

  cast<U>(value: U) {
    const { error } = this.schema.validate(value, {
      abortEarly: true
    })
    if (typeof error !== 'undefined')
      throw error;
    return value as TypeOf<T>
  }
}

export default T