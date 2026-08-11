import { describe, it, expect } from 'vitest'
import { myUseState, renderWithHooks, resetHooks } from './index'

describe('myUseState', () => {
  it('更新后重渲染可读到新值', () => {
    resetHooks()
    let latest = 0
    let setState: (v: number | ((p: number) => number)) => void = () => {}

    const App = () => {
      const [count, setCount] = myUseState(0)
      latest = count
      setState = setCount
    }

    renderWithHooks(App)
    expect(latest).toBe(0)
    setState(1)
    renderWithHooks(App)
    expect(latest).toBe(1)
    setState((p) => p + 1)
    renderWithHooks(App)
    expect(latest).toBe(2)
  })
})
