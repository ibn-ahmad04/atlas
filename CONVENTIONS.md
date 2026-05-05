# Conventions Atlas

> **📌 Lecture obligatoire pour tous les membres de l'équipe.**

---

## ⚙️ Stack réelle du projet

| Technologie | Version installée |
|-------------|------------------|
| Laravel | 12.x |
| PHP | 8.3 |
| React | 19.x |
| React Router | v7 |
| Vite | 8.x |
| Tailwind CSS | v4 |
| Sanctum | 4.x |

---

## 📋 Noms des modèles et tables (référence obligatoire)

| Concept métier | Modèle Laravel | Table MySQL |
|----------------|----------------|-------------|
| Utilisateur | `User` | `users` |
| Profil agent | `AgentProfile` | `agent_profiles` |
| Disponibilité | `Availability` | `availabilities` |
| Demande/Réservation | `Booking` | `bookings` |
| Notification | `Notification` | `notifications` |

> ⚠️ Ne jamais utiliser "Demande" ou "Disponibilite" dans le code.
> Les noms officiels sont Booking et Availability.

---

## 🔐 Sécurité — règles Sanctum

- Expiration des tokens : **7 jours** (`60 * 24 * 7` minutes)
- Préfixe des tokens : `atlas_`
- Logout : toujours appeler `currentAccessToken()->delete()`
- Routes protégées : middleware `auth:sanctum` obligatoire

---

## 🛣️ Routes API

- **Préfixe global** : `/api/v1/`

### Authentification

| Méthode | Route                    | Description        |
|---------|--------------------------|--------------------|
| POST    | `/api/v1/auth/register`  | Inscription        |
| POST    | `/api/v1/auth/login`     | Connexion          |
| POST    | `/api/v1/auth/logout`    | Déconnexion        |

### Ressources

| Méthode | Route                    | Description                    |
|---------|--------------------------|--------------------------------|
| GET     | `/api/v1/agents`         | Liste des agents               |
| GET     | `/api/v1/agents/{id}`    | Détail d'un agent              |
| POST    | `/api/v1/demandes`       | Créer une demande              |
| ...     | ...                      | (étendre selon les besoins)    |

---

## 📦 Format des réponses API

**Toutes** les réponses doivent respecter ce format JSON :

```json
{
  "success": true,
  "message": "Description lisible de l'opération",
  "data": { }
}
```

- `success` : `true` en cas de succès, `false` en cas d'erreur.
- `message` : message court décrivant le résultat.
- `data` : payload de la réponse (objet, tableau, ou `null`).

---

## 🌿 Branches Git

Chaque module a sa propre branche de feature. **Ne jamais travailler directement sur `main` ou `develop`.**

| Branche                          | Responsabilité                    |
|----------------------------------|-----------------------------------|
| `feature/m1-auth`                | Authentification                  |
| `feature/m2-backend`             | Backend / API Laravel             |
| `feature/m3-bdd`                 | Base de données / Migrations      |
| `feature/m4-frontend-voyageur`   | Frontend côté voyageur            |
| `feature/m5-frontend-agent-admin`| Frontend côté agent & admin       |

> Les branches de feature sont créées depuis `develop` et mergées dans `develop` via Pull Request.

---

## ✍️ Conventions de commits

Utiliser le format **Conventional Commits** :

```
<type>: <description courte en impératif>
```

| Type    | Usage                                         |
|---------|-----------------------------------------------|
| `feat`  | Nouvelle fonctionnalité                       |
| `fix`   | Correction de bug                             |
| `chore` | Maintenance, dépendances, config              |
| `docs`  | Documentation uniquement                     |
| `refactor` | Refactoring sans changement de comportement |
| `test`  | Ajout ou modification de tests               |

**Exemples :**
```
feat: ajout endpoint POST /api/v1/demandes
fix: correction validation email à l'inscription
docs: ajout conventions équipe Atlas
chore: mise à jour dépendances Laravel
```

---

## 🗄️ Base de données

### Langue
- Toutes les colonnes sont nommées en **anglais**.
  - ✅ `user_id`, `created_at`, `first_name`
  - ❌ `utilisateur_id`, `date_creation`, `prenom`

### Règles obligatoires

| Règle                          | Détail                                         |
|--------------------------------|------------------------------------------------|
| **Timestamps**                 | Toutes les tables doivent avoir `created_at` et `updated_at` |
| **Soft deletes**               | Obligatoire sur `users` et `agent_profiles` (`deleted_at`) |
| **Clés primaires**             | `id` auto-increment (ou UUID selon décision d'équipe) |
| **Clés étrangères**            | Nommage : `<table_au_singulier>_id` (ex : `user_id`) |

---

## ⚙️ Workflow général

```
develop
  └── feature/mx-xxx   ← tu travailles ici
        ↓ Pull Request
      develop          ← merge après review
        ↓ (fin de sprint)
        main           ← production stable
```

1. `git checkout develop && git pull origin develop`
2. `git checkout -b feature/mx-ma-tache`
3. Travaille, commits réguliers
4. `git push origin feature/mx-ma-tache`
5. Ouvre une **Pull Request** vers `develop`
6. Attends la review avant de merger

---

*Dernière mise à jour : Avril 2026 — Équipe Atlas*
