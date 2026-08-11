import { describe, it, expect } from 'vitest'
import { pathToTree } from './index'

describe('pathToTree', () => {
  it('路径转树', () => {
    const tree = pathToTree(['a/b/c', 'a/b/d', 'a/e'])
    expect(tree).toHaveLength(1)
    expect(tree[0].name).toBe('a')
    expect(tree[0].children.map((n) => n.name).sort()).toEqual(['b', 'e'])
  })
})
