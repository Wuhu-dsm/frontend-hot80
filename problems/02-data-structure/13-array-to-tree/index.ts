export interface FlatNode {
  id: number | string
  parentId: number | string | null
  [key: string]: unknown
}

export interface TreeNode extends FlatNode {
  children?: TreeNode[]
}

export function arrayToTree(list: FlatNode[], rootParentId: FlatNode['parentId'] = null): TreeNode[] {
  void list
  void rootParentId
  throw new Error('Not implemented')
}
