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
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminId, action, approvedBy } = body

    const adminIndex = admins.findIndex((a) => a.id === adminId)

    if (adminIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin tidak ditemukan",
        },
        { status: 404 },
      )
    }

    const admin = admins[adminIndex]

    if (admin.status !== "menunggu") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin tidak dalam status menunggu persetujuan",
        },
        { status: 400 },
      )
    }

    if (action === "approve") {
      admins[adminIndex] = {
        ...admin,
        status: "aktif" as const,
        approvedBy,
        approvedAt: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        message: "Admin berhasil disetujui",
        data: admins[adminIndex],
      })
    } else if (action === "reject") {
      // Remove admin from list
      admins.splice(adminIndex, 1)

      return NextResponse.json({
        success: true,
        message: "Permintaan admin berhasil ditolak",
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Aksi tidak valid",
      },
      { status: 400 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memproses persetujuan",
      },
      { status: 500 },
    )
  }
}
