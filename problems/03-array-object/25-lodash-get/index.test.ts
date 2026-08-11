import { describe, it, expect } from 'vitest'
import { get } from './index'

describe('get', () => {
  const obj = { a: { b: [{ c: 3 }] } }
  it('点路径与数组路径', () => {
    expect(get(obj, 'a.b[0].c')).toBe(3)
    expect(get(obj, ['a', 'b', 0, 'c'])).toBe(3)
  })
  it('默认值', () => {
    expect(get(obj, 'a.x', 9)).toBe(9)
  })
})
