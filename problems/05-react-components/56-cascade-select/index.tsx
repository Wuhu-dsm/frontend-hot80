export interface CascadeOption {
  label: string
  value: string
  children?: CascadeOption[]
}

export interface CascadeSelectProps {
  options: CascadeOption[]
  onChange?: (values: string[]) => void
}

export function CascadeSelect(_props: CascadeSelectProps) {
  return <div>Not implemented</div>
}
