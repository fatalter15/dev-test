import { type NextRequest, NextResponse } from "next/server"

// Mock data storage (same as above - in real app this would be shared)
const customers = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "555-123-4567",
    properties: 3,
    status: "active" as const,
    lastContacted: "2024-03-01T12:00:00Z",
  },
  {
    id: "2",
    name: "Bob Williams",
    email: "bob.williams@example.com",
    phone: "555-987-6543",
    properties: 5,
    status: "inactive" as const,
    lastContacted: "2024-02-15T08:30:00Z",
  },
  {
    id: "3",
    name: "Catherine Davis",
    email: "catherine.davis@example.com",
    phone: "555-246-8013",
    properties: 2,
    status: "active" as const,
    lastContacted: "2024-03-05T15:45:00Z",
  },
]

// GET - Fetch single customer
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const customer = customers.find((c) => c.id === params.id)
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 })
  }
  return NextResponse.json(customer)
}

// PUT - Update customer
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const customerIndex = customers.findIndex((c) => c.id === params.id)

    if (customerIndex === -1) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    customers[customerIndex] = { ...customers[customerIndex], ...body }
    return NextResponse.json(customers[customerIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

// DELETE - Delete customer
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const customerIndex = customers.findIndex((c) => c.id === params.id)

  if (customerIndex === -1) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 })
  }

  customers.splice(customerIndex, 1)
  return NextResponse.json({ message: "Customer deleted successfully" })
}
