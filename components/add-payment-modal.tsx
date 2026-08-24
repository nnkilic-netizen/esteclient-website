import { useState, useEffect } from "react"
import { X, Banknote, Calendar, ReceiptText, AlertCircle } from "lucide-react"
import { CustomSelect } from "./ui/custom-select"
import { CustomerSale, CustomerPayment } from "@/lib/demo-data"

interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  customerName: string
  customerId: string
  customerSales: CustomerSale[]
  customerPayments: CustomerPayment[]
  onSave: (data: { payment: any }) => void
}

export function AddPaymentModal({
  isOpen,
  onClose,
  customerName,
  customerId,
  customerSales,
  customerPayments,
  onSave
}: AddPaymentModalProps) {
  const [step, setStep] = useState<"form" | "success">("form")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [amount, setAmount] = useState<string>("")
  const [method, setMethod] = useState<"Nakit" | "Kredi Kartı" | "Havale">("Nakit")
  const [type, setType] = useState<"Tahsilat" | "İade">("Tahsilat")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (isOpen) {
      setStep("form")
    }
  }, [isOpen])

  if (!isOpen) return null

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-background p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100">
            <svg className="size-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-foreground">Ödeme Kaydedildi!</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Müşterinin ödeme işlemi başarıyla sisteme eklendi.
          </p>
          <button
            onClick={() => {
              setStep("form");
              onClose();
            }}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Tamamla ve Kapat
          </button>
        </div>
      </div>
    )
  }

  // Calculate remaining debt
  const totalDebt = customerSales.reduce((acc, sale) => acc + sale.totalPrice, 0)
  const totalPaid = customerPayments.reduce((acc, p) => p.type === "Tahsilat" ? acc + p.amount : acc - p.amount, 0)
  const remainingDebt = Math.max(0, totalDebt - totalPaid)

  const handleSaveData = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Lütfen geçerli bir tutar girin.")
      return
    }

    const newPaymentRecord = {
      id: `p_${Date.now()}`,
      customerId,
      date,
      amount: parseFloat(amount),
      method,
      type,
      notes: notes.trim() || undefined
    }

    onSave({ payment: newPaymentRecord })
    setStep("success")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-background shadow-2xl transition-all sm:my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Banknote className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Yeni Ödeme Al</h2>
              <p className="text-xs text-muted-foreground">
                {customerName} için tahsilat kaydı
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          
          {/* Borç Durumu */}
          <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-600">
                <ReceiptText className="size-4" />
              </div>
              <span className="text-sm font-medium">Kalan Bakiye (Borç)</span>
            </div>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              ₺{remainingDebt.toLocaleString("tr-TR")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">İşlem Tarihi</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Tutar (₺)</label>
              <input 
                type="number" 
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Ödeme Yöntemi</label>
              <CustomSelect 
                value={method}
                onChange={(val) => setMethod(val as any)}
                options={[
                  { value: "Nakit", label: "Nakit" },
                  { value: "Kredi Kartı", label: "Kredi Kartı" },
                  { value: "Havale", label: "Havale" }
                ]}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">İşlem Tipi</label>
              <CustomSelect 
                value={type}
                onChange={(val) => setType(val as any)}
                options={[
                  { value: "Tahsilat", label: "Tahsilat" },
                  { value: "İade", label: "İade" }
                ]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Açıklama / Not</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ödeme ile ilgili notlar..."
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border/50 bg-muted/30 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSaveData}
            disabled={!amount || parseFloat(amount) <= 0}
            className="rounded-xl bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ödemeyi Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}
