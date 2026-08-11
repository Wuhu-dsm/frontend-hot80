export function parseCookies(cookieStr: string): Record<string, string> {
  void cookieStr
  throw new Error('Not implemented')
}

export function getCookie(name: string, cookieStr = typeof document !== 'undefined' ? document.cookie : ''): string | undefined {
  void name
  void cookieStr
  throw new Error('Not implemented')
}
