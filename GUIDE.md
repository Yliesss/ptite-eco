# P'tite Éco — mise en ligne sur Firebase

Gratuit (offre Spark de Firebase). Compte(s) avec e-mail + mot de passe, base de données privée par personne, serveurs en Europe, appli installable sur Android.

## 1. Créer le projet Firebase (depuis le téléphone, ça marche)

1. Va sur **console.firebase.google.com** → **Créer un projet** → nom : `mon-porte-monnaie`.
2. **Désactive Google Analytics** (pas de traceur = pas besoin de bandeau cookies).
3. Menu **Authentication** → **Commencer** → **E-mail/Mot de passe** → **Activer** → Enregistrer.
   - Onglet **Modèles** → langue **Français** (pour l'e-mail « mot de passe oublié »).
4. Menu **Firestore Database** → **Créer une base** → emplacement **europe-west9 (Paris)** → **mode production**.
5. ⚙️ **Paramètres du projet** → en bas **Vos applications** → icône **`</>`** (Web) → nom `porte-monnaie` → **Enregistrer**.
   Firebase affiche un bloc `firebaseConfig = { apiKey: ..., ... }` : garde-le.

## 2. Mettre ta configuration dans les fichiers

- Ouvre `public/firebase-config.js` et remplace les valeurs `COLLE-ICI` / `TON-PROJET` par celles du bloc `firebaseConfig`.
- Ouvre `.firebaserc` et remplace `TON-PROJET` par l'**ID du projet** (visible dans les paramètres, ex. `mon-porte-monnaie-1a2b3`).

## 3. Mettre en ligne

### Option A — Sans ordinateur : Google Cloud Shell (dans le navigateur du téléphone)
1. Ouvre **shell.cloud.google.com** avec le même compte Google.
2. Menu **⋮** → **Importer** → choisis `mon-porte-monnaie-firebase.zip`.
3. Tape :
   ```
   unzip mon-porte-monnaie-firebase.zip -d porte-monnaie && cd porte-monnaie
   firebase login --no-localhost
   firebase deploy
   ```
   (Si `firebase` est introuvable : `npm install -g firebase-tools`, puis recommence.)
   Tu peux aussi modifier `firebase-config.js` directement dans Cloud Shell avec `nano public/firebase-config.js`.

### Option B — Avec un ordinateur
1. Installe **Node.js** (nodejs.org), puis dans un terminal : `npm install -g firebase-tools`
2. Dans le dossier du projet : `firebase login` puis `firebase deploy`

`firebase deploy` publie le site **et** les règles de sécurité de la base (`firestore.rules`).

## 4. Utiliser l'appli
- Lien : **https://TON-PROJET.web.app**
- Sur Android : ouvre le lien dans **Chrome** → menu **⋮** → **Installer l'application** (ou « Ajouter à l'écran d'accueil »). Elle s'ouvre en plein écran avec son icône.
- Chaque personne crée son propre compte. Personne ne voit les données des autres.
- Empreinte / visage : **Mon compte** → « Déverrouiller avec l'empreinte ou le visage ».

## 5. Mettre à jour plus tard
Remplace les fichiers dans `public/`, puis relance `firebase deploy`.

## Bon à savoir
- Les valeurs de `firebase-config.js` ne sont pas secrètes ; ce sont les règles `firestore.rules` qui protègent les données (chacun ne lit que son propre document).
- Offre gratuite : largement suffisante pour toi, ta famille et des centaines d'utilisateurs.
- Éditeur et contact affichés dans la politique de confidentialité : en haut du script de `public/index.html` (`const EDITEUR`).
