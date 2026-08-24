"use client"

import { useState, useMemo, ReactNode, useEffect, useRef } from "react"
import { BarChart3, TrendingUp, TrendingDown, Wallet, CalendarDays, Users, FileText, Banknote, UserX, PackageOpen, Printer, ChevronDown, Check, ShoppingBag, PieChart, Ban } from "lucide-react"
import { CustomSelect } from "./ui/custom-select"
import { cn } from "@/lib/utils"
import { type Appointment, type Customer, type Product, type User, mockCustomerSales, mockCustomerPayments } from "@/lib/demo-data"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Expense } from "@/components/add-expense-modal"
import { PrintPreviewModal } from "./print-preview-modal"

type ReportsPanelProps = {
  appointments: Appointment[]
  expenses: Expense[]
  customers: Customer[]
  products: Product[]
  users: User[]
  setHeaderContent: (content: ReactNode) => void
}

type ReportTab = "gelir" | "gider" | "hizmet" | "urun_satis" | "personel" | "odeme_raporlari" | "gelmeyen"

export function ReportsPanel({ appointments, expenses, customers, products, users, setHeaderContent }: ReportsPanelProps) {
  const [activeTab, setActiveTab] = useState<ReportTab>("gelir")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  
  // Varsayılan olarak bugünü seçelim
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    return d.toISOString().split("T")[0]
  })
  
  const [endDate, setEndDate] = useState(() => {
    const d = new Date()
    return d.toISOString().split("T")[0]
  })

  const [selectedSalesPersonnel, setSelectedSalesPersonnel] = useState<string>("all")
  
  const [incomeReportMode, setIncomeReportMode] = useState<"date_range" | "yearly_chart">("date_range")
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())

  const [urunSatisReportType, setUrunSatisReportType] = useState<"satis" | "iptal" | "stok">("satis")
  const [odemeReportType, setOdemeReportType] = useState<"borc" | "iptal">("borc")

  const [expenseReportMode, setExpenseReportMode] = useState<"date_range" | "yearly_chart">("date_range")
  const [selectedExpenseYear, setSelectedExpenseYear] = useState<string>(new Date().getFullYear().toString())

  const [selectedPersonel, setSelectedPersonel] = useState<string>("")
  const [personelReportType, setPersonelReportType] = useState<"urun_hizmet" | "hizmet" | "yillik_grafik" | "">("")
  const [personelSelectedYear, setPersonelSelectedYear] = useState<string>(new Date().getFullYear().toString())

  // Tarih aralığında mı kontrolü
  const isDateInRange = (dateStr: string) => {
    if (!startDate && !endDate) return true
    const d = new Date(dateStr)
    d.setHours(0, 0, 0, 0)
    
    const s = startDate ? new Date(startDate) : new Date(0)
    s.setHours(0, 0, 0, 0)
    
    const e = endDate ? new Date(endDate) : new Date("9999-12-31")
    e.setHours(23, 59, 59, 999)
    
    return d >= s && d <= e
  }

  // Verileri tarihe göre filtrele
  const filteredAppointments = useMemo(() => 
    appointments.filter(a => a.status === "geldi" && isDateInRange(a.date)).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [appointments, startDate, endDate])

  const filteredExpenses = useMemo(() => 
    expenses.filter(e => isDateInRange(e.date)).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [expenses, startDate, endDate])

  // Toplam Gelir ve Gider
  const totalIncome = filteredAppointments.reduce((s, a) => s + a.price, 0)
  const totalExpense = filteredExpenses.reduce((s, e) => s + e.amount, 0)

  // Hizmete Göre Gelir
  const byService = new Map<string, number>()
  for (const a of filteredAppointments) {
    byService.set(a.service, (byService.get(a.service) ?? 0) + a.price)
  }
  const serviceRows = [...byService.entries()].sort((a, b) => b[1] - a[1])
  const maxService = serviceRows.length ? serviceRows[0][1] : 1

  // Borcu Olan Müşteriler (Tarihten Bağımsız)
  const customersWithDebt = useMemo(() => 
    customers.filter(c => c.debt && c.debt > 0).sort((a, b) => (b.debt || 0) - (a.debt || 0)),
  [customers])
  const totalDebt = customersWithDebt.reduce((s, c) => s + (c.debt || 0), 0)

  // Uzun Süredir Gelmeyenler (Tarihten Bağımsız)
  const noShowCustomers = useMemo(() => {
    const canceledAppts = appointments.filter(a => a.status === "iptal")
    const uniqueIds = Array.from(new Set(canceledAppts.map(a => a.customerId)))
    return customers.filter(c => uniqueIds.includes(c.id)).map(c => {
      const appts = canceledAppts.filter(a => a.customerId === c.id)
      return { ...c, missedCount: appts.length, lastMissedDate: appts[0]?.date }
    })
  }, [appointments, customers])

  // Stok Durumu Raporu (Satışa Kapalı en altta, Kritik üstte, Yeterli ortada)
  const stockProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      // Satışa kapalı (stock === 0) en altta:
      if (a.stock === 0 && b.stock !== 0) return 1;
      if (b.stock === 0 && a.stock !== 0) return -1;

      // Kritik stok (0 < stock < 10) üstte:
      const aCritical = a.stock > 0 && a.stock < 10;
      const bCritical = b.stock > 0 && b.stock < 10;
      if (aCritical && !bCritical) return -1;
      if (bCritical && !aCritical) return 1;

      // Kendi aralarında stok sayısına göre sırala (azdan çoğa)
      return a.stock - b.stock;
    })
  }, [products])

  // Ürün Satış Bilgileri (İptal edilmemiş olanlar)
  const productSales = useMemo(() => {
    return products.map(p => {
      const salesForProduct = mockCustomerSales.filter(s => {
        if (s.isCancelled) return false;
        // Ürün adı eşleşmesi
        const productMatch = s.productName.toLowerCase().includes(p.name.toLowerCase()) || 
          p.name.toLowerCase().includes(s.productName.toLowerCase())
        if (!productMatch) return false;

        // Tarih filtresi
        if (!isDateInRange(s.date)) return false;

        return true;
      })

      const quantity = salesForProduct.reduce((sum, s) => sum + s.quantity, 0)
      const revenue = salesForProduct.reduce((sum, s) => sum + s.totalPrice, 0)

      return { product: p, quantity, revenue }
    }).filter(item => item.quantity > 0)
      .sort((a, b) => b.revenue - a.revenue)
  }, [products, startDate, endDate])

  // İptal Edilen Satışlar (İptal edilmiş olanlar)
  const cancelledSalesList = useMemo(() => {
    return mockCustomerSales.filter(s => s.isCancelled && isDateInRange(s.date)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [startDate, endDate]);

  // İptal Edilen Ödemeler
  const cancelledPaymentsList = useMemo(() => {
    return mockCustomerPayments.filter(p => p.isCancelled && isDateInRange(p.cancelDate || p.date)).sort((a, b) => new Date(b.cancelDate || b.date).getTime() - new Date(a.cancelDate || a.date).getTime());
  }, [startDate, endDate]);

  const yearlyChartData = useMemo(() => {
    if (activeTab !== "gelir" || incomeReportMode !== "yearly_chart") return []
    
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
    const data = months.map(m => ({ name: m, hizmet: 0, urun: 0 }))
    
    appointments.forEach(a => {
      if (a.status !== "geldi") return
      const d = new Date(a.date)
      if (d.getFullYear().toString() === selectedYear) {
        data[d.getMonth()].hizmet += a.price
      }
    })
    
    mockCustomerSales.forEach(s => {
      const d = new Date(s.date)
      if (d.getFullYear().toString() === selectedYear) {
        data[d.getMonth()].urun += s.totalPrice
      }
    })
    
    return data
  }, [appointments, selectedYear, activeTab, incomeReportMode])

  const yearlyExpenseChartData = useMemo(() => {
    if (activeTab !== "gider" || expenseReportMode !== "yearly_chart") return []
    
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
    const data = months.map(m => ({ name: m, gider: 0 }))
    
    expenses.forEach(e => {
      const d = new Date(e.date)
      if (d.getFullYear().toString() === selectedExpenseYear) {
        data[d.getMonth()].gider += e.amount
      }
    })
    
    return data
  }, [expenses, selectedExpenseYear, activeTab, expenseReportMode])

  // Personel Raporları Hesaplamaları
  const personelSales = useMemo(() => {
    if (activeTab !== "personel") return []
    return mockCustomerSales.filter(s => {
      if (selectedPersonel !== "all" && s.personnelId !== selectedPersonel) return false
      if (!isDateInRange(s.date)) return false
      return true
    })
  }, [selectedPersonel, startDate, endDate, activeTab])

  const personelAppointments = useMemo(() => {
    if (activeTab !== "personel") return []
    return appointments.filter(a => {
      if (selectedPersonel !== "all" && a.personnelId !== selectedPersonel) return false
      if (!isDateInRange(a.date)) return false
      // Only count actual performed services for "İşlem"
      return a.status === "geldi" 
    })
  }, [appointments, selectedPersonel, startDate, endDate, activeTab])

  const personelYearlyData = useMemo(() => {
    if (activeTab !== "personel" || personelReportType !== "yillik_grafik") return []
    
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
    const data = months.map(m => ({ name: m, urunSatis: 0, hizmetSatis: 0, islemHizmet: 0 }))
    
    mockCustomerSales.forEach(s => {
      if (selectedPersonel !== "all" && s.personnelId !== selectedPersonel) return
      const d = new Date(s.date)
      if (d.getFullYear().toString() === personelSelectedYear) {
        if (s.totalSessions) {
          data[d.getMonth()].hizmetSatis += s.quantity
        } else {
          data[d.getMonth()].urunSatis += s.quantity
        }
      }
    })

    appointments.forEach(a => {
      if (selectedPersonel !== "all" && a.personnelId !== selectedPersonel) return
      if (a.status !== "geldi") return
      const d = new Date(a.date)
      if (d.getFullYear().toString() === personelSelectedYear) {
        data[d.getMonth()].islemHizmet += 1
      }
    })

    return data
  }, [appointments, selectedPersonel, personelSelectedYear, activeTab, personelReportType])

  useEffect(() => {
    setHeaderContent(
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 shadow-sm">
          <FileText className="size-7" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">Raporlar ve Analizler</h2>
          <p className="text-xs text-muted-foreground mt-0.5 mb-2.5">Gelir, Gider Ve Müşteri İstatistikleri.</p>
        </div>
      </div>
    )
    return () => setHeaderContent(null)
  }, [setHeaderContent])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])



  const reportTitles: Record<ReportTab, string> = {
    gelir: "Gelir Raporu",
    gider: "Gider Raporu",
    hizmet: "Hizmet Raporu",
    urun_satis: "Ürün Raporları",
    personel: "Personel Raporları",
    odeme_raporlari: "Ödeme Raporları",
    gelmeyen: "Uzun Süredir Gelmeyenler"
  }

  const reportIcons: Record<ReportTab, ReactNode> = {
    gelir: <TrendingUp className="size-4" />,
    gider: <TrendingDown className="size-4" />,
    hizmet: <BarChart3 className="size-4" />,
    urun_satis: <ShoppingBag className="size-4" />,
    personel: <Users className="size-4" />,
    odeme_raporlari: <Banknote className="size-4" />,
    gelmeyen: <UserX className="size-4" />
  }

  // Active Tab Content Renderers
  const renderGelirContent = () => {
    if (incomeReportMode === "yearly_chart") {
      return (
        <div className="flex flex-col gap-4 pr-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm overflow-hidden h-[500px]">
            <h3 className="font-semibold text-lg text-foreground mb-4">{selectedYear} Yılı Gelir Grafiği</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyChartData} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₺${val}`} />
                <Tooltip 
                  formatter={(value: any, name: any) => [`₺${Number(value).toLocaleString('tr-TR')}`, name]}
                  contentStyle={{ borderRadius: '16px', border: '1px solid hsl(var(--primary) / 0.2)', backgroundColor: 'hsl(var(--primary) / 0.05)', backdropFilter: 'blur(8px)', color: 'hsl(var(--foreground))', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  itemStyle={{ padding: '2px 0', margin: 0, fontSize: '12px', fontWeight: 500 }}
                  labelStyle={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px', color: 'hsl(var(--foreground))' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="hizmet" name="Hizmet Geliri" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="urun" name="Ürün Satış Geliri" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4 pr-2">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 shadow-sm print:hidden">
              <TrendingUp className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-800/70 dark:text-emerald-400/70">Toplam Gelir (Seçili Tarihler)</p>
              <p className="font-serif text-3xl font-bold text-emerald-700 dark:text-emerald-400">₺{totalIncome.toLocaleString("tr-TR")}</p>
            </div>
          </div>
          <div className="text-right text-xs text-emerald-700/80 font-medium bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 shadow-sm">
            Toplam {filteredAppointments.length} İşlem
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3.5 font-medium">Tarih</th>
                  <th className="px-5 py-3.5 font-medium">Müşteri</th>
                  <th className="px-5 py-3.5 font-medium">İşlem</th>
                  <th className="px-5 py-3.5 font-medium text-right">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAppointments.length === 0 ? (
                  <tr><td colSpan={4} className="py-12 text-center text-muted-foreground">Bu tarih aralığında gelir bulunmuyor.</td></tr>
                ) : (
                  filteredAppointments.map(a => (
                    <tr key={a.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap text-muted-foreground">{new Date(a.date).toLocaleDateString("tr-TR")}</td>
                      <td className="px-5 py-3.5 font-medium text-foreground">{a.customerName}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{a.service}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">₺{a.price.toLocaleString("tr-TR")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderGiderContent = () => {
    if (expenseReportMode === "yearly_chart") {
      return (
        <div className="flex flex-col gap-4 pr-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm overflow-hidden h-[500px]">
            <h3 className="font-semibold text-lg text-foreground mb-4">{selectedExpenseYear} Yılı Gider Grafiği</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyExpenseChartData} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₺${val}`} />
                <Tooltip 
                  formatter={(value: any, name: any) => [`₺${Number(value).toLocaleString('tr-TR')}`, name]}
                  contentStyle={{ borderRadius: '16px', border: '1px solid hsl(var(--primary) / 0.2)', backgroundColor: 'hsl(var(--primary) / 0.05)', backdropFilter: 'blur(8px)', color: 'hsl(var(--foreground))', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  itemStyle={{ padding: '2px 0', margin: 0, fontSize: '12px', fontWeight: 500 }}
                  labelStyle={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px', color: 'hsl(var(--foreground))' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="gider" name="Toplam Gider" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4 pr-2">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-red-500/10 border border-red-500/20 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-red-500/20 text-red-600 shadow-sm print:hidden">
              <TrendingDown className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-800/70 dark:text-red-400/70">Toplam Gider (Seçili Tarihler)</p>
              <p className="font-serif text-3xl font-bold text-red-700 dark:text-red-400">₺{totalExpense.toLocaleString("tr-TR")}</p>
            </div>
          </div>
          <div className="text-right text-xs text-red-700/80 font-medium bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 shadow-sm">
            Toplam {filteredExpenses.length} Kalem
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3.5 font-medium">Tarih</th>
                  <th className="px-5 py-3.5 font-medium">Kategori</th>
                  <th className="px-5 py-3.5 font-medium">Açıklama</th>
                  <th className="px-5 py-3.5 font-medium text-right">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredExpenses.length === 0 ? (
                  <tr><td colSpan={4} className="py-12 text-center text-muted-foreground">Bu tarih aralığında gider bulunmuyor.</td></tr>
                ) : (
                  filteredExpenses.map(e => (
                    <tr key={e.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap text-muted-foreground">{new Date(e.date).toLocaleDateString("tr-TR")}</td>
                      <td className="px-5 py-3.5 font-medium text-foreground">{e.category}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{e.title || "-"}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-red-600">₺{e.amount.toLocaleString("tr-TR")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderHizmetContent = () => (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm mr-2 flex flex-col">
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2 print:hidden">
          <BarChart3 className="size-5 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">Hizmet Gelir Dağılımı</h3>
        </div>
        <div className="text-sm font-medium text-muted-foreground bg-muted/40 px-4 py-2 rounded-lg border border-border">
          En çok kazandıran: <span className="text-foreground">{serviceRows.length ? serviceRows[0][0] : "-"}</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {serviceRows.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground text-sm">Bu tarih aralığında hizmet geliri bulunmuyor.</p>
        ) : (
          serviceRows.map(([name, total]) => {
            const percentage = Math.round((total / maxService) * 100)
            return (
              <div key={name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{name}</span>
                  <span className="font-bold text-foreground">₺{total.toLocaleString("tr-TR")}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted/50 border border-border/40 print:border-black print:bg-transparent">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out print:bg-black"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )

  const renderBorcContent = () => (
    <div className="flex flex-col gap-4 pr-2">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 shadow-sm print:hidden">
            <Banknote className="size-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800/70 dark:text-amber-400/70">Toplam Alacak</p>
            <p className="font-serif text-3xl font-bold text-amber-700 dark:text-amber-400">₺{totalDebt.toLocaleString("tr-TR")}</p>
          </div>
        </div>
        <div className="text-right text-xs text-amber-700/80 font-medium bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/20 shadow-sm">
          {customersWithDebt.length} Kişi
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customersWithDebt.map(c => (
          <div key={c.id} className="bg-card border border-border/80 rounded-xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow print:shadow-none print:border-black">
            <div className="flex flex-col">
              <h4 className="font-bold text-foreground">{c.firstName} {c.lastName}</h4>
              <p className="text-xs text-muted-foreground mt-1">{c.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Kalan Borç</p>
              <p className="font-black text-amber-600 text-lg">₺{c.debt?.toLocaleString("tr-TR")}</p>
            </div>
          </div>
        ))}
        {customersWithDebt.length === 0 && <p className="text-sm text-muted-foreground p-4">Borcu olan müşteri bulunmuyor.</p>}
      </div>
    </div>
  )

  const renderGelmeyenContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {noShowCustomers.map(c => (
        <div key={c.id} className="bg-card border border-border/80 rounded-xl p-4 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow print:shadow-none print:border-black">
          <div className="size-10 rounded-full bg-accent text-muted-foreground flex items-center justify-center shrink-0 print:hidden">
            <UserX className="size-5" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">{c.firstName} {c.lastName}</h4>
            <p className="text-xs text-destructive font-medium mt-1">Son iptal edilen randevu: {c.lastMissedDate}</p>
            <p className="text-xs text-muted-foreground">Toplam iptal/gelmedi: {c.missedCount} kez</p>
            <p className="text-xs text-muted-foreground mt-1">{c.phone}</p>
          </div>
        </div>
      ))}
      {noShowCustomers.length === 0 && <p className="text-sm text-muted-foreground p-4">İşlemine gelmeyen müşteri bulunmuyor.</p>}
    </div>
  )

  const renderIptalSatisContent = () => (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm mr-2 flex flex-col">
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2 print:hidden">
          <UserX className="size-5 text-red-500" />
          <h3 className="font-semibold text-lg text-foreground">İptal Edilen Ürün Satışları</h3>
        </div>
      </div>
      
      <div className="space-y-6">
        {cancelledSalesList.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground text-sm">Bu tarih aralığında iptal edilen ürün satışı bulunmuyor.</p>
        ) : (
          <div className="space-y-4">
            {cancelledSalesList.map((item, idx) => {
              const customer = customers.find(c => c.id === item.customerId);
              const personnel = users.find(u => u.id === item.personnelId);
              return (
                <div key={idx} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{item.productName} ({item.quantity} Adet)</h4>
                      <p className="text-xs text-muted-foreground">Müşteri: {customer?.firstName} {customer?.lastName} • Personel: {personnel?.fullName || "-"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">₺{item.totalPrice.toLocaleString("tr-TR")}</p>
                    <p className="text-[11px] text-red-500 max-w-[200px] truncate" title={item.cancelReason}>{item.cancelledBy} iptal etti</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  const renderIptalOdemelerContent = () => (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm mr-2 flex flex-col">
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2 print:hidden">
          <Ban className="size-5" />
          <h3 className="font-semibold text-lg text-foreground">İptal Edilen Ödemeler</h3>
        </div>
      </div>
      
      <div className="space-y-6">
        {cancelledPaymentsList.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground text-sm">Bu tarih aralığında iptal edilen ödeme bulunmuyor.</p>
        ) : (
          <div className="space-y-4">
            {cancelledPaymentsList.map((item, idx) => {
              const customer = customers.find(c => c.id === item.customerId);
              return (
                <div key={idx} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{item.method} ({item.type})</h4>
                      <p className="text-xs text-muted-foreground">Müşteri: {customer?.firstName} {customer?.lastName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">₺{item.amount.toLocaleString("tr-TR")}</p>
                    <p className="text-[11px] text-red-500 max-w-[200px] truncate" title={item.cancelReason}>{item.cancelledBy} iptal etti</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  const renderStokContent = () => (
    <div className="flex flex-col gap-4 pr-2">
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3.5 font-medium">Ürün</th>
                <th className="px-5 py-3.5 font-medium">Marka</th>
                <th className="px-5 py-3.5 font-medium text-right">Fiyat</th>
                <th className="px-5 py-3.5 font-medium text-center">Stok</th>
                <th className="px-5 py-3.5 font-medium text-right">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stockProducts.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Listelenecek ürün bulunmuyor.</td></tr>
              ) : (
                stockProducts.map(p => {
                  const isOutOfStock = p.stock === 0;
                  const isCritical = p.stock > 0 && p.stock < 10;

                  return (
                    <tr key={p.id} className={cn(
                      "transition-colors hover:bg-muted/40",
                      isOutOfStock ? "bg-red-50/50 dark:bg-red-950/20" : ""
                    )}>
                      <td className={cn("px-5 py-3.5 font-medium", isOutOfStock ? "text-muted-foreground" : "text-foreground")}>
                        {p.name} {p.unit && <span className="text-muted-foreground font-normal">({p.unit})</span>}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{p.brand || "-"}</td>
                      <td className="px-5 py-3.5 text-right font-medium">₺{p.price.toLocaleString("tr-TR")}</td>
                      <td className={cn(
                        "px-5 py-3.5 text-center font-bold",
                        isOutOfStock ? "text-red-600" : isCritical ? "text-orange-600" : "text-emerald-600"
                      )}>{p.stock}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                          isOutOfStock ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                          isCritical ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        )}>
                          {isOutOfStock ? "Satışa Kapalı" : isCritical ? "Kritik Stok" : "Yeterli Stok"}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderUrunSatisContent = () => (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm mr-2 flex flex-col">
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2 print:hidden">
          <ShoppingBag className="size-5 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">Ürün Satış Bilgileri</h3>
        </div>



        <div className="text-sm font-medium text-muted-foreground bg-muted/40 px-4 py-2 rounded-lg border border-border">
          Toplam Satış Geliri: <span className="text-foreground">₺{productSales.reduce((sum, p) => sum + p.revenue, 0).toLocaleString("tr-TR")}</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {productSales.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground text-sm">Satışı yapılan ürün bulunmuyor.</p>
        ) : (
          <div className="space-y-4">
            {productSales.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{item.product.name}</h4>
                    {item.product.brand && <p className="text-xs text-muted-foreground">{item.product.brand}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-emerald-600">₺{item.revenue.toLocaleString("tr-TR")}</div>
                  <div className="text-xs text-muted-foreground">{item.quantity} Adet Satıldı</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderPersonelContent = () => {
    if (personelReportType === "yillik_grafik") {
      return (
        <div className="flex flex-col gap-4 pr-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm overflow-hidden h-[500px]">
            <h3 className="font-semibold text-lg text-foreground mb-4">{personelSelectedYear} Yılı Personel Performans Grafiği</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={personelYearlyData} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} Adet`} />
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value} Adet`, name]}
                  contentStyle={{ borderRadius: '16px', border: '1px solid hsl(var(--primary) / 0.2)', backgroundColor: 'hsl(var(--primary) / 0.05)', backdropFilter: 'blur(8px)', color: 'hsl(var(--foreground))', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  itemStyle={{ padding: '2px 0', margin: 0, fontSize: '12px', fontWeight: 500 }}
                  labelStyle={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px', color: 'hsl(var(--foreground))' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="urunSatis" name="Ürün Satış (Adet)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="hizmetSatis" name="Hizmet Satış (Adet)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="islemHizmet" name="Hizmet İşlem (Adet)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    }

    if (personelReportType === "urun_hizmet") {
      const totalQuantity = personelSales.reduce((s, a) => s + a.quantity, 0)
      return (
        <div className="flex flex-col gap-4 pr-2">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-primary/5 border border-primary/10 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm print:hidden">
                <ShoppingBag className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/70">Ürün ve Hizmet Satış Raporu</p>
                <p className="font-serif text-3xl font-bold text-primary">{totalQuantity} Adet</p>
              </div>
            </div>
            <div className="text-right text-xs text-foreground/80 font-medium bg-background px-4 py-2 rounded-lg border border-border shadow-sm">
              Seçili Personel: {selectedPersonel === "all" ? "Tümü" : users.find(u => u.id === selectedPersonel)?.fullName}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3.5 font-medium">Tarih</th>
                    <th className="px-5 py-3.5 font-medium">Personel</th>
                    <th className="px-5 py-3.5 font-medium">Ürün/Hizmet Paket</th>
                    <th className="px-5 py-3.5 font-medium text-center">Tür</th>
                    <th className="px-5 py-3.5 font-medium text-right">Adet</th>
                    <th className="px-5 py-3.5 font-medium text-right">Gelir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {personelSales.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">Satış bulunamadı.</td></tr>
                  ) : (
                    personelSales.map(s => {
                      const staff = users.find(u => u.id === s.personnelId)?.fullName || "Bilinmeyen"
                      const isService = !!s.totalSessions
                      return (
                        <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                          <td className="px-5 py-3.5 whitespace-nowrap text-muted-foreground">{new Date(s.date).toLocaleDateString("tr-TR")}</td>
                          <td className="px-5 py-3.5 font-medium text-foreground">{staff}</td>
                          <td className="px-5 py-3.5 text-foreground">{s.productName}</td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase", isService ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30")}>
                              {isService ? "Hizmet" : "Ürün"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right font-medium">{s.quantity}</td>
                          <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">₺{s.totalPrice.toLocaleString("tr-TR")}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }

    // Hizmet Raporu (İşlem Raporu)
    return (
      <div className="flex flex-col gap-4 pr-2">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-blue-500/10 border border-blue-500/20 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600 shadow-sm print:hidden">
              <Users className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800/70 dark:text-blue-400/70">Gerçekleştirilen İşlemler</p>
              <p className="font-serif text-3xl font-bold text-blue-700 dark:text-blue-400">{personelAppointments.length} Adet</p>
            </div>
          </div>
          <div className="text-right text-xs text-blue-700/80 font-medium bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20 shadow-sm">
            Seçili Personel: {selectedPersonel === "all" ? "Tümü" : users.find(u => u.id === selectedPersonel)?.fullName}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3.5 font-medium">Tarih</th>
                  <th className="px-5 py-3.5 font-medium">Personel</th>
                  <th className="px-5 py-3.5 font-medium">Müşteri</th>
                  <th className="px-5 py-3.5 font-medium">İşlem</th>
                  <th className="px-5 py-3.5 font-medium text-right">Fiyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {personelAppointments.length === 0 ? (
                  <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">İşlem bulunamadı.</td></tr>
                ) : (
                  personelAppointments.map(a => {
                    const staff = users.find(u => u.id === a.personnelId)?.fullName || "Bilinmeyen"
                    return (
                      <tr key={a.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap text-muted-foreground">{new Date(a.date).toLocaleDateString("tr-TR")}</td>
                        <td className="px-5 py-3.5 font-medium text-foreground">{staff}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{a.customerName}</td>
                        <td className="px-5 py-3.5 font-medium">{a.service}</td>
                        <td className="px-5 py-3.5 text-right text-muted-foreground">₺{a.price.toLocaleString("tr-TR")}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const getPrintColumns = () => {
    switch (activeTab) {
      case "gelir": return ["Tarih", "Müşteri", "İşlem", "Tutar"]
      case "gider": return ["Tarih", "Kategori", "Açıklama", "Tutar"]
      case "hizmet": return ["Hizmet Adı", "Gelir Yüzdesi", "Toplam Tutar"]
      case "odeme_raporlari":
        if (odemeReportType === "borc") return ["Müşteri", "İletişim", "Son İşlem Tarihi", "Kalan Borç"]
        if (odemeReportType === "iptal") return ["Müşteri", "İşlem Türü", "İptal Nedeni", "Tutar"]
        return []
      case "gelmeyen": return ["Müşteri", "İletişim", "Son İptal Tarihi", "İptal/Gelmedi Sayısı"]
      case "urun_satis":
        if (urunSatisReportType === "satis") return ["Ürün Adı", "Marka", "Satış Adedi", "Toplam Gelir"]
        if (urunSatisReportType === "iptal") return ["Ürün Adı", "Müşteri", "İptal Nedeni", "Tutar"]
        if (urunSatisReportType === "stok") return ["Ürün Adı", "Fiyat", "Kalan Stok", "Durum"]
        return []
      case "personel": 
        if (personelReportType === "urun_hizmet") return ["Tarih", "Personel", "Ürün/Hizmet", "Adet", "Tutar"]
        if (personelReportType === "hizmet") return ["Tarih", "Personel", "Müşteri", "İşlem", "Tutar"]
        return []
    }
  }

  const getPrintRows = (): (string | number)[][] => {
    switch (activeTab) {
      case "gelir": 
        return filteredAppointments.map(a => [
          new Date(a.date).toLocaleDateString("tr-TR"),
          a.customerName,
          a.service,
          `₺${a.price.toLocaleString("tr-TR")}`
        ])
      case "gider":
        return filteredExpenses.map(e => [
          new Date(e.date).toLocaleDateString("tr-TR"),
          e.category,
          e.title || "-",
          `₺${e.amount.toLocaleString("tr-TR")}`
        ])
      case "hizmet":
        return serviceRows.map(([name, total]) => [
          name,
          `%${(total/totalIncome*100).toFixed(1)}`,
          `₺${total.toLocaleString("tr-TR")}`
        ])
      case "odeme_raporlari":
        if (odemeReportType === "borc") {
          return customersWithDebt.map(c => [
            `${c.firstName} ${c.lastName}`,
            c.phone,
            c.lastVisitDate ? new Date(c.lastVisitDate).toLocaleDateString("tr-TR") : "-",
            `₺${c.debt?.toLocaleString("tr-TR")}`
          ])
        }
        if (odemeReportType === "iptal") {
          return cancelledPaymentsList.map(item => [
            (customers.find(c => c.id === item.customerId)?.firstName || "") + " " + (customers.find(c => c.id === item.customerId)?.lastName || ""),
            `${item.method} (${item.type})`,
            item.cancelReason || "-",
            `₺${item.amount.toLocaleString("tr-TR")}`
          ])
        }
        return []
      case "gelmeyen":
        return noShowCustomers.map(c => [
          `${c.firstName} ${c.lastName}`,
          c.phone,
          `${c.missedCount} kez`
        ])
      case "urun_satis":
        if (urunSatisReportType === "satis") {
          return productSales.map(item => [
            item.product.name,
            item.product.brand || "-",
            `${item.quantity} Adet`,
            `₺${item.revenue.toLocaleString("tr-TR")}`
          ])
        }
        if (urunSatisReportType === "iptal") {
          return cancelledSalesList.map(item => [
            item.productName,
            (customers.find(c => c.id === item.customerId)?.firstName || "") + " " + (customers.find(c => c.id === item.customerId)?.lastName || ""),
            item.cancelReason || "-",
            `₺${item.totalPrice.toLocaleString("tr-TR")}`
          ])
        }
        if (urunSatisReportType === "stok") {
          return stockProducts.map(p => [
            p.name,
            `${p.price} ₺`,
            `${p.stock} Adet`,
            p.stock === 0 ? "Satışa Kapalı" : p.stock < 10 ? "Kritik Stok" : "Yeterli Stok"
          ])
        }
        return []
      case "personel":
        if (personelReportType === "urun_hizmet") {
          return personelSales.map(s => [
            new Date(s.date).toLocaleDateString("tr-TR"),
            users.find(u => u.id === s.personnelId)?.fullName || "-",
            s.productName,
            `${s.quantity} Adet`,
            `₺${s.totalPrice.toLocaleString("tr-TR")}`
          ])
        }
        if (personelReportType === "hizmet") {
          return personelAppointments.map(a => [
            new Date(a.date).toLocaleDateString("tr-TR"),
            users.find(u => u.id === a.personnelId)?.fullName || "-",
            a.customerName,
            a.service,
            `₺${a.price.toLocaleString("tr-TR")}`
          ])
        }
        return []
    }
  }

  const getPrintSummary = () => {
    switch (activeTab) {
      case "gelir": return `Toplam Gelir: ₺${totalIncome.toLocaleString("tr-TR")}`
      case "gider": return `Toplam Gider: ₺${totalExpense.toLocaleString("tr-TR")}`
      case "hizmet": return `Toplam Gelir: ₺${totalIncome.toLocaleString("tr-TR")}`
      case "odeme_raporlari":
        if (odemeReportType === "borc") return `Toplam Alacak (Borç): ₺${totalDebt.toLocaleString("tr-TR")}`
        if (odemeReportType === "iptal") return `Toplam İptal Edilen Ödeme: ₺${cancelledPaymentsList.reduce((sum, item) => sum + item.amount, 0).toLocaleString("tr-TR")}`
        return undefined
      case "gelmeyen": return undefined
      case "urun_satis":
        if (urunSatisReportType === "satis") return `Genel Toplam: ₺${productSales.reduce((sum, p) => sum + p.revenue, 0).toLocaleString("tr-TR")}`
        if (urunSatisReportType === "iptal") return `Toplam İptal Edilen Tutar: ₺${cancelledSalesList.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString("tr-TR")}`
        if (urunSatisReportType === "stok") return undefined
        return undefined
      case "personel": 
        if (personelReportType === "urun_hizmet") return `Toplam Ürün/Hizmet Satışı: ${personelSales.reduce((s, a) => s + a.quantity, 0)} Adet`
        if (personelReportType === "hizmet") return `Toplam Uygulanan İşlem: ${personelAppointments.length} Adet`
        return undefined
    }
  }

  const getPrintChartNode = () => {
    if (activeTab === "gelir" && incomeReportMode === "yearly_chart") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={yearlyChartData} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" vertical={false} />
            <XAxis dataKey="name" stroke="#000" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#000" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₺${val}`} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line type="monotone" dataKey="hizmet" name="Hizmet Geliri" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} isAnimationActive={false} />
            <Line type="monotone" dataKey="urun" name="Ürün Satış Geliri" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      )
    }
    if (activeTab === "gider" && expenseReportMode === "yearly_chart") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={yearlyExpenseChartData} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" vertical={false} />
            <XAxis dataKey="name" stroke="#000" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#000" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₺${val}`} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line type="monotone" dataKey="gider" name="Toplam Gider" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      )
    }
    if (activeTab === "personel" && personelReportType === "yillik_grafik") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={personelYearlyData} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" vertical={false} />
            <XAxis dataKey="name" stroke="#000" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#000" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} Adet`} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line type="monotone" dataKey="urunSatis" name="Ürün Satış (Adet)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} isAnimationActive={false} />
            <Line type="monotone" dataKey="hizmetSatis" name="Hizmet Satış (Adet)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} isAnimationActive={false} />
            <Line type="monotone" dataKey="islemHizmet" name="Hizmet İşlem (Adet)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      )
    }
    return undefined
  }

  const getPrintReportTitle = () => {
    if (activeTab === "gelir" && incomeReportMode === "yearly_chart") return `${selectedYear} Yılı Gelir Grafiği`
    if (activeTab === "gider" && expenseReportMode === "yearly_chart") return `${selectedExpenseYear} Yılı Gider Grafiği`
    if (activeTab === "personel" && personelReportType === "yillik_grafik") return `${personelSelectedYear} Yılı Personel Performans Grafiği`
    
    if (activeTab === "urun_satis") {
      if (urunSatisReportType === "satis") return "Ürün Satış Raporu"
      if (urunSatisReportType === "iptal") return "İptal Edilen Ürün Satışları Raporu"
      if (urunSatisReportType === "stok") return "Ürün Stok Durumu Raporu"
    }

    if (activeTab === "odeme_raporlari") {
      if (odemeReportType === "borc") return "Borcu Olan Müşteriler Raporu"
      if (odemeReportType === "iptal") return "İptal Edilen Ödemeler Raporu"
    }

    return reportTitles[activeTab]
  }

  const getPrintDateRange = () => {
    if (activeTab === "gelir" && incomeReportMode === "yearly_chart") return null
    if (activeTab === "gider" && expenseReportMode === "yearly_chart") return null
    if (activeTab === "personel" && personelReportType === "yillik_grafik") return null
    if (activeTab === "urun_satis" && urunSatisReportType === "stok") return null
    
    if (activeTab === "gelir" || activeTab === "gider" || activeTab === "hizmet" || activeTab === "urun_satis" || (activeTab === "odeme_raporlari" && odemeReportType === "iptal") || (activeTab === "personel" && personelReportType !== "")) {
      return `${new Date(startDate).toLocaleDateString("tr-TR")} - ${new Date(endDate).toLocaleDateString("tr-TR")}`
    }
    return null
  }

  return (
    <section className="flex flex-col flex-1 min-h-0 bg-background/50">
      
      <div className="flex flex-col shrink-0 rounded-2xl border border-border bg-card shadow-sm mb-4">
        <div className="px-4 py-3 flex flex-wrap items-center justify-start gap-2.5">
          
          {/* Rapor Seçimi (Custom Dropdown) */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between bg-background border border-input rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground shadow-sm transition-colors hover:bg-muted/50"
            >
              <div className="grid items-center pr-2 text-left">
                <div className="col-start-1 row-start-1 flex items-center gap-2.5 truncate">
                  <div className="text-primary/70 shrink-0">
                    {reportIcons[activeTab]}
                  </div>
                  {reportTitles[activeTab]}
                </div>
                {/* Gizli div ile en uzun metin kadar genişlemesini sağlıyoruz */}
                <div className="col-start-1 row-start-1 h-0 overflow-hidden invisible pointer-events-none font-medium whitespace-nowrap flex items-center gap-2.5">
                  <div className="size-4 shrink-0"></div>
                  {Object.values(reportTitles).reduce((a, b) => a.length > b.length ? a : b)}
                </div>
              </div>
              <ChevronDown className={`size-4 shrink-0 ml-2 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col p-1">
                  {(Object.keys(reportTitles) as ReportTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab)
                        setIsDropdownOpen(false)
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        activeTab === tab
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-popover-foreground hover:bg-muted font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`${activeTab === tab ? "text-primary" : "text-muted-foreground"}`}>
                          {reportIcons[tab]}
                        </div>
                        {reportTitles[tab]}
                      </div>
                      {activeTab === tab && <Check className="size-4 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {activeTab === "urun_satis" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <CustomSelect
                value={urunSatisReportType}
                onChange={(val) => setUrunSatisReportType(val as any)}
                options={[
                  { value: "satis", label: "Ürün Satışları" },
                  { value: "iptal", label: "İptal Edilenler" },
                  { value: "stok", label: "Stok Durumu" }
                ]}
              />
            </div>
          )}

          {activeTab === "odeme_raporlari" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <CustomSelect
                value={odemeReportType}
                onChange={(val) => setOdemeReportType(val as any)}
                options={[
                  { value: "borc", label: "Borcu Olan Müşteriler" },
                  { value: "iptal", label: "İptal Edilen Ödemeler" }
                ]}
              />
            </div>
          )}

          {activeTab === "gelir" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <CustomSelect
                value={incomeReportMode}
                onChange={(val) => setIncomeReportMode(val as any)}
                options={[
                  { value: "date_range", label: "Tarih Aralığı İle Raporlama" },
                  { value: "yearly_chart", label: "1 Yıllık Grafik" }
                ]}
              />

              {incomeReportMode === "yearly_chart" && (
                <CustomSelect
                  value={selectedYear}
                  onChange={(val) => setSelectedYear(val as string)}
                  options={[
                    { value: (new Date().getFullYear() + 1).toString(), label: (new Date().getFullYear() + 1).toString() },
                    { value: new Date().getFullYear().toString(), label: new Date().getFullYear().toString() },
                    { value: (new Date().getFullYear() - 1).toString(), label: (new Date().getFullYear() - 1).toString() },
                    { value: (new Date().getFullYear() - 2).toString(), label: (new Date().getFullYear() - 2).toString() }
                  ]}
                />
              )}
            </div>
          )}

          {activeTab === "gider" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <CustomSelect
                value={expenseReportMode}
                onChange={(val) => setExpenseReportMode(val as any)}
                options={[
                  { value: "date_range", label: "Tarih Aralığı İle Raporlama" },
                  { value: "yearly_chart", label: "1 Yıllık Grafik" }
                ]}
              />

              {expenseReportMode === "yearly_chart" && (
                <CustomSelect
                  value={selectedExpenseYear}
                  onChange={(val) => setSelectedExpenseYear(val as string)}
                  options={[
                    { value: (new Date().getFullYear() + 1).toString(), label: (new Date().getFullYear() + 1).toString() },
                    { value: new Date().getFullYear().toString(), label: new Date().getFullYear().toString() },
                    { value: (new Date().getFullYear() - 1).toString(), label: (new Date().getFullYear() - 1).toString() },
                    { value: (new Date().getFullYear() - 2).toString(), label: (new Date().getFullYear() - 2).toString() }
                  ]}
                />
              )}
            </div>
          )}

          {activeTab === "personel" && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <CustomSelect
                value={selectedPersonel}
                onChange={(val) => {
                  setSelectedPersonel(val as string)
                  if (val === "") setPersonelReportType("")
                }}
                placeholder="Personel Seçiniz"
                options={[
                  { value: "all", label: "Tüm Personeller" },
                  ...users.map(u => ({ value: u.id, label: u.fullName }))
                ]}
              />

              {selectedPersonel !== "" && (
                <CustomSelect
                  value={personelReportType}
                  onChange={(val) => setPersonelReportType(val as any)}
                  placeholder="Rapor Türü Seçiniz"
                  options={[
                    { value: "urun_hizmet", label: "Ürün/Hizmet Satışları" },
                    { value: "hizmet", label: "Hizmet Raporu" },
                    { value: "yillik_grafik", label: "Yıllık Grafik" }
                  ]}
                  className="animate-in fade-in slide-in-from-left-2 duration-300"
                />
              )}

              {selectedPersonel !== "" && personelReportType === "yillik_grafik" && (
                <CustomSelect
                  value={personelSelectedYear}
                  onChange={(val) => setPersonelSelectedYear(val as string)}
                  options={[
                    { value: (new Date().getFullYear() + 1).toString(), label: (new Date().getFullYear() + 1).toString() },
                    { value: new Date().getFullYear().toString(), label: new Date().getFullYear().toString() },
                    { value: (new Date().getFullYear() - 1).toString(), label: (new Date().getFullYear() - 1).toString() },
                    { value: (new Date().getFullYear() - 2).toString(), label: (new Date().getFullYear() - 2).toString() }
                  ]}
                  className="animate-in fade-in slide-in-from-left-2 duration-300"
                />
              )}
            </div>
          )}

          {/* Tarih Aralığı (Sadece İlgili Sekmelerde) */}
          {((activeTab === "gelir" && incomeReportMode === "date_range") || 
            (activeTab === "gider" && expenseReportMode === "date_range") || 
            (activeTab === "personel" && selectedPersonel !== "" && personelReportType !== "" && personelReportType !== "yillik_grafik") || 
            activeTab === "hizmet" || (activeTab === "odeme_raporlari" && odemeReportType === "iptal") || (activeTab === "urun_satis" && urunSatisReportType !== "stok")) && (
            <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1.5 rounded-xl border border-border animate-in fade-in slide-in-from-left-2 duration-300">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-background border border-input rounded-md px-2 py-1 text-sm outline-none focus:border-primary text-foreground cursor-pointer"
              />
              <span className="text-muted-foreground/50">-</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-background border border-input rounded-md px-2 py-1 text-sm outline-none focus:border-primary text-foreground cursor-pointer"
              />
              <button
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0]
                  setStartDate(today)
                  setEndDate(today)
                }}
                className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold px-4 py-2 rounded-md transition-colors"
              >
                Bugün
              </button>
            </div>
          )}

          <div className="flex items-center ml-auto">
            {/* Yazdır Butonu (En Sağda) */}
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center justify-center size-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200 shadow-sm shrink-0"
              title="Yazdır"
            >
              <Printer className="size-4.5" />
            </button>
          </div>

        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 pb-10">
        
        {/* GELİR RAPORU */}
        {activeTab === "gelir" && (
          <div className="flex flex-col gap-2">
            {renderGelirContent()}
          </div>
        )}

        {/* GİDER RAPORU */}
        {activeTab === "gider" && (
          <div className="flex flex-col gap-2">
            {renderGiderContent()}
          </div>
        )}

        {/* HİZMETE GÖRE GELİR RAPORU */}
        {activeTab === "hizmet" && (
          <div className="flex flex-col gap-2">
            {renderHizmetContent()}
          </div>
        )}

        {/* ÖDEME RAPORLARI */}
        {activeTab === "odeme_raporlari" && (
          <div className="flex flex-col gap-2">
            {odemeReportType === "borc" && renderBorcContent()}
            {odemeReportType === "iptal" && renderIptalOdemelerContent()}
          </div>
        )}

        {/* UZUN SÜREDİR GELMEYENLER */}
        {activeTab === "gelmeyen" && (
          <div className="flex flex-col gap-2">
            {renderGelmeyenContent()}
          </div>
        )}

        {/* ÜRÜN SATIŞ BİLGİLERİ VE STOK */}
        {activeTab === "urun_satis" && (
          <div className="flex flex-col gap-2">
            {urunSatisReportType === "satis" && renderUrunSatisContent()}
            {urunSatisReportType === "iptal" && renderIptalSatisContent()}
            {urunSatisReportType === "stok" && renderStokContent()}
          </div>
        )}

        {/* PERSONEL PERFORMANS RAPORLARI */}
        {activeTab === "personel" && selectedPersonel !== "" && personelReportType !== "" && (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderPersonelContent()}
          </div>
        )}

      </div>
      
      <PrintPreviewModal 
        isOpen={isPrintModalOpen} 
        onClose={() => setIsPrintModalOpen(false)} 
        reportTitle={getPrintReportTitle()}
        dateRange={getPrintDateRange()}
        columns={getPrintColumns()}
        rows={getPrintRows()}
        summary={getPrintSummary()}
        chartNode={getPrintChartNode()}
      />
    </section>
  )
}
