export * from "./customer"
export * from "./product"
export * from "./financial"
export * from "./marketing"
export * from "./document"
export * from "./blog"
export * from "./admin"
export * from "./calendar"
export * from "./dashboard"
export * from "./api"
export * from "./common"
export * from "./settings"

// Re-export commonly used types
export type { CalendarEvent, EventType, EventPriority, EventStatus } from "./calendar"

// Common type utilities
export type Nullable<T> = T | null
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Status types used across the application
export type Status = "active" | "inactive" | "pending" | "completed" | "cancelled" | "draft" | "published"

// Common ID type
export type ID = string

// Date string type
export type DateString = string

// Currency amount type
export type CurrencyAmount = number

// Percentage type
export type Percentage = number

// File size type
export type FileSize = string

// URL type
export type URL = string

// Email type
export type Email = string

// Phone number type
export type PhoneNumber = string

// Color hex code type
export type HexColor = string

// Sort order type
export type SortOrder = "asc" | "desc"

// Theme type
export type Theme = "light" | "dark" | "auto"

// Language code type
export type LanguageCode = "id" | "en"

// Currency code type
export type CurrencyCode = "IDR" | "USD" | "EUR"

// Timezone type
export type Timezone = string

// MIME type
export type MimeType = string

// HTTP method type
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

// Response status type
export type ResponseStatus = "success" | "error" | "warning" | "info"
