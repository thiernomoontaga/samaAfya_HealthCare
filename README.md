# SamaAfya Care Connect 💙

> **Application de télémédecine pour le suivi du diabète gestationnel**
> Plateforme sécurisée et bienveillante pour accompagner les femmes enceintes diabétiques et leurs professionnels de santé.

## 🌟 Vue d'ensemble

SamaAfya Care Connect est une application web moderne développée pour faciliter le suivi médical des femmes enceintes atteintes de diabète gestationnel. L'application offre une interface intuitive et rassurante pour les patientes, ainsi qu'un tableau de bord complet pour les professionnels de santé.

### 🎯 Objectifs principaux

- **Suivi glycémique quotidien** avec saisie simplifiée des mesures
- **Communication sécurisée** entre patientes et équipe médicale
- **Visualisation des tendances** via graphiques interactifs
- **Support IA bienveillant** pour conseils généraux
- **Gestion multi-centres** pour les professionnels de santé

## 🏗️ Architecture technique

### Technologies utilisées

**Frontend :**
- ⚛️ **React 18** avec TypeScript
- 🎨 **Tailwind CSS** pour le styling
- 🔄 **TanStack Query** pour la gestion des données
- 🧭 **React Router** pour la navigation
- 📊 **Recharts** pour les graphiques
- 🎭 **Shadcn/UI** pour les composants

**Backend :**
- 🗄️ **JSON Server** pour la simulation d'API REST
- 💾 **Base de données JSON** pour la persistance des données

**Sécurité :**
- 🔐 **Authentification multi-facteurs** pour les médecins
- 🛡️ **Gestion des sessions** et permissions
- 🔒 **Chiffrement des données sensibles**

## 🚀 Installation et démarrage

### Prérequis

- **Node.js** (version 18+)
- **npm** ou **yarn**
- **Git**

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd samaAfya_App

# Installation des dépendances backend
cd samaAfya-backend
npm install

# Installation des dépendances frontend
cd ../samaAfya-front
npm install
```

### Démarrage

```bash
# Terminal 1 : Démarrer le backend (port 5000)
cd samaAfya-backend
npm start

# Terminal 2 : Démarrer le frontend patient (port 8080)
cd samaAfya-patient-front
npm run dev

# Terminal 3 : Démarrer le frontend médecin (port 8081)
cd samaAfya-doctor-front
npm run dev
```

### Accès à l'application

- **Frontend patient** : http://localhost:8080
- **Frontend médecin** : http://localhost:8081
- **API Backend** : http://localhost:5000
- **Service patient** : http://localhost:3000
- **Service médecin** : http://localhost:3001

## 👩‍⚕️ Fonctionnalités

### Pour les patientes 💕

#### 📱 Interface patiente
- **Connexion sécurisée** avec vérification des identifiants
- **Inscription guidée** en 3 étapes (type diabète, infos personnelles, code médical)
- **Choix du mode de surveillance** après première connexion

#### 📊 Tableau de bord
- **Vue d'ensemble** : mesures du jour, tendances hebdomadaires
- **Saisie glycémique** : interface intuitive pour 4 mesures quotidiennes
- **Graphiques interactifs** : évolution des valeurs, moyennes
- **Alertes intelligentes** : notifications sur les valeurs critiques

#### 💬 Communication
- **Messagerie sécurisée** avec l'équipe médicale (avec code de suivi)
- **Accès aux documents** médicaux (ordonnances, résultats)

### Pour les médecins 👨‍⚕️

#### 🔐 Authentification renforcée
- **Connexion professionnelle** avec email institutionnel
- **Vérification MFA** obligatoire (code à 6 chiffres)
- **Session sécurisée** avec timeout automatique

#### 📈 Dashboard médical
- **Vue d'ensemble** : statistiques globales, alertes actives
- **Graphiques de suivi** : tendances collectives, moyennes par centre
- **Notifications temps réel** : valeurs critiques, non-compliance

#### 👥 Gestion des patientes
- **Table interactive** avec tri par priorité (urgences d'abord)
- **Profils détaillés** : historique complet, graphiques personnalisés
- **Filtres avancés** : recherche, statut, type de diabète
- **Actions médicales** : messagerie, consultation dossiers

#### ⚙️ Paramètres professionnels
- **Gestion du profil** : informations personnelles et professionnelles
- **Sécurité MFA** : activation/désactivation, régénération codes
- **Préférences** : notifications, thèmes, paramètres régionaux

## 🎨 Design system

### Palette de couleurs
- **Primaire** : Rose poudré (#FADADD) - Féminin et rassurant
- **Secondaire** : Bleu pastel (#7EC8E3) - Confiance médicale
- **Accent** : Violet doux (#C1A1D3) - Communication
- **Succès** : Vert menthe (#AEEEEE) - Validation
- **Avertissement** : Orange doux (#FFB366) - Attention
- **Erreur** : Rouge pastel (#FF9999) - Alerte

### Typographie
- **Police principale** : Poppins (Google Fonts)
- **Hiérarchie** : Titre (2xl-4xl), Sous-titre (lg-xl), Corps (base-sm)
- **Poids** : Light (300), Regular (400), Medium (500), Semibold (600)

### Composants UI
- **Boutons** : Arrondis, avec états hover et focus
- **Cartes** : Ombres douces, bordures subtiles
- **Formulaires** : Labels flottants, validation en temps réel
- **Navigation** : Sidebar responsive avec animations

## 📊 Structure des données

### Base de données JSON

```json
{
  "patients": [
    {
      "id": "P001",
      "firstName": "Amina",
      "lastName": "Ndiaye",
      "email": "amina@example.com",
      "diabetesType": "gestationnel",
      "gestationalWeek": 28,
      "trackingCode": "ABC123",
      "hasMonitoringMode": true,
      "monitoringMode": "classique"
    }
  ],
  "glycemiaReadings": [
    {
      "id": "r1",
      "patientId": "P001",
      "moment": "jeun",
      "value": 0.88,
      "status": "normal",
      "date": "2025-01-15",
      "time": "07:30"
    }
  ],
  "messages": [
    {
      "id": "m1",
      "patientId": "P001",
      "senderId": "D001",
      "senderType": "doctor",
      "content": "Vos résultats sont encourageants",
      "timestamp": "2025-01-15T10:30:00"
    }
  ],
  "doctors": [
    {
      "id": "D001",
      "firstname": "Dr. Moussa",
      "lastname": "Ba",
      "email": "moussa.ba@hospital.com",
      "mfaEnabled": true,
      "patientsFollowed": ["P001", "P002"]
    }
  ]
}
```

## 🧪 Comptes de test

### Comptes patientes
- **Email** : Utiliser les comptes créés via l'inscription
- **Accès** : Après inscription et choix du mode de surveillance

### Comptes médecins
- **Dr. Moussa Ba**
  - Email : `moussa.ba@hospital.com`
  - Mot de passe : `medecin123`
  - MFA : Code généré automatiquement

- **Dr. Fatima Diallo**
  - Email : `fatima.diallo@clinique.sn`
  - Mot de passe : `docteur456`
  - MFA : Code généré automatiquement

## 🔧 Scripts disponibles

### Backend (samaAfya-backend)
```bash
npm start    # Démarre JSON Server sur le port 5000
npm run dev  # Mode développement avec rechargement
```

### Frontend (samaAfya-front)
```bash
npm run dev      # Démarrage développement (port 8080)
npm run build    # Build production
npm run preview  # Prévisualisation build
npm run lint     # Vérification ESLint
```

## 🌍 Déploiement

### Préparation pour la production

1. **Build frontend** :
   ```bash
   cd samaAfya-front
   npm run build
   ```

2. **Configuration serveur** :
   - Remplacer JSON Server par une vraie base de données
   - Configurer HTTPS et certificats SSL
   - Mettre en place la sauvegarde automatique

3. **Variables d'environnement** :
   ```env
   VITE_API_URL=https://api.samaafya.com
   VITE_ENVIRONMENT=production
   ```

### Hébergement recommandé

- **Frontend** : Vercel, Netlify, ou AWS S3 + CloudFront
- **Backend** : Heroku, Railway, ou AWS EC2
- **Base de données** : PostgreSQL ou MongoDB

## 🤝 Contribution

### Processus de développement

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commiter** les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Créer** une Pull Request

### Standards de code

- **ESLint** et **Prettier** configurés
- **TypeScript** strict pour la sécurité des types
- **Tests unitaires** avec Jest et React Testing Library
- **Commits** conventionnels (Conventional Commits)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe et contact

**Développé avec ❤️ pour les femmes enceintes diabétiques**

- **Conception UX/UI** : Interface centrée patiente
- **Développement** : React/TypeScript moderne
- **Design system** : Cohérent et accessible

Pour toute question ou suggestion :
- 📧 Email : contact@samaafya.com
- 🐛 Issues : [GitHub Issues](https://github.com/username/samaafya/issues)
- 📖 Documentation : [Wiki](https://github.com/username/samaafya/wiki)

---

**SamaAfya Care Connect** - *Parce que chaque grossesse mérite le meilleur suivi médical 💙*