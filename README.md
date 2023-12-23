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

Une fois que tout est bien lancé et fonctionnel, on dispose des URLs suivantes (à moins d'avoir changé les ports dans le docker compose):
- `http://localhost:5173`: front
- `http://localhost:3000`: backend
- `http://localhost:8080`: adminer

## Listing des fonctionnalités

| Daniel (dan1M) | Bastien (Bass913) | Taslima (Taslima-Ahamed-Mze) | Emmanuella (Manu1Mackenzii) |
| --- | --- | --- | --- |
| - Back: Gestion complète du panier et des commandes (+ livraison & paiement), fonctions de vérifications régulières (CRON >> check paniers vides/invalides, check les comptes qui doivent mettre à jour leur mot de passe)  | - Back : Mise en place du backend express avec une architecture MVC, Mise en place de Sequelize ORM et Mongoose ainsi que toute la sécurité relative au serveur (CORS, Middleware erreur next, Validation avec Express Validator), Gestion complète de l'authentification & des droits d'accès selon le rôle (Middleware), gestion de toutes les informations relatives à un utilisateur (CRUD) & des envois de mail, Gestion des alertes de préférences, Anonymisation de l'utilisateur après suppresion du compte | - Back : Gestion des produits et ses variants (couleur et taille), gestion des stocks | - Back : Création des routes , modèles et controller de : color, category, order, product |
| - Front: Page Accueil, layout des pages,  composable formulaire (useCustomForm), parcours panier complet (de ajout produit au panier >> création de commande), gestion des commandes | - Front : Création de toutes les pages relatives à l'authentification (Connexion, inscription, mot de passe oublié), Création de la page Espace client ainsi que tous les composants de cette page (Modifier les infos utilisateur, gestion des alertes, supprimer le compte, changer le mot de passe etc...), Création de la page 404 et page de confirmation compte après validation par mail. Gestion des routes et des protections de routes sur les pages cités. Ajout du cookie de consentement et création des pages mentions légales et CGV avec les infos relatives au RGPD. | - Front : page produit et détail produit, recherche produit, composant button de suppression |  - Front : Dashboard Admin et toutes ses fonctionnalités : création, delete, update, affichage etc...  |
| - Mise en production: Front: avec Vercel (vercel.com), Back: l'API Express avec Heroku, Database: Postgres avec Render (render.com) |  | - Mise en production |  |

