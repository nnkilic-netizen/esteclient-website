"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { CalendarDays, Clock, Edit, Phone, History, Banknote, Plus, Search, X, ChevronLeft, ChevronRight, LayoutGrid, CalendarPlus, Check } from "lucide-react"
import { CustomSelect } from "@/components/ui/custom-select"
import { StatusDropdown } from "@/components/status-dropdown"
import { STATUS_META, type Appointment, type AppointmentStatus, type Customer, type User } from "@/lib/demo-data"

type AppointmentsPanelProps = {
  appointments: Appointment[]
  customers: Customer[]
  selectedDate: string
  onDateChange: (date: string) => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
  onEditAppointment: (id: string, updates: Partial<Appointment>) => void
  onAddAppointment: (appt: Omit<Appointment, "id">) => void
  onCustomerClick?: (id: string) => void
  setHeaderContent: (content: React.ReactNode) => void
  users: User[]
}

const TIME_SLOTS = [
  "08:00", "08:15", "08:30", "08:45",
  "09:00", "09:15", "09:30", "09:45",
  "10:00", "10:15", "10:30", "10:45",
  "11:00", "11:15", "11:30", "11:45",
  "12:00", "12:15", "12:30", "12:45",
  "13:00", "13:15", "13:30", "13:45",
  "14:00", "14:15", "14:30", "14:45",
  "15:00", "15:15", "15:30", "15:45",
  "16:00", "16:15", "16:30", "16:45",
  "17:00", "17:15", "17:30", "17:45",
  "18:00", "18:15", "18:30", "18:45",
  "19:00", "19:15", "19:30", "19:45",
  "20:00"
]

export function AppointmentsPanel({
  appointments,
  customers,
  selectedDate,
  onDateChange,
  onStatusChange,
  onEditAppointment,
  onAddAppointment,
  onCustomerClick,
  setHeaderContent,
  users
}: AppointmentsPanelProps) {
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState("")
  const [editTime, setEditTime] = useState("")
  const [popoverPos, setPopoverPos] = useState<React.CSSProperties | null>(null)
  
  const [addingWeeklyDate, setAddingWeeklyDate] = useState<string | null>(null)
  const [addingWeeklyTime, setAddingWeeklyTime] = useState<string | null>(null)
  const [addPopoverPos, setAddPopoverPos] = useState<React.CSSProperties | null>(null)

  const [hoveredCell, setHoveredCell] = useState<{ timeIndex: number, dayIndex: number } | null>(null)
  
  const [hoveredHour, setHoveredHour] = useState<string | null>(null)
  const [draggedOverTime, setDraggedOverTime] = useState<string | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily")
  const [hoveredApptTooltip, setHoveredApptTooltip] = useState<{ appt: Appointment, customer: Customer, pos: React.CSSProperties } | null>(null)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  useEffect(() => {
    if (scrollContainerRef.current && viewMode === "weekly") {
      setScrollbarWidth(scrollContainerRef.current.offsetWidth - scrollContainerRef.current.clientWidth)
    }
  }, [viewMode])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingId(null)
        setAddingSlotTime(null)
        setAddingWeeklyDate(null)
        setAddingWeeklyTime(null)
        setAddPopoverPos(null)
        setPopoverPos(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])


  const weekDays = useMemo(() => {
    const d = new Date(selectedDate)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(d.setDate(diff))
    
    const days = []
    for(let i = 0; i < 6; i++) {
      const nextDate = new Date(monday)
      nextDate.setDate(monday.getDate() + i)
      days.push(nextDate.toISOString().slice(0, 10))
    }
    return days
  }, [selectedDate])

  const WEEK_DAY_NAMES = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"]

  // Yeni Randevu Ekleme State'leri
  const [addingSlotTime, setAddingSlotTime] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [newService, setNewService] = useState("")

  const [selectedPersonnel, setSelectedPersonnel] = useState<string>("all")

  const filteredAppointmentsByPersonnel = useMemo(() => {
    if (selectedPersonnel === "all") return appointments
    return appointments.filter(a => a.personnelId === selectedPersonnel)
  }, [appointments, selectedPersonnel])

  const dayList = filteredAppointmentsByPersonnel.filter((a) => a.date === selectedDate)
  

  const handleDayChange = (offset: number) => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + offset)
    onDateChange(d.toISOString().slice(0, 10))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingId(null)
        setAddingSlotTime(null)
        setAddingWeeklyDate(null)
        setAddingWeeklyTime(null)
        setAddPopoverPos(null)
        setPopoverPos(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleEditClick = (id: string) => {
    const appt = appointments.find(a => a.id === id)
    if (appt) {
      setEditingId(id)
      setEditDate(appt.date)
      setEditTime(appt.time)
    }
    setAddingSlotTime(null)
    setPopoverPos(null)
  }

  const handleWeeklyEditClick = (e: React.MouseEvent, a: Appointment) => {
    e.stopPropagation()
    setEditingId(a.id)
    setEditDate(a.date)
    setEditTime(a.time)
    setAddingSlotTime(null)
    setAddingWeeklyDate(null)
    setAddingWeeklyTime(null)

    const rect = e.currentTarget.getBoundingClientRect()
    const winHeight = window.innerHeight
    const winWidth = window.innerWidth
    
    const style: React.CSSProperties = { position: "fixed", zIndex: 9999 }
    
    if (winHeight - rect.bottom > 260) {
      style.top = rect.bottom + 8
    } else {
      style.bottom = winHeight - rect.top + 8
    }
    
    if (winWidth - rect.right > 270) {
      style.left = rect.left
    } else {
      style.right = winWidth - rect.right
    }
    
    setPopoverPos(style)
  }

  const handleWeeklyAddClick = (e: React.MouseEvent, dateStr: string, time: string) => {
    e.stopPropagation()
    setEditingId(null)
    setAddingSlotTime(null)
    setAddingWeeklyDate(dateStr)
    setAddingWeeklyTime(time)

    const rect = e.currentTarget.getBoundingClientRect()
    const winHeight = window.innerHeight
    const winWidth = window.innerWidth
    
    const style: React.CSSProperties = { position: "fixed", zIndex: 9999 }
    
    if (winHeight - rect.bottom > 350) {
      style.top = rect.bottom + 8
    } else {
      style.bottom = winHeight - rect.top + 8
    }
    
    if (winWidth - rect.right > 300) {
      style.left = rect.left
    } else {
      style.right = winWidth - rect.right
    }
    
    setAddPopoverPos(style)
  }

  const handleSaveEdit = () => {
    if (editingId && editDate && editTime) {
      onEditAppointment(editingId, { date: editDate, time: editTime })
      setEditingId(null)
    }
  }

  const handleSaveNew = () => {
    const timeToUse = addingWeeklyTime || addingSlotTime
    const dateToUse = addingWeeklyDate || selectedDate

    if (!selectedCustomer || !newService || !timeToUse) return

    onAddAppointment({
      customerId: selectedCustomer.id,
      customerName: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
      service: newService,
      price: 0,
      date: dateToUse,
      time: timeToUse,
      status: "bekliyor"
    })

    // Reset formu
    setAddingSlotTime(null)
    setAddingWeeklyDate(null)
    setAddingWeeklyTime(null)
    setAddPopoverPos(null)
    setSearchQuery("")
    setSelectedCustomer(null)
  }

  const displayList = viewMode === "daily" ? dayList : filteredAppointmentsByPersonnel.filter(a => weekDays.includes(a.date))
  const totalAppts = displayList.length
  const cancelledAppts = displayList.filter(a => a.status === "iptal").length
  const completedAppts = displayList.filter(a => a.status === "geldi").length

  useEffect(() => {
    setHeaderContent(
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 shadow-sm">
          <CalendarDays className="size-7" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">Randevu Listesi</h2>
          <p className="text-xs text-muted-foreground mt-0.5 mb-2.5">Günlük Ve Haftalık Randevu Akışı Ve Yönetimi.</p>
        </div>
      </div>
    )
    return () => setHeaderContent(null)
  }, [totalAppts, cancelledAppts, completedAppts, setHeaderContent])

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return []
    const q = searchQuery.toLowerCase()
    return customers.filter(c => 
      c.firstName.toLowerCase().includes(q) || 
      c.lastName.toLowerCase().includes(q) ||
      c.phone.includes(q)
    ).slice(0, 5) // En fazla 5 sonuç göster
  }, [searchQuery, customers])

  return (
    <section className="flex flex-col flex-1 min-h-0 rounded-2xl border border-border bg-card shadow-sm">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-5">
        
        {/* BADGES (Left Side) */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center gap-1.5 px-2 py-1 rounded-md border border-primary/20 bg-primary/10 text-blue-600 shadow-sm text-[11px] font-medium"><strong className="text-[13px]">{totalAppts}</strong> Randevu</span>
          {cancelledAppts > 0 && <span className="flex items-center justify-center gap-1.5 px-2 py-1 rounded-md border border-primary/20 bg-primary/10 text-rose-900 shadow-sm text-[11px] font-medium"><strong className="text-[13px]">{cancelledAppts}</strong> İptal</span>}
          {completedAppts > 0 && <span className="flex items-center justify-center gap-1.5 px-2 py-1 rounded-md border border-primary/20 bg-primary/10 text-primary shadow-sm text-[11px] font-medium"><strong className="text-[13px]">{completedAppts}</strong> Tamamlanan</span>}
        </div>

        {/* ACTION BUTTONS (Right Side) */}
        <div className="flex items-center gap-1.5">
          {/* Personel Seçimi */}
          <div className="flex items-center gap-2 mr-4">
            <CustomSelect
              value={selectedPersonnel}
              onChange={(val) => setSelectedPersonnel(val as string)}
              options={[
                { value: "all", label: "Tümü" },
                ...users.map(u => ({ value: u.id, label: u.fullName }))
              ]}
              className="w-32 sm:w-48"
            />
          </div>

          <div className="flex items-center rounded-lg border border-input bg-background p-0.5 mr-4">
            <button
              onClick={() => setViewMode("daily")}
              className={`flex size-8 items-center justify-center rounded-md transition-colors ${viewMode === "daily" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              title="Günlük"
            >
              <CalendarDays className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`flex size-8 items-center justify-center rounded-md transition-colors ${viewMode === "weekly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              title="Haftalık"
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>

          <button
            onClick={() => handleDayChange(viewMode === "weekly" ? -7 : -1)}
            className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary shadow-sm transition-colors hover:bg-primary/25"
            title={viewMode === "weekly" ? "Önceki Hafta" : "Önceki Gün"}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => {
              const today = new Date()
              today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
              onDateChange(today.toISOString().slice(0, 10))
            }}
            className="flex h-8 items-center justify-center rounded-lg bg-primary/15 px-3 text-xs font-semibold text-primary shadow-sm transition-colors hover:bg-primary/25"
          >
            {viewMode === "weekly" ? "Bu Hafta" : "Bugün"}
          </button>
          <button
            onClick={() => handleDayChange(viewMode === "weekly" ? 7 : 1)}
            className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary shadow-sm transition-colors hover:bg-primary/25"
            title={viewMode === "weekly" ? "Sonraki Hafta" : "Sonraki Gün"}
          >
            <ChevronRight className="size-4" />
          </button>

          <label className="ml-2 flex items-center gap-2 rounded-lg border border-input bg-background/50 px-2.5 py-1.5 text-sm shadow-sm transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-[110px] bg-transparent text-foreground outline-none cursor-pointer"
            />
          </label>
        </div>

      </div>

      {viewMode === "weekly" ? (
        <div className="flex-1 p-4 bg-slate-50/50 flex flex-col min-h-0">
          <div 
            className="overflow-x-auto border border-border rounded-xl bg-card shadow-sm flex flex-col flex-1 min-h-0" 
            onMouseLeave={() => setHoveredCell(null)}
            onScroll={() => setEditingId(null)}
          >
            <div className="min-w-[800px] flex flex-col flex-1 min-h-0">
              {/* Haftalık Başlık Row */}
              <div 
                className="grid grid-cols-[55px_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-border bg-muted/30 shrink-0 rounded-t-xl"
                style={{ paddingRight: scrollbarWidth }}
              >
                <div className="p-2 border-r border-border font-medium text-center text-xs text-muted-foreground flex items-center justify-center">Saat</div>
                {weekDays.map((dateStr, i) => (
                  <div key={dateStr} className={`p-3 border-r border-border last:border-0 font-medium text-center transition-colors ${hoveredCell?.dayIndex === i ? 'bg-primary/10' : ''}`}>
                    <div className={`text-sm ${hoveredCell?.dayIndex === i ? 'text-primary font-bold' : 'text-foreground'}`}>{WEEK_DAY_NAMES[i]}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{dateStr.split("-").reverse().join(".")}</div>
                  </div>
                ))}
              </div>
              {/* Haftalık Gövde */}
              <div 
                ref={scrollContainerRef}
                className="flex flex-col flex-1 overflow-y-auto pb-4"
              >
              {TIME_SLOTS.map((time, timeIndex) => {
                const hasAnyAppt = weekDays.some(dateStr => appointments.some(a => a.date === dateStr && a.time === time))
                
                return (
                  <div key={time} className="grid grid-cols-[55px_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-border/50 last:border-0 transition-colors bg-transparent">
                    <div className={`border-r border-border text-center flex items-center justify-center transition-colors ${hasAnyAppt ? 'p-1 text-xs font-bold text-primary' : 'p-0 text-[9px] font-medium text-muted-foreground/40'} ${hoveredCell?.timeIndex === timeIndex ? 'bg-primary/10 text-primary' : ''}`}>
                      {time}
                    </div>
                  {weekDays.map((dateStr, dayIndex) => {
                    const appt = appointments.find(a => a.date === dateStr && a.time === time)
                    const customer = appt ? customers.find(c => c.id === appt.customerId) : null
                    
                    const isHoveredCol = hoveredCell?.dayIndex === dayIndex
                    const isHoveredRow = hoveredCell?.timeIndex === timeIndex
                    const isIntersection = isHoveredCol && isHoveredRow
                    
                    let cellBg = ""
                    if (isIntersection) {
                      cellBg = "bg-primary/20 shadow-inner z-10"
                    } else if (isHoveredCol || isHoveredRow) {
                      cellBg = "bg-primary/5 z-0"
                    }

                    return (
                      <div 
                        key={dateStr} 
                        className={`border-r border-border/50 last:border-0 relative transition-colors ${hasAnyAppt ? 'p-1 min-h-[45px]' : 'p-0 min-h-[20px]'} ${cellBg} ${!appt ? 'cursor-pointer' : ''}`}
                        onClick={(e) => {
                          if (!appt) handleWeeklyAddClick(e, dateStr, time)
                        }}
                        onMouseEnter={() => setHoveredCell({ timeIndex, dayIndex })}
                        onDragOver={(e) => {
                          e.preventDefault()
                          if (hoveredCell?.timeIndex !== timeIndex || hoveredCell?.dayIndex !== dayIndex) {
                            setHoveredCell({ timeIndex, dayIndex })
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          const apptId = e.dataTransfer.getData("text/plain")
                          if (apptId && !appt) {
                            onEditAppointment(apptId, { date: dateStr, time })
                          }
                        }}
                      >
                        {appt && customer && (() => {
                          const meta = STATUS_META[appt.status]
                          return (
                          <div 
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData("text/plain", appt.id)}
                            className={`rounded-md border p-1.5 h-full flex items-center justify-between gap-1 group/weekly cursor-grab active:cursor-grabbing relative transition-colors ${editingId === appt.id ? `ring-2 ring-primary border-primary ${meta.bg}` : `${meta.bg} border-transparent hover:brightness-95`}`}
                            onMouseEnter={(e) => {
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
                              hoverTimeoutRef.current = setTimeout(() => {
                                const tooltipW = 160
                                const tooltipH = 100
                                const margin = 8
                                
                                let t = rect.top - tooltipH - margin
                                let l = rect.left + (rect.width / 2) - (tooltipW / 2)

                                // Smart positioning: Bottom if too close to top (accounting for top navigation/header)
                                if (rect.top < tooltipH + 150) {
                                  t = rect.bottom + margin
                                }
                                
                                // Right/Left if too close to screen edges
                                if (l < margin) {
                                  l = rect.right + margin
                                  t = rect.top // Align with item
                                } else if (l + tooltipW > window.innerWidth - margin) {
                                  l = rect.left - tooltipW - margin
                                  t = rect.top // Align with item
                                }

                                setHoveredApptTooltip({ 
                                  appt, 
                                  customer, 
                                  pos: { position: 'fixed', top: t, left: l } 
                                })
                              }, 500)
                            }}
                            onMouseLeave={() => {
                              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
                              hoverTimeoutRef.current = setTimeout(() => {
                                setHoveredApptTooltip(null)
                              }, 300)
                            }}
                          >
                            <span 
                              className={`text-[11px] font-medium truncate leading-tight flex-1 hover:font-bold hover:underline cursor-pointer transition-all ${meta.text}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                onCustomerClick?.(appt.customerId)
                              }}
                            >
                              {customer.firstName} {customer.lastName}
                            </span>
                            <button 
                              onClick={(e) => handleWeeklyEditClick(e, appt)}
                              className={`${meta.text} opacity-0 group-hover/weekly:opacity-100 hover:opacity-80 transition-opacity p-0.5 rounded shrink-0`}
                            >
                              <Edit className="size-3.5" />
                            </button>
                          </div>
                          )
                        })()}
                      </div>
                    )
                  })}
                </div>
              )})}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TIMELINE GRID */
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-1 pb-20 mt-2">
          
          {Array.from({ length: 13 }, (_, i) => i + 8).map(h => {
            const hourStr = h.toString().padStart(2, "0")
            const slots = h === 20 ? ["20:00"] : [`${hourStr}:00`, `${hourStr}:15`, `${hourStr}:30`, `${hourStr}:45`]
            const isHourHovered = hoveredHour === hourStr
            
            return (
              <div 
                key={hourStr} 
                className="flex flex-col gap-2 pb-2 transition-all"
                onMouseLeave={() => {
                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
                  setHoveredHour(null)
                }}
              >
                {slots.map(time => {
                  const slotAppts = dayList.filter((a) => a.time === time)
                  const isHourStart = time.endsWith(":00")
                  const hasAppt = slotAppts.length > 0
                  const isAddingHere = addingSlotTime === time
                  
                  const isVisible = isHourStart || hasAppt || isAddingHere || isHourHovered

                  return (
                    <div 
                      key={time} 
                      className={`relative pl-8 ${isVisible ? 'block animate-in slide-in-from-top-1 fade-in duration-200' : 'hidden'}`}
                      onDragEnter={() => setDraggedOverTime(time)}
                      onDragLeave={() => {
                        if (draggedOverTime === time) setDraggedOverTime(null)
                      }}
                      onDragOver={(e) => {
                        e.preventDefault()
                        if (draggedOverTime !== time) setDraggedOverTime(time)
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        setDraggedOverTime(null)
                        const draggedId = e.dataTransfer.getData("text/plain")
                        if (draggedId) {
                           onEditAppointment(draggedId, { date: selectedDate, time })
                           setHoveredHour(null)
                        }
                      }}
                    >
                {/* Timeline Noktası */}
                <div className={`absolute -left-[9px] top-1.5 size-4 rounded-full border-2 border-white shadow-sm transition-colors ${hasAppt || isAddingHere ? 'bg-primary' : (isHourStart ? 'bg-slate-300' : 'bg-primary/20')}`} />
                
                {/* Saat Yazısı ve Boş Alana Tıklama */}
                <div 
                  className="flex items-center gap-4"
                  onDragEnter={() => {
                    if (isHourStart) {
                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
                      hoverTimeoutRef.current = setTimeout(() => {
                        setHoveredHour(hourStr)
                      }, 1000)
                    }
                  }}
                >
                  <span 
                    className={`${hasAppt || isAddingHere ? 'text-sm font-bold text-primary' : (isHourStart ? 'text-sm font-bold text-slate-400' : 'text-xs font-medium text-primary/60')} transition-all duration-200 origin-left ${!isAddingHere ? 'hover:scale-125 hover:text-primary hover:font-bold' : ''} ${draggedOverTime === time ? 'scale-125 text-primary font-bold' : ''} ${!hasAppt && !isAddingHere ? 'cursor-pointer' : ''}`}
                    title={!hasAppt && !isAddingHere ? "Randevu Ekle" : undefined}
                    onClick={() => {
                      if (!hasAppt && !isAddingHere) {
                        setAddingSlotTime(time)
                        setEditingId(null)
                      }
                    }}
                    onMouseEnter={() => {
                      if (isHourStart) {
                        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
                        hoverTimeoutRef.current = setTimeout(() => {
                          setHoveredHour(hourStr)
                        }, 1000)
                      }
                    }}
                  >
                    {time}
                  </span>
                  {!hasAppt && isAddingHere && <div className="h-px w-full bg-primary/20" />}
                </div>

                {/* YENİ RANDEVU EKLEME FORMU */}
                {isAddingHere && (
                  <div className="mb-2 relative rounded-xl border border-primary/30 bg-primary/5 p-3 shadow-sm max-w-4xl">
                    <div className="flex justify-between items-center bg-primary/10 border-b border-primary/20 -mx-3 -mt-3 mb-3 p-3 rounded-t-xl">
                      <div className="flex items-center gap-2">
                        <CalendarPlus className="size-4 text-primary" />
                        <h3 className="font-semibold text-sm text-primary">Yeni Randevu Oluştur ({time})</h3>
                      </div>
                      <button onClick={() => { setAddingSlotTime(null); setSelectedCustomer(null); setSearchQuery(""); }} className="p-1 text-slate-400 hover:text-primary rounded-lg transition-colors hover:bg-primary/10">
                        <X className="size-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Müşteri Arama */}
                      <div className="relative">
                        <label className="text-xs font-medium text-slate-500 uppercase mb-1.5 block">Müşteri Seçimi</label>
                        {!selectedCustomer ? (
                          <>
                            <div className="relative">
                              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                              <input 
                                type="text" 
                                placeholder="Müşteri adı veya telefon..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 pl-9 pr-4 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" 
                              />
                            </div>
                            {filteredCustomers.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                                {filteredCustomers.map(c => (
                                  <div 
                                    key={c.id} 
                                    onClick={() => { setSelectedCustomer(c); setSearchQuery(""); }}
                                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                                  >
                                    <div className="font-medium text-slate-800">{c.firstName} {c.lastName}</div>
                                    <div className="text-xs text-slate-500">{c.phone}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2">
                            <div>
                              <div className="font-medium text-slate-800">{selectedCustomer.firstName} {selectedCustomer.lastName}</div>
                              <div className="text-xs text-slate-500">{selectedCustomer.phone}</div>
                            </div>
                            <button onClick={() => setSelectedCustomer(null)} className="text-xs text-primary hover:underline">Değiştir</button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs font-medium text-slate-500 uppercase">İşlem</span>
                          <input 
                            type="text" 
                            placeholder="Örn: Saç Kesimi"
                            value={newService} 
                            onChange={(e) => setNewService(e.target.value)} 
                            className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" 
                          />
                        </label>
                      </div>

                      <div className="pt-2">
                        <button 
                          onClick={handleSaveNew} 
                          disabled={!selectedCustomer || !newService}
                          className="w-full flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <Plus className="size-4" />
                          Randevuyu Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mevcut Randevu Kartları */}
                {slotAppts.map((appt) => {
                  const customer = customers.find((c) => c.id === appt.customerId)
                  const isEditing = editingId === appt.id

                  return (
                    <div 
                      key={appt.id} 
                      draggable={!isEditing}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", appt.id)
                      }}
                      className={`mb-2 relative rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm transition-all hover:shadow-md max-w-4xl ${!isEditing ? "cursor-grab active:cursor-grabbing" : ""}`}
                    >
                      
                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center bg-primary/10 border-b border-primary/20 -mx-3 -mt-3 mb-3 p-3 rounded-t-xl">
                            <div className="flex items-center gap-2">
                              <Edit className="size-4 text-primary" />
                              <h3 className="font-semibold text-sm text-primary">Randevu Düzenle</h3>
                            </div>
                            <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:text-primary rounded-lg transition-colors hover:bg-primary/10">
                              <X className="size-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <label className="flex flex-col gap-1 text-xs">
                              <span className="font-medium text-slate-600">Tarih</span>
                              <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 outline-none focus:border-primary" />
                            </label>
                            <label className="flex flex-col gap-1 text-xs">
                              <span className="font-medium text-slate-600">Saat</span>
                              <CustomSelect
                                value={editTime} 
                                onChange={(val) => setEditTime(val as string)} 
                                options={TIME_SLOTS.map(t => ({ value: t, label: t }))}
                                className="w-24"
                              />
                            </label>
                          </div>
                          <div className="pt-1">
                            <button onClick={handleSaveEdit} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                              Kaydet
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          {/* Sol: Fotoğraf veya Baş Harfler */}
                          <div 
                            className="flex-shrink-0 cursor-pointer"
                            onClick={() => onCustomerClick?.(appt.customerId)}
                          >
                            {customer?.imageUrl ? (
                              <img 
                                src={customer.imageUrl} 
                                alt={appt.customerName} 
                                className="size-12 rounded-full object-cover shadow-sm" 
                              />
                            ) : (
                              <div className="flex size-12 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground shadow-sm">
                                {appt.customerName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* Sağ: İçerik */}
                          <div className="flex-1 flex flex-col gap-2">
                            {/* Kart Başlık ve Sağ Üst (Düzenle + Durum) */}
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div 
                                className="flex items-center gap-2 cursor-pointer hover:underline"
                                onClick={() => onCustomerClick?.(appt.customerId)}
                              >
                                <span className="font-semibold text-foreground text-[15px]">{appt.customerName}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <StatusDropdown
                                  value={appt.status}
                                  onChange={(s) => onStatusChange(appt.id, s)}
                                />
                                <button 
                                  onClick={() => handleEditClick(appt.id)}
                                  className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-200"
                                  title="Randevuyu Düzenle"
                                >
                                  <Edit className="size-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Kart Detayları */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60">
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Phone className="size-3.5 text-slate-400" />
                              <span>{customer?.phone || "Kayıtlı değil"}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <History className="size-3.5 text-slate-400" />
                              <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Son Ziyaret</span>
                                <span className="font-medium text-slate-700">{customer?.lastVisitDate || "-"}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <div className="flex flex-col pl-5">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Son İşlem</span>
                                <span className="font-medium text-slate-700 truncate">{customer?.lastService || "-"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        </div>
                      )}

                    </div>
                  )
                })}
              </div>
            )
          })}
              </div>
            )
          })}
          
        </div>
        </div>
      )}

      {/* HAFTALIK GÖRÜNÜM İÇİN SABİT DÜZENLEME MODALI */}
      {viewMode === "weekly" && editingId && popoverPos && (
        <div style={popoverPos} className="w-64 rounded-xl border border-border bg-card p-3 shadow-2xl flex flex-col gap-3 z-[9999]">
          <div className="flex justify-between items-center bg-primary/10 border-b border-primary/20 -mx-3 -mt-3 mb-3 p-3 rounded-t-xl">
            <div className="flex items-center gap-2">
              <Edit className="size-4 text-primary" />
              <h3 className="font-semibold text-sm text-primary">Randevu Düzenle</h3>
            </div>
            <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:text-primary rounded-lg transition-colors hover:bg-primary/10">
              <X className="size-4" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-medium text-muted-foreground">Tarih</span>
              <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="rounded-lg border border-input bg-background px-2 py-1.5 outline-none focus:border-primary" />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-medium text-muted-foreground">Saat</span>
              <CustomSelect
                value={editTime} 
                onChange={(val) => setEditTime(val as string)} 
                options={TIME_SLOTS.map(t => ({ value: t, label: t }))}
                className="w-24"
              />
            </label>
          </div>
          <div className="pt-1">
            <button onClick={handleSaveEdit} className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* HAFTALIK GÖRÜNÜM İÇİN TOOLTIP */}
      {viewMode === "weekly" && hoveredApptTooltip && (
        <div 
          className="z-[9999] bg-popover text-popover-foreground text-xs rounded-md shadow-xl border border-border p-2 w-[220px] animate-in fade-in zoom-in-95 duration-100"
          style={hoveredApptTooltip.pos as React.CSSProperties}
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
          }}
          onMouseLeave={() => setHoveredApptTooltip(null)}
        >
          <span className="font-bold border-b border-border/50 pb-1 mb-1 truncate block">{hoveredApptTooltip.customer.firstName} {hoveredApptTooltip.customer.lastName}</span>
          <div className="flex justify-between items-center text-[10px] py-0.5">
            <span className="text-muted-foreground">Saat:</span>
            <span className="font-medium">{hoveredApptTooltip.appt.time}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] pt-1 mt-1 border-t border-border/50">
            <span className="text-muted-foreground">Durum:</span>
            <div className="scale-90 origin-right -mr-1">
              <StatusDropdown
                value={hoveredApptTooltip.appt.status}
                onChange={(s) => onStatusChange(hoveredApptTooltip.appt.id, s)}
              />
            </div>
          </div>
        </div>
      )}

      {/* HAFTALIK GÖRÜNÜM İÇİN SABİT EKLEME MODALI */}
      {viewMode === "weekly" && addingWeeklyDate && addingWeeklyTime && addPopoverPos && (
        <div style={addPopoverPos} className="w-[300px] rounded-xl border border-border bg-card p-4 shadow-2xl flex flex-col gap-4 z-[9999] animate-in fade-in zoom-in-95 duration-200">
           <div className="flex justify-between items-center bg-primary/10 border-b border-primary/20 -mx-4 -mt-4 mb-3 px-4 py-3 rounded-t-xl">
             <div className="flex items-center gap-2">
               <CalendarPlus className="size-4 text-primary" />
               <h3 className="font-semibold text-sm text-primary">Yeni Randevu ({addingWeeklyTime})</h3>
             </div>
             <button onClick={() => { setAddingWeeklyDate(null); setAddingWeeklyTime(null); setSelectedCustomer(null); setSearchQuery(""); }} className="p-1 text-slate-400 hover:text-primary rounded-lg transition-colors hover:bg-primary/10">
               <X className="size-4" />
             </button>
           </div>
           
           <div className="flex flex-col gap-4">
              <div className="relative">
                <label className="text-xs font-medium text-slate-500 uppercase mb-1.5 block">Müşteri Seçimi</label>
                {!selectedCustomer ? (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="İsim veya telefon..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 pl-9 pr-4 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm" 
                      />
                    </div>
                    {filteredCustomers.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden max-h-32 overflow-y-auto">
                        {filteredCustomers.map(c => (
                          <div 
                            key={c.id} 
                            onClick={() => { setSelectedCustomer(c); setSearchQuery(""); }}
                            className="p-2 border-b last:border-0 hover:bg-slate-50 cursor-pointer"
                          >
                            <div className="text-sm font-medium">{c.firstName} {c.lastName}</div>
                            <div className="text-xs text-slate-500">{c.phone}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between bg-primary/10 text-primary px-3 py-2 rounded-lg border border-primary/20">
                    <span className="text-sm font-semibold">{selectedCustomer.firstName} {selectedCustomer.lastName}</span>
                    <button onClick={() => setSelectedCustomer(null)} className="text-primary/60 hover:text-primary">
                      <X className="size-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">İşlem</label>
                  <input type="text" value={newService} onChange={e => setNewService(e.target.value)} placeholder="Örn: Kesim" className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-primary" />
                </div>
              </div>
              
              <button 
                onClick={handleSaveNew}
                disabled={!selectedCustomer || !newService}
                className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                Randevu Oluştur
              </button>
            </div>
         </div>
       )}
    </section>
  )
}
