export interface Product {
  id: string
  name: string
  description: string
  price: number
  bedrooms: number
  location: string
  status: "available" | "sold" | "pending"
  createdAt: string
  updatedAt?: string
  images?: string[]
  features?: string[]
  area?: number
  propertyType?: "rumah" | "apartemen" | "ruko" | "tanah"
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  bedrooms: number
  location: string
  status: "available" | "sold" | "pending"
  images?: string[]
  features?: string[]
  area?: number
  propertyType?: "rumah" | "apartemen" | "ruko" | "tanah"
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string
}

export interface ProductStats {
  totalProducts: number
  totalValue: number
  lowStockProducts: number
  activeProducts: number
  availableProducts: number
  soldProducts: number
  pendingProducts: number
}

export interface ProductFilters {
  search?: string
  status?: "all" | "available" | "sold" | "pending"
  priceRange?: {
    min: number
    max: number
  }
  location?: string
  propertyType?: "all" | "rumah" | "apartemen" | "ruko" | "tanah"
}
