// Permet d'installer l'appli et de l'ouvrir même avec une connexion faible.
const CACHE = "ptite-eco-v32";
const FICHIERS = ["./", "index.html", "firebase-config.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))));
  self.clients.claim();
});
// Réseau d'abord (pour toujours avoir la dernière version), cache si hors ligne.
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => { const copie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); return r; })
      .catch(() => caches.match(e.request))
  );
});

// ---------- Rappels quand l'appli est fermée (Android, appli installée) ----------
// L'appli enregistre la liste des prochains prélèvements ; le téléphone réveille ce script environ 1 à 2 fois par jour.
async function envoyerRappels() {
  try {
    const c = await caches.open("pm-donnees");
    const r = await c.match("/rappels.json"); if (!r) return;
    const { liste = [] } = await r.json();
    const vusRep = await c.match("/rappels-vus.json"); const vus = vusRep ? await vusRep.json() : [];
    const auj = new Date(); const dem = new Date(auj.getTime() + 864e5);
    const iso = d => d.toISOString().slice(0, 10);
    for (const x of liste) {
      if ((x.date === iso(auj) || x.date === iso(dem)) && !vus.includes(x.id)) {
        await self.registration.showNotification(x.titre, { body: (x.date === iso(auj) ? "Aujourd'hui · " : "Demain · ") + x.texte, icon: "icons/icon-192.png", badge: "icons/icon-192.png", tag: x.id });
        vus.push(x.id);
      }
    }
    await c.put("/rappels-vus.json", new Response(JSON.stringify(vus.slice(-200)), { headers: { "Content-Type": "application/json" } }));
  } catch (e) {}
}
self.addEventListener("periodicsync", e => { if (e.tag === "rappels") e.waitUntil(envoyerRappels()); });
// Toucher une notification ouvre l'appli
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(l => { for (const c of l) { if ("focus" in c) return c.focus(); } return self.clients.openWindow("./"); }));
});
