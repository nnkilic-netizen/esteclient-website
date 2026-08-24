"use client"

import { useEffect } from "react"
import { Printer, X } from "lucide-react"

type PrintPreviewModalProps = {
  isOpen: boolean
  onClose: () => void
  companyName?: string
  reportTitle: string
  dateRange?: string | null
  columns: string[]
  rows: (string | number)[][]
  summary?: string
  chartNode?: React.ReactNode
}

export function PrintPreviewModal({ 
  isOpen, 
  onClose, 
  companyName = "GÜZELLİK MERKEZİ", 
  reportTitle, 
  dateRange,
  columns,
  rows,
  summary,
  chartNode
}: PrintPreviewModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:p-0 print:bg-white print:block backdrop-blur-sm print:backdrop-blur-none print-modal">
      <div className="bg-white shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col print:shadow-none print:w-full print:max-w-none print:max-h-none print:h-auto overflow-hidden print:overflow-visible relative">
        
        {/* Modal Header - Hidden when printing */}
        <div className="flex items-center justify-end p-4 border-b border-slate-200 bg-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center size-9 bg-black hover:bg-gray-800 text-white rounded transition-colors"
              title="Yazdır"
            >
              <Printer className="size-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-black hover:bg-slate-200 rounded transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Print Content Area (Unstyled, official document look) */}
        <div className="flex-1 overflow-y-auto p-12 print:p-0 custom-scrollbar print:overflow-visible bg-white text-black font-sans">
          
          <div className="print-content text-black max-w-4xl mx-auto w-full">
            {/* Document Header */}
            <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-xl font-bold uppercase tracking-wider mb-2">{companyName}</h1>
              <h2 className="text-lg font-semibold uppercase">{reportTitle}</h2>
              {dateRange && (
                <p className="text-sm mt-1">Tarih Aralığı: {dateRange}</p>
              )}
            </div>
            
            {/* Table or Chart */}
            {chartNode ? (
              <div className="w-full mt-8 mb-6 h-[400px]">
                {chartNode}
              </div>
            ) : (
              <table className="w-full text-left text-sm mb-6 border-collapse">
                <thead>
                  <tr className="border-b border-black">
                    {columns.map((col, idx) => (
                      <th key={idx} className="py-2 px-1 font-semibold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="py-4 text-center italic">Kayıt bulunamadı.</td>
                    </tr>
                  ) : (
                    rows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-gray-300">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2 px-1">{cell}</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Summary */}
            {summary && (
              <div className="text-right font-bold text-base mt-4 mb-12">
                {summary}
              </div>
            )}

            {/* Document Footer */}
            <div className="text-xs text-right mt-16 pt-4 border-t border-gray-400">
              <p>Rapor Tarihi: {new Date().toLocaleDateString("tr-TR")} {new Date().toLocaleTimeString("tr-TR", {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
