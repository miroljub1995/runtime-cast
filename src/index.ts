import * as Joi from 'joi'

class T {
  static object<T>(obj: { [Key in keyof T]: T[Key] }) {
    const objectKeys = {} as Joi.SchemaMap

    for (const [key, value] of Object.entries(obj)) {
      objectKeys[key] = (value as Type<any>).getJoiSchema()
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

  static array<T extends Type<any>>(obj: T) {
    return new Type<T[]>(Joi.array().items(obj.getJoiSchema()).required())
  }
}

type Unwrap<T> = T extends Type<infer U> ?
  U extends object ? { [P in keyof U]: Unwrap<U[P]> } : U :
  T extends object ? { [P in keyof T]: Unwrap<T[P]> } : T

class Type<T> {
  constructor(private schema: Joi.AnySchema) {
  }

  optional() {
    return new Type<T | undefined>(this.schema.optional())
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
    return value as Unwrap<T>
  }
}

export default T