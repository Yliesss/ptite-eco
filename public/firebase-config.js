// Configuration du projet Firebase « Mon porte monnaie ».
// Ces valeurs ne sont pas secrètes : la sécurité vient des règles Firestore (firestore.rules).
export const firebaseConfig = {
  apiKey: "AIzaSyAORsa3y5rFFuiAHYbQw-fmovJzRt3n2YE",
  authDomain: "mon-porte-monnaie-e3f0a.firebaseapp.com",
  projectId: "mon-porte-monnaie-e3f0a",
  storageBucket: "mon-porte-monnaie-e3f0a.firebasestorage.app",
  messagingSenderId: "852224914431",
  appId: "1:852224914431:web:ac815b4ac3caf654e82dca"
};

// Protection anti-abus (Firebase App Check) : colle ici ta clé de site reCAPTCHA v3 pour l'activer.
// Laisse vide pour la désactiver.
export const appCheckSiteKey = "";
