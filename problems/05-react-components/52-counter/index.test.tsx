import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './index'

describe('Counter', () => {
  it('增减与重置', async () => {
    const user = userEvent.setup()
    render(<Counter initial={0} />)
    expect(screen.getByTestId('value')).toHaveTextContent('0')
    await user.click(screen.getByRole('button', { name: '+' }))
    expect(screen.getByTestId('value')).toHaveTextContent('1')
    await user.click(screen.getByRole('button', { name: '-' }))
    expect(screen.getByTestId('value')).toHaveTextContent('0')
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByTestId('value')).toHaveTextContent('0')
  })
})
