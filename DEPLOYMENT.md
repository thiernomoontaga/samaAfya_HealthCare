# 🚀 Guide de Déploiement - SamaAfya Care Connect

## 📋 Vue d'ensemble du projet

SamaAfya est une plateforme de télémédecine spécialisée dans le suivi du diabète gestationnel, composée de plusieurs services micro-architecturés.

### 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Patient Front │    │   Doctor Front  │    │   Main Backend  │
│     (Vercel)    │    │     (Vercel)    │    │    (Render)     │
│                 │    │                 │    │                 │
│ - React SPA     │    │ - React SPA     │    │ - JSON Server   │
│ - Port: 8080    │    │ - Port: 8081    │    │ - Port: 5000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐    ┌─────────────────┐
                    │ Patient Service│    │ Doctor Service │
                    │    (Render)    │    │    (Render)    │
                    │                │    │                │
                    │ - JSON Server  │    │ - JSON Server  │
                    │ - Port: 3000   │    │ - Port: 3002   │
                    └─────────────────┘    └─────────────────┘
```

## 🎯 Stratégie de déploiement

### **Frontend (Vercel)**
- **Patient Front**: Interface patient avec design maternel
- **Doctor Front**: Interface médecin professionnelle
- **Avantages**: CDN global, déploiement automatique, analytics intégrés

### **Backend (Render)**
- **Main Backend**: API principale et données partagées
- **Patient Service**: Service spécialisé patient
- **Doctor Service**: Service spécialisé médecin
- **Avantages**: Support Node.js, bases de données, scaling automatique

## 📦 Préparation du déploiement

### 1. **Comptes requis**
- [Vercel](https://vercel.com) (gratuit)
- [Render](https://render.com) (gratuit pour démarrage)

### 2. **Variables d'environnement**

#### **Pour les Frontends (Vercel)**
```env
VITE_API_BASE_URL=https://samaafya-backend.onrender.com
VITE_PATIENT_SERVICE_URL=https://samaafya-patient-service.onrender.com
VITE_DOCTOR_SERVICE_URL=https://samaafya-doctor-service.onrender.com
```

#### **Pour les APIs (Render)**
```env
NODE_ENV=production
PORT=10000
```

## 🚀 Déploiement étape par étape

### **Étape 1: Déploiement des APIs (Render)**

#### **1.1 Backend principal**
```bash
cd samaAfya-backend
# Créer un repo GitHub et pousser le code
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/samaafya-backend.git
git push -u origin main
```

Sur Render:
1. Connecter le repo GitHub
2. Sélectionner "Web Service"
3. Runtime: Node
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Variables d'environnement: `NODE_ENV=production`, `PORT=10000`

#### **1.2 Service Patient**
```bash
cd samaAfya-patient-service
# Même procédure que ci-dessus
```

#### **1.3 Service Médecin**
```bash
cd samaAfya-doctor-service
# Même procédure que ci-dessus
```

### **Étape 2: Déploiement des Frontends (Vercel)**

#### **2.1 Frontend Patient**
```bash
cd samaAfya-patient-front
# Créer un repo GitHub
git init
git add .
git commit -m "Patient frontend"
git remote add origin https://github.com/username/samaafya-patient-front.git
git push -u origin main
```

Sur Vercel:
1. Importer le repo GitHub
2. Framework: Vite
3. Build Settings: `npm run build`
4. Output Directory: `dist`
5. Variables d'environnement (voir ci-dessus)

#### **2.2 Frontend Médecin**
```bash
cd samaAfya-doctor-front
# Même procédure
```

## 🔗 Configuration des communications

### **URLs de production (à remplacer après déploiement)**

```javascript
// Dans les frontends, remplacer les URLs locales par:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const PATIENT_SERVICE_URL = import.meta.env.VITE_PATIENT_SERVICE_URL || 'http://localhost:3000';
const DOCTOR_SERVICE_URL = import.meta.env.VITE_DOCTOR_SERVICE_URL || 'http://localhost:3002';
```

### **Exemple d'utilisation dans le code**

```javascript
// src/lib/api.ts
export const api = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  patientService: import.meta.env.VITE_PATIENT_SERVICE_URL,
  doctorService: import.meta.env.VITE_DOCTOR_SERVICE_URL,
};

// src/hooks/usePatients.ts
import { api } from '@/lib/api';

export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: () => fetch(`${api.patientService}/patients`).then(res => res.json()),
  });
};
```

## 📊 Monitoring et maintenance

### **Vercel**
- Analytics intégrés
- Logs de déploiement
- Rollbacks automatiques
- Domaines personnalisés

### **Render**
- Logs en temps réel
- Métriques de performance
- Scaling automatique
- Backups automatiques

## 🔧 Commandes de déploiement

### **Déploiement local (développement)**
```bash
# Terminal 1: Backend principal
cd samaAfya-backend && npm start

# Terminal 2: Service patient
cd samaAfya-patient-service && npm start

# Terminal 3: Service médecin
cd samaAfya-doctor-service && npm start

# Terminal 4: Frontend patient
cd samaAfya-patient-front && npm run dev

# Terminal 5: Frontend médecin
cd samaAfya-doctor-front && npm run dev
```

### **Build de production**
```bash
# Frontend patient
cd samaAfya-patient-front && npm run build

# Frontend médecin
cd samaAfya-doctor-front && npm run build
```

## 🚨 Dépannage

### **Problèmes courants**

#### **CORS errors**
- Vérifier les headers CORS dans les services Render
- Ajouter les domaines Vercel dans la configuration

#### **Variables d'environnement**
- S'assurer que toutes les variables sont définies
- Vérifier la syntaxe (pas d'espaces)

#### **Ports**
- Render utilise automatiquement le port 10000
- Les frontends utilisent les URLs complètes

### **Logs de debugging**
```bash
# Vercel
vercel logs

# Render
# Via le dashboard Render > Service > Logs
```

## 📈 Optimisations

### **Performance**
- Compression GZIP activée automatiquement
- CDN global Vercel
- Cache intelligent Render

### **Sécurité**
- HTTPS automatique
- Variables d'environnement chiffrées
- Mises à jour de sécurité automatiques

### **Coûts**
- **Vercel**: Gratuit pour usage personnel
- **Render**: 750h gratuites/mois
- Scaling automatique selon l'usage

## 🎯 Checklist de déploiement

- [ ] Repos GitHub créés
- [ ] Services Render déployés
- [ ] Frontends Vercel déployés
- [ ] Variables d'environnement configurées
- [ ] URLs mises à jour dans le code
- [ ] Tests de connectivité effectués
- [ ] Domaines personnalisés configurés (optionnel)

---

**🎉 Félicitations !** Votre plateforme SamaAfya est maintenant déployée et accessible mondialement.

**URLs de production (après déploiement) :**
- Patient: `https://samaafya-patient.vercel.app`
- Médecin: `https://samaafya-doctor.vercel.app`
- APIs: `https://samaafya-*.onrender.com`


