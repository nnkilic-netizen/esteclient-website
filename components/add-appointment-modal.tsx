import { useState } from "react"
import { X, Calendar, CalendarPlus, Clock, Trash2 } from "lucide-react"
import { CustomSelect } from "./ui/custom-select"
import { Appointment } from "@/lib/demo-data"

const TIMESLOTS: string[] = []
for (let h = 9; h <= 19; h++) {
  for (let m = 0; m < 60; m += 15) {
    if (h === 19 && m > 0) break
    TIMESLOTS.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`)
  }
}

interface AddAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  customerName: string
  customerId: string
  appointments: Appointment[]
  onSave: (apptData: any) => void
  onCancelAppointment?: (id: string) => void
}

export function AddAppointmentModal({
  isOpen,
  onClose,
  customerName,
  customerId,
  appointments,
  onSave,
  onCancelAppointment
}: AddAppointmentModalProps) {
  if (!isOpen) return null

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [service, setService] = useState("İşlem")

  const handleSaveData = () => {
    if (!selectedTime) {
      alert("Lütfen bir saat seçin.")
      return
    }

    onSave({
      customerId,
      customerName,
      service: "Genel Randevu",
      serviceType: service,
      price: 0,
      date,
      time: selectedTime,
      status: "bekliyor"
    })
    
    // Reset state after saving
    setSelectedTime(null)
    setService("İşlem")
    onClose()
  }

  // Find all existing appointments for the selected date
  const dayAppointments = appointments.filter(a => a.date === date && a.status !== "iptal")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-background shadow-2xl transition-all sm:my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarPlus className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Yeni Randevu Ekle</h2>
              <p className="text-xs text-muted-foreground">
                {customerName} için randevu kaydı
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Randevu Tarihi</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value)
                    setSelectedTime(null) // Reset time when date changes
                  }}
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">İşlem Türü</label>
              <CustomSelect 
                value={service}
                onChange={(val) => setService(val as string)}
                options={[
                  { value: "İşlem", label: "İşlem" },
                  { value: "Kontrol", label: "Kontrol" },
                  { value: "Ön Görüşme", label: "Ön Görüşme" }
                ]}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Uygun Saatler</label>
              {selectedTime && (
                <span className="text-xs font-semibold text-primary">Seçilen: {selectedTime}</span>
              )}
            </div>
            
            <div className="max-h-[260px] overflow-y-auto rounded-xl border border-border/50 bg-muted/10 p-3 pr-2 scrollbar-thin">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {TIMESLOTS.map(time => {
                  const existingAppt = dayAppointments.find(a => a.time === time)
                  const isOccupied = !!existingAppt
                  const isSelected = selectedTime === time

                  return (
                    <div
                      key={time}
                      onClick={() => {
                        if (!isOccupied) setSelectedTime(time)
                      }}
                      className={`
                        relative flex flex-col items-center justify-center rounded-lg border py-1.5 px-1 transition-all group
                        ${isOccupied 
                          ? 'border-border/50 bg-muted/30 opacity-80 cursor-default' 
                          : isSelected
                            ? 'border-primary bg-primary text-primary-foreground shadow-sm scale-105 z-10 cursor-pointer'
                            : 'border-input bg-background hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                        }
                      `}
                    >
                      <span className={`text-xs font-semibold ${isOccupied ? 'text-muted-foreground' : ''}`}>
                        {time}
                      </span>
                      {isOccupied && (
                        <>
                          <span className="text-[9px] text-muted-foreground truncate w-full text-center mt-0.5 px-1 leading-tight">
                            {(() => {
                              const parts = existingAppt.customerName.trim().split(" ")
                              if (parts.length === 1) return existingAppt.customerName
                              const last = parts.pop()!
                              return `${parts.join(" ")} ${last.charAt(0).toUpperCase()}.`
                            })()}
                          </span>
                          {onCancelAppointment && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onCancelAppointment(existingAppt.id)
                              }}
                              title="Randevuyu İptal Et"
                              className="absolute -top-1 -right-1 size-5 bg-background border border-border rounded-full flex items-center justify-center text-red-500/70 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                            >
                              <Trash2 className="size-2.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border/50 bg-muted/30 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSaveData}
            disabled={!selectedTime}
            className="rounded-xl bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Randevuyu Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}
