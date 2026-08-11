import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calculator } from './index'

describe('Calculator', () => {
  it('1+2=3', async () => {
    const user = userEvent.setup()
    render(<Calculator />)
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '=' }))
    expect(screen.getByTestId('display')).toHaveTextContent('3')
  })
})
