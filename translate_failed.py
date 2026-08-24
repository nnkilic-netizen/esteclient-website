# -*- coding: utf-8 -*-
with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Match 9, 19, 23
text = text.replace(
    "language === 'tr' ? 'Ücretsiz Deneyin (Demo Sürümü)' : language === 'en' ? 'Try for free (Demo)' : 'Essai gratuit (Démo)'",
    "language === 'tr' ? 'Ücretsiz Deneyin (Demo Sürümü)' : language === 'en' ? 'Try for free (Demo)' : 'Essai gratuit (Démo)'"
)
text = text.replace(
    "language === 'tr' ? 'Ücretsiz Deneyin (Demo Sürümü)' : 'Try for free (Demo)'",
    "language === 'tr' ? 'Ücretsiz Deneyin (Demo Sürümü)' : language === 'en' ? 'Try for free (Demo)' : 'Essai gratuit (Démo)'"
)

# Match 22
text = text.replace(
    "language === 'tr' ? 'EsteClient; randevularınızı, müşterilerinizi, ürün ve hizmet satışlarınızı tek bir ekrandan yönetir. En güçlü yanı ise personel performansından gelir-gider analizine uzanan kapsamlı raporlama yapısıdır.' : 'EsteClient manages appointments, customers, and sales from a single screen. Its strongest point is the comprehensive reporting structure ranging from staff performance to income-expense analysis.'",
    "language === 'tr' ? 'EsteClient; randevularınızı, müşterilerinizi, ürün ve hizmet satışlarınızı tek bir ekrandan yönetir. En güçlü yanı ise personel performansından gelir-gider analizine uzanan kapsamlı raporlama yapısıdır.' : language === 'en' ? 'EsteClient manages appointments, customers, and sales from a single screen. Its strongest point is the comprehensive reporting structure ranging from staff performance to income-expense analysis.' : 'EsteClient gère les rendez-vous, les clients et les ventes à partir d\\'un seul écran. Son point fort est la structure de rapport complète allant de la performance du personnel à l\\'analyse des revenus et dépenses.'"
)

# Match 25
text = text.replace(
    "language === 'tr' ? 'İster internetsiz masaüstü sürümüyle lokalde güvenle çalışın, ister internet altyapısıyla web, tablet ve cep telefonunuzdan salonunuza dilediğiniz an bağlanın. Kesintisiz yönetimin özgürlüğünü yaşayın.' : 'Work securely locally without internet using the desktop version, or connect to your salon anytime from your web, tablet, and mobile phone with internet. Experience the freedom of uninterrupted management.'",
    "language === 'tr' ? 'İster internetsiz masaüstü sürümüyle lokalde güvenle çalışın, ister internet altyapısıyla web, tablet ve cep telefonunuzdan salonunuza dilediğiniz an bağlanın. Kesintisiz yönetimin özgürlüğünü yaşayın.' : language === 'en' ? 'Work securely locally without internet using the desktop version, or connect to your salon anytime from your web, tablet, and mobile phone with internet. Experience the freedom of uninterrupted management.' : 'Travaillez localement sans internet avec la version bureau, ou connectez-vous à votre salon depuis le web, tablette ou mobile. Expérimentez la liberté d\\'une gestion ininterrompue.'"
)

# Match 27
text = text.replace(
    "language === 'tr' ? 'Tüm salon süreçleri tek ekranda.' : 'All parts of salon management, on a single screen.'",
    "language === 'tr' ? 'Tüm salon süreçleri tek ekranda.' : language === 'en' ? 'All parts of salon management, on a single screen.' : 'Toutes les parties de la gestion de salon sur un seul écran.'"
)

# Match 40
text = text.replace(
    "language === 'tr' ? 'İhtiyacınız kadar, dilediğiniz zaman.' : 'As much as you need, whenever you want.'",
    "language === 'tr' ? 'İhtiyacınız kadar, dilediğiniz zaman.' : language === 'en' ? 'As much as you need, whenever you want.' : 'Autant que vous avez besoin, quand vous le souhaitez.'"
)

# Match 42
text = text.replace(
    "language === 'tr' ? '\"EsteClient ile randevu defteri ve karışık excel formlarından kurtulduk. Ekibim ne yapacağını biliyor, ben de müşterilerimle daha fazla ilgileniyorum.\"' : '\"We got rid of appointment books and messy excel sheets with EsteClient. My team knows what to do, and I spend more time with my clients.\"'",
    "language === 'tr' ? '\"EsteClient ile randevu defteri ve karışık excel formlarından kurtulduk. Ekibim ne yapacağını biliyor, ben de müşterilerimle daha fazla ilgileniyorum.\"' : language === 'en' ? '\"We got rid of appointment books and messy excel sheets with EsteClient. My team knows what to do, and I spend more time with my clients.\"' : '\"Nous nous sommes débarrassés des carnets de rendez-vous et des feuilles Excel en désordre avec EsteClient. Mon équipe sait quoi faire, et je passe plus de temps avec mes clients.\"'"
)

# Match 43
text = text.replace(
    "language === 'tr' ? 'Esteline Güzellik Merkezi, Gaziantep' : 'Esteline Beauty Center, Gaziantep'",
    "language === 'tr' ? 'Esteline Güzellik Merkezi, Gaziantep' : language === 'en' ? 'Esteline Beauty Center, Gaziantep' : 'Centre de beauté Esteline, Gaziantep'"
)

# Match 46 (FAQ)
text = text.replace(
    ": language === 'en' ? [['What is EsteClient?'",
    ": language === 'en' ? [['What is EsteClient?'"
) # Already replaced by another script

# Match 49
text = text.replace(
    "language === 'tr' ? 'Operasyonel verimliliğinizi artıracak yapay zeka destekli web sitesi, mobil uygulama ve masaüstü yazılım projelerinde yanınızdayız. İşletmenizin gereksinimlerine en uygun çözümleri birlikte planlamak için bizimle irtibata geçebilirsiniz.' : 'We are with you in AI-supported website, mobile app, and desktop software projects that will increase your operational efficiency. You can contact us to plan the most suitable solutions for your business requirements.'",
    "language === 'tr' ? 'Operasyonel verimliliğinizi artıracak yapay zeka destekli web sitesi, mobil uygulama ve masaüstü yazılım projelerinde yanınızdayız. İşletmenizin gereksinimlerine en uygun çözümleri birlikte planlamak için bizimle irtibata geçebilirsiniz.' : language === 'en' ? 'We are with you in AI-supported website, mobile app, and desktop software projects that will increase your operational efficiency. You can contact us to plan the most suitable solutions for your business requirements.' : 'Nous vous accompagnons dans les projets de sites web, d\\'applications mobiles et de logiciels basés sur l\\'IA qui augmenteront votre efficacité opérationnelle. Contactez-nous pour planifier les solutions les plus adaptées aux besoins de votre entreprise.'"
)

# And plansFr needs Franchise
plans_fr_correct = """const plansFr = [
  { 
    name: 'Forfait Bureau Local', 
    price: '40.000', 
    period: ' / une fois',
    text: '', 
    items: [
      'Tous les modules sauf SMS (Autorisation, Suivi Client, Rendez-vous Intelligent, Pré-comptabilité, Reporting, Rappel Assistant)',
      'Droits d\\'utilisation à vie',
      'Pas d\\'internet requis', 
      'Les données du système sont hébergées sur votre propre ordinateur.', 
      'Enregistrement illimité de clients et définition illimitée de personnel.', 
      '1 An de Support Gratuit : Support technique gratuit à partir de l\\'installation.'
    ],
    optionsTitle: '✨ Services et Options Supplémentaires',
    options: [
      'Module SMS : Forfait 10 000 SMS – 2 000 TL',
      'Support Étendu : Mises à jour et support technique optionnels après la 1ère année – 500 TL/mois'
    ]
  },
  { 
    name: 'Forfait Cloud Branche Unique', 
    price: '2.000', 
    period: ' / mois',
    altPrice: '18.000',
    altPeriod: ' / an d\\'avance',
    text: '', 
    items: [
      'Tous les modules sauf SMS (Autorisation, Suivi Client, Rendez-vous Intelligent, Pré-comptabilité, Reporting, Rappel Assistant)',
      'Gérez librement depuis tous les appareils',
      'Utilisation pour une seule branche',
      'Accès Multi-Plateformes : Contrôle dans votre poche avec l\\'application web, tablette et mobile.',
      'Capacité Illimitée : Enregistrement illimité de clients et définition illimitée de personnel.',
      'Support Gratuit : Support technique, sauvegarde de données, mises à jour et frais cloud inclus pendant l\\'abonnement.'
    ],
    optionsTitle: '✨ Services et Options Supplémentaires',
    options: [
      'Module SMS : Forfait 10 000 SMS – 2 000 TL'
    ],
    featured: true 
  },
  { 
    name: 'Forfait Franchise & Multi-Succursales', 
    price: '10.000', 
    period: ' / mois',
    altPrice: '100.000',
    altPeriod: ' / an d\\'avance',
    text: '', 
    items: [
      'Tous les modules y compris SMS (Autorisation, Suivi Client, Rendez-vous Intelligent, Pré-comptabilité, Reporting, Rappel Assistant, Module SMS Inclus)',
      '10 000 SMS Cadeau Chaque Mois',
      'Rapports et Consolidation pour Multi-Succursales',
      'Toutes les Fonctionnalités Cloud : Accès web, tablette, mobile et sauvegardes automatiques.',
      'Support Dédié : Un représentant spécial pour votre entreprise et résolution prioritaire des problèmes.'
    ],
    optionsTitle: '✨ Services et Options Supplémentaires',
    options: [
      'Développement de Fonctionnalités Personnalisées : Développement de modules logiciels spécifiques à votre entreprise.',
      'Migration de Données : Transfert fluide de vos données depuis un ancien système vers EsteClient.'
    ]
  }
]"""
text = re.sub(r'const plansFr = \[\s*(?:\{[^\}]+\},?\s*)+\s*\]', plans_fr_correct, text)

with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
