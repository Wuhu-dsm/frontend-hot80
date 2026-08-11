export interface AxiosRequestConfig {
  url: string
  method?: 'GET' | 'POST'
  data?: unknown
  headers?: Record<string, string>
  timeout?: number
  baseURL?: string
}

export interface AxiosResponse<T = unknown> {
  data: T
  status: number
}

export function createAxios(defaults?: Partial<AxiosRequestConfig>) {
  void defaults
  throw new Error('Not implemented')
}
