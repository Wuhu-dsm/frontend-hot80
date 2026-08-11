export interface IndentNode {
  name: string
  children: IndentNode[]
}

export function indentToTree(text: string): IndentNode[] {
  void text
  throw new Error('Not implemented')
}
