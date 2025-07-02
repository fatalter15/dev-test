"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  FileText,
  Edit,
  Shield,
  BarChart3,
  Bell,
  Settings,
  ChevronRight,
  Activity,
  Target,
} from "lucide-react"
import { useRouter } from "next/navigation"
import type { DashboardStats, RecentActivity, QuickAction } from "@/types"

export default function AdminLanding() {
  const router = useRouter()
  const [stats] = useState<DashboardStats>({
    customers: {
      total: 1247,
      active: 1089,
      thisMonth: 89,
      growth: 12.5,
    },
    properties: {
      total: 456,
      available: 234,
      sold: 178,
      totalValue: 125000000000,
    },
    financial: {
      revenue: 2500000000,
      expenses: 1200000000,
      profit: 1300000000,
      pendingPayments: 15,
    },
    marketing: {
      activeCampaigns: 8,
      totalLeads: 342,
      conversions: 67,
      roi: 285.5,
    },
    blog: {
      totalPosts: 124,
      published: 98,
      views: 45678,
      engagement: 78.5,
    },
    documents: {
      total: 2341,
      pending: 23,
      storageUsed: "12.4 GB",
    },
  })

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "customer",
      title: "Klien Baru Terdaftar",
      description: "Budi Santoso mendaftar sebagai klien baru",
      timestamp: "2024-01-15T10:30:00Z",
      user: "System",
      status: "success",
    },
    {
      id: "2",
      type: "property",
      title: "Properti Terjual",
      description: "Rumah di Menteng berhasil terjual seharga Rp 2.5M",
      timestamp: "2024-01-15T09:15:00Z",
      user: "Siti Nurhaliza",
      status: "success",
    },
    {
      id: "3",
      type: "transaction",
      title: "Komisi Diterima",
      description: "Komisi penjualan sebesar Rp 125 juta",
      timestamp: "2024-01-15T08:45:00Z",
      user: "Ahmad Wijaya",
      status: "success",
    },
    {
      id: "4",
      type: "campaign",
      title: "Kampanye Dimulai",
      description: "Kampanye media sosial Q1 2024 telah dimulai",
      timestamp: "2024-01-15T08:00:00Z",
      user: "Dewi Lestari",
      status: "info",
    },
  ])

  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "Tambah Klien",
      description: "Daftarkan klien baru",
      icon: "Users",
      href: "/customers",
      color: "emerald",
    },
    {
      id: "2",
      title: "Listing Properti",
      description: "Tambah properti baru",
      icon: "Package",
      href: "/products",
      color: "blue",
    },
    {
      id: "3",
      title: "Catat Transaksi",
      description: "Input transaksi keuangan",
      icon: "DollarSign",
      href: "/financial",
      color: "green",
    },
    {
      id: "4",
      title: "Buat Kampanye",
      description: "Kampanye pemasaran baru",
      icon: "TrendingUp",
      href: "/marketing",
      color: "orange",
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num)
  }

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "customer":
        return <Users className="h-4 w-4" />
      case "property":
        return <Package className="h-4 w-4" />
      case "transaction":
        return <DollarSign className="h-4 w-4" />
      case "campaign":
        return <TrendingUp className="h-4 w-4" />
      case "blog":
        return <Edit className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Manajemen Bisnis</h1>
              <p className="text-gray-600 mt-1">Kelola semua aspek bisnis real estat Anda dalam satu platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifikasi
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Pengaturan
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(action.href)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                      {action.icon === "Users" && <Users className={`h-5 w-5 text-${action.color}-600`} />}
                      {action.icon === "Package" && <Package className={`h-5 w-5 text-${action.color}-600`} />}
                      {action.icon === "DollarSign" && <DollarSign className={`h-5 w-5 text-${action.color}-600`} />}
                      {action.icon === "TrendingUp" && <TrendingUp className={`h-5 w-5 text-${action.color}-600`} />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Customer Stats */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Klien</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.customers.total)}</p>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-green-100 text-green-800 text-xs">+{stats.customers.growth}%</Badge>
                    <span className="text-xs text-gray-500 ml-2">bulan ini</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          {/* Property Stats */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properti</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.properties.total)}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">{formatNumber(stats.properties.available)} tersedia</span>
                  </div>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* Financial Stats */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendapatan</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.financial.revenue)}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">Laba: {formatCurrency(stats.financial.profit)}</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Customer Management */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/customers")}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-6 w-6 mr-2 text-emerald-500" />
                  Manajemen Klien
                </CardTitle>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <CardDescription>Kelola data klien dan prospek</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Klien Aktif:</span>
                  <span className="font-medium">{formatNumber(stats.customers.active)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Baru Bulan Ini:</span>
                  <span className="font-medium">{formatNumber(stats.customers.thisMonth)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Management */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/products")}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Package className="h-6 w-6 mr-2 text-blue-500" />
                  Manajemen Properti
                </CardTitle>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <CardDescription>Kelola listing dan inventori properti</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tersedia:</span>
                  <span className="font-medium">{formatNumber(stats.properties.available)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Terjual:</span>
                  <span className="font-medium">{formatNumber(stats.properties.sold)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Management */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/financial")}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="h-6 w-6 mr-2 text-green-500" />
                  Manajemen Keuangan
                </CardTitle>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <CardDescription>Lacak pendapatan, komisi, dan pengeluaran</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Laba Bersih:</span>
                  <span className="font-medium text-green-600">{formatCurrency(stats.financial.profit)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pembayaran Tertunda:</span>
                  <span className="font-medium">{formatNumber(stats.financial.pendingPayments)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marketing Reports */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/marketing")}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-orange-500" />
                  Laporan Pemasaran
                </CardTitle>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <CardDescription>Analisis kampanye dan ROI pemasaran</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kampanye Aktif:</span>
                  <span className="font-medium">{formatNumber(stats.marketing.activeCampaigns)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ROI:</span>
                  <span className="font-medium text-green-600">{stats.marketing.roi}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Management */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/documents")}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-slate-500" />
                  Manajemen Dokumen
                </CardTitle>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <CardDescription>Simpan dan atur dokumen penting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Dokumen:</span>
                  <span className="font-medium">{formatNumber(stats.documents.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Penyimpanan:</span>
                  <span className="font-medium">{stats.documents.storageUsed}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blog Management */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/blog")}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Edit className="h-6 w-6 mr-2 text-cyan-500" />
                  Manajemen Blog
                </CardTitle>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <CardDescription>Kelola konten dan artikel blog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Post Dipublikasi:</span>
                  <span className="font-medium">{formatNumber(stats.blog.published)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Views:</span>
                  <span className="font-medium">{formatNumber(stats.blog.views)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Manager */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/admin-manager")}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-purple-500" />
                  Manajemen Admin
                </CardTitle>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <CardDescription>Kelola akses admin dan keamanan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Admin Aktif:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Menunggu Approval:</span>
                  <span className="font-medium text-yellow-600">3</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2 text-indigo-500" />
                  Analytics
                </CardTitle>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <CardDescription>Laporan dan analisis mendalam</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Performa Bulan Ini:</span>
                  <span className="font-medium text-green-600">+15.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target Tercapai:</span>
                  <span className="font-medium">87%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Aktivitas Terbaru
              </CardTitle>
              <CardDescription>Aktivitas sistem dalam 24 jam terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full ${getStatusColor(activity.status || "info")}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Target & KPI
              </CardTitle>
              <CardDescription>Progress target bulanan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Penjualan Properti</span>
                    <span>15/20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Klien Baru</span>
                    <span>89/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "89%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Revenue Target</span>
                    <span>87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: "87%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
