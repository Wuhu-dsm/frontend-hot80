import { describe, it, expect } from 'vitest'
import { set } from './index'

describe('set', () => {
  it('设置深层路径', () => {
    const obj: Record<string, unknown> = {}
    set(obj, 'a.b[0].c', 3)
    expect(obj).toEqual({ a: { b: [{ c: 3 }] } })
  })
})
