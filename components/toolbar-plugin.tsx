"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical"
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from "@lexical/rich-text"
import { $wrapNodes } from "@lexical/selection"
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils"
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from "@lexical/list"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Quote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  Type,
} from "lucide-react"
import { ImageUploadDialog, INSERT_IMAGE_COMMAND, type ImagePayload } from "./image-plugin"

const LowPriority = 1

function Divider() {
  return <div className="w-px h-6 bg-gray-300 mx-2" />
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const toolbarRef = useRef(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [blockType, setBlockType] = useState("paragraph")
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(null)
  const [isRTL, setIsRTL] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      const element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow()
      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey)
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, "ListNode")
          const type = parentList ? parentList.getTag() : element.getTag()
          setBlockType(type)
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType()
          setBlockType(type)
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      setIsUnderline(selection.hasFormat("underline"))
      setIsStrikethrough(selection.hasFormat("strikethrough"))
      setIsCode(selection.hasFormat("code"))
      setIsRTL($isRangeSelection(selection) && selection.anchor.type === "text")
    }
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar()
          return false
        },
        LowPriority,
      ),
    )
  }, [editor, updateToolbar])

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode())
        }
      })
    }
  }

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"))
        }
      })
    }
  }

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"))
        }
      })
    }
  }

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode())
        }
      })
    }
  }

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const insertImage = (payload: ImagePayload) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
  }

  return (
    <div className="toolbar flex items-center p-2 border-b border-gray-300 bg-gray-50 flex-wrap gap-1" ref={toolbarRef}>
      <Button
        variant={blockType === "paragraph" ? "default" : "outline"}
        size="sm"
        onClick={formatParagraph}
        className="mr-1"
      >
        <Type className="h-4 w-4" />
      </Button>
      <Button
        variant={blockType === "h1" ? "default" : "outline"}
        size="sm"
        onClick={formatLargeHeading}
        className="mr-1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant={blockType === "h2" ? "default" : "outline"}
        size="sm"
        onClick={formatSmallHeading}
        className="mr-1"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button variant={blockType === "quote" ? "default" : "outline"} size="sm" onClick={formatQuote} className="mr-1">
        <Quote className="h-4 w-4" />
      </Button>
      <Divider />
      <Button
        variant={isBold ? "default" : "outline"}
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        }}
        className="mr-1"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={isItalic ? "default" : "outline"}
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        }}
        className="mr-1"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={isUnderline ? "default" : "outline"}
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        }}
        className="mr-1"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant={isStrikethrough ? "default" : "outline"}
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }}
        className="mr-1"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        variant={isCode ? "default" : "outline"}
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")
        }}
        className="mr-1"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Divider />
      <Button
        variant={blockType === "ul" ? "default" : "outline"}
        size="sm"
        onClick={formatBulletList}
        className="mr-1"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={blockType === "ol" ? "default" : "outline"}
        size="sm"
        onClick={formatNumberedList}
        className="mr-1"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Divider />
      <ImageUploadDialog onInsert={insertImage} />
    </div>
  )
}
