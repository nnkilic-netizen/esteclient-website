"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

import {
  CalendarDays,
  Users,
  UserPlus,
  Wallet,
  BarChart3,
  Settings,
  DatabaseBackup,
  LogOut,
  Sparkles,
  Tags,
  ShoppingBag,
  Bell,
  MessageCircle,
  UserCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Note } from "@/components/reminders-panel"

export type ViewKey = "appointments" | "customers" | "products" | "reports" | "price-list" | "reminders" | "settings"

type NavItem = {
  key: string
  label: string
  icon: typeof CalendarDays
  disabled?: boolean
}

const mainNav: NavItem[] = [
  { key: "appointments", label: "Randevular", icon: CalendarDays },
  { key: "customers", label: "Müşteriler", icon: Users },
  { key: "products", label: "Ürünler", icon: ShoppingBag },
  { key: "reports", label: "Raporlar", icon: BarChart3 },
  { key: "settings", label: "Sistem Ayarları", icon: Settings },
  { key: "sms", label: "SMS Modülü", icon: MessageCircle },
]

type SidebarProps = {
  activeView: ViewKey
  onNavigate: (key: string) => void
  notes?: Note[]
}

export function Sidebar({ activeView, onNavigate, notes }: SidebarProps) {
  const [showSmsModal, setShowSmsModal] = useState(false)
  const [noteIndex, setNoteIndex] = useState(0)
  const [isNoteExpanded, setIsNoteExpanded] = useState(false)
  const notesRef = useRef<HTMLDivElement>(null)

  const virtualNotes = notes && notes.length === 1 ? [notes[0], { ...notes[0], id: notes[0].id + '_copy' }] : (notes || [])

  useEffect(() => {
    if (virtualNotes.length === 0 || isNoteExpanded) return
    const interval = setInterval(() => {
      setNoteIndex(prev => (prev + 1) % virtualNotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [virtualNotes.length, isNoteExpanded])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notesRef.current && !notesRef.current.contains(e.target as Node)) {
        setIsNoteExpanded(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground relative overflow-hidden">

      
      {/* Logo & firma adı */}
      <div className="flex flex-col items-center justify-center gap-3 px-6 pt-8 pb-6 text-center relative z-10">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-white shadow-lg p-2">
          <Image src="/logo.png" alt="EstClient Logo" width={50} height={50} className="object-contain" />
        </div>
        <div className="leading-tight mt-1 flex flex-col items-center">
          <p className="font-serif text-xl font-semibold text-sidebar-accent-foreground tracking-wide">Firma Adı</p>
          <p className="mt-1 text-[11px] font-medium text-sidebar-foreground/70 uppercase tracking-widest">Güzellik Salonu</p>
          <div className="mt-2.5 flex items-center gap-2 text-[9px] text-sidebar-foreground/40 uppercase tracking-[0.2em]">
            <span className="h-px w-3 bg-sidebar-foreground/20"></span>
            <span>Gaziantep Şubesi</span>
            <span className="h-px w-3 bg-sidebar-foreground/20"></span>
          </div>
        </div>
      </div>

      <div className="mx-6 mb-2 h-px bg-sidebar-border" />

      {/* Ana menü */}
      <nav className="flex flex-1 flex-col gap-1.5 px-4 py-4">
        <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
          Menü
        </p>
        {mainNav.map((item) => {
          const Icon = item.icon
          const isActive = item.key === activeView
          return (
            <button
              key={item.key}
              onClick={() => {
                if (item.key === "sms") {
                  setShowSmsModal(true)
                } else if (!item.disabled) {
                  onNavigate(item.key)
                }
              }}
              disabled={item.disabled}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                item.disabled 
                  ? "opacity-50 cursor-not-allowed text-sidebar-foreground/50" 
                  : (isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
              )}
            >
              <Icon className="size-5 shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>

        <div className="px-6 py-2 mb-2 flex flex-col gap-0.5 text-right">
            {notes && notes.length > 0 && (
            <div 
              ref={notesRef}
              className="mt-2 flex flex-col bg-white rounded-md px-3 py-2 w-full shadow-sm border border-slate-100 cursor-pointer transition-all duration-300 relative"
              onClick={() => !isNoteExpanded && setIsNoteExpanded(true)}
            >
              <div className="flex items-start">
                <Bell className="size-3.5 text-slate-700 shrink-0 mr-2 mt-0.5" />
                
                <div className="flex-1 flex flex-col">
                  {/* EXPANDED CONTENT */}
                  <div className={`grid transition-all duration-500 ease-in-out ${isNoteExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="h-[100px] overflow-y-auto pr-1 pb-1">
                        <p className="text-[11px] font-semibold text-slate-700 text-left leading-[16px]">
                          {virtualNotes[noteIndex % virtualNotes.length]?.content}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* COLLAPSED CONTENT */}
                  <div className={`grid transition-all duration-500 ease-in-out ${!isNoteExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="relative h-[20px]">
                        <div 
                          className="flex flex-col transition-transform duration-500 ease-in-out" 
                          style={{ transform: `translateY(-${noteIndex * 20}px)` }}
                        >
                          {virtualNotes.map((n) => (
                            <div key={n.id} className="h-[20px] w-full flex flex-col justify-center">
                              <p className="text-[11px] font-semibold text-slate-700 truncate w-full text-left leading-[20px]" title={n.content}>
                                {n.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1.5 px-1">
                <div className="flex-1 flex items-center justify-start">
                  <span className="text-[10px] font-semibold text-slate-500 tracking-wide">
                    {(noteIndex % virtualNotes.length) + 1}/{virtualNotes.length}
                  </span>
                </div>
                <div className="flex-1 flex justify-end gap-0.5">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setNoteIndex(prev => (prev - 1 + virtualNotes.length) % virtualNotes.length); }}
                    className="p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setNoteIndex(prev => (prev + 1) % virtualNotes.length); }}
                    className="p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Alt küçük butonlar */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <BottomButton icon={UserCircle} label="Kullanıcı" onClick={() => onNavigate("user-settings")} />
          <BottomButton icon={DatabaseBackup} label="Yedekle" onClick={() => onNavigate("backup")} />
          <BottomButton icon={LogOut} label="Çıkış" danger onClick={() => onNavigate("logout")} />
        </div>
      </div>

      {/* SMS YETKİ MODALI */}
      {showSmsModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                <MessageCircle className="size-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800">Erişim Engellendi</h3>
                <p className="text-sm text-slate-600 font-medium uppercase tracking-wide">
                  SMS MODÜLÜNE YETKİNİZ BULUNMAMAKTADIR.
                </p>
              </div>
              <button
                onClick={() => setShowSmsModal(false)}
                className="mt-4 w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

function BottomButton({
  icon: Icon,
  label,
  onClick,
  danger,
  isActive,
}: {
  icon: any
  label: string
  onClick: () => void
  danger?: boolean
  isActive?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium transition-colors",
        danger
          ? "text-red-300 hover:bg-red-500/15 hover:text-red-200"
          : isActive 
            ? "bg-sidebar-primary/20 text-sidebar-primary-foreground shadow-sm"
            : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  )
}
