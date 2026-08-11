import { describe, it, expect } from 'vitest'
import { canFinish } from './index'

describe('canFinish', () => {
  it('无环可完成', () => {
    expect(canFinish(2, [[1, 0]])).toBe(true)
  })
  it('有环不可完成', () => {
    expect(canFinish(2, [[1, 0], [0, 1]])).toBe(false)
  })
})
