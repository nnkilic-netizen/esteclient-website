# -*- coding: utf-8 -*-
with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Fix h1
text = text.replace(
    "language === 'tr' ? <>İşletmeniz için <span className=\"text-primary\">sade, kullanışlı, çoklu platform erişimli</span> ve güçlü müşteri takip programı.</> : <>A <span className=\"text-primary\">simple, powerful</span> CRM for your business.</>",
    "language === 'tr' ? <>İşletmeniz için <span className=\"text-primary\">sade, kullanışlı, çoklu platform erişimli</span> ve güçlü müşteri takip programı.</> : language === 'en' ? <>A <span className=\"text-primary\">simple, powerful</span> CRM for your business.</> : <>Un CRM <span className=\"text-primary\">simple et puissant</span> pour votre entreprise.</>"
)

# 2. Fix p below h1
text = text.replace(
    "language === 'tr' ? 'EsteClient; randevularınızı, müşterilerinizi, ürün ve hizmet satışlarınızı tek bir ekrandan yönetir. En güçlü yanı ise personel performansından gelir-gider analizine uzanan kapsamlı raporlama yapısıdır.' : 'EsteClient manages appointments, customers, product and service sales in one simple workspace. Track team performance and revenue-expense reports with clarity.'",
    "language === 'tr' ? 'EsteClient; randevularınızı, müşterilerinizi, ürün ve hizmet satışlarınızı tek bir ekrandan yönetir. En güçlü yanı ise personel performansından gelir-gider analizine uzanan kapsamlı raporlama yapısıdır.' : language === 'en' ? 'EsteClient manages appointments, customers, product and service sales in one simple workspace. Track team performance and revenue-expense reports with clarity.' : 'EsteClient gère les rendez-vous, les clients et les ventes dans un espace de travail simple. Suivez les performances de l\\'équipe et les rapports de revenus-dépenses avec clarté.'"
)

# 3. Fix 2nd section description (Work securely locally...)
text = text.replace(
    "language === 'tr' ? 'İster internetsiz masaüstü sürümüyle lokalde güvenle çalışın, ister internet altyapısıyla web, tablet ve cep telefonunuzdan salonunuza dilediğiniz an bağlanın. Kesintisiz yönetimin özgürlüğünü yaşayın.' : 'Work securely locally without internet using the desktop version, or connect to your salon anytime from web, tablet, and mobile with our cloud infrastructure. Experience the freedom of uninterrupted management.'",
    "language === 'tr' ? 'İster internetsiz masaüstü sürümüyle lokalde güvenle çalışın, ister internet altyapısıyla web, tablet ve cep telefonunuzdan salonunuza dilediğiniz an bağlanın. Kesintisiz yönetimin özgürlüğünü yaşayın.' : language === 'en' ? 'Work securely locally without internet using the desktop version, or connect to your salon anytime from web, tablet, and mobile with our cloud infrastructure. Experience the freedom of uninterrupted management.' : 'Travaillez localement en toute sécurité sans internet avec la version bureau, ou connectez-vous à votre salon à tout moment depuis le web, tablette ou mobile. Expérimentez la liberté d\\'une gestion ininterrompue.'"
)


with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
