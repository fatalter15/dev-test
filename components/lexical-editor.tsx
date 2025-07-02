"use client"

import { $getRoot, type EditorState } from "lexical"
import { $generateHtmlFromNodes } from "@lexical/html"
import { $generateNodesFromDOM } from "@lexical/html"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { TRANSFORMERS } from "@lexical/markdown"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { ListItemNode, ListNode } from "@lexical/list"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { useEffect } from "react"
import ToolbarPlugin from "./toolbar-plugin"
import ImagesPlugin, { ImageNode } from "./image-plugin"

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    hashtag: "editor-text-hashtag",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error)
}

interface LexicalEditorProps {
  initialContent?: string
  onChange?: (html: string) => void
  placeholder?: string
}

// Plugin to handle content changes
function ChangePlugin({ onChange }: { onChange?: (html: string) => void }) {
  const [editor] = useLexicalComposerContext()

  const handleChange = (editorState: EditorState) => {
    if (onChange) {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null)
        onChange(htmlString)
      })
    }
  }

  return <OnChangePlugin onChange={handleChange} />
}

// Plugin to set initial content
function InitialContentPlugin({ initialContent }: { initialContent?: string }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (initialContent) {
      editor.update(() => {
        const parser = new DOMParser()
        const dom = parser.parseFromString(initialContent, "text/html")
        const nodes = $generateNodesFromDOM(editor, dom)
        $getRoot().select()
        $getRoot().clear()
        $getRoot().append(...nodes)
      })
    }
  }, [editor, initialContent])

  return null
}

export default function LexicalEditor({ initialContent, onChange, placeholder }: LexicalEditorProps) {
  const initialConfig = {
    namespace: "BlogEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      ImageNode, // Added ImageNode here
    ],
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container relative">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input min-h-[300px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  <div className="editor-placeholder absolute top-4 left-4 text-gray-500">
                    {placeholder || "Enter your content..."}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LinkPlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <ImagesPlugin /> {/* Added ImagesPlugin here */}
          <ChangePlugin onChange={onChange} />
          <InitialContentPlugin initialContent={initialContent} />
        </div>
      </div>
      <style jsx global>{`
        .editor-container {
          margin: 20px auto;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #fff;
        }

        .editor-inner {
          position: relative;
        }

        .editor-input {
          resize: none;
          font-size: 15px;
          position: relative;
          tab-size: 1;
          outline: 0;
          padding: 15px 10px;
          caret-color: rgb(5, 5, 5);
        }

        .editor-placeholder {
          color: #999;
          overflow: hidden;
          position: absolute;
          text-overflow: ellipsis;
          top: 15px;
          left: 10px;
          font-size: 15px;
          user-select: none;
          display: inline-block;
          pointer-events: none;
        }

        .editor-paragraph {
          margin: 0;
          margin-bottom: 8px;
          position: relative;
        }

        .editor-paragraph:last-child {
          margin-bottom: 0;
        }

        .editor-heading-h1 {
          font-size: 24px;
          color: rgb(5, 5, 5);
          font-weight: 400;
          margin: 0;
          margin-bottom: 12px;
          padding: 0;
        }

        .editor-heading-h2 {
          font-size: 20px;
          color: rgb(5, 5, 5);
          font-weight: 400;
          margin: 0;
          margin-bottom: 12px;
          padding: 0;
        }

        .editor-heading-h3 {
          font-size: 18px;
          color: rgb(5, 5, 5);
          font-weight: 400;
          margin: 0;
          margin-bottom: 12px;
          padding: 0;
        }

        .editor-quote {
          margin: 0;
          margin-left: 20px;
          margin-bottom: 10px;
          font-size: 15px;
          color: rgb(101, 103, 107);
          border-left-color: rgb(206, 208, 212);
          border-left-width: 4px;
          border-left-style: solid;
          padding-left: 16px;
        }

        .editor-list-ol {
          padding: 0;
          margin: 0;
          margin-left: 16px;
        }

        .editor-list-ul {
          padding: 0;
          margin: 0;
          margin-left: 16px;
        }

        .editor-listitem {
          margin: 8px 32px 8px 32px;
        }

        .editor-nested-listitem {
          list-style-type: none;
        }

        .editor-text-bold {
          font-weight: bold;
        }

        .editor-text-italic {
          font-style: italic;
        }

        .editor-text-underline {
          text-decoration: underline;
        }

        .editor-text-strikethrough {
          text-decoration: line-through;
        }

        .editor-text-underlineStrikethrough {
          text-decoration: underline line-through;
        }

        .editor-text-code {
          background-color: rgb(240, 242, 245);
          padding: 1px 0.25rem;
          font-family: Menlo, Consolas, Monaco, monospace;
          font-size: 94%;
        }

        .editor-link {
          color: rgb(33, 111, 219);
          text-decoration: none;
        }

        .editor-link:hover {
          text-decoration: underline;
        }

        .editor-code {
          background-color: rgb(240, 242, 245);
          font-family: Menlo, Consolas, Monaco, monospace;
          display: block;
          padding: 8px 8px 8px 52px;
          line-height: 1.53;
          font-size: 13px;
          margin: 0;
          margin-top: 8px;
          margin-bottom: 8px;
          tab-size: 2;
          overflow-x: auto;
          position: relative;
        }

        .editor-image {
          display: inline-block;
          margin: 8px 0;
        }

        .editor-tokenComment {
          color: slategray;
        }

        .editor-tokenPunctuation {
          color: #999;
        }

        .editor-tokenProperty {
          color: #905;
        }

        .editor-tokenSelector {
          color: #690;
        }

        .editor-tokenOperator {
          color: #9a6e3a;
        }

        .editor-tokenAttr {
          color: #07a;
        }

        .editor-tokenVariable {
          color: #e90;
        }

        .editor-tokenFunction {
          color: #dd4a68;
        }
      `}</style>
    </LexicalComposer>
  )
}
