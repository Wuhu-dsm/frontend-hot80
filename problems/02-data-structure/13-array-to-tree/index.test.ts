import { describe, it, expect } from 'vitest'
import { arrayToTree } from './index'

describe('arrayToTree', () => {
  it('构建树', () => {
    const list = [
      { id: 1, parentId: null, name: 'a' },
      { id: 2, parentId: 1, name: 'b' },
      { id: 3, parentId: 1, name: 'c' },
      { id: 4, parentId: 2, name: 'd' },
    ]
    const tree = arrayToTree(list)
    expect(tree).toHaveLength(1)
    expect(tree[0].children?.map((n) => n.id)).toEqual([2, 3])
    expect(tree[0].children?.[0].children?.[0].id).toBe(4)
  })
})
