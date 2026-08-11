import { describe, it, expect } from 'vitest'
import { randomInt } from './index'

describe('randomInt', () => {
  it('落在闭区间', () => {
    for (let i = 0; i < 100; i++) {
      const n = randomInt(1, 3)
      expect(n).toBeGreaterThanOrEqual(1)
      expect(n).toBeLessThanOrEqual(3)
      expect(Number.isInteger(n)).toBe(true)
    }
  })
})
