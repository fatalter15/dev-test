"use client"

import type React from "react"
import type { JSX } from "react/jsx-runtime"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils"
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  DecoratorNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalCommand,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from "lexical"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
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
import { ImageIcon, Upload, X } from "lucide-react"

export interface ImagePayload {
  altText: string
  caption?: string
  height?: number
  key?: NodeKey
  maxWidth?: number
  showCaption?: boolean
  src: string
  width?: number
}

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> = createCommand("INSERT_IMAGE_COMMAND")

export type SerializedImageNode = Spread<
  {
    altText: string
    caption?: string
    height?: number
    maxWidth?: number
    showCaption?: boolean
    src: string
    width?: number
  },
  SerializedLexicalNode
>

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode
    const node = $createImageNode({ altText, height, src, width })
    return { node }
  }
  return null
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string
  __altText: string
  __width: "inherit" | number
  __height: "inherit" | number
  __maxWidth: number
  __showCaption: boolean
  __caption?: string

  static getType(): string {
    return "image"
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__key,
    )
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, src, showCaption, caption } = serializedNode
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      showCaption,
      src,
      width,
    })
    node.setCaption(caption)
    return node
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img")
    element.setAttribute("src", this.__src)
    element.setAttribute("alt", this.__altText)
    element.setAttribute("width", this.__width.toString())
    element.setAttribute("height", this.__height.toString())
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    }
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: "inherit" | number,
    height?: "inherit" | number,
    showCaption?: boolean,
    caption?: string,
    key?: NodeKey,
  ) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__maxWidth = maxWidth
    this.__width = width || "inherit"
    this.__height = height || "inherit"
    this.__showCaption = showCaption || false
    this.__caption = caption
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      caption: this.__caption,
      height: this.__height === "inherit" ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      showCaption: this.__showCaption,
      src: this.getSrc(),
      type: "image",
      version: 1,
      width: this.__width === "inherit" ? 0 : this.__width,
    }
  }

  setWidthAndHeight(width: "inherit" | number, height: "inherit" | number): void {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }

  setShowCaption(showCaption: boolean): void {
    const writable = this.getWritable()
    writable.__showCaption = showCaption
  }

  setCaption(caption?: string): void {
    const writable = this.getWritable()
    writable.__caption = caption
  }

  // View
  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span")
    const theme = config.theme
    const className = theme.image
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  updateDOM(): false {
    return false
  }

  getSrc(): string {
    return this.__src
  }

  getAltText(): string {
    return this.__altText
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src || "/placeholder.svg"}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        showCaption={this.__showCaption}
        caption={this.__caption}
      />
    )
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  src,
  width,
  showCaption,
  caption,
  key,
}: ImagePayload): ImageNode {
  return new ImageNode(src, altText, maxWidth, width, height, showCaption, caption, key)
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode
}

interface ImageComponentProps {
  altText: string
  caption?: string
  height: "inherit" | number
  maxWidth: number
  nodeKey: NodeKey
  showCaption?: boolean
  src: string
  width: "inherit" | number
}

function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  showCaption,
  caption,
}: ImageComponentProps): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const imageRef = useRef<null | HTMLImageElement>(null)

  const onDelete = () => {
    editor.update(() => {
      const node = editor.getElementByKey(nodeKey)
      if (node) {
        node.remove()
      }
    })
  }

  return (
    <div className="relative inline-block max-w-full">
      <img
        className="max-w-full h-auto rounded-lg"
        src={src || "/placeholder.svg"}
        alt={altText}
        ref={imageRef}
        style={{
          height,
          maxWidth,
          width,
        }}
        draggable="false"
      />
      <Button className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600" onClick={onDelete} size="sm">
        <X className="h-3 w-3" />
      </Button>
      {showCaption && (
        <div className="mt-2 text-sm text-gray-600 italic text-center">{caption || "Enter a caption..."}</div>
      )}
    </div>
  )
}

export default function ImagesPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor")
    }

    return mergeRegister(
      editor.registerCommand<ImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload)
          $insertNodes([imageNode])
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd()
          }

          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor])

  return null
}

// Image Upload Dialog Component
interface ImageUploadDialogProps {
  onInsert: (payload: ImagePayload) => void
}

export function ImageUploadDialog({ onInsert }: ImageUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageData, setImageData] = useState({
    src: "",
    altText: "",
    caption: "",
    showCaption: false,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setImageData({
          ...imageData,
          src: result.url,
          altText: file.name.split(".")[0],
        })
      } else {
        alert("Gagal mengupload gambar")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Gagal mengupload gambar")
    } finally {
      setIsUploading(false)
    }
  }

  const handleInsert = () => {
    if (!imageData.src || !imageData.altText) {
      alert("Harap berikan gambar dan teks alt")
      return
    }

    onInsert({
      src: imageData.src,
      altText: imageData.altText,
      caption: imageData.caption,
      showCaption: imageData.showCaption,
      maxWidth: 500,
    })

    // Reset form
    setImageData({
      src: "",
      altText: "",
      caption: "",
      showCaption: false,
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mr-1 bg-transparent">
          <ImageIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sisipkan Gambar</DialogTitle>
          <DialogDescription>Upload gambar atau berikan URL</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Upload Gambar</Label>
            <div className="mt-1">
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Mengupload..." : "Pilih File"}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="image-url">Atau URL Gambar</Label>
            <Input
              id="image-url"
              value={imageData.src}
              onChange={(e) => setImageData({ ...imageData, src: e.target.value })}
              placeholder="https://contoh.com/gambar.jpg"
            />
          </div>

          {imageData.src && (
            <div>
              <Label>Pratinjau</Label>
              <img
                src={imageData.src || "/placeholder.svg"}
                alt="Preview"
                className="mt-2 max-w-full h-auto max-h-48 rounded border"
              />
            </div>
          )}

          <div>
            <Label htmlFor="alt-text">Teks Alt (Wajib)</Label>
            <Input
              id="alt-text"
              value={imageData.altText}
              onChange={(e) => setImageData({ ...imageData, altText: e.target.value })}
              placeholder="Deskripsikan gambar untuk aksesibilitas"
              required
            />
          </div>

          <div>
            <Label htmlFor="caption">Keterangan (Opsional)</Label>
            <Input
              id="caption"
              value={imageData.caption}
              onChange={(e) => setImageData({ ...imageData, caption: e.target.value })}
              placeholder="Keterangan gambar"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-caption"
              checked={imageData.showCaption}
              onChange={(e) => setImageData({ ...imageData, showCaption: e.target.checked })}
            />
            <Label htmlFor="show-caption">Tampilkan keterangan</Label>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleInsert} className="flex-1" disabled={!imageData.src || !imageData.altText}>
              Sisipkan Gambar
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
