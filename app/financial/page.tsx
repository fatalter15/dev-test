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
import { DollarSign, Plus, Edit, Trash2, ArrowLeft, TrendingUp, TrendingDown, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { ExcelExporter } from "@/utils/excel-export"

interface Transaction {
  id: string
  type: "commission" | "expense" | "payment"
  description: string
  amount: number
  client: string
  property: string
  date: string
  status: "completed" | "pending" | "cancelled"
  createdAt: string
}

export default function FinancialPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [formData, setFormData] = useState({
    type: "commission" as "commission" | "expense" | "payment",
    description: "",
    amount: 0,
    client: "",
    property: "",
    date: "",
    status: "pending" as "completed" | "pending" | "cancelled",
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/financial")
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/financial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        await fetchTransactions()
        setIsCreateModalOpen(false)
        setFormData({
          type: "commission",
          description: "",
          amount: 0,
          client: "",
          property: "",
          date: "",
          status: "pending",
        })
      }
    } catch (error) {
      console.error("Error creating transaction:", error)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTransaction) return

    try {
      const response = await fetch(`/api/financial/${editingTransaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        await fetchTransactions()
        setIsEditModalOpen(false)
        setEditingTransaction(null)
        setFormData({
          type: "commission",
          description: "",
          amount: 0,
          client: "",
          property: "",
          date: "",
          status: "pending",
        })
      }
    } catch (error) {
      console.error("Error updating transaction:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return

    try {
      const response = await fetch(`/api/financial/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        await fetchTransactions()
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      type: transaction.type,
      description: transaction.description,
      amount: transaction.amount,
      client: transaction.client,
      property: transaction.property,
      date: transaction.date,
      status: transaction.status,
    })
    setIsEditModalOpen(true)
  }

  const handleExportToExcel = () => {
    ExcelExporter.exportFinancialToExcel(transactions)
  }

  const totalRevenue = transactions
    .filter((t) => t.type === "commission" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingPayments = transactions.filter((t) => t.status === "pending").length

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
                  <DollarSign className="h-8 w-8 mr-3 text-green-500" />
                  Manajemen Keuangan
                </h1>
                <p className="text-gray-600 mt-1">Lacak komisi, pengeluaran, dan transaksi keuangan</p>
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
                    Add Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Transaksi Baru</DialogTitle>
                    <DialogDescription>Buat transaksi keuangan baru</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <Label htmlFor="type">Jenis Transaksi</Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value as "commission" | "expense" | "payment" })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="commission">Komisi</option>
                        <option value="expense">Pengeluaran</option>
                        <option value="payment">Pembayaran</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="description">Deskripsi</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Jumlah (Rp)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="client">Klien</Label>
                      <Input
                        id="client"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="property">Properti</Label>
                      <Input
                        id="property"
                        value={formData.property}
                        onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Tanggal</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1">
                        Create Transaction
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
                  <p className="text-sm font-medium text-gray-600">Total Pendapatan</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pengeluaran</p>
                  <p className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Laba Bersih</p>
                  <p className="text-2xl font-bold text-gray-900">${(totalRevenue - totalExpenses).toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pembayaran Tertunda</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>View and manage financial transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Klien</TableHead>
                  <TableHead>Properti</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.type === "commission"
                            ? "default"
                            : transaction.type === "expense"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.client}</TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : transaction.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEditModal(transaction)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(transaction.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>Update transaction information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-type">Transaction Type</Label>
              <select
                id="edit-type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as "commission" | "expense" | "payment" })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="commission">Commission</option>
                <option value="expense">Expense</option>
                <option value="payment">Payment</option>
              </select>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-amount">Amount ($)</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-client">Client</Label>
              <Input
                id="edit-client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-property">Property</Label>
              <Input
                id="edit-property"
                value={formData.property}
                onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as "completed" | "pending" | "cancelled" })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Update Transaction
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
