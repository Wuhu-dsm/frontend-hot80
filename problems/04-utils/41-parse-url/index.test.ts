import { describe, it, expect } from 'vitest'
import { parseURL } from './index'

describe('parseURL', () => {
  it('解析 query 与 hash', () => {
    const r = parseURL('https://example.com/a/b?x=1&y=2#hash')
    expect(r.protocol).toBe('https:')
    expect(r.host).toBe('example.com')
    expect(r.pathname).toBe('/a/b')
    expect(r.query).toEqual({ x: '1', y: '2' })
    expect(r.hash).toBe('#hash')
  })
})
