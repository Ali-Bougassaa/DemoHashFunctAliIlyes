<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
=======
# Démo Sécurité Blockchain

Une application web interactive pour comprendre les concepts de sécurité de la blockchain à travers des simulations visuelles et des démonstrations pratiques.

## 🚀 Fonctionnalités

### 1. Laboratoire de Hachage
- Génération de hash en temps réel
- Comparaison entre SHA-256, MD5 et hash faible
- Démonstration de l'effet d'avalanche
- Visualisation des différences entre les algorithmes

### 2. Studio Blockchain
- Création de blocs en temps réel
- Ajustement de la difficulté de minage
- Suivi de la consommation d'énergie
- Visualisation de la chaîne complète

### 3. Simulateur d'Attaque
- Simulation d'attaques avec Eve (🦹‍♀️) et Alice (👩)
- Démonstration de la détection des modifications
- Visualisation du processus de sécurité
- Interface intuitive et pédagogique

## 🛠️ Technologies Utilisées

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (pour les animations)
- Web Crypto API
- Vite (pour le développement)

## 📦 Installation

1. Clonez le repository :
```bash
git clone https://github.com/Ali-Bougassaa/HashFunction.git
```

2. Installez les dépendances :
```bash
cd HashFunction
npm install
```

3. Lancez l'application en mode développement :
```bash
npm run dev
```

L'application sera disponible à l'adresse [http://localhost:5173](http://localhost:5173)

## 🎯 Guide d'Utilisation

### Laboratoire de Hachage
1. Entrez du texte dans le champ
2. Observez les différents hashs générés
3. Testez l'effet d'avalanche

### Studio Blockchain
1. Ajustez la difficulté de minage
2. Ajoutez des données pour créer un bloc
3. Observez le processus de minage et la consommation d'énergie

### Simulateur d'Attaque
1. Sélectionnez une transaction
2. Tentez une modification avec Eve
3. Observez la détection et la protection

## 🔒 Concepts de Sécurité Démontrés

- Hachage cryptographique
- Preuve de travail (PoW)
- Intégrité de la chaîne
- Détection des modifications
- Effet d'avalanche
- Consommation énergétique

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteur

Ali Bougassaa - [@Ali-Bougassaa](https://github.com/Ali-Bougassaa)
>>>>>>> abd076d7342e23b2e0124deb6ed044e1d0088d8b
