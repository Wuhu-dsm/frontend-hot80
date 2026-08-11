import { describe, it, expect } from 'vitest'
import { dfsTraverse, bfsTraverse } from './index'

describe('DOM traverse', () => {
  it('dfs/bfs', () => {
    document.body.innerHTML = `
      <div id="root">
        <span><i></i></span>
        <p></p>
      </div>
    `
    const root = document.querySelector('#root')!
    expect(dfsTraverse(root).map((t) => t.toUpperCase())).toEqual(['DIV', 'SPAN', 'I', 'P'])
    expect(bfsTraverse(root).map((t) => t.toUpperCase())).toEqual(['DIV', 'SPAN', 'P', 'I'])
  })
})
