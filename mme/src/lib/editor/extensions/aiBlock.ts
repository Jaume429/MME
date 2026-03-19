import { Node, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    aiBlock: {
      insertAIBlock: (attrs: { content: string; kind?: string; confidence?: number }) => ReturnType
    }
  }
}

export const AIBlock = Node.create({
  name: 'aiBlock',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      kind: { default: 'answer' },
      confidence: { default: null },
      content: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-ai-block]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-ai-block': 'true' }),
      ['div', { 'data-ai-block-inner': 'true' }, HTMLAttributes.content ?? ''],
    ]
  },

  addCommands() {
    return {
      insertAIBlock:
        (attrs) =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                kind: attrs.kind ?? 'answer',
                confidence: typeof attrs.confidence === 'number' ? attrs.confidence : null,
                content: attrs.content,
              },
            })
            .run(),
    }
  },
})

