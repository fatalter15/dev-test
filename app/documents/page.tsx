"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, FileText, Download, Eye, Edit, Trash2, Upload } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import type { Document, CreateDocumentRequest } from "@/types/document"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [newDocument, setNewDocument] = useState<CreateDocumentRequest>({
    name: "",
    description: "",
    tags: "",
    category: "contract",
    file: null,
  })

  // Mock data
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: "1",
        name: "Kontrak Penjualan Villa Bali",
        description: "Kontrak penjualan properti villa di Bali dengan klien premium",
        category: "contract",
        tags: ["kontrak", "villa", "bali", "penjualan"],
        fileUrl: "/documents/kontrak-villa-bali.pdf",
        fileName: "kontrak-villa-bali.pdf",
        fileSize: 2048576,
        mimeType: "application/pdf",
        uploadedBy: "Admin",
        uploadDate: "2024-01-15",
        lastModified: "2024-01-15",
        version: 1,
        status: "active",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
      },
      {
        id: "2",
        name: "Proposal Marketing Q1 2024",
        description: "Proposal strategi marketing untuk kuartal pertama 2024",
        category: "proposal",
        tags: ["marketing", "proposal", "2024", "strategi"],
        fileUrl: "/documents/proposal-marketing-q1.docx",
        fileName: "proposal-marketing-q1.docx",
        fileSize: 1536000,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        uploadedBy: "Marketing Manager",
        uploadDate: "2024-01-10",
        lastModified: "2024-01-12",
        version: 2,
        status: "active",
        createdAt: "2024-01-10",
        updatedAt: "2024-01-12",
      },
      {
        id: "3",
        name: "Laporan Keuangan Desember 2023",
        description: "Laporan keuangan bulanan untuk bulan Desember 2023",
        category: "report",
        tags: ["keuangan", "laporan", "desember", "2023"],
        fileUrl: "/documents/laporan-keuangan-des-2023.xlsx",
        fileName: "laporan-keuangan-des-2023.xlsx",
        fileSize: 512000,
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        uploadedBy: "Finance Manager",
        uploadDate: "2024-01-05",
        lastModified: "2024-01-05",
        version: 1,
        status: "active",
        createdAt: "2024-01-05",
        updatedAt: "2024-01-05",
      },
    ]
    setDocuments(mockDocuments)
    setIsLoading(false)
  }, [])

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file)
    if (file) {
      // Auto-fill document name from filename
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "")
      setNewDocument((prev) => ({
        ...prev,
        name: prev.name || nameWithoutExtension,
        file: file,
      }))
    } else {
      setNewDocument((prev) => ({
        ...prev,
        file: null,
      }))
    }
  }

  const handleAddDocument = async () => {
    if (!selectedFile || !newDocument.name.trim()) {
      alert("Harap pilih file dan berikan nama dokumen")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newDoc: Document = {
        id: Date.now().toString(),
        name: newDocument.name,
        description: newDocument.description,
        category: newDocument.category,
        tags: newDocument.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        fileUrl: URL.createObjectURL(selectedFile), // In real app, this would be the uploaded file URL
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
        uploadedBy: "Current User",
        uploadDate: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        version: 1,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }

      setUploadProgress(100)
      setDocuments((prev) => [newDoc, ...prev])

      // Reset form
      setNewDocument({
        name: "",
        description: "",
        tags: "",
        category: "contract",
        file: null,
      })
      setSelectedFile(null)
      setIsAddModalOpen(false)
      alert("Dokumen berhasil ditambahkan!")
    } catch (error) {
      console.error("Error adding document:", error)
      alert("Gagal menambahkan dokumen")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "contract":
        return "bg-blue-100 text-blue-800"
      case "proposal":
        return "bg-green-100 text-green-800"
      case "report":
        return "bg-purple-100 text-purple-800"
      case "presentation":
        return "bg-orange-100 text-orange-800"
      case "other":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat dokumen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Dokumen</h1>
          <p className="text-gray-600">Kelola semua dokumen perusahaan Anda</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Dokumen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Dokumen Baru</DialogTitle>
              <DialogDescription>Upload dan kelola dokumen perusahaan</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Upload File</Label>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    acceptedTypes={[
                      ".pdf",
                      ".doc",
                      ".docx",
                      ".xls",
                      ".xlsx",
                      ".ppt",
                      ".pptx",
                      ".txt",
                      ".jpg",
                      ".jpeg",
                      ".png",
                    ]}
                    maxSize={50}
                    className="mt-2"
                  />
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mengupload...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nama Dokumen *</Label>
                    <Input
                      id="name"
                      value={newDocument.name}
                      onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                      placeholder="Masukkan nama dokumen"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <select
                      id="category"
                      value={newDocument.category}
                      onChange={(e) => setNewDocument({ ...newDocument, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="contract">Kontrak</option>
                      <option value="proposal">Proposal</option>
                      <option value="report">Laporan</option>
                      <option value="presentation">Presentasi</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={newDocument.description}
                    onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                    placeholder="Deskripsi dokumen (opsional)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={newDocument.tags}
                    onChange={(e) => setNewDocument({ ...newDocument, tags: e.target.value })}
                    placeholder="Pisahkan dengan koma (contoh: kontrak, penjualan, villa)"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleAddDocument} disabled={isUploading || !selectedFile} className="flex-1">
                  {isUploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Mengupload...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Dokumen
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isUploading}>
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dokumen</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">Semua dokumen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kontrak</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.filter((d) => d.category === "contract").length}</div>
            <p className="text-xs text-muted-foreground">Dokumen kontrak</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laporan</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.filter((d) => d.category === "report").length}</div>
            <p className="text-xs text-muted-foreground">Dokumen laporan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposal</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.filter((d) => d.category === "proposal").length}</div>
            <p className="text-xs text-muted-foreground">Dokumen proposal</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari dokumen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Dokumen</CardTitle>
          <CardDescription>Kelola dan akses semua dokumen perusahaan</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Dokumen</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Ukuran</TableHead>
                <TableHead>Diupload Oleh</TableHead>
                <TableHead>Tanggal Upload</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{document.name}</div>
                      <div className="text-sm text-gray-500">{document.fileName}</div>
                      {document.description && <div className="text-xs text-gray-400 mt-1">{document.description}</div>}
                      {document.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {document.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {document.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{document.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryBadgeColor(document.category)}>
                      {document.category === "contract" && "Kontrak"}
                      {document.category === "proposal" && "Proposal"}
                      {document.category === "report" && "Laporan"}
                      {document.category === "presentation" && "Presentasi"}
                      {document.category === "other" && "Lainnya"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                  <TableCell>{document.uploadedBy}</TableCell>
                  <TableCell>{new Date(document.uploadDate).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>
                    <Badge variant={document.status === "active" ? "default" : "secondary"}>
                      {document.status === "active" ? "Aktif" : "Arsip"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
    </div>
  )
}
