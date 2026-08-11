import { describe, it, expect } from 'vitest'
import { parseCookies, getCookie } from './index'

describe('cookie', () => {
  it('解析与读取', () => {
    const str = 'a=1; b=hello%20world; c=3'
    expect(parseCookies(str)).toEqual({ a: '1', b: 'hello world', c: '3' })
    expect(getCookie('b', str)).toBe('hello world')
  })
})
