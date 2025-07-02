export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
  meta?: {
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface SearchParams {
  q?: string
  filters?: Record<string, any>
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface UploadResponse {
  success: boolean
  url?: string
  filename?: string
  size?: number
  mimeType?: string
  error?: string
}

export interface BulkOperation<T> {
  action: "create" | "update" | "delete"
  items: T[]
}

export interface BulkOperationResult<T> {
  success: boolean
  processed: number
  failed: number
  results: {
    success: T[]
    failed: {
      item: T
      error: string
    }[]
  }
}
