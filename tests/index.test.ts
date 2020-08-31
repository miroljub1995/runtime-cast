import T from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Test boolean', () => {
  it('should execute', () => {
    const schema = T.object({
      a: T.boolean()
    })

    const val = schema.cast({ a: true })

    expect(val).to.deep.equal({ a: true })
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


})