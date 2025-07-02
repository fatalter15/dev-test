"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, UserPlus, Users, Search, Edit, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Admin {
  id: string
  name: string
  email: string
  role: string
  status: "aktif" | "tidak_aktif" | "menunggu"
  lastLogin: string
  registrationMethod: "google" | "manual"
  createdAt: string
}

export default function AdminManagerPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("semua")
  const [selectedStatus, setSelectedStatus] = useState("semua")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"standard" | "google">("standard")

  const [admins, setAdmins] = useState<Admin[]>([
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
      id: "2",
      name: "Siti Nurhaliza",
      email: "siti.nurhaliza@gmail.com",
      role: "Admin",
      status: "aktif",
      lastLogin: "2024-01-14 15:45",
      registrationMethod: "google",
      createdAt: "2024-01-05",
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
    {
      id: "4",
      name: "Dewi Lestari",
      email: "dewi.lestari@company.com",
      role: "Moderator",
      status: "tidak_aktif",
      lastLogin: "2024-01-10 09:15",
      registrationMethod: "manual",
      createdAt: "2023-12-20",
    },
  ])

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "semua" || admin.role === selectedRole
    const matchesStatus = selectedStatus === "semua" || admin.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleApproveAdmin = (id: string) => {
    setAdmins((prev) => prev.map((admin) => (admin.id === id ? { ...admin, status: "aktif" as const } : admin)))
  }

  const handleRejectAdmin = (id: string) => {
    setAdmins((prev) => prev.filter((admin) => admin.id !== id))
  }

  const handleDeactivateAdmin = (id: string) => {
    setAdmins((prev) => prev.map((admin) => (admin.id === id ? { ...admin, status: "tidak_aktif" as const } : admin)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aktif":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aktif</Badge>
      case "tidak_aktif":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Tidak Aktif</Badge>
      case "menunggu":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Menunggu Persetujuan</Badge>
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {status}
          </Badge>
        )
    }
  }

  const getRegistrationBadge = (method: string) => {
    return method === "google" ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        Google
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        Manual
      </Badge>
    )
  }

  const handleGoogleLogin = () => {
    // Simulate Google OAuth
    console.log("Redirecting to Google OAuth...")
    // In real implementation, redirect to Google OAuth
  }

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle standard login
    console.log("Standard login attempted")
    setShowLoginDialog(false)
  }

  const handleGoogleRegister = () => {
    // Simulate Google OAuth for registration
    console.log("Redirecting to Google OAuth for registration...")
    // In real implementation, redirect to Google OAuth
    setShowAddDialog(false)
  }

  const stats = [
    {
      label: "Total Admin",
      value: admins.length.toString(),
      icon: Users,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Admin Aktif",
      value: admins.filter((a) => a.status === "aktif").length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Menunggu Persetujuan",
      value: admins.filter((a) => a.status === "menunggu").length.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Tidak Aktif",
      value: admins.filter((a) => a.status === "tidak_aktif").length.toString(),
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Admin</h1>
                <p className="text-gray-600 mt-1">Kelola akses admin dan kontrol keamanan sistem</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowLoginDialog(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
                <Shield className="h-4 w-4 mr-2" />
                Login Admin
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Tambah Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white border-gray-200">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900">Tambah Admin Baru</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Registrasi admin baru hanya dapat dilakukan melalui akun Google untuk keamanan.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-center">
                      <Button onClick={handleGoogleRegister} className="w-full bg-blue-600 hover:bg-blue-700">
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Daftar dengan Google
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500 text-center">
                      Admin baru akan masuk ke status "Menunggu Persetujuan" dan perlu disetujui oleh Super Admin.
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Main Content */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Daftar Admin</CardTitle>
            <CardDescription className="text-gray-600">
              Kelola semua admin yang memiliki akses ke sistem manajemen bisnis
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari admin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300"
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300">
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="semua">Semua Role</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
                  <SelectItem value="menunggu">Menunggu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Admin Table */}
            <div className="rounded-md border border-gray-200 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-amber-50">
                    <TableHead className="text-gray-900 font-semibold">Nama</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Email</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Role</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Metode Registrasi</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Login Terakhir</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-amber-50">
                      <TableCell className="font-medium text-gray-900">{admin.name}</TableCell>
                      <TableCell className="text-gray-700">{admin.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(admin.status)}</TableCell>
                      <TableCell>{getRegistrationBadge(admin.registrationMethod)}</TableCell>
                      <TableCell className="text-sm text-gray-500">{admin.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {admin.status === "menunggu" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveAdmin(admin.id)}
                                className="text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectAdmin(admin.id)}
                                className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {admin.status === "aktif" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeactivateAdmin(admin.id)}
                              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-amber-600 hover:text-amber-700 border-amber-200 hover:bg-amber-50 bg-transparent"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Login Admin</DialogTitle>
            <DialogDescription className="text-gray-600">
              Pilih metode login untuk mengakses sistem admin.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as "standard" | "google")}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="standard" className="text-gray-700">
                Login Standard
              </TabsTrigger>
              <TabsTrigger value="google" className="text-gray-700">
                Login Google
              </TabsTrigger>
            </TabsList>

            <TabsContent value="standard" className="space-y-4">
              <form onSubmit={handleStandardLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email Anda"
                    required
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password Anda"
                    required
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700">
                    Masuk
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLoginDialog(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="google" className="space-y-4">
              <div className="text-center">
                <Button onClick={handleGoogleLogin} className="w-full bg-blue-600 hover:bg-blue-700">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Masuk dengan Google
                </Button>
              </div>
              <div className="text-sm text-gray-500 text-center">
                Login dengan akun Google yang sudah terdaftar sebagai admin.
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
