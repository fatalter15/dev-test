"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Trash2, ArrowLeft, Eye, Calendar, User } from "lucide-react"
import { useRouter } from "next/navigation"
import BlogPreview from "@/components/blog-preview"

interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  category: "market_update" | "property_showcase" | "tips_guides" | "success_stories" | "news"
  status: "draft" | "published" | "scheduled"
  publishDate: string
  views: number
  tags: string[]
  createdAt: string
}

export default function BlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        await fetchPosts()
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const totalPosts = posts.length
  const publishedPosts = posts.filter((p) => p.status === "published").length
  const draftPosts = posts.filter((p) => p.status === "draft").length
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0)

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
                  <Edit className="h-8 w-8 mr-3 text-cyan-500" />
                  Manajemen Blog
                </h1>
                <p className="text-gray-600 mt-1">Buat dan kelola konten real estat dan update pasar</p>
              </div>
            </div>
            <Button onClick={() => router.push("/blog/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Post Baru
            </Button>
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
                  <p className="text-sm font-medium text-gray-600">Total Post</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
                </div>
                <Edit className="h-8 w-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dipublikasi</p>
                  <p className="text-2xl font-bold text-gray-900">{publishedPosts}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Live</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-gray-900">{draftPosts}</p>
                </div>
                <Badge variant="secondary">Draft</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tampilan</p>
                  <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Semua Post Blog</CardTitle>
            <CardDescription>Kelola konten blog real estat Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tampilan</TableHead>
                  <TableHead>Tanggal Publikasi</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{post.category.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.status === "published"
                            ? "default"
                            : post.status === "scheduled"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <BlogPreview
                          title={post.title}
                          content={post.content}
                          author={post.author}
                          publishDate={post.publishDate}
                        />
                        <Button size="sm" variant="outline" onClick={() => router.push(`/blog/edit/${post.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(post.id)}>
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
    </div>
  )
}
