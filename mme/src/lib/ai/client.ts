import type { TutorMode } from '@/lib/ai/types'

async function readStreamText(stream: ReadableStream<Uint8Array>, onChunk: (s: string) => void) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let full = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    full += chunk
    onChunk(chunk)
  }
  full += decoder.decode()
  return full
}

export async function callAIStream(
  endpoint: '/api/ai/ask' | '/api/ai/improve' | '/api/ai/ghost',
  input: {
    docContext: string
    selection?: string
    userText: string
    mode: TutorMode
  },
  opts: { signal?: AbortSignal; onChunk?: (s: string) => void } = {},
) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal: opts.signal,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(msg || `AI request failed: ${res.status}`)
  }
  if (!res.body) {
    const msg = await res.text().catch(() => '')
    return msg
  }
  return readStreamText(res.body, (c) => opts.onChunk?.(c))
}

export function nowId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`
}

