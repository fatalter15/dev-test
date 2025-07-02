"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  DollarSign,
  TrendingUp,
  Package,
  FileText,
  BarChart3,
  Calendar,
  Bell,
  Settings,
  Edit,
  Shield,
  Lock,
  AlertTriangle,
  ExternalLink,
  Building,
  Globe,
  ArrowRight,
  Eye,
  UserX,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLanding() {
  const router = useRouter()

  const modules = [
    {
      title: "Manajemen Admin",
      description: "Kelola akun admin, kontrol akses, dan otorisasi pengguna sistem",
      icon: Shield,
      color: "bg-amber-600",
      hoverColor: "hover:bg-amber-700",
      features: ["Kontrol Akses", "Manajemen Pengguna", "Otorisasi", "Keamanan Sistem"],
      route: "/admin-manager",
    },
    {
      title: "Manajemen Pelanggan",
      description: "Kelola profil klien, minat properti, informasi kontak, dan riwayat transaksi",
      icon: Users,
      color: "bg-emerald-600",
      hoverColor: "hover:bg-emerald-700",
      features: ["Profil Pelanggan", "Riwayat Kontak", "Pelacakan Pembelian", "Log Komunikasi"],
      route: "/customers",
    },
    {
      title: "Manajemen Keuangan",
      description: "Lacak komisi, pengeluaran, transaksi properti, dan buat laporan keuangan",
      icon: DollarSign,
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      features: ["Pelacakan Pendapatan", "Manajemen Pengeluaran", "Faktur", "Pemrosesan Pembayaran"],
      route: "/financial",
    },
    {
      title: "Laporan Pemasaran",
      description: "Analisis listing properti, kampanye pemasaran, dan performa generasi prospek",
      icon: TrendingUp,
      color: "bg-orange-600",
      hoverColor: "hover:bg-orange-700",
      features: ["Analitik Kampanye", "Metrik Performa", "Pelacakan ROI", "Wawasan Pasar"],
      route: "/marketing",
    },
    {
      title: "Manajemen Produk",
      description: "Kelola listing properti, harga, ketersediaan, dan detail properti",
      icon: Package,
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      features: ["Kontrol Inventori", "Katalog Produk", "Manajemen Harga", "Pelacakan Stok"],
      route: "/products",
    },
    {
      title: "Manajemen Dokumen",
      description: "Simpan kontrak, dokumen properti, surat legal, dan file penting",
      icon: FileText,
      color: "bg-slate-600",
      hoverColor: "hover:bg-slate-700",
      features: ["Penyimpanan File", "Organisasi Dokumen", "Kontrol Versi", "Manajemen Akses"],
      route: "/documents",
    },
    {
      title: "Manajemen Blog",
      description: "Buat konten real estat, update pasar, dan showcase properti",
      icon: Edit,
      color: "bg-cyan-600",
      hoverColor: "hover:bg-cyan-700",
      features: ["Pembuatan Konten", "Penjadwalan Post", "Optimasi SEO", "Analitik Engagement"],
      route: "/blog",
    },
    {
      title: "Kalender Perusahaan",
      description: "Kelola jadwal, appointment, dan event perusahaan real estat",
      icon: Calendar,
      color: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
      features: ["Penjadwalan Event", "Property Viewing", "Meeting Client", "Reminder Otomatis"],
      route: "/calendar",
    },
  ]

  // 🔥 LOGIN LOGIC LOCATION #1: State Management
  // Change this line to control the initial login state
  // Set to `false` for restricted access, `true` to bypass login
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // 🔥 LOGIN LOGIC LOCATION #2: Login Handler
  // This function handles the login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your authentication logic here
    // For now, it just sets isLoggedIn to true
    setIsLoggedIn(true)
    setShowLoginModal(false)
  }

  // 🔥 LOGIN LOGIC LOCATION #3: Module Access Control
  // This function controls access to modules
  const handleModuleAccess = (route: string) => {
    if (!isLoggedIn) {
      // If not logged in, show login modal instead of navigating
      setShowLoginModal(true)
    } else {
      // If logged in, navigate to the module
      router.push(route)
    }
  }

  const stats = [
    { label: "Total Admin", value: "12", icon: Shield, color: "text-amber-600", bgColor: "bg-amber-50" },
    { label: "Total Klien", value: "2,847", icon: Users, color: "text-emerald-600", bgColor: "bg-emerald-50" },
    {
      label: "Pendapatan Bulanan",
      value: "Rp 678.450.000",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    { label: "Properti Aktif", value: "1,234", icon: Package, color: "text-blue-600", bgColor: "bg-blue-50" },
  ]

  // 🔥 LOGIN LOGIC LOCATION #4: Conditional Rendering
  // This is the main conditional that shows restricted access vs admin dashboard
  // Change the condition here to modify when the restricted page is shown
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>

        {/* Header */}
        <header className="relative bg-white border-b-2 border-red-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <span className="text-2xl font-bold text-gray-900">Admin Portal</span>
                  <div className="text-xs text-red-600 font-semibold">RESTRICTED ACCESS</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  <Lock className="h-3 w-3 mr-1" />
                  SECURED
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                  onClick={() => window.open("https://propertypro-marketing.com", "_blank")}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Website Utama
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="relative flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Warning Alert */}
            <Alert className="mb-8 bg-red-50 border-red-200 text-red-800">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800 font-bold">Area Terbatas - Khusus Admin</AlertTitle>
              <AlertDescription className="text-red-700">
                Halaman ini adalah portal administrasi internal. Akses hanya diperuntukkan bagi personel yang berwenang.
              </AlertDescription>
            </Alert>

            {/* Main Content */}
            <div className="bg-white rounded-2xl p-8 border-2 border-red-200 shadow-xl">
              {/* Lock Icon */}
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 border-2 border-red-200">
                  <Lock className="h-10 w-10 text-red-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Portal Administrasi</h1>
                <p className="text-gray-600 text-lg">Sistem Manajemen Internal PropertyPro</p>
              </div>

              {/* Access Restriction Message */}
              <Card className="bg-red-50 border-red-200 mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <UserX className="h-8 w-8 text-red-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Akses Dibatasi</h2>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Anda mencoba mengakses portal administrasi internal PropertyPro. Area ini khusus untuk staff dan
                    admin yang memiliki otorisasi.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-gray-900 font-medium mb-2 flex items-center">
                      <Eye className="h-4 w-4 mr-2 text-blue-600" />
                      Mencari Website Kami?
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Jika Anda adalah calon pembeli atau penjual properti, silakan kunjungi website marketing kami yang
                      resmi.
                    </p>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => window.open("https://propertypro-marketing.com", "_blank")}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Kunjungi PropertyPro.com
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Login Section */}
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center justify-center">
                    <Shield className="h-5 w-5 mr-2 text-red-600" />
                    Login Admin
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-center">
                    Khusus untuk staff dan administrator yang berwenang
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white mb-4"
                    onClick={() => setShowLoginModal(true)}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Akses Portal Admin
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  <div className="text-xs text-gray-500 text-center">
                    Dengan melanjutkan, Anda menyatakan bahwa Anda adalah personel yang berwenang
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Website Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Building className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-gray-900 font-semibold mb-2">Website Utama</h3>
                  <p className="text-gray-600 text-sm mb-3">Portal publik untuk jual beli properti</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    onClick={() => window.open("https://propertypro.com", "_blank")}
                  >
                    propertypro.com
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Globe className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="text-gray-900 font-semibold mb-2">Portal Klien</h3>
                  <p className="text-gray-600 text-sm mb-3">Dashboard untuk klien terdaftar</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    onClick={() => window.open("https://client.propertypro.com", "_blank")}
                  >
                    client.propertypro.com
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-red-600 mx-auto mb-3" />
                  <h3 className="text-gray-900 font-semibold mb-2">Portal Admin</h3>
                  <p className="text-gray-600 text-sm mb-3">Sistem manajemen internal (Anda di sini)</p>
                  <Badge className="bg-red-100 text-red-800 border-red-200">RESTRICTED</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Butuh bantuan? Hubungi IT Support:
                <a href="mailto:it-support@propertypro.com" className="text-blue-600 hover:text-blue-700 ml-1">
                  it-support@propertypro.com
                </a>
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-600 text-sm mb-4 md:mb-0">
                © 2024 PropertyPro Internal Systems. Unauthorized access prohibited.
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Security Level: HIGH</span>
                <span>•</span>
                <span>Monitoring: ACTIVE</span>
                <span>•</span>
                <span>Version: 2.1.0</span>
              </div>
            </div>
          </div>
        </footer>

        {/* 🔥 LOGIN LOGIC LOCATION #5: Login Modal */}
        {/* This is where the actual login form is rendered */}
        <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
          <DialogContent className="sm:max-w-md bg-white border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-600" />
                Admin Authentication
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Masukkan kredensial admin yang valid untuk mengakses sistem manajemen internal.
              </DialogDescription>
            </DialogHeader>

            <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700 text-sm">
                Akses tidak sah akan dicatat dan dilaporkan ke departemen keamanan.
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-1 bg-gray-100">
                <TabsTrigger value="login" className="text-gray-700">
                  Admin Login
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                {/* 🔥 LOGIN LOGIC LOCATION #6: Login Form */}
                {/* This form calls handleLogin when submitted */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-id" className="text-gray-700">
                      Admin ID
                    </Label>
                    <Input
                      id="admin-id"
                      type="text"
                      placeholder="Masukkan Admin ID"
                      required
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Masukkan password admin"
                      required
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auth-code" className="text-gray-700">
                      Kode Otentikasi (2FA)
                    </Label>
                    <Input
                      id="auth-code"
                      type="text"
                      placeholder="6-digit code"
                      maxLength={6}
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                      <Lock className="h-4 w-4 mr-2" />
                      Authenticate
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowLoginModal(false)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-xs text-gray-500 text-center mt-4">
              Lupa kredensial? Hubungi IT Administrator untuk reset akun.
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Admin Dashboard for Logged In Users
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Manajemen Bisnis</h1>
              <p className="text-gray-600 mt-1">Selamat datang di sistem manajemen bisnis komprehensif Anda</p>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin Authenticated
                  </Badge>
                  {/* 🔥 LOGIN LOGIC LOCATION #7: Logout Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLoggedIn(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setShowLoginModal(true)} className="bg-amber-600 hover:bg-amber-700">
                  Login
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifikasi
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <Settings className="h-4 w-4 mr-2" />
                Pengaturan
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Selamat Datang di Hub Bisnis Anda</CardTitle>
              <CardDescription className="text-amber-100">
                Platform komprehensif ini menyediakan semua yang Anda butuhkan untuk mengelola bisnis real estat Anda
                secara efisien. Jelajahi modul-modul di bawah ini untuk memulai dengan manajemen klien, listing
                properti, dan lainnya.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Button className="bg-white text-amber-600 hover:bg-amber-50">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Lihat Analitik
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-amber-600 bg-transparent"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Jadwalkan Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Modul Sistem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Card
                key={index}
                className="bg-white border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-amber-300"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`h-12 w-12 ${module.color} rounded-lg flex items-center justify-center shadow-sm`}>
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">{module.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-2 text-gray-600">{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {module.features.map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    {/* 🔥 LOGIN LOGIC LOCATION #8: Module Access Buttons */}
                    {/* These buttons call handleModuleAccess which checks login status */}
                    <Button
                      className={`w-full mt-4 ${module.color} ${module.hoverColor} text-white`}
                      onClick={() => handleModuleAccess(module.route)}
                    >
                      Akses {module.title}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Aksi Cepat</CardTitle>
            <CardDescription className="text-gray-600">
              Tugas umum dan pintasan untuk membantu Anda memulai dengan cepat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                onClick={() => handleModuleAccess("/admin-manager")}
              >
                <Shield className="h-5 w-5" />
                <span className="text-sm">Kelola Admin</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                onClick={() => handleModuleAccess("/customers")}
              >
                <Users className="h-5 w-5" />
                <span className="text-sm">Tambah Pelanggan Baru</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                onClick={() => handleModuleAccess("/products")}
              >
                <Package className="h-5 w-5" />
                <span className="text-sm">Tambah Produk Baru</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                onClick={() => handleModuleAccess("/calendar")}
              >
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Jadwalkan Event</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">© 2024 Sistem Manajemen Bisnis. Semua hak dilindungi.</p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                Bantuan
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                Dokumentasi
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
