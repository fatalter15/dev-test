"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye } from "lucide-react"

interface BlogPreviewProps {
  title: string
  content: string
  author: string
  publishDate: string
}

export default function BlogPreview({ title, content, author, publishDate }: BlogPreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Pratinjau
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pratinjau Post Blog</DialogTitle>
          <DialogDescription>Pratinjau bagaimana post blog Anda akan tampil untuk pembaca</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{title || "Post Tanpa Judul"}</CardTitle>
              <CardDescription>
                Oleh {author || "Penulis Tidak Dikenal"} •{" "}
                {publishDate ? new Date(publishDate).toLocaleDateString("id-ID") : "Tanpa tanggal"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-em:text-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: content || "<p>Tidak ada konten tersedia</p>" }}
              />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
