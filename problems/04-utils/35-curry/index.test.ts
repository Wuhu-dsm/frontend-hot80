import { describe, it, expect } from 'vitest'
import { curry } from './index'

describe('curry', () => {
  it('分步传参', () => {
    const add = (a: number, b: number, c: number) => a + b + c
    const curried = curry(add)
    expect(curried(1)(2)(3)).toBe(6)
    expect(curried(1, 2)(3)).toBe(6)
  })
})
