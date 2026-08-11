import { describe, it, expect } from 'vitest'
import { preorder, inorder, postorder, levelOrder, type TreeNode } from './index'

const tree: TreeNode = {
  val: 1,
  left: { val: 2, left: { val: 4, left: null, right: null }, right: { val: 5, left: null, right: null } },
  right: { val: 3, left: null, right: null },
}

describe('binary tree traverse', () => {
  it('前中后层序', () => {
    expect(preorder(tree)).toEqual([1, 2, 4, 5, 3])
    expect(inorder(tree)).toEqual([4, 2, 5, 1, 3])
    expect(postorder(tree)).toEqual([4, 5, 2, 3, 1])
    expect(levelOrder(tree)).toEqual([[1], [2, 3], [4, 5]])
  })
})
