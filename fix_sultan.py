# -*- coding: utf-8 -*-
with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find the blockquote and the person details and replace it cleanly
old_section = re.search(r'<blockquote.*?</blockquote>.*?Sultan Kureş.*?</p></div></div></div></section>', text, flags=re.DOTALL)
if old_section:
    new_section = """<blockquote className="mt-6 max-w-3xl text-2xl font-medium leading-snug tracking-tight sm:text-3xl">{language === 'tr' ? '"EsteClient ile randevu defteri ve karışık excel formlarından kurtulduk. Ekibim ne yapacağını biliyor, ben de müşterilerimle daha fazla ilgileniyorum."' : language === 'en' ? '"We got rid of appointment books and messy excel sheets with EsteClient. My team knows what to do, and I spend more time with my clients."' : '"Nous nous sommes débarrassés des carnets de rendez-vous et des feuilles Excel en désordre avec EsteClient. Mon équipe sait quoi faire, et je passe plus de temps avec mes clients."'}</blockquote><div className="mt-6 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">S</div><div><p className="text-sm font-semibold">Sultan Kureş</p><p className="text-xs text-muted-foreground">{language === 'tr' ? 'Esteline Güzellik Merkezi, Gaziantep' : language === 'en' ? 'Esteline Beauty Center, Gaziantep' : 'Centre de beauté Esteline, Gaziantep'}</p></div></div></div></section>"""
    text = text.replace(old_section.group(0), new_section)
    print("Replaced!")
else:
    print("Not found!")

with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
