import { describe, it, expect } from 'vitest'
import { deepClone } from './index'

describe('deepClone', () => {
  it('深拷贝对象与数组', () => {
    const obj = { a: 1, b: { c: [2, 3] } }
    const cloned = deepClone(obj)
    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    expect(cloned.b).not.toBe(obj.b)
  })

  it('处理循环引用', () => {
    const obj: any = { a: 1 }
    obj.self = obj
    const cloned = deepClone(obj)
    expect(cloned.self).toBe(cloned)
  })

  it('Date / RegExp', () => {
    const obj = { d: new Date('2020-01-01'), r: /ab/gi }
    const cloned = deepClone(obj)
    expect(cloned.d).toEqual(obj.d)
    expect(cloned.d).not.toBe(obj.d)
    expect(cloned.r).toEqual(obj.r)
    expect(cloned.r).not.toBe(obj.r)
  })
})
