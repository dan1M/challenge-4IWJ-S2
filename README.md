# Challenge-4IWJ-2 - Womeny

## Installation & démarrage

### Pré-requis

Avoir installé *git* et *docker* sur sa machine 

Cloner le projet: `git clone https://github.com/dan1M/challenge-4IWJ-S2`

### Première étape: setup environnement
On va copier/coller `.env.example` dans `.env` du dossier `front` et `backend/api` : 

Depuis la racine du projet:
- `cd backend/api`
- `cp .env.example .env`

La même chose pour le dossier `front`:
- `cd ../..` (si vous continuez depuis l'étape précedente)
- `cd front`
- `cp .env.example .env`

Dans ces deux fichiers `.env`, veuillez ajoutez vos propres valeurs secrètes correspondant aux variables.

### Seconde étape: lancement docker compose
Lancement des conteneurs avec docker compose:
- `docker compose up` ou `docker compose up -d` (pour le lancer en tâche de fond)

Si tout se passe bien, tous les conteneurs doivent être lancés et prêt à être utilisés.

Vous pouvez vérifier le bon fonctionnement des conteneurs avec: `docker compose ps`

Une fois que tout est bien lancé et fonctionnel, on dispose des URLs suivantes (à moins d'avoir changé les ports du docker compose):
- `http://localhost:5173`: front
- `http://localhost:3000`: backend
- `http://localhost:8080`: adminer

## Listing des fonctionnalités

| Daniel (dan1M) | Bastien (Bass913) | Taslima (Taslima-Ahamed-Mze) | Emmanuella (Manu1Mackenzii) |
| --- | --- | --- | --- |
| - Backend:  | | | |
| - Mise en production: Front: avec Vercel (vercel.com), Back: l'API Express avec Heroku, Database: Postgres avec Render (render.com) | 
