import type { Editor } from '@tiptap/react'

function clampText(s: string, maxChars: number) {
  if (s.length <= maxChars) return s
  return s.slice(s.length - maxChars)
}

export function getDocContext(editor: Editor, maxChars = 8000): string {
  // Cheap heuristic: plain text snapshot
  const txt = editor.getText()
  return clampText(txt, maxChars)
}

export function getSelectionText(editor: Editor, maxChars = 1500): string | undefined {
  const { from, to } = editor.state.selection
  if (from === to) return undefined
  const selected = editor.state.doc.textBetween(from, to, '\n')
  return clampText(selected, maxChars)
}

