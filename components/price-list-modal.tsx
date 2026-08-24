"use client"

import { useState, useEffect } from "react"
import { Search, Tags, Sparkles, Plus, X } from "lucide-react"
import { servicePrices } from "@/lib/demo-data"

type PriceListModalProps = {
  open: boolean
  onClose: () => void
}

export function PriceListModal({ open, onClose }: PriceListModalProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  // Filtreleme
  const filteredServices = servicePrices.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Kategoriye göre gruplama
  const groupedServices = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, typeof servicePrices>)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
      {/* Modal İçeriği */}
      <div 
        className="flex w-full max-w-4xl flex-col rounded-3xl bg-card border border-border shadow-2xl h-[90vh] overflow-hidden mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Üst Kısım: Başlık ve Kapat Butonu */}
        <div className="flex items-center justify-between border-b border-primary/20 bg-primary/10 px-6 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Tags className="size-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-primary">Fiyat Listesi</h3>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Kapat"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Toolbar (Arama) */}
        <div className="flex items-center border-b border-border bg-muted/20 px-6 py-4 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="İşlem veya kategori ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-4 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-auto p-6">
          {Object.keys(groupedServices).length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 text-muted-foreground">
              <Tags className="mb-2 size-8 opacity-50" />
              <p>Aradığınız kriterlere uygun işlem bulunamadı.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 pb-10">
              {Object.entries(groupedServices).map(([category, services]) => (
                <div key={category} className="flex flex-col gap-5 rounded-2xl border border-border bg-accent/40 p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                    <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Sparkles className="size-3" />
                    </div>
                    <h2 className="text-sm font-bold text-foreground">
                      {category}
                    </h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/50">
                      {services.length} işlem
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {services.map((service) => {
                      // Parantez içini ayıklama
                      const match = service.name.match(/^(.*?)\s*(\(.*?\))$/)
                      const mainName = match ? match[1] : service.name
                      const parenText = match ? match[2] : ""

                      return (
                        <div 
                          key={service.id}
                          className="group flex flex-col justify-between rounded-lg border border-border bg-card px-3 py-2 shadow-sm transition-all hover:bg-muted/50 hover:border-primary/50 hover:shadow-md cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors flex flex-wrap items-center gap-1">
                              {mainName}
                              {parenText && (
                                <span className="text-[10px] font-normal text-muted-foreground tracking-wide group-hover:text-primary/70 transition-colors">
                                  {parenText}
                                </span>
                              )}
                            </h3>
                            <div className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary shrink-0 shadow-sm border border-primary/20">
                              ₺{service.price.toLocaleString("tr-TR")}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Tıklanınca Kapanma Arka Planı (onClick'i bir div ile yakalıyoruz) */}
      <div className="fixed inset-0 -z-10 cursor-pointer" onClick={onClose} />
    </div>
  )
}
