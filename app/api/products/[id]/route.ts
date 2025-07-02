import { type NextRequest, NextResponse } from "next/server"

// Mock data storage
const products = [
  {
    id: "1",
    title: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    discountPercentage: 10,
    rating: 4.5,
    stock: 25,
    brand: "TechCo",
    category: "Electronics",
    thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
    images: [
      "https://i.dummyjson.com/data/products/1/1.jpg",
      "https://i.dummyjson.com/data/products/1/2.jpg",
      "https://i.dummyjson.com/data/products/1/3.jpg",
      "https://i.dummyjson.com/data/products/1/4.jpg",
      "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
    ],
  },
  {
    id: "2",
    title: "Smart Watch",
    description: "Fitness tracking smartwatch with heart rate monitor",
    price: 299.99,
    discountPercentage: 12,
    rating: 4.2,
    stock: 15,
    brand: "FitTrack",
    category: "Electronics",
    thumbnail: "https://i.dummyjson.com/data/products/2/thumbnail.jpg",
    images: [
      "https://i.dummyjson.com/data/products/2/1.jpg",
      "https://i.dummyjson.com/data/products/2/2.jpg",
      "https://i.dummyjson.com/data/products/2/3.jpg",
    ],
  },
  {
    id: "3",
    title: "Coffee Mug",
    description: "Ceramic coffee mug with company logo",
    price: 12.99,
    discountPercentage: 5,
    rating: 4.0,
    stock: 5,
    brand: "MugCo",
    category: "Merchandise",
    thumbnail: "https://i.dummyjson.com/data/products/3/thumbnail.jpg",
    images: [
      "https://i.dummyjson.com/data/products/3/1.jpg",
      "https://i.dummyjson.com/data/products/3/2.jpg",
      "https://i.dummyjson.com/data/products/3/3.jpg",
    ],
  },
]

// GET - Fetch single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id)
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }
  return NextResponse.json(product)
}

// PUT - Update product
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const productIndex = products.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    products[productIndex] = { ...products[productIndex], ...body }
    return NextResponse.json(products[productIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const productIndex = products.findIndex((p) => p.id === params.id)

  if (productIndex === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  products.splice(productIndex, 1)
  return NextResponse.json({ message: "Product deleted successfully" })
}
