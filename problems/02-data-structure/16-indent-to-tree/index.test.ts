import { describe, it, expect } from 'vitest'
import { indentToTree } from './index'

describe('indentToTree', () => {
  it('按缩进建树', () => {
    const text = `a
  b
    c
  d
e`
    const tree = indentToTree(text)
    expect(tree.map((n) => n.name)).toEqual(['a', 'e'])
    expect(tree[0].children.map((n) => n.name)).toEqual(['b', 'd'])
    expect(tree[0].children[0].children[0].name).toBe('c')
  })
})
