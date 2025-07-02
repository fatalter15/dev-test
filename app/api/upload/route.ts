import { type NextRequest, NextResponse } from "next/server"

// Mock storage - in production, you'd use a service like Cloudinary, AWS S3, etc.
const uploadedImages: { [key: string]: string } = {}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // In a real app, you'd upload to a cloud service
    // For demo purposes, we'll convert to base64 and store in memory
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    // Generate a unique ID for the image
    const imageId = Date.now().toString()
    uploadedImages[imageId] = dataUrl

    return NextResponse.json({
      success: true,
      imageId,
      url: dataUrl,
      filename: file.name,
      size: file.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const imageId = searchParams.get("id")

  if (!imageId || !uploadedImages[imageId]) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 })
  }

  return NextResponse.json({
    url: uploadedImages[imageId],
  })
}
