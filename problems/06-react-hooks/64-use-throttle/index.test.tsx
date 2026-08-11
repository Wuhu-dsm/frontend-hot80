import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useThrottle } from './index'

describe('useThrottle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('节流更新', () => {
    const { result, rerender } = renderHook(({ v }) => useThrottle(v, 100), {
      initialProps: { v: 1 },
    })
    expect(result.current).toBe(1)
    rerender({ v: 2 })
    expect(result.current).toBe(1)
    act(() => {
      vi.advanceTimersByTime(100)
    })
    rerender({ v: 3 })
    expect(result.current).toBe(3)
  })
})
