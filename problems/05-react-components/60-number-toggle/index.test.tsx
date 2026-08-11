import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NumberToggle } from './index'

describe('NumberToggle', () => {
  it('切换格式', async () => {
    const user = userEvent.setup()
    render(<NumberToggle value={3} />)
    expect(screen.getByTestId('num')).toHaveTextContent('3')
    await user.click(screen.getByRole('button'))
    expect(screen.getByTestId('num')).toHaveTextContent('3.00')
  })
})
