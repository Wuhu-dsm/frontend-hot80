import { describe, it, expect } from 'vitest'
import { promisify } from './index'

describe('promisify', () => {
  it('成功转 resolve', async () => {
    const read = (path: string, cb: (err: Error | null, data?: string) => void) => {
      cb(null, path + '!data')
    }
    const readAsync = promisify(read)
    await expect(readAsync('/a')).resolves.toBe('/a!data')
  })

  it('错误转 reject', async () => {
    const fail = (_: string, cb: (err: Error | null) => void) => cb(new Error('boom'))
    await expect(promisify(fail)('x')).rejects.toThrow('boom')
  })
})
