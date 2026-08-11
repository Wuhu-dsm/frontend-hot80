import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePrevious } from './index'

describe('usePrevious', () => {
  it('返回上一次值', () => {
    const { result, rerender } = renderHook(({ v }) => usePrevious(v), {
      initialProps: { v: 1 },
    })
    expect(result.current).toBeUndefined()
    rerender({ v: 2 })
    expect(result.current).toBe(1)
    rerender({ v: 3 })
    expect(result.current).toBe(2)
  })
})
