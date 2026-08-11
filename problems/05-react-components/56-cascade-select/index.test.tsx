import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CascadeSelect } from './index'

const options = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      { label: '杭州', value: 'hz' },
      { label: '宁波', value: 'nb' },
    ],
  },
]

describe('CascadeSelect', () => {
  it('选择路径', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CascadeSelect options={options} onChange={onChange} />)
    await user.selectOptions(screen.getByTestId('level-0'), 'zj')
    await user.selectOptions(screen.getByTestId('level-1'), 'hz')
    expect(onChange).toHaveBeenLastCalledWith(['zj', 'hz'])
  })
})
