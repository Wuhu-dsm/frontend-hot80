import { describe, it, expect, vi, afterEach } from 'vitest'
import { createAxios } from './index'

describe('createAxios', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('GET 请求', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ ok: 1 }),
      })),
    )
    const http = createAxios({ baseURL: 'https://api.test' })
    const res = await http.get('/users')
    expect(res.data).toEqual({ ok: 1 })
    expect(fetch).toHaveBeenCalled()
  })
})
