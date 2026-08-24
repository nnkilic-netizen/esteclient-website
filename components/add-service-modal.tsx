"use client"

import { useState, useEffect } from "react"
import { X, Sparkles, AlertCircle, CalendarClock, CreditCard } from "lucide-react"
import { CustomSelect } from "./ui/custom-select"
import { CustomerSale, CustomerServiceRecord, mockUsers } from "@/lib/demo-data"

interface AddServiceModalProps {
  isOpen: boolean
  onClose: () => void
  customerName: string
  customerId: string
  customerSales: CustomerSale[]
  pastServices: CustomerServiceRecord[]
  onSave: (data: { service: any, payment: any }) => void
  onMakeSaleClick?: () => void
}

export function AddServiceModal({ 
  isOpen, 
  onClose, 
  customerName, 
  customerId, 
  customerSales,
  pastServices,
  onSave,
  onMakeSaleClick
}: AddServiceModalProps) {
  // Satın alınmış ve seanslı olan paketleri filtrele
  const availablePackages = customerSales.filter(s => s.totalSessions && s.totalSessions > 0)
  
  const [step, setStep] = useState<"form" | "success">("form")
  const [selectedSaleId, setSelectedSaleId] = useState<string>("")
  const [serviceType, setServiceType] = useState<"İşlem" | "Kontrol">("İşlem")
  const [notes, setNotes] = useState("")
  const [staff, setStaff] = useState("all")
  
  // Ödeme Alanları
  const [paymentAmount, setPaymentAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<"Nakit" | "Kredi Kartı" | "Havale">("Nakit")
  
  // Hesaplanan seans bilgisi
  const [sessionInfo, setSessionInfo] = useState<{ islemCount: number, kontrolCount: number, total: number } | null>(null)
  
  type PackageContentState = {
    name: string
    selected: boolean
    islemCount: number
    kontrolCount: number
  }
  const [packageContents, setPackageContents] = useState<PackageContentState[]>([])

  // Seçilen pakete göre kaçıncı seans olduğunu hesapla
  useEffect(() => {
    if (!selectedSaleId) {
      setSessionInfo(null)
      setPackageContents([])
      return
    }

    const sale = availablePackages.find(p => p.id === selectedSaleId)
    if (!sale) return

    // Bu pakete bağlı daha önceki işlemleri bul
    const pastLinkedServices = pastServices.filter(s => s.linkedSaleId === selectedSaleId)
    
    const overallIslemCount = pastLinkedServices.filter(s => s.serviceType === "İşlem").length
    const overallKontrolCount = pastLinkedServices.filter(s => s.serviceType === "Kontrol").length
    
    setSessionInfo({
      islemCount: overallIslemCount,
      kontrolCount: overallKontrolCount,
      total: sale.totalSessions || 0
    })

    if (sale.contents) {
      const contentsState = sale.contents.map(content => {
        const cIslemCount = pastLinkedServices.filter(s => s.serviceType === "İşlem" && s.servicesDone.some(item => item.includes(content))).length
        const cKontrolCount = pastLinkedServices.filter(s => s.serviceType === "Kontrol" && s.servicesDone.some(item => item.includes(content))).length
        
        return {
          name: content,
          selected: true,
          islemCount: cIslemCount,
          kontrolCount: cKontrolCount
        }
      })
      setPackageContents(contentsState)
    } else {
      setPackageContents([])
    }
    // Sadece paket seçimi değiştiğinde veya modal açıldığında çalışmalı
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSaleId])

  // ESC tuşuyla kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Reset state when modal opens/closes
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
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
            <svg className="size-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-foreground">İşlem Kaydedildi!</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Müşterinin işlem kaydı başarıyla sisteme eklendi.
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

  const isServiceValid = selectedSaleId ? (packageContents.length > 0 ? packageContents.some(pc => pc.selected) : true) : false;
  const isPaymentValid = !!(paymentAmount && parseFloat(paymentAmount) > 0);
  const isStaffValid = staff !== "all" && staff !== "";
  const isSaveDisabled = (!isServiceValid && !isPaymentValid) || !isStaffValid;

  const handleSaveData = () => {
    if (!selectedSaleId && !paymentAmount) {
      alert("Lütfen bir işlem seçin veya ödeme tutarı girin.")
      return
    }

    const selectedSale = availablePackages.find(p => p.id === selectedSaleId)
    
    let newServiceRecord = null;
    let newPaymentRecord = null;

    if (isServiceValid && selectedSaleId) {
      // İşlem listesi oluşturuluyor
      const servicesDone: string[] = []
      
      if (selectedSale) {
        // Başlık formatı: 📦 Lazer Epilasyon Paketi
        servicesDone.push(`📦 ${selectedSale.productName}`)
        
        // İçerikleri yanyana aralarında virgül ile topla: Tüm Bacak (1S), Koltuk Altı (1K) vb. (Tümü listelenecek)
        if (packageContents.length > 0) {
          const contentStrings = packageContents.map(pc => {
            const pcIslemNum = pc.selected && serviceType === "İşlem" ? pc.islemCount + 1 : pc.islemCount
            const pcKontrolNum = pc.selected && serviceType === "Kontrol" ? pc.kontrolCount + 1 : pc.kontrolCount
            const pcTypeStr = serviceType === "İşlem" ? `${pcIslemNum}S` : `${pcKontrolNum}K`
            return `${pc.name} (${pcTypeStr})`
          })
          
          if (contentStrings.length > 0) {
            servicesDone.push(`• ${contentStrings.join(', ')}`)
          }
        } else if (selectedSale.contents && selectedSale.contents.length > 0) {
          servicesDone.push(`• ${selectedSale.contents.join(', ')}`)
        }
      }

      newServiceRecord = {
        id: `cs_${Date.now()}`,
        customerId,
        date: new Date().toISOString().split('T')[0],
        serviceType,
        servicesDone,
        notes,
        staff: staff === "all" ? "Belirsiz" : staff,
        price: paymentAmount ? parseFloat(paymentAmount) : 0,
        sessionNumber: serviceType === "İşlem" ? sessionInfo?.islemCount ? sessionInfo.islemCount + 1 : 1 : sessionInfo?.kontrolCount ? sessionInfo.kontrolCount + 1 : 1,
        linkedSaleId: selectedSaleId || undefined
      }
    }

    if (paymentAmount && parseFloat(paymentAmount) > 0) {
      newPaymentRecord = {
        id: `p_${Date.now()}`,
        customerId,
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(paymentAmount),
        method: paymentMethod,
        type: "Tahsilat"
      }
    }

    onSave({ service: newServiceRecord, payment: newPaymentRecord })
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
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">İşlem / Seans Ekle</h2>
              <p className="text-xs text-muted-foreground">
                {customerName} için yeni işlem kaydı
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
        <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Paket Seçimi */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Paket Seçimi (Önceden Satın Alınan)</label>
            {availablePackages.length > 0 ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <CustomSelect 
                    value={selectedSaleId}
                    onChange={(val) => setSelectedSaleId(val as string)}
                    placeholder="-- Tanımlı Paket/İşlem Seçiniz --"
                    options={availablePackages.map(sale => ({ 
                      value: sale.id, 
                      label: `${sale.productName} (${sale.totalSessions} Seanslık)` 
                    }))}
                    className="flex-1"
                  />
                  <button
                    onClick={() => {
                      onClose();
                      onMakeSaleClick?.();
                    }}
                    className="shrink-0 flex items-center justify-center rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                  >
                    Yeni Paket/İşlem
                  </button>
                </div>

                {sessionInfo && (
                  <div className="flex flex-col gap-3 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="size-4 shrink-0" />
                      <span>
                        Genel Paket Durumu: <strong>{serviceType === "İşlem" ? sessionInfo.islemCount + 1 : sessionInfo.islemCount}. Seans</strong> / <strong>{serviceType === "Kontrol" ? sessionInfo.kontrolCount + 1 : sessionInfo.kontrolCount}. Kontrol</strong>
                        {" "}(Kalan İşlem: {Math.max(0, sessionInfo.total - sessionInfo.islemCount)})
                      </span>
                    </div>
                    
                    {packageContents.length > 0 && (
                      <div className="mt-1 pt-3 border-t border-primary/20">
                        <strong className="block mb-2 text-xs">Yapılan İşlemleri Seçin:</strong>
                        <div className="space-y-2.5">
                          {packageContents.map((pc, idx) => {
                            const islemNum = serviceType === "İşlem" ? (pc.selected ? pc.islemCount + 1 : pc.islemCount) : pc.islemCount;
                            const kontrolNum = serviceType === "Kontrol" ? (pc.selected ? pc.kontrolCount + 1 : pc.kontrolCount) : pc.kontrolCount;
                            const displayNum = serviceType === "İşlem" ? islemNum : kontrolNum;
                            const typeStr = serviceType === "İşlem" ? "Seans" : "Kontrol";

                            return (
                              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-md bg-background/50 border border-primary/10">
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm flex-1">
                                  <input 
                                    type="checkbox" 
                                    checked={pc.selected}
                                    onChange={(e) => {
                                      const newContents = [...packageContents]
                                      newContents[idx] = { ...newContents[idx], selected: e.target.checked }
                                      setPackageContents(newContents)
                                    }}
                                    className="accent-primary size-4"
                                  />
                                  <span className={pc.selected ? "text-foreground" : "text-muted-foreground line-through opacity-70"}>
                                    {pc.name}
                                  </span>
                                </label>
                                
                                <span className={`text-xs px-2 py-1 rounded-md ml-6 sm:ml-0 font-medium whitespace-nowrap ${
                                  pc.selected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                }`}>
                                  {displayNum}. {typeStr}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
                <AlertCircle className="size-4 shrink-0" />
                <p>Müşterinin tanımlı bir paketi bulunmuyor.</p>
              </div>
            )}
          </div>

          {/* İşlem Tipi */}
          <div className="space-y-3">
            <label className="text-sm font-medium">İşlem Türü</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="serviceType" 
                  value="İşlem"
                  checked={serviceType === "İşlem"}
                  onChange={() => setServiceType("İşlem")}
                  className="accent-primary"
                />
                <span className="text-sm">Normal İşlem</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="serviceType" 
                  value="Kontrol"
                  checked={serviceType === "Kontrol"}
                  onChange={() => {
                    setServiceType("Kontrol")
                    setPaymentAmount("")
                  }}
                  className="accent-primary"
                />
                <span className="text-sm">Kontrol</span>
              </label>
            </div>
          </div>

          <div className="h-px bg-border/50" />

          {/* Ödeme Alma Alanı */}
          {serviceType === "İşlem" && (
            <>
              <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <CreditCard className="size-4" />
                  <label className="text-sm">Ödeme Al (Opsiyonel)</label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Tutar (₺)</label>
                    <input 
                      type="number" 
                      min={0}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Ödeme Yöntemi</label>
                    <CustomSelect 
                      value={paymentMethod}
                      onChange={(val) => setPaymentMethod(val as any)}
                      options={[
                        { value: "Nakit", label: "Nakit" },
                        { value: "Kredi Kartı", label: "Kredi Kartı" },
                        { value: "Havale", label: "Havale" }
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div className="h-px bg-border/50" />
            </>
          )}

          {/* Personel & Not */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">İşlemi Yapan Personel</label>
              <CustomSelect
                value={staff}
                onChange={(val) => setStaff(val as string)}
                options={[
                  { value: "all", label: "Seçiniz" },
                  ...mockUsers.map(u => ({ value: u.id, label: u.fullName }))
                ]}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">İşlem Notu</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Örn: Müşterinin cildi hassas..."
                className="w-full min-h-[80px] rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border/50 bg-muted/30 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            İptal
          </button>
          <button
            onClick={handleSaveData}
            disabled={isSaveDisabled}
            className={`rounded-xl px-6 py-2 text-sm font-medium shadow-sm transition-all ${
              isSaveDisabled 
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" 
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow"
            }`}
          >
            İşlemi/Ödemeyi Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}
