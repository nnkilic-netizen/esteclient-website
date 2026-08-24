"use client"

import { useState, useEffect, type FormEvent } from "react"
import { UserPlus, X } from "lucide-react"
import type { Customer } from "@/lib/demo-data"

type AddCustomerModalProps = {
  open: boolean
  onClose: () => void
  onSave: (customer: Customer) => void
}

const empty = { firstName: "", lastName: "", phone: "", birthDate: "", note: "" }

export function AddCustomerModal({ open, onClose, onSave }: AddCustomerModalProps) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.firstName.trim()) return
    onSave({
      id: `c-${Date.now()}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      birthDate: form.birthDate,
      note: form.note.trim(),
      visits: 0,
      totalSpent: 0,
    })
    setForm(empty)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-primary/20 bg-primary/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <UserPlus className="size-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-primary">Yeni Müşteri Kayıt Formu</h3>
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
          <div className="grid grid-cols-2 gap-3">
            <Field label="Adı">
              <input
                value={form.firstName}
                onChange={set("firstName")}
                required
                placeholder="Adı"
                className="input"
              />
            </Field>
            <Field label="Soyadı">
              <input
                value={form.lastName}
                onChange={set("lastName")}
                placeholder="Soyadı"
                className="input"
              />
            </Field>
          </div>

          <Field label="İletişim Numarası">
            <input
              value={form.phone}
              onChange={set("phone")}
              type="tel"
              placeholder="05XX XXX XX XX"
              className="input"
            />
          </Field>

          <Field label="Doğum Tarihi">
            <input
              value={form.birthDate}
              onChange={set("birthDate")}
              type="date"
              className="input"
            />
          </Field>

          <Field label="Not">
            <textarea
              value={form.note}
              onChange={set("note")}
              rows={3}
              placeholder="Müşteri hakkında notlar..."
              className="input resize-none"
            />
          </Field>

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
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}
