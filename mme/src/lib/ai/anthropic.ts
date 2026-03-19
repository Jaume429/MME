import 'server-only'

import Anthropic from '@anthropic-ai/sdk'

if (!process.env.ANTHROPIC_API_KEY) {
  // This module is only imported from server routes. We surface a clear error at runtime.
  // eslint-disable-next-line no-console
  console.warn('Missing ANTHROPIC_API_KEY. Set it in your environment to enable AI features.')
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? '',
})

