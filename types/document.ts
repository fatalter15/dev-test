export interface Document {
  id: string
  name: string
  type: "contract" | "property_docs" | "legal" | "financial" | "other"
  size: string
  client: string
  property: string
  uploadDate: string
  status: "active" | "archived" | "pending_review"
  createdAt: string
  updatedAt?: string
  url?: string
  mimeType?: string
  uploadedBy?: string
  version?: number
  tags?: string[]
  description?: string
  fileName?: string
  fileExtension?: string
}

export interface CreateDocumentRequest {
  name: string
  type: "contract" | "property_docs" | "legal" | "financial" | "other"
  size: string
  client: string
  property: string
  uploadDate: string
  status: "active" | "archived" | "pending_review"
  url?: string
  mimeType?: string
  uploadedBy?: string
  tags?: string[]
  description?: string
  file?: File
}

export interface UpdateDocumentRequest extends Partial<CreateDocumentRequest> {
  id: string
}

export interface DocumentStats {
  totalDocuments: number
  activeDocuments: number
  pendingReview: number
  archivedDocuments: number
  storageUsed: string
  documentsThisMonth: number
}

export interface DocumentFilters {
  search?: string
  type?: "all" | "contract" | "property_docs" | "legal" | "financial" | "other"
  status?: "all" | "active" | "archived" | "pending_review"
  client?: string
  dateRange?: {
    start: string
    end: string
  }
}

export interface DocumentVersion {
  id: string
  documentId: string
  version: number
  url: string
  uploadDate: string
  uploadedBy: string
  changes?: string
}

export interface FileUploadState {
  file: File | null
  preview: string | null
  uploading: boolean
  progress: number
  error: string | null
}
