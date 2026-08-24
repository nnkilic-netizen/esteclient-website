"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { STATUS_META, type AppointmentStatus } from "@/lib/demo-data"

const ORDER: AppointmentStatus[] = ["bekliyor", "cevapyok", "ulasilmiyor", "gelecek", "geldi", "iptal"]

type StatusDropdownProps = {
  value: AppointmentStatus
  onChange: (status: AppointmentStatus) => void
}

export function StatusDropdown({ value, onChange }: StatusDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const meta = STATUS_META[value]

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90",
          meta.bg,
          meta.text,
        )}
      >
        <span className={cn("size-1.5 rounded-full", meta.dot)} />
        {meta.label}
        <ChevronDown className="size-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1.5 w-48 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg">
          {ORDER.map((s) => {
            const m = STATUS_META[s]
            return (
              <button
                key={s}
                onClick={() => {
                  onChange(s)
                  setOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-popover-foreground transition-colors hover:bg-muted"
              >
                <span className={cn("size-2 rounded-full", m.dot)} />
                <span className="flex-1 text-left">{m.label}</span>
                {s === value && <Check className="size-4 text-primary" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
