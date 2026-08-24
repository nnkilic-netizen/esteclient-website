import { useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
}

export function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Silme İşlemini Onayla",
  message = "Bu kaydı silmek istediğinize emin misiniz?" 
}: ConfirmDeleteModalProps) {

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-background rounded-2xl w-full max-w-sm shadow-xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-border/50 bg-muted/30">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-500" />
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="size-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-muted-foreground text-center">
            {message}
          </p>
        </div>
        
        <div className="p-4 border-t border-border/50 bg-muted/30 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors"
          >
            İptal
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-400 transition-colors"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  )
}
