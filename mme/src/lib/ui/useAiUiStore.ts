import { create } from 'zustand'
import type { TutorMode } from '@/lib/ai/types'

export type AiPanelMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

type State = {
  panelOpen: boolean
  mode: TutorMode
  messages: AiPanelMessage[]
  isStreaming: boolean
  streamBuffer: string
}

type Actions = {
  setPanelOpen: (open: boolean) => void
  togglePanel: () => void
  setMode: (mode: TutorMode) => void
  addMessage: (m: AiPanelMessage) => void
  setStreaming: (streaming: boolean) => void
  setStreamBuffer: (text: string) => void
  clearStreamBuffer: () => void
  reset: () => void
}

const initialState: State = {
  panelOpen: true,
  mode: 'normal',
  messages: [],
  isStreaming: false,
  streamBuffer: '',
}

export const useAiUiStore = create<State & Actions>((set) => ({
  ...initialState,
  setPanelOpen: (open) => set({ panelOpen: open }),
  togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),
  setMode: (mode) => set({ mode }),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setStreamBuffer: (streamBuffer) => set({ streamBuffer }),
  clearStreamBuffer: () => set({ streamBuffer: '' }),
  reset: () => set({ ...initialState }),
}))

