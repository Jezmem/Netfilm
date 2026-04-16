# Netfilm

Une application web full-stack de découverte et gestion de films et séries, inspirée de Netflix. Les utilisateurs peuvent parcourir le catalogue, ajouter des contenus en favoris ou dans leur liste de lecture, laisser des notes et commentaires.

---

## Stack technique

**Frontend**
- Vue 3 + TypeScript (Composition API, `<script setup>`)
- Vue Router 5
- Pinia (gestion d'état)
- Vite (bundler)
- Axios (client HTTP avec intercepteurs JWT)
- Vuelidate (validation de formulaires)
- vue3-toastify (notifications)

**Backend**
- Node.js + Express.js 5
- JWT (access token 15min + refresh token 7j avec rotation)
- bcryptjs (hachage des mots de passe)
- Multer (upload de fichiers)
- Helmet + CORS + express-rate-limit (sécurité)
- Joi (validation des données)

**Base de données**
- Supabase (PostgreSQL)
- Row-Level Security (RLS) activé sur toutes les tables

---

## Fonctionnalités

### Utilisateurs
- Inscription et connexion
- Profil utilisateur avec upload d'avatar
- Ajout/suppression de favoris
- Gestion d'une liste de lecture (watchlist)
- Notes (1-5 étoiles) et commentaires sur les films/séries

### Catalogue
- Parcourir les films et séries
- Filtrage par catégorie
- Recherche de contenu
- Pages de détail pour chaque film/série

### Administration
- Tableau de bord avec statistiques
- Gestion CRUD des films, séries et catégories
- Upload d'images pour les contenus

---

## Structure du projet

```
netfilm/
├── src/                        # Frontend Vue 3 + TypeScript
│   ├── api/index.ts            # Client Axios avec intercepteurs JWT
│   ├── components/             # Composants réutilisables
│   ├── router/index.ts         # Routes et guards d'authentification
│   ├── stores/
│   │   ├── auth.ts             # Store authentification (Pinia)
│   │   └── content.ts          # Store films/séries (Pinia)
│   └── views/
│       ├── HomeView.vue
│       ├── LoginView.vue
│       ├── RegisterView.vue
│       ├── ProfileView.vue
│       ├── MovieDetailView.vue
│       ├── SeriesDetailView.vue
│       ├── FavoritesView.vue
│       ├── WatchlistView.vue
│       └── admin/
│           ├── AdminDashboardView.vue
│           ├── AdminMoviesView.vue
│           ├── AdminSeriesView.vue
│           └── AdminCategoriesView.vue
│
├── server/                     # Backend Express.js
│   ├── index.js                # Point d'entrée du serveur
│   ├── controllers/            # Logique métier
│   ├── routes/                 # Définition des routes API
│   ├── middleware/             # Auth JWT + upload fichiers
│   ├── validators/             # Schémas de validation Joi
│   └── config/supabase.js      # Client Supabase (service role)
│
└── supabase/migrations/        # Migrations de la base de données
```

---

## Routes API

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | `/api/auth/register` | Public | Créer un compte |
| POST | `/api/auth/login` | Public | Se connecter |
| POST | `/api/auth/refresh` | Public | Rafraîchir le token |
| POST | `/api/auth/logout` | Public | Se déconnecter |
| GET | `/api/user/profile` | Auth | Voir son profil |
| PUT | `/api/user/profile` | Auth | Modifier son profil |
| POST | `/api/user/avatar` | Auth | Upload avatar |
| GET | `/api/user/stats` | Admin | Statistiques globales |
| GET | `/api/movies` | Public | Liste des films |
| GET | `/api/movies/:id` | Public | Détail d'un film |
| POST | `/api/movies` | Admin | Créer un film |
| PUT | `/api/movies/:id` | Admin | Modifier un film |
| DELETE | `/api/movies/:id` | Admin | Supprimer un film |
| GET | `/api/series` | Public | Liste des séries |
| GET | `/api/series/:id` | Public | Détail d'une série |
| POST | `/api/series` | Admin | Créer une série |
| PUT | `/api/series/:id` | Admin | Modifier une série |
| DELETE | `/api/series/:id` | Admin | Supprimer une série |
| GET | `/api/categories` | Public | Liste des catégories |
| POST | `/api/categories` | Admin | Créer une catégorie |
| PUT | `/api/categories/:id` | Admin | Modifier une catégorie |
| DELETE | `/api/categories/:id` | Admin | Supprimer une catégorie |
| GET | `/api/favorites` | Auth | Voir ses favoris |
| POST | `/api/favorites` | Auth | Ajouter un favori |
| DELETE | `/api/favorites/:id` | Auth | Supprimer un favori |
| GET | `/api/watchlist` | Auth | Voir sa watchlist |
| POST | `/api/watchlist` | Auth | Ajouter à la watchlist |
| DELETE | `/api/watchlist/:id` | Auth | Supprimer de la watchlist |
| GET | `/api/notes` | Auth | Voir ses notes |
| POST | `/api/notes` | Auth | Ajouter/modifier une note |
| DELETE | `/api/notes/:id` | Auth | Supprimer une note |

---

## Schéma de la base de données

| Table | Description |
|-------|-------------|
| `users` | Comptes utilisateurs (nom, email, mot de passe haché, rôle, avatar) |
| `categories` | Catégories de contenu (Action, Drame, etc.) |
| `movies` | Films (titre, description, date de sortie, note, image, catégorie) |
| `series` | Séries (titre, description, date de sortie, note, image, catégorie) |
| `favorites` | Favoris des utilisateurs (user_id, content_type, content_id) |
| `watchlist` | Liste de lecture des utilisateurs |
| `user_notes` | Notes et commentaires des utilisateurs (1-5 étoiles) |
| `refresh_tokens` | Tokens de rafraîchissement JWT avec rotation |

---

## Installation et démarrage

### Prérequis
- Node.js 18+
- Un projet Supabase avec les migrations appliquées

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env` à la racine :

```env
# Frontend
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
VITE_API_BASE_URL=http://localhost:3001

# Backend Supabase
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# JWT
JWT_SECRET=[chaine-aleatoire-securisee]
JWT_REFRESH_SECRET=[autre-chaine-aleatoire-securisee]
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Serveur
PORT=3001
NODE_ENV=development

# Uploads
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### 3. Lancer en développement

Dans deux terminaux séparés :

```bash
# Terminal 1 - Frontend (http://localhost:5173)
npm run dev

# Terminal 2 - Backend (http://localhost:3001)
npm run server:dev
```

### 4. Build de production

```bash
npm run build
npm run server
```

---

## Pages disponibles

| URL | Accès | Description |
|-----|-------|-------------|
| `/` | Public | Accueil - catalogue complet |
| `/movies/:id` | Public | Détail d'un film |
| `/series/:id` | Public | Détail d'une série |
| `/login` | Public | Connexion |
| `/register` | Public | Inscription |
| `/profile` | Auth | Profil utilisateur |
| `/favorites` | Auth | Mes favoris |
| `/watchlist` | Auth | Ma liste de lecture |
| `/admin` | Admin | Tableau de bord admin |
| `/admin/movies` | Admin | Gestion des films |
| `/admin/series` | Admin | Gestion des séries |
| `/admin/categories` | Admin | Gestion des catégories |

---

## Sécurité

- Mots de passe hachés avec bcrypt (12 rounds)
- Tokens JWT avec courte durée de vie (15 min) + refresh token rotatif (7 jours)
- Rate limiting sur les endpoints d'authentification (20 requêtes / 15 min)
- Row-Level Security (RLS) Supabase sur toutes les tables
- Headers de sécurité via Helmet
- Validation des entrées avec Joi côté serveur
