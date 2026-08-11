import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './index'

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('延迟更新', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 100), {
      initialProps: { v: 'a' },
    })
    expect(result.current).toBe('a')
    rerender({ v: 'b' })
    expect(result.current).toBe('a')
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('b')
  })
})
