// Permet d'installer l'appli et de l'ouvrir même avec une connexion faible.
const CACHE = "ptite-eco-v36";
const LIBS = "ptite-eco-libs-v1";
const FICHIERS = ["./", "index.html", "firebase-config.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE && n !== LIBS && n !== "pm-donnees").map(n => caches.delete(n)))));
  self.clients.claim();
});
// Bibliothèques versionnées (Firebase, polices, carte, scan) : gardées sur le téléphone, l'appli démarre même sans réseau
const estLib = u => (u.hostname === "www.gstatic.com" && u.pathname.startsWith("/firebasejs/")) || u.hostname === "fonts.gstatic.com" || u.hostname === "fonts.googleapis.com"
  || (u.hostname === "unpkg.com" && u.pathname.startsWith("/leaflet@")) || (u.hostname === "cdn.jsdelivr.net" && /@\d/.test(u.pathname));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (estLib(url)) {
    e.respondWith(caches.open(LIBS).then(async c => {
      const hit = await c.match(e.request);
      if (hit) return hit;
      const r = await fetch(e.request);
      if (r.ok || r.type === "opaque") c.put(e.request, r.clone());
      return r;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  // Réseau d'abord (dernière version), mais si le réseau traîne plus de 3 s on affiche la copie du téléphone
  e.respondWith(new Promise(resolve => {
    let fini = false;
    const copie = () => caches.match(e.request).then(r => r || (e.request.mode === "navigate" ? caches.match("index.html") : undefined));
    const t = setTimeout(() => copie().then(r => { if (r && !fini) { fini = true; resolve(r); } }), 3000);
    fetch(e.request).then(r => {
      if (r.ok) { const c2 = r.clone(); caches.open(CACHE).then(c => c.put(e.request, c2)); }
      if (!fini) { fini = true; clearTimeout(t); resolve(r); }
    }).catch(() => { clearTimeout(t); copie().then(r => { if (!fini) { fini = true; resolve(r || Response.error()); } }); });
  }));
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
