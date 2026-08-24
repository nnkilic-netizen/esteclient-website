import { useEffect, useState } from "react"
import { X, Search, Check } from "lucide-react"
import type { Customer } from "@/lib/demo-data"

type SelectCustomerModalProps = {
  open: boolean
  onClose: () => void
  customers: Customer[]
  onSelect: (customerId: string) => void
}

export function SelectCustomerModal({ open, onClose, customers, onSelect }: SelectCustomerModalProps) {
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string>("")

  useEffect(() => {
    if (open) {
      setSearch("")
      setSelectedId("")
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const filteredCustomers = customers.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            <h2 className="text-xl font-serif font-bold text-foreground">Müşteri Seçin</h2>
            <p className="text-xs text-muted-foreground mt-1">Satış yapmak istediğiniz müşteriyi seçin.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-background border border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="İsim veya telefon ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Müşteri bulunamadı.
              </div>
            ) : (
              filteredCustomers.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    selectedId === c.id 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{c.firstName} {c.lastName}</span>
                    <span className="text-xs text-muted-foreground">{c.phone}</span>
                  </div>
                  {selectedId === c.id && (
                    <div className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="size-3" />
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="p-6 border-t border-border bg-muted/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground bg-background border border-border hover:bg-muted transition-colors"
          >
            İptal
          </button>
          <button
            onClick={() => onSelect(selectedId)}
            disabled={!selectedId}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors shadow-sm ${
              !selectedId 
                ? 'bg-slate-300 opacity-50 cursor-not-allowed shadow-none' 
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            Devam Et
          </button>
        </div>
      </div>
    </div>
  )
}
