# Novadis CRI App

Application mobile de Compte Rendu d'Intervention pour Novadis.
Version 1.0.0 MVP

## Fonctionnalités

- Création de CRI Projet (Installation, suivi, etc.)
- Création de CRI Service (Maintenance, dépannage)
- Génération automatique de PDF
- Signature électronique (Technicien et Client)
- Ajout de photos
- Historique des interventions
- Fonctionnement 100% hors ligne

## Installation

1. Prérequis : Node.js, npm, Expo Go sur mobile (ou simulateur)
2. Cloner le projet ou copier les sources
3. Installer les dépendances :
   ```bash
   npm install
   ```
4. Lancer l'application :
   ```bash
   npx expo start
   ```

## Structure du Projet

- `src/screens` : Les écrans de l'application (Home, Formulaires, Historique)
- `src/components` : Composants réutilisables (Inputs, PhotoPicker, SignaturePad)
- `src/utils` : Fonctions utilitaires, stockage, génération PDF, validation
- `src/navigation` : Configuration de la navigation

## Technologies

- React Native / Expo
- React Navigation
- React Hook Form + Yup (Validation)
- AsyncStorage (Stockage local)
- Expo Print / Sharing (PDF)
- Expo Image Picker (Photos)
- React Native Signature Canvas (Signatures)

## Notes Techniques

- Les données sont stockées localement sur l'appareil.
- Les PDF générés peuvent être partagés ou sauvegardés via le menu de partage natif.
- Le logo Novadis est intégré textuellement dans le PDF pour ce MVP.
