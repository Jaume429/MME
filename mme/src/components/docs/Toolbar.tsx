'use client'

import type { Editor } from '@tiptap/react'
import Link from 'next/link'
import { useMemo } from 'react'

const FONT_FAMILIES = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Calibri', value: 'Calibri' },
]

const FONT_SIZES = ['8pt', '9pt', '10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '24pt', '36pt']

export function Toolbar({ editor, status, docId }: { editor: Editor | null, status?: 'loading' | 'saved' | 'saving', docId?: string }) {
  const can = useMemo(() => {
    if (!editor) return null
    return {
      bold: editor.can().chain().focus().toggleBold().run(),
      italic: editor.can().chain().focus().toggleItalic().run(),
      underline: editor.can().chain().focus().toggleUnderline().run(),
      undo: editor.can().chain().focus().undo().run(),
      redo: editor.can().chain().focus().redo().run(),
    }
  }, [editor])

  return (
    <div className="sticky top-0 z-20 bg-white">
      {/* Header */}
      <header className="bg-white px-4 py-2 flex items-center gap-3 border-b border-[#dadce0]">
        <span style={{ color: '#4285f4', fontSize: 40 }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="4" fill="#4285f4" />
            <rect x="10" y="12" width="20" height="3" rx="1" fill="white" />
            <rect x="10" y="18" width="20" height="3" rx="1" fill="white" />
            <rect x="10" y="24" width="14" height="3" rx="1" fill="white" />
          </svg>
        </span>
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <Link href="/docs" className="text-sm text-[#444] hover:underline cursor-pointer">← Docs</Link>
            <span className="text-lg text-[#3c4043]">Document sense títol</span>
            <span className="bg-[#e8f0fe] text-[#1967d2] text-[11px] font-bold px-1 rounded">.DOCX</span>
            <span className="text-xs text-[#5f6368] ml-2">
              {status === 'loading' ? 'Carregant…' : status === 'saving' ? 'Guardant…' : 'Guardat'}
            </span>
          </div>
          <div className="flex gap-3 text-sm text-[#444] mt-1">
            {['Fitxer', 'Edita', 'Mostra', 'Insereix', 'Format', 'Eines', 'Ajuda'].map(m => (
              <span key={m} className="hover:bg-[#eee] px-1 rounded cursor-pointer">{m}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#c2e7ff] border-none px-5 py-2 rounded-full font-medium flex items-center gap-2 cursor-pointer text-sm">
            Comparteix
          </button>
          <div className="bg-[#00897b] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">J</div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-[#edf2fa] mx-4 my-1 px-3 rounded-full flex items-center gap-2 h-10">
        <button
          disabled={!editor || !can?.undo}
          onClick={() => editor?.chain().focus().undo().run()}
          className="p-1 rounded hover:bg-[#d3e3fd] disabled:opacity-40 text-[#444] text-sm"
          title="Desfer"
        >↩</button>
        <button
          disabled={!editor || !can?.redo}
          onClick={() => editor?.chain().focus().redo().run()}
          className="p-1 rounded hover:bg-[#d3e3fd] disabled:opacity-40 text-[#444] text-sm"
          title="Refer"
        >↪</button>

        <div className="w-px h-5 bg-[#c4c7c5] mx-1" />

        <select
          className="text-sm bg-transparent border-none outline-none cursor-pointer text-[#3c4043]"
          value={editor?.getAttributes('textStyle').fontFamily ?? 'Arial'}
          onChange={(e) => editor?.chain().focus().setFontFamily(e.target.value).run()}
          disabled={!editor}
        >
          {FONT_FAMILIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        <div className="w-px h-5 bg-[#c4c7c5] mx-1" />

        <select
          className="text-sm bg-transparent border-none outline-none cursor-pointer w-16 text-[#3c4043]"
          value={editor?.getAttributes('textStyle').fontSize ?? '11pt'}
          onChange={(e) => editor?.chain().focus().setFontSize(e.target.value).run()}
          disabled={!editor}
        >
          {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="w-px h-5 bg-[#c4c7c5] mx-1" />

        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor || !can?.bold}
          className={`p-1 rounded font-bold text-sm hover:bg-[#d3e3fd] disabled:opacity-40 ${editor?.isActive('bold') ? 'bg-[#d3e3fd]' : ''}`}
        >B</button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor || !can?.italic}
          className={`p-1 rounded italic text-sm hover:bg-[#d3e3fd] disabled:opacity-40 ${editor?.isActive('italic') ? 'bg-[#d3e3fd]' : ''}`}
        >I</button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          disabled={!editor || !can?.underline}
          className={`p-1 rounded underline text-sm hover:bg-[#d3e3fd] disabled:opacity-40 ${editor?.isActive('underline') ? 'bg-[#d3e3fd]' : ''}`}
        >U</button>

        <div className="w-px h-5 bg-[#c4c7c5] mx-1" />

        <button
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
          disabled={!editor}
          className={`p-1 rounded text-sm hover:bg-[#d3e3fd] ${editor?.isActive({ textAlign: 'left' }) ? 'bg-[#d3e3fd]' : ''}`}
        >⟸</button>
        <button
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
          disabled={!editor}
          className={`p-1 rounded text-sm hover:bg-[#d3e3fd] ${editor?.isActive({ textAlign: 'center' }) ? 'bg-[#d3e3fd]' : ''}`}
        >≡</button>
        <button
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
          disabled={!editor}
          className={`p-1 rounded text-sm hover:bg-[#d3e3fd] ${editor?.isActive({ textAlign: 'right' }) ? 'bg-[#d3e3fd]' : ''}`}
        >⟹</button>
      </div>
    </div>
  )
}

