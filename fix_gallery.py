# -*- coding: utf-8 -*-
with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find the block where `const seoAlts = [` is inside the `.map((num, i) => {`
# We'll extract everything from `const seoAlts = [` to `];` and replace it.

old_block = re.search(r'const seoAlts = \[\s*.*?\s*\];', text, flags=re.DOTALL)
if old_block:
    print("Found old block!")
    new_block = """const seoAltsTr = [
                  'Güzellik salonu müşteri takip programı',
                  'Kuaför randevu sistemi takvim',
                  'SPA merkezleri personel yönetimi',
                  'Diyetisyen danışan takip sistemi',
                  'Fizyoterapist seans takibi',
                  'Spor salonları üyelik yazılımı',
                  'Güzellik salonu gelir gider',
                  'Kuaför adisyon sistemi',
                  'Online randevu yönetim paneli',
                  'Müşteri sadakat ve SMS modülü',
                  'Gelişmiş salon yönetim modülleri',
                  'Danışan takip sistemleri',
                  'Kuaför kasa ve stok takibi',
                  'Güzellik merkezi detaylı raporlama',
                  'Diyetisyen randevu sistemi',
                  'Fizyoterapist hasta takip ekranı',
                  'Güzellik salonu yazılımı',
                  'Müşteri takip programı arayüzü'
                ];
                const seoAltsEn = [
                  'Beauty salon customer tracking software',
                  'Hairdresser appointment system calendar',
                  'SPA centers personnel management',
                  'Dietitian client tracking system',
                  'Physiotherapist session tracking',
                  'Gyms membership software',
                  'Beauty salon income expense',
                  'Hairdresser ticket system',
                  'Online appointment management panel',
                  'Customer loyalty and SMS module',
                  'Advanced salon management modules',
                  'Client tracking systems',
                  'Hairdresser cash register and stock tracking',
                  'Beauty center detailed reporting',
                  'Dietitian appointment system',
                  'Physiotherapist patient tracking screen',
                  'Beauty salon software',
                  'Customer tracking software interface'
                ];
                const seoAltsFr = [
                  'Logiciel de suivi client pour salon de beauté',
                  'Calendrier du système de rendez-vous pour coiffeurs',
                  'Gestion du personnel des centres SPA',
                  'Système de suivi des clients pour diététiciens',
                  'Suivi des séances de physiothérapeutes',
                  'Logiciel d\\'abonnement pour salles de sport',
                  'Revenus et dépenses des salons de beauté',
                  'Système de tickets pour coiffeurs',
                  'Panneau de gestion des rendez-vous en ligne',
                  'Module de fidélité client et SMS',
                  'Modules avancés de gestion de salon',
                  'Systèmes de suivi des clients',
                  'Caisse enregistreuse et suivi des stocks pour coiffeurs',
                  'Rapports détaillés du centre de beauté',
                  'Système de rendez-vous pour diététiciens',
                  'Écran de suivi des patients pour physiothérapeutes',
                  'Logiciel pour salon de beauté',
                  'Interface du logiciel de suivi client'
                ];"""
    text = text.replace(old_block.group(0), new_block)
else:
    print("Old block not found!")

# Also fix the img tag fallback text: 'Müşteri takip programı' to support languages as well, while we are at it.
text = text.replace(
    "|| 'Müşteri takip programı'",
    "|| (language === 'tr' ? 'Müşteri takip programı' : language === 'en' ? 'Customer tracking program' : 'Programme de suivi client')"
)

with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
