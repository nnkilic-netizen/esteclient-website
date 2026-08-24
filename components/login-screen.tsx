"use client"

import { useState } from "react"
import { Sparkles, Lock, User, ArrowRight } from "lucide-react"

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "admin" && password === "1234") {
      onLogin()
    } else {
      setError("Kullanıcı adı veya şifre hatalı!")
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sol Kısım - Karşılama Alanı */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col items-center justify-center p-12 text-primary-foreground relative overflow-hidden">
        {/* Dekoratif arka plan çemberleri */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-black/10 blur-[80px]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
          <div className="flex size-24 items-center justify-center rounded-3xl bg-white/20 text-white mb-8 shadow-xl backdrop-blur-sm">
            <Sparkles className="size-12" />
          </div>
          <h1 className="font-serif text-5xl font-bold mb-4 tracking-wide">Firma Adı</h1>
          <p className="text-xl font-medium text-white/80 uppercase tracking-widest mb-6">Güzellik Salonu Yönetim Sistemi</p>
          <p className="text-white/60 leading-relaxed">
            Müşteri yönetimi, randevu takibi, kasa raporları ve daha fazlasını tek bir ekranda kolayca yönetin.
          </p>
        </div>
      </div>

      {/* Sağ Kısım - Giriş Formu */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 md:p-20 relative bg-card text-card-foreground">
        
        {/* Mobil için logo (sadece küçük ekranda görünür) */}
        <div className="lg:hidden flex flex-col items-center mb-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm">
            <Sparkles className="size-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wide">Firma Adı</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-widest">Yönetim Sistemi</p>
        </div>

        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-10 text-left">
            <h2 className="text-3xl font-bold mb-2">Sisteme Giriş</h2>
            <p className="text-muted-foreground">Lütfen yönetici bilgilerinizi giriniz.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Kullanıcı Adı</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="size-5 text-muted-foreground/70" />
                  </div>
                  <input
                    type="text"
                    placeholder="Kullanıcı Adınızı Girin"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError("") }}
                    className="w-full pl-11 pr-4 py-3.5 bg-background border border-border/80 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Şifre</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="size-5 text-muted-foreground/70" />
                  </div>
                  <input
                    type="password"
                    placeholder="Şifrenizi Girin"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError("") }}
                    className="w-full pl-11 pr-4 py-3.5 bg-background border border-border/80 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all overflow-hidden mt-8"
            >
              <span className="relative z-10 flex items-center gap-2">
                Giriş Yap
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </form>
          
          <div className="mt-12 pt-6 border-t border-border/40 text-left text-xs text-muted-foreground/60 flex flex-col gap-1">
            <p className="font-medium text-muted-foreground/80">Sistem Giriş Bilgileri:</p>
            <p>Kullanıcı adı: <strong className="text-foreground/70">admin</strong></p>
            <p>Şifre: <strong className="text-foreground/70">1234</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}
