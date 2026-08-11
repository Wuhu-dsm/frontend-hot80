import { describe, it, expect } from 'vitest'
import { promiseAll } from './index'

describe('promiseAll', () => {
  it('全部成功按顺序返回', async () => {
    const result = await promiseAll([
      Promise.resolve(1),
      Promise.resolve(2),
      3,
    ])
    expect(result).toEqual([1, 2, 3])
  })

  it('空数组', async () => {
    await expect(promiseAll([])).resolves.toEqual([])
  })

  it('任一失败则失败', async () => {
    const rejected = Promise.reject(new Error('x'))
    // 避免实现抛错前出现未处理 rejection
    rejected.catch(() => {})
    await expect(promiseAll([Promise.resolve(1), rejected])).rejects.toThrow('x')
  })
})
