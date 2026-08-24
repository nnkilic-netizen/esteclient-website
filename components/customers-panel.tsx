"use client"

import { useMemo, useState, useEffect } from "react"
import { Users, Search, LayoutGrid, List, Phone, Sparkles, Calendar, CalendarCheck, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Customer } from "@/lib/demo-data"

type CustomersPanelProps = {
  customers: Customer[]
  onCustomerClick?: (id: string) => void
  setHeaderContent: (content: React.ReactNode) => void
}

function initials(c: Customer) {
  return `${c.firstName[0] ?? ""}${c.lastName[0] ?? ""}`.toUpperCase()
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })
  } catch {
    return d
  }
}

export function CustomersPanel({ customers, onCustomerClick, setHeaderContent }: CustomersPanelProps) {
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<"list" | "grid">("grid")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q),
    )
  }, [customers, query])

  useEffect(() => {
    setHeaderContent(
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 shadow-sm">
          <Users className="size-7" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">Müşteri Listesi</h2>
          <p className="text-xs text-muted-foreground mt-0.5 mb-2.5">Müşteri Kartları Ve İletişim Bilgileri.</p>
        </div>
      </div>
    )
    return () => setHeaderContent(null)
  }, [setHeaderContent])

  return (
    <section className="flex flex-col flex-1 min-h-0 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-5 shrink-0">
        
        {/* BADGES (Left Side) */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center gap-1.5 px-2 py-1 rounded-md border border-primary/20 bg-primary/10 text-primary shadow-sm text-[11px] font-medium">
            <strong className="text-[13px]">{customers.length}</strong> Müşteri
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="İsme göre ara..."
              className="w-44 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center rounded-lg border border-input bg-background p-0.5">
            <button
              onClick={() => setMode("list")}
              title="Liste görünümü"
              className={cn(
                "flex size-8 items-center justify-center rounded-md transition-colors",
                mode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              <List className="size-4" />
            </button>
            <button
              onClick={() => setMode("grid")}
              title="Grid görünümü"
              className={cn(
                "flex size-8 items-center justify-center rounded-md transition-colors",
                mode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pb-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Users className="size-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Müşteri bulunamadı.</p>
          </div>
        ) : mode === "grid" ? (
          <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((c) => (
              <div 
                key={c.id} 
                className="flex flex-col items-center gap-4 rounded-xl border border-border bg-background p-5 text-center shadow-sm transition-shadow hover:shadow-md cursor-pointer"
                onClick={() => onCustomerClick?.(c.id)}
              >
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={`${c.firstName} ${c.lastName}`} className="size-16 rounded-full object-cover shadow-sm border border-border" />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full bg-accent font-serif text-xl font-semibold text-accent-foreground shadow-sm">
                    {initials(c)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {c.firstName} {c.lastName}
                  </p>
                  <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Phone className="size-3" />
                    {c.phone}
                  </p>
                </div>
                <div className="flex flex-col w-full border-t border-border pt-2 text-[11px] gap-1.5">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarCheck className="size-3 text-primary/70" /> Rand. Trh:</span>
                    <span className="font-medium text-foreground">{c.nextVisitDate ? formatDate(c.nextVisitDate) : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="size-3" /> Son İşlem:</span>
                    <span className="font-medium text-foreground">{c.lastVisitDate ? formatDate(c.lastVisitDate) : "-"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Müşteri</th>
                  <th className="px-5 py-3 font-medium">İletişim</th>
                  <th className="px-5 py-3 font-medium">Sonraki Randevu</th>
                  <th className="px-5 py-3 font-medium">Son İşlem Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr 
                    key={c.id} 
                    className="border-b border-border/60 last:border-0 hover:bg-muted/40 cursor-pointer"
                    onClick={() => onCustomerClick?.(c.id)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt={`${c.firstName} ${c.lastName}`} className="size-9 rounded-full object-cover shadow-sm border border-border" />
                        ) : (
                          <div className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground shadow-sm">
                            {initials(c)}
                          </div>
                        )}
                        <span className="font-medium text-foreground">
                          {c.firstName} {c.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="size-3.5" />
                        {c.phone}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarCheck className="size-3.5" />
                        {c.nextVisitDate ? formatDate(c.nextVisitDate) : "-"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {c.lastVisitDate ? formatDate(c.lastVisitDate) : "Kayıt yok"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
