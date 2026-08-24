"use client"
import React, { useState, useMemo, useEffect } from "react"
import { X, ShoppingBag, Package, Sparkles, Plus, Minus, Search, Check, ArrowLeft, Scissors, Trash2, CheckCircle2, Box, ChevronDown, ChevronRight, ShoppingCart } from "lucide-react"
import { SaleSummaryModal } from "./sale-summary-modal"
import { 
  type Customer, 
  products, 
  campaignPackages, 
  serviceCategories, 
  mockUsers,
  type Product,
  type CampaignPackage,
  type ServiceItem 
} from "@/lib/demo-data"
import { CustomSelect } from "@/components/ui/custom-select"
type MakeSaleModalProps = {
  open: boolean
  onClose: () => void
  customer: Customer | null
  onSave: (sales: any[]) => void
  initialProduct?: Product | null
}
type SaleMode = "product" | "campaign" | "custom" | null
type BuilderItem = {
  id: string
  uniqueId: string
  name: string
  originalPrice: number
  currentPrice: number
  sessionCount: number
  controlCount: number
}
type CartItem = {
  id: string
  uniqueId: string
  name: string
  originalPrice: number
  price: number
  quantity: number 
  type: 'product' | 'campaign' | 'custom_package'
  builderItems?: BuilderItem[] // Paket içindeki alt işlemler
}
export function MakeSaleModal({ open, onClose, customer, onSave, initialProduct }: MakeSaleModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])
  const [saleMode, setSaleMode] = useState<SaleMode>(null)
  const [step, setStep] = useState<'cart' | 'payment' | 'success' | 'summary'>('cart')
  const [paymentMethod, setPaymentMethod] = useState<'Nakit' | 'Kredi Kartı' | 'Havale'>('Kredi Kartı')
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentType, setPaymentType] = useState<'pesin' | 'taksitli' | 'acik_hesap'>('pesin')
  const [installmentCount, setInstallmentCount] = useState<number>(3)
  const [selectedPersonnel, setSelectedPersonnel] = useState<string>("")
  const [saleNote, setSaleNote] = useState<string>('')
  
  // Search States
  const [productSearch, setProductSearch] = useState("")
  // Custom Package Builder State
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [builderItems, setBuilderItems] = useState<BuilderItem[]>([])
  const hasCustomPackage = cart.some(item => item.type === 'custom_package')
  // Renderers
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
  }, [productSearch])
  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      if (initialProduct) {
        setSaleMode('product')
        setCart([{
          uniqueId: Math.random().toString(),
          id: initialProduct.id,
          name: initialProduct.name,
          price: initialProduct.price,
          originalPrice: initialProduct.price,
          quantity: 1,
          type: 'product'
        }])
      } else {
        setSaleMode(null)
        setCart([])
      }
      setProductSearch("")
      setExpandedCategory(null)
      setBuilderItems([])
      setStep('cart')
      setPaymentMethod('Kredi Kartı')
    }
  }, [open, initialProduct])
  // Handle switching primary mode (clears cart and builder)
  const handleModeSwitch = (mode: SaleMode) => {
    setSaleMode(mode)
    setCart([])
    setExpandedCategory(null)
    setBuilderItems([])
    setStep('cart')
  }
  if (!open || !customer) return null
  // ---- CART LOGIC ----
  const addToCart = (item: Omit<CartItem, 'uniqueId'>) => {
    if (item.type === 'product') {
      const existing = cart.find(c => c.id === item.id && c.type === 'product')
      if (existing) {
        setCart(cart.map(c => c.uniqueId === existing.uniqueId ? { ...c, quantity: c.quantity + item.quantity } : c))
        return
      }
    }
    setCart([...cart, { ...item, uniqueId: Math.random().toString(36).substr(2, 9) }])
  }
  const updateQuantity = (uniqueId: string, delta: number) => {
    setCart(cart.map(c => {
      if (c.uniqueId === uniqueId && c.type === 'product') {
        const newQ = c.quantity + delta
        return newQ > 0 ? { ...c, quantity: newQ } : c
      }
      return c
    }))
  }
  const updateCartItemPrice = (uniqueId: string, newPrice: number) => {
    setCart(cart.map(c => c.uniqueId === uniqueId ? { ...c, price: newPrice } : c))
  }
  const removeFromCart = (uniqueId: string) => {
    setCart(cart.filter(c => c.uniqueId !== uniqueId))
  }
  const rawTotal = cart.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0)
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  const inlineDiscountTotal = rawTotal - subTotal
  const discountAmount = 0
  const finalTotal = subTotal - discountAmount
  // ---- BUILDER LOGIC ----
  const addToBuilder = (srv: ServiceItem) => {
    // Aynı işlemi bir kez daha eklemeyi engelle
    if (builderItems.some(item => item.id === srv.id)) return;
    setBuilderItems([...builderItems, {
      id: srv.id,
      uniqueId: Math.random().toString(36).substr(2, 9),
      name: srv.name,
      originalPrice: srv.price,
      currentPrice: srv.price,
      sessionCount: 1,
      controlCount: 0
    }])
  }
  const updateBuilderItem = (uniqueId: string, field: keyof BuilderItem, value: number) => {
    setBuilderItems(builderItems.map(item => 
      item.uniqueId === uniqueId ? { ...item, [field]: value } : item
    ))
  }
  const removeBuilderItem = (uniqueId: string) => {
    setBuilderItems(builderItems.filter(item => item.uniqueId !== uniqueId))
  }
  const definePackageAndAddToCart = () => {
    if (builderItems.length === 0) return
    const totalOriginalPrice = builderItems.reduce((sum, item) => sum + item.originalPrice, 0)
    const totalCurrentPrice = builderItems.reduce((sum, item) => sum + item.currentPrice, 0)
    addToCart({
      id: `custom_pkg_${Math.random()}`,
      name: `Özel Paket (${builderItems.length} İşlem)`,
      originalPrice: totalOriginalPrice,
      price: totalCurrentPrice,
      quantity: 1,
      type: 'custom_package',
      builderItems: [...builderItems]
    })
    
    // Sepete attıktan sonra builder'ı temizle
    setBuilderItems([])
    setStep('cart')
  }
  const editCustomPackage = (uniqueId: string) => {
    const pkg = cart.find(c => c.uniqueId === uniqueId)
    if (pkg && pkg.builderItems) {
      setBuilderItems([...pkg.builderItems])
      removeFromCart(uniqueId)
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="flex flex-col bg-background w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden border border-border">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-4">
            {saleMode && (
              <button 
                onClick={() => step === 'payment' ? setStep('cart') : handleModeSwitch(null)}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mr-2 p-1.5 rounded-lg hover:bg-muted"
              >
                <ArrowLeft className="size-4" />
                <span>Geri</span>
              </button>
            )}
            <div>
              <h2 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2">
                <ShoppingBag className="size-5 text-primary" />
                Satış Yap: <span className="text-primary">{customer.firstName} {customer.lastName}</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Müşteriye ürün, kampanya veya özel paket satışı gerçekleştirin.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors">
            <X className="size-5" />
          </button>
        </div>
        {/* BODY */}
        {step === 'success' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300 overflow-y-auto">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="size-10" />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-2">Satış Tamamlandı!</h2>
            <p className="text-muted-foreground mb-8 max-w-md">Ödeme ve satış işlemleri başarıyla sisteme kaydedildi. Müşteri için özet makbuzunu yazdırabilir veya indirebilirsiniz.</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setStep('summary')}
                className="py-3 px-6 rounded-xl font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-2"
              >
                Satış / Ödeme Özetini Göster
              </button>
              <button 
                onClick={() => {
                  onClose();
                  setStep('cart');
                  setCart([]);
                  setSaleMode(null);
                }}
                className="py-3 px-6 rounded-xl font-bold text-white bg-foreground hover:bg-black transition-colors"
              >
                Pencereyi Kapat
              </button>
            </div>
          </div>
        ) : step === 'summary' ? (
          <SaleSummaryModal
            isOpen={true}
            onClose={onClose}
            onBack={() => setStep('success')}
            customer={customer}
            cart={cart}
            selectedPersonnel={selectedPersonnel}
            paymentType={paymentType}
            paymentMethod={paymentMethod}
            installmentCount={installmentCount}
            saleNote={saleNote}
            rawTotal={rawTotal}
            inlineDiscountTotal={inlineDiscountTotal}
            subTotal={subTotal}
            discountAmount={discountAmount}
            finalTotal={finalTotal}
          />
        ) : step === 'payment' ? (
          <div className="flex-1 bg-muted/10 p-6 sm:p-8 overflow-y-auto">
            <div className="w-full max-w-2xl mx-auto bg-card border border-border shadow-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-6 border-b border-border pb-4 flex items-center gap-3">
                <CheckCircle2 className="size-6 text-emerald-500" />
                Ödeme Detayları
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Satışı Yapan Personel</label>
                  <CustomSelect
                    value={selectedPersonnel}
                    onChange={(val) => setSelectedPersonnel(String(val))}
                    options={[
                      { value: "", label: "Lütfen personel seçiniz..." },
                      ...mockUsers.map(u => ({ value: u.id, label: u.fullName }))
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Ödeme Türü</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => setPaymentType('pesin')}
                      className={`py-2 rounded-lg border text-sm font-semibold transition-all ${paymentType === 'pesin' ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-card border-border text-muted-foreground hover:bg-muted'}`}
                    >
                      Peşin
                    </button>
                    <button 
                      onClick={() => setPaymentType('taksitli')}
                      className={`py-2 rounded-lg border text-sm font-semibold transition-all ${paymentType === 'taksitli' ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-card border-border text-muted-foreground hover:bg-muted'}`}
                    >
                      Taksitli
                    </button>
                    <button 
                      onClick={() => setPaymentType('acik_hesap')}
                      className={`py-2 rounded-lg border text-sm font-semibold transition-all ${paymentType === 'acik_hesap' ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-card border-border text-muted-foreground hover:bg-muted'}`}
                    >
                      Açık Hesap
                    </button>
                  </div>
                </div>

                {paymentType === 'taksitli' && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Taksit Sayısı</label>
                    <CustomSelect
                      value={installmentCount.toString()}
                      onChange={(val) => setInstallmentCount(parseInt(val as string))}
                      options={[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(t => ({
                        value: t.toString(),
                        label: `${t} Taksit`
                      }))}
                    />
                  </div>
                )}

                {paymentType === 'pesin' && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Ödeme Yöntemi</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Nakit', 'Kredi Kartı', 'Havale'].map(m => (
                        <button
                          key={m}
                          onClick={() => setPaymentMethod(m as any)}
                          className={`py-2 rounded-lg border text-sm font-semibold transition-all ${paymentMethod === m ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-card border-border text-muted-foreground hover:bg-muted'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Satış Notu (Opsiyonel)</label>
                  <textarea
                    value={saleNote}
                    onChange={(e) => setSaleNote(e.target.value)}
                    rows={2}
                    placeholder="Bu satışla ilgili eklemek istediğiniz notlar..."
                    className="w-full bg-white border border-input rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary resize-none"
                  />
                </div>

                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Ödenecek Tutar</span>
                  <span className="text-3xl font-black text-foreground">{finalTotal.toFixed(2)} ₺</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 pt-6 border-t border-border">
                <button 
                  onClick={() => { 
                    const newSales = cart.map(item => ({
                      id: `sl${Date.now()}${Math.random().toString().slice(2,5)}`,
                      customerId: customer?.id || "unknown",
                      personnelId: selectedPersonnel,
                      date: new Date().toISOString(),
                      productName: item.name,
                      quantity: item.quantity,
                      totalPrice: item.price * item.quantity,
                    }));
                    onSave(newSales);
                    setStep('success'); 
                  }}
                  disabled={!selectedPersonnel}
                  className={`flex-[2] py-3 rounded-xl font-bold text-white transition-colors shadow-md flex items-center justify-center gap-2 ${!selectedPersonnel ? 'bg-slate-300 opacity-50 cursor-not-allowed shadow-none' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                >
                  <Check className="size-5" />
                  Ödemeyi Tamamla
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 min-h-0 overflow-hidden flex-col lg:flex-row">

          
          {!saleMode ? (
            /* İLK EKRAN - 3 BÜYÜK SEÇENEK */
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center p-6 gap-6 bg-slate-50/50">
              <button 
                onClick={() => handleModeSwitch("product")}
                className="flex flex-col items-center justify-center w-full max-w-sm aspect-[4/3] rounded-3xl border-2 border-transparent bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500/20 transition-all group"
              >
                <div className="size-20 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="size-10" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">Ürün Satışı</h3>
                <p className="text-xs text-muted-foreground text-center px-6">
                  Fiziksel ürün (krem, losyon vb.) satışı.
                </p>
              </button>
              <button 
                onClick={() => handleModeSwitch("campaign")}
                className="flex flex-col items-center justify-center w-full max-w-sm aspect-[4/3] rounded-3xl border-2 border-transparent bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/20 transition-all group"
              >
                <div className="size-20 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Package className="size-10" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">Hazır Kampanya</h3>
                <p className="text-xs text-muted-foreground text-center px-6">
                  Sistemdeki tanımlı hazır kampanya paketleri.
                </p>
              </button>
              <button 
                onClick={() => handleModeSwitch("custom")}
                className="flex flex-col items-center justify-center w-full max-w-sm aspect-[4/3] rounded-3xl border-2 border-transparent bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-purple-500/20 transition-all group"
              >
                <div className="size-20 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Scissors className="size-10" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">Özel Paket Tanımla</h3>
                <p className="text-xs text-muted-foreground text-center px-6">
                  Müşteriye özel fiyatlandırılan çoklu işlem paketleri.
                </p>
              </button>
            </div>
          ) : (
            /* SATIŞ EKRANI */
            <>
              {/* LEFT: Selection/Builder Area */}
              <div className="flex-[3] flex min-h-0 border-r border-border bg-background animate-in slide-in-from-left-4 fade-in duration-300 overflow-hidden">
                
                {/* 1. PRODUCT SALE */}
                {saleMode === "product" && (
                  <div className="flex flex-col w-full overflow-y-auto p-4 sm:p-6 bg-slate-50/30">
                    <div className="relative mb-5">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Ürün ara..." 
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-white border border-input rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProducts.map(p => {
                        const cartQuantity = cart.find(c => c.id === p.id && c.type === 'product')?.quantity || 0
                        const availableStock = p.stock - cartQuantity
                        return (
                          <div key={p.id} className="flex flex-col p-3 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all shadow-sm group">
                            <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-3 relative">
                              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                              {availableStock <= 0 && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-widest">TÜKENDİ</span>
                                </div>
                              )}
                            </div>
                            <h4 className="font-semibold text-sm text-foreground line-clamp-2 min-h-[40px] leading-tight" title={p.name}>{p.name}</h4>
                            <span className="text-xs text-muted-foreground mt-1 mb-2">{availableStock} Stok Kaldı</span>
                            
                            <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                              <span className="font-bold text-primary text-sm">{p.price} ₺</span>
                              <button 
                                onClick={() => {
                                  if (availableStock > 0) addToCart({ id: p.id, name: p.name, price: p.price, originalPrice: p.price, quantity: 1, type: 'product' })
                                }}
                                disabled={availableStock === 0}
                                className={`p-2 rounded-lg transition-colors ${cartQuantity > 0 ? 'bg-primary text-white shadow-md hover:bg-primary/90' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'} disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {cartQuantity > 0 ? <Plus className="size-4" /> : <ShoppingBag className="size-4" />}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                {/* 2. CAMPAIGN SALE */}
                {saleMode === "campaign" && (
                  <div className="flex flex-col w-full overflow-y-auto p-4 sm:p-6 bg-slate-50/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {campaignPackages.map(pkg => (
                        <div key={pkg.id} className="flex flex-col p-4 rounded-xl border border-emerald-500/20 bg-white hover:border-emerald-500/50 transition-all shadow-sm group">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h4 className="font-bold text-foreground text-sm group-hover:text-emerald-700 transition-colors">{pkg.name}</h4>
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">KAMPANYA</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{pkg.description}</p>
                          
                          <div className="mt-auto">
                            <ul className="flex flex-col gap-1 mb-4">
                              {pkg.services.map((s, i) => (
                                <li key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                                  <span className="size-1 rounded-full bg-emerald-400 shrink-0" />
                                  {s.sessionCount} Seans {s.name}
                                </li>
                              ))}
                            </ul>
                            <div className="pt-3 border-t border-emerald-500/10 flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground line-through">{pkg.originalPrice} ₺</span>
                                <span className="font-bold text-lg text-emerald-600">{pkg.price} ₺</span>
                              </div>
                              <button 
                                onClick={() => addToCart({ id: pkg.id, name: pkg.name, price: pkg.price, originalPrice: pkg.originalPrice, quantity: 1, type: 'campaign', builderItems: pkg.services.map(s => ({ ...s, uniqueId: Math.random().toString() })) })}
                                className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-700 text-xs font-medium hover:bg-emerald-500 hover:text-white transition-colors"
                              >
                                Sepete Ekle
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* 3. CUSTOM PACKAGE SALE */}
                {saleMode === "custom" && (
                  <div className="flex w-full overflow-hidden">
                    {hasCustomPackage ? (
                      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 p-6 text-center animate-in fade-in zoom-in-95 duration-300">
                        <div className="size-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 mb-4">
                          <Check className="size-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Paketiniz Sepette!</h3>
                        <p className="text-sm text-slate-500 max-w-sm mx-auto">
                          Her seferinde yalnızca 1 adet özel paket tanımlayabilirsiniz. Yeni bir paket oluşturmak için lütfen sağ taraftaki sepetinizden mevcut paketi silin.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Categories Accordion */}
                        <div className="w-1/3 border-r border-border overflow-y-auto bg-slate-50/50 p-3">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Kategoriler</h3>
                      <div className="flex flex-col gap-2">
                        {serviceCategories.map(cat => (
                          <div key={cat.id} className="flex flex-col border border-border rounded-xl bg-white overflow-hidden shadow-sm">
                            <button 
                              onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                              className="flex items-center justify-between px-3 py-3 text-sm font-semibold hover:bg-muted/50 transition-colors"
                            >
                              <span>{cat.name}</span>
                              {expandedCategory === cat.id ? <ChevronDown className="size-4 text-slate-400" /> : <ChevronRight className="size-4 text-slate-400" />}
                            </button>
                            
                            {expandedCategory === cat.id && (
                              <div className="flex flex-col divide-y divide-border/50 border-t border-border bg-slate-50/30">
                                {cat.services.map(srv => {
                                  const isAdded = builderItems.some(item => item.id === srv.id)
                                  return (
                                    <button 
                                      key={srv.id} 
                                      onClick={() => addToBuilder(srv)}
                                      disabled={isAdded}
                                      className={`flex items-center justify-between p-3 text-sm text-left transition-colors group ${isAdded ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'hover:bg-purple-50'}`}
                                    >
                                      <span className={`transition-colors ${isAdded ? 'text-slate-400' : 'text-slate-600 group-hover:text-purple-700'}`}>{srv.name}</span>
                                      <div className="flex items-center gap-3">
                                        <span className={`text-xs font-semibold transition-colors ${isAdded ? 'text-slate-400' : 'text-muted-foreground group-hover:text-purple-600'}`}>{srv.price} ₺</span>
                                        {isAdded ? (
                                          <Check className="size-4 text-emerald-500" />
                                        ) : (
                                          <Plus className="size-4 text-slate-300 group-hover:text-purple-500 transition-colors" />
                                        )}
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Builder Panel */}
                    <div className="w-2/3 flex flex-col bg-white overflow-hidden">
                      <div className="p-4 border-b border-border bg-purple-50/30 shrink-0">
                        <h3 className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                          <Scissors className="size-4" /> Paket Oluşturucu
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Sol taraftan işlemleri seçip paketinize ekleyin.</p>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                        {builderItems.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                            <Scissors className="size-12 mb-3 opacity-20" />
                            <p className="text-sm">Paketinizde henüz işlem yok.</p>
                          </div>
                        ) : (
                          builderItems.map(item => (
                            <div key={item.uniqueId} className="flex flex-col border border-border rounded-lg p-2 bg-white shadow-sm animate-in zoom-in-95 duration-200">
                              <div className="flex justify-between items-center border-b border-border/50 pb-1.5 mb-2">
                                <span className="font-semibold text-foreground text-xs truncate mr-2" title={item.name}>{item.name}</span>
                                <button onClick={() => removeBuilderItem(item.uniqueId)} className="p-1 text-slate-400 hover:text-destructive rounded transition-colors shrink-0">
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <label className="flex flex-col gap-0.5">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase">Seans</span>
                                  <input 
                                    type="number" min="1" 
                                    value={item.sessionCount} 
                                    onChange={(e) => updateBuilderItem(item.uniqueId, 'sessionCount', parseInt(e.target.value) || 1)}
                                    className="bg-slate-50 border border-input rounded-md px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-center font-medium"
                                  />
                                </label>
                                <label className="flex flex-col gap-0.5">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase">Kontrol</span>
                                  <input 
                                    type="number" min="0" 
                                    value={item.controlCount} 
                                    onChange={(e) => updateBuilderItem(item.uniqueId, 'controlCount', parseInt(e.target.value) || 0)}
                                    className="bg-slate-50 border border-input rounded-md px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-center font-medium"
                                  />
                                </label>
                                <label className="flex flex-col gap-0.5">
                                  <span className="text-[9px] font-bold text-purple-600 uppercase">Fiyat (₺)</span>
                                  <input 
                                    type="number" min="0" 
                                    value={item.currentPrice} 
                                    onChange={(e) => updateBuilderItem(item.uniqueId, 'currentPrice', parseInt(e.target.value) || 0)}
                                    className="bg-purple-50 border border-purple-200 text-purple-700 rounded-md px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-center font-bold"
                                  />
                                </label>
                              </div>
                              
                              {item.originalPrice !== item.currentPrice && (
                                <div className="mt-1.5 text-[9px] text-right text-muted-foreground">
                                  İlk Fiyat: <span className="line-through">{item.originalPrice} ₺</span>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      
                      {builderItems.length > 0 && (
                        <div className="p-4 border-t border-border bg-white shrink-0">
                          <button 
                            onClick={definePackageAndAddToCart}
                            className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:bg-purple-700 transition-colors"
                          >
                            <ShoppingCart className="size-5" />
                            Paketi Tanımla ve Sepete At
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                </div>
              )}
            </div>
              {/* RIGHT: Cart / Checkout Area */}
              <div className="flex-[1.5] flex flex-col min-h-0 bg-slate-100 border-l border-border/50">
                <div className="p-4 border-b border-border bg-white shrink-0 shadow-sm z-10">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <ShoppingCartIcon className="size-4 text-slate-500" />
                    Sepetiniz
                  </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                      <ShoppingBag className="size-12 mb-3 opacity-20" />
                      <p className="text-sm">Sepetiniz boş.</p>
                      <p className="text-xs mt-1 text-center max-w-[200px]">İşlemleri tamamlayıp sepete atın.</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.uniqueId} className="flex flex-col bg-white border border-border rounded-xl p-3 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start gap-2 border-b border-border/50 pb-2 mb-2">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-foreground leading-tight">{item.name}</span>
                            
                            {item.type === 'product' && <span className="text-[10px] text-indigo-500 uppercase font-bold tracking-wider mt-1">Ürün</span>}
                            {item.type === 'campaign' && <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider mt-1">Hazır Kampanya</span>}
                            {item.type === 'custom_package' && <span className="text-[10px] text-purple-600 uppercase font-bold tracking-wider mt-1">Özel Paket</span>}
                          </div>
                          <div className="flex items-center gap-1">
                            {item.type === 'custom_package' && (
                              <button onClick={() => editCustomPackage(item.uniqueId)} className="px-2 py-1 text-xs font-semibold text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-colors rounded">
                                Düzenle
                              </button>
                            )}
                            <button onClick={() => removeFromCart(item.uniqueId)} className="p-1 text-slate-400 hover:text-destructive transition-colors rounded">
                              <X className="size-3.5" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Paket İçeriği (custom_package ve campaign ise görünür) */}
                        {(item.type === 'custom_package' || item.type === 'campaign') && item.builderItems && (
                          <div className={`flex flex-col gap-0 mb-2 px-2 py-1 rounded-lg border ${item.type === 'campaign' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                            {item.builderItems.map(bItem => (
                              <div key={bItem.id} className={`flex items-center justify-between text-[10px] border-b last:border-0 py-1.5 ${item.type === 'campaign' ? 'border-emerald-100/60' : 'border-slate-200/60'}`}>
                                <span className="text-slate-700 font-semibold truncate flex-1 pr-2" title={bItem.name}>{bItem.name}</span>
                                
                                <div className="flex items-center gap-3 shrink-0">
                                  <div className="flex gap-1.5 w-12 justify-end">
                                    <span className={`font-bold ${item.type === 'campaign' ? 'text-emerald-700' : 'text-purple-700'}`}>{bItem.sessionCount}S</span>
                                    {bItem.controlCount > 0 && <span className="font-bold text-slate-500">{bItem.controlCount}K</span>}
                                  </div>
                                  <div className="flex items-center justify-end gap-1.5 w-24">
                                    {bItem.originalPrice !== bItem.currentPrice ? (
                                      <>
                                        <span className="text-muted-foreground line-through">{bItem.originalPrice}₺</span>
                                        <span className="font-bold text-emerald-600">{bItem.currentPrice}₺</span>
                                      </>
                                    ) : (
                                      <span className="font-bold text-slate-600">{bItem.currentPrice}₺</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-1">
                          {item.type === 'product' ? (
                            <div className="flex flex-col gap-2 mt-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                                  <button onClick={() => updateQuantity(item.uniqueId, -1)} className="p-1 text-slate-500 hover:text-primary transition-colors"><Minus className="size-3" /></button>
                                  <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.uniqueId, 1)} className="p-1 text-slate-500 hover:text-primary transition-colors"><Plus className="size-3" /></button>
                                </div>
                                
                                <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-lg px-2 py-1">
                                  <span className="text-[9px] font-bold text-indigo-400 uppercase">Birim Fiyat</span>
                                  <input 
                                    type="number" min="0" 
                                    value={item.price} 
                                    onChange={(e) => updateCartItemPrice(item.uniqueId, parseInt(e.target.value) || 0)}
                                    className="w-16 bg-white border border-indigo-200 rounded px-1.5 py-0.5 text-xs text-right font-bold text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                                {item.originalPrice !== item.price ? (
                                  <span className="text-[10px] font-semibold text-emerald-600">{(item.originalPrice * item.quantity) - (item.price * item.quantity)} ₺ İndirim</span>
                                ) : (
                                  <span />
                                )}
                                <div className="font-black text-foreground text-sm flex items-center gap-2">
                                  {item.originalPrice !== item.price && (
                                    <span className="text-[10px] text-muted-foreground line-through font-normal">İlk: {item.originalPrice * item.quantity} ₺</span>
                                  )}
                                  {item.price * item.quantity} ₺
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex flex-col">
                                {item.originalPrice !== item.price && (
                                  <span className="text-[10px] text-muted-foreground line-through">İlk: {item.originalPrice} ₺</span>
                                )}
                                <span className="text-[10px] font-semibold text-emerald-600">İndirimli (Manuel)</span>
                                {item.type === 'custom_package' && <span className="text-[10px] font-semibold text-emerald-600">İndirim: {item.originalPrice - item.price} ₺</span>}
                              </div>
                              <div className="font-black text-foreground text-sm">
                                {item.price} ₺
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* Checkout Footer */}
                <div className="p-3 bg-white border-t border-border shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] z-10 shrink-0">
                  
                  <div className="space-y-1 mb-3 px-1">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Ara Toplam:</span>
                      <span>{subTotal} ₺</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-foreground pt-1.5 mt-1.5 border-t border-slate-100">
                      <span>Genel Toplam:</span>
                      <span>{finalTotal.toFixed(2)} ₺</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep('payment')}
                    disabled={cart.length === 0}
                    className={`w-full py-2.5 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${cart.length === 0 ? 'bg-slate-300 opacity-50 cursor-not-allowed shadow-none' : saleMode === 'product' ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                  >
                    Ödemeye Geç
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </>
          )}
          
                </div>
        )}
      </div>
    </div>
  )
}
function ShoppingCartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}