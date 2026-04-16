/* ═══════════════════════════════════════════════════
   NEW TECH HOME SERVICES — SERVICE WORKER
   Handles: Offline cache · Background sync · Push notifications
   ═══════════════════════════════════════════════════ */

const CACHE_NAME    = "newtech-v1";
const DYNAMIC_CACHE = "newtech-dynamic-v1";

// Files to cache on install (app shell)
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/crm/login",
  "/customer",
  "/technician",
  "/static/js/main.chunk.js",
  "/static/js/bundle.js",
  "/manifest.json",
  "/favicon.ico",
];

// ── Install ───────────────────────────────────────────
self.addEventListener("install", (e) => {
  console.log("[SW] Installing New Tech Service Worker...");
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell");
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log("[SW] Some assets failed to cache:", err);
      });
    })
  );
  self.skipWaiting();
});

// ── Activate ──────────────────────────────────────────
self.addEventListener("activate", (e) => {
  console.log("[SW] Activating New Tech Service Worker...");
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== DYNAMIC_CACHE)
          .map((k) => {
            console.log("[SW] Removing old cache:", k);
            return caches.delete(k);
          })
      )
    )
  );
  self.clients.claim();
});

// ── Fetch (Network first, fallback to cache) ──────────
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET and external requests (Google Sheets, WhatsApp, etc.)
  if (e.request.method !== "GET") return;
  if (!url.origin.includes(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(e.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed — serve from cache
        return caches.match(e.request).then((cached) => {
          if (cached) return cached;
          // Fallback for HTML pages
          if (e.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/index.html");
          }
        });
      })
  );
});

// ── Push Notifications ────────────────────────────────
self.addEventListener("push", (e) => {
  let data = { title: "New Tech Home Services", body: "You have a new notification", icon: "/logo192.png", badge: "/logo192.png" };
  try { data = { ...data, ...e.data.json() }; } catch(err) {}

  const options = {
    body:    data.body,
    icon:    data.icon    || "/logo192.png",
    badge:   data.badge   || "/logo192.png",
    vibrate: [200, 100, 200],
    data:    { url: data.url || "/" },
    actions: data.actions || [],
    tag:     data.tag     || "newtech-notification",
    renotify: true,
  };

  e.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ── Notification Click ────────────────────────────────
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url || "/";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── Background Sync ───────────────────────────────────
self.addEventListener("sync", (e) => {
  if (e.tag === "sync-service-updates") {
    e.waitUntil(syncServiceUpdates());
  }
  if (e.tag === "sync-inventory") {
    e.waitUntil(syncInventory());
  }
});

async function syncServiceUpdates() {
  console.log("[SW] Background sync: service updates");
  // Will connect to Firebase when backend is set up
}

async function syncInventory() {
  console.log("[SW] Background sync: inventory");
}
