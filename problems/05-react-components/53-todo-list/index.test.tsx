import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoList } from './index'

describe('TodoList', () => {
  it('增删改完成态', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.type(screen.getByPlaceholderText(/todo/i), '写题')
    await user.click(screen.getByRole('button', { name: /add|添加/i }))
    expect(screen.getByText('写题')).toBeInTheDocument()
    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByText('写题').closest('li')).toHaveAttribute('data-done', 'true')
    await user.click(screen.getByRole('button', { name: /delete|删除/i }))
    expect(screen.queryByText('写题')).not.toBeInTheDocument()
  })
})
