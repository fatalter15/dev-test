"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Plus, Edit, Trash2, ArrowLeft, Eye, MousePointer, Users, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { ExcelExporter } from "@/utils/excel-export"

interface Campaign {
  id: string
  name: string
  type: "social_media" | "email" | "print" | "online_ads"
  budget: number
  spent: number
  leads: number
  conversions: number
  startDate: string
  endDate: string
  status: "active" | "completed" | "paused"
  createdAt: string
}

export default function MarketingPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "social_media" as "social_media" | "email" | "print" | "online_ads",
    budget: 0,
    spent: 0,
    leads: 0,
    conversions: 0,
    startDate: "",
    endDate: "",
    status: "active" as "active" | "completed" | "paused",
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/marketing")
      const data = await response.json()
      setCampaigns(data)
    } catch (error) {
      console.error("Error fetching campaigns:", error)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        await fetchCampaigns()
        setIsCreateModalOpen(false)
        setFormData({
          name: "",
          type: "social_media",
          budget: 0,
          spent: 0,
          leads: 0,
          conversions: 0,
          startDate: "",
          endDate: "",
          status: "active",
        })
      }
    } catch (error) {
      console.error("Error creating campaign:", error)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCampaign) return

    try {
      const response = await fetch(`/api/marketing/${editingCampaign.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        await fetchCampaigns()
        setIsEditModalOpen(false)
        setEditingCampaign(null)
        setFormData({
          name: "",
          type: "social_media",
          budget: 0,
          spent: 0,
          leads: 0,
          conversions: 0,
          startDate: "",
          endDate: "",
          status: "active",
        })
      }
    } catch (error) {
      console.error("Error updating campaign:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return

    try {
      const response = await fetch(`/api/marketing/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        await fetchCampaigns()
      }
    } catch (error) {
      console.error("Error deleting campaign:", error)
    }
  }

  const openEditModal = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setFormData({
      name: campaign.name,
      type: campaign.type,
      budget: campaign.budget,
      spent: campaign.spent,
      leads: campaign.leads,
      conversions: campaign.conversions,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      status: campaign.status,
    })
    setIsEditModalOpen(true)
  }

  const handleExportToExcel = () => {
    ExcelExporter.exportMarketingToExcel(campaigns)
  }

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="h-8 w-8 mr-3 text-orange-500" />
                  Laporan Pemasaran
                </h1>
                <p className="text-gray-600 mt-1">Analisis kampanye dan lacak performa pemasaran</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleExportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Kampanye Baru</DialogTitle>
                    <DialogDescription>Buat kampanye pemasaran baru</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Kampanye</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Jenis Kampanye</Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as "social_media" | "email" | "print" | "online_ads",
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="social_media">Media Sosial</option>
                        <option value="email">Email Marketing</option>
                        <option value="print">Iklan Cetak</option>
                        <option value="online_ads">Iklan Online</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="budget">Anggaran (Rp)</Label>
                      <Input
                        id="budget"
                        type="number"
                        step="0.01"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: Number.parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="startDate">Tanggal Mulai</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Tanggal Selesai</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1">
                        Create Campaign
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Anggaran</p>
                  <p className="text-2xl font-bold text-gray-900">${totalBudget.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Terpakai</p>
                  <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                </div>
                <Eye className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Prospek</p>
                  <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Konversi</p>
                  <p className="text-2xl font-bold text-gray-900">{totalConversions}</p>
                </div>
                <MousePointer className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Campaigns</CardTitle>
            <CardDescription>View and manage marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Anggaran</TableHead>
                  <TableHead>Terpakai</TableHead>
                  <TableHead>Prospek</TableHead>
                  <TableHead>Konversi</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const roi =
                    campaign.spent > 0 ? ((campaign.conversions * 1000 - campaign.spent) / campaign.spent) * 100 : 0
                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{campaign.type.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell>${campaign.budget.toFixed(2)}</TableCell>
                      <TableCell>${campaign.spent.toFixed(2)}</TableCell>
                      <TableCell>{campaign.leads}</TableCell>
                      <TableCell>{campaign.conversions}</TableCell>
                      <TableCell>
                        <Badge variant={roi > 0 ? "default" : "destructive"}>{roi.toFixed(1)}%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            campaign.status === "active"
                              ? "default"
                              : campaign.status === "completed"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => openEditModal(campaign)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(campaign.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>Update campaign information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Campaign Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-type">Campaign Type</Label>
              <select
                id="edit-type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "social_media" | "email" | "print" | "online_ads",
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="social_media">Social Media</option>
                <option value="email">Email Marketing</option>
                <option value="print">Print Advertising</option>
                <option value="online_ads">Online Ads</option>
              </select>
            </div>
            <div>
              <Label htmlFor="edit-budget">Budget ($)</Label>
              <Input
                id="edit-budget"
                type="number"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number.parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-spent">Spent ($)</Label>
              <Input
                id="edit-spent"
                type="number"
                step="0.01"
                value={formData.spent}
                onChange={(e) => setFormData({ ...formData, spent: Number.parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="edit-leads">Leads</Label>
              <Input
                id="edit-leads"
                type="number"
                value={formData.leads}
                onChange={(e) => setFormData({ ...formData, leads: Number.parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="edit-conversions">Conversions</Label>
              <Input
                id="edit-conversions"
                type="number"
                value={formData.conversions}
                onChange={(e) => setFormData({ ...formData, conversions: Number.parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as "active" | "completed" | "paused" })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Update Campaign
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
