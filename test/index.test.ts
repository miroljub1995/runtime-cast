import { expect } from 'chai';
import 'mocha';
import T from '../src/index';

describe('Test', () => {
  it('should cast boolean', () => {
    const schema = T.object({
      a: T.boolean()
    })

    const val = schema.cast({ a: true })

    expect(val).to.deep.equal({ a: true })
  })

  it('should cast string', () => {
    const schema = T.object({
      a: T.string()
    })

    const val = schema.cast({ a: "true" })

    expect(val).to.deep.equal({ a: "true" })
  })

  it('should cast number', () => {
    const schema = T.object({
      a: T.number()
    })

    const val = schema.cast({ a: 1 })

    expect(val).to.deep.equal({ a: 1 })
  })

  it('should cast nullable', () => {
    const schema = T.object({
      a: T.number().nullable()
    })

    const val = schema.cast({ a: null })

    expect(val).to.deep.equal({ a: null })
  })

  it('should fail', () => {
    const schema = T.object({
      a: T.boolean(),
      b: T.boolean()
    })

    expect(() => schema.cast({ a: true })).to.throw()
  })

  it('should cast nested object', () => {
    const schema = T.object({
      a: T.boolean(),
      b: T.object({
        c: T.number(),
        d: T.string()
      })
    })

    const val = schema.cast({
      a: true,
      b: {
        c: 1,
        d: 'aaa'
      }
    })

    expect(val).to.deep.equals({
      a: true,
      b: {
        d: 'aaa',
        c: 1
      }
    })
  })

  it('should cast array', () => {
    const schema = T.object({
      a: T.string(),
      b: T.array(T.boolean())
    })

    const val = schema.cast({
      a: "true",
      b: [true, true, false]
    })

    expect(val).to.deep.equals({
      a: "true",
      b: [true, true, false]
    })
  })

  it('should cast OR with boolean', () => {
    const schema = T.object({
      a: T.union(T.boolean(), T.string(), T.object({
        b: T.string()
      }))
    })

    const val = schema.cast({
      a: true
    })
    expect(val).to.deep.equals({
      a: true
    })
  })

  it('should fail casting OR with invalid type', () => {
    const schema = T.object({
      a: T.union(T.string(), T.object({
        b: T.string()
      }))
    })

    expect(() => schema.cast({
      a: true
    })).to.throw()
  })

  it('should key with OR be required by default', () => {
    const schema = T.object({
      a: T.union(T.string(), T.object({
        b: T.string()
      }))
    })

    expect(() => schema.cast({})).to.throw()
  })
})