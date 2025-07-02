import { type NextRequest, NextResponse } from "next/server"

// Mock data storage
const documents = [
  {
    id: "1",
    name: "Purchase Agreement - Downtown Condo",
    type: "contract" as const,
    size: "2.5 MB",
    client: "John Doe",
    property: "Downtown Condo",
    uploadDate: "2024-01-15",
    status: "active" as const,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Property Inspection Report",
    type: "property_docs" as const,
    size: "1.8 MB",
    client: "Jane Smith",
    property: "Suburban House",
    uploadDate: "2024-01-20",
    status: "active" as const,
    createdAt: "2024-01-20T14:15:00Z",
  },
  {
    id: "3",
    name: "Title Insurance Policy",
    type: "legal" as const,
    size: "3.2 MB",
    client: "Bob Johnson",
    property: "Starter Home",
    uploadDate: "2024-01-25",
    status: "pending_review" as const,
    createdAt: "2024-01-25T09:45:00Z",
  },
]

// GET - Fetch all documents
export async function GET() {
  return NextResponse.json(documents)
}

// POST - Create new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newDocument = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }
    documents.push(newDocument)
    return NextResponse.json(newDocument, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
