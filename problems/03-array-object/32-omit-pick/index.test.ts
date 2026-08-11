import { describe, it, expect } from 'vitest'
import { pick, omit } from './index'

describe('pick/omit', () => {
  const obj = { a: 1, b: 2, c: 3 }
  it('pick', () => {
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })
  it('omit', () => {
    expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 })
  })
})
