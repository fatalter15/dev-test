import { type NextRequest, NextResponse } from "next/server"

// Mock data for admins
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get("role")
  const status = searchParams.get("status")
  const search = searchParams.get("search")

  let filteredAdmins = [...admins]

  if (role && role !== "semua") {
    filteredAdmins = filteredAdmins.filter((admin) => admin.role === role)
  }

  if (status && status !== "semua") {
    filteredAdmins = filteredAdmins.filter((admin) => admin.status === status)
  }

  if (search) {
    filteredAdmins = filteredAdmins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(search.toLowerCase()) ||
        admin.email.toLowerCase().includes(search.toLowerCase()),
    )
  }

  return NextResponse.json({
    success: true,
    data: filteredAdmins,
    total: filteredAdmins.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role, registrationMethod, googleId, password } = body

    // Check if admin already exists
    const existingAdmin = admins.find((admin) => admin.email === email)
    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin dengan email ini sudah terdaftar",
        },
        { status: 400 },
      )
    }

    // Validate registration method
    if (registrationMethod === "google" && !googleId) {
      return NextResponse.json(
        {
          success: false,
          message: "Google ID diperlukan untuk registrasi Google",
        },
        { status: 400 },
      )
    }

    if (registrationMethod === "manual" && !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password diperlukan untuk registrasi manual",
        },
        { status: 400 },
      )
    }

    const newAdmin = {
      id: (admins.length + 1).toString(),
      name,
      email,
      role: role || "Admin",
      status: "menunggu" as const,
      lastLogin: "-",
      registrationMethod,
      createdAt: new Date().toISOString().split("T")[0],
      ...(registrationMethod === "google" ? { googleId } : { passwordHash: `hashed_${password}` }),
    }

    admins.push(newAdmin)

    return NextResponse.json({
      success: true,
      message: "Admin berhasil didaftarkan dan menunggu persetujuan",
      data: newAdmin,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mendaftarkan admin",
      },
      { status: 500 },
    )
  }
}
