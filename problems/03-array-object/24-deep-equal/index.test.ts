import { describe, it, expect } from 'vitest'
import { deepEqual } from './index'

describe('deepEqual', () => {
  it('基本相等', () => {
    expect(deepEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true)
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
  })
})
