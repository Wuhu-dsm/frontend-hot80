import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { throttle } from './index'

describe('throttle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('间隔内只执行一次', () => {
    const fn = vi.fn()
    const t = throttle(fn, 100)
    t(1)
    t(2)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(100)
    t(3)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
