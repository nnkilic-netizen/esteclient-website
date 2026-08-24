"use client"

import { ArrowLeft, CheckCircle2, X } from "lucide-react"
import { mockUsers, type Customer } from "@/lib/demo-data"

type CartItem = any; // Will use the same type from MakeSaleModal

interface SaleSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
  cart: CartItem[]
  selectedPersonnel: string
  paymentType: 'pesin' | 'taksitli' | 'acik_hesap'
  paymentMethod: 'Nakit' | 'Kredi Kartı' | 'Havale'
  installmentCount: number
  saleNote: string
  rawTotal: number
  inlineDiscountTotal: number
  subTotal: number
  discountAmount: number
  finalTotal: number
  date?: Date // optional, default to now
  // Geri butonu yerine "Kapat" da olabilir
  backButtonText?: string
  onBack?: () => void
  // Satışı iptal et
  onCancelSale?: () => void
}

export function SaleSummaryModal({
  isOpen,
  onClose,
  customer,
  cart,
  selectedPersonnel,
  paymentType,
  paymentMethod,
  installmentCount,
  saleNote,
  rawTotal,
  inlineDiscountTotal,
  subTotal,
  discountAmount,
  finalTotal,
  date = new Date(),
  backButtonText = "Geri",
  onBack,
  onCancelSale
}: SaleSummaryModalProps) {
  if (!isOpen) return null

  const handlePrint = () => {
    const content = document.getElementById('receipt-content')?.innerHTML;
    if (content) {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
      
      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <html><head><title>Ödeme Özeti</title>
          <script src="https://cdn.tailwindcss.com"></script>
          </head><body class="p-8">
          ${content}
          <style>@media print { body { padding: 0 !important; } }</style>
          </body></html>
        `);
        doc.close();
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => { document.body.removeChild(iframe); }, 1000);
        }, 1000);
      }
    }
  }

  const handlePdfDownload = async () => {
    const element = document.getElementById('receipt-content');
    if (!element) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Makbuz_${customer?.firstName || 'Musteri'}_${customer?.lastName || ''}.pdf`);
    } catch (err: any) {
      console.error("PDF Hatası:", err);
      alert("PDF oluşturulurken bir hata oluştu: " + err?.message);
    }
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Satış Özeti\nMüşteri: ${customer?.firstName} ${customer?.lastName}\nToplam Tutar: ${finalTotal.toFixed(2)} ₺\nİşlem Yapan: ${mockUsers.find(u => u.id === selectedPersonnel)?.fullName || 'Belirtilmedi'}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  const handleEmail = () => {
    const subject = encodeURIComponent("Satış Özeti");
    const body = encodeURIComponent(`Merhaba ${customer?.firstName} ${customer?.lastName},\n\nSatış işleminiz başarıyla gerçekleşmiştir.\n\nToplam Tutar: ${finalTotal.toFixed(2)} ₺\nÖdeme Türü: ${paymentType === 'pesin' ? 'Peşin' : paymentType === 'taksitli' ? 'Taksitli' : 'Açık Hesap'}\n\nİyi günler dileriz.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-muted/95 backdrop-blur-sm sm:p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex-1 flex flex-col bg-white overflow-hidden rounded-2xl shadow-2xl mx-auto w-full max-w-4xl relative">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {onCancelSale && (
              <button onClick={onCancelSale} className="ml-4 flex items-center gap-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 p-2 px-3 rounded transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                Satışı İptal Et
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button title="Yazdır" onClick={handlePrint} className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            </button>
            <button title="PDF Olarak Kaydet" onClick={handlePdfDownload} className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </button>
            <button title="WhatsApp ile Gönder" onClick={handleWhatsApp} className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </button>
            <button title="E-Posta Gönder" onClick={handleEmail} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </button>
            <div className="w-px h-6 bg-border mx-1"></div>
            <button title="Kapat" onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-lg transition-colors">
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="flex-1 overflow-y-auto p-8 pb-16 bg-muted/10 flex justify-center">
          <div id="receipt-content" className="bg-white p-8 w-full max-w-2xl border border-gray-200 shadow-sm rounded-xl text-black text-sm">
            <div className="text-center border-b-2 border-black pb-4 mb-6">
              <h1 className="text-3xl font-black mb-1">BEAUTY SALON CRM</h1>
              <p className="text-gray-600">Satış ve Ödeme Özeti</p>
              <p className="text-xs text-gray-500 mt-2">Tarih: {date.toLocaleDateString('tr-TR')} {date.toLocaleTimeString('tr-TR')}</p>
            </div>

            <div className="mb-6 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800">Müşteri Bilgileri:</h3>
                <p>{customer?.firstName} {customer?.lastName}</p>
                <p>{customer?.phone}</p>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-gray-800">İşlem Yapan Personel:</h3>
                <p>{mockUsers.find(u => u.id === selectedPersonnel)?.fullName || 'Belirtilmedi'}</p>
              </div>
            </div>

            <table className="w-full mb-6 border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-left">
                  <th className="py-2">Hizmet / Ürün / Paket</th>
                  <th className="py-2 text-center">Adet</th>
                  <th className="py-2 text-right">Birim Tutar</th>
                  <th className="py-2 text-right">Toplam Tutar</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-3 pr-2">
                      <div className="font-semibold">{item.name}</div>
                      {item.type === 'custom_package' && item.builderItems && (
                        <div className="text-xs mt-2 space-y-1">
                          {item.builderItems.map((b: any, bIdx: number) => (
                            <div key={bIdx} className="flex items-center justify-between text-gray-500 pl-2 border-l-2 border-gray-200">
                              <span>- {b.name} {b.sessionCount && b.sessionCount > 0 ? `(${b.sessionCount} Seans${b.controlCount && b.controlCount > 0 ? `, ${b.controlCount} Kontrol` : ''})` : ''}</span>
                              <div className="flex gap-2">
                                {b.originalPrice > b.currentPrice && (
                                  <span className="line-through text-gray-400">{b.originalPrice.toFixed(2)} ₺</span>
                                )}
                                <span>{b.currentPrice.toFixed(2)} ₺</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {item.type === 'campaign' && item.builderItems && (
                        <div className="text-xs mt-2 space-y-1">
                          {item.builderItems.map((b: any, bIdx: number) => (
                            <div key={bIdx} className="flex items-center justify-between text-gray-500 pl-2 border-l-2 border-gray-200">
                              <span>- {b.name} {b.sessionCount && b.sessionCount > 0 ? `(${b.sessionCount} Seans${b.controlCount && b.controlCount > 0 ? `, ${b.controlCount} Kontrol` : ''})` : ''}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-center align-top">{item.quantity}</td>
                    <td className="py-3 text-right align-top">
                      <div className="flex flex-col items-end gap-0.5">
                        {item.originalPrice > item.price && (
                          <span className="line-through text-red-400 text-xs">{item.originalPrice.toFixed(2)} ₺</span>
                        )}
                        <span>{item.price.toFixed(2)} ₺</span>
                      </div>
                    </td>
                    <td className="py-3 text-right align-top">
                      <div className="flex flex-col items-end gap-0.5">
                        {item.originalPrice > item.price && (
                          <span className="line-through text-red-400 text-xs">{(item.originalPrice * item.quantity).toFixed(2)} ₺</span>
                        )}
                        <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} ₺</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="w-2/3 ml-auto mb-8 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Hizmet/Ürünler Toplamı:</span>
                <span>{rawTotal.toFixed(2)} ₺</span>
              </div>
              {inlineDiscountTotal > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Kalem/Paket İndirimleri:</span>
                  <span>-{inlineDiscountTotal.toFixed(2)} ₺</span>
                </div>
              )}
              {inlineDiscountTotal > 0 && (
                <div className="flex justify-between font-semibold border-t border-gray-200 pt-1 mt-1">
                  <span>Ara Toplam:</span>
                  <span>{subTotal.toFixed(2)} ₺</span>
                </div>
              )}
              {inlineDiscountTotal === 0 && (
                <div className="flex justify-between font-semibold">
                  <span>Ara Toplam:</span>
                  <span>{subTotal.toFixed(2)} ₺</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Sepet İndirimi:</span>
                  <span>-{discountAmount.toFixed(2)} ₺</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xl border-t-2 border-black pt-2 mt-2">
                <span>Genel Toplam:</span>
                <span>{finalTotal.toFixed(2)} ₺</span>
              </div>
            </div>

            <div className="border border-gray-300 p-4 rounded bg-gray-50">
              <h3 className="font-bold mb-2">Ödeme Detayları:</h3>
              <p>Ödeme Türü: {paymentType === 'pesin' ? 'Peşin' : paymentType === 'taksitli' ? `Taksitli (${installmentCount} Taksit)` : 'Açık Hesap'}</p>
              {paymentType === 'pesin' && <p>Ödeme Yöntemi: {paymentMethod}</p>}
              {saleNote && (
                <div className="mt-2">
                  <span className="font-semibold">Satış Notu: </span> {saleNote}
                </div>
              )}
            </div>
            
            <div className="mt-12 text-center text-xs text-gray-400">
              <p>Bizi tercih ettiğiniz için teşekkür ederiz.</p>
              <p>Beauty Salon CRM</p>
            </div>
            <div className="mt-8 flex justify-between px-8">
              <div className="text-center">
                <p className="font-semibold mb-8">Müşteri Adı Soyadı</p>
                <p className="border-t border-gray-400 pt-2 px-8">İmza</p>
              </div>
              <div className="text-center">
                <p className="font-semibold mb-8">Yetkili Adı Soyadı</p>
                <p className="border-t border-gray-400 pt-2 px-8">İmza</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
