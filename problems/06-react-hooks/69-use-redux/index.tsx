import { ReactNode } from 'react'

export type Reducer<S, A> = (state: S, action: A) => S

export function createStore<S, A>(reducer: Reducer<S, A>, initialState: S) {
  void reducer
  void initialState
  throw new Error('Not implemented')
}

export function Provider(_props: { store: any; children: ReactNode }) {
  return <>{_props.children}</>
}

export function useSelector<S, T>(selector: (state: S) => T): T {
  void selector
  throw new Error('Not implemented')
}

export function useDispatch<A = any>(): (action: A) => void {
  throw new Error('Not implemented')
}
