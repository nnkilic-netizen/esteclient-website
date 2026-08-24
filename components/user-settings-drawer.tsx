"use client"

import { useState, useEffect, useRef } from "react"
import { X, User, ChevronDown, Check, Palette, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { type ThemeKey } from "@/lib/themes"

const themes: { id: ThemeKey; name: string; desc: string; colors: string[] }[] = [
  { id: "emerald", name: "Zümrüt Yeşili", desc: "Ferah ve doğal bir görünüm", colors: ["bg-emerald-400", "bg-emerald-500", "bg-emerald-600"] },
  { id: "rose", name: "Gül Kurusu", desc: "Zarif ve sıcak bir atmosfer", colors: ["bg-rose-400", "bg-rose-500", "bg-rose-600"] },
  { id: "lavender", name: "Lavanta", desc: "Sakinleştirici ve modern", colors: ["bg-purple-400", "bg-purple-500", "bg-purple-600"] },
  { id: "gold", name: "Altın Sarısı", desc: "Premium ve lüks hissi", colors: ["bg-yellow-400", "bg-yellow-500", "bg-yellow-600"] },
  { id: "teal", name: "Turkuaz (Koyu)", desc: "Canlı ve enerjik", colors: ["bg-teal-500", "bg-teal-600", "bg-teal-700"] },
  { id: "black", name: "Gece Siyahı", desc: "Şık ve minimal", colors: ["bg-slate-700", "bg-slate-800", "bg-slate-900"] },
]

interface UserSettingsDrawerProps {
  open: boolean
  onClose: () => void
  theme: ThemeKey
  onThemeChange: (t: ThemeKey) => void
}

export function UserSettingsDrawer({
  open,
  onClose,
  theme,
  onThemeChange,
}: UserSettingsDrawerProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("theme")
  const [localAvatar, setLocalAvatar] = useState<string | null>(null)
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false)
  
  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLocalAvatar(url)
      setIsPhotoMenuOpen(false)
    }
  }

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLocalAvatar(null)
    setIsPhotoMenuOpen(false)
  }

  const handleChangePhotoClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    fileInputRef.current?.click()
    setIsPhotoMenuOpen(false)
  }

  // Prevent background scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [open])

  if (!open) return null

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id)
  }

  const AccordionItem = ({ id, title, icon: Icon, children }: { id: string, title: string, icon: any, children: React.ReactNode }) => {
    const isExpanded = expandedSection === id
    return (
      <div className={cn(
        "border rounded-xl overflow-hidden transition-all duration-200 mb-3",
        isExpanded 
          ? "border-primary shadow-md ring-1 ring-primary/20 bg-card" 
          : "border-border/60 bg-card shadow-sm"
      )}>
        <button
          onClick={() => toggleSection(id)}
          className={cn(
            "w-full flex items-center justify-between p-4 transition-colors",
            isExpanded ? "bg-primary/5 hover:bg-primary/10" : "bg-card hover:bg-muted/30"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg transition-colors",
              isExpanded ? "bg-primary text-primary-foreground shadow-sm" : "bg-primary/10 text-primary"
            )}>
              <Icon className="size-4" />
            </div>
            <span className={cn(
              "font-medium text-sm transition-colors",
              isExpanded ? "text-primary" : "text-foreground"
            )}>{title}</span>
          </div>
          <ChevronDown className={cn(
            "size-4 transition-transform duration-200", 
            isExpanded ? "text-primary rotate-180" : "text-muted-foreground"
          )} />
        </button>
        <div className={cn(
          "grid transition-all duration-500 ease-in-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}>
          <div className="overflow-hidden">
            <div className="p-4 border-t border-border/60 bg-card">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/60 bg-card/50 backdrop-blur-md">
          <h2 className="text-xl font-bold font-serif text-foreground">Kullanıcı Ayarları</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-1">
          <AccordionItem id="theme" title="Tema Ayarları" icon={Palette}>
            <div className="grid grid-cols-2 gap-3">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => onThemeChange(t.id)}
                  className={cn(
                    "flex flex-col p-3 rounded-xl border text-left transition-all",
                    theme === t.id 
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex -space-x-1.5">
                      {t.colors.map((color, idx) => (
                        <div key={idx} className={cn("size-5 rounded-full border-2 border-card shadow-sm", color)} />
                      ))}
                    </div>
                    {theme === t.id && <Check className="size-4 text-primary shrink-0" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-foreground leading-tight">{t.name}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight mt-1">{t.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </AccordionItem>
          
          <AccordionItem id="profile" title="Profil Bilgileri" icon={User}>
            <div className="space-y-4">
              
              <div className="flex justify-center mb-2">
                <div className="relative" ref={menuRef}>
                  <div 
                    className="relative flex size-20 items-center justify-center rounded-2xl bg-primary text-2xl font-serif font-bold text-primary-foreground shadow-md hover:shadow-lg overflow-hidden cursor-pointer group transition-all"
                    onClick={() => setIsPhotoMenuOpen(!isPhotoMenuOpen)}
                    title="Fotoğraf işlemleri"
                  >
                    {localAvatar ? (
                      <img 
                        src={localAvatar} 
                        alt="Kullanıcı Avatarı"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent text-accent-foreground text-[28px]">
                        SY
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="size-6 text-white" />
                    </div>
                  </div>

                  {isPhotoMenuOpen && (
                    <div className="absolute top-[88px] left-1/2 -translate-x-1/2 w-[140px] bg-popover rounded-lg border border-border shadow-xl overflow-hidden z-[60] text-xs font-medium animate-in slide-in-from-top-1 fade-in duration-200">
                      {localAvatar ? (
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
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Ad Soyad</label>
                <input type="text" className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" defaultValue="Sistem Yöneticisi" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Kullanıcı Adı</label>
                <input type="text" className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" defaultValue="admin" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Şifre Değiştir</label>
                <input type="password" placeholder="Yeni Şifre" className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <button className="w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm font-medium hover:bg-primary/90 transition-colors">Bilgileri Güncelle</button>
            </div>
          </AccordionItem>
        </div>
        

      </div>
    </>
  )
}
