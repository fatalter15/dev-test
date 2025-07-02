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

// GET - Fetch single transaction
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const transaction = transactions.find((t) => t.id === params.id)
  if (!transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
  }
  return NextResponse.json(transaction)
}

// PUT - Update transaction
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const transactionIndex = transactions.findIndex((t) => t.id === params.id)

    if (transactionIndex === -1) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    transactions[transactionIndex] = { ...transactions[transactionIndex], ...body }
    return NextResponse.json(transactions[transactionIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

// DELETE - Delete transaction
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const transactionIndex = transactions.findIndex((t) => t.id === params.id)

  if (transactionIndex === -1) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
  }

  transactions.splice(transactionIndex, 1)
  return NextResponse.json({ message: "Transaction deleted successfully" })
}
