export interface Campaign {
  id: string
  name: string
  type: "social_media" | "email" | "print" | "online_ads"
  budget: number
  spent: number
  leads: number
  conversions: number
  startDate: string
  endDate: string
  status: "active" | "completed" | "paused"
  createdAt: string
  updatedAt?: string
  description?: string
  targetAudience?: string
  platform?: string
  roi?: number
}

export interface CreateCampaignRequest {
  name: string
  type: "social_media" | "email" | "print" | "online_ads"
  budget: number
  spent?: number
  leads?: number
  conversions?: number
  startDate: string
  endDate: string
  status: "active" | "completed" | "paused"
  description?: string
  targetAudience?: string
  platform?: string
}

export interface UpdateCampaignRequest extends Partial<CreateCampaignRequest> {
  id: string
}

export interface MarketingStats {
  totalBudget: number
  totalSpent: number
  totalLeads: number
  totalConversions: number
  activeCampaigns: number
  completedCampaigns: number
  averageROI: number
}

export interface MarketingFilters {
  search?: string
  type?: "all" | "social_media" | "email" | "print" | "online_ads"
  status?: "all" | "active" | "completed" | "paused"
  dateRange?: {
    start: string
    end: string
  }
}

export interface CampaignPerformance {
  campaignId: string
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  conversions: number
  conversionRate: number
  roi: number
}
