import { describe, it, expect } from 'vitest'
import { treeToArray } from './index'

describe('treeToArray', () => {
  it('拍平树', () => {
    const tree = [
      {
        id: 1,
        name: 'a',
        children: [{ id: 2, name: 'b', children: [{ id: 4, name: 'd' }] }, { id: 3, name: 'c' }],
      },
    ]
    const list = treeToArray(tree)
    expect(list.find((n) => n.id === 1)?.parentId).toBeNull()
    expect(list.find((n) => n.id === 2)?.parentId).toBe(1)
    expect(list.find((n) => n.id === 4)?.parentId).toBe(2)
  })
})
