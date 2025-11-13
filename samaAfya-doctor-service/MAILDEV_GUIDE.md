# Guide complet d'utilisation de MailDev dans SamaAfya

## Vue d'ensemble

MailDev est un outil de développement qui capture et affiche les emails envoyés par votre application, permettant de tester les fonctionnalités d'email sans envoyer de vrais emails.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │───▶│ Serveur Emails  │───▶│   MailDev SMTP  │───▶│   MailDev Web   │
│   SamaAfya      │    │   (Port 3002)   │    │   (Port 1025)   │    │   (Port 1080)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Installation

### 1. Dépendances

MailDev est déjà configuré dans `package.json` :

```json
{
  "devDependencies": {
    "maildev": "^2.0.5",
    "concurrently": "^8.2.2"
  },
  "dependencies": {
    "json-server": "^1.0.0-beta.3",
    "nodemailer": "^6.9.7",
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

### 2. Installation

```bash
cd samaAfya-doctor-service
npm install
```

## Configuration

### Service d'email (`mailService.js`)

Le service d'email utilise Nodemailer pour envoyer des emails vers MailDev :

```javascript
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,  // Port SMTP de MailDev
  secure: false
});
```

### Fonctions disponibles

- `sendMFAEmail(email, mfaCode)` - Envoi de codes MFA
- `sendTrackingCodeEmail(email, trackingCode, patientName)` - Envoi de codes de suivi

## Démarrage

### 1. MailDev uniquement

```bash
cd samaAfya-doctor-service
npm run maildev
# Ou
npx maildev
```

### 2. API + MailDev

```bash
cd samaAfya-doctor-service
npm run dev:full
```

### 3. Démarrage séparé

**Terminal 1 - API :**
```bash
cd samaAfya-doctor-service
npx json-server --watch db.json --port 3001
```

**Terminal 2 - Serveur d'emails :**
```bash
cd samaAfya-doctor-service
npm run email-server
```

**Terminal 3 - MailDev :**
```bash
cd samaAfya-doctor-service
npm run maildev
```

## Interface Web

### Accès
- URL : http://localhost:1080
- Interface responsive
- Mise à jour en temps réel

### Fonctionnalités

#### 1. Liste des emails
- Sujet de l'email
- Expéditeur et destinataire
- Date et heure
- Statut (lu/non lu)

#### 2. Détails d'un email
- **Headers** : Informations complètes
- **HTML** : Version formatée
- **Texte** : Version texte brut
- **Source** : Code source complet

#### 3. Actions
- **Marquer comme lu/non lu**
- **Supprimer**
- **Télécharger** (EML, HTML, TXT)

## Test de l'intégration

### 1. Test manuel

Créez `test-email.js` :

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false
});

const mailOptions = {
  from: 'test@samaafya.com',
  to: 'docteur@samaafya.com',
  subject: 'Test MailDev - SamaAfya',
  html: '<h1>Test réussi !</h1><p>MailDev fonctionne correctement.</p>'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Erreur:', error);
  } else {
    console.log('Email envoyé:', info.messageId);
  }
});
```

Exécutez :
```bash
cd samaAfya-doctor-service
node test-email.js
```

### 2. Test dans l'application

#### Connexion médecin (MFA)
1. Allez sur le frontend médecin
2. Connectez-vous avec : `moussa.ba@hospital.com` / `medecin123`
3. Vérifiez MailDev pour l'email MFA

#### Génération de code de suivi
1. Connectez-vous en tant que médecin
2. Allez dans "Mes patientes"
3. Cliquez "Générer un code de suivi"
4. Remplissez le formulaire
5. Vérifiez MailDev pour l'email du code

## Types d'emails

### 1. Email MFA (Authentification Multi-Facteur)

**Destinataire** : Médecin se connectant
**Contenu** :
- Code à 6 chiffres
- Valable 3 minutes
- Template professionnel

**Exemple** :
```
Sujet : Votre code de vérification - SamaAfya
De : SamaAfya HealthCare <noreply@samaafya.com>
Contenu : Votre code : 123456
```

### 2. Email Code de Suivi

**Destinataire** : Patient ou contact désigné
**Contenu** :
- Code de suivi unique
- Nom de la patiente
- Instructions d'utilisation

**Exemple** :
```
Sujet : Votre code de suivi médical - SamaAfya
De : SamaAfya HealthCare <noreply@samaafya.com>
Contenu : Code pour Amina Ndiaye : AFYA-A1B2C3
```

## Configuration avancée

### Ports personnalisés

```bash
# Port web personnalisé
npx maildev --web 8080

# Port SMTP personnalisé
npx maildev --smtp 2525

# Les deux
npx maildev --web 8080 --smtp 2525
```

### Options MailDev

```bash
npx maildev --help
```

Options principales :
- `--web <port>` : Port de l'interface web
- `--smtp <port>` : Port du serveur SMTP
- `--ip <ip>` : Adresse IP d'écoute
- `--verbose` : Mode verbeux
- `--silent` : Mode silencieux

## Dépannage

### MailDev ne démarre pas

```bash
# Vérifier les ports
lsof -i :1080
lsof -i :1025

# Tuer les processus si nécessaire
kill -9 <PID>
```

### Emails non reçus

1. Vérifier que MailDev fonctionne : http://localhost:1080
2. Vérifier les logs de l'application
3. Tester avec le script `test-email.js`

### Erreur de connexion SMTP

```javascript
// Vérifier la configuration
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false,
  debug: true,  // Activer le debug
  logger: true
});
```

## Intégration en production

⚠️ **Important** : MailDev est uniquement pour le développement !

Pour la production, remplacez la configuration SMTP par votre service d'email réel :

```javascript
// Production
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## Scripts NPM

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "email-server": "node email-server.js",
    "maildev": "maildev",
    "dev:full": "concurrently \"npm run dev\" \"npm run email-server\" \"npm run maildev\"",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## Sécurité

- **Développement uniquement** : N'utilisez jamais MailDev en production
- **Données sensibles** : Les emails restent locaux sur votre machine
- **Isolation** : Aucun email ne quitte votre environnement de développement

## Support

Pour plus d'informations :
- [Documentation MailDev](https://github.com/maildev/maildev)
- [Documentation Nodemailer](https://nodemailer.com/)

---

**✅ MailDev est maintenant intégré et prêt à l'emploi dans votre projet SamaAfya !**