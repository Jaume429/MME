import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import { FontSize } from '@/lib/editor/extensions/fontSize'
import { AIBlock } from '@/lib/editor/extensions/aiBlock'
import { GhostText } from '@/lib/editor/extensions/ghostText'

export function createExtensions() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/89024530-8f73-4cef-8d09-73c663c3de70',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'pre-fix',hypothesisId:'H1',location:'src/lib/editor/createExtensions.ts:12',message:'createExtensions called',data:{hasTextStyle:!!TextStyle,hasFontFamily:!!FontFamily,hasGhostText:!!GhostText},timestamp:Date.now()})}).catch(()=>{});
  // #endregion agent log
  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({ placeholder: 'Empieza a escribir…' }),
    TextStyle,
    FontFamily,
    FontSize,
    AIBlock,
    GhostText,
  ]
}

