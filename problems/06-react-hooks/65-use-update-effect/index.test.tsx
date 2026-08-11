import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useUpdateEffect } from './index'

describe('useUpdateEffect', () => {
  it('跳过首次', () => {
    const effect = vi.fn()
    const { rerender } = renderHook(({ x }) => useUpdateEffect(effect, [x]), {
      initialProps: { x: 1 },
    })
    expect(effect).not.toHaveBeenCalled()
    rerender({ x: 2 })
    expect(effect).toHaveBeenCalledTimes(1)
  })
})
