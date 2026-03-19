import type { ReactNode } from 'react'

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex-grow overflow-y-auto bg-[#f8f9fa] flex flex-col">
      <div className="flex-grow flex flex-col items-center min-h-full">
        <div
          className="w-[816px] flex-grow bg-white shadow-[0_0_5px_rgba(0,0,0,0.05)] border-x border-neutral-200 box-border outline-none cursor-text flex flex-col"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

