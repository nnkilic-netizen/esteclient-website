"use client"

import { useMemo, useState, useEffect } from "react"
import { useLocalStorage } from "@/lib/use-local-storage"
import { ClipboardList, Wallet, Bell, UserPlus, CalendarDays, Users, BarChart3, ShoppingBag } from "lucide-react"
import { Sidebar, type ViewKey } from "@/components/sidebar"
import { AppointmentsPanel } from "@/components/appointments-panel"
import { CustomersPanel } from "@/components/customers-panel"
import { CustomerProfilePanel } from "@/components/customer-profile-panel"
import { ProductsPanel } from "@/components/products-panel"
import { PriceListModal } from "@/components/price-list-modal"
import { ReportsPanel } from "@/components/reports-panel"
import { RemindersPanel, type Note } from "@/components/reminders-panel"
import { SystemSettingsView } from "@/components/system-settings-view"
import { UserSettingsDrawer } from "@/components/user-settings-drawer"
import { AddCustomerModal } from "@/components/add-customer-modal"
import { AddExpenseModal, type Expense } from "@/components/add-expense-modal"
import { MakeSaleModal } from "@/components/make-sale-modal"
import { SelectCustomerModal } from "@/components/select-customer-modal"
import { WelcomeModal } from "@/components/welcome-modal"
import { LoginScreen } from "@/components/login-screen"
import { themeVars, type ThemeKey } from "@/lib/themes"
import {
  appointments as seedAppointments,
  customers as seedCustomers,
  type Appointment,
  type AppointmentStatus,
  type Customer,
  products as seedProducts,
  type Product,
  serviceCategories as seedCategories,
  type ServiceCategory,
  mockUsers as seedUsers,
  type User,
  mockWorkingDays as seedWorkingDays,
  type WorkingDay,
  mockCustomerSales,
} from "@/lib/demo-data"

const todayISO = new Date().toISOString().slice(0, 10)

const viewTitles: Record<ViewKey, string> = {
  appointments: "Randevular",
  customers: "Müşteriler",
  reports: "Raporlar",
  products: "Ürün Yönetimi",
  "price-list": "Fiyat Listesi",
  reminders: "Hatırlatmalar",
  settings: "Sistem Ayarları",
}

function DateTimeDisplay() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute bottom-full right-1 mb-[14px] whitespace-nowrap text-right text-[11px] text-muted-foreground/80 font-medium">
      {now.toLocaleDateString("tr-TR", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })} - {now.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
    </div>
  )
}

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [view, setView] = useState<ViewKey>("appointments")
  const [selectedDate, setSelectedDate] = useState(todayISO)
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>("demo_appointments", seedAppointments)
  const [customers, setCustomers] = useLocalStorage<Customer[]>("demo_customers", seedCustomers)
  const [products, setProducts] = useLocalStorage<Product[]>("demo_products", seedProducts)
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("demo_expenses", [])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [headerContent, setHeaderContent] = useState<React.ReactNode>(null)
  const [notes, setNotes] = useLocalStorage<Note[]>("demo_notes", [
    { id: "1", content: "Elif Hanım'a yeni gelen lazer cihazı hakkında bilgi verilecek.", date: "2026-07-20" }
  ])
  const totalReminders = notes.length + 2 // 2 corresponds to the mock birthday customers

  // Modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [isPriceListOpen, setIsPriceListOpen] = useState(false)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isMakeSaleOpen, setIsMakeSaleOpen] = useState(false)
  const [isSelectCustomerOpen, setIsSelectCustomerOpen] = useState(false)
  const [pendingSaleProduct, setPendingSaleProduct] = useState<Product | null>(null)
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false)
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeKey>("emerald")
  const [toast, setToast] = useState<string | null>(null)

  // Settings States
  const [categories, setCategories] = useLocalStorage<ServiceCategory[]>("demo_categories", seedCategories)
  const [users, setUsers] = useLocalStorage<User[]>("demo_users", seedUsers)
  const [workingDays, setWorkingDays] = useLocalStorage<WorkingDay[]>("demo_workingDays", seedWorkingDays)
  const [slotInterval, setSlotInterval] = useLocalStorage<number>("demo_slotInterval", 15) // 10, 15, 30

  useEffect(() => {
    setIsWelcomeModalOpen(true)
  }, [])

  const notify = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2600)
  }

  const handleNavigate = (key: string) => {
    if (key === "appointments" || key === "customers" || key === "reports" || key === "products" || key === "reminders") {
      setView(key as ViewKey)
      setSelectedCustomerId(null)
    } else if (key === "price-list") {
      setIsPriceListOpen(true)
    } else if (key === "add-customer") {
      setIsAddCustomerOpen(true)
    } else if (key === "add-expense") {
      setIsAddExpenseOpen(true)
    } else if (key === "settings") {
      setView("settings")
    } else if (key === "user-settings") {
      setIsUserSettingsOpen(true)
    } else if (key === "backup") {
      notify("Veritabanı yedeği başarıyla oluşturuldu.")
    } else if (key === "logout") {
      notify("Çıkış yapılıyor...")
      setTimeout(() => {
        setIsLoggedIn(false)
      }, 800)
    }
  }

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  const todayAppointments = useMemo(
    () => appointments.filter((a) => a.date === todayISO),
    [appointments],
  )

  const canceledCount = useMemo(
    () => appointments.filter((a) => a.status === "iptal").length,
    [appointments],
  )

  const newCustomersThisMonth = useMemo(() => {
    return 3
  }, [customers])

  const revenue = useMemo(
    () =>
      appointments
        .filter((a) => a.date === todayISO && a.status === "geldi")
        .reduce((sum, a) => sum + a.price, 0),
    [appointments],
  )

  const todayExpenses = useMemo(
    () =>
      expenses
        .filter((e) => e.date === todayISO)
        .reduce((sum, e) => sum + e.amount, 0),
    [expenses],
  )

  if (!isLoggedIn) {
    return (
      <div style={themeVars[theme]}>
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
      </div>
    )
  }

  return (
    <div style={themeVars[theme]} className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeView={view} onNavigate={handleNavigate} notes={notes} />

      <main className="flex flex-col flex-1 h-full overflow-hidden relative z-10">
        <header className="flex shrink-0 items-center justify-between px-6 pt-6 pb-4">
          <div className="flex-1">
            {headerContent}
          </div>
          <div className="relative">
            <DateTimeDisplay />
            <div className="flex items-center gap-3">
              <button
              title="Hatırlatmalar"
              onClick={() => {
                setView("reminders")
                setSelectedCustomerId(null)
              }}
              className="relative flex h-8 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              <Bell className="size-4" />
              {totalReminders > 0 && (
                <span className="absolute -bottom-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-background">
                  {totalReminders}
                </span>
              )}
            </button>
            <button
              title="Fiyat Listesi"
              onClick={() => setIsPriceListOpen(true)}
              className="flex h-8 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              <ClipboardList className="size-4" />
            </button>
            <button
              title="Gider/Harcama Gir"
              onClick={() => setIsAddExpenseOpen(true)}
              className="flex h-8 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              <Wallet className="size-4" />
            </button>
            <button
              title="Yeni Müşteri Ekle"
              onClick={() => setIsAddCustomerOpen(true)}
              className="flex h-8 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              <UserPlus className="size-4" />
            </button>
          </div>
          </div>
        </header>

        <div className="flex flex-col flex-1 gap-6 px-4 pb-2 overflow-hidden min-h-0">
          {selectedCustomerId ? (
            <CustomerProfilePanel 
              customer={customers.find(c => c.id === selectedCustomerId)!}
              appointments={appointments}
              onBack={() => setSelectedCustomerId(null)}
              onEditCustomer={(updatedCustomer) => {
                setCustomers((prev) => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c))
                notify("Müşteri bilgileri güncellendi.")
              }}
              onMakeSaleClick={() => setIsMakeSaleOpen(true)}
              onAddAppointment={(apptData) => {
                const newAppt: Appointment = {
                  ...apptData,
                  id: `a${Date.now()}`
                }
                setAppointments((prev) => [...prev, newAppt])
                notify("Yeni randevu eklendi.")
              }}
              setHeaderContent={setHeaderContent}
              showToast={notify}
            />
          ) : (
            <>
              {view === "appointments" && (
                <AppointmentsPanel
                  appointments={appointments}
                  customers={customers}
                  users={users}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  onStatusChange={handleStatusChange}
                  setHeaderContent={setHeaderContent}
                  onEditAppointment={(id, updates) => {
                    setAppointments((prev) =>
                      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
                    )
                    notify("Randevu güncellendi.")
                  }}
                  onAddAppointment={(apptData) => {
                    const newAppt: Appointment = {
                      ...apptData,
                      id: `a${Date.now()}`
                    }
                    setAppointments((prev) => [...prev, newAppt])
                    notify("Yeni randevu eklendi.")
                  }}
                  onCustomerClick={setSelectedCustomerId}
                />
              )}

              {view === "customers" && <CustomersPanel customers={customers} onCustomerClick={setSelectedCustomerId} setHeaderContent={setHeaderContent} />}
              
              {view === "products" && (
                <ProductsPanel 
                  products={products} 
                  setHeaderContent={setHeaderContent} 
                  onAddProduct={(p) => {
                    setProducts(prev => [p, ...prev])
                    notify("Yeni ürün eklendi.")
                  }}
                  onMakeSaleClick={(p) => {
                    setPendingSaleProduct(p)
                    setIsSelectCustomerOpen(true)
                  }}
                />
              )}

              {view === "reports" && <ReportsPanel appointments={appointments} expenses={expenses} customers={customers} products={products} users={users} setHeaderContent={setHeaderContent} />}
              
              {view === "reminders" && <RemindersPanel appointments={appointments} customers={customers} products={products} setHeaderContent={setHeaderContent} notes={notes} setNotes={setNotes} showToast={notify} />}

              {view === "settings" && (
                <SystemSettingsView
                  setHeaderContent={setHeaderContent}
                  products={products}
                  setProducts={setProducts}
                  categories={categories}
                  setCategories={setCategories}
                  workingDays={workingDays}
                  setWorkingDays={setWorkingDays}
                  slotInterval={slotInterval}
                  setSlotInterval={setSlotInterval}
                  users={users}
                  setUsers={setUsers}
                  showToast={notify}
                />
              )}
            </>
          )}
        </div>
      </main>

      <AddCustomerModal
        open={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSave={(c) => {
          setCustomers((prev) => [c, ...prev])
          notify(`${c.firstName} ${c.lastName} kaydedildi.`)
        }}
      />

      <AddExpenseModal
        open={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSave={(e) => {
          setExpenses((prev) => [e, ...prev])
          notify("Harcama kaydedildi.")
        }}
      />

      <PriceListModal
        open={isPriceListOpen}
        onClose={() => setIsPriceListOpen(false)}
      />

      <MakeSaleModal 
        open={isMakeSaleOpen}
        onClose={() => {
          setIsMakeSaleOpen(false)
          setPendingSaleProduct(null)
        }}
        customer={selectedCustomerId ? customers.find(c => c.id === selectedCustomerId) || null : null}
        initialProduct={pendingSaleProduct}
        onSave={(newSales: any[]) => {
          mockCustomerSales.push(...newSales)
          notify("Satış tamamlandı ve raporlara eklendi.")
        }}
      />

      <SelectCustomerModal
        open={isSelectCustomerOpen}
        onClose={() => {
          setIsSelectCustomerOpen(false)
          setPendingSaleProduct(null)
        }}
        customers={customers}
        onSelect={(customerId) => {
          setSelectedCustomerId(customerId)
          setIsSelectCustomerOpen(false)
          setIsMakeSaleOpen(true)
        }}
      />

      <UserSettingsDrawer
        open={isUserSettingsOpen}
        onClose={() => setIsUserSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
      />

      <WelcomeModal
        open={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        appointmentCount={appointments.filter(a => a.date === todayISO).length}
        onAction={(targetView) => {
          handleNavigate(targetView)
          setIsWelcomeModalOpen(false)
        }}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium text-foreground shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
