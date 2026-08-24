# -*- coding: utf-8 -*-
with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Remove the bad featuresFr and plansFr
text = re.sub(r'const featuresFr = \[\s*(?:\{[^\}]+\},?\s*)+\s*\]', '', text)
text = re.sub(r'const plansFr = \[\s*(?:\{[^\}]+\},?\s*)+\s*\]', '', text)

# Now define the correct ones
features_fr_correct = """
const featuresFr = [
  { icon: ShieldCheck, title: 'Module d\\'Autorisation Avancé', text: 'Gardez vos rapports financiers confidentiels. Assurez la sécurité des données de votre salon en restreignant l\\'accès au personnel.' },
  { icon: Users, title: 'Suivi Client Complet', text: 'Tout l\\'historique client sur un seul écran ! Visualisez les forfaits achetés, les séances restantes, les versements et les infos personnelles en quelques secondes.' },
  { icon: CalendarDays, title: 'Module de Rendez-vous Intelligent', text: 'Éliminez les chevauchements grâce aux vues calendrier journalières et hebdomadaires. Planifiez le trafic de votre salon parfaitement et sans effort.' },
  { icon: Wallet, title: 'Module de Pré-comptabilité Pratique', text: 'Gérez les revenus, les dépenses, les versements et les ventes de services en un clic. Gardez toujours le contrôle de vos finances avec un filtrage détaillé.' },
  { icon: BarChart3, title: 'Module de Reporting Étendu', text: 'Passez votre entreprise au rayon X ! Gardez votre salon sous contrôle 24/7 avec près de 20 rapports différents (performances du personnel, analyse des ventes, etc.).' },
  { icon: Bell, title: 'Module de Rappel Assistant', text: 'Ne gardez plus les tâches futures et les anniversaires clients en tête. Votre logiciel agira comme votre assistant personnel pour vous les rappeler.' },
  { icon: Smartphone, title: 'Module SMS Intégré', text: 'Évitez les annulations en rappelant les rendez-vous par des messages automatiques. Maximisez la fidélité avec des SMS pour les occasions spéciales.' },
  { icon: Palette, title: 'Module de Thèmes Variés', text: 'Personnalisez librement votre écran avec 6 options de thèmes différents ! Qu\\'il s\\'agisse d\\'un Thème Sombre pour reposer vos yeux ou de designs colorés... Vous gardez le contrôle !' },
]
"""

plans_fr_correct = """
const plansFr = [
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
      'Sécurité locale complète'
    ] 
  },
  { 
    name: 'Forfait Cloud Web/Mobile', 
    price: '2.950', 
    period: ' / mois',
    text: '', 
    featured: true,
    items: [
      'Tous les modules locaux + Accès Mobile + Module SMS',
      'Accès instantané depuis n\\'importe quel appareil (Web, Tablette, Téléphone) de n\\'importe où',
      'Sauvegardes automatiques sur le cloud, zéro perte de données', 
      'Rappels automatiques par SMS', 
      'Mises à jour gratuites instantanées et support technique prioritaire'
    ] 
  }
]
"""

# Insert them before const featuresEn and const plansEn
text = text.replace("const featuresEn = [", features_fr_correct + "\nconst featuresEn = [")
text = text.replace("const plansEn = [", plans_fr_correct + "\nconst plansEn = [")

with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
