// ═══════════════════════════════════════════════════════════
//  NEW TECH PWA SETUP — COMPLETE INSTRUCTIONS
//  Follow these steps to make your app installable
// ═══════════════════════════════════════════════════════════


// ── STEP 1: Copy Files ───────────────────────────────────────
//
// Copy these files:
//   service-worker.js    →  C:\Users\Suraj\newtech-home-services\public\service-worker.js
//   manifest.json        →  C:\Users\Suraj\newtech-home-services\public\manifest.json  (REPLACE existing)
//   PWAInstallPrompt.jsx →  C:\Users\Suraj\newtech-home-services\src\PWAInstallPrompt.jsx


// ── STEP 2: Update public/index.html ────────────────────────
//
// Open: C:\Users\Suraj\newtech-home-services\public\index.html
// Find the <head> section and ADD these lines:

/*
  <!-- PWA Theme Color -->
  <meta name="theme-color" content="#2563eb" />

  <!-- iOS PWA Support -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="New Tech" />

  <!-- iOS Icons (add after existing link tags) -->
  <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
  <link rel="apple-touch-icon" sizes="152x152" href="%PUBLIC_URL%/logo192.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="%PUBLIC_URL%/logo192.png" />

  <!-- Splash screen color -->
  <meta name="msapplication-TileColor" content="#2563eb" />
*/


// ── STEP 3: Update src/App.jsx ───────────────────────────────
//
// Add these imports at the TOP of App.jsx:

import PWAInstallPrompt, { usePWA, OfflineBar, UpdateBanner } from "./PWAInstallPrompt";

// Add this line INSIDE the App() function (before the return):
usePWA();

// Add these components INSIDE the return, right after the opening <div>:
/*
  <OfflineBar />
  <UpdateBanner />
  <PWAInstallPrompt />
*/

// ── EXAMPLE App.jsx after changes: ──────────────────────────
/*
import PWAInstallPrompt, { usePWA, OfflineBar, UpdateBanner } from "./PWAInstallPrompt";

function App() {
  usePWA(); // ← Add this line

  return (
    <Router>
      <OfflineBar />        // ← Add this
      <UpdateBanner />      // ← Add this
      <PWAInstallPrompt />  // ← Add this

      <Routes>
        <Route path="/crm/login"   element={<CRMLogin />} />
        <Route path="/crm/*"       element={<CRMLayout />} />
        <Route path="/technician"  element={<TechnicianApp />} />
        <Route path="/customer"    element={<CustomerPortal />} />
        <Route path="/admin"       element={<AdminPanel />} />
        <Route path="/*"           element={<MainWebsite />} />
      </Routes>
    </Router>
  );
}
*/


// ── STEP 4: Build & Deploy ───────────────────────────────────
//
// Run in terminal:
//   npm run build
//
// Then deploy /build folder to Vercel:
//   1. Go to vercel.com
//   2. Sign up free
//   3. Drag & drop the /build folder
//   4. Get URL: newtech.vercel.app
//   5. Connect your domain
//
// ⚠️ IMPORTANT: PWA only works on HTTPS
//    Vercel gives free HTTPS automatically ✅


// ── STEP 5: Test on Phone ────────────────────────────────────
//
// Android (Chrome):
//   1. Open your website URL in Chrome
//   2. Wait 2 seconds
//   3. Banner appears: "Install App — Free"
//   4. Tap Install
//   5. App icon appears on home screen ✅
//
// iPhone (Safari):
//   1. Open your website URL in Safari (NOT Chrome)
//   2. Wait 3 seconds
//   3. Instruction banner appears
//   4. Tap Share button ⬆️
//   5. Tap "Add to Home Screen"
//   6. Tap Add ✅
//
// ⚠️ iPhone requires Safari browser (not Chrome)


// ── WHAT USERS GET ───────────────────────────────────────────
//
// ✅ App icon on home screen (looks like native app)
// ✅ Full screen — no browser bar
// ✅ Works offline (shows cached data)
// ✅ Push notifications ready
// ✅ Loads faster (cached)
// ✅ "New Tech Home Services" name under icon
// ✅ Splash screen on open
// ✅ Portrait orientation lock
//
// ❌ Not listed on Play Store / App Store (for that → Capacitor)
// ❌ Cannot access deep phone features (contacts, SMS)
