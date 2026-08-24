"use client"

import { useEffect } from "react"
import { Sparkles, Calendar, Bell, AlertTriangle } from "lucide-react"

export function WelcomeModal({ 
  userName = "Admin", 
  reminderCount = 2, 
  appointmentCount = 7,
  open, 
  onClose,
  onAction 
}: { 
  userName?: string; 
  reminderCount?: number; 
  appointmentCount?: number;
  open: boolean; 
  onClose?: () => void;
  onAction: (view: 'appointments' | 'reminders') => void 
}) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])
  if (!open) return null;

  // Format today's date in Turkish
  const today = new Date()
  const formattedDate = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    weekday: 'long'
  }).format(today)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 m-4">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-10" />
          </div>

          <h2 className="font-serif text-3xl font-bold text-foreground mb-1">Hoşgeldiniz,</h2>
          <h3 className="font-sans text-xl font-medium text-primary mb-6">{userName}</h3>

          <div className="flex flex-col gap-3 w-full bg-muted/30 rounded-2xl p-5 border border-border/50 text-left">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <Calendar className="size-5 text-muted-foreground shrink-0" />
              <span>Bugün günlerden <span className="font-semibold">{formattedDate}</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground">
              <Bell className="size-5 text-primary shrink-0" />
              <span>Bugüne dair <span className="font-bold text-primary">{reminderCount} adet</span> hatırlatmanız var.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground pt-3 mt-1 border-t border-border/50">
              <Calendar className="size-5 text-primary shrink-0" />
              <span>Bugün toplam <span className="font-bold text-primary">{appointmentCount} adet</span> randevunuz bulunmakta.</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 w-full rounded-2xl bg-amber-500/10 p-4 border border-amber-500/20 text-left">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-bold mb-0.5">
              <AlertTriangle className="size-4 shrink-0" />
              <span className="text-sm">Demo Sürümü Uyarı Notu</span>
            </div>
            <p className="text-xs text-amber-600/90 dark:text-amber-500/90 leading-relaxed font-medium">
              Bu bir demo ürünüdür. Veritabanı bağlantısı bulunmadığından bazı modüller tam çalışmaz. Ayrıca veriler arası tutarsızlık olabilir ve yaptığınız değişiklikler (gerçek bir sunucuya) kaydedilmez.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3 w-full">
            <button
              onClick={() => onAction('reminders')}
              className="flex-1 rounded-xl bg-secondary px-4 py-3.5 text-sm font-semibold text-secondary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Hatırlatmalar
            </button>
            <button
              onClick={() => onAction('appointments')}
              className="flex-1 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Randevular
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
