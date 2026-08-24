"use client"

import { useState, useMemo, useEffect } from "react"
import { Bell, Cake, CreditCard, UserX, NotebookPen, Trash2, Plus, Calendar, MessageCircle, PackageOpen, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Appointment, Customer, Product } from "@/lib/demo-data"

export type Note = {
  id: string
  content: string
  date: string
}

export type RemindersPanelProps = {
  appointments: Appointment[]
  customers: Customer[]
  products: Product[]
  setHeaderContent: (content: React.ReactNode) => void
  notes: Note[]
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
  showToast?: (msg: string) => void
}

type ReminderTab = "birthday" | "notes"

export function RemindersPanel({ appointments, customers, products, setHeaderContent, notes, setNotes, showToast }: RemindersPanelProps) {
  const [activeTab, setActiveTab] = useState<ReminderTab>("birthday")
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [newNoteDate, setNewNoteDate] = useState(() => new Date().toISOString().split("T")[0])

  // Doğum Günü Olanlar (Basit mantık: Doğum tarihi bu ay olanları getirebiliriz, şimdilik mock olarak rastgele)
  const birthdayCustomers = useMemo(() => {
    // Sadece örnek veri gösterimi, normalde tarihe bakılır.
    return customers.slice(0, 2).map(c => ({
      ...c,
      birthdayMessage: "Bugün Doğum Günü!"
    }))
  }, [customers])

  useEffect(() => {
    setHeaderContent(
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 shadow-sm">
          <Bell className="size-7" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">Hatırlatmalar ve Notlar</h2>
          <p className="text-xs text-muted-foreground mt-0.5 mb-2.5">Doğum Günleri Ve Özel Hatırlatmalar.</p>
        </div>
      </div>
    )
    return () => setHeaderContent(null)
  }, [setHeaderContent])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddNoteModalOpen) {
        setIsAddNoteModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAddNoteModalOpen])

  const handleAddNote = () => {
    if (!newNote.trim() || !newNoteDate) return
    setNotes(prev => [
      { id: Date.now().toString(), content: newNote.trim(), date: newNoteDate },
      ...prev
    ])
    setNewNote("")
    setNewNoteDate(new Date().toISOString().split("T")[0])
    setIsAddNoteModalOpen(false)
    if (showToast) showToast("Not başarıyla kaydedildi")
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  return (
    <>
    <section className="flex flex-col flex-1 min-h-0 bg-background/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      <div className="flex flex-col shrink-0 rounded-2xl border border-border bg-card shadow-sm mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
           {/* TABS AS BADGES */}
           <div className="flex items-center gap-2">
             <button
               onClick={() => setActiveTab("birthday")}
               className={`flex items-center justify-center gap-1.5 px-2 py-1 rounded-md border transition-all duration-200 ease-out active:scale-95 shadow-sm text-[11px] font-medium ${
                 activeTab === "birthday" 
                  ? "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20" 
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
               }`}
             >
               <Cake className="size-3.5" />
               <span><strong className="text-[13px]">{birthdayCustomers.length}</strong> Doğum Günü</span>
             </button>
             
             <button
               onClick={() => setActiveTab("notes")}
               className={`flex items-center justify-center gap-1.5 px-2 py-1 rounded-md border transition-all duration-200 ease-out active:scale-95 shadow-sm text-[11px] font-medium ${
                 activeTab === "notes" 
                  ? "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20" 
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
               }`}
             >
               <NotebookPen className="size-3.5" />
               <span><strong className="text-[13px]">{notes.length}</strong> Hatırlatma</span>
             </button>
           </div>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === "birthday" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {birthdayCustomers.map(c => (
              <div key={c.id} className="bg-card border border-border/80 rounded-xl p-4 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={`${c.firstName} ${c.lastName}`} className="size-12 rounded-full object-cover shadow-sm border border-border shrink-0" />
                ) : (
                  <div className="size-12 rounded-full bg-accent font-serif text-lg font-semibold text-accent-foreground shadow-sm flex items-center justify-center shrink-0 uppercase">
                    {c.firstName[0] ?? ""}{c.lastName[0] ?? ""}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-foreground">{c.firstName} {c.lastName}</h4>
                  <p className="text-sm text-primary font-medium">{c.birthdayMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.phone}</p>
                </div>
                <button 
                  title="Mesaj At"
                  onClick={() => alert(`Doğum günü mesajı gönderiliyor: ${c.firstName} ${c.lastName}`)}
                  className="p-2 text-primary hover:text-primary-foreground hover:bg-primary rounded-lg transition-colors border border-border/60"
                >
                  <MessageCircle className="size-5" />
                </button>
              </div>
            ))}
            {birthdayCustomers.length === 0 && <p className="text-sm text-muted-foreground p-4">Bu ay doğum günü olan müşteri bulunmuyor.</p>}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="flex flex-col h-full bg-card rounded-xl border border-border/80 overflow-hidden shadow-sm relative pt-12">
            
            <div className="absolute top-3 right-3 z-10">
               <button 
                 title="Hatırlatma Ekle"
                 onClick={() => setIsAddNoteModalOpen(true)}
                 className="flex items-center justify-center size-8 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-opacity shadow-sm"
               >
                 <Plus className="size-5" />
               </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <NotebookPen className="size-12 mb-3 opacity-20" />
                  <p className="text-sm">Henüz hatırlatma eklemediniz.</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {notes.map(note => (
                    <li key={note.id} className="group flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-accent/50 transition-all">
                      <div className="mt-0.5"><Calendar className="size-4 text-muted-foreground" /></div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-primary mb-1">{note.date}</p>
                        <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
    
    {isAddNoteModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-background w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-muted/30">
            <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
              <NotebookPen className="size-5 text-primary" />
              Hatırlatma Ekle
            </h2>
            <button 
              onClick={() => setIsAddNoteModalOpen(false)}
              className="rounded-full p-2 text-muted-foreground hover:bg-black/5 hover:text-foreground transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
          
          <div className="p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground ml-1">Hatırlatma Tarihi</label>
              <input 
                type="date"
                value={newNoteDate}
                onChange={e => setNewNoteDate(e.target.value)}
                className="bg-background border border-input rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground cursor-pointer"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground ml-1">Not Detayı</label>
              <textarea 
                placeholder="Hatırlatma detayı yazın..." 
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAddNote()}
                rows={4}
                className="bg-background border border-input rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground resize-none"
              />
            </div>
          </div>
          
          <div className="p-4 sm:p-6 border-t border-border bg-muted/20 flex justify-end gap-3">
            <button
              onClick={() => setIsAddNoteModalOpen(false)}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors text-muted-foreground hover:bg-black/5 hover:text-foreground"
            >
              İptal
            </button>
            <button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="px-6 py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-semibold text-sm transition-opacity shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="size-4" />
              Kaydet
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
