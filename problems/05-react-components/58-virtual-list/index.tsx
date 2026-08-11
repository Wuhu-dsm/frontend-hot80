export interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  height: number
  renderItem: (item: T, index: number) => React.ReactNode
}

export function VirtualList<T>(_props: VirtualListProps<T>) {
  return <div>Not implemented</div>
}
