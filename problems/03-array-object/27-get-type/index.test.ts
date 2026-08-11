import { describe, it, expect } from 'vitest'
import { getType } from './index'

describe('getType', () => {
  it('常见类型', () => {
    expect(getType(null)).toBe('null')
    expect(getType([])).toBe('array')
    expect(getType(new Date())).toBe('date')
    expect(getType(/a/)).toBe('regexp')
    expect(getType(1)).toBe('number')
  })
})
