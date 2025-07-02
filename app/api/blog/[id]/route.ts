import { type NextRequest, NextResponse } from "next/server"

// Mock data storage
const posts = [
  {
    id: "1",
    title: "Q1 2024 Real Estate Market Update",
    content:
      "<h2>Market Overview</h2><p>The real estate market continues to show <strong>strong performance</strong> in the first quarter of 2024. Key highlights include:</p><ul><li>Average home prices increased by 8.5%</li><li>Days on market decreased to 22 days</li><li>Inventory levels remain low at 2.1 months supply</li></ul><p>These trends indicate a <em>robust seller's market</em> with continued buyer demand.</p><h3>Regional Analysis</h3><p>Downtown areas are experiencing the highest appreciation rates, while suburban markets show steady growth.</p>",
    author: "Sarah Johnson",
    category: "market_update" as const,
    status: "published" as const,
    publishDate: "2024-01-15",
    views: 1250,
    tags: ["market trends", "Q1 2024", "real estate"],
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Stunning Downtown Condo Now Available",
    content:
      '<h2>Premium Living in the Heart of the City</h2><p>Discover this <strong>beautiful 2-bedroom condo</strong> in the heart of downtown with amazing city views and modern amenities.</p><h3>Features Include:</h3><ul><li>Floor-to-ceiling windows</li><li>Granite countertops</li><li>Stainless steel appliances</li><li>In-unit washer/dryer</li><li>Balcony with city views</li></ul><p>This property represents the <em>perfect blend of luxury and convenience</em>, located just steps from shopping, dining, and entertainment.</p><blockquote>"This condo offers the ultimate urban lifestyle with unmatched convenience and style."</blockquote>',
    author: "Mike Chen",
    category: "property_showcase" as const,
    status: "published" as const,
    publishDate: "2024-01-20",
    views: 890,
    tags: ["downtown", "condo", "luxury"],
    createdAt: "2024-01-20T14:15:00Z",
  },
  {
    id: "3",
    title: "First-Time Home Buyer's Complete Guide",
    content:
      "<h2>Your Journey to Homeownership Starts Here</h2><p>Buying your first home is an exciting milestone! This comprehensive guide will walk you through every step of the process.</p><h3>Getting Started</h3><ol><li><strong>Assess your financial situation</strong></li><li><strong>Get pre-approved for a mortgage</strong></li><li><strong>Determine your budget</strong></li><li><strong>Start house hunting</strong></li></ol><p>Remember, preparation is key to a successful home purchase. Take time to understand each step and don't hesitate to ask questions.</p>",
    author: "Lisa Rodriguez",
    category: "tips_guides" as const,
    status: "draft" as const,
    publishDate: "2024-02-01",
    views: 0,
    tags: ["first time buyer", "guide", "tips"],
    createdAt: "2024-01-25T09:45:00Z",
  },
]

// GET - Fetch single post
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const post = posts.find((p) => p.id === params.id)
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }
  return NextResponse.json(post)
}

// PUT - Update post
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const postIndex = posts.findIndex((p) => p.id === params.id)

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    posts[postIndex] = { ...posts[postIndex], ...body }
    return NextResponse.json(posts[postIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

// DELETE - Delete post
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const postIndex = posts.findIndex((p) => p.id === params.id)

  if (postIndex === -1) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  posts.splice(postIndex, 1)
  return NextResponse.json({ message: "Post deleted successfully" })
}
