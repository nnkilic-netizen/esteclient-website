"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type CustomSelectOption = {
  value: string | number
  label: string
}

export type CustomSelectProps = {
  value: string | number
  onChange: (value: string | number) => void
  options: CustomSelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function CustomSelect({ value, onChange, options, placeholder = "Seçiniz...", className, disabled = false }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => String(opt.value) === String(value))

  return (
    <div className={cn("relative inline-block", className)} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between bg-background border border-input rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground shadow-sm transition-colors hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed",
          isOpen && "ring-2 ring-primary/20 border-primary bg-muted/50"
        )}
      >
        <div className="grid items-center pr-2 text-left">
          <span className={cn("col-start-1 row-start-1 truncate", !selectedOption && "text-muted-foreground font-normal")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {/* Gizli eleman: En uzun seçeneğe göre genişliği belirlemek için (tüm seçenekleri görünmez olarak yazdırıyoruz) */}
          <div className="col-start-1 row-start-1 h-0 overflow-hidden invisible pointer-events-none font-medium whitespace-nowrap">
            {options.map((opt, i) => (
              <div key={i}>{opt.label}</div>
            ))}
            {placeholder && <div>{placeholder}</div>}
          </div>
        </div>
        <ChevronDown className={cn("size-4 shrink-0 ml-2 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 min-w-full w-max mt-2 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-1 max-h-60 overflow-y-auto custom-scrollbar">
            {options.length === 0 ? (
              <div className="px-3 py-2.5 text-sm text-muted-foreground text-center italic">Seçenek yok</div>
            ) : (
              options.map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors text-left",
                    String(value) === String(opt.value)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted/80"
                  )}
                >
                  <span className="truncate pr-4">{opt.label}</span>
                  {String(value) === String(opt.value) && <Check className="size-4 shrink-0 text-primary ml-auto" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
