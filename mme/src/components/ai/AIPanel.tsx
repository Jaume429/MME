'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { callAIStream, nowId } from '@/lib/ai/client'
import { safeParseAIResponse } from '@/lib/ai/types'
import { getDocContext, getSelectionText } from '@/lib/editor/extractContext'
import { useAiUiStore } from '@/lib/ui/useAiUiStore'
import { marked } from 'marked'

/** Strips JSON wrapper and renders content_md (or raw text) as sanitised HTML */
function parseToMarkdown(raw: string): string {
  const trimmed = raw.trim()
  const parsed = safeParseAIResponse(trimmed)
  return parsed.ok ? parsed.value.content_md : trimmed
}

/** Render markdown string to HTML (sync – marked supports it) */
function mdToHtml(md: string): string {
  return marked.parse(md) as string
}

export function AIPanel({ editor }: { editor: Editor | null }) {
  const panelOpen = useAiUiStore((s) => s.panelOpen)
  const setPanelOpen = useAiUiStore((s) => s.setPanelOpen)
  const mode = useAiUiStore((s) => s.mode)
  const messages = useAiUiStore((s) => s.messages)
  const addMessage = useAiUiStore((s) => s.addMessage)
  const isStreaming = useAiUiStore((s) => s.isStreaming)
  const setStreaming = useAiUiStore((s) => s.setStreaming)
  const streamBuffer = useAiUiStore((s) => s.streamBuffer)
  const setStreamBuffer = useAiUiStore((s) => s.setStreamBuffer)
  const clearStreamBuffer = useAiUiStore((s) => s.clearStreamBuffer)

  const [input, setInput] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const canSend = !!editor && input.trim().length > 0 && !isStreaming

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages.length, streamBuffer, panelOpen])

  const send = useMemo(() => {
    return async (userText: string) => {
      if (!editor) return
      const question = userText.trim()
      if (!question) return

      addMessage({ id: nowId(), role: 'user', content: question, createdAt: Date.now() })

      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac

      setStreaming(true)
      clearStreamBuffer()

      try {
        const full = await callAIStream(
          '/api/ai/ask',
          {
            docContext: getDocContext(editor),
            selection: getSelectionText(editor),
            userText: question,
            mode,
          },
          {
            signal: ac.signal,
            onChunk: (c) => setStreamBuffer((useAiUiStore.getState().streamBuffer ?? '') + c),
          },
        )

        // Extract content_md from JSON wrapper if present, then store as markdown
        const assistantText = parseToMarkdown(full)
        addMessage({
          id: nowId(),
          role: 'assistant',
          content: assistantText,
          createdAt: Date.now(),
        })
      } finally {
        setStreaming(false)
        clearStreamBuffer()
      }
    }
  }, [addMessage, clearStreamBuffer, editor, mode, setStreamBuffer, setStreaming])

  if (!panelOpen) {
    return (
      <button
        type="button"
        className="fixed right-4 top-20 z-30 rounded-full bg-white px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm ring-1 ring-neutral-200 hover:bg-neutral-50"
        onClick={() => setPanelOpen(true)}
      >
        AI
      </button>
    )
  }

  return (
    <aside className="fixed right-0 top-14 z-20 h-[calc(100vh-56px)] w-[360px] border-l border-neutral-200 bg-white">
      <div className="flex h-12 items-center justify-between border-b border-neutral-200 px-3">
        <div className="text-sm font-semibold text-neutral-900">Tutor IA (MME)</div>
        <button
          type="button"
          className="h-8 rounded-md px-2 text-sm hover:bg-neutral-100"
          onClick={() => setPanelOpen(false)}
        >
          ✕
        </button>
      </div>

      <div ref={scrollRef} className="h-[calc(100%-96px)] overflow-auto px-3 py-3">
        {messages.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-700">
            Escribe una pregunta y pulsa <b>Enviar</b>. Selecciona texto para "Improve/Explain".
          </div>
        ) : null}

        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <div
                className={[
                  'inline-block max-w-[92%] rounded-2xl px-3 py-2 text-sm',
                  m.role === 'user'
                    ? 'bg-[#e8f0fe] text-neutral-900'
                    : 'bg-neutral-100 text-neutral-900',
                ].join(' ')}
              >
                {m.role === 'assistant' ? (
                  // Render markdown as HTML for assistant messages
                  <div
                    className="prose prose-sm max-w-none break-words [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_code]:bg-neutral-200 [&_code]:px-1 [&_code]:rounded [&_p]:mb-1 [&_p:last-child]:mb-0"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: mdToHtml(m.content) }}
                  />
                ) : (
                  <span className="whitespace-pre-wrap">{m.content}</span>
                )}
              </div>
            </div>
          ))}

          {isStreaming ? (
            <div className="text-left">
              <div className="inline-block max-w-[92%] rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-900">
                {/* Show a clean loading state while waiting for the full response */}
                <span className="italic text-neutral-400">
                  {streamBuffer
                    ? '…'   // still accumulating — hide raw JSON chunks
                    : '…'}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex h-12 items-center gap-2 border-t border-neutral-200 px-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta sobre MME…"
          className="h-9 flex-1 rounded-full border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-[#1a73e8]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              if (!canSend) return
              const q = input
              setInput('')
              void send(q)
            }
          }}
        />
        <button
          type="button"
          className="h-9 rounded-full bg-[#1a73e8] px-4 text-sm font-medium text-white disabled:opacity-50"
          disabled={!canSend}
          onClick={() => {
            if (!canSend) return
            const q = input
            setInput('')
            void send(q)
          }}
        >
          Enviar
        </button>
      </div>
    </aside>
  )
}
