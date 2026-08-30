# -*- coding: utf-8 -*-
with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\app\layout.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("EsteClient | Güzellik Salonu ve Müşteri Takip Programı", "EsteClient | Güzellik Salonu Müşteri Takip Programı")

with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\app\layout.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
