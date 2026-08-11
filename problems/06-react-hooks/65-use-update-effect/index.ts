import { DependencyList, EffectCallback } from 'react'

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList): void {
  void effect
  void deps
  throw new Error('Not implemented')
}
