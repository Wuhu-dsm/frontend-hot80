export interface TreeNode {
  id: number | string
  children?: TreeNode[]
  [key: string]: unknown
}

export interface FlatNode {
  id: number | string
  parentId: number | string | null
  [key: string]: unknown
}

export function treeToArray(tree: TreeNode[]): FlatNode[] {
  void tree
  throw new Error('Not implemented')
}
