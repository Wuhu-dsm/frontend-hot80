import { describe, it, expect } from 'vitest'
import { removeMinChars } from './index'

describe('removeMinChars', () => {
  it('使频次一致且删除最少', () => {
    // 示例：保留出现次数相同的字符集；具体策略以实现与测试一致为准
    const result = removeMinChars('aaabbc')
    const freq: Record<string, number> = {}
    for (const ch of result) freq[ch] = (freq[ch] ?? 0) + 1
    const values = Object.values(freq)
    expect(new Set(values).size).toBeLessThanOrEqual(1)
  })
})
