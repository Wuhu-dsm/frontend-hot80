import { describe, it, expect, vi } from 'vitest'
import { asyncPool } from './index'

describe('asyncPool', () => {
  it('限制并发并按序返回', async () => {
    let running = 0
    let maxRunning = 0
    const make = (v: number, ms: number) => async () => {
      running++
      maxRunning = Math.max(maxRunning, running)
      await new Promise((r) => setTimeout(r, ms))
      running--
      return v
    }
    const result = await asyncPool(2, [make(1, 30), make(2, 10), make(3, 10)])
    expect(result).toEqual([1, 2, 3])
    expect(maxRunning).toBeLessThanOrEqual(2)
  })
})
