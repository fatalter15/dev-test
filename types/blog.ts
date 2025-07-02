export interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  category: "market_update" | "property_showcase" | "tips_guides" | "success_stories" | "news"
  status: "draft" | "published" | "scheduled"
  publishDate: string
  views: number
  tags: string[]
  createdAt: string
  updatedAt?: string
  excerpt?: string
  featuredImage?: string
  slug?: string
  seoTitle?: string
  seoDescription?: string
  readTime?: number
}

export interface CreateBlogPostRequest {
  title: string
  content: string
  author: string
  category: "market_update" | "property_showcase" | "tips_guides" | "success_stories" | "news"
  status: "draft" | "published" | "scheduled"
  publishDate: string
  tags: string[]
  excerpt?: string
  featuredImage?: string
  seoTitle?: string
  seoDescription?: string
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {
  id: string
}

export interface BlogStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  scheduledPosts: number
  totalViews: number
  averageViews: number
  postsThisMonth: number
}

export interface BlogFilters {
  search?: string
  category?: "all" | "market_update" | "property_showcase" | "tips_guides" | "success_stories" | "news"
  status?: "all" | "draft" | "published" | "scheduled"
  author?: string
  dateRange?: {
    start: string
    end: string
  }
  tags?: string[]
}

export interface BlogComment {
  id: string
  postId: string
  author: string
  email: string
  content: string
  status: "approved" | "pending" | "spam"
  createdAt: string
  parentId?: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  postCount: number
}
