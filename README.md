# My Story Football - PWA

**De l'amateur au pro, Montre qui tu es**

Application mobile communautaire de football avec profils joueurs, coachs et clubs. Conçue comme PWA native pour iOS avec déploiement sur Apple App Store.

## 🏗️ Architecture Technique

- **Frontend**: React + TypeScript + Vite
- **UI**: Radix UI + Tailwind CSS + shadcn/ui
- **Mobile**: Capacitor pour iOS/Android
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Replit Auth + OpenID Connect
- **Payment**: Stripe pour abonnements
- **Storage**: Google Cloud Storage

## 📱 Build Instructions pour Codemagic

### Variables d'environnement requises:
```
DATABASE_URL=your_database_url
SESSION_SECRET=your_session_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

### Scripts de build:
```bash
# Installation des dépendances
npm install

# Build production
npm run build

# Synchronisation Capacitor iOS
npx cap add ios
npx cap sync ios
npx cap open ios
```

### Configuration Codemagic YAML:
```yaml
definitions:
  env_versions: &env_versions
    node: 18.17.0
    
  scripts:
    - name: Install dependencies
      script: npm install
    - name: Build app
      script: npm run build
    - name: Capacitor iOS setup
      script: |
        npx cap add ios
        npx cap sync ios
    - name: iOS build
      script: |
        xcode-project build-ipa \
          --workspace ios/App/App.xcworkspace \
          --scheme App \
          --archive-flags="-destination 'generic/platform=iOS'"

  artifacts:
    - build/ios/ipa/*.ipa
    - /tmp/xcodebuild_logs/*.log

  publishing:
    app_store_connect:
      api_key: $APP_STORE_CONNECT_PRIVATE_KEY
      key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER
      issuer_id: $APP_STORE_CONNECT_ISSUER_ID
```

## 🍎 Déploiement Apple App Store

### Prérequis:
- **Apple Developer Account** (99€/an)
- **App Store Connect** access
- **iOS Distribution Certificate**
- **Provisioning Profile** pour l'app

### Capacitor Configuration (capacitor.config.ts):
```typescript
{
  appId: 'com.terence.mystoryfootball',
  appName: 'My Story Football',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  ios: {
    scheme: 'My Story Football'
  }
}
```

### Étapes de déploiement:
1. **Codemagic** build automatique iOS
2. **Archive .ipa** généré
3. **Upload** vers App Store Connect
4. **Validation** Apple (24-48h)
5. **Publication** sur App Store

## 🚀 Fonctionnalités

- ✅ **3 Types de profils**: Joueurs, Coachs, Clubs
- ✅ **Système de notation**: Style Football Manager
- ✅ **Historique de carrière**: Suivi saison par saison
- ✅ **Médias sociaux**: Photos, vidéos, likes
- ✅ **Messagerie intégrée**
- ✅ **Classements communautaires**
- ✅ **Abonnements Stripe**
- ✅ **Design mobile-first**

## 📊 Métriques PWA

- **Performance**: 90+ Lighthouse
- **Accessibilité**: 100 Lighthouse
- **Best Practices**: 100 Lighthouse
- **SEO**: 90+ Lighthouse
- **Offline Ready**: Service Worker
- **Install Prompt**: Add to Home Screen

## 🔧 Développement Local

```bash
# Cloner le repo
git clone https://github.com/terencinho902803/my-story-football

# Installer les dépendances
npm install

# Démarrer en mode dev
npm run dev

# Build production
npm run build

# Test iOS local
npx cap run ios
```

## 📝 Licence

© 2024 Terence Desrues - My Story Football  
Application propriétaire destinée à la vente sur Apple App Store.

## 🏆 Contact

**Développeur**: Terence Desrues  
**Business**: De l'amateur au pro, Montre qui tu es  
**Target**: Apple App Store (Paid App)
