import type React from "react"
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt?: string
}

export interface TimestampedEntity extends BaseEntity {
  createdBy?: string
  updatedBy?: string
}

export interface SoftDeleteEntity extends TimestampedEntity {
  deletedAt?: string
  deletedBy?: string
}

export interface StatusEntity {
  status: string
  statusChangedAt?: string
  statusChangedBy?: string
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface ContactInfo {
  email: string
  phone: string
  whatsapp?: string
  website?: string
}

export interface SocialMedia {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  youtube?: string
}

export interface FileInfo {
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  path: string
}

export interface ImageInfo extends FileInfo {
  width: number
  height: number
  alt?: string
  caption?: string
}

export interface AuditLog {
  id: string
  entityType: string
  entityId: string
  action: "create" | "update" | "delete" | "view"
  changes?: Record<
    string,
    {
      old: any
      new: any
    }
  >
  performedBy: string
  performedAt: string
  ipAddress?: string
  userAgent?: string
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: "left" | "center" | "right"
  render?: (value: any, row: any) => React.ReactNode
}

export interface FilterOption {
  key: string
  label: string
  type: "text" | "select" | "date" | "dateRange" | "number" | "numberRange"
  options?: SelectOption[]
  placeholder?: string
}
