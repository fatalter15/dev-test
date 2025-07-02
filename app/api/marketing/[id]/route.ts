import { type NextRequest, NextResponse } from "next/server"

// Mock data storage
const campaigns = [
  {
    id: "1",
    name: "Downtown Condo Social Media Campaign",
    type: "social_media" as const,
    budget: 2000,
    spent: 1500,
    leads: 45,
    conversions: 8,
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    status: "completed" as const,
    createdAt: "2024-01-01T10:30:00Z",
  },
  {
    id: "2",
    name: "Suburban House Email Marketing",
    type: "email" as const,
    budget: 800,
    spent: 600,
    leads: 25,
    conversions: 5,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    status: "active" as const,
    createdAt: "2024-01-15T14:15:00Z",
  },
  {
    id: "3",
    name: "First-Time Buyer Online Ads",
    type: "online_ads" as const,
    budget: 3000,
    spent: 2200,
    leads: 60,
    conversions: 12,
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    status: "active" as const,
    createdAt: "2024-01-10T09:45:00Z",
  },
]

// GET - Fetch single campaign
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const campaign = campaigns.find((c) => c.id === params.id)
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
  }
  return NextResponse.json(campaign)
}

// PUT - Update campaign
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const campaignIndex = campaigns.findIndex((c) => c.id === params.id)

    if (campaignIndex === -1) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    campaigns[campaignIndex] = { ...campaigns[campaignIndex], ...body }
    return NextResponse.json(campaigns[campaignIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

// DELETE - Delete campaign
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const campaignIndex = campaigns.findIndex((c) => c.id === params.id)

  if (campaignIndex === -1) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
  }

  campaigns.splice(campaignIndex, 1)
  return NextResponse.json({ message: "Campaign deleted successfully" })
}
