![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-FR_AR_EN-16A34A?style=for-the-badge&logo=googletranslate&logoColor=white)
 
# PME Frontend — Interface React.js 18
 
**Plateforme de gestion organisationnelle du Parti du Maroc Émergent (PME / حزب المغرب الصاعد)**
 
Développé par **WANDICH Achraf** · Stage de fin d'études @ **Mediatower** · 2025–2026  
Encadrants : **F. GMIRA & R. QESMI** · Directeur : **M. Hafid El Maktoub**  
Client : **M. Ali Amzine** — Parti du Maroc Émergent
 
---
 
## Contexte du projet
 
Ce frontend fait partie d'une application full-stack développée durant un stage de fin d'études au sein de **Mediatower**, entreprise marocaine spécialisée dans les solutions numériques et l'IA, fondée en 2023 et dirigée par **M. Hafid El Maktoub**.
 
Le projet a été commandité par **M. Ali Amzine**, fondateur du **Parti du Maroc Émergent (PME / حزب المغرب الصاعد)** — mouvement politique prônant l'intelligence collective, une approche anti-populiste et une vision stratégique pour l'émergence du Maroc.
 
### Problématique
 
Le PME gérait ses activités via des outils dispersés (Excel, réseaux sociaux, appels téléphoniques), sans centralisation ni hiérarchie numérique. Ce frontend apporte :
 
- Une interface SPA moderne, responsive, trilingue (FR / AR / EN)
- Des espaces distincts : public, membre, admin local, admin régional, super admin
- Une page publique complète pour présenter le PME et son programme
- Des tableaux de bord adaptés à chaque niveau hiérarchique du parti
### Objectifs
 
- Espace public PME — actualités, événements, programme, adhésion, dons
- Espace membre — profil, événements, sondages, donations, médias
- Tableau de bord admin — gestion membres, événements, rapports, médias, sondages, audit
- Internationalisation trilingue complète (français, arabe avec RTL, anglais)
- Statistiques en temps réel selon le niveau hiérarchique
---
 
## Stack technique
 
| Technologie | Version | Rôle |
| --- | --- | --- |
| React.js | 18 | Framework UI — Single Page Application |
| Tailwind CSS | 3 | Framework CSS utilitaire — design responsive |
| Axios | — | Client HTTP — gestion des tokens Bearer |
| React Router | v6 | Routage côté client SPA |
| npm | — | Gestionnaire de dépendances JS |
 
---
 
## Prérequis
 
- Node.js >= 18
- npm >= 9
- L'API backend `pme_backend` en cours d'exécution sur `http://127.0.0.1:8000`
---
 
## Installation
 
```bash
# 1. Cloner le dépôt
git clone https://github.com/<votre-org>/pme_frontend.git
cd pme_frontend
 
# 2. Installer les dépendances
npm install
 
# 3. Configurer l'URL de l'API
echo "REACT_APP_API_URL=http://127.0.0.1:8000/api" > .env
 
# 4. Lancer le serveur de développement
npm start
```
 
L'application est accessible sur `http://localhost:3000`
 
---
 
## Build de production
 
```bash
npm run build
```
 
Le dossier `build/` contient les fichiers statiques prêts à déployer.
 
---
 
## Structure du projet
 
```
pme_frontend/
├── public/
│   └── imgs/
│       ├── logo.webp
│       ├── ANTI_POPULISTES.webp
│       ├── PRO_EMERGENCE.webp
│       ├── PRO_FORMATION.webp
│       ├── AliAmzineCv.webp
│       └── pmeCreation.webp
└── src/
    ├── components/
    │   ├── home/
    │   │   ├── HeroSection.jsx
    │   │   ├── FeaturedNews.jsx
    │   │   ├── UpcomingEvents.jsx
    │   │   ├── CallToAction.jsx
    │   │   └── DigitalFeatures.jsx
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── Layout.jsx
    │   ├── NotificationBar.jsx
    │   ├── SmartResponder.jsx
    │   └── ConfirmDialog.jsx
    ├── pages/
    │   ├── admin/
    │   │   ├── UserManager.jsx
    │   │   ├── EventsManager.jsx
    │   │   ├── NewsManager.jsx
    │   │   ├── AdminPollList.jsx
    │   │   ├── CreatePoll.jsx
    │   │   ├── DonationsList.jsx
    │   │   ├── MediaManager.jsx
    │   │   ├── ReportsManager.jsx
    │   │   ├── AuditLogs.jsx
    │   │   ├── StatsPanel.jsx
    │   │   ├── StaticPagesEditor.jsx
    │   │   ├── SympathizersManager.jsx
    │   │   ├── VolunteersManager.jsx
    │   │   ├── NewsletterManager.jsx
    │   │   └── ContactsList.jsx
    │   ├── member/
    │   │   ├── DashboardFeed.jsx
    │   │   ├── MyEvents.jsx
    │   │   ├── MyDonations.jsx
    │   │   ├── MyMedia.jsx
    │   │   ├── MyNews.jsx
    │   │   ├── ActivePolls.jsx
    │   │   └── ProfileEditor.jsx
    │   └── public/
    │       ├── Home.jsx
    │       ├── About.jsx
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── EventList.jsx
    │       ├── EventDetail.jsx
    │       ├── NewsList.jsx
    │       ├── NewsDetail.jsx
    │       ├── PollList.jsx
    │       ├── Contact.jsx
    │       ├── MembershipRequestForm.jsx
    │       ├── PublicDonation.jsx
    │       ├── MediaGallery.jsx
    │       ├── Program.jsx
    │       ├── Search.jsx
    │       ├── StaticPage.jsx
    │       ├── Faq.jsx
    │       ├── Privacy.jsx
    │       ├── Terms.jsx
    │       └── Accessibility.jsx
    ├── services/
    │   └── api.js
    ├── i18n/
    │   └── LanguageContext.jsx
    └── utils/
        └── roles.js
```
 
---
 
## Configuration de l'API
 
Tous les appels HTTP sont centralisés dans `src/services/api.js` via Axios. Le token Sanctum est injecté automatiquement après connexion :
 
```
Authorization: Bearer {token}
```
 
Fichier `.env` :
 
```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
```
 
---
 
## Internationalisation
 
L'application supporte 3 langues via `src/i18n/LanguageContext.jsx` :
 
| Langue | Code | Sens de lecture |
| --- | --- | --- |
| Français | fr | LTR |
| Arabe | ar | RTL — support complet inclus |
| Anglais | en | LTR |
 
---
 
## Redirection après connexion
 
| Rôle | Redirection |
| --- | --- |
| `admin` — Super Admin | AdminDashboard + StatsPanel — portée nationale |
| `regional_admin` | AdminDashboard filtré sur sa région |
| `local_admin` | AdminDashboard filtré sur sa structure locale |
| `member` | MemberDashboard — DashboardFeed |
| Public / Visiteur | Espace public PME — Home.jsx |
 
---
 
## Pages publiques (sans authentification)
 
- Page d'accueil avec programme et actualités du PME
- Liste et détail des événements publics
- Formulaire de demande d'adhésion
- Inscription comme bénévole ou sympathisant
- Don financier en ligne via `PublicDonation.jsx`
- Galerie médias du parti
- Page de contact et newsletter
- Pages statiques : FAQ, Mentions légales, Accessibilité
---
 
## Scripts disponibles
 
| Commande | Description |
| --- | --- |
| `npm start` | Serveur de développement sur localhost:3000 |
| `npm run build` | Build de production dans build/ |
| `npm test` | Lance les tests |
 
---
 
## Dépendances principales
 
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "tailwindcss": "^3.x"
}
```
 
---
 
*Projet académique — Stage de fin d'études · WANDICH Achraf · Département Informatique, École Supérieure de Technologie · Client : M. Ali Amzine — Parti du Maroc Émergent · Entreprise d'accueil : Mediatower — M. Hafid El Maktoub · 2025–2026*
