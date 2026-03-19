'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { DocEditor } from '@/components/docs/DocEditor'
import { createDoc, getDoc, upsertDocContent } from '@/lib/storage/docs'

export function DocPageClient({ id }: { id: string }) {
  const [initialContent, setInitialContent] = useState<any | null>(null)
  const [status, setStatus] = useState<'loading' | 'saved' | 'saving'>('loading')
  const saveTimerRef = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const existing = await getDoc(id)
      if (cancelled) return
      if (!existing) {
        const created = await createDoc(id)
        if (cancelled) return
        setInitialContent(created.content)
      } else {
        setInitialContent(existing.content)
      }
      setStatus('saved')
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const onContentChange = useMemo(() => {
    return (json: any) => {
      setStatus('saving')
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current)
      saveTimerRef.current = window.setTimeout(async () => {
        await upsertDocContent(id, json)
        setStatus('saved')
      }, 500)
    }
  }, [id])

  return (
    <div className="relative">
      {initialContent ? (
        <DocEditor initialContent={initialContent} onContentChange={onContentChange} status={status} docId={id} />
      ) : (
        <div className="min-h-screen bg-[#f8f9fa]" />
      )}
    </div>
  )
}

