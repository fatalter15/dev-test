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

// GET - Fetch single document
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const document = documents.find((d) => d.id === params.id)
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }
  return NextResponse.json(document)
}

// PUT - Update document
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const documentIndex = documents.findIndex((d) => d.id === params.id)

    if (documentIndex === -1) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    documents[documentIndex] = { ...documents[documentIndex], ...body }
    return NextResponse.json(documents[documentIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

// DELETE - Delete document
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const documentIndex = documents.findIndex((d) => d.id === params.id)

  if (documentIndex === -1) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  documents.splice(documentIndex, 1)
  return NextResponse.json({ message: "Document deleted successfully" })
}
