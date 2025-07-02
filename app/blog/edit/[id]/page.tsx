"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import LexicalEditor from "@/components/lexical-editor"
import BlogPreview from "@/components/blog-preview"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: "market_update" as "market_update" | "property_showcase" | "tips_guides" | "success_stories" | "news",
    status: "draft" as "draft" | "published" | "scheduled",
    publishDate: "",
    tags: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${params.id}`)
      if (response.ok) {
        const postData = await response.json()
        setPost(postData)
        setFormData({
          title: postData.title,
          content: postData.content,
          author: postData.author,
          category: postData.category,
          status: postData.status,
          publishDate: postData.publishDate,
          tags: postData.tags.join(", "),
        })
      } else {
        console.error("Failed to fetch post")
        router.push("/blog")
      }
    } catch (error) {
      console.error("Error fetching post:", error)
      router.push("/blog")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const postData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }
      const response = await fetch(`/api/blog/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        router.push("/blog")
      } else {
        console.error("Failed to update post")
      }
    } catch (error) {
      console.error("Error updating post:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveDraft = async () => {
    const draftData = { ...formData, status: "draft" as const }
    setFormData(draftData)

    try {
      const postData = {
        ...draftData,
        tags: draftData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }
      const response = await fetch(`/api/blog/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        router.push("/blog")
      }
    } catch (error) {
      console.error("Error saving draft:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Memuat post blog...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Post tidak ditemukan</h1>
          <Button onClick={() => router.push("/blog")} className="mt-4">
            Kembali ke Blog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/blog")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Post Blog</h1>
                <p className="text-gray-600">Perbarui konten real estat Anda</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={!formData.title || !formData.content}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Blog Post Preview</DialogTitle>
                    <DialogDescription>Preview how your blog post will appear to readers</DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <BlogPreview
                      title={formData.title}
                      content={formData.content}
                      author={formData.author}
                      publishDate={formData.publishDate}
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
                Save Draft
              </Button>
              <Button onClick={handleSave} disabled={isSaving || !formData.title || !formData.content}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Memperbarui..." : "Perbarui"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Konten Post</CardTitle>
                <CardDescription>Edit konten post blog Anda menggunakan rich text editor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Post Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter your blog post title..."
                    className="text-lg font-medium"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <LexicalEditor
                    key={post.id} // Force re-render when post changes
                    initialContent={formData.content}
                    onChange={(html) => setFormData({ ...formData, content: html })}
                    placeholder="Start writing your blog post content here..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
                <CardDescription>Configure your post details and publishing options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as
                          | "market_update"
                          | "property_showcase"
                          | "tips_guides"
                          | "success_stories"
                          | "news",
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="market_update">Market Update</option>
                    <option value="property_showcase">Property Showcase</option>
                    <option value="tips_guides">Tips & Guides</option>
                    <option value="success_stories">Success Stories</option>
                    <option value="news">News</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "draft" | "published" | "scheduled" })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="real estate, market trends, buying tips"
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
                </div>
              </CardContent>
            </Card>

            {/* Post Status */}
            <Card>
              <CardHeader>
                <CardTitle>Post Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge
                      variant={
                        formData.status === "published"
                          ? "default"
                          : formData.status === "scheduled"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {formData.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Category:</span>
                    <Badge variant="secondary">{formData.category.replace("_", " ")}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tampilan:</span>
                    <span className="text-sm">{post.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dibuat:</span>
                    <span className="text-sm">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
