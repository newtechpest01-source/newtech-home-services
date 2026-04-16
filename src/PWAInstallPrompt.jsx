import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════
   PWA Install Prompt Component
   Shows "Add to Home Screen" banner for:
   - Android Chrome → uses native install prompt
   - iPhone Safari  → shows manual instruction
   ═══════════════════════════════════════════════════ */

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner,     setShowBanner]     = useState(false);
  const [isIOS,          setIsIOS]          = useState(false);
  const [isInstalled,    setIsInstalled]    = useState(false);
  const [dismissed,      setDismissed]      = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || window.navigator.standalone === true;
    if (standalone) { setIsInstalled(true); return; }

    // Check if user dismissed before
    const wasDismissed = localStorage.getItem("pwa_banner_dismissed");
    if (wasDismissed) { setDismissed(true); return; }

    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    if (ios) {
      // Show iOS instructions after 3s
      setTimeout(() => setShowBanner(true), 3000);
    } else {
      // Android/Chrome — listen for beforeinstallprompt
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setTimeout(() => setShowBanner(true), 2000);
      });
    }

    // Hide if installed after prompt
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowBanner(false);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem("pwa_banner_dismissed", "1");
  };

  if (!showBanner || isInstalled || dismissed) return null;

  return (
    <>
      {/* Backdrop blur for iOS instruction */}
      {isIOS && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
          zIndex:9998, backdropFilter:"blur(4px)"
        }} onClick={handleDismiss} />
      )}

      {/* Banner */}
      <div style={{
        position:"fixed",
        bottom: isIOS ? "auto" : 0,
        top:    isIOS ? "auto" : "auto",
        left:0, right:0,
        zIndex:9999,
        padding:"0 16px 16px",
        animation:"slideUp 0.3s ease",
      }}>
        <div style={{
          background: isIOS
            ? "linear-gradient(135deg,#1e293b,#0f172a)"
            : "linear-gradient(135deg,#1e40af,#2563eb)",
          borderRadius: isIOS ? 16 : "16px 16px 12px 12px",
          padding:"18px 16px",
          boxShadow:"0 -4px 30px rgba(0,0,0,0.3)",
          border:"1px solid rgba(255,255,255,0.1)",
          maxWidth:500,
          margin:"0 auto",
        }}>
          {/* App info */}
          <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:14}}>
            <div style={{
              width:52, height:52, borderRadius:12,
              background:"#fff", display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:"1.8rem", flexShrink:0,
              boxShadow:"0 2px 8px rgba(0,0,0,0.2)"
            }}>🏠</div>
            <div>
              <div style={{color:"#fff",fontWeight:800,fontSize:"1rem"}}>New Tech Home Services</div>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:"0.78rem",marginTop:2}}>
                Install app for quick access
              </div>
              <div style={{display:"flex",gap:6,marginTop:5}}>
                {["📴 Works Offline","🔔 Notifications","⚡ Fast"].map((f,i)=>(
                  <span key={i} style={{
                    background:"rgba(255,255,255,0.15)",color:"#fff",
                    fontSize:"0.65rem",fontWeight:600,padding:"2px 7px",
                    borderRadius:20
                  }}>{f}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Android Install Button */}
          {!isIOS && (
            <div style={{display:"flex",gap:8}}>
              <button onClick={handleInstall} style={{
                flex:1, padding:"11px", borderRadius:10, border:"none",
                background:"#fff", color:"#2563eb", fontSize:"0.9rem",
                fontWeight:800, cursor:"pointer", fontFamily:"inherit",
              }}>
                📲 Install App — Free
              </button>
              <button onClick={handleDismiss} style={{
                padding:"11px 14px", borderRadius:10,
                border:"1px solid rgba(255,255,255,0.3)",
                background:"transparent", color:"rgba(255,255,255,0.7)",
                fontSize:"0.85rem", cursor:"pointer", fontFamily:"inherit",
              }}>✕</button>
            </div>
          )}

          {/* iOS Instructions */}
          {isIOS && (
            <>
              <div style={{
                background:"rgba(255,255,255,0.08)", borderRadius:10,
                padding:"12px 14px", marginBottom:12,
              }}>
                <div style={{color:"#fff",fontWeight:700,fontSize:"0.88rem",marginBottom:10}}>
                  📱 Add to iPhone Home Screen:
                </div>
                {[
                  {step:"1", icon:"⬆️", text:`Tap the Share button at the bottom of Safari`},
                  {step:"2", icon:"➕", text:`Scroll down and tap "Add to Home Screen"`},
                  {step:"3", icon:"✅", text:`Tap "Add" — app icon appears on your home screen`},
                ].map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:i<2?8:0}}>
                    <div style={{
                      width:22,height:22,borderRadius:"50%",
                      background:"#2563eb",color:"#fff",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:"0.7rem",fontWeight:800,flexShrink:0
                    }}>{s.step}</div>
                    <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.85)",lineHeight:1.4}}>
                      {s.icon} {s.text}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <div style={{
                  flex:1,background:"rgba(255,255,255,0.1)",borderRadius:9,
                  padding:"10px",textAlign:"center",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:6
                }}>
                  <span style={{fontSize:"1.2rem"}}>⬆️</span>
                  <span style={{color:"rgba(255,255,255,0.7)",fontSize:"0.78rem"}}>Tap Share below ↓</span>
                </div>
                <button onClick={handleDismiss} style={{
                  padding:"10px 16px",borderRadius:9,
                  border:"1px solid rgba(255,255,255,0.2)",
                  background:"transparent",color:"rgba(255,255,255,0.6)",
                  fontSize:"0.82rem",cursor:"pointer",fontFamily:"inherit",
                }}>Later</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}


/* ═══════════════════════════════════════════════════
   PWA Setup Hook — register service worker
   Add this to your App.jsx or index.js
   ═══════════════════════════════════════════════════ */
export function usePWA() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => {
            console.log("[PWA] Service Worker registered:", reg.scope);
            // Check for updates
            reg.addEventListener("updatefound", () => {
              const newWorker = reg.installing;
              newWorker?.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("[PWA] New version available");
                }
              });
            });
          })
          .catch((err) => console.log("[PWA] SW registration failed:", err));
      });
    }
  }, []);
}


/* ═══════════════════════════════════════════════════
   Offline Status Bar
   Shows when user is offline
   ═══════════════════════════════════════════════════ */
export function OfflineBar() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online",  handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online",  handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div style={{
      position:"fixed", top:0, left:0, right:0, zIndex:99999,
      background:"#dc2626", color:"#fff", textAlign:"center",
      padding:"8px 16px", fontSize:"0.82rem", fontWeight:600,
      fontFamily:"inherit",
    }}>
      📴 You are offline — some features may not work
    </div>
  );
}


/* ═══════════════════════════════════════════════════
   App Update Notifier
   Shows "New version available" banner
   ═══════════════════════════════════════════════════ */
export function UpdateBanner() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.ready.then((reg) => {
      reg.addEventListener("updatefound", () => {
        setShowUpdate(true);
      });
    });
  }, []);

  if (!showUpdate) return null;

  return (
    <div style={{
      position:"fixed", bottom:16, left:16, right:16, zIndex:9999,
      background:"#1e293b", border:"1px solid #334155", borderRadius:12,
      padding:"14px 16px", display:"flex", alignItems:"center",
      justifyContent:"space-between", gap:12, maxWidth:400, margin:"0 auto",
      boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
    }}>
      <div>
        <div style={{color:"#fff",fontWeight:700,fontSize:"0.88rem"}}>🆕 Update Available</div>
        <div style={{color:"#64748b",fontSize:"0.75rem",marginTop:2}}>New version of New Tech app is ready</div>
      </div>
      <button onClick={()=>window.location.reload()} style={{
        background:"#2563eb",color:"#fff",border:"none",
        padding:"8px 14px",borderRadius:8,fontWeight:700,
        fontSize:"0.82rem",cursor:"pointer",fontFamily:"inherit",
        whiteSpace:"nowrap",
      }}>
        Update Now
      </button>
    </div>
  );
}
