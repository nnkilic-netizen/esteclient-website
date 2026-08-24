'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Globe2,
  HeartHandshake,
  Menu,
  MessageCircle,
  Palette,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Wallet,
  X,
  Zap,
  Scissors,
  Flower2,
  Apple,
  Brain,
  Activity,
  Dumbbell,
  PhoneCall,
} from 'lucide-react'

const featuresTr = [
  { icon: ShieldCheck, title: 'Gelişmiş Yetkilendirme Modülü', text: 'Kritik finansal raporlar sadece size özel kalsın. Personel erişimlerini kısıtlayarak salonunuzun veri güvenliğini tam anlamıyla sağlayın.' },
  { icon: Users, title: 'Kapsamlı Müşteri Takip Modülü', text: 'Tüm müşteri geçmişi tek ekranda! Alınan paketleri, kalan seansları, taksit durumlarını ve kişisel bilgileri saniyeler içinde görüntüleyin.' },
  { icon: CalendarDays, title: 'Akıllı Randevu Modülü', text: 'Günlük ve haftalık takvim görünümleriyle çakışmalara son verin. Salonunuzun trafiğini eksiksiz, zahmetsiz ve hatasız planlayın.' },
  { icon: Wallet, title: 'Pratik Ön Muhasebe Modülü', text: 'Gelir, gider, taksit ve hizmet satışlarınızı tek tıkla yönetin. Detaylı filtrelemeler sayesinde kasanızın ve borç-alacak durumunuzun kontrolü her an elinizde olsun.' },
  { icon: BarChart3, title: 'Geniş Raporlama Modülü', text: 'İşletmenizin röntgenini çekin! Personel performansı, satış analizleri ve gelir-gider tabloları dahil 20’ye yakın farklı rapor çeşidiyle salonunuzun gidişatını her an kontrol altında tutun.' },
  { icon: Bell, title: 'Asistan Hatırlatma Modülü', text: 'İleri tarihli işlerinizi ve müşteri doğum günlerini aklınızda tutmayın. Zamanı geldiğinde programınız size özel asistanınız gibi haber versin.' },
  { icon: Smartphone, title: 'Entegre SMS Modülü', text: 'Otomatik mesajlarla randevuları hatırlatıp iptalleri önleyin. Doğum günleri ve özel günlerde atacağınız SMS\'lerle müşteri sadakatini zirveye taşıyın.' },
  { icon: Palette, title: 'Çeşitli Tema Modülü', text: 'Yazılımımızda yer alan 6 farklı tema seçeneği ile ekranınızı özgürce kişiselleştirin! İster yoğun günlerde gözlerinizi dinlendiren Koyu Tema, ister salonunuza ferahlık katan renkli tasarımlar... Kontrol de tarz da tamamen sizde!' },
]

const featuresEn = [
  { icon: ShieldCheck, title: 'Advanced Authorization Module', text: 'Keep critical financial reports private. Ensure your salon\'s data security by restricting staff access.' },
  { icon: Users, title: 'Comprehensive Customer Tracking', text: 'All customer history on a single screen! View purchased packages, remaining sessions, installments, and personal info in seconds.' },
  { icon: CalendarDays, title: 'Smart Appointment Module', text: 'Eliminate overlaps with daily and weekly calendar views. Plan your salon traffic perfectly and effortlessly.' },
  { icon: Wallet, title: 'Practical Pre-Accounting Module', text: 'Manage income, expenses, installments, and service sales with one click. Always have control over your finances with detailed filtering.' },
  { icon: BarChart3, title: 'Extensive Reporting Module', text: 'Take an x-ray of your business! Keep your salon under control 24/7 with nearly 20 different reports including staff performance and sales analysis.' },
  { icon: Bell, title: 'Assistant Reminder Module', text: 'Don\'t keep future tasks and customer birthdays in your mind. Your software will act as your personal assistant and remind you.' },
  { icon: Smartphone, title: 'Integrated SMS Module', text: 'Prevent cancellations by reminding appointments with automated messages. Maximize customer loyalty with SMS on special days.' },
  { icon: Palette, title: 'Various Themes Module', text: 'Freely customize your screen with 6 different theme options! Whether it\'s a Dark Theme to rest your eyes or colorful designs... You are in control!' },
]

const plansTr = [
  { 
    name: 'Lokal Masaüstü Paketi', 
    price: '40.000', 
    period: ' / tek seferlik',
    text: '', 
    items: [
      'SMS hariç tüm modüller (Gelişmiş Yetkilendirme, Kapsamlı Müşteri Takip, Akıllı Randevu, Pratik Ön Muhasebe, Geniş Raporlama, Asistan Hatırlatma)',
      'Ömür boyu kullanım hakkı',
      'İnternet gerekmez', 
      'Sistem verileriniz kendi bilgisayarınızda barındırılır.', 
      'Sınırsız müşteri kaydı ve sınırsız personel tanımlama.', 
      '1 Yıl Ücretsiz Destek: Kurulumdan itibaren ücretsiz teknik destek.'
    ],
    optionsTitle: '📌 Ekstra Hizmetler ve Opsiyonlar',
    options: [
      'SMS Modülü: 10.000 SMS Paketi – 2.000 TL',
      'Uzatılmış Destek: 1. yıl sonrası isteğe bağlı güncelleme ve teknik destek hizmeti – Aylık 500 TL'
    ]
  },
  { 
    name: 'Bulut Tabanlı Tek Şube Paketi', 
    price: '2.000', 
    period: ' / ay',
    altPrice: '18.000',
    altPeriod: ' / yıl peşin',
    text: '', 
    items: [
      'SMS hariç tüm modüller (Gelişmiş Yetkilendirme, Kapsamlı Müşteri Takip, Akıllı Randevu, Pratik Ön Muhasebe, Geniş Raporlama, Asistan Hatırlatma)',
      'Tüm cihazlardan özgürce yönetin',
      'Tek Şube için kullanım',
      'Çoklu Platform Erişimi: Web, tablet ve mobil uygulama ile kontrol cebinizde.',
      'Sınırsız Kapasite: Sınırsız müşteri kaydı ve personel tanımlama.',
      'Ücretsiz Destek: Abonelik boyunca teknik destek, veri yedekleme, güncellemeler ve bulut ücretleri fiyata dahildir.'
    ],
    optionsTitle: '📌 Ekstra Hizmetler ve Opsiyonlar',
    options: [
      'SMS Modülü: 10.000 SMS Paketi – 2.000 TL'
    ],
    featured: true 
  },
  { 
    name: 'Bulut Tabanlı Çoklu Şube Paketi', 
    price: '2.500', 
    period: ' / ay',
    altPrice: '25.000',
    altPeriod: ' / yıl peşin',
    text: '', 
    items: [
      'SMS hariç tüm modüller (Gelişmiş Yetkilendirme, Kapsamlı Müşteri Takip, Akıllı Randevu, Pratik Ön Muhasebe, Geniş Raporlama, Asistan Hatırlatma)',
      'Tüm cihazlardan özgürce yönetin',
      'Çoklu Şube Yönetimi: 3 şubeye kadar tek merkezden yetkilendirme ve kontrol.',
      'Çoklu Platform Erişimi: Web, tablet ve mobil uygulama ile kontrol cebinizde.',
      'Sınırsız Kapasite: Sınırsız müşteri kaydı ve personel tanımlama.',
      'Ücretsiz Destek: Abonelik boyunca teknik destek, veri yedekleme, güncellemeler ve bulut ücretleri fiyata dahildir.'
    ],
    optionsTitle: '📌 Ekstra Hizmetler ve Opsiyonlar',
    options: [
      'SMS Modülü: 10.000 SMS Paketi – 2.000 TL'
    ]
  },
]

const plansEn = [
  { 
    name: 'Local Desktop Package', 
    price: '40.000', 
    period: ' / one-time',
    text: '', 
    items: [
      'All modules except SMS (Authorization, Customer Tracking, Smart Appointment, Pre-Accounting, Reporting, Assistant Reminder)',
      'Lifetime usage rights',
      'No internet required', 
      'System data is hosted on your own computer.', 
      'Unlimited customer registration and staff definition.', 
      '1 Year Free Support: Free technical support starting from installation.'
    ],
    optionsTitle: '📌 Extra Services and Options',
    options: [
      'SMS Module: 10,000 SMS Package – 2,000 TL',
      'Extended Support: Optional updates and technical support after the 1st year – 500 TL/month'
    ]
  },
  { 
    name: 'Cloud-Based Single Branch Package', 
    price: '2.000', 
    period: ' / month',
    altPrice: '18.000',
    altPeriod: ' / year upfront',
    text: '', 
    items: [
      'All modules except SMS (Authorization, Customer Tracking, Smart Appointment, Pre-Accounting, Reporting, Assistant Reminder)',
      'Manage freely from all devices',
      'Usage for a Single Branch',
      'Multi-Platform Access: Control in your pocket with web, tablet, and mobile app.',
      'Unlimited Capacity: Unlimited customer registration and staff definition.',
      'Free Support: Technical support, data backup, updates, and cloud fees are included during the subscription.'
    ],
    optionsTitle: '📌 Extra Services and Options',
    options: [
      'SMS Module: 10,000 SMS Package – 2,000 TL'
    ],
    featured: true 
  },
  { 
    name: 'Cloud-Based Multi-Branch Package', 
    price: '2.500', 
    period: ' / month',
    altPrice: '25.000',
    altPeriod: ' / year upfront',
    text: '', 
    items: [
      'All modules except SMS (Authorization, Customer Tracking, Smart Appointment, Pre-Accounting, Reporting, Assistant Reminder)',
      'Manage freely from all devices',
      'Multi-Branch Management: Authorization and control from a single center for up to 3 branches.',
      'Multi-Platform Access: Control in your pocket with web, tablet, and mobile app.',
      'Unlimited Capacity: Unlimited customer registration and staff definition.',
      'Free Support: Technical support, data backup, updates, and cloud fees are included during the subscription.'
    ],
    optionsTitle: '📌 Extra Services and Options',
    options: [
      'SMS Module: 10,000 SMS Package – 2,000 TL'
    ]
  },
]

export function BeautyCrmSite() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' })
    }
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)

  useEffect(() => {
    if (!galleryOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = document.getElementById('gallery-slider');
      if (!container) return;
      if (e.key === 'ArrowRight') {
        container.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        container.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
      } else if (e.key === 'Escape') {
        setGalleryOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryOpen]);
  const [language, setLanguage] = useState<'tr' | 'en'>('tr')
  const [chatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)

  const sendMessage = () => {
    if (!message.trim()) return
    setMessage('')
    setSent(true)
  }

  const [mobileWarningOpen, setMobileWarningOpen] = useState(false)

  const handleDemoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      e.preventDefault()
      setMobileWarningOpen(true)
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md" aria-label="Ana navigasyon">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="#top" className="flex items-center gap-2 font-semibold tracking-tight" onClick={() => setMenuOpen(false)}>
            <img src="/esteclient-icon.png" alt="EsteClient Logo" className="h-10 w-10 object-contain" />
            <div className="flex flex-col">
              <span className="text-xl leading-none">EsteClient<span className="text-primary font-bold">-CRM</span></span>
              <span className="text-[10px] leading-tight text-muted-foreground uppercase tracking-wide font-semibold mt-1">{language === 'tr' ? 'Müşteri Takip Programı' : 'Customer Tracking Software'}</span>
            </div>
          </Link>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#ozellikler" className="transition-colors hover:text-foreground">{language === 'tr' ? 'Özellikler' : 'Features'}</a>
            <a href="#paketler" className="transition-colors hover:text-foreground">{language === 'tr' ? 'Paketler' : 'Pricing'}</a>
            <button onClick={() => setGalleryOpen(true)} className="transition-colors hover:text-foreground">{language === 'tr' ? 'Ekran Görüntüleri' : 'Screenshots'}</button>
            <a href="#isletmeler" className="transition-colors hover:text-foreground">{language === 'tr' ? 'Sektörler' : 'Industries'}</a>
            <a href="#sss" className="transition-colors hover:text-foreground">{language === 'tr' ? 'SSS' : 'FAQ'}</a>
            <a href="#iletisim" className="transition-colors hover:text-foreground">{language === 'tr' ? 'Bize ulaşın' : 'Contact Us'}</a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-1 rounded-full border border-border/80 bg-card p-1 text-xs font-semibold" aria-label="Dil seçimi">
              <Globe2 className="ml-2 size-3.5 text-muted-foreground" />
              <button type="button" onClick={() => setLanguage('tr')} className={`rounded-full px-2 py-1 transition-colors ${language === 'tr' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`} aria-pressed={language === 'tr'}>TR</button>
              <button type="button" onClick={() => setLanguage('en')} className={`rounded-full px-2 py-1 transition-colors ${language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`} aria-pressed={language === 'en'}>EN</button>
            </div>
            <a href="/demo" target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5" onClick={handleDemoClick}>{language === 'tr' ? 'Ücretsiz Deneyin (Demo Sürümü)' : 'Try for free (Demo)'} <ArrowRight className="ml-1 inline size-4" /></a>
          </div>
          <button className="rounded-lg p-2 md:hidden" aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="flex flex-col gap-4 border-t border-border/70 px-5 py-5 text-sm md:hidden"><div className="flex items-center gap-2"><Globe2 className="size-4 text-muted-foreground" /><span className="text-muted-foreground">Dil:</span><button type="button" onClick={() => setLanguage('tr')} className={`rounded-full px-3 py-1 ${language === 'tr' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`} aria-pressed={language === 'tr'}>Türkçe</button><button type="button" onClick={() => setLanguage('en')} className={`rounded-full px-3 py-1 ${language === 'en' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`} aria-pressed={language === 'en'}>English</button></div><a href="#ozellikler" onClick={() => setMenuOpen(false)}>{language === 'tr' ? 'Özellikler' : 'Features'}</a><a href="#paketler" onClick={() => setMenuOpen(false)}>{language === 'tr' ? 'Paketler' : 'Pricing'}</a><button className="text-left" onClick={() => { setGalleryOpen(true); setMenuOpen(false); }}>{language === 'tr' ? 'Ekran Görüntüleri' : 'Screenshots'}</button><a href="#isletmeler" onClick={() => setMenuOpen(false)}>{language === 'tr' ? 'Sektörler' : 'Industries'}</a><a href="#sss" onClick={() => setMenuOpen(false)}>{language === 'tr' ? 'SSS' : 'FAQ'}</a><a href="#iletisim" onClick={() => setMenuOpen(false)}>{language === 'tr' ? 'Bize ulaşın' : 'Contact Us'}</a><a href="/demo" target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-4 py-3 text-center text-primary-foreground" onClick={(e) => { setMenuOpen(false); handleDemoClick(e); }}>{language === 'tr' ? 'Ücretsiz Deneyin (Demo Sürümü)' : 'Try for free (Demo)'}</a></div>}
      </nav>

      <section id="top" className="relative mx-auto flex max-w-7xl flex-col items-center text-center px-5 pb-20 pt-16 lg:px-8 lg:pb-24 lg:pt-24 overflow-x-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-3 py-1.5 text-xs font-semibold text-primary"><span className="size-1.5 rounded-full bg-primary" /> {language === 'tr' ? 'Tüm salon ve merkezler için yeni nesil CRM' : 'Next-gen CRM for all salons and centers'}</div>
          <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.08]">{language === 'tr' ? <>İşletmeniz için <span className="text-primary">sade, kullanışlı, çoklu platform erişimli</span> ve güçlü müşteri takip programı.</> : <>A <span className="text-primary">simple, powerful</span> CRM for your business.</>}</h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">{language === 'tr' ? 'EsteClient; randevularınızı, müşterilerinizi, ürün ve hizmet satışlarınızı tek bir ekrandan yönetir. En güçlü yanı ise personel performansından gelir-gider analizine uzanan kapsamlı raporlama yapısıdır.' : 'EsteClient manages appointments, customers, product and service sales in one simple workspace. Track team performance and revenue-expense reports with clarity.'}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"><a href="/demo" target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-6 py-3.5 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-transform hover:-translate-y-0.5" onClick={handleDemoClick}>{language === 'tr' ? 'Ücretsiz Deneyin (Demo Sürümü)' : 'Try for free (Demo)'} <ArrowRight className="ml-2 inline size-4" /></a></div>
      </div>
      </section>

      <section className="bg-primary text-primary-foreground overflow-hidden py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{language === 'tr' ? 'Sınırsız Erişim ve Çoklu Platform Desteği' : 'Unlimited Access & Multi-Platform Support'}</h2>
            <p className="mt-5 text-lg leading-relaxed text-primary-foreground/80">{language === 'tr' ? 'İster internetsiz masaüstü sürümüyle lokalde güvenle çalışın, ister internet altyapısıyla web, tablet ve cep telefonunuzdan salonunuza dilediğiniz an bağlanın. Kesintisiz yönetimin özgürlüğünü yaşayın.' : 'Work securely locally without internet using the desktop version, or connect to your salon anytime from web, tablet, and mobile with our cloud infrastructure. Experience the freedom of uninterrupted management.'}</p>
          </div>
          <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
            <div className="absolute inset-0 -rotate-6 rounded-[2rem] bg-background/20 blur-2xl" />
            <img src="/hero-dashboard.jpg" alt="Platform Desteği" className="relative -rotate-3 scale-105 rounded-2xl border border-border/50 bg-card p-1 shadow-2xl shadow-black/20 transition-transform duration-500 hover:rotate-0 hover:scale-110" />
          </div>
        </div>
      </section>

      <section id="ozellikler" className="border-t border-border/50 bg-secondary/40 py-20 lg:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="max-w-2xl"><p className="text-base font-bold text-primary md:text-lg">{language === 'tr' ? 'Modüller' : 'Modules'}</p><h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{language === 'tr' ? 'Tüm salon süreçleri tek ekranda.' : 'All parts of salon management, on a single screen.'}</h2><p className="mt-4 leading-7 text-muted-foreground">{language === 'tr' ? 'Günlük operasyonu kolaylaştıran, ekibinizin hemen benimseyebileceği sade araçlar.' : 'Simple tools that facilitate daily operations and can be quickly adopted by your team.'}</p></div><div ref={scrollContainerRef} className="-mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 lg:-mx-8 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{(language === 'tr' ? featuresTr : featuresEn).map(({ icon: Icon, title, text }) => <article key={title} className="relative w-[85vw] shrink-0 snap-center overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 sm:w-[320px]"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-6" /></div><h3 className="mt-6 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div><div className="mt-4 hidden items-center justify-center gap-4 md:flex"><button onClick={scrollLeft} className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground" aria-label="Geri"><ChevronLeft className="size-5" /></button><button onClick={scrollRight} className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground" aria-label="İleri"><ChevronRight className="size-5" /></button></div></div></section>
      <section id="isletmeler" className="border-y border-border/50 bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-base font-bold text-primary md:text-lg">{language === 'tr' ? 'Sektörler' : 'Industries'}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{language === 'tr' ? 'Kimler için uygun?' : 'Who is it for?'}</h2>
          </div>
          <div className="relative mx-auto mt-12 flex w-full max-w-5xl overflow-hidden py-4">
            <div className="absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-secondary to-transparent" />
            <div className="absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-secondary to-transparent" />
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                animation: marquee 35s linear infinite;
              }
            `}</style>
            <div className="flex w-max animate-marquee items-center gap-10 pl-10 md:gap-20 md:pl-20">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-10 md:gap-20 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-muted-foreground"><Sparkles className="size-6 text-primary" /> <span className="font-medium text-lg">{language === 'tr' ? 'Güzellik Salonları' : 'Beauty Salons'}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Scissors className="size-6 text-primary" /> <span className="font-medium text-lg">{language === 'tr' ? 'Kuaförler' : 'Hairdressers'}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Flower2 className="size-6 text-primary" /> <span className="font-medium text-lg">{language === 'tr' ? 'SPA Merkezleri' : 'SPA Centers'}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Apple className="size-6 text-primary" /> <span className="font-medium text-lg">{language === 'tr' ? 'Diyetisyenler' : 'Dietitians'}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Brain className="size-6 text-primary" /> <span className="font-medium text-lg">{language === 'tr' ? 'Psikologlar & Danışmanlar' : 'Psychologists & Counselors'}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Activity className="size-6 text-primary" /> <span className="font-medium text-lg">{language === 'tr' ? 'Fizyoterapistler' : 'Physiotherapists'}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Dumbbell className="size-6 text-primary" /> <span className="font-medium text-lg">{language === 'tr' ? 'Pilates & Spor Salonları' : 'Pilates & Gyms'}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="paketler" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="max-w-2xl"><p className="text-base font-bold text-primary md:text-lg">{language === 'tr' ? 'Size uygun paket' : 'Right package for you'}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{language === 'tr' ? 'İhtiyacınız kadar, dilediğiniz zaman.' : 'As much as you need, whenever you want.'}</h2></div><div className="mt-12 grid gap-4 lg:grid-cols-3 items-stretch">{(language === 'tr' ? plansTr : plansEn).map((plan) => <article key={plan.name} className={`relative flex flex-col h-full rounded-3xl border p-6 ${plan.featured ? 'border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/15' : 'border-border/80 bg-card'}`}><h3 className="text-lg font-semibold">{plan.name}</h3>{plan.text && <p className={`mt-2 text-sm ${plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{plan.text}</p>}<div className="mt-7 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1"><p className={`${plan.altPrice ? 'text-3xl' : 'text-4xl'} font-semibold tracking-tight`}>₺{plan.price}<span className={`${plan.altPrice ? 'text-xs' : 'text-sm'} font-normal ${plan.featured ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>{plan.period}</span></p>{plan.altPrice && <p className="text-3xl font-semibold tracking-tight">₺{plan.altPrice}<span className={`text-xs font-normal ${plan.featured ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>{plan.altPeriod}</span></p>}</div><ul className={`mt-7 flex flex-col gap-3 text-sm ${plan.featured ? 'text-primary-foreground/85' : 'text-muted-foreground'}`}>{plan.items.map((item) => <li key={item} className="flex gap-2"><Check className={`mt-0.5 size-4 shrink-0 ${plan.featured ? 'text-primary-foreground' : 'text-primary'}`} /><span>{item}</span></li>)}</ul>{plan.optionsTitle && <div className="mt-auto pt-6 border-t border-border/50"><p className={`text-sm font-semibold ${plan.featured ? 'text-primary-foreground' : 'text-foreground'}`}>{plan.optionsTitle}</p><ul className={`mt-3 flex flex-col gap-2 text-sm ${plan.featured ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>{plan.options?.map((opt) => <li key={opt}>• {opt}</li>)}</ul></div>}</article>)}</div></section>

      <section className="border-y border-border/70 bg-accent/40"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="flex items-center gap-2 text-primary"><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /></div><blockquote className="mt-6 max-w-3xl text-2xl font-medium leading-snug tracking-tight sm:text-3xl">{language === 'tr' ? '“EsteClient ile randevu defteri ve karışık excel formlarından kurtulduk. Ekibim ne yapacağını biliyor, ben de müşterilerimle daha fazla ilgileniyorum.”' : '“We got rid of appointment books and messy excel sheets with EsteClient. My team knows what to do, and I spend more time with my clients.”'}</blockquote><div className="mt-6 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">S</div><div><p className="text-sm font-semibold">Sultan Kureş</p><p className="text-xs text-muted-foreground">{language === 'tr' ? 'Esteline Güzellik Merkezi, Gaziantep' : 'Esteline Beauty Center, Gaziantep'}</p></div></div></div></section>
      <section id="sss" className="mx-auto max-w-3xl px-5 py-20 lg:py-28"><p className="text-center text-base font-bold text-primary md:text-lg">{language === 'tr' ? 'Merak edilenler' : 'Curiosities'}</p><h2 className="mt-3 text-center text-3xl font-semibold tracking-tight sm:text-4xl">{language === 'tr' ? 'Sıkça sorulan sorular' : 'Frequently asked questions'}</h2><div className="mt-10 flex flex-col divide-y divide-border">{(language === 'tr' ? [['EsteClient nedir?','EsteClient, güzellik salonlarının randevu, müşteri, ekip, gelir takibi ve geniş raporlama seçeneklerini tek bir platformdan yapmasını sağlayan salon yönetim yazılımıdır.'],['Yeteri kadar raporlama mevcut mu?', 'Yazılımımızın en iddialı olduğu alan: Gelişmiş Raporlama Gücü! Personel performans analizlerinden ön muhasebe özetlerine kadar 20’den fazla detaylı rapor seçeneği sayesinde işletmenizdeki tüm süreçleri 7/24 kesintisiz kontrol altında tutun.'],['Kurulum için teknik bilgi gerekir mi?','Hayır. Bizimle irtibata geçtikten sonra yönlendirmelerimizi takip ederek dakikalar içinde kullanmaya başlayabilirsiniz.'],['Programı deneme imkanım var mı?', <>Evet. Tüm modülleri kullanabileceğiniz deneme sürümü için lütfen <a href="/demo" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">tıklayın</a>.</>],['Verilerim güvende mi?','Verileriniz güvenli sunucularda şifrelenir ve düzenli olarak yedeklenir. Hesabınıza sadece yetkilendirdiğiniz kişiler erişebilir.']] : [['What is EsteClient?','EsteClient is a salon management software that allows beauty salons to manage appointments, customers, team, income tracking, and extensive reporting options from a single platform.'],['Is there enough reporting?', 'Our software\'s most assertive area: Advanced Reporting Power! Keep all processes in your business under 24/7 control with more than 20 detailed report options from staff performance analysis to pre-accounting summaries.'],['Is technical knowledge required for installation?','No. After contacting us, you can start using it in minutes by following our directions.'],['Can I try the program?', <>Yes. Please <a href="/demo" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">click</a> for the trial version where you can use all modules.</>],['Is my data safe?','Your data is encrypted and backed up regularly on secure servers. Only authorized people can access your account.']]).map(([q,a], index) => <div key={q as string} className="py-5"><button className="flex w-full items-center justify-between gap-4 text-left font-medium" onClick={() => setFaqOpen(faqOpen === index ? null : index)} aria-expanded={faqOpen === index}><span>{q}</span><ChevronDown className={`size-5 shrink-0 text-muted-foreground transition-transform ${faqOpen === index ? 'rotate-180' : ''}`} /></button>{faqOpen === index && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{a}</p>}</div>)}</div></section>

      <section id="iletisim" className="bg-secondary"><div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 lg:grid-cols-2 lg:px-8"><div><p className="text-base font-bold text-primary md:text-lg">{language === 'tr' ? 'Tanışalım' : 'Let\'s meet'}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{language === 'tr' ? 'İşletmeniz için doğru çözümleri birlikte bulalım' : 'Let\'s find the right solutions for your business together'}</h2><p className="mt-4 leading-7 text-muted-foreground">{language === 'tr' ? 'Operasyonel verimliliğinizi artıracak yapay zeka destekli web sitesi, mobil uygulama ve masaüstü yazılım projelerinde yanınızdayız. İşletmenizin gereksinimlerine en uygun çözümleri birlikte planlamak için bizimle irtibata geçebilirsiniz.' : 'We are with you in AI-supported website, mobile app, and desktop software projects that will increase your operational efficiency. You can contact us to plan the most suitable solutions for your business requirements.'}</p></div><div className="flex justify-center lg:justify-end"><a href="tel:+905065728777" className="group flex items-center gap-4 transition-all duration-300 hover:-translate-y-1"><PhoneCall className="size-12 text-primary transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 sm:size-14" /><div className="flex flex-col text-left"><span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{language === 'tr' ? 'Bizi Hemen Arayın' : 'Call Us Now'}</span><span className="text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-4xl">0506 572 8777</span></div></a></div></div></section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><p>© 2026 EsteClient. {language === 'tr' ? 'Salonunuzun yeni çalışma arkadaşı.' : 'Your salon\'s new coworker.'}</p><div className="flex gap-5"><a href="#top" className="hover:text-foreground">{language === 'tr' ? 'Yukarı çık' : 'Back to top'}</a></div></footer>

      <a href="https://wa.me/905065728777?text=Merhaba,%20EsteClient%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener noreferrer" className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/25 transition-transform hover:scale-110" aria-label={language === 'tr' ? 'WhatsApp ile iletişim kurun' : 'Contact via WhatsApp'}><MessageCircle className="size-6" /></a>

      {galleryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
          <button onClick={() => setGalleryOpen(false)} className="absolute top-5 right-5 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors" aria-label="Kapat"><X className="size-6" /></button>
          <div id="gallery-slider" className="w-full h-full flex snap-x snap-mandatory overflow-x-auto items-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {Array.from({ length: 18 }, (_, i) => i + 1).map((num, i) => {
              const seoAlts = [
                'Güzellik salonu müşteri takip programı',
                'Kuaför randevu sistemi takvim',
                'SPA merkezleri personel yönetimi',
                'Diyetisyen danışan takip sistemi',
                'Fizyoterapist seans takibi',
                'Spor salonları üyelik yazılımı',
                'Güzellik salonu gelir gider',
                'Kuaför adisyon sistemi',
                'Online randevu yönetim paneli',
                'Müşteri sadakat ve SMS modülü',
                'Gelişmiş salon yönetim modülleri',
                'Danışan takip sistemleri',
                'Kuaför kasa ve stok takibi',
                'Güzellik merkezi detaylı raporlama',
                'Diyetisyen randevu sistemi',
                'Fizyoterapist hasta takip ekranı',
                'Güzellik salonu yazılımı',
                'Müşteri takip programı arayüzü'
              ];
              return (
              <div key={num} className="w-screen h-[100dvh] shrink-0 snap-center flex items-center justify-center p-4 sm:p-12">
                <img src={`/ss${num}.png`} alt={seoAlts[i] || 'Müşteri takip programı'} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
              </div>
            )})}
          </div>
        </div>
      )}
      {mobileWarningOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          <div className="bg-background p-6 rounded-2xl max-w-sm w-full shadow-2xl text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mb-4">
              <Smartphone className="size-6" />
            </div>
            <h3 className="text-lg font-bold">Mobil Uyumluluk Uyarısı</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {language === 'tr' ? 'Lütfen Demoyu Bilgisayarınızda deneyin. Mobil uyumu düzgün çalışmayabilir.' : 'Please try the demo on your computer. Mobile compatibility may not work properly.'}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a href="/demo" target="_blank" rel="noopener noreferrer" onClick={() => setMobileWarningOpen(false)} className="w-full block rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground text-center transition-transform hover:-translate-y-0.5">
                {language === 'tr' ? 'Yine de Devam Et' : 'Continue Anyway'}
              </a>
              <button onClick={() => setMobileWarningOpen(false)} className="w-full rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                {language === 'tr' ? 'Vazgeç' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export function PackagePage() {
  return <main className="min-h-screen bg-background text-foreground"><div className="mx-auto max-w-5xl px-5 py-12 lg:px-8"><Link href="/" className="text-sm font-semibold text-primary">← Ana sayfaya dön</Link><div className="mt-16 max-w-2xl"><p className="text-sm font-semibold text-primary">EsteClient paketleri</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Salonunuz büyüdükçe, EsteClient yanınızda.</h1><p className="mt-5 text-lg leading-7 text-muted-foreground">Şeffaf fiyatlandırma, gizli ücret yok. İhtiyacınıza uygun paketi seçin.</p></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{plansTr.map((plan) => <article key={plan.name} className={`rounded-3xl border p-6 ${plan.featured ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'}`}><h2 className="text-xl font-semibold">{plan.name}</h2><p className={`mt-2 text-sm ${plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{plan.text}</p><p className="mt-8 text-4xl font-semibold">₺{plan.price}<span className="text-sm font-normal opacity-70"> / ay</span></p><ul className="mt-8 flex flex-col gap-4 text-sm">{plan.items.map((item) => <li key={item}><Check className="mr-2 inline size-4 text-primary" />{item}</li>)}</ul><Link href="/#iletisim" className={`mt-8 block rounded-full px-4 py-3 text-center text-sm font-semibold ${plan.featured ? 'bg-primary-foreground text-primary' : 'border border-border'}`}>İletişime geçin</Link></article>)}</div><div className="mt-16 grid gap-4 rounded-3xl bg-accent p-6 sm:grid-cols-3"><div><ShieldCheck className="size-5 text-primary" /><p className="mt-3 font-semibold">Güvenli altyapı</p><p className="mt-1 text-sm text-muted-foreground">Verileriniz güvende.</p></div><div><Zap className="size-5 text-primary" /><p className="mt-3 font-semibold">Hızlı başlangıç</p><p className="mt-1 text-sm text-muted-foreground">Dakikalar içinde hazır.</p></div><div><HeartHandshake className="size-5 text-primary" /><p className="mt-3 font-semibold">İnsan desteği</p><p className="mt-1 text-sm text-muted-foreground">İhtiyacınız olduğunda buradayız.</p></div></div></div></main>
}
