'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import { createExtensions } from '@/lib/editor/createExtensions'
import { Toolbar } from '@/components/docs/Toolbar'
import { PageShell } from '@/components/docs/PageShell'
import { useEffect, useMemo, useRef } from 'react'
import { callAIStream } from '@/lib/ai/client'
import { getDocContext } from '@/lib/editor/extractContext'
import { marked } from 'marked'

export function DocEditor(props: {
  initialContent?: any
  onContentChange?: (json: any) => void
  status?: 'loading' | 'saved' | 'saving'
  docId?: string
}) {
  const extensions = useMemo(() => createExtensions(), [])

  const isStreamingRef = useRef(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: props.initialContent ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    autofocus: 'end',
    editorProps: {
      attributes: {
        class:
          'min-h-[400px] focus:outline-none text-[11pt] leading-[1.6] text-neutral-900 [font-family:Arial] break-words',
        spellcheck: 'false',
      },
    },
    onUpdate: ({ editor }) => props.onContentChange?.(editor.getJSON()),
  })

  useEffect(() => {
    if (!editor) return
    const handler = async (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (isStreamingRef.current) return

        isStreamingRef.current = true
        try {
          const docContext = getDocContext(editor)

          // Insert two empty paragraphs after cursor
          editor
            .chain()
            .focus()
            .insertContent('\n\n')
            .run()

          // Call the AI and collect full response
          const fullResponse = await callAIStream(
            '/api/ai/ask',
            {
              docContext,
              userText: docContext,
              mode: 'normal',
            },
          )

          // Strip JSON wrapper (content_md) if server returned raw JSON
          let markdownText = fullResponse.trim()
          if (markdownText.startsWith('{')) {
            try {
              const obj = JSON.parse(markdownText)
              if (typeof obj?.content_md === 'string') markdownText = obj.content_md
            } catch { /* not JSON, use as-is */ }
          }

          // Parse Markdown to HTML and insert into editor
          const html = await marked.parse(markdownText)
          editor.commands.insertContent(html)
          editor.commands.insertContent('<p></p>')
        } finally {
          isStreamingRef.current = false
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [editor])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Toolbar editor={editor} status={props.status} docId={props.docId} />
      <PageShell>
        <div className="px-24 py-24 flex-grow">
          <EditorContent editor={editor} />
        </div>
      </PageShell>
    </div>
  )
}

