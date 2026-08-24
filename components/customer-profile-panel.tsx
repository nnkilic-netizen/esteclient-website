"use client"

import { useState, useRef, useEffect } from "react"
import { CalendarCheck, Banknote, Edit, Phone, MessageSquare, Plus, Clock, ChevronLeft, CalendarPlus, BadgeDollarSign, Sparkles, ShoppingBag, Cake, CalendarClock, Zap, User, Camera, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Customer, Appointment, mockCustomerServices, mockCustomerPayments, mockCustomerSales, STATUS_META, CustomerServiceRecord, CustomerPayment, mockUsers } from "@/lib/demo-data"
import { EditCustomerModal } from "./edit-customer-modal"
import { AddServiceModal } from "./add-service-modal"
import { AddPaymentModal } from "./add-payment-modal"
import { AddAppointmentModal } from "./add-appointment-modal"
import { SaleSummaryModal } from "./sale-summary-modal"
import { CustomerSale } from "@/lib/demo-data"

type CustomerProfilePanelProps = {
  customer: Customer
  appointments: Appointment[]
  onBack?: () => void
  onAddAppointment?: (apptData: any) => void
  onEditCustomer?: (customer: Customer) => void
  onMakeSaleClick?: () => void
  setHeaderContent: (content: React.ReactNode) => void
  showToast?: (msg: string) => void
}

type TabKey = "services" | "sales" | "payments" | "appointments"

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })
  } catch {
    return d
  }
}

function highlightSessionCounts(text: string) {
  if (!text) return text;
  // Match patterns like 8S, 8K, or (Sınırsız)
  const parts = text.split(/([\d]+S|[\d]+K|\(Sınırsız\))/g)
  if (parts.length === 1) return text;
  
  return (
    <>
      {parts.map((part, i) => {
        if (part.match(/^[\d]+S$/)) {
          return <span key={i} className="text-blue-600 dark:text-blue-400 font-semibold">{part}</span>
        }
        if (part.match(/^[\d]+K$/)) {
          return <span key={i} className="text-orange-600 dark:text-orange-400 font-semibold">{part}</span>
        }
        if (part === "(Sınırsız)") {
          return <span key={i} className="text-purple-600 dark:text-purple-400 font-semibold">{part}</span>
        }
        return part
      })}
    </>
  )
}

export function CustomerProfilePanel({ customer, appointments, onBack, onAddAppointment, onEditCustomer, onMakeSaleClick, setHeaderContent, showToast }: CustomerProfilePanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("services")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false)
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false)
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false)
  const [addedServices, setAddedServices] = useState<CustomerServiceRecord[]>([])
  const [addedPayments, setAddedPayments] = useState<CustomerPayment[]>([])
  type CancellationRecord = {
    by: string;
    date: string;
    reason: string;
  };
  const [cancelledSales, setCancelledSales] = useState<Record<string, CancellationRecord>>({})
  const [saleToCancel, setSaleToCancel] = useState<CustomerSale | null>(null)
  const [cancelPassword, setCancelPassword] = useState("")
  const [cancelReason, setCancelReason] = useState("")
  const [cancelError, setCancelError] = useState("")
  const [cancelStep, setCancelStep] = useState<"form" | "success">("form")
  
  const [cancelledPayments, setCancelledPayments] = useState<Record<string, CancellationRecord>>({})
  const [paymentToCancel, setPaymentToCancel] = useState<CustomerPayment | null>(null)
  const [cancelPaymentPassword, setCancelPaymentPassword] = useState("")
  const [cancelPaymentReason, setCancelPaymentReason] = useState("")
  const [cancelPaymentError, setCancelPaymentError] = useState("")
  const [cancelPaymentStep, setCancelPaymentStep] = useState<"form" | "success">("form")

  const [deletedServiceIds, setDeletedServiceIds] = useState<string[]>([])
  const [serviceToDelete, setServiceToDelete] = useState<CustomerServiceRecord | null>(null)
  const [serviceHasActivePayment, setServiceHasActivePayment] = useState(false)
  const [deleteServiceStep, setDeleteServiceStep] = useState<"form" | "success">("form")

  const [cancelledAppointmentIds, setCancelledAppointmentIds] = useState<string[]>([])
  
  const [selectedSaleForSummary, setSelectedSaleForSummary] = useState<CustomerSale | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const [localAvatar, setLocalAvatar] = useState<string | null>(null)
  const [localNote, setLocalNote] = useState(customer.note || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalAvatar(null)
    setLocalNote(customer.note || "")
  }, [customer.id, customer.note])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPhotoMenuOpen(false)
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsPhotoMenuOpen(false)
      }
    }
    if (isPhotoMenuOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPhotoMenuOpen])

  useEffect(() => {
    setHeaderContent(
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 shadow-sm">
          <User className="size-7" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">Müşteri Kartı</h2>
          <p className="text-xs text-muted-foreground mt-0.5 mb-2.5">Müşteri Bilgileri.</p>
        </div>
      </div>
    )
    return () => setHeaderContent(null)
  }, [setHeaderContent])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLocalAvatar(url)
      setIsPhotoMenuOpen(false)
      if (onEditCustomer) {
        onEditCustomer({ ...customer, imageUrl: url })
      }
    }
  }

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLocalAvatar(null)
    setIsPhotoMenuOpen(false)
    if (onEditCustomer) {
       onEditCustomer({ ...customer, imageUrl: undefined })
    }
  }

  const handleChangePhotoClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    fileInputRef.current?.click()
    setIsPhotoMenuOpen(false)
  }

  const avatarSrc = localAvatar || customer.imageUrl

  const customerAppointments = appointments
    .filter((a) => a.customerId === customer.id && !cancelledAppointmentIds.includes(a.id))
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime())
  
  // İşlemleri (services) mock veriler ve yerel olarak eklenenleri birleştirerek oluştur
  const baseCustomerServices = mockCustomerServices.filter((s) => s.customerId === customer.id)
  const customerServices = [...baseCustomerServices, ...addedServices]
    .filter(s => !deletedServiceIds.includes(s.id))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // Ödemeleri (payments) mock veriler ve yerel olarak eklenenleri birleştirerek oluştur
  const baseCustomerPayments = mockCustomerPayments.filter((p) => p.customerId === customer.id)
  const customerPayments = [...baseCustomerPayments, ...addedPayments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  const customerSales = mockCustomerSales.filter((s) => s.customerId === customer.id)
  
  return (
    <section className="flex flex-col flex-1 min-h-0 bg-background/50">
      
      <div className="flex flex-col shrink-0 gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-sm mb-3">
        
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
          {/* Sol: Müşteri Bilgileri */}
          <div className="flex items-start gap-4">
            <div className="relative" ref={menuRef}>
              <div 
                className="relative flex size-[72px] shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground shadow-md hover:shadow-lg overflow-hidden cursor-pointer group transition-all"
                onClick={() => setIsPhotoMenuOpen(!isPhotoMenuOpen)}
                title="Fotoğraf işlemleri"
              >
                {avatarSrc ? (
                  <img 
                    src={avatarSrc} 
                    alt={`${customer.firstName} avatar`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-accent text-accent-foreground text-[32px] font-serif font-bold">
                    {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="size-6 text-white" />
                </div>
              </div>

              {isPhotoMenuOpen && (
                <div className="absolute top-[80px] left-0 w-[140px] bg-popover rounded-lg border border-border shadow-xl overflow-hidden z-[60] text-xs font-medium animate-in slide-in-from-top-1 fade-in duration-200">
                  {avatarSrc ? (
                    <>
                      <button 
                        onClick={handleChangePhotoClick}
                        className="w-full text-left px-3.5 py-2.5 text-foreground hover:bg-muted transition-colors border-b border-border/50"
                      >
                        Fotoğrafı Değiştir
                      </button>
                      <button 
                        onClick={handleRemovePhoto}
                        className="w-full text-left px-3.5 py-2.5 text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        Fotoğrafı Sil
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleChangePhotoClick}
                      className="w-full text-left px-3.5 py-2.5 text-primary hover:bg-primary/10 transition-colors"
                    >
                      Fotoğraf Ekle
                    </button>
                  )}
                </div>
              )}

              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="flex flex-col gap-1 w-full pt-2">
              <div className="flex items-center gap-4">
                <h2 className="font-sans text-2xl font-bold tracking-tight text-foreground">
                  {customer.firstName} {customer.lastName}
                </h2>
                <button 
                  onClick={() => setEditModalOpen(true)}
                  className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Düzenle"
                >
                  <Edit className="size-5" />
                </button>
              </div>
              <div className="flex flex-col gap-2 mt-1.5">
                {/* 1. Satır: Telefon, Doğum Tarihi ve Kayıt Tarihi */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pb-2 border-b border-border/60">
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-4 text-primary/70" />
                    {customer.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Cake className="size-4 text-pink-500" />
                    {customer.birthDate ? formatDate(customer.birthDate) : "Belirtilmemiş"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4 text-muted-foreground" />
                    Kayıt: {customer.registeredAt ? formatDate(customer.registeredAt) : "01.01.2024"}
                  </span>
                </div>
                
                {/* 2. Satır: Son İşlem ve Sonraki Randevu (Altlı Üstlü, büyük tarih) */}
                <div className="flex flex-wrap items-center gap-8 pt-0.5">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <CalendarCheck className="size-4 text-emerald-500" />
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Son İşlem</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {customer.lastVisitDate ? formatDate(customer.lastVisitDate) : "-"}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <CalendarClock className="size-4 text-sky-500" />
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Sonraki Randevu</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {customer.nextVisitDate ? formatDate(customer.nextVisitDate) : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sağ: Müşteri Notları */}
          <div className="flex flex-col gap-2 h-full w-full">
            <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-2.5 text-sm border border-border/50 flex-1 min-h-[90px]">
               <div className="flex items-center gap-1.5 font-medium text-foreground text-xs uppercase tracking-wide">
                 <MessageSquare className="size-4 text-primary" />
                 Notlar
               </div>
               <textarea
                 value={localNote}
                 onChange={(e) => setLocalNote(e.target.value)}
                 placeholder="Müşteri için not girin..."
                 className="w-full flex-1 bg-transparent text-muted-foreground text-xs leading-relaxed outline-none resize-none placeholder:text-muted-foreground/50"
               />
            </div>
          </div>
        </div>
        
        {/* Alt Kısım: Butonlar ve Borç Bakiyesi */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 mt-0.5 border-t border-border/50">
          {/* Butonlar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button 
              onClick={onMakeSaleClick}
              className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3.5 py-2 text-xs font-medium text-primary shadow-sm transition-colors hover:bg-primary/20"
            >
              <ShoppingBag className="size-4" />
              Satış Yap
            </button>
            
            <button 
              onClick={() => setIsAddServiceOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3.5 py-2 text-xs font-medium text-primary shadow-sm transition-colors hover:bg-primary/20"
            >
              <Sparkles className="size-4" />
              İşlem Ekle
            </button>

            <button 
              onClick={() => setIsAddPaymentOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3.5 py-2 text-xs font-medium text-primary shadow-sm transition-colors hover:bg-primary/20"
            >
              <BadgeDollarSign className="size-4" />
              Ödeme Al
            </button>
            
            <button 
              onClick={() => setIsAddAppointmentOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3.5 py-2 text-xs font-medium text-primary shadow-sm transition-colors hover:bg-primary/20"
            >
              <CalendarPlus className="size-4" />
              Randevu Ekle
            </button>
          </div>

          {/* Borç Bakiyesi Kartı */}
          <div className="flex items-center justify-between gap-6 rounded-lg bg-red-500/10 px-4 py-2 border border-red-500/20 shadow-sm shrink-0 min-w-[220px]">
            <div className="flex items-center gap-2 font-medium text-red-600 dark:text-red-400 text-xs uppercase tracking-wide">
              <Banknote className="size-4" />
              Borç Bakiyesi:
            </div>
            <span className="font-bold text-red-600 dark:text-red-400 text-base">
              ₺{(customer.debt || 0).toLocaleString("tr-TR")}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT TABS */}
      <div className="flex flex-col flex-1 min-h-0 rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-6 border-b border-border px-6 pt-4 shrink-0 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("services")}
            className={cn(
              "flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
              activeTab === "services" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="size-4" />
            İşlemler
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={cn(
              "flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
              activeTab === "sales" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <ShoppingBag className="size-4" />
            Ürün/Hizmet Satışları
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={cn(
              "flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
              activeTab === "payments" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Banknote className="size-4" />
            Ödemeler
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={cn(
              "flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
              activeTab === "appointments" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock className="size-4" />
            Geçmiş Randevular
          </button>
        </div>

        {/* TAB CONTENTS (Scrollable area) */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "services" && (
            <div className="flex flex-col gap-4">
              {customerServices.length > 0 ? (
                <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left align-middle">
                    <thead className="bg-muted/40 text-muted-foreground uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-3 py-2.5 font-medium w-[100px]">Tarih</th>
                        <th className="px-3 py-2.5 font-medium w-[90px]">İşlem Türü</th>
                        <th className="px-3 py-2.5 font-medium">Personel</th>
                        <th className="px-3 py-2.5 font-medium">Yapılan İşlemler</th>
                        <th className="px-3 py-2.5 font-medium w-[80px]">Tutar</th>
                        <th className="px-3 py-2.5 font-medium w-[200px]">İşlem Notları</th>
                        <th className="px-3 py-2.5 font-medium text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 bg-card">
                      {customerServices.map((s) => (
                        <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap align-middle">
                            <Zap className="size-4 text-primary shrink-0 inline-block align-middle mr-1.5" />
                            <span className="align-middle">{formatDate(s.date)}</span>
                          </td>
                          <td className="px-3 py-3">
                            <span className={cn(
                              "rounded-md px-1.5 py-0.5 text-xs font-medium border whitespace-nowrap",
                              s.serviceType === "İşlem" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                              s.serviceType === "Kontrol" ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                              "bg-purple-500/10 text-purple-600 border-purple-500/20"
                            )}>
                              {s.serviceType}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                            {s.staff}
                          </td>
                          <td className="px-3 py-3 font-medium text-foreground leading-relaxed whitespace-normal break-words">
                            <div className="flex flex-col gap-1">
                              {s.servicesDone.map((item, idx) => (
                                <span 
                                  key={idx} 
                                  className={cn(
                                    "block",
                                    item.startsWith('•') || item.startsWith('✨') ? "text-[11px] text-muted-foreground ml-2" : "text-[13px]"
                                  )}
                                >
                                  {highlightSessionCounts(item)}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-3 font-semibold text-primary whitespace-nowrap">
                            {s.price > 0 ? `₺${s.price.toLocaleString("tr-TR")}` : "Ücretsiz"}
                          </td>
                          <td className="px-3 py-3 text-[13px] text-muted-foreground whitespace-normal break-words leading-relaxed">
                            {s.notes || "-"}
                          </td>
                          <td className="px-3 py-3 text-right align-middle">
                            <div className="flex justify-end items-center gap-3 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  const hasActivePayment = s.price > 0 && customerPayments.some(p => p.date === s.date && p.amount === s.price && !cancelledPayments[p.id]);
                                  if (hasActivePayment) {
                                    setServiceToDelete(s)
                                    setServiceHasActivePayment(true)
                                    setDeleteServiceStep("form")
                                  } else {
                                    // Direk sil ve mesaj goster
                                    setDeletedServiceIds(prev => [...prev, s.id])
                                    showToast?.("İşlem başarıyla silindi.")
                                  }
                                }}
                                title="İşlemi Sil"
                                className="inline-flex items-center justify-center size-8 rounded hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
                    <Sparkles className="size-6 text-muted-foreground/60" />
                  </div>
                  <p>Bu müşteriye ait işlem kaydı bulunmuyor.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "sales" && (
            <div className="flex flex-col gap-4">
              {customerSales.length > 0 ? (
                <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left align-middle">
                    <thead className="bg-muted/40 text-muted-foreground uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-3 py-2.5 font-medium w-[100px]">Tarih</th>
                        <th className="px-3 py-2.5 font-medium">Ürün Adı</th>
                        <th className="px-3 py-2.5 font-medium">Personel</th>
                        <th className="px-3 py-2.5 font-medium">Adet</th>
                        <th className="px-3 py-2.5 font-medium">Tutar</th>
                        <th className="px-3 py-2.5 font-medium text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 bg-card">
                      {customerSales.map((s) => {
                        const isCancelled = cancelledSales[s.id];
                        const personnelName = s.personnelId ? mockUsers.find(u => u.id === s.personnelId)?.fullName : "-";
                        return (
                        <tr key={s.id} className={cn("hover:bg-muted/40 transition-colors", isCancelled && "bg-red-50/30")}>
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap align-middle">
                            <ShoppingBag className="size-4 text-indigo-500 shrink-0 inline-block align-middle mr-1.5" />
                            <span className={cn("align-middle", isCancelled && "line-through opacity-70")}>{formatDate(s.date)}</span>
                          </td>
                          <td className={cn("px-3 py-3 font-medium text-foreground", isCancelled && "line-through text-muted-foreground opacity-70")}>{s.productName}</td>
                          <td className={cn("px-3 py-3 text-muted-foreground", isCancelled && "line-through opacity-70")}>{personnelName}</td>
                          <td className={cn("px-3 py-3 text-muted-foreground", isCancelled && "line-through opacity-70")}>{s.quantity}</td>
                          <td className={cn("px-3 py-3 font-semibold text-primary", isCancelled && "line-through text-muted-foreground opacity-70")}>₺{s.totalPrice.toLocaleString("tr-TR")}</td>
                          <td className="px-3 py-3 text-right align-middle">
                            {isCancelled ? (
                              <div className="text-red-500 text-[11px] font-medium leading-relaxed text-left whitespace-normal break-words inline-block w-[250px]">
                                {isCancelled.by} tarafından {isCancelled.date} tarihinde iptal edildi. İptal sebebi: {isCancelled.reason}
                              </div>
                            ) : (
                              <div className="flex justify-end items-center gap-3 whitespace-nowrap">
                                <button
                                  onClick={() => setSelectedSaleForSummary(s)}
                                  title="Satış Detayını İncele (Makbuz)"
                                  className="inline-flex items-center justify-center size-8 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </button>
                                <button
                                  onClick={() => {
                                    setSaleToCancel(s)
                                    setCancelStep("form")
                                  }}
                                  title="Satışı İptal Et"
                                  className="inline-flex items-center justify-center size-8 rounded hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
                    <ShoppingBag className="size-6 text-muted-foreground/60" />
                  </div>
                  <p>Müşterinin satın aldığı ürün ve hizmet paketleri bulunmuyor.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "payments" && (
            <div className="flex flex-col gap-4">
              {customerPayments.length > 0 ? (
                <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left align-middle">
                    <thead className="bg-muted/40 text-muted-foreground uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-3 py-2.5 font-medium w-[100px]">Tarih</th>
                        <th className="px-3 py-2.5 font-medium">Tutar</th>
                        <th className="px-3 py-2.5 font-medium">Ödeme Yöntemi</th>
                        <th className="px-3 py-2.5 font-medium">İşlem Tipi</th>
                        <th className="px-3 py-2.5 font-medium">Açıklama</th>
                        <th className="px-3 py-2.5 font-medium text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 bg-card">
                      {customerPayments.map((p) => {
                        const isIade = p.type === "İade";
                        const isCancelled = cancelledPayments[p.id];
                        return (
                        <tr key={p.id} className={cn("hover:bg-muted/40 transition-colors", isCancelled && "bg-red-50/30")}>
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap align-middle">
                            <Banknote className={cn("size-4 shrink-0 inline-block align-middle mr-1.5", isIade ? "text-rose-500" : "text-emerald-500")} />
                            <span className={cn("align-middle", isCancelled && "line-through opacity-70")}>{formatDate(p.date)}</span>
                          </td>
                          <td className={cn("px-3 py-3 font-semibold", isIade ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400", isCancelled && "line-through text-muted-foreground opacity-70")}>
                            {isIade ? "-" : "+"} ₺{p.amount.toLocaleString("tr-TR")}
                          </td>
                          <td className={cn("px-3 py-3 text-muted-foreground", isCancelled && "line-through opacity-70")}>{p.method}</td>
                          <td className="px-3 py-3">
                            <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-medium", isIade ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", isCancelled && "line-through opacity-70")}>
                              {p.type}
                            </span>
                          </td>
                          <td className={cn("px-3 py-3 text-[13px] text-muted-foreground whitespace-normal break-words leading-relaxed", isCancelled && "line-through opacity-70")}>
                            {p.notes || "-"}
                          </td>
                          <td className="px-3 py-3 text-right align-middle">
                            {isCancelled ? (
                              <div className="text-red-500 text-[11px] font-medium leading-relaxed text-left whitespace-normal break-words inline-block w-[250px]">
                                {isCancelled.by} tarafından {isCancelled.date} tarihinde iptal edildi. İptal sebebi: {isCancelled.reason}
                              </div>
                            ) : (
                              <div className="flex justify-end items-center gap-3 whitespace-nowrap">
                                <button
                                  onClick={() => {
                                    setPaymentToCancel(p)
                                    setCancelPaymentStep("form")
                                  }}
                                  title="Ödemeyi İptal Et"
                                  className="inline-flex items-center justify-center size-8 rounded hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
                    <Banknote className="size-6 text-muted-foreground/60" />
                  </div>
                  <p>Bu müşteriye ait ödeme kaydı bulunmuyor.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="flex flex-col gap-4">
              {customerAppointments.length > 0 ? (
                <div className="border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left align-middle">
                    <thead className="bg-muted/40 text-muted-foreground uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-3 py-2.5 font-medium w-[100px]">Tarih</th>
                        <th className="px-3 py-2.5 font-medium w-[80px]">Saat</th>
                        <th className="px-3 py-2.5 font-medium w-[110px]">İşlem Türü</th>
                        <th className="px-3 py-2.5 font-medium">Randevu Konusu</th>
                        <th className="px-3 py-2.5 font-medium w-[120px]">Durum</th>
                        <th className="px-3 py-2.5 font-medium">Notlar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {customerAppointments.map((a) => {
                        const statusMeta = STATUS_META[a.status];
                        return (
                        <tr key={a.id} className="hover:bg-muted/40 transition-colors">
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap align-middle">
                            <CalendarClock className="size-4 text-amber-500 shrink-0 inline-block align-middle mr-1.5" />
                            <span className="align-middle">{formatDate(a.date)}</span>
                          </td>
                          <td className="px-3 py-3 font-medium text-foreground whitespace-nowrap">{a.time}</td>
                          <td className="px-3 py-3">
                            <span className={cn(
                              "rounded-md px-1.5 py-0.5 text-xs font-medium border whitespace-nowrap",
                              (a.serviceType || "İşlem") === "İşlem" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                              (a.serviceType || "İşlem") === "Kontrol" ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                              "bg-purple-500/10 text-purple-600 border-purple-500/20"
                            )}>
                              {a.serviceType || "İşlem"}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-foreground font-medium">{a.service}</td>
                          <td className="px-3 py-3">
                            <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium border border-border/50", statusMeta.bg, statusMeta.text)}>
                              <div className={cn("size-1.5 rounded-full", statusMeta.dot)} />
                              {statusMeta.label}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-muted-foreground leading-relaxed">
                            {a.notes || "-"}
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
                    <Clock className="size-6 text-muted-foreground/60" />
                  </div>
                  <p>Bu müşteriye ait geçmiş randevu kaydı bulunmuyor.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <EditCustomerModal
        open={editModalOpen}
        customer={customer}
        onClose={() => setEditModalOpen(false)}
        onSave={(c) => {
          onEditCustomer?.(c)
          setEditModalOpen(false)
        }}
      />

      <AddServiceModal
        isOpen={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
        customerName={`${customer.firstName} ${customer.lastName}`}
        customerId={customer.id}
        customerSales={customerSales}
        pastServices={customerServices}
        onMakeSaleClick={() => {
          setIsAddServiceOpen(false)
          onMakeSaleClick?.()
        }}
        onSave={({ service, payment }) => {
          if (service) {
            setAddedServices([...addedServices, service])
          }
          if (payment) {
            setAddedPayments([...addedPayments, payment])
          }
          if (payment && !service) {
            setActiveTab("payments")
          } else {
            setActiveTab("services")
          }
        }}
      />

      <AddPaymentModal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        customerName={`${customer.firstName} ${customer.lastName}`}
        customerId={customer.id}
        customerSales={customerSales}
        customerPayments={customerPayments}
        onSave={({ payment }) => {
          if (payment) {
            setAddedPayments([...addedPayments, payment])
            setActiveTab("payments")
          }
        }}
      />

      <AddAppointmentModal
        isOpen={isAddAppointmentOpen}
        onClose={() => setIsAddAppointmentOpen(false)}
        customerName={`${customer.firstName} ${customer.lastName}`}
        customerId={customer.id}
        appointments={appointments.filter(a => !cancelledAppointmentIds.includes(a.id))}
        onSave={(data) => {
          if (onAddAppointment) onAddAppointment(data)
          setIsAddAppointmentOpen(false)
          setActiveTab("appointments")
        }}
        onCancelAppointment={(id) => {
          setCancelledAppointmentIds(prev => [...prev, id])
          showToast?.("Randevu başarıyla iptal edildi.")
        }}
      />
      {selectedSaleForSummary && (
        <SaleSummaryModal
          isOpen={true}
          onClose={() => setSelectedSaleForSummary(null)}
          customer={customer}
          cart={[{ 
            uniqueId: 'mock1', 
            id: 'p1', 
            type: 'product', 
            name: selectedSaleForSummary.productName, 
            price: selectedSaleForSummary.totalPrice / (selectedSaleForSummary.quantity || 1), 
            originalPrice: selectedSaleForSummary.totalPrice / (selectedSaleForSummary.quantity || 1), 
            quantity: selectedSaleForSummary.quantity || 1 
          }]}
          selectedPersonnel={selectedSaleForSummary.personnelId || ""}
          paymentType="pesin"
          paymentMethod="Kredi Kartı"
          installmentCount={3}
          saleNote="Geçmiş satış kaydı."
          rawTotal={selectedSaleForSummary.totalPrice}
          inlineDiscountTotal={0}
          subTotal={selectedSaleForSummary.totalPrice}
          discountAmount={0}
          finalTotal={selectedSaleForSummary.totalPrice}
          date={new Date(selectedSaleForSummary.date)}
          backButtonText="Kapat"
          onCancelSale={() => {
            // Already cancelled, this shouldn't be reached if button is hidden, but just in case
            setSaleToCancel(selectedSaleForSummary)
            setSelectedSaleForSummary(null)
          }}
        />
      )}

      {/* CANCELLATION MODAL */}
      {saleToCancel && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card p-6 rounded-2xl w-full max-w-sm shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200">
            {cancelStep === "form" ? (
              <>
                <h3 className="text-lg font-semibold text-foreground mb-4">Satışı İptal Et</h3>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-foreground">Yönetici Şifresi</span>
                    <input 
                      type="password" 
                      value={cancelPassword} 
                      onChange={(e) => setCancelPassword(e.target.value)} 
                      className="w-full bg-background border border-input rounded-xl px-4 py-2 mt-1.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      placeholder="Şifrenizi girin (Örn: 1234)" 
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-foreground">İptal Sebebi</span>
                    <textarea 
                      value={cancelReason} 
                      onChange={(e) => setCancelReason(e.target.value)} 
                      className="w-full bg-background border border-input rounded-xl px-4 py-2 mt-1.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm h-20 resize-none"
                      placeholder="Neden iptal ediliyor?" 
                    />
                  </label>
                  {cancelError && <p className="text-sm text-red-500 font-medium">{cancelError}</p>}
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      onClick={() => {
                        setSaleToCancel(null)
                        setCancelPassword("")
                        setCancelReason("")
                        setCancelError("")
                        setCancelStep("form")
                      }} 
                      className="px-4 py-2 text-sm font-medium rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Vazgeç
                    </button>
                    <button 
                      onClick={() => {
                        if (cancelPassword !== "1234") {
                          setCancelError("Hatalı yönetici şifresi!")
                          return
                        }
                        if (!cancelReason.trim()) {
                          setCancelError("Lütfen iptal sebebi giriniz.")
                          return
                        }
                        
                        const today = new Date().toLocaleDateString('tr-TR');
                        setCancelledSales({
                          ...cancelledSales,
                          [saleToCancel.id]: {
                            by: "ayşe kutlu", // Mock admin user for demo
                            date: today,
                            reason: cancelReason.trim()
                          }
                        })
                        setCancelStep("success")
                      }} 
                      className="px-4 py-2 text-sm font-medium rounded-xl text-white bg-red-500 hover:bg-red-600 transition-colors"
                    >
                      İptal Et
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-in zoom-in-50 duration-300">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Başarılı!</h3>
                <p className="text-muted-foreground text-sm mb-6">Satış başarıyla iptal edildi ve iptal bilgisi kaydedildi.</p>
                <button
                  onClick={() => {
                    setSaleToCancel(null)
                    setCancelPassword("")
                    setCancelReason("")
                    setCancelError("")
                    setCancelStep("form")
                  }}
                  className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Tamam
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* PAYMENT CANCELLATION MODAL */}
      {paymentToCancel && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card p-6 rounded-2xl w-full max-w-sm shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200">
            {cancelPaymentStep === "form" ? (
              <>
                <h3 className="text-lg font-semibold text-foreground mb-4">Ödemeyi İptal Et</h3>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-foreground">Yönetici Şifresi</span>
                    <input 
                      type="password" 
                      value={cancelPaymentPassword} 
                      onChange={(e) => setCancelPaymentPassword(e.target.value)} 
                      className="w-full bg-background border border-input rounded-xl px-4 py-2 mt-1.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      placeholder="Şifrenizi girin (Örn: 1234)" 
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-foreground">İptal Sebebi</span>
                    <textarea 
                      value={cancelPaymentReason} 
                      onChange={(e) => setCancelPaymentReason(e.target.value)} 
                      className="w-full bg-background border border-input rounded-xl px-4 py-2 mt-1.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm h-20 resize-none"
                      placeholder="Neden iptal ediliyor?" 
                    />
                  </label>
                  {cancelPaymentError && <p className="text-sm text-red-500 font-medium">{cancelPaymentError}</p>}
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      onClick={() => {
                        setPaymentToCancel(null)
                        setCancelPaymentPassword("")
                        setCancelPaymentReason("")
                        setCancelPaymentError("")
                        setCancelPaymentStep("form")
                      }} 
                      className="px-4 py-2 text-sm font-medium rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Vazgeç
                    </button>
                    <button 
                      onClick={() => {
                        if (cancelPaymentPassword !== "1234") {
                          setCancelPaymentError("Hatalı yönetici şifresi!")
                          return
                        }
                        if (!cancelPaymentReason.trim()) {
                          setCancelPaymentError("Lütfen iptal sebebi giriniz.")
                          return
                        }
                        
                        const today = new Date().toLocaleDateString('tr-TR');
                        setCancelledPayments({
                          ...cancelledPayments,
                          [paymentToCancel.id]: {
                            by: "ayşe kutlu", // Mock admin user for demo
                            date: today,
                            reason: cancelPaymentReason.trim()
                          }
                        })
                        setCancelPaymentStep("success")
                      }} 
                      className="px-4 py-2 text-sm font-medium rounded-xl text-white bg-red-500 hover:bg-red-600 transition-colors"
                    >
                      İptal Et
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-in zoom-in-50 duration-300">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Başarılı!</h3>
                <p className="text-muted-foreground text-sm mb-6">Ödeme başarıyla iptal edildi ve iptal bilgisi kaydedildi.</p>
                <button
                  onClick={() => {
                    setPaymentToCancel(null)
                    setCancelPaymentPassword("")
                    setCancelPaymentReason("")
                    setCancelPaymentError("")
                    setCancelPaymentStep("form")
                  }}
                  className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Tamam
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* SERVICE DELETION MODAL (Sadece aktif ödeme uyarısı için kullanılıyor) */}
      {serviceToDelete && serviceHasActivePayment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card p-6 rounded-2xl w-full max-w-sm shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200">
            <>
              <h3 className="text-lg font-semibold text-foreground mb-4">İşlemi Sil</h3>
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex gap-3">
                    <div className="mt-0.5 text-amber-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                    </div>
                    <p className="text-sm text-amber-900 leading-relaxed font-medium">
                      Bu işleme ait aktif bir tahsilat (ödeme) bulunmaktadır. İşlemi silebilmek için öncelikle <strong>Ödemeler</strong> sekmesinden ilgili tahsilatı iptal etmeniz gerekmektedir.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    onClick={() => {
                      setServiceToDelete(null)
                    }} 
                    className="px-4 py-2 text-sm font-medium rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </>
          </div>
        </div>
      )}
    </section>
  )
}
