import { type NextRequest, NextResponse } from "next/server"

// Mock data - in real app this would be from database
const admins = [
  {
    id: "1",
    name: "Budi Santoso",
    email: "budi.santoso@gmail.com",
    role: "Super Admin",
    status: "aktif",
    lastLogin: "2024-01-15 10:30",
    registrationMethod: "google",
    createdAt: "2024-01-01",
    googleId: "google_123456789",
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@gmail.com",
    role: "Admin",
    status: "aktif",
    lastLogin: "2024-01-14 15:45",
    registrationMethod: "google",
    createdAt: "2024-01-05",
    googleId: "google_987654321",
  },
  {
    id: "3",
    name: "Ahmad Wijaya",
    email: "ahmad.wijaya@gmail.com",
    role: "Admin",
    status: "menunggu",
    lastLogin: "-",
    registrationMethod: "google",
    createdAt: "2024-01-15",
    googleId: "google_456789123",
  },
  {
    id: "4",
    name: "Dewi Lestari",
    email: "dewi.lestari@company.com",
    role: "Moderator",
    status: "tidak_aktif",
    lastLogin: "2024-01-10 09:15",
    registrationMethod: "manual",
    createdAt: "2023-12-20",
    passwordHash: "hashed_password_here",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = admins.find((a) => a.id === params.id)

  if (!admin) {
    return NextResponse.json(
      {
        success: false,
        message: "Admin tidak ditemukan",
      },
      { status: 404 },
    )
  }

  return NextResponse.json({
    success: true,
    data: admin,
  })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const adminIndex = admins.findIndex((a) => a.id === params.id)

    if (adminIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin tidak ditemukan",
        },
        { status: 404 },
      )
    }

    // Update admin data
    admins[adminIndex] = {
      ...admins[adminIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
    }

    return NextResponse.json({
      success: true,
      message: "Data admin berhasil diperbarui",
      data: admins[adminIndex],
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memperbarui data admin",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const adminIndex = admins.findIndex((a) => a.id === params.id)

  if (adminIndex === -1) {
    return NextResponse.json(
      {
        success: false,
        message: "Admin tidak ditemukan",
      },
      { status: 404 },
    )
  }

  // Check if trying to delete Super Admin
  if (admins[adminIndex].role === "Super Admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Super Admin tidak dapat dihapus",
      },
      { status: 403 },
    )
  }

  admins.splice(adminIndex, 1)

  return NextResponse.json({
    success: true,
    message: "Admin berhasil dihapus",
  })
}
