export interface RichDataParams<T extends Record<string, any>> {
  page: number
  limit: number
  filters?: T
  search: string
}

export interface RichData {
  data: any[]
  page: number
  isLast: boolean
  limit: number
}
