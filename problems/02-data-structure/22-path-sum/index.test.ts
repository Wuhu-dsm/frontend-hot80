import { describe, it, expect } from 'vitest'
import { hasPathSum, type TreeNode } from './index'

describe('hasPathSum', () => {
  it('存在路径', () => {
    const root: TreeNode = {
      val: 5,
      left: {
        val: 4,
        left: { val: 11, left: { val: 7, left: null, right: null }, right: { val: 2, left: null, right: null } },
        right: null,
      },
      right: {
        val: 8,
        left: { val: 13, left: null, right: null },
        right: { val: 4, left: null, right: { val: 1, left: null, right: null } },
      },
    }
    expect(hasPathSum(root, 22)).toBe(true)
  })

  it('空树', () => {
    expect(hasPathSum(null, 0)).toBe(false)
  })
})
