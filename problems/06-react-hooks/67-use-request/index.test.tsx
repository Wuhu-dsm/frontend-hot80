import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useRequest } from './index'

describe('useRequest', () => {
  it('自动请求', async () => {
    const service = vi.fn(async () => 42)
    const { result } = renderHook(() => useRequest(service))
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBe(42)
  })

  it('手动 run', async () => {
    const service = vi.fn(async (x: number) => x * 2)
    const { result } = renderHook(() => useRequest(service, { manual: true }))
    expect(result.current.data).toBeUndefined()
    await act(async () => {
      await result.current.run(2)
    })
    expect(result.current.data).toBe(4)
  })
})
