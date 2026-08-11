import { describe, it, expect } from 'vitest'
import { flat } from './index'

describe('flat', () => {
  it('默认 depth=1', () => {
    expect(flat([1, [2, [3]]])).toEqual([1, 2, [3]])
  })
  it('Infinity', () => {
    expect(flat([1, [2, [3]]], Infinity)).toEqual([1, 2, 3])
  })
})
