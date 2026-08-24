# -*- coding: utf-8 -*-
with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "language === 'tr' ? '“EsteClient ile randevu defteri ve karışık excel formlarından kurtulduk. Ekibim ne yapacağını biliyor, ben de müşterilerimle daha fazla ilgileniyorum.”' : '“We got rid of appointment books and messy excel sheets with EsteClient. My team knows what to do, and I spend more time with my clients.”'",
    "language === 'tr' ? '“EsteClient ile randevu defteri ve karışık excel formlarından kurtulduk. Ekibim ne yapacağını biliyor, ben de müşterilerimle daha fazla ilgileniyorum.”' : language === 'en' ? '“We got rid of appointment books and messy excel sheets with EsteClient. My team knows what to do, and I spend more time with my clients.”' : '“Nous nous sommes débarrassés des carnets de rendez-vous et des feuilles Excel en désordre avec EsteClient. Mon équipe sait quoi faire, et je passe plus de temps avec mes clients.”'"
)

with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
