import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LazyPage } from './index'

describe('LazyPage', () => {
  it('Suspense 懒加载', async () => {
    render(<LazyPage />)
    expect(await screen.findByTestId('heavy')).toBeInTheDocument()
  })
})
