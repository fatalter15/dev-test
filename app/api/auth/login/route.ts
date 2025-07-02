import { type NextRequest, NextResponse } from "next/server"

// Mock admin data - in real app this would be from database
const admins = [
  {
    id: "1",
    name: "Budi Santoso",
    email: "budi.santoso@gmail.com",
    role: "Super Admin",
    status: "aktif",
    registrationMethod: "google",
    googleId: "google_123456789",
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@gmail.com",
    role: "Admin",
    status: "aktif",
    registrationMethod: "google",
    googleId: "google_987654321",
  },
  {
    id: "4",
    name: "Dewi Lestari",
    email: "dewi.lestari@company.com",
    role: "Moderator",
    status: "aktif",
    registrationMethod: "manual",
    passwordHash: "hashed_password_here",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, loginMethod, googleToken } = body

    if (loginMethod === "google") {
      // Handle Google OAuth login
      if (!googleToken) {
        return NextResponse.json(
          {
            success: false,
            message: "Token Google diperlukan untuk login Google",
          },
          { status: 400 },
        )
      }

      // In real implementation, verify Google token
      // For demo, we'll simulate verification
      const admin = admins.find((a) => a.email === email && a.registrationMethod === "google" && a.status === "aktif")

      if (!admin) {
        return NextResponse.json(
          {
            success: false,
            message: "Admin tidak ditemukan atau tidak aktif",
          },
          { status: 401 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Login berhasil",
        data: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          loginMethod: "google",
        },
        token: "mock_jwt_token_google",
      })
    } else {
      // Handle standard email/password login
      if (!email || !password) {
        return NextResponse.json(
          {
            success: false,
            message: "Email dan password diperlukan",
          },
          { status: 400 },
        )
      }

      const admin = admins.find((a) => a.email === email && a.registrationMethod === "manual" && a.status === "aktif")

      if (!admin) {
        return NextResponse.json(
          {
            success: false,
            message: "Email atau password salah",
          },
          { status: 401 },
        )
      }

      // In real implementation, verify password hash
      // For demo, we'll accept any password
      return NextResponse.json({
        success: true,
        message: "Login berhasil",
        data: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          loginMethod: "standard",
        },
        token: "mock_jwt_token_standard",
      })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat login",
      },
      { status: 500 },
    )
  }
}
