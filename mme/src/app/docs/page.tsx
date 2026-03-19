'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createDoc, deleteDoc, listDocs } from '@/lib/storage/docs'

export default function DocsHome() {
  const [docs, setDocs] = useState<Array<{ id: string; title: string; updatedAt: number }>>([])
  const fileRef = useRef<HTMLInputElement | null>(null)

  async function refresh() {
    const rows = await listDocs()
    setDocs(rows.map((d) => ({ id: d.id, title: d.title, updatedAt: d.updatedAt })))
  }

  useEffect(() => {
    void refresh()
  }, [])

  const sorted = useMemo(() => docs.slice().sort((a, b) => b.updatedAt - a.updatedAt), [docs])

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-[#1a73e8]" aria-hidden />
            <div className="text-sm font-semibold text-neutral-900">MME Docs</div>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return
                const text = await f.text()
                const parsed = JSON.parse(text)
                const id = typeof parsed?.id === 'string' ? parsed.id : crypto.randomUUID()
                const content = parsed?.content ?? parsed
                await createDoc(id, content)
                await refresh()
              }}
            />
            <button
              type="button"
              className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm hover:bg-neutral-50"
              onClick={() => fileRef.current?.click()}
            >
              Import JSON
            </button>
            <Link
              href="/doc/default"
              className="h-9 rounded-md bg-[#1a73e8] px-3 text-sm font-medium leading-9 text-white hover:bg-[#1967d2]"
              onClick={async (e) => {
                e.preventDefault()
                const id = crypto.randomUUID()
                await createDoc(id)
                window.location.href = `/doc/${id}`
              }}
            >
              Nuevo documento
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-8">
        <div className="mb-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
          Documentos (local)
        </div>

        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          {sorted.length === 0 ? (
            <div className="p-6 text-sm text-neutral-600">
              Aún no hay documentos. Crea uno o importa un JSON.
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {sorted.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <Link
                      href={`/doc/${d.id}`}
                      className="block truncate text-sm font-medium text-neutral-900 hover:underline"
                    >
                      {d.title}
                    </Link>
                    <div className="mt-1 text-xs text-neutral-500">
                      Actualizado: {new Date(d.updatedAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm hover:bg-neutral-50"
                      onClick={async () => {
                        const full = await (await import('@/lib/storage/docs')).getDoc(d.id)
                        if (!full) return
                        const blob = new Blob([JSON.stringify(full, null, 2)], {
                          type: 'application/json',
                        })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `${d.title.replace(/[^a-z0-9_-]+/gi, '_') || 'documento'}.json`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                    >
                      Export
                    </button>
                    <button
                      type="button"
                      className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm hover:bg-neutral-50"
                      onClick={async () => {
                        await deleteDoc(d.id)
                        await refresh()
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

