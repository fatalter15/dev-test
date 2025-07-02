export interface DashboardStats {
  customers: {
    total: number
    active: number
    thisMonth: number
    growth: number
  }
  properties: {
    total: number
    available: number
    sold: number
    totalValue: number
  }
  financial: {
    revenue: number
    expenses: number
    profit: number
    pendingPayments: number
  }
  marketing: {
    activeCampaigns: number
    totalLeads: number
    conversions: number
    roi: number
  }
  blog: {
    totalPosts: number
    published: number
    views: number
    engagement: number
  }
  documents: {
    total: number
    pending: number
    storageUsed: string
  }
}

export interface RecentActivity {
  id: string
  type: "customer" | "property" | "transaction" | "campaign" | "blog" | "document"
  title: string
  description: string
  timestamp: string
  user?: string
  status?: string
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
    fill?: boolean
  }[]
}

export interface PerformanceMetrics {
  period: "daily" | "weekly" | "monthly" | "yearly"
  revenue: ChartData
  customers: ChartData
  properties: ChartData
  marketing: ChartData
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  href: string
  color: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  actionUrl?: string
}
