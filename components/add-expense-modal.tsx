"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Wallet, X } from "lucide-react"
import { CustomSelect } from "./ui/custom-select"

export type Expense = {
  id: string
  title: string
  category: string
  amount: number
  date: string
}

type AddExpenseModalProps = {
  open: boolean
  onClose: () => void
  onSave: (expense: Expense) => void
}

const categories = ["Malzeme", "Kira", "Personel", "Fatura", "Pazarlama", "Diğer"]
const empty = { title: "", category: "Malzeme", amount: "", date: new Date().toISOString().slice(0, 10) }

export function AddExpenseModal({ open, onClose, onSave }: AddExpenseModalProps) {
  const [step, setStep] = useState<"form" | "success">("form")
  const [form, setForm] = useState(empty)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      setStep("form")
    }
  }, [open])

  if (!open) return null

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
        <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-card p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-amber-100">
            <svg className="size-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-foreground">Harcama Kaydedildi!</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Yeni harcama kaydı başarıyla sisteme eklendi.
          </p>
          <button
            onClick={() => {
              setStep("form");
              onClose();
            }}
            className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
          >
            Tamamla ve Kapat
          </button>
        </div>
      </div>
    )
  }

  const set = (key: keyof typeof form) => (e: { target: { value: string } } | string) => {
    const value = typeof e === "string" ? e : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.amount) return
    onSave({
      id: `e-${Date.now()}`,
      title: form.title.trim(),
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
    })
    setForm(empty)
    setStep("success")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-primary/20 bg-primary/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="size-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-primary">Yeni Harcama Ekle</h3>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Kapat"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Açıklama</span>
            <input value={form.title} onChange={set("title")} required placeholder="Harcama açıklaması" className="input" />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">Kategori</span>
              <CustomSelect 
                value={form.category} 
                onChange={(val) => set("category")(String(val))}
                options={categories.map(cat => ({ value: cat, label: cat }))}
                className="w-full"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">Tutar (₺)</span>
              <input value={form.amount} onChange={set("amount")} type="number" min="0" placeholder="0" className="input" />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Tarih</span>
            <input value={form.date} onChange={set("date")} type="date" className="input" />
          </label>

          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
