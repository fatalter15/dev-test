export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  propertyInterest: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt?: string
}

export interface CreateCustomerRequest {
  name: string
  email: string
  phone: string
  propertyInterest: string
  status: "active" | "inactive"
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  id: string
}

export interface CustomerStats {
  totalCustomers: number
  activeCustomers: number
  inactiveCustomers: number
  thisMonthCustomers: number
}

export interface CustomerFilters {
  search?: string
  status?: "all" | "active" | "inactive"
  dateRange?: {
    start: string
    end: string
  }
}
