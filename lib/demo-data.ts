export type AppointmentStatus = "bekliyor" | "cevapyok" | "ulasilmiyor" | "geldi" | "iptal" | "gelecek"

export type Appointment = {
  id: string
  customerId: string // Müşteri ile bağlamak için eklendi
  customerName: string
  personnelId?: string // Personel ile bağlamak için eklendi
  service: string
  serviceType?: "İşlem" | "Kontrol" | "Ön Görüşme"
  time: string
  date: string // YYYY-MM-DD
  status: AppointmentStatus
  price: number
  notes?: string
}

export type Customer = {
  id: string
  firstName: string
  lastName: string
  phone: string
  birthDate?: string
  note?: string
  visits: number
  totalSpent: number
  lastVisitDate?: string // Son geliş tarihi
  lastService?: string   // Son yaptırdığı işlem
  nextVisitDate?: string // Gelecek randevu tarihi
  registeredAt?: string
  debt?: number
  debtDueDate?: string
  imageUrl?: string
}

export const STATUS_META: Record<
  AppointmentStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  bekliyor: {
    label: "Bekliyor",
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  },
  cevapyok: {
    label: "Cevap Yok",
    bg: "bg-orange-100",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  ulasilmiyor: {
    label: "Ulaşılmıyor",
    bg: "bg-orange-100",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  gelecek: {
    label: "Gelecek",
    bg: "bg-blue-100",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  geldi: {
    label: "Geldi",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  iptal: {
    label: "İptal Etti",
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
  },
}

// Bugünün tarihi (demo için dinamik)
const today = new Date()
const iso = (d: Date) => d.toISOString().slice(0, 10)
const dateToday = iso(today)
const dateTomorrow = iso(new Date(today.getTime() + 86400000))
const dateDayAfter = iso(new Date(today.getTime() + 86400000 * 2))
const dateYesterday = iso(new Date(today.getTime() - 86400000))
const dateLastWeek = iso(new Date(today.getTime() - 86400000 * 7))

export const appointments: Appointment[] = [
  // C1 Appointments
  { id: "a1", customerId: "c1", personnelId: "u2", customerName: "Elif Yılmaz", service: "Saç Kesimi", serviceType: "İşlem", time: "09:30", date: dateToday, status: "geldi", price: 450 },
  { id: "a2", customerId: "c1", personnelId: "u3", customerName: "Elif Yılmaz", service: "Cilt Bakımı", serviceType: "İşlem", time: "11:00", date: dateYesterday, status: "geldi", price: 800 },
  { id: "a3", customerId: "c1", personnelId: "u2", customerName: "Elif Yılmaz", service: "Manikür", serviceType: "İşlem", time: "14:00", date: dateTomorrow, status: "bekliyor", price: 350 },
  
  // C2 Appointments
  { id: "a4", customerId: "c2", personnelId: "u3", customerName: "Selin Demir", service: "Kaş Tasarımı", serviceType: "İşlem", time: "10:15", date: dateToday, status: "cevapyok", price: 250 },
  { id: "a5", customerId: "c2", personnelId: "u2", customerName: "Selin Demir", service: "Saç Boyama", serviceType: "İşlem", time: "12:00", date: dateTomorrow, status: "bekliyor", price: 1200 },
  { id: "a6", customerId: "c2", personnelId: "u3", customerName: "Selin Demir", service: "Lazer Epilasyon", serviceType: "İşlem", time: "15:00", date: dateLastWeek, status: "geldi", price: 4000 },
  { id: "a7", customerId: "c2", personnelId: "u2", customerName: "Selin Demir", service: "Pedikür", serviceType: "İşlem", time: "09:00", date: dateDayAfter, status: "bekliyor", price: 450 },

  // C3 Appointments
  { id: "a8", customerId: "c3", personnelId: "u3", customerName: "Ayşe Kaya", service: "Keratin Bakımı", serviceType: "İşlem", time: "11:00", date: dateToday, status: "bekliyor", price: 1500 },
  { id: "a9", customerId: "c3", personnelId: "u2", customerName: "Ayşe Kaya", service: "Fön", serviceType: "İşlem", time: "13:30", date: dateYesterday, status: "geldi", price: 200 },
  { id: "a10", customerId: "c3", personnelId: "u3", customerName: "Ayşe Kaya", service: "İpek Kirpik", serviceType: "İşlem", time: "16:00", date: dateTomorrow, status: "bekliyor", price: 800 },
  
  // C4 Appointments
  { id: "a11", customerId: "c4", personnelId: "u2", customerName: "Zeynep Arslan", service: "Protez Tırnak", serviceType: "İşlem", time: "12:30", date: dateToday, status: "iptal", price: 1200 },
  { id: "a12", customerId: "c4", personnelId: "u3", customerName: "Zeynep Arslan", service: "Klasik Cilt Bakımı", serviceType: "İşlem", time: "14:45", date: dateLastWeek, status: "geldi", price: 800 },
  { id: "a13", customerId: "c4", personnelId: "u2", customerName: "Zeynep Arslan", service: "Hydrafacial", serviceType: "İşlem", time: "10:00", date: dateDayAfter, status: "bekliyor", price: 1500 },

  // C5 Appointments
  { id: "a14", customerId: "c5", personnelId: "u3", customerName: "Aslı Çelik", service: "Ombre", serviceType: "İşlem", time: "14:00", date: dateToday, status: "geldi", price: 2500 },
  { id: "a15", customerId: "c5", personnelId: "u2", customerName: "Aslı Çelik", service: "Saç Kesimi", serviceType: "İşlem", time: "09:30", date: dateYesterday, status: "geldi", price: 450 },
  { id: "a16", customerId: "c5", personnelId: "u3", customerName: "Aslı Çelik", service: "Dip Boya", serviceType: "İşlem", time: "11:30", date: dateTomorrow, status: "bekliyor", price: 600 },
]

export const revenueData = [
  { month: "Oca", revenue: 45000 },
  { month: "Şub", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Nis", revenue: 61000 },
  { month: "May", revenue: 59000 },
  { month: "Haz", revenue: 72000 },
]

export type ServicePrice = {
  id: string
  name: string
  category: string
  price: number
  duration: number
}

export const servicePrices: ServicePrice[] = [
  { id: "s1", name: "Saç Kesimi", category: "Saç", price: 500, duration: 45 },
  { id: "s2", name: "Saç Boyama (Dip)", category: "Saç", price: 1200, duration: 90 },
  { id: "s3", name: "Röfle / Ombre", category: "Saç", price: 2500, duration: 150 },
  { id: "s4", name: "Fön", category: "Saç", price: 200, duration: 30 },
  { id: "s5", name: "Keratin Bakımı", category: "Saç", price: 1500, duration: 120 },
  { id: "s6", name: "Manikür", category: "Tırnak", price: 350, duration: 45 },
  { id: "s7", name: "Pedikür", category: "Tırnak", price: 450, duration: 60 },
  { id: "s8", name: "Kalıcı Oje", category: "Tırnak", price: 400, duration: 45 },
  { id: "s9", name: "Protez Tırnak", category: "Tırnak", price: 1200, duration: 120 },
  { id: "s10", name: "Cilt Bakımı (Klasik)", category: "Cilt Bakımı", price: 800, duration: 60 },
  { id: "s11", name: "Hydrafacial", category: "Cilt Bakımı", price: 1500, duration: 60 },
  { id: "s12", name: "Lazer Epilasyon (Tüm Vücut)", category: "Epilasyon", price: 4000, duration: 60 },
  { id: "s13", name: "Kaş Tasarımı", category: "Kaş & Kirpik", price: 250, duration: 30 },
  { id: "s14", name: "İpek Kirpik", category: "Kaş & Kirpik", price: 800, duration: 90 },
  { id: "s15", name: "Kirpik Lifting", category: "Kaş & Kirpik", price: 600, duration: 60 },
]

export type CustomerServiceRecord = {
  id: string
  customerId: string
  date: string
  serviceType: "İşlem" | "Kontrol" | "Ön Görüşme"
  servicesDone: string[]
  notes: string
  staff: string
  price: number
  sessionNumber?: number
  linkedSaleId?: string
}

export type CustomerPayment = {
  id: string
  customerId: string
  date: string
  amount: number
  method: "Nakit" | "Kredi Kartı" | "Havale"
  type: "Tahsilat" | "İade"
  notes?: string
  isCancelled?: boolean
  cancelledBy?: string
  cancelDate?: string
  cancelReason?: string
}

export type CustomerSale = {
  id: string
  customerId: string
  personnelId?: string
  date: string
  productName: string
  quantity: number
  totalPrice: number
  totalSessions?: number
  contents?: string[]
  isCancelled?: boolean
  cancelledBy?: string
  cancelDate?: string
  cancelReason?: string
}

export const mockCustomerServices: CustomerServiceRecord[] = [
  { id: "cs1", customerId: "c1", date: dateToday, serviceType: "İşlem", servicesDone: ["Saç Kesimi"], notes: "Kısa model kesildi.", staff: "Ayşe K.", price: 450 },
  { id: "cs2", customerId: "c1", date: dateYesterday, serviceType: "İşlem", servicesDone: ["Cilt Bakımı"], notes: "Maske uygulandı.", staff: "Fatma Y.", price: 800 },
  { id: "cs3", customerId: "c2", date: dateLastWeek, serviceType: "İşlem", servicesDone: ["Lazer Epilasyon"], notes: "2. Seans.", staff: "Fatma Y.", price: 4000 },
  { id: "cs4", customerId: "c3", date: dateYesterday, serviceType: "İşlem", servicesDone: ["Fön"], notes: "Düz fön.", staff: "Ayşe K.", price: 200 },
  { id: "cs5", customerId: "c4", date: dateLastWeek, serviceType: "İşlem", servicesDone: ["Klasik Cilt Bakımı"], notes: "", staff: "Fatma Y.", price: 800 },
  { id: "cs6", customerId: "c5", date: dateToday, serviceType: "İşlem", servicesDone: ["Ombre"], notes: "Açıcı kullanıldı.", staff: "Fatma Y.", price: 2500 },
  { id: "cs7", customerId: "c5", date: dateYesterday, serviceType: "İşlem", servicesDone: ["Saç Kesimi"], notes: "", staff: "Ayşe K.", price: 450 },
]

export const mockCustomerPayments: CustomerPayment[] = [
  { id: "p1", customerId: "c1", date: dateToday, amount: 450, method: "Kredi Kartı", type: "Tahsilat" },
  { id: "p2", customerId: "c1", date: dateYesterday, amount: 800, method: "Nakit", type: "Tahsilat" },
  { id: "p3", customerId: "c2", date: dateLastWeek, amount: 2000, method: "Kredi Kartı", type: "Tahsilat" },
  { id: "p4", customerId: "c3", date: dateYesterday, amount: 200, method: "Havale", type: "Tahsilat" },
  { id: "p5", customerId: "c4", date: dateLastWeek, amount: 800, method: "Nakit", type: "Tahsilat" },
  { id: "p6", customerId: "c5", date: dateToday, amount: 2500, method: "Kredi Kartı", type: "Tahsilat" },
  { id: "p7", customerId: "c5", date: dateYesterday, amount: 450, method: "Nakit", type: "Tahsilat" },
  { id: "p_cancel_1", customerId: "c2", date: dateYesterday, amount: 500, method: "Nakit", type: "Tahsilat", isCancelled: true, cancelledBy: "Ayşe K.", cancelDate: dateToday, cancelReason: "Yanlış tutar girilmiş." },
]

export const mockCustomerSales: CustomerSale[] = [
  { id: "sl1", customerId: "c1", personnelId: "u2", date: dateToday, productName: "Keratin Şampuanı", quantity: 1, totalPrice: 450 },
  { id: "sl2", customerId: "c2", personnelId: "u3", date: dateLastWeek, productName: "Lazer Epilasyon Paketi (6 Seans)", quantity: 1, totalPrice: 3000, totalSessions: 6, contents: ["Tüm Bacak", "Koltuk Altı"] },
  { id: "sl3", customerId: "c3", personnelId: "u2", date: dateYesterday, productName: "Yüz Temizleme Jeli", quantity: 2, totalPrice: 300 },
  { id: "sl4", customerId: "c4", personnelId: "u3", date: dateLastWeek, productName: "Argan Yağı", quantity: 1, totalPrice: 250 },
  { id: "sl5", customerId: "c5", personnelId: "u2", date: dateToday, productName: "Güneş Kremi (50 SPF)", quantity: 1, totalPrice: 400 },
  { id: "sl6", customerId: "c2", personnelId: "u2", date: dateYesterday, productName: "Nemlendirici Krem", quantity: 1, totalPrice: 150, isCancelled: true, cancelledBy: "admin", cancelDate: dateToday, cancelReason: "İade" },
]

export const customers: Customer[] = [
  { id: "c1", firstName: "Elif", lastName: "Yılmaz", phone: "0532 *** ** 11", visits: 5, totalSpent: 2500, debt: 0, imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80", registeredAt: dateLastWeek },
  { id: "c2", firstName: "Selin", lastName: "Demir", phone: "0532 *** ** 11", visits: 3, totalSpent: 4250, debt: 2000, imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80", registeredAt: dateLastWeek },
  { id: "c3", firstName: "Ayşe", lastName: "Kaya", phone: "0532 *** ** 11", visits: 8, totalSpent: 3400, debt: 1500, imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80", registeredAt: dateLastWeek },
  { id: "c4", firstName: "Zeynep", lastName: "Arslan", phone: "0532 *** ** 11", visits: 4, totalSpent: 1800, debt: 0, imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop&q=80", registeredAt: dateLastWeek },
  { id: "c5", firstName: "Aslı", lastName: "Çelik", phone: "0532 *** ** 11", visits: 2, totalSpent: 2950, debt: 0, imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&auto=format&fit=crop&q=80", registeredAt: dateLastWeek },
]

export type Product = {
  id: string
  name: string
  brand?: string
  description?: string
  unit?: string
  imageUrl: string
  stock: number
  price: number
  features: string[]
  isActive?: boolean
}

export const products: Product[] = [
  {
    id: "prod_1",
    name: "Nemlendirici Yüz Kremi",
    brand: "L'Oreal",
    unit: "50ml",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80",
    stock: 24,
    price: 450,
    features: ["Tüm cilt tiplerine uygun", "Hyalüronik asit içerir", "24 saat nem desteği"]
  },
  {
    id: "prod_2",
    name: "Besleyici Vücut Losyonu",
    brand: "Nivea",
    unit: "250ml",
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&auto=format&fit=crop&q=80",
    stock: 12,
    price: 280,
    features: ["Kuru ciltler için ideal", "Shea yağı özlü", "Hızlı emilen formül"]
  },
  {
    id: "prod_3",
    name: "C Vitamini Yüz Serumu",
    brand: "Vichy",
    unit: "30ml",
    imageUrl: "https://images.unsplash.com/photo-1601049541289-9b1b7bbceca5?w=500&auto=format&fit=crop&q=80",
    stock: 5,
    price: 650,
    features: ["%10 Saf C Vitamini", "Leke karşıtı", "Aydınlatıcı etki"]
  },
  {
    id: "prod_4",
    name: "Arındırıcı Kil Maskesi",
    brand: "Kiehl's",
    unit: "100ml",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80",
    stock: 0,
    price: 350,
    features: ["Gözenek sıkılaştırıcı", "Yağ dengeleyici", "Haftada 2 kullanım"]
  },
  {
    id: "prod_5",
    name: "Güneş Koruyucu Krem (50 SPF)",
    brand: "La Roche-Posay",
    unit: "50ml",
    imageUrl: "https://images.unsplash.com/photo-1556228720-192a6af4e865?w=500&auto=format&fit=crop&q=80",
    stock: 35,
    price: 400,
    features: ["Yüksek koruma", "Suya dayanıklı", "Beyaz iz bırakmaz"]
  },
  {
    id: "prod_6",
    name: "Keratin Saç Bakım Yağı",
    brand: "Kerastase",
    unit: "50ml",
    imageUrl: "https://images.unsplash.com/photo-1611079830811-865ff4428d17?w=500&auto=format&fit=crop&q=80",
    stock: 8,
    price: 520,
    features: ["Isıya karşı koruma", "Kırık uç onarımı", "Elektriklenmeyi önler"]
  }
]

export interface CampaignPackage {
  id: string
  name: string
  description: string
  originalPrice: number
  price: number
  services: {
    id: string
    name: string
    sessionCount: number
    controlCount: number
    originalPrice: number
    currentPrice: number
  }[]
}

export const campaignPackages: CampaignPackage[] = [
  {
    id: "camp_1",
    name: "Yaza Hazırlık Lazer Paketi",
    description: "Tüm Vücut Lazer Epilasyon - 8 Seans",
    price: 4500,
    originalPrice: 6000,
    services: [
      { id: "srv_l1", name: "Tüm Vücut Lazer", sessionCount: 8, controlCount: 2, originalPrice: 6400, currentPrice: 4500 }
    ]
  },
  {
    id: "camp_2",
    name: "Cilt Yenileme Paketi",
    description: "4 Seans Hydrafacial + 2 Seans Dermapen",
    price: 3200,
    originalPrice: 4800,
    services: [
      { id: "srv_c2", name: "Hydrafacial", sessionCount: 4, controlCount: 0, originalPrice: 4000, currentPrice: 2000 },
      { id: "srv_c3", name: "Dermapen", sessionCount: 2, controlCount: 0, originalPrice: 1700, currentPrice: 1200 }
    ]
  },
  {
    id: "camp_3",
    name: "Gelin/Damat Paketi",
    description: "Saç/Türban Tasarımı, Porselen Makyaj ve Cilt Bakımı",
    price: 5500,
    originalPrice: 7500,
    services: [
      { id: "srv_s1", name: "Saç Tasarımı", sessionCount: 1, controlCount: 0, originalPrice: 1500, currentPrice: 1000 },
      { id: "srv_c1", name: "Klasik Cilt Bakımı", sessionCount: 1, controlCount: 0, originalPrice: 600, currentPrice: 500 },
      { id: "srv_m1", name: "Porselen Makyaj", sessionCount: 1, controlCount: 1, originalPrice: 2000, currentPrice: 1500 }
    ]
  }
]


export type ServiceItem = {
  id: string
  name: string
  price: number
  isActive?: boolean
}

export type ServiceCategory = {
  id: string
  name: string
  services: ServiceItem[]
  isActive?: boolean
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "cat_lazer",
    name: "Lazer Epilasyon",
    services: [
      { id: "srv_l1", name: "Tüm Vücut Lazer", price: 800 },
      { id: "srv_l2", name: "Yarım Kol Lazer", price: 300 },
      { id: "srv_l3", name: "Alt Bacak Lazer", price: 400 },
      { id: "srv_l4", name: "Koltuk Altı Lazer", price: 200 },
      { id: "srv_l5", name: "Bıyık / Çene Lazer", price: 150 },
    ]
  },
  {
    id: "cat_cilt",
    name: "Cilt Bakımı",
    services: [
      { id: "srv_c1", name: "Klasik Cilt Bakımı", price: 600 },
      { id: "srv_c2", name: "Hydrafacial", price: 1000 },
      { id: "srv_c3", name: "Dermapen", price: 850 },
      { id: "srv_c4", name: "Leke Tedavisi", price: 1200 },
    ]
  },
  {
    id: "cat_sac",
    name: "Saç İşlemleri",
    isActive: true,
    services: [
      { id: "srv_s1", name: "Saç Kesimi", price: 350, isActive: true },
      { id: "srv_s2", name: "Fön", price: 150, isActive: true },
      { id: "srv_s3", name: "Dip Boya", price: 600, isActive: true },
      { id: "srv_s4", name: "Ombre / Sombre", price: 2500, isActive: true },
      { id: "srv_s5", name: "Keratin Bakım", price: 1800, isActive: true },
    ]
  },
  {
    id: "cat_makyaj",
    name: "Makyaj",
    isActive: true,
    services: [
      { id: "srv_m1", name: "Porselen Makyaj", price: 1200, isActive: true },
      { id: "srv_m2", name: "Günlük Makyaj", price: 600, isActive: true },
      { id: "srv_m3", name: "Kalıcı Makyaj (Microblading)", price: 2500, isActive: true },
    ]
  }
]

export type UserRole = "owner" | "admin" | "staff"

export type User = {
  id: string
  username: string
  fullName: string
  role: UserRole
  isActive: boolean
  avatarUrl?: string
  phone?: string
  birthDate?: string
  startDate?: string
  branchId?: string
}

export const mockUsers: User[] = [
  { id: "u1", username: "admin", fullName: "Sistem Yöneticisi", role: "admin", isActive: true, avatarUrl: "https://i.pravatar.cc/150?u=u1", phone: "0532 *** ** 11", branchId: "branch1" },
  { id: "u2", username: "ayse.k", fullName: "Ayşe Kaya", role: "staff", isActive: true, avatarUrl: "https://i.pravatar.cc/150?u=u2", phone: "0532 *** ** 11", branchId: "branch1" },
  { id: "u3", username: "fatma.y", fullName: "Fatma Yılmaz", role: "staff", isActive: true, avatarUrl: "https://i.pravatar.cc/150?u=u3", phone: "0532 *** ** 11", branchId: "branch1" },
]

export type WorkingDay = {
  dayId: number // 1: Pazartesi, ..., 7: Pazar
  dayName: string
  isActive: boolean
  start: string
  end: string
}

export const mockWorkingDays: WorkingDay[] = [
  { dayId: 1, dayName: "Pazartesi", isActive: true, start: "09:00", end: "19:00" },
  { dayId: 2, dayName: "Salı", isActive: true, start: "09:00", end: "19:00" },
  { dayId: 3, dayName: "Çarşamba", isActive: true, start: "09:00", end: "19:00" },
  { dayId: 4, dayName: "Perşembe", isActive: true, start: "09:00", end: "19:00" },
  { dayId: 5, dayName: "Cuma", isActive: true, start: "09:00", end: "19:00" },
  { dayId: 6, dayName: "Cumartesi", isActive: true, start: "09:00", end: "19:00" },
  { dayId: 7, dayName: "Pazar", isActive: false, start: "09:00", end: "19:00" },
]
