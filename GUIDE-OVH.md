# Mettre P'tite Éco en ligne sur OVH

1. Espace client OVH → Hébergements → ton hébergement → onglet **Multisite** : vérifie que ton domaine pointe vers le dossier `www`.
2. Onglet **Multisite** → active le **SSL** (Let's Encrypt, gratuit) pour ton domaine. Attends qu'il soit « Activé ».
3. Envoie les fichiers : onglet **FTP-SSH** → **FTP Explorer** (ou FileZilla sur PC).
   Mets **le contenu** du dossier `public` (index.html, sw.js, icons, .htaccess…) directement dans `www`.
   Le fichier `.htaccess` est caché : dans FileZilla, menu Serveur → « Forcer l'affichage des fichiers cachés ».
4. Firebase → Authentication → Paramètres → **Domaines autorisés** → ajoute ton domaine (ex. ptiteeco.fr et www.ptiteeco.fr).
5. Si tu utilises App Check : ajoute aussi le domaine dans ta clé reCAPTCHA.
6. Ne mets jamais `firestore.rules` ni ce guide sur le site : ils restent sur ton ordinateur.
