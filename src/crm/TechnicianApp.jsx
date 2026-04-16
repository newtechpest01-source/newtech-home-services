import { useState, useEffect, useRef } from "react";

// ── Constants ────────────────────────────────────────
const TECH_TEAM = [
  { id:"T01", name:"Sanjeet Varma",  mobile:"8898720011", zone:"West"    },
  { id:"T02", name:"Deepak Sonawane",mobile:"9152560389", zone:"Central" },
];

const TREATMENT_TYPES = ["Chemical Spray","ULV Chemical Spray","Gel Treatment","Cockroach Trap","Rodent Baiting","Rodent Trapping","Fogging","ULV Cold Fogging","Termite Drilling","Arrow Powder","Mosquito Spray"];
const PEST_LOCATIONS  = ["Kitchen","Bathroom","Bedroom","Living Room","Store Room","Balcony","Common Area","Ceiling","Walls","Under Sink","Behind Appliances","Other"];
const INFESTATION_LEVELS = ["Low (1-5)","Medium (6-20)","High (21-50)","Very High (50+)"];
const todayStr = () => new Date().toLocaleDateString("en-IN");
const nowTime  = () => new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});

// ── Styles (mobile-first, inline) ───────────────────
const S = {
  app:      { fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", background:"#0f172a", minHeight:"100vh", display:"flex", flexDirection:"column" },
  header:   { background:"linear-gradient(135deg,#1e40af,#2563eb)", padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" },
  hLeft:    { display:"flex", alignItems:"center", gap:12 },
  hAv:      { width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,0.2)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"1.1rem", flexShrink:0 },
  hName:    { color:"#fff", fontWeight:700, fontSize:"0.95rem" },
  hZone:    { color:"rgba(255,255,255,0.7)", fontSize:"0.75rem", marginTop:2 },
  hStatus:  (on) => ({ display:"flex", alignItems:"center", gap:6, background:on?"#059669":"#475569", borderRadius:20, padding:"5px 12px", cursor:"pointer" }),
  hDot:     (on) => ({ width:8, height:8, borderRadius:"50%", background:on?"#4ade80":"#94a3b8" }),
  hStatusTxt:{ color:"#fff", fontSize:"0.78rem", fontWeight:600 },

  // GPS Bar
  gpsBar:   { background:"#1e293b", padding:"8px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #334155" },
  gpsTxt:   { color:"#94a3b8", fontSize:"0.75rem" },
  gpsLive:  { display:"flex", alignItems:"center", gap:6, color:"#4ade80", fontSize:"0.75rem", fontWeight:600 },
  gpsDot:   { width:8, height:8, borderRadius:"50%", background:"#4ade80", animation:"pulse 1.5s infinite" },

  // Body
  body:     { flex:1, overflow:"auto", background:"#f0f4f8" },

  // Tabs
  tabs:     { display:"flex", background:"#fff", borderBottom:"2px solid #e2e8f0", overflowX:"auto" },
  tab:      (a) => ({ padding:"12px 16px", border:"none", background:"none", fontSize:"0.82rem", fontWeight:600, color:a?"#2563eb":"#64748b", borderBottom:`2px solid ${a?"#2563eb":"transparent"}`, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit", marginBottom:-2 }),

  // Cards
  card:     { background:"#fff", borderRadius:12, margin:"12px 16px", boxShadow:"0 1px 4px rgba(0,0,0,0.08)", overflow:"hidden" },
  cardHead: (color) => ({ background:color||"#f8fafc", padding:"12px 16px", borderBottom:"1px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"space-between" }),
  cardBody: { padding:16 },

  // Service card
  svcCard:  (urgent) => ({ background:"#fff", borderRadius:12, margin:"12px 16px 0", border:`2px solid ${urgent?"#ef4444":"#e2e8f0"}`, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }),
  svcTop:   (color)  => ({ background:color, padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }),

  // Input
  inp:      { width:"100%", padding:"10px 14px", border:"1.5px solid #e2e8f0", borderRadius:9, fontSize:"0.88rem", fontFamily:"inherit", color:"#0f172a", outline:"none", boxSizing:"border-box", background:"#fff" },
  label:    { fontSize:"0.78rem", fontWeight:600, color:"#64748b", marginBottom:5, display:"block" },
  row:      { display:"flex", gap:10, marginBottom:12 },
  col:      { flex:1 },
  btn:      (color,bg) => ({ padding:"12px 20px", borderRadius:10, border:"none", background:bg||"#2563eb", color:color||"#fff", fontSize:"0.88rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", width:"100%", marginBottom:8, transition:"opacity 0.15s" }),
  btnSm:    (bg,color) => ({ padding:"8px 14px", borderRadius:8, border:"none", background:bg||"#f1f5f9", color:color||"#475569", fontSize:"0.8rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }),
  badge:    (bg,color) => ({ background:bg, color:color, padding:"3px 10px", borderRadius:20, fontSize:"0.72rem", fontWeight:700, whiteSpace:"nowrap" }),

  // Photo box
  photoBox: { border:"2px dashed #e2e8f0", borderRadius:10, padding:"20px 16px", textAlign:"center", cursor:"pointer", background:"#f8fafc" },

  // Checklist
  chkItem:  (done) => ({ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 0", borderBottom:"1px solid #f1f5f9", opacity:done?0.6:1 }),
  chkBox:   (done) => ({ width:22, height:22, borderRadius:6, border:`2px solid ${done?"#059669":"#cbd5e1"}`, background:done?"#059669":"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer" }),
};

export default function TechnicianApp() {
  const [screen,    setScreen]    = useState("login"); // login | app
  const [techId,    setTechId]    = useState("");
  const [tech,      setTech]      = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const [services,  setServices]  = useState([]);
  const [allocations,setAllocations]=useState([]);
  const [gpsOn,     setGpsOn]     = useState(false);
  const [location,  setLocation]  = useState(null);
  const [activeJob, setActiveJob] = useState(null); // currently open service detail
  const [jobScreen, setJobScreen] = useState("detail"); // detail | checklist | chemicals | complete
  const [gpsWatcher,setGpsWatcher]=useState(null);

  useEffect(() => {
    // Load services from CRM calendar
    const s = localStorage.getItem("nt_services");
    if(s) setServices(JSON.parse(s));
    const a = localStorage.getItem("nt_allocations");
    if(a) setAllocations(JSON.parse(a));
  }, []);

  const saveServices = (list) => {
    localStorage.setItem("nt_services", JSON.stringify(list));
    setServices(list);
  };

  // Start GPS
  const startGPS = () => {
    if(!navigator.geolocation) { alert("GPS not available on this device"); return; }
    const id = navigator.geolocation.watchPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy }),
      err => console.log("GPS error:", err),
      { enableHighAccuracy:true, maximumAge:10000 }
    );
    setGpsWatcher(id);
    setGpsOn(true);
  };

  const stopGPS = () => {
    if(gpsWatcher) navigator.geolocation.clearWatch(gpsWatcher);
    setGpsOn(false);
    setLocation(null);
  };

  const handleLogin = () => {
    const t = TECH_TEAM.find(t => t.id === techId);
    if(!t) return alert("Invalid selection");
    setTech(t);
    setScreen("app");
    startGPS();
  };

  // Filter services for this technician
  // 8-hour window: only show services within 8 hours from now
  const now     = new Date();
  const myServices = services.filter(s => {
    if(s.technician !== tech?.name) return false;
    if(!s.scheduledDate) return false;
    // Parse date
    const parts = s.scheduledDate.split("/");
    let svcDate;
    if(parts.length === 3) svcDate = new Date(`20${parts[2].length===2?parts[2]:parts[2].slice(-2)}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`);
    else svcDate = new Date(s.scheduledDate);
    const diffHours = (svcDate - now) / 3600000;
    return diffHours <= 8 && diffHours > -24; // within 8hrs ahead or up to 24hrs past
  });

  const todayServices    = myServices.filter(s => s.scheduledDate === todayStr());
  const upcomingServices = services.filter(s => s.technician === tech?.name && s.scheduledDate !== todayStr() && s.status !== "Completed");
  const completedServices= services.filter(s => s.technician === tech?.name && s.status === "Completed");

  const updateService = (id, updates) => {
    const updated = services.map(s => s.id===id ? {...s,...updates} : s);
    saveServices(updated);
    if(activeJob?.id === id) setActiveJob({...activeJob,...updates});
  };

  if(screen === "login") return <LoginScreen techId={techId} setTechId={setTechId} onLogin={handleLogin} />;

  if(activeJob) return (
    <JobScreen
      job={activeJob}
      tech={tech}
      jobScreen={jobScreen}
      setJobScreen={setJobScreen}
      allocations={allocations.filter(a=>a.customerId===activeJob.customerId||a.customerName===activeJob.customerName)}
      gpsOn={gpsOn}
      location={location}
      onUpdate={(updates) => updateService(activeJob.id, updates)}
      onBack={() => { setActiveJob(null); setJobScreen("detail"); }}
    />
  );

  return (
    <div style={S.app}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.hLeft}>
          <div style={S.hAv}>{tech?.name?.charAt(0)}</div>
          <div>
            <div style={S.hName}>{tech?.name}</div>
            <div style={S.hZone}>📍 Zone: {tech?.zone} · {todayStr()}</div>
          </div>
        </div>
        <div style={S.hStatus(gpsOn)} onClick={() => gpsOn ? stopGPS() : startGPS()}>
          <div style={S.hDot(gpsOn)} />
          <span style={S.hStatusTxt}>{gpsOn ? "GPS ON" : "GPS OFF"}</span>
        </div>
      </div>

      {/* GPS Bar */}
      <div style={S.gpsBar}>
        {gpsOn && location ? (
          <div style={S.gpsLive}>
            <div style={S.gpsDot} />
            Live GPS · Acc: {Math.round(location.acc||0)}m · {location.lat?.toFixed(4)}, {location.lng?.toFixed(4)}
          </div>
        ) : (
          <span style={S.gpsTxt}>📍 GPS tracking inactive — tap GPS ON to start</span>
        )}
        <span style={S.gpsTxt}>{nowTime()}</span>
      </div>

      {/* Stats bar */}
      <div style={{background:"#1e293b",padding:"10px 16px",display:"flex",gap:16,borderBottom:"1px solid #334155"}}>
        {[
          {label:"Today",     val:todayServices.length,                  color:"#60a5fa"},
          {label:"Done",      val:completedServices.filter(c=>c.scheduledDate===todayStr()).length, color:"#4ade80"},
          {label:"Pending",   val:todayServices.filter(s=>s.status!=="Completed").length, color:"#fbbf24"},
          {label:"Upcoming",  val:upcomingServices.length,               color:"#a78bfa"},
        ].map((s,i)=>(
          <div key={i} style={{textAlign:"center"}}>
            <div style={{color:s.color,fontWeight:800,fontSize:"1.2rem"}}>{s.val}</div>
            <div style={{color:"#64748b",fontSize:"0.68rem"}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {[["today","Today's Jobs"],["upcoming","Upcoming"],["completed","Completed"]].map(([k,l])=>(
          <button key={k} style={S.tab(activeTab===k)} onClick={()=>setActiveTab(k)}>{l}</button>
        ))}
      </div>

      {/* Body */}
      <div style={S.body}>
        {activeTab==="today" && (
          <div style={{paddingBottom:20}}>
            {todayServices.length===0 ? (
              <div style={{textAlign:"center",padding:"40px 20px",color:"#94a3b8"}}>
                <div style={{fontSize:"2.5rem",marginBottom:8}}>✅</div>
                <div style={{fontWeight:600}}>No services today</div>
              </div>
            ) : todayServices.map(svc => (
              <ServiceCard key={svc.id} svc={svc} onOpen={()=>{setActiveJob(svc);setJobScreen("detail");}} />
            ))}
          </div>
        )}

        {activeTab==="upcoming" && (
          <div style={{paddingBottom:20}}>
            {upcomingServices.length===0 ? (
              <div style={{textAlign:"center",padding:"40px 20px",color:"#94a3b8"}}>
                <div style={{fontSize:"2rem",marginBottom:8}}>📅</div>
                <div>No upcoming services</div>
              </div>
            ) : upcomingServices.map(svc => (
              <ServiceCard key={svc.id} svc={svc} onOpen={()=>{setActiveJob(svc);setJobScreen("detail");}} upcoming />
            ))}
          </div>
        )}

        {activeTab==="completed" && (
          <div style={{paddingBottom:20}}>
            {completedServices.length===0 ? (
              <div style={{textAlign:"center",padding:"40px 20px",color:"#94a3b8"}}>
                <div style={{fontSize:"2rem",marginBottom:8}}>📋</div>
                <div>No completed services yet</div>
              </div>
            ) : completedServices.map(svc => (
              <ServiceCard key={svc.id} svc={svc} onOpen={()=>{setActiveJob(svc);setJobScreen("detail");}} completed />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── SERVICE CARD ─────────────────────────────────────
function ServiceCard({ svc, onOpen, upcoming, completed }) {
  const STATUS_BG = {
    "Assigned":"#dbeafe","Confirmed":"#cffafe","Going":"#fef3c7",
    "Reached":"#d1fae5","In Progress":"#ede9fe","Completed":"#dcfce7","Cancelled":"#fee2e2",
  };
  const STATUS_COLOR = {
    "Assigned":"#1d4ed8","Confirmed":"#0e7490","Going":"#d97706",
    "Reached":"#059669","In Progress":"#7c3aed","Completed":"#15803d","Cancelled":"#dc2626",
  };
  const status = svc.status || "Assigned";

  return (
    <div style={S.svcCard(status==="Assigned"||status==="Confirmed")} onClick={onOpen}>
      <div style={S.svcTop(STATUS_BG[status]||"#f1f5f9")}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:"1.2rem"}}>
            {status==="Going"?"🚗":status==="Reached"?"📍":status==="In Progress"?"🔧":status==="Completed"?"✅":"📋"}
          </span>
          <span style={{fontWeight:700,color:STATUS_COLOR[status]||"#475569",fontSize:"0.85rem"}}>{status}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {svc.scheduledDate && <span style={{fontSize:"0.78rem",color:"#475569",fontWeight:600}}>{svc.scheduledDate}</span>}
          {svc.timeSlot && <span style={{fontSize:"0.72rem",color:"#64748b"}}>{svc.timeSlot}</span>}
        </div>
      </div>
      <div style={{padding:"12px 16px"}}>
        <div style={{fontWeight:800,fontSize:"1rem",color:"#0f172a",marginBottom:2}}>{svc.customerName}</div>
        <div style={{fontSize:"0.8rem",color:"#64748b",marginBottom:8}}>{svc.zone||svc.area||"—"}</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {svc.treatment && <span style={S.badge("#eff6ff","#1d4ed8")}>{svc.treatment}</span>}
          {svc.plan      && <span style={S.badge("#f5f3ff","#7c3aed")}>{svc.plan}</span>}
          {svc.mobile    && <span style={S.badge("#f0fdf4","#15803d")}>📱 {svc.mobile}</span>}
        </div>
        {!completed && status!=="Completed" && (
          <div style={{marginTop:10,background:"#f8fafc",borderRadius:8,padding:"8px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:"0.78rem",color:"#64748b"}}>Tap to open job details →</span>
            <span style={{fontSize:"1rem"}}>›</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── JOB SCREEN ───────────────────────────────────────
function JobScreen({ job, tech, jobScreen, setJobScreen, allocations, gpsOn, location, onUpdate, onBack }) {
  const [eta,         setEta]         = useState("");
  const [beforePhotos,setBeforePhotos]= useState(job.beforePhotos||[]);
  const [afterPhotos, setAfterPhotos] = useState(job.afterPhotos||[]);
  const [checklist,   setChecklist]   = useState(job.checklist||{
    arrival:false, beforePhoto:false, inspection:false, crackCheck:false,
    treatmentDone:false, chemicalFilled:false, customerBriefing:false, afterPhoto:false,
  });
  const [inspection,  setInspection]  = useState(job.inspection||{
    pestLocation:[], infestationLevel:"", pestCount:"", cracksFound:"No", crackNotes:"",
  });
  const [treatments,  setTreatments]  = useState(job.treatments||[]);
  const [chemUsage,   setChemUsage]   = useState(job.chemUsage||(allocations[0]?.chemicals||[]).map(c=>({...c,usedQty:""})));
  const [customerFeedback] = useState(job.customerFeedback||{rating:"",notes:""});
  const fileRef = useRef();
  const fileRefAfter = useRef();

  const status = job.status || "Assigned";

  const checkItem = (key) => {
    const updated = {...checklist,[key]:!checklist[key]};
    setChecklist(updated);
    onUpdate({checklist:updated});
  };

  const addPhoto = (type, file) => {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if(type==="before") {
        const updated = [...beforePhotos, {data:e.target.result,time:nowTime(),name:file.name}];
        setBeforePhotos(updated);
        onUpdate({beforePhotos:updated});
        checkItem("beforePhoto");
      } else {
        const updated = [...afterPhotos, {data:e.target.result,time:nowTime(),name:file.name}];
        setAfterPhotos(updated);
        onUpdate({afterPhotos:updated});
        checkItem("afterPhoto");
      }
    };
    reader.readAsDataURL(file);
  };

  const canComplete = afterPhotos.length > 0 && checklist.treatmentDone;

  const markGoing = () => {
    onUpdate({status:"Going",goingTime:nowTime(),etaMinutes:eta,gpsLocation:location});
    // WhatsApp message to customer
    if(job.mobile) {
      const msg = `Hi ${job.customerName}, your New Tech service technician ${tech.name} is on the way. Expected arrival in ${eta} minutes. Track: Your tech will reach you shortly. – New Tech Home Services`;
      window.open(`https://wa.me/91${job.mobile}?text=${encodeURIComponent(msg)}`,"_blank");
    }
  };

  const markReached = () => {
    onUpdate({status:"Reached",reachedTime:nowTime()});
    checkItem("arrival");
  };

  const markStarted = () => {
    onUpdate({status:"In Progress",startTime:nowTime()});
    setJobScreen("checklist");
  };

  const markComplete = () => {
    if(!canComplete) { alert("Please take AFTER photos and mark treatment done before completing"); return; }
    const report = {
      reportId: `RPT-${Date.now()}`,
      generatedOn: new Date().toLocaleString("en-IN"),
      technician: tech.name, techZone: tech.zone,
      customer: job.customerName, customerId: job.customerId,
      address: job.zone||job.area, mobile: job.mobile,
      serviceDate: job.scheduledDate, timeSlot: job.timeSlot,
      treatment: job.treatment, plan: job.plan,
      goingTime: job.goingTime, reachedTime: job.reachedTime,
      startTime: job.startTime, completedTime: nowTime(),
      inspection, treatments, chemUsage,
      beforePhotos, afterPhotos, checklist,
      customerFeedback,
    };
    onUpdate({ status:"Completed", completedTime:nowTime(), serviceReport:report });
    // Send feedback WhatsApp
    if(job.mobile) {
      const msg = `Hi ${job.customerName}, your New Tech pest control service is complete! ✅\n\nPlease rate your experience:\n⭐ Technician quality\n⭐ Punctuality\n⭐ Communication\n⭐ Attire & knowledge\n\nReply with 1-5 rating or call us: 917718898455\n– New Tech Home Services`;
      window.open(`https://wa.me/91${job.mobile}?text=${encodeURIComponent(msg)}`,"_blank");
    }
    alert("✅ Service completed! Customer feedback WhatsApp sent.");
    onBack();
  };

  const STAGE_COLOR = { "Assigned":"#dbeafe","Confirmed":"#cffafe","Going":"#fef3c7","Reached":"#d1fae5","In Progress":"#ede9fe","Completed":"#dcfce7" };

  return (
    <div style={S.app}>
      {/* Header */}
      <div style={S.header}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>← Back</button>
          <div>
            <div style={{color:"#fff",fontWeight:700,fontSize:"0.92rem"}}>{job.customerName}</div>
            <div style={{color:"rgba(255,255,255,0.7)",fontSize:"0.72rem"}}>{job.treatment} · {job.scheduledDate}</div>
          </div>
        </div>
        <span style={S.badge(STAGE_COLOR[status]||"#f1f5f9","#0f172a")}>{status}</span>
      </div>

      {/* Sub tabs */}
      <div style={S.tabs}>
        {[["detail","📋 Details"],["checklist","✅ Checklist"],["chemicals","🧪 Chemicals"],["photos","📷 Photos"]].map(([k,l])=>(
          <button key={k} style={S.tab(jobScreen===k)} onClick={()=>setJobScreen(k)}>{l}</button>
        ))}
      </div>

      <div style={S.body}>

        {/* ── DETAIL TAB ── */}
        {jobScreen==="detail" && (
          <div style={{paddingBottom:24}}>
            {/* Customer Card */}
            <div style={S.card}>
              <div style={S.cardHead("#eff6ff")}>
                <span style={{fontWeight:700,color:"#1e40af"}}>👤 Customer Details</span>
              </div>
              <div style={S.cardBody}>
                <InfoRow label="Name"     value={job.customerName} />
                <InfoRow label="Mobile"   value={<a href={`tel:${job.mobile}`} style={{color:"#2563eb",fontWeight:600}}>{job.mobile} 📞</a>} />
                <InfoRow label="Address"  value={job.zone||job.area||"—"} />
                <InfoRow label="Customer ID" value={job.customerId||"—"} />
              </div>
            </div>

            {/* Service Card */}
            <div style={S.card}>
              <div style={S.cardHead("#f5f3ff")}>
                <span style={{fontWeight:700,color:"#6d28d9"}}>🔧 Service Details</span>
              </div>
              <div style={S.cardBody}>
                <InfoRow label="Treatment" value={job.treatment||"—"} />
                <InfoRow label="Plan"      value={job.plan||"—"} />
                <InfoRow label="Date"      value={job.scheduledDate} />
                <InfoRow label="Time Slot" value={job.timeSlot||"—"} />
                <InfoRow label="Service No"value={job.serviceNo||"—"} />
                {job.gelRequired==="Yes" && <InfoRow label="Gel Required" value={<span style={{color:"#d97706",fontWeight:700}}>⚠️ Yes — {job.gelSameDay==="Yes"?"Same Day":"7 days after"}</span>} />}
                {job.notes && <InfoRow label="Notes" value={job.notes} />}
              </div>
            </div>

            {/* Allocated Chemicals */}
            {allocations.length>0 && (
              <div style={S.card}>
                <div style={S.cardHead("#f0fdf4")}>
                  <span style={{fontWeight:700,color:"#15803d"}}>🧪 Allocated Chemicals</span>
                </div>
                <div style={S.cardBody}>
                  {allocations[0]?.chemicals?.map((c,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f1f5f9"}}>
                      <span style={{fontWeight:600,fontSize:"0.85rem"}}>{c.chemName}</span>
                      <span style={{color:"#059669",fontWeight:700}}>{c.givenQty} {c.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{padding:"0 16px",marginTop:8}}>
              {status==="Assigned" && (
                <button style={S.btn()} onClick={()=>onUpdate({status:"Confirmed",confirmedTime:nowTime()})}>
                  ✅ Confirm Service
                </button>
              )}
              {status==="Confirmed" && (
                <>
                  <div style={{marginBottom:10}}>
                    <label style={S.label}>ETA (minutes)</label>
                    <input style={S.inp} type="number" placeholder="e.g. 20" value={eta} onChange={e=>setEta(e.target.value)} />
                  </div>
                  <button style={S.btn("#fff","#d97706")} onClick={markGoing}>🚗 Going for Service — Notify Customer</button>
                </>
              )}
              {status==="Going" && (
                <button style={S.btn("#fff","#059669")} onClick={markReached}>📍 Reached Customer Location</button>
              )}
              {status==="Reached" && (
                <button style={S.btn("#fff","#7c3aed")} onClick={markStarted}>🔧 Start Service</button>
              )}
              {status==="In Progress" && (
                <button style={S.btn("#fff","#059669")} onClick={markComplete} disabled={!canComplete}>
                  {canComplete ? "✅ Complete Service" : "⚠️ Complete checklist & take after photos first"}
                </button>
              )}
              {status==="Completed" && (
                <div style={{background:"#dcfce7",borderRadius:10,padding:16,textAlign:"center"}}>
                  <div style={{fontSize:"1.5rem"}}>✅</div>
                  <div style={{fontWeight:700,color:"#15803d"}}>Service Completed</div>
                  <div style={{fontSize:"0.78rem",color:"#166534",marginTop:4}}>Completed at {job.completedTime}</div>
                </div>
              )}

              {/* Quick contact */}
              {job.mobile && (
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <a href={`tel:${job.mobile}`} style={{...S.btn("#fff","#2563eb"),textDecoration:"none",textAlign:"center",display:"block",flex:1}}>📞 Call Customer</a>
                  <a href={`https://wa.me/91${job.mobile}`} target="_blank" rel="noreferrer"
                    style={{...S.btn("#fff","#059669"),textDecoration:"none",textAlign:"center",display:"block",flex:1}}>💬 WhatsApp</a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CHECKLIST TAB ── */}
        {jobScreen==="checklist" && (
          <div style={{paddingBottom:24}}>
            <div style={S.card}>
              <div style={S.cardHead("#fefce8")}>
                <span style={{fontWeight:700,color:"#a16207"}}>✅ Service Checklist</span>
                <span style={S.badge("#fef9c3","#a16207")}>{Object.values(checklist).filter(Boolean).length}/{Object.keys(checklist).length} Done</span>
              </div>
              <div style={S.cardBody}>
                {[
                  {key:"arrival",        label:"✅ Marked arrival at customer location"},
                  {key:"beforePhoto",    label:"📷 Before photos taken (mandatory)"},
                  {key:"inspection",     label:"🔍 Full pest inspection completed"},
                  {key:"crackCheck",     label:"🔲 Cracks, gaps, holes checked & noted"},
                  {key:"treatmentDone",  label:"🧪 Treatment performed"},
                  {key:"chemicalFilled", label:"📊 Chemical usage filled"},
                  {key:"customerBriefing",label:"💬 Customer briefed about treatment"},
                  {key:"afterPhoto",     label:"📷 After photos taken (mandatory)"},
                ].map(item=>(
                  <div key={item.key} style={S.chkItem(checklist[item.key])} onClick={()=>checkItem(item.key)}>
                    <div style={S.chkBox(checklist[item.key])}>
                      {checklist[item.key] && <span style={{color:"#fff",fontSize:"0.75rem",fontWeight:700}}>✓</span>}
                    </div>
                    <span style={{fontSize:"0.88rem",color:checklist[item.key]?"#64748b":"#0f172a",fontWeight:checklist[item.key]?400:600}}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pest Inspection */}
            <div style={S.card}>
              <div style={S.cardHead("#fef2f2")}>
                <span style={{fontWeight:700,color:"#dc2626"}}>🔍 Pest Inspection</span>
              </div>
              <div style={S.cardBody}>
                <div style={{marginBottom:12}}>
                  <label style={S.label}>Pest Location (select all that apply)</label>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {PEST_LOCATIONS.map(loc=>(
                      <button key={loc} onClick={()=>{
                        const curr = inspection.pestLocation||[];
                        const updated = curr.includes(loc) ? curr.filter(l=>l!==loc) : [...curr,loc];
                        const upd = {...inspection,pestLocation:updated};
                        setInspection(upd); onUpdate({inspection:upd});
                        checkItem("inspection");
                      }}
                        style={{padding:"5px 10px",border:`1.5px solid ${(inspection.pestLocation||[]).includes(loc)?"#2563eb":"#e2e8f0"}`,borderRadius:20,background:(inspection.pestLocation||[]).includes(loc)?"#2563eb":"#fff",color:(inspection.pestLocation||[]).includes(loc)?"#fff":"#475569",fontSize:"0.78rem",cursor:"pointer",fontFamily:"inherit"}}>
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={S.row}>
                  <div style={S.col}>
                    <label style={S.label}>Infestation Level</label>
                    <select style={S.inp} value={inspection.infestationLevel} onChange={e=>{const u={...inspection,infestationLevel:e.target.value};setInspection(u);onUpdate({inspection:u});}}>
                      <option value="">Select</option>
                      {INFESTATION_LEVELS.map(l=><option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div style={S.col}>
                    <label style={S.label}>Approx Pest Count</label>
                    <input style={S.inp} value={inspection.pestCount} onChange={e=>{const u={...inspection,pestCount:e.target.value};setInspection(u);onUpdate({inspection:u});}} placeholder="e.g. 15" />
                  </div>
                </div>
                <div style={S.row}>
                  <div style={S.col}>
                    <label style={S.label}>Cracks / Gaps Found?</label>
                    <select style={S.inp} value={inspection.cracksFound} onChange={e=>{const u={...inspection,cracksFound:e.target.value};setInspection(u);onUpdate({inspection:u});checkItem("crackCheck");}}>
                      <option>No</option><option>Yes</option>
                    </select>
                  </div>
                </div>
                {inspection.cracksFound==="Yes" && (
                  <div>
                    <label style={S.label}>Crack/Gap Details</label>
                    <textarea style={{...S.inp,minHeight:60,resize:"vertical"}} value={inspection.crackNotes} onChange={e=>{const u={...inspection,crackNotes:e.target.value};setInspection(u);onUpdate({inspection:u});}} placeholder="Location and description of cracks/gaps..." />
                  </div>
                )}
              </div>
            </div>

            {/* Treatment Done */}
            <div style={S.card}>
              <div style={S.cardHead("#f5f3ff")}>
                <span style={{fontWeight:700,color:"#7c3aed"}}>🔧 Treatment Performed</span>
              </div>
              <div style={S.cardBody}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                  {TREATMENT_TYPES.map(t=>(
                    <button key={t} onClick={()=>{
                      const curr = treatments||[];
                      const updated = curr.includes(t) ? curr.filter(x=>x!==t) : [...curr,t];
                      setTreatments(updated); onUpdate({treatments:updated});
                      if(updated.length>0) checkItem("treatmentDone");
                    }}
                      style={{padding:"6px 12px",border:`1.5px solid ${treatments.includes(t)?"#7c3aed":"#e2e8f0"}`,borderRadius:20,background:treatments.includes(t)?"#7c3aed":"#fff",color:treatments.includes(t)?"#fff":"#475569",fontSize:"0.78rem",cursor:"pointer",fontFamily:"inherit"}}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CHEMICALS TAB ── */}
        {jobScreen==="chemicals" && (
          <div style={{paddingBottom:24}}>
            <div style={S.card}>
              <div style={S.cardHead("#f0fdf4")}>
                <span style={{fontWeight:700,color:"#15803d"}}>🧪 Chemical Usage</span>
                <span style={{fontSize:"0.75rem",color:"#64748b"}}>Fill actual quantities used</span>
              </div>
              <div style={S.cardBody}>
                {chemUsage.length===0 ? (
                  <div style={{textAlign:"center",padding:20,color:"#94a3b8"}}>No chemicals allocated for this service</div>
                ) : (
                  <>
                    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8,padding:"8px 4px",fontSize:"0.7rem",fontWeight:700,color:"#64748b",textTransform:"uppercase",borderBottom:"1px solid #e2e8f0",marginBottom:8}}>
                      <span>Chemical</span><span>Given</span><span>Used</span><span>Return</span>
                    </div>
                    {chemUsage.map((c,i)=>{
                      const given  = Number(c.givenQty||0);
                      const used   = Number(c.usedQty||0);
                      const ret    = Math.max(0, given - used);
                      return (
                        <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8,alignItems:"center",padding:"8px 4px",borderBottom:"1px solid #f8fafc"}}>
                          <div>
                            <div style={{fontWeight:600,fontSize:"0.83rem"}}>{c.chemName}</div>
                            <div style={{fontSize:"0.7rem",color:"#64748b"}}>{c.unit}</div>
                          </div>
                          <div style={{fontWeight:700,color:"#2563eb",fontSize:"0.88rem"}}>{given}</div>
                          <input style={{...S.inp,padding:"6px 8px",fontSize:"0.85rem"}} type="number" min={0} max={given}
                            value={c.usedQty} placeholder="0"
                            onChange={e=>{
                              const updated = chemUsage.map((ch,j)=>j===i?{...ch,usedQty:e.target.value}:ch);
                              setChemUsage(updated); onUpdate({chemUsage:updated});
                              checkItem("chemicalFilled");
                            }} />
                          <div style={{fontWeight:700,color:ret>0?"#d97706":"#059669",fontSize:"0.88rem"}}>{ret}</div>
                        </div>
                      );
                    })}
                    <div style={{background:"#f0fdf4",borderRadius:8,padding:"10px 12px",marginTop:12,fontSize:"0.8rem",color:"#15803d"}}>
                      ℹ️ Returned quantities will be added back to inventory stock automatically on completion.
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── PHOTOS TAB ── */}
        {jobScreen==="photos" && (
          <div style={{paddingBottom:24}}>
            {/* Before Photos */}
            <div style={S.card}>
              <div style={S.cardHead("#fef9c3")}>
                <span style={{fontWeight:700,color:"#a16207"}}>📷 Before Photos</span>
                <span style={S.badge(beforePhotos.length>0?"#dcfce7":"#fee2e2",beforePhotos.length>0?"#15803d":"#dc2626")}>
                  {beforePhotos.length>0?`${beforePhotos.length} taken`:"Required"}
                </span>
              </div>
              <div style={S.cardBody}>
                <input type="file" ref={fileRef} accept="image/*" capture="environment" style={{display:"none"}}
                  onChange={e=>addPhoto("before",e.target.files[0])} />
                {beforePhotos.length>0 && (
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                    {beforePhotos.map((p,i)=>(
                      <div key={i} style={{position:"relative"}}>
                        <img src={p.data} alt="before" style={{width:"100%",height:80,objectFit:"cover",borderRadius:8}} />
                        <div style={{position:"absolute",bottom:4,left:4,background:"rgba(0,0,0,0.6)",color:"#fff",fontSize:"0.6rem",padding:"2px 5px",borderRadius:4}}>{p.time}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={S.photoBox} onClick={()=>fileRef.current?.click()}>
                  <div style={{fontSize:"2rem",marginBottom:4}}>📸</div>
                  <div style={{fontWeight:600,color:"#64748b",fontSize:"0.88rem"}}>Tap to take Before photo</div>
                  <div style={{fontSize:"0.75rem",color:"#94a3b8",marginTop:4}}>Camera will open</div>
                </div>
              </div>
            </div>

            {/* After Photos */}
            <div style={S.card}>
              <div style={S.cardHead(afterPhotos.length>0?"#f0fdf4":"#fef2f2")}>
                <span style={{fontWeight:700,color:afterPhotos.length>0?"#15803d":"#dc2626"}}>📷 After Photos</span>
                <span style={S.badge(afterPhotos.length>0?"#dcfce7":"#fee2e2",afterPhotos.length>0?"#15803d":"#dc2626")}>
                  {afterPhotos.length>0?`${afterPhotos.length} taken`:"REQUIRED to complete"}
                </span>
              </div>
              <div style={S.cardBody}>
                <input type="file" ref={fileRefAfter} accept="image/*" capture="environment" style={{display:"none"}}
                  onChange={e=>addPhoto("after",e.target.files[0])} />
                {afterPhotos.length>0 && (
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                    {afterPhotos.map((p,i)=>(
                      <div key={i} style={{position:"relative"}}>
                        <img src={p.data} alt="after" style={{width:"100%",height:80,objectFit:"cover",borderRadius:8}} />
                        <div style={{position:"absolute",bottom:4,left:4,background:"rgba(0,0,0,0.6)",color:"#fff",fontSize:"0.6rem",padding:"2px 5px",borderRadius:4}}>{p.time}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{...S.photoBox,borderColor:afterPhotos.length===0?"#fca5a5":"#bbf7d0"}} onClick={()=>fileRefAfter.current?.click()}>
                  <div style={{fontSize:"2rem",marginBottom:4}}>📸</div>
                  <div style={{fontWeight:600,color:afterPhotos.length===0?"#dc2626":"#059669",fontSize:"0.88rem"}}>
                    {afterPhotos.length===0?"⚠️ After photo REQUIRED":"Tap to add more After photos"}
                  </div>
                  <div style={{fontSize:"0.75rem",color:"#94a3b8",marginTop:4}}>Service cannot be completed without after photo</div>
                </div>
              </div>
            </div>

            {/* Complete button on photos tab too */}
            {(job.status==="In Progress"||job.status==="Reached") && (
              <div style={{padding:"0 16px"}}>
                <button style={{...S.btn("#fff", canComplete?"#059669":"#94a3b8")}} onClick={()=>{ if(canComplete) { setJobScreen("detail"); } else alert("Take after photos & mark treatment done first"); }}>
                  {canComplete?"✅ Ready to Complete — Go to Details":"⚠️ Take After Photos first"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── LOGIN SCREEN ─────────────────────────────────────
function LoginScreen({ techId, setTechId, onLogin }) {
  return (
    <div style={{...S.app, alignItems:"center", justifyContent:"center", padding:20}}>
      <div style={{background:"#1e293b", borderRadius:20, padding:32, width:"100%", maxWidth:340, boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:"3rem",marginBottom:8}}>🏠</div>
          <div style={{color:"#fff",fontWeight:800,fontSize:"1.2rem"}}>New Tech Services</div>
          <div style={{color:"#64748b",fontSize:"0.82rem",marginTop:4}}>Technician App</div>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{...S.label,color:"#94a3b8"}}>Select Your Name</label>
          <select style={{...S.inp,background:"#0f172a",color:"#fff",border:"1.5px solid #334155"}}
            value={techId} onChange={e=>setTechId(e.target.value)}>
            <option value="">-- Select Technician --</option>
            {TECH_TEAM.map(t=><option key={t.id} value={t.id}>{t.name} · Zone {t.zone}</option>)}
          </select>
        </div>
        <button style={{...S.btn(),marginTop:8,background:"#2563eb"}} onClick={onLogin} disabled={!techId}>
          🚀 Start My Day
        </button>
        <div style={{textAlign:"center",color:"#475569",fontSize:"0.75rem",marginTop:16}}>
          Your location will be tracked while on duty
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"7px 0",borderBottom:"1px solid #f8fafc"}}>
      <span style={{fontSize:"0.78rem",color:"#94a3b8",fontWeight:600,flexShrink:0,width:110}}>{label}</span>
      <span style={{fontSize:"0.85rem",color:"#0f172a",fontWeight:500,textAlign:"right"}}>{value}</span>
    </div>
  );
}
