import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from './index'

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('只执行最后一次', () => {
    const fn = vi.fn()
    const d = debounce(fn, 100)
    d(1)
    d(2)
    d(3)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(3)
  })
})
