export interface ParsedURL {
  protocol: string
  host: string
  pathname: string
  hash: string
  query: Record<string, string>
}

export function parseURL(url: string): ParsedURL {
  void url
  throw new Error('Not implemented')
}
