import { useState, useRef } from "react"
import { X, PackagePlus, Upload, Image as ImageIcon } from "lucide-react"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: any) => void
}

export function AddProductModal({ isOpen, onClose, onSave }: AddProductModalProps) {
  const [brand, setBrand] = useState("")
  const [name, setName] = useState("")
  const [unit, setUnit] = useState("")
  const [stock, setStock] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [localImage, setLocalImage] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      setLocalImage(url)
    }
  }

  const handleSave = () => {
    if (!name.trim()) {
      alert("Lütfen ürün adı giriniz.")
      return
    }

    const newProduct = {
      id: `p${Date.now()}`,
      brand: brand.trim() || undefined,
      name: name.trim(),
      unit: unit.trim() || undefined,
      stock: parseInt(stock) || 0,
      price: parseFloat(price) || 0,
      features: description.split(",").map(f => f.trim()).filter(f => f !== ""),
      imageUrl: localImage || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop"
    }

    onSave(newProduct)
    
    // Reset
    setBrand("")
    setName("")
    setUnit("")
    setStock("")
    setPrice("")
    setDescription("")
    setLocalImage(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-background shadow-2xl transition-all sm:my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PackagePlus className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Yeni Ürün Ekle</h2>
              <p className="text-xs text-muted-foreground">
                Stok ve ürün bilgisi tanımlama
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

        <div className="px-6 py-6 space-y-5">
          {/* Image Upload */}
          <div className="flex flex-col items-center gap-3">
            <div 
              className="relative flex size-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/50 hover:bg-muted transition-colors group"
              onClick={() => fileInputRef.current?.click()}
            >
              {localImage ? (
                <img src={localImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                  <ImageIcon className="size-6 mb-1 opacity-50" />
                  <span className="text-[10px] font-medium">Resim Seç</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="size-5 text-white mb-1" />
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Marka Adı</label>
                <input 
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Örn: L'Oreal"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Ölçü Birimi</label>
                <input 
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Örn: 50ml, 100gr"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Ürün Adı <span className="text-destructive">*</span></label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Nemlendirici Krem"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Stok Adedi</label>
                <input 
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Fiyat (₺)</label>
                <input 
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Özellikler (Aralarına virgül koyarak yazın)</label>
              <textarea 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cildi besler, Kuru ciltler için uygundur, E vitamini içerir"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border/50 bg-muted/30 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="rounded-xl bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ürünü Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}
