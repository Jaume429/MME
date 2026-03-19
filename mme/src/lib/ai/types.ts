export type TutorMode = 'normal' | 'exam'

export type AIResponse =
  | { type: 'answer' | 'correction' | 'summary' | 'steps' | 'checklist'; content_md: string; inline_insert: boolean; confidence: number }
  | { type: string; content_md: string; inline_insert: boolean; confidence: number }

export function safeParseAIResponse(text: string): { ok: true; value: AIResponse } | { ok: false; raw: string } {
  const trimmed = text.trim()
  try {
    const obj = JSON.parse(trimmed)
    if (!obj || typeof obj !== 'object') return { ok: false, raw: trimmed }
    if (typeof (obj as any).content_md !== 'string') return { ok: false, raw: trimmed }
    return { ok: true, value: obj as AIResponse }
  } catch {
    return { ok: false, raw: trimmed }
  }
}

