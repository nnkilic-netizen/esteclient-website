# -*- coding: utf-8 -*-
with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Translate aria-labels
text = text.replace('aria-label="Dil seçimi"', "aria-label={language === 'tr' ? 'Dil seçimi' : language === 'en' ? 'Language selection' : 'Sélection de la langue'}")
text = text.replace("aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}", "aria-label={menuOpen ? (language === 'tr' ? 'Menüyü kapat' : language === 'en' ? 'Close menu' : 'Fermer le menu') : (language === 'tr' ? 'Menüyü aç' : language === 'en' ? 'Open menu' : 'Ouvrir le menu')}")
text = text.replace('aria-label="Kapat"', "aria-label={language === 'tr' ? 'Kapat' : language === 'en' ? 'Close' : 'Fermer'}")

# 2. Translate the Mobile Warning title
text = text.replace('<h3 className="text-lg font-bold">Mobil Uyumluluk Uyarısı</h3>', '<h3 className="text-lg font-bold">{language === \'tr\' ? \'Mobil Uyumluluk Uyarısı\' : language === \'en\' ? \'Mobile Compatibility Warning\' : \'Avertissement de Compatibilité Mobile\'}</h3>')

# 3. Translate PackagePage component entirely
package_page_tr = """export function PackagePage() {
  return <main className="min-h-screen bg-background text-foreground"><div className="mx-auto max-w-5xl px-5 py-12 lg:px-8"><Link href="/" className="text-sm font-semibold text-primary">Ana sayfaya dön</Link><div className="mt-16 max-w-2xl"><p className="text-sm font-semibold text-primary">EsteClient paketleri</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Salonunuz büyüdükçe, EsteClient yanınızda.</h1><p className="mt-5 text-lg leading-7 text-muted-foreground">Şeffaf fiyatlandırma, gizli ücret yok. İhtiyacınıza uygun paketi seçin.</p></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{plansTr.map((plan) => <article key={plan.name} className={`rounded-3xl border p-6 ${plan.featured ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'}`}><h2 className="text-xl font-semibold">{plan.name}</h2><p className={`mt-2 text-sm ${plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{plan.text}</p><p className="mt-8 text-4xl font-semibold">₺{plan.price}<span className="text-sm font-normal opacity-70"> / ay</span></p><ul className="mt-8 flex flex-col gap-4 text-sm">{plan.items.map((item) => <li key={item}><Check className="mr-2 inline size-4 text-primary" />{item}</li>)}</ul><Link href="/#iletisim" className={`mt-8 block rounded-full px-4 py-3 text-center text-sm font-semibold ${plan.featured ? 'bg-primary-foreground text-primary' : 'border border-border'}`}>İletişime geçin</Link></article>)}</div><div className="mt-16 grid gap-4 rounded-3xl bg-accent p-6 sm:grid-cols-3"><div><ShieldCheck className="size-5 text-primary" /><p className="mt-3 font-semibold">Güvenli altyapı</p><p className="mt-1 text-sm text-muted-foreground">Verileriniz güvende.</p></div><div><Zap className="size-5 text-primary" /><p className="mt-3 font-semibold">Hızlı başlangıç</p><p className="mt-1 text-sm text-muted-foreground">Dakikalar içinde hazır.</p></div><div><HeartHandshake className="size-5 text-primary" /><p className="mt-3 font-semibold">İnsan desteği</p><p className="mt-1 text-sm text-muted-foreground">İhtiyacınız olduğunda buradayız.</p></div></div></div></main>
}"""

package_page_new = """export function PackagePage() {
  const [language, setLanguage] = useState<'tr' | 'en' | 'fr'>('tr');
  useEffect(() => {
    // Attempt to sync language from localStorage if you add it later, or just default to TR.
  }, []);
  const plans = language === 'tr' ? plansTr : language === 'en' ? plansEn : plansFr;
  return <main className="min-h-screen bg-background text-foreground"><div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
    <div className="flex justify-between items-center">
      <Link href="/" className="text-sm font-semibold text-primary">{language === 'tr' ? 'Ana sayfaya dön' : language === 'en' ? 'Back to home' : 'Retour à l\\'accueil'}</Link>
      <div className="flex items-center gap-1 rounded-full border border-border/80 bg-card p-1 text-xs font-semibold" aria-label={language === 'tr' ? 'Dil seçimi' : language === 'en' ? 'Language selection' : 'Sélection de la langue'}>
        <button type="button" onClick={() => setLanguage('tr')} className={`rounded-full px-2 py-1 transition-colors ${language === 'tr' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`} aria-pressed={language === 'tr'}>TR</button>
        <button type="button" onClick={() => setLanguage('en')} className={`rounded-full px-2 py-1 transition-colors ${language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`} aria-pressed={language === 'en'}>EN</button>
        <button type="button" onClick={() => setLanguage('fr')} className={`rounded-full px-2 py-1 transition-colors ${language === 'fr' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`} aria-pressed={language === 'fr'}>FR</button>
      </div>
    </div>
    <div className="mt-16 max-w-2xl"><p className="text-sm font-semibold text-primary">{language === 'tr' ? 'EsteClient paketleri' : language === 'en' ? 'EsteClient packages' : 'Forfaits EsteClient'}</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{language === 'tr' ? 'Salonunuz büyüdükçe, EsteClient yanınızda.' : language === 'en' ? 'As your salon grows, EsteClient is with you.' : 'Au fur et à mesure que votre salon grandit, EsteClient est avec vous.'}</h1><p className="mt-5 text-lg leading-7 text-muted-foreground">{language === 'tr' ? 'Şeffaf fiyatlandırma, gizli ücret yok. İhtiyacınıza uygun paketi seçin.' : language === 'en' ? 'Transparent pricing, no hidden fees. Choose the package that suits your needs.' : 'Tarification transparente, sans frais cachés. Choisissez le forfait qui correspond à vos besoins.'}</p></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{plans.map((plan) => <article key={plan.name} className={`rounded-3xl border p-6 ${plan.featured ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'}`}><h2 className="text-xl font-semibold">{plan.name}</h2><p className={`mt-2 text-sm ${plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{plan.text}</p><p className="mt-8 text-4xl font-semibold">₺{plan.price}<span className="text-sm font-normal opacity-70">{plan.period}</span></p><ul className="mt-8 flex flex-col gap-4 text-sm">{plan.items.map((item) => <li key={item}><Check className="mr-2 inline size-4 text-primary" />{item}</li>)}</ul><Link href="/#iletisim" className={`mt-8 block rounded-full px-4 py-3 text-center text-sm font-semibold ${plan.featured ? 'bg-primary-foreground text-primary' : 'border border-border'}`}>{language === 'tr' ? 'İletişime geçin' : language === 'en' ? 'Contact us' : 'Contactez-nous'}</Link></article>)}</div><div className="mt-16 grid gap-4 rounded-3xl bg-accent p-6 sm:grid-cols-3"><div><ShieldCheck className="size-5 text-primary" /><p className="mt-3 font-semibold">{language === 'tr' ? 'Güvenli altyapı' : language === 'en' ? 'Secure infrastructure' : 'Infrastructure sécurisée'}</p><p className="mt-1 text-sm text-muted-foreground">{language === 'tr' ? 'Verileriniz güvende.' : language === 'en' ? 'Your data is safe.' : 'Vos données sont en sécurité.'}</p></div><div><Zap className="size-5 text-primary" /><p className="mt-3 font-semibold">{language === 'tr' ? 'Hızlı başlangıç' : language === 'en' ? 'Quick start' : 'Démarrage rapide'}</p><p className="mt-1 text-sm text-muted-foreground">{language === 'tr' ? 'Dakikalar içinde hazır.' : language === 'en' ? 'Ready in minutes.' : 'Prêt en quelques minutes.'}</p></div><div><HeartHandshake className="size-5 text-primary" /><p className="mt-3 font-semibold">{language === 'tr' ? 'İnsan desteği' : language === 'en' ? 'Human support' : 'Support humain'}</p><p className="mt-1 text-sm text-muted-foreground">{language === 'tr' ? 'İhtiyacınız olduğunda buradayız.' : language === 'en' ? 'We are here when you need us.' : 'Nous sommes là quand vous avez besoin de nous.'}</p></div></div></div></main>
}"""

# Need to replace the / ay with period on the main page plans block too
text = text.replace('<span className="text-sm font-normal opacity-70"> / ay</span>', '<span className="text-sm font-normal opacity-70">{plan.period}</span>')

# For package page replacing
text = text.replace(package_page_tr, package_page_new)


with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
