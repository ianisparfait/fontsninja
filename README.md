# Fonts Ninja

Application de consultation et découverte de polices typographiques, construite avec Next.js 15 et React 19.

## 🚀 Installation et démarrage

```bash
# Installation des dépendances
npm install

# Lancement en mode développement (avec Turbopack)
npm run dev

# Build de production
npm run build

# Démarrage en production
npm start

# Linting
npm run lint
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture technique

### Stack principale
- **Next.js 15.5.2** - Framework React avec App Router, RSC (React Server Components) et optimisations Turbopack
- **React 19.1.0** - Dernière version stable avec nouvelles APIs (use, Actions)
- **TypeScript 5** - Type safety strict activé pour réduire les erreurs runtime
- **Tailwind CSS 4** - Framework CSS utilitaire avec PostCSS moderne

### Structure du projet

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── api/               # API Routes (Server Components)
│   ├── font/[id]/         # Page dynamique de détails
│   ├── layout.tsx         # Layout racine avec ThemeProvider
│   └── page.tsx           # Page d'accueil
├── components/            # Composants UI réutilisables
│   ├── header.tsx        # Navigation globale
│   ├── theme-provider.tsx # Gestion du dark mode
│   └── svg.tsx           # Rendu SVG optimisé
├── features/             # Feature-based architecture
│   └── home/            # Fonctionnalités page d'accueil
├── lib/                  # Utilitaires et helpers
│   └── utils.ts         # cn() pour class merging
├── types/               # Définitions TypeScript
└── data/                # Données statiques (JSON)
```

## 🎯 Décisions techniques et justifications

### 1. **Turbopack avec Next.js 15**
- **Turbopack** : Bundler ultra-rapide (700x plus rapide que Webpack selon les benchmarks Vercel)
- **Optimisations images/fonts automatiques** : next/font et next/image intégrés

### 2. **Tailwind CSS 4 (dernière version)**
- **Utility-first** : Développement rapide, cohérence visuelle, élimination du CSS mort
- **Performance** : Classes purgées automatiquement, bundle CSS minimal (~5-10kb en prod)
- **Design system intégré** : Variables CSS custom, dark mode natif, responsive design
- **Class merging** : Utilisation de `clsx` + `tailwind-merge` pour gérer les conflits de classes dynamiques

### 3. **Fetch natif (pas de bibliothèque HTTP)**
- **Native Web API** : Pas de dépendance supplémentaire (~13kb économisés vs axios)
- **Performances** : Moins d'overhead mémoire, support natif des streams
- **Next.js 15** : Fetch étendu avec cache automatique, revalidation, et deduplication
- **Suffisant pour le besoin** : API simple sans intercepteurs complexes ni retry logic nécessaires

### 4. **Pas de librairie de composants (shadcn/ui, MUI, etc.)**
- **Composants custom** : UI très spécifique (cartes de fonts, rendu SVG dynamique)
- **Bundle size** : Évite l'import de composants non utilisés (~50-100kb économisés)
- **Contrôle total** : Pas de surcharge de styles à override, maintenance simplifiée
- **Accessible si besoin** : Structure prête pour intégrer shadcn/ui à la demande

### 5. **Configuration ESLint avancée**
- **TypeScript-ESLint** : Règles strictes (`consistent-type-imports`, `no-explicit-any`)
- **Import organization** : Ordre automatique des imports (builtin → external → internal → types → styles)
- **React Hooks** : `exhaustive-deps` pour éviter les bugs de dépendances
- **Accessibility** : eslint-plugin-jsx-a11y pour WCAG 2.1 compliance
- **Prettier intégré** : Format automatique, évite les conflits d'équipe

### 6. **TypeScript strict mode**
- **Type safety maximale** : `strict: true` dans tsconfig.json
- **Types explicites** : Interfaces pour tous les props et types de retour
- **Paths aliases** : `@/*` pour imports propres et refactoring facilité
- **Pas de `any`** : Force à typer correctement, réduit les bugs en prod

### 7. **Thème dynamique (next-themes)**
- **Dark mode système** : Détection automatique des préférences OS
- **No flash** : `suppressHydrationWarning` pour éviter le flash de thème
- **Performance** : localStorage pour persistance, transitions CSS fluides
- **Accessibilité** : Respect des préférences utilisateur (`prefers-color-scheme`)

### 8. **Optimisation SVG custom**
- **html-react-parser** : Rendu SVG sécurisé depuis strings HTML
- **Classes dynamiques** : Manipulation des paths SVG avec Tailwind pour dark mode
- **Performance** : Pas de re-render inutiles, composant memoïsé si besoin

## 🔄 Axes d'amélioration futurs
Les points listés ci-dessous n’ont pas été développés volontairement : leur implémentation aurait ajouté une complexité ou un coût de développement disproportionné par rapport aux besoins actuels.
Ils constituent néanmoins des pistes d’amélioration à envisager si le projet évolue ou gagne en ampleur.

### Performance
1. **Virtualisation des listes** (`TanStack Virtual`)
   - **Contexte** : Si pagination remplacée par infinite scroll avec >100 items
   - **Gain** : Rendu DOM réduit de ~90%, scroll fluide à 60fps
   - **Implémentation** : ~1h, ROI immédiat sur listes longues

2. **Image optimization** (Sharp/next/image)
   - **Contexte** : Si images bitmap ajoutées (actuellement que du SVG)
   - **Gain** : WebP/AVIF automatique, lazy loading, blur placeholder
   - **Implémentation** : Configuration next.config.ts + remotePatterns

3. **API Caching strategy**
   - **Contexte** : Si données deviennent dynamiques (actuellement JSON statiques)
   - **Options** : `fetch` avec `revalidate`, React Cache, Redis
   - **Gain** : Réduction latence serveur, meilleure UX

### Scalabilité
4. **State Management** (`zustand` / `TanStack Query`)
   - **Contexte** : Si state partagé complexe (favoris, comparaison, filtres avancés)
   - **zustand** : ~1kb, simple, performant pour client state
   - **TanStack Query** : Cache API, sync server/client, optimistic updates

5. **Testing** (Vitest + Testing Library + Playwright)
   - **Unit** : Vitest (ultra-rapide, ESM natif)
   - **Integration** : React Testing Library (accessibilité focus)
   - **E2E** : Playwright (multi-browser, traces, screenshots)

6. **Monitoring** (Sentry + Vercel Analytics)
   - **Errors** : Sentry pour error tracking production
   - **Performance** : Web Vitals (LCP, CLS, INP) trackés
   - **Analytics** : User behavior, conversions

### Developer Experience
7. **Storybook** (si composants réutilisés)
   - **Contexte** : Si design system émergent avec >10 composants
   - **Gain** : Documentation vivante, tests visuels, onboarding facilité

8. **API Client généré** (si API externe)
   - **Options** : OpenAPI/Swagger → typed client (orval, openapi-typescript)
   - **Gain** : Types synchronisés auto, moins d'erreurs API

9. **Husky + lint-staged**
   - **Pre-commit** : Lint uniquement fichiers modifiés
   - **Pre-push** : Tests + build check
   - **Gain** : Qualité code garantie, CI/CD plus rapide

### Accessibilité
10. **Améliorations A11y**
    - **Focus management** : Gestion du focus clavier (roving tabindex)
    - **Screen readers** : ARIA labels enrichis, live regions
    - **Tests automatisés** : axe-core en CI

## 🛠️ Choix techniques détaillés

### Pourquoi pas axios ?
```typescript
// Fetch natif (Next.js 15 extended)
const data = await fetch('/api/families?page=1', {
  next: { revalidate: 3600 } // Cache 1h auto
});

// vs axios (nécessite config manuelle)
const data = await axios.get('/api/families', {
  params: { page: 1 },
  // + config cache externe (react-query/swr)
});
```
- **Performance** : 0 dépendance, tree-shaking impossible avec axios
- **Next.js** : Fetch étendu avec cache/revalidate intégré
- **Suffisant** : Pas besoin d'intercepteurs pour ce projet

### Pourquoi clsx + tailwind-merge ?
```typescript
// Sans merge : classes en conflit
<div className={cn("p-4", condition && "p-6")} />
// → class="p-4 p-6" (p-6 appliqué ✅)

// Sans clsx : logique conditionnelle verbeuse
className={`p-4 ${condition ? 'bg-blue' : 'bg-red'}`}
// vs
className={cn("p-4", condition ? "bg-blue" : "bg-red")}
```

### Architecture feature-based
```
features/
├── home/           # Tout ce qui concerne la page d'accueil
│   ├── card.tsx
│   └── pagination.tsx
└── font-detail/    # (futur) Page de détails
    ├── header.tsx
    └── variants-list.tsx
```
- **Colocation** : Code lié regroupé (vs components/ global)
- **Scalabilité** : Suppression d'une feature = suppression d'un dossier
- **Ownership** : Équipes peuvent "posséder" des features

## 📝 Conventions de code

- **Imports** : Ordre automatique par ESLint (builtin → external → internal → types)
- **Naming** : PascalCase (composants), camelCase (fonctions/variables), kebab-case (fichiers)
- **Types** : `type` pour unions/primitives, `interface` pour objets extensibles
- **Components** : Typed props avec `ReactNode` pour return type explicite
- **Paths** : Utilisation de `@/` pour tous les imports internes

## 🎨 Design tokens

Tailwind configuré avec variables CSS custom pour cohérence :
- **Colors** : `bg-background`, `text-foreground`, `bg-muted` (auto dark mode)
- **Spacing** : Scale Tailwind standard (4px baseline)
- **Typography** : Inter (variable font, optimisé par next/font)

## 🔐 Sécurité

- **No XSS** : html-react-parser avec sanitization
- **TypeScript strict** : Pas de `any`, tous les types vérifiés
- **ESLint security rules** : Détection patterns dangereux
- **CSP headers** : (à configurer en prod si nécessaire)
