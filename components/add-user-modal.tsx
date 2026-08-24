import { useState, useRef, useEffect } from "react"
import { X, UserPlus, Upload, Image as ImageIcon } from "lucide-react"
import { CustomSelect } from "./ui/custom-select"

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (user: any) => void
  branches: { id: string, name: string }[]
}

export function AddUserModal({ isOpen, onClose, onSave, branches }: AddUserModalProps) {
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [startDate, setStartDate] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"owner" | "admin" | "staff">("staff")
  const [branchId, setBranchId] = useState("")
  const [localImage, setLocalImage] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setLocalImage(imageUrl)
    }
  }

  const handleSave = () => {
    if (!fullName || !username) return
    
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      fullName,
      username,
      phone,
      birthDate,
      startDate,
      role,
      branchId,
      isActive: true,
      avatarUrl: localImage || undefined
    })
    
    // Reset
    setFullName("")
    setUsername("")
    setPhone("")
    setBirthDate("")
    setStartDate("")
    setPassword("")
    setRole("staff")
    setBranchId("")
    setLocalImage(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0">
              <UserPlus className="size-4" />
            </div>
            <h2 className="font-semibold text-foreground">Yeni Personel Ekle</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="relative size-20 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted/50 overflow-hidden group">
              {localImage ? (
                <>
                  <img src={localImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setLocalImage(null)}
                      className="text-xs text-white font-medium hover:underline mb-1"
                    >
                      Sil
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-white font-medium hover:underline"
                    >
                      Değiştir
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <ImageIcon className="size-6 text-muted-foreground/50 mx-auto mb-1" />
                  <span className="text-[10px] text-muted-foreground font-medium">Fotoğraf</span>
                </div>
              )}
              
              {!localImage && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Upload className="size-5 text-primary" />
                </button>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">İsim Soyisim</label>
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" 
                placeholder="Örn: Ayşe Yılmaz" 
              />
            </div>
            
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Kullanıcı Adı</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" 
                placeholder="Örn: ayse.yilmaz" 
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Cep Telefonu</label>
              <input 
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" 
                placeholder="Örn: 0555 555 55 55" 
              />
            </div>
            
            <div className="col-span-1">
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Doğum Tarihi</label>
              <input 
                type="date" 
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" 
              />
            </div>

            <div className="col-span-1">
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">İşe Başlama Tarihi</label>
              <input 
                type="date" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" 
              />
            </div>
            
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Şifre</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Şube</label>
              <CustomSelect
                value={branchId}
                onChange={(val) => setBranchId(val as string)}
                options={[
                  { value: "", label: "Tüm Şubeler" },
                  ...branches.map(b => ({ value: b.id, label: b.name }))
                ]}
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Yetki</label>
              <CustomSelect 
                value={role}
                onChange={(val) => setRole(val as any)}
                options={[
                  { value: "owner", label: "Firma Yetkilisi (Tüm Şubeler)" },
                  { value: "admin", label: "Şube Yöneticisi Yetkisi" },
                  { value: "staff", label: "Kullanıcı Yetkisi" }
                ]}
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border/50 bg-muted/10 flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            İptal
          </button>
          <button 
            onClick={handleSave}
            disabled={!fullName || !username}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}
