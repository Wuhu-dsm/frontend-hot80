import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mySetInterval, mySetTimeout } from './index'

describe('timeout/interval', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('mySetInterval', () => {
    const fn = vi.fn()
    const timer = mySetInterval(fn, 100)
    vi.advanceTimersByTime(350)
    expect(fn).toHaveBeenCalledTimes(3)
    timer.clear()
    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('mySetTimeout', () => {
    const fn = vi.fn()
    mySetTimeout(fn, 100)
    vi.advanceTimersByTime(99)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
