import { type NextRequest, NextResponse } from "next/server"

// Mock data storage
const transactions = [
  {
    id: "1",
    type: "commission" as const,
    description: "Sale commission for Downtown Condo",
    amount: 15000,
    client: "John Doe",
    property: "Downtown Condo",
    date: "2024-01-15",
    status: "completed" as const,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    type: "expense" as const,
    description: "Marketing materials for property listing",
    amount: 500,
    client: "Jane Smith",
    property: "Suburban House",
    date: "2024-01-20",
    status: "completed" as const,
    createdAt: "2024-01-20T14:15:00Z",
  },
  {
    id: "3",
    type: "payment" as const,
    description: "Client deposit for property purchase",
    amount: 25000,
    client: "Bob Johnson",
    property: "Starter Home",
    date: "2024-01-25",
    status: "pending" as const,
    createdAt: "2024-01-25T09:45:00Z",
  },
]

// GET - Fetch all transactions
export async function GET() {
  return NextResponse.json(transactions)
}

// POST - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newTransaction = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }
    transactions.push(newTransaction)
    return NextResponse.json(newTransaction, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
