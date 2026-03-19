'use client'

import type { Editor } from '@tiptap/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { callAIStream } from '@/lib/ai/client'
import { safeParseAIResponse } from '@/lib/ai/types'
import { getDocContext, getSelectionText } from '@/lib/editor/extractContext'
import { useAiUiStore } from '@/lib/ui/useAiUiStore'
import { nowId } from '@/lib/ai/client'

type Pos = { x: number; y: number } | null

export function SelectionActions({ editor }: { editor: Editor | null }) {
  const mode = useAiUiStore((s) => s.mode)
  const setPanelOpen = useAiUiStore((s) => s.setPanelOpen)
  const addMessage = useAiUiStore((s) => s.addMessage)
  const [pos, setPos] = useState<Pos>(null)
  const [busy, setBusy] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!editor) return
    const update = () => {
      const { from, to } = editor.state.selection
      if (from === to) {
        setPos(null)
        return
      }
      const coords = editor.view.coordsAtPos(to)
      setPos({ x: coords.left, y: coords.top - 44 })
    }
    update()
    editor.on('selectionUpdate', update)
    editor.on('blur', () => setPos(null))
    return () => {
      editor.off('selectionUpdate', update)
    }
  }, [editor])

  const run = useMemo(() => {
    return async (action: 'improve' | 'explain') => {
      if (!editor) return
      const selection = getSelectionText(editor)
      if (!selection) return
      setPanelOpen(true)
      setBusy(true)
      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac

      const userText =
        action === 'improve'
          ? 'Mejora y corrige el TEXTO_SELECCIONADO.'
          : 'Explica el TEXTO_SELECCIONADO de forma clara y orientada a examen.'

      addMessage({ id: nowId(), role: 'user', content: `[${action}] ${selection}`, createdAt: Date.now() })

      try {
        const full = await callAIStream(
          '/api/ai/improve',
          {
            docContext: getDocContext(editor),
            selection,
            userText,
            mode,
          },
          { signal: ac.signal },
        )
        const parsed = safeParseAIResponse(full)
        const assistantText = parsed.ok ? parsed.value.content_md : full
        if (parsed.ok && parsed.value.inline_insert) {
          editor.chain().focus().insertAIBlock({ content: assistantText, kind: parsed.value.type, confidence: parsed.value.confidence }).run()
        }
        addMessage({ id: nowId(), role: 'assistant', content: assistantText, createdAt: Date.now() })
      } finally {
        setBusy(false)
        setPos(null)
      }
    }
  }, [addMessage, editor, mode, setPanelOpen])

  if (!editor || !pos) return null

  const left = Math.min(pos.x, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 260)
  const top = Math.max(pos.y, 72)

  return (
    <div
      className="fixed z-40 flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1 shadow-sm"
      style={{ left, top }}
    >
      <button
        type="button"
        className="h-8 rounded-md px-2 text-sm hover:bg-neutral-100 disabled:opacity-50"
        disabled={busy}
        onClick={() => void run('improve')}
      >
        Improve
      </button>
      <button
        type="button"
        className="h-8 rounded-md px-2 text-sm hover:bg-neutral-100 disabled:opacity-50"
        disabled={busy}
        onClick={() => void run('explain')}
      >
        Explain
      </button>
    </div>
  )
}

