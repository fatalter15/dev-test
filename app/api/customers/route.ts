import { type NextRequest, NextResponse } from "next/server"

// Mock data storage (in a real app, this would be a database)
const customers = [
  {
    id: "1",
    name: "Budi Santoso",
    email: "budi@contoh.com",
    phone: "+62-812-3456-7890",
    propertyInterest: "Rumah 3KT - Membeli",
    status: "active" as const,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Sari Dewi",
    email: "sari@contoh.com",
    phone: "+62-813-4567-8901",
    propertyInterest: "Apartemen 2KT - Menjual",
    status: "active" as const,
    createdAt: "2024-01-20T14:15:00Z",
  },
  {
    id: "3",
    name: "Ahmad Rahman",
    email: "ahmad@contoh.com",
    phone: "+62-814-5678-9012",
    propertyInterest: "Properti Investasi",
    status: "inactive" as const,
    createdAt: "2024-01-10T09:45:00Z",
  },
]

// GET - Fetch all customers
export async function GET() {
  return NextResponse.json(customers)
}

// POST - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newCustomer = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }
    customers.push(newCustomer)
    return NextResponse.json(newCustomer, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
