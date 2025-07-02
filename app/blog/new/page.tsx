"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import LexicalEditor from "@/components/lexical-editor"
import BlogPreview from "@/components/blog-preview"
import type { CreateBlogPostRequest } from "@/types/blog"

export default function NewBlogPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [blogPost, setBlogPost] = useState<CreateBlogPostRequest>({
    title: "",
    content: "",
    excerpt: "",
    author: "Admin",
    category: "Properti",
    tags: "",
    status: "draft",
    publishDate: new Date().toISOString().split("T")[0],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  })

  const handleContentChange = (html: string) => {
    setBlogPost((prev) => ({ ...prev, content: html }))
  }

  const handleSave = async (status: "draft" | "published") => {
    if (!blogPost.title.trim() || !blogPost.content.trim()) {
      alert("Judul dan konten harus diisi")
      return
    }

    setIsLoading(true)
    try {
      const postData = {
        ...blogPost,
        status,
        tags: blogPost.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        alert(`Post berhasil ${status === "draft" ? "disimpan sebagai draft" : "dipublikasikan"}!`)
        router.push("/blog")
      } else {
        alert("Gagal menyimpan post")
      }
    } catch (error) {
      console.error("Error saving blog post:", error)
      alert("Gagal menyimpan post")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buat Post Blog Baru</h1>
            <p className="text-gray-600">Tulis dan publikasikan konten blog</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <BlogPreview
            title={blogPost.title}
            content={blogPost.content}
            author={blogPost.author}
            publishDate={blogPost.publishDate}
          />
          <Button variant="outline" onClick={() => handleSave("draft")} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Simpan Draft
          </Button>
          <Button onClick={() => handleSave("published")} disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Publikasikan"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Konten Post</CardTitle>
              <CardDescription>Tulis konten utama blog post Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Post *</Label>
                <Input
                  id="title"
                  value={blogPost.title}
                  onChange={(e) => setBlogPost({ ...blogPost, title: e.target.value })}
                  placeholder="Masukkan judul post blog"
                  className="text-lg font-medium"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  value={blogPost.excerpt}
                  onChange={(e) => setBlogPost({ ...blogPost, excerpt: e.target.value })}
                  placeholder="Ringkasan singkat tentang post ini"
                  rows={3}
                />
              </div>

              <div>
                <Label>Konten *</Label>
                <LexicalEditor
                  initialContent={blogPost.content}
                  onChange={handleContentChange}
                  placeholder="Mulai menulis konten blog Anda..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="author">Penulis</Label>
                <Input
                  id="author"
                  value={blogPost.author}
                  onChange={(e) => setBlogPost({ ...blogPost, author: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  value={blogPost.category}
                  onChange={(e) => setBlogPost({ ...blogPost, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Properti">Properti</option>
                  <option value="Investasi">Investasi</option>
                  <option value="Tips">Tips</option>
                  <option value="Berita">Berita</option>
                  <option value="Panduan">Panduan</option>
                </select>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={blogPost.tags}
                  onChange={(e) => setBlogPost({ ...blogPost, tags: e.target.value })}
                  placeholder="Pisahkan dengan koma"
                />
              </div>

              <div>
                <Label htmlFor="publishDate">Tanggal Publikasi</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={blogPost.publishDate}
                  onChange={(e) => setBlogPost({ ...blogPost, publishDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimasi untuk mesin pencari</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={blogPost.seoTitle}
                  onChange={(e) => setBlogPost({ ...blogPost, seoTitle: e.target.value })}
                  placeholder="Judul untuk SEO (opsional)"
                />
              </div>

              <div>
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  value={blogPost.seoDescription}
                  onChange={(e) => setBlogPost({ ...blogPost, seoDescription: e.target.value })}
                  placeholder="Deskripsi untuk hasil pencarian"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="seoKeywords">Keywords</Label>
                <Input
                  id="seoKeywords"
                  value={blogPost.seoKeywords}
                  onChange={(e) => setBlogPost({ ...blogPost, seoKeywords: e.target.value })}
                  placeholder="Kata kunci, pisahkan dengan koma"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
