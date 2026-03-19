import { NextRequest } from 'next/server'
import { anthropic } from '@/lib/ai/anthropic'
import { buildTutorPrompt, type TutorMode } from '@/lib/ai/prompts/buildTutorPrompt'

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('Missing ANTHROPIC_API_KEY', { status: 500 })
  }

  const body = await req.json()
  const docContext = typeof body?.docContext === 'string' ? body.docContext : ''
  const selection = typeof body?.selection === 'string' ? body.selection : undefined
  const userText = typeof body?.userText === 'string' ? body.userText : ''
  const mode = (body?.mode === 'exam' ? 'exam' : 'normal') as TutorMode

  const { system, messages } = buildTutorPrompt({
    docContext,
    selection,
    userText,
    mode,
    intent: 'improve',
  })

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 700,
    temperature: mode === 'exam' ? 0.2 : 0.35,
    system,
    messages,
  })

  req.signal.addEventListener('abort', () => {
    stream.controller.abort()
  })

  return new Response(stream.toReadableStream(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

