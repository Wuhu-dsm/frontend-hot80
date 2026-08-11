import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VirtualList } from './index'

describe('VirtualList', () => {
  it('只渲染可视区域附近的项', () => {
    const items = Array.from({ length: 1000 }, (_, i) => i)
    render(
      <VirtualList
        items={items}
        itemHeight={30}
        height={150}
        renderItem={(item) => <div data-testid="row">{item}</div>}
      />,
    )
    const rows = screen.getAllByTestId('row')
    expect(rows.length).toBeLessThan(30)
    expect(rows.length).toBeGreaterThan(0)
  })
})
