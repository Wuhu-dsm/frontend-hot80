import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createStore, Provider, useDispatch, useSelector } from './index'

type State = { count: number }
type Action = { type: 'inc' }

function Counter() {
  const count = useSelector((s: State) => s.count)
  const dispatch = useDispatch<Action>()
  return (
    <button onClick={() => dispatch({ type: 'inc' })} data-testid="btn">
      {count}
    </button>
  )
}

describe('mini redux', () => {
  it('读写状态', async () => {
    const user = userEvent.setup()
    const store = createStore<State, Action>((s, a) => (a.type === 'inc' ? { count: s.count + 1 } : s), {
      count: 0,
    })
    render(
      <Provider store={store}>
        <Counter />
      </Provider>,
    )
    expect(screen.getByTestId('btn')).toHaveTextContent('0')
    await user.click(screen.getByTestId('btn'))
    expect(screen.getByTestId('btn')).toHaveTextContent('1')
  })
})
