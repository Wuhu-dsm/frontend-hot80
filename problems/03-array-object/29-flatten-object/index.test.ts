import { describe, it, expect } from 'vitest'
import { flattenObj } from './index'

describe('flattenObj', () => {
  it('扁平化', () => {
    expect(flattenObj({ a: { b: { c: 1 }, d: 2 } })).toEqual({ 'a.b.c': 1, 'a.d': 2 })
  })
})
