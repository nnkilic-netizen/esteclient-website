"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Clock,
  Sparkles,
  PackageOpen,
  ChevronDown,
  Plus,
  Shield,
  User,
  Pencil,
  Check,
  Search,
  KeyRound,
  Trash2,
  Save,
  Edit2,
  SwitchCamera
} from "lucide-react";
import { CustomSelect } from "./ui/custom-select";
import { cn } from "@/lib/utils";
import {
  type Product,
  type ServiceCategory,
  type ServiceItem,
  type WorkingDay,
  type User as AppUser,
} from "@/lib/demo-data";
import { AddProductModal } from "./add-product-modal";
import { AddUserModal } from "./add-user-modal";
import { EditUserModal } from "./edit-user-modal";
import { ChangePasswordModal } from "./change-password-modal";
import { ConfirmDeleteModal } from "./confirm-delete-modal";

type SettingsCategory = "appointment" | "service" | "product" | "user";

const BRANCHES = [
  { id: "branch1", name: "Merkez Şube" },
  { id: "branch2", name: "Şişli Şube" },
];

const CATEGORIES = [
  { id: "appointment", name: "Randevu ve Çalışma Saati" },
  { id: "service", name: "İşlem Ayarları" },
  { id: "product", name: "Ürün / Stok Ayarları" },
  { id: "user", name: "Kullanıcı / Personel Yönetimi" },
];

const SUBCATEGORIES: Record<string, { id: string; name: string }[]> = {
  appointment: [
    { id: "days", name: "Çalışma Günleri ve Saatleri" },
    { id: "interval", name: "Randevu Aralıkları" },
  ],
  service: [{ id: "categories", name: "İşlem ve Fiyatlandırma" }],
  product: [{ id: "list", name: "Ürün ve Stok Listesi" }],
  user: [
    { id: "auth", name: "Kullanıcı / Personel Listesi" },
  ],
};

interface SystemSettingsProps {
  setHeaderContent: (content: React.ReactNode) => void;
  products: Product[];
  setProducts: (p: Product[]) => void;
  categories: ServiceCategory[];
  setCategories: (c: ServiceCategory[]) => void;
  workingDays: WorkingDay[];
  setWorkingDays: (w: WorkingDay[]) => void;
  slotInterval: number;
  setSlotInterval: (s: number) => void;
  users: AppUser[];
  setUsers: (u: AppUser[]) => void;
  showToast?: (msg: string) => void;
}

export function SystemSettingsView({
  setHeaderContent,
  products,
  setProducts,
  categories,
  setCategories,
  workingDays,
  setWorkingDays,
  slotInterval,
  setSlotInterval,
  users,
  setUsers,
  showToast,
}: SystemSettingsProps) {
  const [activeBranch, setActiveBranch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<SettingsCategory | "">(
    "",
  );
  const [activeSubcategory, setActiveSubcategory] = useState<string>("");
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ServiceCategory | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<{ catId: string; service: ServiceItem } | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState<
    "all" | "inactive" | "critical"
  >("all");
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingServiceToCategory, setAddingServiceToCategory] = useState<
    string | null
  >(null);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");

  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNewCategoryModalOpen(false);
        setAddingServiceToCategory(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleCategory = (id: string) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    setHeaderContent(
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 shadow-sm">
          <Settings className="size-7" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Sistem Ayarları
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 mb-2.5">
            Genel sistem ve modül ayarları.
          </p>
        </div>
      </div>,
    );
    return () => setHeaderContent(null);
  }, [setHeaderContent]);

  // Kategori değiştiğinde alt menüyü sıfırla
  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId as SettingsCategory);
    setActiveSubcategory("");
  };

  return (
    <div className="flex flex-col h-full w-full bg-card rounded-2xl shadow-sm border border-border overflow-hidden relative">
      {/* Top Selection Area - 3 Column Listboxes */}
      <div className="border-b border-border px-6 py-5 z-10 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {/* Branch */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5 ml-1">
              Şube
            </label>
            <div className="relative">
              <CustomSelect
                value={activeBranch}
                onChange={(val) => {
                  setActiveBranch(val as string);
                  setActiveCategory("");
                  setActiveSubcategory("");
                }}
                placeholder="Şube Seçiniz..."
                options={BRANCHES.map(b => ({ value: b.id, label: b.name }))}
                className="w-full"
              />
            </div>
          </div>

          {/* Category */}
          {activeBranch && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5 ml-1">
                Ayar Kategorisi
              </label>
              <div className="relative">
                <CustomSelect
                  value={activeCategory}
                  onChange={(val) => handleCategoryChange(val as string)}
                  placeholder="Kategori Seçiniz..."
                  options={CATEGORIES.map(c => ({ value: c.id, label: c.name }))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Subcategory */}
          {activeCategory && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5 ml-1">
                Alt Menü
              </label>
              <div className="relative">
                <CustomSelect
                  value={activeSubcategory}
                  onChange={(val) => setActiveSubcategory(val as string)}
                  placeholder="İşlem Seçiniz..."
                  options={(SUBCATEGORIES[activeCategory as keyof typeof SUBCATEGORIES] || []).map(s => ({ value: s.id, label: s.name }))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        {!activeSubcategory ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-60 animate-in fade-in duration-500">
            <Settings className="size-16 mb-4 opacity-20" />
            <p className="font-medium">
              Lütfen işlem yapmak için yukarıdan sırasıyla seçim yapınız.
            </p>
          </div>
        ) : (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* USER SETTINGS */}
            {activeCategory === "user" && activeSubcategory === "auth" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                    <User className="size-5 text-primary" />
                    Kullanıcı ve Personel Listesi
                  </h3>
                  <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shrink-0"
                  >
                    <Plus className="size-4" />
                    Yeni Personel
                  </button>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      className="flex flex-col p-5 rounded-2xl border border-border/60 bg-background/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all relative group"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <label className="relative size-14 rounded-full overflow-hidden shrink-0 border-2 border-primary/20 bg-primary/5 flex items-center justify-center text-primary font-bold text-xl cursor-pointer group/avatar">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            u.fullName.charAt(0).toUpperCase()
                          )}
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity text-white text-[9px] font-medium text-center leading-tight">
                            Değiştir
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setUsers(
                                  users.map((x) =>
                                    x.id === u.id
                                      ? { ...x, avatarUrl: url }
                                      : x,
                                  ),
                                );
                              }
                            }}
                          />
                        </label>
                        <div className="flex-1 min-w-0 pt-1">
                          <p className="text-base font-semibold text-foreground truncate">
                            {u.fullName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            @{u.username}
                          </p>
                        </div>
                        <div className="shrink-0 pt-1">
                          <label
                            className="relative inline-flex items-center cursor-pointer"
                            title={u.isActive ? "Aktif" : "Pasif"}
                          >
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={u.isActive}
                              onChange={(e) => {
                                setUsers(
                                  users.map((x) =>
                                    x.id === u.id
                                      ? { ...x, isActive: e.target.checked }
                                      : x,
                                  ),
                                );
                              }}
                            />
                            <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>

                      <div className="border-t border-border/50 pt-4 pb-4 space-y-2.5">
                        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <span>📞</span>
                          <span className="truncate">{u.phone || "Belirtilmemiş"}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <span>🎂</span>
                          <span className="truncate">{u.birthDate ? new Date(u.birthDate).toLocaleDateString('tr-TR') : "Belirtilmemiş"}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <span>💼</span>
                          <span className="truncate">İşe Başlama: {u.startDate ? new Date(u.startDate).toLocaleDateString('tr-TR') : "Belirtilmemiş"}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <span>🏢</span>
                          <span className="truncate">{u.branchId ? BRANCHES.find(b => b.id === u.branchId)?.name : "Tüm Şubeler"}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                          <Shield className="size-3.5" />
                          <span className="truncate">{u.role === "owner" ? "Firma Yetkilisi" : u.role === "admin" ? "Şube Yöneticisi Yetkisi" : "Kullanıcı Yetkisi"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            title="Şifre Değiştir"
                            onClick={() => setPasswordUser(u)}
                            className="flex items-center justify-center size-8 text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors"
                          >
                            <KeyRound className="size-4" />
                          </button>
                          <button
                            title="Düzenle"
                            onClick={() => setEditingUser(u)}
                            className="flex items-center justify-center size-8 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            title="Sil"
                            onClick={() => setUserToDelete(u)}
                            className="flex items-center justify-center size-8 text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* APPOINTMENT SETTINGS */}
            {activeCategory === "appointment" &&
              activeSubcategory === "days" && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <Clock className="size-5" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">
                      Çalışma Günleri ve Saatleri
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {workingDays.map((day) => (
                      <div
                        key={day.dayId}
                        className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/60 bg-background/50"
                      >
                        <div className="flex items-center gap-3 w-32 shrink-0">
                          <label
                            className="relative inline-flex items-center cursor-pointer"
                            title={day.isActive !== false ? "Açık" : "Kapalı"}
                          >
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={day.isActive !== false}
                              onChange={(e) => {
                                setWorkingDays(
                                  workingDays.map((d) =>
                                    d.dayId === day.dayId
                                      ? { ...d, isActive: e.target.checked }
                                      : d,
                                  ),
                                );
                              }}
                            />
                            <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                          <span
                            className={cn(
                              "text-sm font-medium",
                              day.isActive === false &&
                                "text-muted-foreground line-through",
                            )}
                          >
                            {day.dayName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <input
                            type="time"
                            disabled={day.isActive === false}
                            value={day.start}
                            onChange={(e) =>
                              setWorkingDays(
                                workingDays.map((d) =>
                                  d.dayId === day.dayId
                                    ? { ...d, start: e.target.value }
                                    : d,
                                ),
                              )
                            }
                            className="bg-card border border-input rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                          />
                          <span className="text-muted-foreground">-</span>
                          <input
                            type="time"
                            disabled={day.isActive === false}
                            value={day.end}
                            onChange={(e) =>
                              setWorkingDays(
                                workingDays.map((d) =>
                                  d.dayId === day.dayId
                                    ? { ...d, end: e.target.value }
                                    : d,
                                ),
                              )
                            }
                            className="bg-card border border-input rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {activeCategory === "appointment" &&
              activeSubcategory === "interval" && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <Clock className="size-5" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">
                      Çalışma Saat Aralığı
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Randevu takviminde gösterilecek saat dilimi aralıklarını
                    seçin.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[10, 15, 30].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setSlotInterval(mins)}
                        className={cn(
                          "py-3 px-4 rounded-xl border text-sm font-semibold transition-all",
                          slotInterval === mins
                            ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                            : "bg-background border-border hover:bg-muted",
                        )}
                      >
                        {mins} dk
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* SERVICE SETTINGS */}
            {activeCategory === "service" &&
              activeSubcategory === "categories" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                      <Sparkles className="size-5 text-primary" />
                      İşlem ve Fiyatlandırma
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="relative w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="İşlem ara..."
                          value={serviceSearchQuery}
                          onChange={(e) =>
                            setServiceSearchQuery(e.target.value)
                          }
                          className="w-full bg-background border border-input rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-colors"
                        />
                      </div>
                      <button
                        onClick={() => setIsNewCategoryModalOpen(true)}
                        className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shrink-0"
                      >
                        <Plus className="size-4" />
                        Yeni Kategori
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 w-full">
                    {categories.map((cat) => {
                      const isExpanded = expandedCategoryId === cat.id;

                      return (
                        <div
                          key={cat.id}
                          className={cn(
                            "border border-border/60 bg-background/50 rounded-2xl p-4 transition-all duration-300",
                            isExpanded
                              ? "bg-primary/5 border-primary/60 shadow-md ring-1 ring-primary/20"
                              : "border-border/60 shadow-sm hover:border-primary/30",
                          )}
                        >
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleCategory(cat.id)}
                          >
                            <div className="flex items-center gap-4 w-full">
                              <div className="flex items-center gap-2 shrink-0">
                                <label
                                  className="relative inline-flex items-center cursor-pointer shrink-0"
                                  title={
                                    cat.isActive !== false
                                      ? "Gösterme"
                                      : "Göster"
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={cat.isActive !== false}
                                    onChange={(e) =>
                                      setCategories(
                                        categories.map((c) =>
                                          c.id === cat.id
                                            ? {
                                                ...c,
                                                isActive: e.target.checked,
                                              }
                                            : c,
                                        ),
                                      )
                                    }
                                  />
                                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                                {editingCategoryId === cat.id ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingCategoryId(null);
                                    }}
                                    className="p-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                  >
                                    <Check className="size-4" />
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingCategoryId(cat.id);
                                      }}
                                      className="p-1.5 rounded-md transition-colors opacity-50 hover:opacity-100 text-muted-foreground hover:bg-muted"
                                    >
                                      <Pencil className="size-4" />
                                    </button>
                                    {cat.services.length === 0 && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCategoryToDelete(cat);
                                        }}
                                        className="p-1.5 rounded-md transition-colors opacity-50 hover:opacity-100 text-destructive hover:bg-destructive/10 ml-0.5"
                                        title="Kategoriyi Sil"
                                      >
                                        <Trash2 className="size-4" />
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>

                              <div className="flex flex-col flex-1 min-w-0">
                                {editingCategoryId === cat.id ? (
                                  <input
                                    type="text"
                                    autoFocus
                                    value={cat.name}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) =>
                                      setCategories(
                                        categories.map((c) =>
                                          c.id === cat.id
                                            ? { ...c, name: e.target.value }
                                            : c,
                                        ),
                                      )
                                    }
                                    onBlur={() => setEditingCategoryId(null)}
                                    onKeyDown={(e) =>
                                      e.key === "Enter" &&
                                      setEditingCategoryId(null)
                                    }
                                    className="bg-primary/10 text-primary border border-primary/50 rounded px-3 py-1 text-lg font-semibold outline-none focus:ring-2 focus:ring-primary w-full max-w-[320px] shadow-sm transition-colors"
                                  />
                                ) : (
                                  <h3
                                    className={cn(
                                      "font-semibold text-lg leading-tight transition-colors truncate",
                                      !cat.isActive
                                        ? "text-muted-foreground line-through opacity-70"
                                        : isExpanded
                                          ? "text-primary"
                                          : "text-foreground",
                                    )}
                                  >
                                    {cat.name}
                                  </h3>
                                )}
                                <span className="text-xs text-muted-foreground mt-0.5">
                                  {cat.services.length} işlem tanımlı
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              {isExpanded && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAddingServiceToCategory(cat.id);
                                  }}
                                  className="flex items-center gap-2 py-1.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap"
                                >
                                  <Plus className="size-3.5" />
                                  İşlem Ekle
                                </button>
                              )}
                              <div className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0">
                                <ChevronDown
                                  className={cn(
                                    "size-5 transition-transform duration-200",
                                    isExpanded
                                      ? "rotate-180 text-primary"
                                      : "text-muted-foreground",
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/60">
                              {cat.services
                                .filter((s) => {
                                  const q = serviceSearchQuery.toLowerCase();
                                  if (!q) return true;
                                  return s.name.toLowerCase().includes(q);
                                })
                                .map((srv) => {
                                  const isEditingSrv =
                                    editingServiceId === srv.id;

                                  return (
                                    <div
                                      key={srv.id}
                                      className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card transition-all group/srv",
                                        isEditingSrv
                                          ? "bg-primary/5 border-primary/30 shadow-md ring-1 ring-primary/20"
                                          : "border-border/60 shadow-sm hover:border-primary/30 hover:shadow-md",
                                      )}
                                    >
                                      {isEditingSrv ? (
                                        <>
                                          <div className="flex flex-col flex-1 min-w-0 justify-center">
                                            <input
                                              type="text"
                                              autoFocus
                                              value={srv.name}
                                              onChange={(e) => {
                                                setCategories(
                                                  categories.map((c) =>
                                                    c.id === cat.id
                                                      ? {
                                                          ...c,
                                                          services:
                                                            c.services.map(
                                                              (s) =>
                                                                s.id === srv.id
                                                                  ? {
                                                                      ...s,
                                                                      name: e
                                                                        .target
                                                                        .value,
                                                                    }
                                                                  : s,
                                                            ),
                                                        }
                                                      : c,
                                                  ),
                                                );
                                              }}
                                              className="w-full bg-primary/10 text-primary border border-primary/50 rounded px-1.5 py-0.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary leading-tight transition-colors shadow-sm"
                                            />
                                            <input
                                              type="text"
                                              placeholder="İşlem detayı (örn: 45 dk)"
                                              className="w-full bg-primary/5 text-primary/90 placeholder:text-primary/40 border border-primary/30 rounded px-1.5 text-[10px] outline-none focus:ring-1 focus:ring-primary mt-1 transition-colors"
                                            />
                                          </div>
                                          <div className="flex items-center gap-1 shrink-0 w-20">
                                            <span className="text-xs font-medium text-primary/70">
                                              ₺
                                            </span>
                                            <input
                                              type="number"
                                              value={srv.price}
                                              onChange={(e) => {
                                                setCategories(
                                                  categories.map((c) =>
                                                    c.id === cat.id
                                                      ? {
                                                          ...c,
                                                          services:
                                                            c.services.map(
                                                              (s) =>
                                                                s.id === srv.id
                                                                  ? {
                                                                      ...s,
                                                                      price:
                                                                        Number(
                                                                          e
                                                                            .target
                                                                            .value,
                                                                        ),
                                                                    }
                                                                  : s,
                                                            ),
                                                        }
                                                      : c,
                                                  ),
                                                );
                                              }}
                                              className="w-full bg-primary/10 text-primary border border-primary/50 rounded px-1.5 py-1 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary transition-colors shadow-sm"
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="flex flex-col flex-1 min-w-0 justify-center">
                                            <span
                                              className={cn(
                                                "text-sm font-medium leading-tight truncate",
                                                srv.isActive === false &&
                                                  "text-muted-foreground line-through",
                                              )}
                                            >
                                              {srv.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                              Süre: 45 dk (Örnek)
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-1 shrink-0 text-right pr-2">
                                            <span
                                              className={cn(
                                                "text-sm font-semibold",
                                                srv.isActive === false &&
                                                  "text-muted-foreground line-through",
                                              )}
                                            >
                                              {srv.price} ₺
                                            </span>
                                          </div>
                                        </>
                                      )}

                                      <div className="flex items-center gap-1.5 shrink-0 ml-auto border-l border-border/50 pl-2">
                                        <label
                                          className="relative inline-flex items-center cursor-pointer shrink-0"
                                          title={
                                            srv.isActive !== false
                                              ? "Gösterme"
                                              : "Göster"
                                          }
                                        >
                                          <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={srv.isActive !== false}
                                            onChange={(e) => {
                                              setCategories(
                                                categories.map((c) => {
                                                  if (c.id === cat.id) {
                                                    return {
                                                      ...c,
                                                      services: c.services.map(
                                                        (s) =>
                                                          s.id === srv.id
                                                            ? {
                                                                ...s,
                                                                isActive:
                                                                  e.target
                                                                    .checked,
                                                              }
                                                            : s,
                                                      ),
                                                    };
                                                  }
                                                  return c;
                                                }),
                                              );
                                            }}
                                          />
                                          <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                        {isEditingSrv ? (
                                          <button
                                            onClick={() =>
                                              setEditingServiceId(null)
                                            }
                                            className="p-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                          >
                                            <Check className="size-3.5" />
                                          </button>
                                        ) : (
                                          <>
                                            <button
                                              onClick={() =>
                                                setEditingServiceId(srv.id)
                                              }
                                              className="p-1 rounded-md text-muted-foreground opacity-50 hover:opacity-100 hover:bg-muted transition-colors"
                                            >
                                              <Pencil className="size-3.5" />
                                            </button>
                                            <button
                                              onClick={() =>
                                                setServiceToDelete({ catId: cat.id, service: srv })
                                              }
                                              className="p-1 rounded-md text-destructive opacity-50 hover:opacity-100 hover:bg-destructive/10 transition-colors ml-0.5"
                                              title="İşlemi Sil"
                                            >
                                              <Trash2 className="size-3.5" />
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* PRODUCT SETTINGS */}
            {activeCategory === "product" && activeSubcategory === "list" && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <PackageOpen className="size-5" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">
                      Ürün ve Stok Yönetimi
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-48">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Ürün veya marka ara..."
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        className="w-full bg-background border border-input rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-colors"
                      />
                    </div>
                    <div className="relative min-w-[200px]">
                      <CustomSelect
                        value={productFilter}
                        onChange={(val) => setProductFilter(val as any)}
                        options={[
                          { value: "all", label: `Tüm Ürünler (${products.length})` },
                          { value: "critical", label: `Kritik Stok (${products.filter((p) => p.stock <= 10 && p.isActive !== false).length})` },
                          { value: "inactive", label: `Satışa Kapalı (${products.filter((p) => p.isActive === false).length})` }
                        ]}
                      />
                    </div>
                    <button
                      onClick={() => setIsAddProductModalOpen(true)}
                      className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shrink-0"
                    >
                      <Plus className="size-4" />
                      Yeni Ürün
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {products
                    .filter((p) => {
                      if (productFilter === "inactive" && p.isActive !== false)
                        return false;
                      if (
                        productFilter === "critical" &&
                        (p.stock > 10 || p.isActive === false)
                      )
                        return false;

                      const q = productSearchQuery.toLowerCase();
                      if (!q) return true;
                      return (
                        p.name.toLowerCase().includes(q) ||
                        (p.brand && p.brand.toLowerCase().includes(q)) ||
                        (p.description &&
                          p.description.toLowerCase().includes(q)) ||
                        (p.features &&
                          p.features.some((f) => f.toLowerCase().includes(q)))
                      );
                    })
                    .map((p) => {
                      const isEditingProd = editingProductId === p.id;

                      return (
                        <div
                          key={p.id}
                          className={cn(
                            "flex items-center justify-between gap-4 p-4 rounded-xl border transition-all",
                            isEditingProd
                              ? "bg-primary/5 border-primary/30 shadow-md ring-1 ring-primary/20"
                              : "bg-background/50 border-border/60 hover:border-primary/30 shadow-sm",
                          )}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Image */}
                            <div className="relative size-12 shrink-0 rounded-lg overflow-hidden border border-border/50 bg-muted flex items-center justify-center">
                              {p.imageUrl ? (
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <PackageOpen className="size-6 text-muted-foreground opacity-50" />
                              )}
                              {isEditingProd &&
                                (p.imageUrl ? (
                                  <button
                                    onClick={() =>
                                      setProducts(
                                        products.map((x) =>
                                          x.id === p.id
                                            ? { ...x, imageUrl: "" }
                                            : x,
                                        ),
                                      )
                                    }
                                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-[10px] font-medium opacity-0 hover:opacity-100 transition-opacity"
                                  >
                                    Sil
                                  </button>
                                ) : (
                                  <label className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-[10px] font-medium opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                    Ekle
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const url = URL.createObjectURL(file);
                                          setProducts(
                                            products.map((x) =>
                                              x.id === p.id
                                                ? { ...x, imageUrl: url }
                                                : x,
                                            ),
                                          );
                                        }
                                      }}
                                    />
                                  </label>
                                ))}
                            </div>

                            {/* Details */}
                            {isEditingProd ? (
                              <div className="flex flex-col flex-1 min-w-0 justify-center gap-1">
                                <input
                                  type="text"
                                  autoFocus
                                  value={p.name}
                                  onChange={(e) =>
                                    setProducts(
                                      products.map((x) =>
                                        x.id === p.id
                                          ? { ...x, name: e.target.value }
                                          : x,
                                      ),
                                    )
                                  }
                                  className="w-full bg-primary/10 text-primary border border-primary/50 rounded px-2 py-0.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary leading-tight transition-colors shadow-sm"
                                />
                                <div className="flex gap-1">
                                  <input
                                    type="text"
                                    placeholder="Marka"
                                    value={p.brand || ""}
                                    onChange={(e) =>
                                      setProducts(
                                        products.map((x) =>
                                          x.id === p.id
                                            ? { ...x, brand: e.target.value }
                                            : x,
                                        ),
                                      )
                                    }
                                    className="w-1/3 bg-primary/5 text-primary/90 placeholder:text-primary/40 border border-primary/30 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary transition-colors"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Ürün açıklaması veya özellikleri..."
                                    value={p.description || ""}
                                    onChange={(e) =>
                                      setProducts(
                                        products.map((x) =>
                                          x.id === p.id
                                            ? {
                                                ...x,
                                                description: e.target.value,
                                              }
                                            : x,
                                        ),
                                      )
                                    }
                                    className="w-2/3 bg-primary/5 text-primary/90 placeholder:text-primary/40 border border-primary/30 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary transition-colors"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    "text-sm font-semibold truncate",
                                    p.isActive === false &&
                                      "text-muted-foreground line-through opacity-70",
                                  )}
                                >
                                  {p.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                  <span className="font-medium text-foreground/70">
                                    {p.brand || "Markasız"}
                                  </span>
                                  {p.description && (
                                    <span className="mx-1 opacity-50">•</span>
                                  )}
                                  {p.description && (
                                    <span>{p.description}</span>
                                  )}
                                  {!p.description &&
                                    p.features &&
                                    p.features.length > 0 && (
                                      <>
                                        <span className="mx-1 opacity-50">
                                          •
                                        </span>
                                        <span>{p.features.join(", ")}</span>
                                      </>
                                    )}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Price & Stock */}
                          <div className="flex items-center gap-3 shrink-0">
                            {isEditingProd ? (
                              <div className="flex items-center gap-1 w-24">
                                <span className="text-xs font-medium text-primary/70">
                                  ₺
                                </span>
                                <input
                                  type="number"
                                  value={p.price}
                                  onChange={(e) =>
                                    setProducts(
                                      products.map((x) =>
                                        x.id === p.id
                                          ? {
                                              ...x,
                                              price: Number(e.target.value),
                                            }
                                          : x,
                                      ),
                                    )
                                  }
                                  className="w-full bg-primary/10 text-primary border border-primary/50 rounded px-1.5 py-1 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary transition-colors shadow-sm text-center"
                                />
                              </div>
                            ) : (
                              <div className="text-sm font-bold text-primary w-20 text-right pr-2">
                                ₺{p.price}
                              </div>
                            )}

                            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border/50">
                              {isEditingProd && (
                                <button
                                  onClick={() =>
                                    setProducts(
                                      products.map((x) =>
                                        x.id === p.id
                                          ? {
                                              ...x,
                                              stock: Math.max(0, x.stock - 1),
                                            }
                                          : x,
                                      ),
                                    )
                                  }
                                  className="size-6 flex items-center justify-center rounded-md bg-background border border-border text-foreground hover:bg-muted transition-colors"
                                >
                                  -
                                </button>
                              )}
                              <input
                                type="number"
                                value={p.stock}
                                onChange={(e) =>
                                  setProducts(
                                    products.map((x) =>
                                      x.id === p.id
                                        ? {
                                            ...x,
                                            stock: Number(e.target.value),
                                          }
                                        : x,
                                    ),
                                  )
                                }
                                className={cn(
                                  "bg-transparent border-none px-0 py-0.5 text-sm font-bold outline-none text-center",
                                  isEditingProd ? "w-8" : "w-10",
                                )}
                              />
                              {isEditingProd ? (
                                <button
                                  onClick={() =>
                                    setProducts(
                                      products.map((x) =>
                                        x.id === p.id
                                          ? { ...x, stock: x.stock + 1 }
                                          : x,
                                      ),
                                    )
                                  }
                                  className="size-6 flex items-center justify-center rounded-md bg-background border border-border text-foreground hover:bg-muted transition-colors"
                                >
                                  +
                                </button>
                              ) : (
                                <span className="text-[10px] font-medium text-muted-foreground pr-1">
                                  Adet
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 ml-4">
                              <div className="flex items-center gap-2 mr-2">
                                <label
                                  className="relative inline-flex items-center cursor-pointer shrink-0"
                                  title={
                                    p.isActive !== false
                                      ? "Satışa Kapat"
                                      : "Satışa Aç"
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={p.isActive !== false}
                                    onChange={(e) =>
                                      setProducts(
                                        products.map((x) =>
                                          x.id === p.id
                                            ? {
                                                ...x,
                                                isActive: e.target.checked,
                                              }
                                            : x,
                                        ),
                                      )
                                    }
                                  />
                                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                              </div>
                              {isEditingProd ? (
                                <button
                                  onClick={() => setEditingProductId(null)}
                                  className="p-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors ml-1"
                                >
                                  <Check className="size-4" />
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setEditingProductId(p.id)}
                                    className="p-1.5 rounded-md text-muted-foreground opacity-50 hover:opacity-100 hover:bg-muted transition-colors ml-1"
                                  >
                                    <Pencil className="size-4" />
                                  </button>
                                  <button
                                    onClick={() => setProductToDelete(p)}
                                    className="p-1.5 rounded-md text-destructive opacity-50 hover:opacity-100 hover:bg-destructive/10 transition-colors ml-1"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}



        {/* New Service Modal */}
        {addingServiceToCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card border border-border shadow-lg rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-border/60">
                <h3 className="font-semibold text-lg text-foreground">
                  Yeni İşlem Ekle
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Bu kategoriye yeni bir işlem tanımlayın.
                </p>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    İşlem Adı
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    placeholder="örn: Tüm Vücut"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Açıklama / Detay
                  </label>
                  <input
                    type="text"
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    placeholder="örn: 45 dk"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        newServiceName.trim() &&
                        newServicePrice
                      ) {
                        setCategories(
                          categories.map((c) => {
                            if (c.id === addingServiceToCategory) {
                              return {
                                ...c,
                                services: [
                                  ...c.services,
                                  {
                                    id: "srv_" + Date.now(),
                                    name:
                                      newServiceName.trim() +
                                      (newServiceDesc.trim()
                                        ? ` (${newServiceDesc.trim()})`
                                        : ""),
                                    price: Number(newServicePrice),
                                    isActive: true,
                                  },
                                ],
                              };
                            }
                            return c;
                          }),
                        );
                        setNewServiceName("");
                        setNewServiceDesc("");
                        setNewServicePrice("");
                        setAddingServiceToCategory(null);
                      }
                    }}
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    placeholder="örn: 1500"
                  />
                </div>
              </div>
              <div className="p-4 bg-muted/30 border-t border-border/60 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setNewServiceName("");
                    setNewServiceDesc("");
                    setNewServicePrice("");
                    setAddingServiceToCategory(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  İptal
                </button>
                <button
                  disabled={!newServiceName.trim() || !newServicePrice}
                  onClick={() => {
                    if (newServiceName.trim() && newServicePrice) {
                      setCategories(
                        categories.map((c) => {
                          if (c.id === addingServiceToCategory) {
                            return {
                              ...c,
                              services: [
                                ...c.services,
                                {
                                  id: "srv_" + Date.now(),
                                  name:
                                    newServiceName.trim() +
                                    (newServiceDesc.trim()
                                      ? ` (${newServiceDesc.trim()})`
                                      : ""),
                                  price: Number(newServicePrice),
                                  isActive: true,
                                },
                              ],
                            };
                          }
                          return c;
                        }),
                      );
                      setNewServiceName("");
                      setNewServiceDesc("");
                      setNewServicePrice("");
                      setAddingServiceToCategory(null);
                    }
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Category Modal */}
        {isNewCategoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card border border-border shadow-lg rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-border/60">
                <h3 className="font-semibold text-lg text-foreground">
                  Yeni Kategori Ekle
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  İşlemlerinizi gruplamak için yeni bir kategori oluşturun.
                </p>
              </div>
              <div className="p-5">
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                  Kategori Adı
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newCategoryName.trim()) {
                      setCategories([
                        ...categories,
                        {
                          id: "cat_" + Date.now(),
                          name: newCategoryName.trim(),
                          isActive: true,
                          services: [],
                        },
                      ]);
                      setNewCategoryName("");
                      setIsNewCategoryModalOpen(false);
                    }
                  }}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  placeholder="örn: Lazer Epilasyon"
                />
              </div>
              <div className="p-4 bg-muted/30 border-t border-border/60 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setNewCategoryName("");
                    setIsNewCategoryModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  İptal
                </button>
                <button
                  disabled={!newCategoryName.trim()}
                  onClick={() => {
                    if (newCategoryName.trim()) {
                      setCategories([
                        ...categories,
                        {
                          id: "cat_" + Date.now(),
                          name: newCategoryName.trim(),
                          isActive: true,
                          services: [],
                        },
                      ]);
                      setNewCategoryName("");
                      setIsNewCategoryModalOpen(false);
                    }
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => setIsAddProductModalOpen(false)}
          onSave={(p) => setProducts([...products, p])}
        />

        <AddUserModal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          branches={BRANCHES}
          onSave={(u) => setUsers([...users, u])}
        />

        <EditUserModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          branches={BRANCHES}
          onSave={(updatedUser) => {
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
          }}
        />

        <ChangePasswordModal
          isOpen={!!passwordUser}
          onClose={() => setPasswordUser(null)}
          user={passwordUser}
          onSave={(userId, newPassword) => {
            // In a real application, you would send the new password to your backend.
            alert(`${passwordUser?.fullName} kullanıcısının şifresi başarıyla güncellendi (Demo)`);
            setPasswordUser(null);
          }}
        />

        <ConfirmDeleteModal
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={() => {
            if (userToDelete) {
              setUsers(users.filter(x => x.id !== userToDelete.id));
              showToast?.("Kullanıcı silindi.");
            }
          }}
          title="Kullanıcıyı Sil"
          message={`"${userToDelete?.fullName}" isimli kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        />

        <ConfirmDeleteModal
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={() => {
            if (productToDelete) {
              setProducts(products.filter(x => x.id !== productToDelete.id));
              showToast?.("Ürün silindi.");
            }
          }}
          title="Ürünü Sil"
          message={`"${productToDelete?.name}" isimli ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        />

        <ConfirmDeleteModal
          isOpen={!!categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={() => {
            if (categoryToDelete) {
              setCategories(categories.filter(c => c.id !== categoryToDelete.id));
              showToast?.("Kategori silindi.");
            }
          }}
          title="Kategoriyi Sil"
          message={`"${categoryToDelete?.name}" kategorisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        />

        <ConfirmDeleteModal
          isOpen={!!serviceToDelete}
          onClose={() => setServiceToDelete(null)}
          onConfirm={() => {
            if (serviceToDelete) {
              setCategories(categories.map(c => 
                c.id === serviceToDelete.catId 
                  ? { ...c, services: c.services.filter(s => s.id !== serviceToDelete.service.id) }
                  : c
              ));
              showToast?.("İşlem silindi.");
            }
          }}
          title="İşlemi Sil"
          message={`"${serviceToDelete?.service.name}" isimli işlemi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        />
      </div>
    </div>
  );
}
