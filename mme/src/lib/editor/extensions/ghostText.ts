import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { Plugin, PluginKey, type Transaction } from '@tiptap/pm/state'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ghostText: {
      setGhostText: (text: string) => ReturnType
      clearGhostText: () => ReturnType
      acceptGhostText: () => ReturnType
    }
  }
}

export const ghostTextKey = new PluginKey('ghostText')

export const GhostText = Extension.create({
  name: 'ghostText',

  addStorage() {
    return {
      text: '',
    }
  },

  addCommands() {
    return {
      setGhostText:
        (text: string) =>
        ({ editor }: { editor: any }) => {
          editor.storage.ghostText.text = text
          editor.view.dispatch(editor.state.tr.setMeta(ghostTextKey, { type: 'update' }))
          return true
        },
      clearGhostText:
        () =>
        ({ editor }: { editor: any }) => {
          editor.storage.ghostText.text = ''
          editor.view.dispatch(editor.state.tr.setMeta(ghostTextKey, { type: 'update' }))
          return true
        },
      acceptGhostText:
        () =>
        ({ editor }: { editor: any }) => {
          const t: string = editor.storage.ghostText.text || ''
          if (!t) return false
          editor.storage.ghostText.text = ''
          editor.commands.insertContent(t)
          editor.view.dispatch(editor.state.tr.setMeta(ghostTextKey, { type: 'update' }))
          return true
        },
    } as any
  },

  addProseMirrorPlugins() {
    const ext = this
    const plugin: Plugin = new Plugin({
      key: ghostTextKey,
      state: {
        init() {
          return DecorationSet.empty
        },
        apply(tr: Transaction, old: DecorationSet) {
          const meta = tr.getMeta(ghostTextKey)
          if (!meta && !tr.docChanged && !tr.selectionSet) return old

          const text: string = (ext.editor?.storage as any)?.ghostText?.text || ''
          if (!text) return DecorationSet.empty

          const { from, to } = tr.selection
          if (from !== to) return DecorationSet.empty
          const dec = Decoration.widget(from, () => {
            const span = document.createElement('span')
            span.style.opacity = '0.35'
            span.style.whiteSpace = 'pre'
            span.style.pointerEvents = 'none'
            span.textContent = text
            return span
          })
          return DecorationSet.create(tr.doc, [dec])
        },
      },
      props: {
        decorations(state) {
          return (this as any).getState(state) as DecorationSet
        },
        handleKeyDown(_view, event) {
          if (event.key === 'Tab') {
            const text: string = (ext.editor?.storage as any)?.ghostText?.text || ''
            if (text) {
              event.preventDefault()
              ext.editor?.commands.acceptGhostText?.()
              return true
            }
          }
          return false
        },
      },
    })

    return [plugin]
  },
})

