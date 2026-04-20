# Suivi Tabac 🚬

Application mobile Next.js complète pour suivre et réduire sa consommation de cigarettes.

## Fonctionnalités

### Gratuit
- Suivi journalier (compteur + note)
- Graphique 7/14/30 jours
- Stats de base (aujourd'hui, moyenne, semaine, record)
- Historique avec suppression

### Premium (2,99€ — achat unique)
- **Plan de réduction progressive** avec objectif hebdomadaire
- **Statistiques avancées** : streak, tendance, meilleur/pire jour
- **Calcul des économies** : argent et cigarettes non fumées
- **Export CSV** de toutes les données
- **Notifications** de rappel quotidien
- **Page paramètres** : prix du paquet, objectif, date de début

## Installation

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Structure

```
cigarette-tracker/
├── app/
│   ├── page.tsx              # Page principale (3 onglets)
│   ├── settings/page.tsx     # Page paramètres
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── StatCard.tsx          # Carte stat
│   ├── ConsumptionChart.tsx  # Graphique Chart.js
│   ├── HistoryList.tsx       # Historique + suppression
│   ├── ReductionPlan.tsx     # Plan de réduction (premium)
│   ├── AdvancedStats.tsx     # Stats avancées (premium)
│   └── PremiumGate.tsx       # Verrou premium
├── hooks/
│   └── useStorage.ts         # localStorage + export CSV
└── lib/
    └── dates.ts              # Utilitaires dates
```

## Déploiement

```bash
# Vercel (recommandé)
npx vercel

# Build statique pour PWA/APK
# Dans next.config.js, ajouter : output: 'export'
npm run build
```

## Monétisation

Pour activer les vrais paiements, remplacer le `handleUnlockPremium` dans `page.tsx` par :
- **Google Play Billing** (pour l'APK Play Store)
- **Stripe** (pour la version web)
- **RevenueCat** (gère les deux automatiquement)
