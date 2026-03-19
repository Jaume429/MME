export function deriveTitleFromDoc(docJson: any): string {
  const fallback = 'Documento sin título'
  try {
    const firstText = extractFirstText(docJson)
    const t = firstText.trim().replace(/\s+/g, ' ')
    if (!t) return fallback
    return t.length > 60 ? `${t.slice(0, 60)}…` : t
  } catch {
    return fallback
  }
}

function extractFirstText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (node.type === 'text' && typeof node.text === 'string') return node.text
  const content = Array.isArray(node.content) ? node.content : []
  for (const child of content) {
    const t = extractFirstText(child)
    if (t) return t
  }
  return ''
}

