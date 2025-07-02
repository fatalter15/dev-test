import { type NextRequest, NextResponse } from "next/server"

// Mock data storage
const products = [
  {
    id: "1",
    name: "Apartemen Modern Pusat Kota",
    description: "Apartemen mewah 2 kamar tidur dengan pemandangan kota dan fasilitas modern",
    price: 2500000000,
    bedrooms: 2,
    location: "Pusat Kota",
    status: "available" as const,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Rumah Keluarga Suburban",
    description: "Rumah luas 4 kamar tidur dengan halaman besar di lingkungan tenang",
    price: 3500000000,
    bedrooms: 4,
    location: "Suburban",
    status: "available" as const,
    createdAt: "2024-01-20T14:15:00Z",
  },
  {
    id: "3",
    name: "Rumah Starter yang Nyaman",
    description: "Rumah 3 kamar tidur yang sempurna untuk pembeli pertama",
    price: 1800000000,
    bedrooms: 3,
    location: "Tengah Kota",
    status: "pending" as const,
    createdAt: "2024-01-10T09:45:00Z",
  },
]

// GET - Fetch all products
export async function GET() {
  return NextResponse.json(products)
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newProduct = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }
    products.push(newProduct)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
