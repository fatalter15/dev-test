import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, googleToken, userInfo } = body

    // In real implementation, verify Google token with Google API
    // For demo, we'll simulate the verification

    if (action === "register") {
      // Handle Google registration
      const { name, email, googleId } = userInfo

      // Check if user already exists
      // In real app, check database

      return NextResponse.json({
        success: true,
        message: "Registrasi berhasil. Menunggu persetujuan admin.",
        data: {
          name,
          email,
          status: "menunggu",
          registrationMethod: "google",
        },
      })
    } else if (action === "login") {
      // Handle Google login
      const { email } = userInfo

      // In real app, verify user exists and is active
      return NextResponse.json({
        success: true,
        message: "Login berhasil",
        data: {
          email,
          loginMethod: "google",
        },
        token: "mock_jwt_token_google",
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
        message: "Terjadi kesalahan saat memproses permintaan Google",
      },
      { status: 500 },
    )
  }
}
