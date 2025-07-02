export interface Transaction {
  id: string
  type: "commission" | "expense" | "payment"
  description: string
  amount: number
  client: string
  property: string
  date: string
  status: "completed" | "pending" | "cancelled"
  createdAt: string
  updatedAt?: string
  category?: string
  paymentMethod?: "cash" | "transfer" | "check" | "other"
  reference?: string
  notes?: string
}

export interface CreateTransactionRequest {
  type: "commission" | "expense" | "payment"
  description: string
  amount: number
  client: string
  property: string
  date: string
  status: "completed" | "pending" | "cancelled"
  category?: string
  paymentMethod?: "cash" | "transfer" | "check" | "other"
  reference?: string
  notes?: string
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {
  id: string
}

export interface FinancialStats {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  pendingPayments: number
  completedTransactions: number
  monthlyRevenue: number
  monthlyExpenses: number
}

export interface FinancialFilters {
  search?: string
  type?: "all" | "commission" | "expense" | "payment"
  status?: "all" | "completed" | "pending" | "cancelled"
  dateRange?: {
    start: string
    end: string
  }
  amountRange?: {
    min: number
    max: number
  }
}

export interface FinancialReport {
  period: string
  revenue: number
  expenses: number
  profit: number
  transactions: Transaction[]
}
