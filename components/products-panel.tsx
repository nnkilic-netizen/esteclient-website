"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Search, ShoppingBag, Plus } from "lucide-react"
import type { Product } from "@/lib/demo-data"

type ProductsPanelProps = {
  products: Product[]
  setHeaderContent: (content: React.ReactNode) => void
  onAddProduct: (product: Product) => void
  onMakeSaleClick?: (product: Product) => void
}

export function ProductsPanel({ products, setHeaderContent, onAddProduct, onMakeSaleClick }: ProductsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [stockFilter, setStockFilter] = useState<"all" | "outOfStock" | "critical">("all")

  const filteredProducts = useMemo(() => {
    let result = products

    if (stockFilter === "outOfStock") {
      result = result.filter(p => p.stock === 0)
    } else if (stockFilter === "critical") {
      result = result.filter(p => p.stock > 0 && p.stock <= 10)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      )
    }
    
    return result
  }, [products, searchQuery, stockFilter])

  const totalProducts = products.length
  const outOfStockProducts = products.filter(p => p.stock === 0).length
  const criticalProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length

  useEffect(() => {
    setHeaderContent(
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 shadow-sm">
          <ShoppingBag className="size-7" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">Ürünler</h2>
          <p className="text-xs text-muted-foreground mt-0.5 mb-2.5">Sistemde Kayıtlı Satış Ürünleri.</p>
        </div>
      </div>
    )
    return () => setHeaderContent(null)
  }, [setHeaderContent])

  return (
    <section className="flex flex-col h-full rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-5 shrink-0">
        
        {/* BADGES (Left Side) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStockFilter("all")}
            className={`flex items-center justify-center gap-1.5 px-2 py-1 rounded-md border transition-all duration-200 ease-out active:scale-95 shadow-sm text-[11px] font-medium ${
              stockFilter === "all"
                ? "border-primary/20 bg-primary/10 text-blue-600 hover:bg-primary/20"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <strong className="text-[13px]">{totalProducts}</strong> Toplam Ürün
          </button>
          
          {outOfStockProducts > 0 && (
            <button
              onClick={() => setStockFilter("outOfStock")}
              className={`flex items-center justify-center gap-1.5 px-2 py-1 rounded-md border transition-all duration-200 ease-out active:scale-95 shadow-sm text-[11px] font-medium ${
                stockFilter === "outOfStock"
                  ? "border-primary/20 bg-primary/10 text-rose-900 hover:bg-primary/20"
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <strong className="text-[13px]">{outOfStockProducts}</strong> Satışa Kapalı
            </button>
          )}
          
          {criticalProducts > 0 && (
            <button
              onClick={() => setStockFilter("critical")}
              className={`flex items-center justify-center gap-1.5 px-2 py-1 rounded-md border transition-all duration-200 ease-out active:scale-95 shadow-sm text-[11px] font-medium ${
                stockFilter === "critical"
                  ? "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <strong className="text-[13px]">{criticalProducts}</strong> Kritik Stok
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* BODY - GRID */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              Arama kriterlerine uygun ürün bulunamadı.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-muted/30">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Stock Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                      product.stock > 10 
                        ? 'bg-emerald-500/90 text-white' 
                        : product.stock > 0 
                          ? 'bg-amber-500/90 text-white' 
                          : 'bg-red-500/90 text-white'
                    }`}>
                      {product.stock > 0 ? `${product.stock} STOK` : 'TÜKENDİ'}
                    </span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="flex flex-col flex-1 p-4">
                  {product.brand && (
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                      {product.brand}
                    </div>
                  )}
                  <h3 className="font-semibold text-foreground line-clamp-2 min-h-[40px]">
                    {product.name} {product.unit && <span className="text-muted-foreground font-normal whitespace-nowrap">({product.unit})</span>}
                  </h3>
                  
                  <div className="mt-3 flex-1">
                    <ul className="flex flex-col gap-1.5">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-1 size-1 shrink-0 rounded-full bg-primary/40" />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <div className="font-serif font-semibold text-lg text-foreground">
                      {product.price} ₺
                    </div>
                    <button 
                      onClick={() => onMakeSaleClick && onMakeSaleClick(product)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                        product.stock > 0 
                          ? 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground' 
                          : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                      }`}
                      disabled={product.stock === 0}
                    >
                      Satış Yap
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
