import { useState } from 'react'

export interface CounterProps {
  initial?: number
}

/**
 * 约定（对齐测试）：
 * - 当前值：data-testid="value"
 * - 按钮文案：+ / - / reset
 */
export function Counter({ initial = 0 }: CounterProps) {
  // TODO: 实现计数器
  void useState
  void initial
  return <div>Not implemented</div>
}
