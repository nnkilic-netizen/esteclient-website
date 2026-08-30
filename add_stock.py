# -*- coding: utf-8 -*-
with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add Package to lucide-react imports
text = text.replace("PhoneCall,", "PhoneCall,\n  Package,")

# 2. Insert into featuresTr
tr_report = "{ icon: BarChart3, title: 'Geniş Raporlama Modülü', text: 'İşletmenizin röntgenini çekin! Personel performansı, satış analizleri ve gelir-gider tabloları dahil 20’ye yakın farklı rapor çeşidiyle salonunuzun gidişatını her an kontrol altında tutun.' },"
tr_stock = "\n    { icon: Package, title: 'Ürün ve Stok Kontrol Modülü', text: 'Satışını yaptığınız veya salonda kullandığınız ürünlerin stoklarını anlık olarak takip edin. Kritik seviyeye düşen ürünler için uyarılar alarak tedarik sürecinizi kusursuz yönetin.' },"
text = text.replace(
    "{ icon: BarChart3, title: 'Geniş Raporlama Modülü', text: 'İşletmenizin röntgenini çekin! Personel performansı, satış analizleri ve gelir-gider tabloları dahil 20’ye yakın farklı rapor çeşidiyle salonunuzun gidişatını her an kontrol altında tutun.' },",
    "{ icon: BarChart3, title: 'Geniş Raporlama Modülü', text: 'İşletmenizin röntgenini çekin! Personel performansı, satış analizleri ve gelir-gider tabloları dahil 20’ye yakın farklı rapor çeşidiyle salonunuzun gidişatını her an kontrol altında tutun.' }," + tr_stock
)

# 3. Insert into featuresEn
en_report = "{ icon: BarChart3, title: 'Extended Reporting Module', text: 'X-ray your business! Keep your salon\\'s progress under control at all times with nearly 20 different report types including staff performance, sales analysis, and income-expense tables.' },"
en_stock = "\n    { icon: Package, title: 'Product & Stock Control Module', text: 'Track the stocks of the products you sell or use in the salon instantly. Manage your supply process flawlessly by receiving alerts for products falling to critical levels.' },"
text = text.replace(en_report, en_report + en_stock)

# 4. Insert into featuresFr
fr_report = "{ icon: BarChart3, title: 'Module de Reporting Étendu', text: 'Passez votre entreprise au rayon X ! Gardez votre salon sous contrôle 24/7 avec près de 20 rapports différents (performances du personnel, analyse des ventes, etc.).' },"
fr_stock = "\n    { icon: Package, title: 'Module de Contrôle des Stocks', text: 'Suivez instantanément les stocks des produits que vous vendez ou utilisez. Gérez votre approvisionnement sans faille en recevant des alertes pour les produits en rupture.' },"
text = text.replace(fr_report, fr_report + fr_stock)


with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
