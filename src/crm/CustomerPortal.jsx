import { useState, useEffect } from "react";

// ── Styles ───────────────────────────────────────────
const S = {
  app:      { fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", background:"#f0f4f8", minHeight:"100vh" },
  // Login
  loginBg:  { minHeight:"100vh", background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#0c4a6e 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  loginBox: { background:"#fff", borderRadius:20, padding:"36px 32px", width:"100%", maxWidth:420, boxShadow:"0 32px 80px rgba(0,0,0,0.4)" },
  // Header
  header:   { background:"linear-gradient(135deg,#1e40af,#2563eb)", padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 },
  hLogo:    { display:"flex", alignItems:"center", gap:10 },
  hLogoTxt: { color:"#fff", fontWeight:800, fontSize:"1rem" },
  hSub:     { color:"rgba(255,255,255,0.7)", fontSize:"0.72rem" },
  hUser:    { display:"flex", alignItems:"center", gap:8 },
  hAv:      { width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.2)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"1rem" },
  hName:    { color:"#fff", fontSize:"0.82rem", fontWeight:600 },
  // Nav
  nav:      { background:"#fff", borderBottom:"2px solid #e2e8f0", display:"flex", overflowX:"auto", position:"sticky", top:64, zIndex:99 },
  navBtn:   (a) => ({ padding:"12px 16px", border:"none", background:"none", fontSize:"0.8rem", fontWeight:600, color:a?"#2563eb":"#64748b", borderBottom:`2px solid ${a?"#2563eb":"transparent"}`, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit", marginBottom:-2 }),
  // Body
  body:     { padding:"16px", maxWidth:800, margin:"0 auto" },
  // Cards
  card:     { background:"#fff", borderRadius:14, marginBottom:14, boxShadow:"0 1px 4px rgba(0,0,0,0.08)", overflow:"hidden" },
  cardH:    (bg) => ({ background:bg||"#f8fafc", padding:"12px 16px", borderBottom:"1px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"space-between" }),
  cardT:    { fontWeight:700, fontSize:"0.9rem", color:"#0f172a" },
  cardB:    { padding:16 },
  // Stat cards
  statGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10, marginBottom:14 },
  statCard: (bg,color) => ({ background:bg, borderRadius:12, padding:"14px 16px", borderTop:`3px solid ${color}` }),
  statVal:  (color) => ({ fontSize:"1.4rem", fontWeight:800, color }),
  statLbl:  { fontSize:"0.72rem", color:"#64748b", marginTop:2 },
  // Service row
  svcRow:   { padding:"12px 0", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"flex-start", gap:12 },
  svcIcon:  { width:38, height:38, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", flexShrink:0 },
  svcInfo:  { flex:1 },
  svcName:  { fontWeight:700, fontSize:"0.88rem", color:"#0f172a" },
  svcMeta:  { fontSize:"0.75rem", color:"#64748b", marginTop:2 },
  // Badge
  badge:    (bg,color) => ({ background:bg, color, padding:"3px 10px", borderRadius:20, fontSize:"0.72rem", fontWeight:700, display:"inline-block" }),
  // Input
  inp:      { width:"100%", padding:"10px 14px", border:"1.5px solid #e2e8f0", borderRadius:9, fontSize:"0.88rem", fontFamily:"inherit", color:"#0f172a", outline:"none", boxSizing:"border-box", background:"#fff" },
  lbl:      { fontSize:"0.78rem", fontWeight:600, color:"#64748b", marginBottom:5, display:"block" },
  btn:      (bg,color) => ({ padding:"11px 20px", borderRadius:10, border:"none", background:bg||"#2563eb", color:color||"#fff", fontSize:"0.88rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", width:"100%", marginBottom:8 }),
  btnSm:    (bg,color) => ({ padding:"7px 14px", borderRadius:8, border:"none", background:bg||"#eff6ff", color:color||"#2563eb", fontSize:"0.8rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }),
  // Timeline
  tlItem:   { display:"flex", gap:12, paddingBottom:16, position:"relative" },
  tlDot:    (color) => ({ width:10, height:10, borderRadius:"50%", background:color||"#2563eb", marginTop:4, flexShrink:0 }),
  tlLine:   { position:"absolute", left:4, top:14, bottom:0, width:2, background:"#e2e8f0" },
  // Alert
  alert:    (bg,color) => ({ background:bg, border:`1px solid ${color}`, borderRadius:10, padding:"10px 14px", fontSize:"0.82rem", color, marginBottom:10, display:"flex", alignItems:"center", gap:8 }),
};

const TABS = [
  ["dashboard",      "🏠 Home"],
  ["services",       "📅 Services"],
  ["payments",       "💳 Payments"],
  ["complaints",     "📋 Requests"],
  ["notifications",  "🔔 Notifications"],
  ["comms",          "💬 Comm Log"],
  ["documents",      "📄 Documents"],
  ["blog",           "📰 Tips & Blog"],
];

const BLOG_POSTS = [
  { id:1, title:"5 Signs You Have a Cockroach Infestation", category:"Pest Alert", date:"15 Apr 2026", icon:"🪲", preview:"Cockroaches are nocturnal. If you see them in daylight, the infestation is serious. Here are 5 early warning signs to watch for in your home..." },
  { id:2, title:"Pre & Post Pest Control Checklist for Customers", category:"Guide", date:"10 Apr 2026", icon:"📋", preview:"To get the best results from your pest control service, follow this simple checklist before and after our technician visits your home..." },
  { id:3, title:"Monsoon Season: Why Pest Activity Spikes in Mumbai", category:"Seasonal Alert", date:"05 Apr 2026", icon:"🌧️", preview:"Mumbai's monsoon creates perfect breeding conditions for cockroaches, mosquitoes and rodents. Here's how to protect your home this season..." },
  { id:4, title:"Is Gel Treatment Safe for Children and Pets?", category:"Safety", date:"01 Apr 2026", icon:"🐾", preview:"Our odourless gel bait is completely safe for children and pets. It's applied in tiny dots inside cabinets, drawers and crevices — not in open areas..." },
  { id:5, title:"How Termites Damage Your Home — And How We Stop Them", category:"Pest Alert", date:"25 Mar 2026", icon:"🪵", preview:"Termites cause more damage than fires in India each year. Our drilling injection treatment creates a chemical barrier that protects your property for years..." },
  { id:6, title:"AMC vs One-Time Service — Which is Better?", category:"Guide", date:"20 Mar 2026", icon:"📊", preview:"An Annual Maintenance Contract gives you 3-4 services per year, ensuring pests never return. Compare the cost benefits of AMC vs single treatment..." },
];

export default function CustomerPortal() {
  const [screen,    setScreen]    = useState("login");
  const [mobile,    setMobile]    = useState("");
  const [otp,       setOtp]       = useState("");
  const [sentOtp,   setSentOtp]   = useState("");
  const [step,      setStep]      = useState(1);
  const [customer,  setCustomer]  = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [error,     setError]     = useState("");

  // Data from CRM localStorage
  const [myServices,      setMyServices]      = useState([]);
  const [myInvoices,      setMyInvoices]      = useState([]);
  const [myReceipts,      setMyReceipts]      = useState([]);
  const [myComplaints,    setMyComplaints]    = useState([]);
  const [myComms,         setMyComms]         = useState([]);
  const [notifications,   setNotifications]   = useState([]);
  const [unreadCount,     setUnreadCount]     = useState(0);

  // Forms
  const [showRequestForm,  setShowRequestForm]  = useState(false);
  const [showComplaintForm,setShowComplaintForm]= useState(false);
  const [showPaymentForm,  setShowPaymentForm]  = useState(false);
  const [showInvoice,      setShowInvoice]      = useState(null); // invoice object
  const [showReceipt,      setShowReceipt]      = useState(null); // receipt object
  const [requestType,      setRequestType]      = useState("");

  useEffect(() => {
    if(!customer) return;
    // Load customer-specific data from CRM storage
    const services   = JSON.parse(localStorage.getItem("nt_services")||"[]");
    const invoices   = JSON.parse(localStorage.getItem("nt_invoices")||"[]");
    const receipts   = JSON.parse(localStorage.getItem("nt_receipts")||"[]");
    const complaints = JSON.parse(localStorage.getItem("nt_complaints")||"[]");
    const customers  = JSON.parse(localStorage.getItem("nt_customers")||"[]");

    const cust = customers.find(c => c.mobile===customer.mobile || c.customerId===customer.customerId);

    setMyServices(services.filter(s =>
      s.mobile===customer.mobile || s.customerName===customer.name ||
      s.customerId===customer.customerId
    ));
    setMyInvoices(invoices.filter(i =>
      i.mobile===customer.mobile || i.customerName===customer.name ||
      i.customerId===customer.customerId
    ));
    setMyReceipts(receipts.filter(r =>
      r.customerName===customer.name || r.customerId===customer.customerId
    ));
    setMyComplaints(complaints.filter(c =>
      c.mobile===customer.mobile || c.customerName===customer.name ||
      c.customerId===customer.customerId
    ));
    if(cust) setMyComms(cust.commLog||[]);

    // ── Generate smart notifications ──────────────────
    const today    = new Date();
    const todayStr = today.toLocaleDateString("en-IN");
    const notifs   = [];

    // Service reminders (D-15, D-7, D-3, D-0)
    const allServices = services.filter(s =>
      s.mobile===customer.mobile || s.customerName===customer.name ||
      s.customerId===customer.customerId
    );

    allServices.filter(s=>s.status!=="Completed"&&s.status!=="Cancelled").forEach(s => {
      if(!s.scheduledDate) return;
      const parts = s.scheduledDate.split("/");
      const svcDate = parts.length===3
        ? new Date(`20${parts[2].slice(-2)}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`)
        : new Date(s.scheduledDate);
      const diff = Math.ceil((svcDate - today) / 86400000);

      if(diff === 0)  notifs.push({ id:`svc-today-${s.id}`, type:"service", icon:"🚨", title:"Service Today!", message:`Your ${s.treatment||s.plan} is scheduled TODAY. Technician: ${s.technician||"To be assigned"}.`, time:todayStr, priority:"high", read:false });
      if(diff === 3)  notifs.push({ id:`svc-d3-${s.id}`,    type:"service", icon:"⏰", title:"Service in 3 Days", message:`Your ${s.treatment||s.plan} is coming up on ${s.scheduledDate}. Please ensure access to your property.`, time:todayStr, priority:"medium", read:false });
      if(diff === 7)  notifs.push({ id:`svc-d7-${s.id}`,    type:"service", icon:"📅", title:"Service in 1 Week", message:`Your ${s.treatment||s.plan} is scheduled for ${s.scheduledDate}. Technician: ${s.technician||"TBD"}.`, time:todayStr, priority:"low", read:false });
      if(diff === 15) notifs.push({ id:`svc-d15-${s.id}`,   type:"service", icon:"📋", title:"Upcoming Service Reminder", message:`Your ${s.treatment||s.plan} is scheduled on ${s.scheduledDate}. To reschedule, contact us.`, time:todayStr, priority:"low", read:false });

      // Live status notifications
      if(s.status==="Going")       notifs.push({ id:`svc-going-${s.id}`,    type:"live", icon:"🚗", title:"Technician On the Way!", message:`${s.technician||"Your technician"} is on the way to your location.${s.etaMinutes?` Expected in ${s.etaMinutes} minutes.`:""}`, time:todayStr, priority:"high", read:false });
      if(s.status==="Reached")     notifs.push({ id:`svc-reached-${s.id}`,  type:"live", icon:"📍", title:"Technician Arrived!", message:`${s.technician||"Your technician"} has arrived at your location. Please provide access.`, time:todayStr, priority:"high", read:false });
      if(s.status==="In Progress") notifs.push({ id:`svc-inprog-${s.id}`,   type:"live", icon:"🔧", title:"Service In Progress", message:`Your ${s.treatment||s.plan} service is currently being performed.`, time:todayStr, priority:"medium", read:false });
      if(s.status==="Completed")   notifs.push({ id:`svc-done-${s.id}`,     type:"service", icon:"✅", title:"Service Completed!", message:`Your ${s.treatment||s.plan} service has been completed. Please check our work and share feedback.`, time:s.scheduledDate, priority:"medium", read:false });
    });

    // Outstanding payment reminders
    const allInvoices = invoices.filter(i =>
      i.mobile===customer.mobile || i.customerName===customer.name ||
      i.customerId===customer.customerId
    );
    allInvoices.filter(i=>Number(i.balanceOutstanding)>0).forEach(inv => {
      notifs.push({ id:`pay-${inv.invoiceNo}`, type:"payment", icon:"💳", title:"Payment Pending", message:`Invoice ${inv.invoiceNo} has an outstanding balance of ₹${Number(inv.balanceOutstanding).toLocaleString("en-IN")}. Please clear at earliest.`, time:inv.invoiceDate, priority:"high", read:false });
    });

    // Open complaint updates
    const allComplaints = complaints.filter(c =>
      c.mobile===customer.mobile || c.customerName===customer.name ||
      c.customerId===customer.customerId
    );
    allComplaints.filter(c=>c.status==="Resolved").forEach(comp => {
      notifs.push({ id:`comp-res-${comp.id}`, type:"complaint", icon:"✅", title:"Complaint Resolved", message:`Your complaint "${comp.type}" has been resolved. Please confirm satisfaction.`, time:comp.raisedOn, priority:"medium", read:false });
    });
    allComplaints.filter(c=>c.status==="In Progress").forEach(comp => {
      notifs.push({ id:`comp-prog-${comp.id}`, type:"complaint", icon:"🔧", title:"Complaint Being Addressed", message:`Your complaint "${comp.type}" is being worked on by our team.`, time:comp.raisedOn, priority:"low", read:false });
    });

    // AMC renewal alerts
    allInvoices.filter(i=>i.servicePlan==="AMC"&&i.contractEndDate).forEach(inv => {
      const endDate = new Date(inv.contractEndDate.split("/").reverse().join("-"));
      const daysLeft = Math.ceil((endDate - today) / 86400000);
      if(daysLeft <= 30 && daysLeft >= 0) notifs.push({ id:`amc-${inv.invoiceNo}`, type:"renewal", icon:"🔄", title:"AMC Renewal Due!", message:`Your ${inv.serviceCategory} AMC expires on ${inv.contractEndDate}. Renew now to maintain continuous protection.`, time:todayStr, priority:"high", read:false });
    });

    // Welcome notification
    notifs.push({ id:"welcome", type:"info", icon:"👋", title:`Welcome, ${customer.name?.split(" ")[0]}!`, message:"You are now logged in to New Tech Home Services Customer Portal. Track your services, payments and more.", time:todayStr, priority:"low", read:false });

    // Sort by priority
    const sorted = notifs.sort((a,b) => {
      const p = {high:0,medium:1,low:2};
      return p[a.priority] - p[b.priority];
    });
    setNotifications(sorted);
    setUnreadCount(sorted.length);
  }, [customer]);

  // Send OTP
  const handleSendOTP = () => {
    setError("");
    const code = Math.floor(100000 + Math.random()*900000).toString();
    setSentOtp(code);
    const msg = `🔐 New Tech Home Services\n\nYour login OTP: *${code}*\n\nValid for 10 minutes.\n– New Tech Team`;
    window.open(`https://wa.me/91${mobile}?text=${encodeURIComponent(msg)}`,"_blank");
    setStep(2);
  };

  // Verify OTP — also look up customer in CRM data
  const handleVerifyOTP = () => {
    if(otp.trim() !== sentOtp) { setError("Invalid OTP. Please try again."); return; }
    // Find customer in stored data
    const customers = JSON.parse(localStorage.getItem("nt_customers")||"[]");
    const invoices  = JSON.parse(localStorage.getItem("nt_invoices")||"[]");
    const found = customers.find(c=>c.mobile===mobile) || invoices.find(i=>i.mobile===mobile);
    if(found) {
      setCustomer({ name: found.customerName||found.name, mobile, customerId: found.customerId||found.customerId||"" });
    } else {
      setCustomer({ name: "Guest", mobile, customerId:"" });
    }
    setScreen("app");
  };

  if(screen==="login") return (
    <div style={S.loginBg}>
      <div style={S.loginBox}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:"2.5rem",marginBottom:8}}>🏠</div>
          <div style={{fontWeight:800,fontSize:"1.2rem",color:"#0f172a"}}>New Tech Home Services</div>
          <div style={{color:"#64748b",fontSize:"0.82rem",marginTop:4}}>Customer Portal — Track your services</div>
        </div>

        {step===1 ? (<>
          <label style={S.lbl}>📱 Your Mobile Number</label>
          <input style={{...S.inp,marginBottom:14}} type="tel" maxLength={10} placeholder="10-digit mobile number" value={mobile} onChange={e=>setMobile(e.target.value)} />
          {error && <div style={{color:"#dc2626",fontSize:"0.82rem",marginBottom:10}}>{error}</div>}
          <button style={S.btn()} onClick={handleSendOTP} disabled={mobile.length!==10}>
            📲 Send OTP on WhatsApp
          </button>
        </>) : (<>
          <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:9,padding:"10px 14px",fontSize:"0.82rem",color:"#15803d",marginBottom:14}}>
            OTP sent to WhatsApp: +91 {mobile}
          </div>
          <label style={S.lbl}>🔐 Enter OTP</label>
          <input style={{...S.inp,fontSize:"1.4rem",letterSpacing:10,textAlign:"center",marginBottom:14}} type="number" placeholder="------" value={otp} onChange={e=>setOtp(e.target.value)} />
          {error && <div style={{color:"#dc2626",fontSize:"0.82rem",marginBottom:10}}>{error}</div>}
          <button style={S.btn()} onClick={handleVerifyOTP} disabled={otp.length!==6}>✅ Verify & Login</button>
          <button style={S.btn("#f1f5f9","#475569")} onClick={()=>{setStep(1);setOtp("");setError("");}}>← Change Number</button>
        </>)}
        <div style={{textAlign:"center",color:"#94a3b8",fontSize:"0.75rem",marginTop:16}}>🔒 Secure login · New Tech customers only</div>
      </div>
    </div>
  );

  // Metrics
  const completedSvcs  = myServices.filter(s=>s.status==="Completed");
  const upcomingSvcs   = myServices.filter(s=>s.status!=="Completed"&&s.status!=="Cancelled");
  const totalPaid      = myReceipts.reduce((s,r)=>s+Number(r.receivedAmount||0),0);
  const totalOutstanding = myInvoices.reduce((s,i)=>s+Number(i.balanceOutstanding||0),0);
  const openComplaints = myComplaints.filter(c=>c.status==="Open"||c.status==="In Progress").length;

  // Next service
  const nextSvc = upcomingSvcs.sort((a,b)=>new Date(a.scheduledDate)-new Date(b.scheduledDate))[0];

  return (
    <div style={S.app}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.hLogo}>
          <span style={{fontSize:"1.4rem"}}>🏠</span>
          <div>
            <div style={S.hLogoTxt}>New Tech Home Services</div>
            <div style={S.hSub}>Customer Portal</div>
          </div>
        </div>
        <div style={S.hUser}>
          {/* Notification Bell */}
          <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setActiveTab("notifications")}>
            <span style={{fontSize:"1.3rem"}}>🔔</span>
            {unreadCount>0 && (
              <span style={{position:"absolute",top:-4,right:-4,background:"#ef4444",color:"#fff",borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem",fontWeight:800}}>
                {unreadCount>9?"9+":unreadCount}
              </span>
            )}
          </div>
          <div style={S.hAv}>{customer?.name?.charAt(0)?.toUpperCase()}</div>
          <div>
            <div style={S.hName}>{customer?.name}</div>
            <button onClick={()=>{setScreen("login");setCustomer(null);setStep(1);setMobile("");setOtp("");}}
              style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",fontSize:"0.7rem",cursor:"pointer",padding:0,fontFamily:"inherit"}}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={S.nav}>
        {TABS.map(([k,l])=>(
          <button key={k} style={S.navBtn(activeTab===k)} onClick={()=>setActiveTab(k)}>{l}</button>
        ))}
      </div>

      <div style={S.body}>

        {/* ══ DASHBOARD ══ */}
        {activeTab==="dashboard" && (
          <>
            {/* ── Welcome Hero ── */}
            <div style={{background:"linear-gradient(135deg,#1e40af 0%,#2563eb 60%,#0891b2 100%)",borderRadius:16,padding:20,marginBottom:14,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
              <div style={{position:"absolute",bottom:-30,right:30,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
              <div style={{position:"relative"}}>
                <div style={{fontSize:"1.15rem",fontWeight:800,color:"#fff",marginBottom:3}}>
                  {new Date().getHours()<12?"Good Morning":new Date().getHours()<17?"Good Afternoon":"Good Evening"}, {customer?.name?.split(" ")[0]}! 👋
                </div>
                <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.8)",marginBottom:14}}>
                  Your pest-free home is our commitment · {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {customer?.customerId && (
                    <div style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"5px 12px",fontSize:"0.75rem",color:"#fff",fontWeight:600}}>
                      🆔 {customer.customerId}
                    </div>
                  )}
                  <div style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"5px 12px",fontSize:"0.75rem",color:"#fff",fontWeight:600}}>
                    📱 {customer?.mobile}
                  </div>
                  {unreadCount>0 && (
                    <div style={{background:"#ef4444",borderRadius:8,padding:"5px 12px",fontSize:"0.75rem",color:"#fff",fontWeight:700,cursor:"pointer"}} onClick={()=>setActiveTab("notifications")}>
                      🔔 {unreadCount} New Alert{unreadCount>1?"s":""}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── 4 Stat Cards ── */}
            <div style={S.statGrid}>
              {[
                {icon:"✅",label:"Services Done",    val:completedSvcs.length,                                   color:"#059669",bg:"#f0fdf4", action:()=>setActiveTab("services")},
                {icon:"📅",label:"Upcoming Services", val:upcomingSvcs.length,                                   color:"#2563eb",bg:"#eff6ff", action:()=>setActiveTab("services")},
                {icon:"💳",label:"Amount Paid",       val:`₹${totalPaid.toLocaleString("en-IN")}`,               color:"#059669",bg:"#f0fdf4", action:()=>setActiveTab("payments")},
                {icon:"⏳",label:"Outstanding",       val:`₹${totalOutstanding.toLocaleString("en-IN")}`,        color:"#dc2626",bg:"#fef2f2", action:()=>setActiveTab("payments")},
              ].map((s,i)=>(
                <div key={i} onClick={s.action} style={{...S.statCard(s.bg,s.color),cursor:"pointer",transition:"transform 0.15s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                  <div style={{fontSize:"1.3rem",marginBottom:4}}>{s.icon}</div>
                  <div style={S.statVal(s.color)}>{s.val}</div>
                  <div style={S.statLbl}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── LIVE SERVICE STATUS ── */}
            {nextSvc && (
              <div style={{...S.card, border:`2px solid ${nextSvc.status==="Going"||nextSvc.status==="Reached"||nextSvc.status==="In Progress"?"#22c55e":"#2563eb"}`}}>
                <div style={S.cardH(nextSvc.status==="Going"?"#fef9c3":nextSvc.status==="Reached"?"#dcfce7":nextSvc.status==="In Progress"?"#ede9fe":"#eff6ff")}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {(nextSvc.status==="Going"||nextSvc.status==="Reached"||nextSvc.status==="In Progress") && (
                      <div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",animation:"pulse 1.5s infinite"}}/>
                    )}
                    <span style={S.cardT}>
                      {nextSvc.status==="Going"?"🚗 Technician On the Way!":
                       nextSvc.status==="Reached"?"📍 Technician Has Arrived!":
                       nextSvc.status==="In Progress"?"🔧 Service In Progress":
                       "📅 Next Scheduled Service"}
                    </span>
                  </div>
                  <span style={S.badge(
                    nextSvc.status==="Going"?"#fef9c3":nextSvc.status==="Reached"?"#dcfce7":nextSvc.status==="In Progress"?"#ede9fe":"#dbeafe",
                    nextSvc.status==="Going"?"#d97706":nextSvc.status==="Reached"?"#15803d":nextSvc.status==="In Progress"?"#7c3aed":"#1d4ed8"
                  )}>{nextSvc.status}</span>
                </div>
                <div style={S.cardB}>
                  {/* Service info */}
                  <div style={{fontWeight:800,fontSize:"1rem",color:"#0f172a",marginBottom:8}}>{nextSvc.treatment||nextSvc.plan}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                    {[
                      {icon:"📅",label:"Date",    val:nextSvc.scheduledDate},
                      {icon:"⏰",label:"Time",    val:nextSvc.timeSlot||"TBD"},
                      {icon:"👷",label:"Tech",    val:nextSvc.technician||"To be assigned"},
                      {icon:"📍",label:"Service", val:nextSvc.serviceNo||"Service Visit"},
                    ].map((r,i)=>(
                      <div key={i} style={{background:"#f8fafc",borderRadius:8,padding:"8px 10px"}}>
                        <div style={{fontSize:"0.7rem",color:"#94a3b8"}}>{r.icon} {r.label}</div>
                        <div style={{fontSize:"0.84rem",fontWeight:700,color:"#0f172a",marginTop:1}}>{r.val}</div>
                      </div>
                    ))}
                  </div>
                  {/* Live status alerts */}
                  {nextSvc.status==="Going" && (
                    <div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:10,padding:"10px 14px",marginBottom:10}}>
                      <div style={{fontWeight:700,color:"#d97706",marginBottom:3}}>🚗 Technician is on the way!</div>
                      {nextSvc.etaMinutes && <div style={{fontSize:"0.82rem",color:"#92400e"}}>⏱ Estimated arrival in <strong>{nextSvc.etaMinutes} minutes</strong></div>}
                      <div style={{fontSize:"0.78rem",color:"#92400e",marginTop:4}}>Please ensure someone is available at home</div>
                    </div>
                  )}
                  {nextSvc.status==="Reached" && (
                    <div style={{background:"#dcfce7",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px",marginBottom:10}}>
                      <div style={{fontWeight:700,color:"#15803d",marginBottom:3}}>📍 Technician has arrived!</div>
                      <div style={{fontSize:"0.82rem",color:"#166534"}}>Please open the door and guide to the service area</div>
                    </div>
                  )}
                  {nextSvc.status==="In Progress" && (
                    <div style={{background:"#ede9fe",border:"1px solid #ddd6fe",borderRadius:10,padding:"10px 14px",marginBottom:10}}>
                      <div style={{fontWeight:700,color:"#7c3aed",marginBottom:3}}>🔧 Service in progress</div>
                      <div style={{fontSize:"0.82rem",color:"#6d28d9"}}>Treatment is currently being performed. Please stay nearby for any queries.</div>
                    </div>
                  )}
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <button style={S.btnSm("#fffbeb","#d97706")} onClick={()=>{setRequestType("reschedule");setShowRequestForm(true);}}>📅 Reschedule</button>
                    <button style={S.btnSm("#fef2f2","#dc2626")} onClick={()=>setShowComplaintForm(true)}>⚠️ Complaint</button>
                    <a href="tel:917718898455" style={{...S.btnSm("#eff6ff","#1d4ed8"),textDecoration:"none"}}>📞 Call Us</a>
                    <a href="https://wa.me/917718898455" target="_blank" rel="noreferrer" style={{...S.btnSm("#f0fdf4","#15803d"),textDecoration:"none"}}>💬 WhatsApp</a>
                  </div>
                </div>
              </div>
            )}

            {/* ── Alerts ── */}
            {openComplaints>0 && (
              <div style={S.alert("#fef2f2","#dc2626")}>
                ⚠️ {openComplaints} open complaint{openComplaints>1?"s":""}
                <button onClick={()=>setActiveTab("complaints")} style={{background:"none",border:"none",color:"#dc2626",fontWeight:700,cursor:"pointer",textDecoration:"underline",marginLeft:"auto"}}>View →</button>
              </div>
            )}
            {totalOutstanding>0 && (
              <div style={S.alert("#fffbeb","#d97706")}>
                💳 Outstanding: ₹{totalOutstanding.toLocaleString("en-IN")}
                <button onClick={()=>setActiveTab("payments")} style={{background:"none",border:"none",color:"#d97706",fontWeight:700,cursor:"pointer",textDecoration:"underline",marginLeft:"auto"}}>Pay Now →</button>
              </div>
            )}

            {/* ── CONTRACT OVERVIEW ── */}
            {myInvoices.length > 0 && (
              <div style={S.card}>
                <div style={S.cardH("#f5f3ff")}><span style={S.cardT}>📋 My Contracts</span></div>
                <div style={S.cardB}>
                  {myInvoices.slice(0,3).map((inv,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<Math.min(myInvoices.length,3)-1?"1px solid #f1f5f9":"none"}}>
                      <div style={{width:36,height:36,borderRadius:10,background:"#f5f3ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>
                        {inv.serviceCategory?.includes("Pest")?"🪲":inv.serviceCategory?.includes("Clean")?"🧹":"🔧"}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:"0.85rem"}}>{inv.serviceCategory||"Service"}</div>
                        <div style={{fontSize:"0.74rem",color:"#64748b",marginTop:1}}>
                          {inv.servicePlan} · {inv.contractStartDate||inv.invoiceDate} → {inv.contractEndDate||"—"}
                        </div>
                      </div>
                      <span style={S.badge(
                        inv.paymentStatus==="Paid"?"#dcfce7":inv.paymentStatus==="Partial"?"#fef9c3":"#fee2e2",
                        inv.paymentStatus==="Paid"?"#15803d":inv.paymentStatus==="Partial"?"#a16207":"#dc2626"
                      )}>{inv.paymentStatus||"Pending"}</span>
                    </div>
                  ))}
                  {myInvoices.length>3 && (
                    <button style={{...S.btnSm(),marginTop:10,width:"100%",textAlign:"center"}} onClick={()=>setActiveTab("payments")}>
                      View all {myInvoices.length} invoices →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── SERVICE HISTORY TIMELINE ── */}
            <div style={S.card}>
              <div style={S.cardH()}>
                <span style={S.cardT}>🕐 Recent Activity</span>
                <button style={S.btnSm()} onClick={()=>setActiveTab("services")}>View All</button>
              </div>
              <div style={S.cardB}>
                {myServices.length===0 ? (
                  <div style={{textAlign:"center",padding:20,color:"#94a3b8",fontSize:"0.84rem"}}>No service history yet</div>
                ) : [...myServices].sort((a,b)=>new Date(b.scheduledDate)-new Date(a.scheduledDate)).slice(0,4).map((s,i,arr)=>{
                  const isCompleted = s.status==="Completed";
                  const dotColor = isCompleted?"#059669":s.status==="Cancelled"?"#dc2626":"#2563eb";
                  return (
                    <div key={i} style={{display:"flex",gap:12,paddingBottom:14,position:"relative"}}>
                      {i<arr.length-1 && <div style={{position:"absolute",left:11,top:24,bottom:0,width:2,background:"#f1f5f9"}}/>}
                      <div style={{width:24,height:24,borderRadius:"50%",background:dotColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",color:"#fff",fontWeight:700,flexShrink:0,zIndex:1,marginTop:2}}>
                        {isCompleted?"✓":s.status==="Cancelled"?"✕":"●"}
                      </div>
                      <div style={{flex:1,background:"#f8fafc",borderRadius:10,padding:"8px 12px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:4}}>
                          <span style={{fontWeight:700,fontSize:"0.84rem"}}>{s.treatment||s.plan||"Service"}</span>
                          <span style={S.badge(
                            isCompleted?"#dcfce7":s.status==="Cancelled"?"#fee2e2":"#dbeafe",
                            isCompleted?"#15803d":s.status==="Cancelled"?"#dc2626":"#1d4ed8"
                          )}>{s.status}</span>
                        </div>
                        <div style={{fontSize:"0.74rem",color:"#64748b",marginTop:3}}>
                          {s.scheduledDate}{s.technician?` · 👷 ${s.technician}`:""}
                        </div>
                        {isCompleted && s.serviceReport && (
                          <button style={{...S.btnSm("#eff6ff","#1d4ed8"),marginTop:5,fontSize:"0.72rem"}}
                            onClick={()=>setActiveTab("documents")}>
                            📄 View Report
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── QUICK ACTIONS ── */}
            <div style={S.card}>
              <div style={S.cardH()}><span style={S.cardT}>⚡ Quick Actions</span></div>
              <div style={{...S.cardB,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  {icon:"📅",label:"Request Service",   bg:"#eff6ff",tc:"#1d4ed8", action:()=>{setRequestType("new");setShowRequestForm(true);}},
                  {icon:"💳",label:"Make Payment",      bg:"#f0fdf4",tc:"#15803d", action:()=>setShowPaymentForm(true)},
                  {icon:"⚠️",label:"Log Complaint",     bg:"#fef2f2",tc:"#dc2626", action:()=>setShowComplaintForm(true)},
                  {icon:"📅",label:"Reschedule",        bg:"#fffbeb",tc:"#d97706", action:()=>{setRequestType("reschedule");setShowRequestForm(true);}},
                  {icon:"🔄",label:"AMC Renewal",       bg:"#f5f3ff",tc:"#7c3aed", action:()=>{setRequestType("renewal");setShowRequestForm(true);}},
                  {icon:"💬",label:"WhatsApp Us",        bg:"#f0fdf4",tc:"#15803d", action:()=>window.open("https://wa.me/917718898455","_blank")},
                  {icon:"🔔",label:"Notifications",     bg:"#fef9c3",tc:"#d97706", action:()=>setActiveTab("notifications")},
                  {icon:"💬",label:"Comm Log",           bg:"#ede9fe",tc:"#7c3aed", action:()=>setActiveTab("comms")},
                ].map((a,i)=>(
                  <div key={i} onClick={a.action}
                    style={{background:a.bg,borderRadius:10,padding:"12px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,border:"1px solid transparent",transition:"all 0.15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}>
                    <span style={{fontSize:"1.2rem"}}>{a.icon}</span>
                    <span style={{fontSize:"0.8rem",fontWeight:700,color:a.tc}}>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RECENT NOTIFICATIONS PREVIEW ── */}
            {notifications.filter(n=>n.priority==="high").length > 0 && (
              <div style={S.card}>
                <div style={S.cardH("#fef2f2")}>
                  <span style={S.cardT}>🔔 Important Alerts</span>
                  <button style={S.btnSm("#fef2f2","#dc2626")} onClick={()=>setActiveTab("notifications")}>View All</button>
                </div>
                <div style={S.cardB}>
                  {notifications.filter(n=>n.priority==="high").slice(0,3).map((n,i)=>(
                    <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #f9fafb",alignItems:"flex-start"}}>
                      <span style={{fontSize:"1.1rem",flexShrink:0}}>{n.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:"0.83rem"}}>{n.title}</div>
                        <div style={{fontSize:"0.75rem",color:"#64748b",marginTop:1}}>{n.message.slice(0,70)}...</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Blog snippet ── */}
            <div style={S.card}>
              <div style={S.cardH()}>
                <span style={S.cardT}>📰 Pest Tips & Awareness</span>
                <button style={S.btnSm()} onClick={()=>setActiveTab("blog")}>See All</button>
              </div>
              <div style={S.cardB}>
                {BLOG_POSTS.slice(0,2).map((p,i)=>(
                  <div key={i} style={{display:"flex",gap:12,padding:"8px 0",borderBottom:i===0?"1px solid #f1f5f9":"none",cursor:"pointer"}} onClick={()=>setActiveTab("blog")}>
                    <div style={{width:38,height:38,borderRadius:10,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0}}>{p.icon}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:"0.84rem"}}>{p.title}</div>
                      <div style={{fontSize:"0.74rem",color:"#64748b",marginTop:2}}>{p.category} · {p.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Contact footer ── */}
            <div style={{background:"linear-gradient(135deg,#0f172a,#1e293b)",borderRadius:14,padding:20,textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:"1.1rem",fontWeight:800,color:"#fff",marginBottom:4}}>Need Help?</div>
              <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.6)",marginBottom:14}}>We're available 9AM – 8PM · 7 days a week</div>
              <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                <a href="tel:917718898455" style={{...S.btnSm("#2563eb","#fff"),padding:"10px 20px",textDecoration:"none"}}>📞 Call</a>
                <a href="https://wa.me/917718898455" target="_blank" rel="noreferrer" style={{...S.btnSm("#059669","#fff"),padding:"10px 20px",textDecoration:"none"}}>💬 WhatsApp</a>
                <a href="mailto:newtechpest01@gmail.com" style={{...S.btnSm("#7c3aed","#fff"),padding:"10px 20px",textDecoration:"none"}}>✉️ Email</a>
              </div>
            </div>
          </>
        )}

        {/* ══ SERVICES ══ */}
        {activeTab==="services" && (
          <>
            {/* Upcoming */}
            <div style={S.card}>
              <div style={S.cardH("#eff6ff")}>
                <span style={S.cardT}>📅 Upcoming Services</span>
                <span style={S.badge("#dbeafe","#1d4ed8")}>{upcomingSvcs.length}</span>
              </div>
              <div style={S.cardB}>
                {upcomingSvcs.length===0 ? (
                  <div style={{textAlign:"center",padding:20,color:"#94a3b8"}}>No upcoming services</div>
                ) : upcomingSvcs.map((s,i)=>(
                  <div key={i} style={S.svcRow}>
                    <div style={{...S.svcIcon,background:"#eff6ff"}}>📅</div>
                    <div style={S.svcInfo}>
                      <div style={S.svcName}>{s.treatment||s.plan||"Service"}</div>
                      <div style={S.svcMeta}>📅 {s.scheduledDate} · ⏰ {s.timeSlot||"TBD"} · 👷 {s.technician||"TBD"}</div>
                      {s.serviceNo && <div style={S.svcMeta}>Service {s.serviceNo}</div>}
                    </div>
                    <span style={S.badge(
                      s.status==="Going"?"#fef3c7":s.status==="In Progress"?"#ede9fe":"#dbeafe",
                      s.status==="Going"?"#d97706":s.status==="In Progress"?"#7c3aed":"#1d4ed8"
                    )}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed */}
            <div style={S.card}>
              <div style={S.cardH("#f0fdf4")}>
                <span style={S.cardT}>✅ Completed Services</span>
                <span style={S.badge("#dcfce7","#15803d")}>{completedSvcs.length}</span>
              </div>
              <div style={S.cardB}>
                {completedSvcs.length===0 ? (
                  <div style={{textAlign:"center",padding:20,color:"#94a3b8"}}>No completed services yet</div>
                ) : completedSvcs.map((s,i)=>(
                  <div key={i} style={S.svcRow}>
                    <div style={{...S.svcIcon,background:"#f0fdf4"}}>✅</div>
                    <div style={S.svcInfo}>
                      <div style={S.svcName}>{s.treatment||s.plan||"Service"}</div>
                      <div style={S.svcMeta}>📅 {s.scheduledDate} · 👷 {s.technician}</div>
                      {s.completedTime && <div style={S.svcMeta}>⏰ Completed at {s.completedTime}</div>}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                      <span style={S.badge("#dcfce7","#15803d")}>Done</span>
                      {s.serviceReport && (
                        <button style={S.btnSm("#eff6ff","#1d4ed8")} onClick={()=>alert("Service report: Completed on "+s.scheduledDate+"\nTechnician: "+s.technician+"\nTreatment: "+s.treatment+"\n\nFull PDF report feature coming soon!")}>
                          📄 Report
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Request new service */}
            <button style={S.btn()} onClick={()=>{setRequestType("new");setShowRequestForm(true);}}>
              ➕ Request New Service
            </button>
          </>
        )}

        {/* ══ PAYMENTS ══ */}
        {activeTab==="payments" && (
          <>
            {/* Summary */}
            <div style={S.statGrid}>
              <div style={S.statCard("#f0fdf4","#059669")}>
                <div style={{fontSize:"1.1rem",marginBottom:4}}>💳</div>
                <div style={S.statVal("#059669")}>₹{totalPaid.toLocaleString("en-IN")}</div>
                <div style={S.statLbl}>Total Paid</div>
              </div>
              <div style={S.statCard("#fef2f2","#dc2626")}>
                <div style={{fontSize:"1.1rem",marginBottom:4}}>⏳</div>
                <div style={S.statVal("#dc2626")}>₹{totalOutstanding.toLocaleString("en-IN")}</div>
                <div style={S.statLbl}>Outstanding</div>
              </div>
            </div>

            {totalOutstanding>0 && (
              <button style={S.btn("#059669")} onClick={()=>setShowPaymentForm(true)}>
                💳 Pay Now — ₹{totalOutstanding.toLocaleString("en-IN")}
              </button>
            )}

            {/* Invoices */}
            <div style={S.card}>
              <div style={S.cardH()}><span style={S.cardT}>🧾 My Invoices</span></div>
              <div style={S.cardB}>
                {myInvoices.length===0 ? (
                  <div style={{textAlign:"center",padding:20,color:"#94a3b8"}}>No invoices yet</div>
                ) : myInvoices.map((inv,i)=>(
                  <div key={i} style={{background:Number(inv.balanceOutstanding)>0?"#fffbeb":"#f8fafc",borderRadius:12,padding:"12px 14px",marginBottom:10,border:`1px solid ${Number(inv.balanceOutstanding)>0?"#fde68a":"#e2e8f0"}`}}>
                    {/* Invoice header */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{fontWeight:800,fontSize:"0.9rem",color:"#0f172a"}}>{inv.invoiceNo||"Invoice"}</div>
                        <div style={{fontSize:"0.74rem",color:"#64748b",marginTop:2}}>{inv.invoiceDate} · {inv.serviceCategory||"Service"}</div>
                      </div>
                      <span style={S.badge(
                        inv.paymentStatus==="Paid"?"#dcfce7":inv.paymentStatus==="Partial"?"#fef9c3":"#fee2e2",
                        inv.paymentStatus==="Paid"?"#15803d":inv.paymentStatus==="Partial"?"#a16207":"#dc2626"
                      )}>{inv.paymentStatus||"Pending"}</span>
                    </div>
                    {/* Amounts */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
                      {[
                        {label:"Invoice Amt",val:`₹${Number(inv.totalInvoiceAmount||0).toLocaleString("en-IN")}`,color:"#0f172a"},
                        {label:"Paid",       val:`₹${Number(inv.amountReceived||0).toLocaleString("en-IN")}`,   color:"#059669"},
                        {label:"Balance",    val:`₹${Number(inv.balanceOutstanding||0).toLocaleString("en-IN")}`,color:Number(inv.balanceOutstanding)>0?"#dc2626":"#059669"},
                      ].map((a,j)=>(
                        <div key={j} style={{background:"#fff",borderRadius:8,padding:"6px 8px",textAlign:"center"}}>
                          <div style={{fontSize:"0.68rem",color:"#94a3b8"}}>{a.label}</div>
                          <div style={{fontWeight:800,fontSize:"0.84rem",color:a.color,marginTop:1}}>{a.val}</div>
                        </div>
                      ))}
                    </div>
                    {/* Actions */}
                    <div style={{display:"flex",gap:8}}>
                      <button style={{...S.btnSm("#eff6ff","#1d4ed8"),flex:1,textAlign:"center"}} onClick={()=>setShowInvoice(inv)}>
                        🧾 View Invoice
                      </button>
                      {Number(inv.balanceOutstanding)>0 && (
                        <button style={{...S.btnSm("#059669","#fff"),flex:1,textAlign:"center"}} onClick={()=>setShowPaymentForm(true)}>
                          💳 Pay ₹{Number(inv.balanceOutstanding).toLocaleString("en-IN")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Receipts */}
            <div style={S.card}>
              <div style={S.cardH("#f0fdf4")}><span style={S.cardT}>✅ Payment History</span></div>
              <div style={S.cardB}>
                {myReceipts.length===0 ? (
                  <div style={{textAlign:"center",padding:20,color:"#94a3b8"}}>No payment records</div>
                ) : myReceipts.map((r,i)=>(
                  <div key={i} style={{background:"#f0fdf4",borderRadius:12,padding:"12px 14px",marginBottom:10,border:"1px solid #bbf7d0"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{fontWeight:800,fontSize:"0.9rem",color:"#0f172a"}}>✅ ₹{Number(r.receivedAmount||0).toLocaleString("en-IN")} Received</div>
                        <div style={{fontSize:"0.74rem",color:"#64748b",marginTop:2}}>{r.receiptDate} · {r.paymentMode}</div>
                      </div>
                      <span style={S.badge("#dcfce7","#15803d")}>Paid</span>
                    </div>
                    <div style={{fontSize:"0.78rem",color:"#475569",marginBottom:10}}>
                      Invoice: <strong>{r.invoiceNo}</strong> · {r.department}
                    </div>
                    <button style={{...S.btnSm("#059669","#fff"),width:"100%",textAlign:"center"}} onClick={()=>setShowReceipt(r)}>
                      🧾 View Receipt
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══ REQUESTS & COMPLAINTS ══ */}
        {activeTab==="complaints" && (
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              <button style={S.btn("#eff6ff","#1d4ed8")} onClick={()=>{setRequestType("new");setShowRequestForm(true);}}>➕ New Service Request</button>
              <button style={S.btn("#fef2f2","#dc2626")} onClick={()=>setShowComplaintForm(true)}>⚠️ Log Complaint</button>
              <button style={S.btn("#fffbeb","#d97706")} onClick={()=>{setRequestType("reschedule");setShowRequestForm(true);}}>📅 Reschedule</button>
              <button style={S.btn("#f5f3ff","#7c3aed")} onClick={()=>{setRequestType("renewal");setShowRequestForm(true);}}>🔄 AMC Renewal</button>
            </div>

            <div style={S.card}>
              <div style={S.cardH()}><span style={S.cardT}>📋 My Requests & Complaints</span></div>
              <div style={S.cardB}>
                {myComplaints.length===0 ? (
                  <div style={{textAlign:"center",padding:20,color:"#94a3b8"}}>No complaints or requests</div>
                ) : myComplaints.map((c,i)=>(
                  <div key={i} style={S.svcRow}>
                    <div style={{...S.svcIcon,background:"#fef2f2"}}>⚠️</div>
                    <div style={S.svcInfo}>
                      <div style={S.svcName}>{c.type}</div>
                      <div style={S.svcMeta}>{c.raisedOn} · Priority: {c.priority}</div>
                      <div style={S.svcMeta}>{c.description?.slice(0,60)}...</div>
                    </div>
                    <span style={S.badge(
                      c.status==="Resolved"?"#dcfce7":c.status==="In Progress"?"#fef9c3":"#fee2e2",
                      c.status==="Resolved"?"#15803d":c.status==="In Progress"?"#a16207":"#dc2626"
                    )}>{c.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Log */}
            {myComms.length>0 && (
              <div style={S.card}>
                <div style={S.cardH()}><span style={S.cardT}>💬 Communication Log</span></div>
                <div style={S.cardB}>
                  {myComms.map((log,i)=>(
                    <div key={i} style={{...S.tlItem}}>
                      {i<myComms.length-1 && <div style={S.tlLine}/>}
                      <div style={S.tlDot(log.type?.includes("Call")?"#2563eb":log.type==="WhatsApp"?"#059669":"#7c3aed")}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                          <span style={S.badge("#eff6ff","#1d4ed8")}>{log.type}</span>
                          <span style={{fontSize:"0.72rem",color:"#94a3b8"}}>{log.date} {log.time}</span>
                        </div>
                        <div style={{fontSize:"0.82rem",color:"#0f172a"}}>{log.summary}</div>
                        {log.nextAction && <div style={{fontSize:"0.75rem",color:"#059669",marginTop:2}}>Next: {log.nextAction}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ══ NOTIFICATIONS ══ */}
        {activeTab==="notifications" && (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:"0.85rem",color:"#64748b"}}>{notifications.length} notification{notifications.length!==1?"s":""}</div>
              {unreadCount>0 && (
                <button style={S.btnSm("#eff6ff","#1d4ed8")} onClick={()=>setUnreadCount(0)}>
                  ✓ Mark All Read
                </button>
              )}
            </div>

            {notifications.length===0 ? (
              <div style={{...S.card}}>
                <div style={{padding:40,textAlign:"center",color:"#94a3b8"}}>
                  <div style={{fontSize:"2.5rem",marginBottom:8}}>🔔</div>
                  <div style={{fontWeight:600}}>No notifications</div>
                  <div style={{fontSize:"0.82rem",marginTop:4}}>You're all caught up!</div>
                </div>
              </div>
            ) : notifications.map((n,i)=>{
              const BG   = { high:"#fef2f2", medium:"#fffbeb", low:"#f8fafc", info:"#eff6ff" };
              const BC   = { high:"#fecaca", medium:"#fde68a", low:"#e2e8f0", info:"#bfdbfe" };
              const TC   = { high:"#dc2626", medium:"#d97706", low:"#64748b", info:"#2563eb" };
              const TYPEBG  = { service:"#eff6ff", payment:"#fef2f2", complaint:"#fef9c3", renewal:"#f5f3ff", live:"#f0fdf4", info:"#f8fafc" };
              const TYPECLR = { service:"#1d4ed8", payment:"#dc2626", complaint:"#a16207", renewal:"#7c3aed", live:"#059669", info:"#64748b" };
              return (
                <div key={n.id} style={{...S.card, border:`1.5px solid ${BC[n.priority]||"#e2e8f0"}`, background:n.read?"#fff":BG[n.priority]||"#f8fafc", marginBottom:10}}>
                  <div style={{padding:"12px 16px",display:"flex",gap:12,alignItems:"flex-start"}}>
                    {/* Icon */}
                    <div style={{width:42,height:42,borderRadius:12,background:TYPEBG[n.type]||"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0}}>
                      {n.icon}
                    </div>
                    {/* Content */}
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                        <span style={{fontWeight:700,fontSize:"0.88rem",color:"#0f172a"}}>{n.title}</span>
                        {!n.read && <span style={{width:8,height:8,borderRadius:"50%",background:"#2563eb",display:"inline-block",flexShrink:0}}/>}
                      </div>
                      <div style={{fontSize:"0.8rem",color:"#475569",lineHeight:1.5,marginBottom:6}}>{n.message}</div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <span style={S.badge(TYPEBG[n.type]||"#f1f5f9",TYPECLR[n.type]||"#64748b")}>{n.type}</span>
                          <span style={{fontSize:"0.7rem",color:"#94a3b8"}}>{n.time}</span>
                        </div>
                        <span style={{...S.badge(
                          n.priority==="high"?"#fee2e2":n.priority==="medium"?"#fef9c3":"#f1f5f9",
                          TC[n.priority]||"#64748b"
                        ),fontSize:"0.68rem"}}>{n.priority} priority</span>
                      </div>
                      {/* Action buttons per type */}
                      {n.type==="payment" && (
                        <button style={{...S.btnSm("#059669","#fff"),marginTop:8}} onClick={()=>setShowPaymentForm(true)}>
                          💳 Pay Now
                        </button>
                      )}
                      {n.type==="renewal" && (
                        <button style={{...S.btnSm("#7c3aed","#fff"),marginTop:8}} onClick={()=>{setRequestType("renewal");setShowRequestForm(true);}}>
                          🔄 Renew Now
                        </button>
                      )}
                      {n.type==="service" && n.title.includes("Completed") && (
                        <button style={{...S.btnSm("#2563eb","#fff"),marginTop:8}} onClick={()=>setActiveTab("services")}>
                          📄 View Report
                        </button>
                      )}
                      {n.type==="live" && (
                        <button style={{...S.btnSm("#059669","#fff"),marginTop:8}} onClick={()=>setActiveTab("services")}>
                          📍 Track Service
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ══ COMMUNICATION LOG ══ */}
        {activeTab==="comms" && (
          <>
            <div style={{fontSize:"0.84rem",color:"#64748b",marginBottom:12}}>
              Complete history of all calls, WhatsApp messages and visits with New Tech team
            </div>

            {/* Summary stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
              {[
                {icon:"📞",label:"Calls",     val:myComms.filter(c=>c.type?.includes("Call")).length,    color:"#2563eb",bg:"#eff6ff"},
                {icon:"💬",label:"WhatsApp",  val:myComms.filter(c=>c.type==="WhatsApp").length,         color:"#059669",bg:"#f0fdf4"},
                {icon:"🏠",label:"Site Visits",val:myComms.filter(c=>c.type==="Site Visit").length,      color:"#7c3aed",bg:"#f5f3ff"},
              ].map((s,i)=>(
                <div key={i} style={{background:s.bg,borderRadius:12,padding:"12px 14px",textAlign:"center",borderTop:`3px solid ${s.color}`}}>
                  <div style={{fontSize:"1.1rem"}}>{s.icon}</div>
                  <div style={{fontWeight:800,fontSize:"1.2rem",color:s.color}}>{s.val}</div>
                  <div style={{fontSize:"0.7rem",color:"#64748b",marginTop:1}}>{s.label}</div>
                </div>
              ))}
            </div>

            {myComms.length===0 ? (
              <div style={S.card}>
                <div style={{padding:40,textAlign:"center",color:"#94a3b8"}}>
                  <div style={{fontSize:"2rem",marginBottom:8}}>💬</div>
                  <div style={{fontWeight:600}}>No communication history yet</div>
                  <div style={{fontSize:"0.8rem",marginTop:4}}>All calls, WhatsApp and visits will appear here</div>
                  <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:16}}>
                    <a href="tel:917718898455" style={{...S.btnSm("#eff6ff","#1d4ed8"),textDecoration:"none"}}>📞 Call Us</a>
                    <a href="https://wa.me/917718898455" target="_blank" rel="noreferrer" style={{...S.btnSm("#f0fdf4","#15803d"),textDecoration:"none"}}>💬 WhatsApp</a>
                  </div>
                </div>
              </div>
            ) : (
              <div style={S.card}>
                <div style={S.cardH()}>
                  <span style={S.cardT}>💬 Communication Timeline</span>
                  <span style={S.badge("#f1f5f9","#64748b")}>{myComms.length} entries</span>
                </div>
                <div style={{...S.cardB,paddingBottom:8}}>
                  {myComms.map((log,i)=>{
                    const typeColor = log.type?.includes("Call")?"#2563eb":log.type==="WhatsApp"?"#059669":log.type==="Site Visit"?"#7c3aed":"#d97706";
                    const typeBg    = log.type?.includes("Call")?"#eff6ff":log.type==="WhatsApp"?"#f0fdf4":log.type==="Site Visit"?"#f5f3ff":"#fffbeb";
                    const typeIcon  = log.type?.includes("Call")?"📞":log.type==="WhatsApp"?"💬":log.type==="Site Visit"?"🏠":"🔔";
                    const respColor = log.response==="Confirmed"?"#059669":log.response==="Reschedule Request"?"#d97706":log.response==="Complaint"?"#dc2626":"#475569";

                    return (
                      <div key={i} style={{display:"flex",gap:12,paddingBottom:16,position:"relative"}}>
                        {i<myComms.length-1 && (
                          <div style={{position:"absolute",left:19,top:40,bottom:0,width:2,background:"#f1f5f9"}}/>
                        )}
                        {/* Icon circle */}
                        <div style={{width:40,height:40,borderRadius:"50%",background:typeBg,border:`2px solid ${typeColor}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0,zIndex:1}}>
                          {typeIcon}
                        </div>
                        {/* Content */}
                        <div style={{flex:1,background:"#f8fafc",borderRadius:10,padding:"10px 14px",border:"1px solid #f1f5f9"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,flexWrap:"wrap",gap:4}}>
                            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                              <span style={S.badge(typeBg,typeColor)}>{log.type}</span>
                              {log.purpose && <span style={S.badge("#f1f5f9","#475569")}>{log.purpose}</span>}
                            </div>
                            <span style={{fontSize:"0.7rem",color:"#94a3b8",whiteSpace:"nowrap"}}>{log.date} {log.time}</span>
                          </div>
                          {/* Summary */}
                          <div style={{fontSize:"0.84rem",color:"#0f172a",lineHeight:1.5,marginBottom:log.response||log.nextAction?6:0}}>
                            {log.summary}
                          </div>
                          {/* Response */}
                          {log.response && (
                            <div style={{fontSize:"0.78rem",marginBottom:4}}>
                              <span style={{color:"#94a3b8"}}>Your response: </span>
                              <span style={{fontWeight:700,color:respColor}}>{log.response}</span>
                            </div>
                          )}
                          {/* Next action */}
                          {log.nextAction && (
                            <div style={{fontSize:"0.76rem",color:"#059669",fontWeight:600}}>
                              ➡️ Next: {log.nextAction}{log.nextDate?` (${log.nextDate})`:""}
                            </div>
                          )}
                          {/* Agent */}
                          {log.agent && (
                            <div style={{fontSize:"0.7rem",color:"#94a3b8",marginTop:4}}>
                              By: {log.agent}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contact Us */}
            <div style={{...S.card,marginTop:4}}>
              <div style={S.cardH()}><span style={S.cardT}>📞 Start a Conversation</span></div>
              <div style={{...S.cardB,display:"flex",gap:10,flexWrap:"wrap"}}>
                <a href="tel:917718898455" style={{...S.btn("#2563eb"),textDecoration:"none",textAlign:"center",flex:1,display:"block",marginBottom:0}}>📞 Call Us</a>
                <a href="https://wa.me/917718898455" target="_blank" rel="noreferrer" style={{...S.btn("#059669"),textDecoration:"none",textAlign:"center",flex:1,display:"block",marginBottom:0}}>💬 WhatsApp</a>
              </div>
            </div>
          </>
        )}

        {/* ══ DOCUMENTS ══ */}
        {activeTab==="documents" && (
          <>
            <div style={S.card}>
              <div style={S.cardH()}><span style={S.cardT}>📄 Quotations & Surveys</span></div>
              <div style={S.cardB}>
                <div style={{textAlign:"center",padding:20,color:"#94a3b8"}}>
                  <div style={{fontSize:"1.5rem",marginBottom:6}}>📋</div>
                  Your quotations and survey reports will appear here once generated by our team.
                  <br/><br/>
                  <a href="tel:917718898455" style={{color:"#2563eb",fontWeight:600}}>📞 Call for a Free Survey</a>
                </div>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.cardH()}><span style={S.cardT}>📄 Service Reports</span></div>
              <div style={S.cardB}>
                {completedSvcs.filter(s=>s.serviceReport).length===0 ? (
                  <div style={{textAlign:"center",padding:20,color:"#94a3b8"}}>Service reports will appear here after completed visits</div>
                ) : completedSvcs.filter(s=>s.serviceReport).map((s,i)=>(
                  <div key={i} style={S.svcRow}>
                    <div style={{...S.svcIcon,background:"#f0fdf4"}}>📄</div>
                    <div style={S.svcInfo}>
                      <div style={S.svcName}>Service Report — {s.scheduledDate}</div>
                      <div style={S.svcMeta}>{s.treatment} · {s.technician}</div>
                    </div>
                    <button style={S.btnSm("#eff6ff","#1d4ed8")}
                      onClick={()=>alert(`SERVICE REPORT\n\nDate: ${s.scheduledDate}\nTechnician: ${s.technician}\nTreatment: ${s.treatment}\nStatus: Completed at ${s.completedTime}\n\nInspection: ${JSON.stringify(s.serviceReport?.inspection||{},null,2)}\n\nChemicals Used: ${JSON.stringify(s.serviceReport?.chemUsage||[],null,2)}`)}>
                      📄 View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={S.card}>
              <div style={S.cardH()}><span style={S.cardT}>🔄 AMC & Renewal Status</span></div>
              <div style={S.cardB}>
                {myInvoices.filter(i=>i.servicePlan==="AMC").length===0 ? (
                  <div style={{textAlign:"center",padding:20,color:"#94a3b8"}}>
                    No active AMC contracts.
                    <br/><button style={{...S.btnSm(),marginTop:8}} onClick={()=>{setRequestType("renewal");setShowRequestForm(true);}}>🔄 Request AMC Renewal</button>
                  </div>
                ) : myInvoices.filter(i=>i.servicePlan==="AMC").map((inv,i)=>(
                  <div key={i} style={S.svcRow}>
                    <div style={{...S.svcIcon,background:"#f5f3ff"}}>🔄</div>
                    <div style={S.svcInfo}>
                      <div style={S.svcName}>{inv.serviceCategory} — AMC</div>
                      <div style={S.svcMeta}>Valid: {inv.contractStartDate} → {inv.contractEndDate}</div>
                    </div>
                    <span style={S.badge("#dcfce7","#15803d")}>Active</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══ BLOG & TIPS ══ */}
        {activeTab==="blog" && (
          <>
            <div style={{marginBottom:14,fontSize:"0.88rem",color:"#64748b"}}>
              🌟 Pest prevention tips, seasonal alerts & service guides from New Tech experts
            </div>
            {BLOG_POSTS.map(post=>(
              <div key={post.id} style={S.card}>
                <div style={S.cardH()}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:"1.5rem"}}>{post.icon}</span>
                    <div>
                      <div style={{fontWeight:700,fontSize:"0.9rem",color:"#0f172a"}}>{post.title}</div>
                      <div style={{display:"flex",gap:8,marginTop:3}}>
                        <span style={S.badge("#eff6ff","#1d4ed8")}>{post.category}</span>
                        <span style={{fontSize:"0.72rem",color:"#94a3b8"}}>{post.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={S.cardB}>
                  <div style={{fontSize:"0.83rem",color:"#475569",lineHeight:1.6}}>{post.preview}</div>
                  <button style={{...S.btnSm("#eff6ff","#1d4ed8"),marginTop:10}}
                    onClick={()=>alert(post.title+"\n\n"+post.preview+"\n\n[Full article — coming soon on newtechhomeservices.com]")}>
                    Read More →
                  </button>
                </div>
              </div>
            ))}

            {/* Contact */}
            <div style={{...S.card,background:"linear-gradient(135deg,#0f172a,#1e3a5f)"}}>
              <div style={{padding:20,textAlign:"center",color:"#fff"}}>
                <div style={{fontSize:"1.5rem",marginBottom:8}}>📞</div>
                <div style={{fontWeight:700,fontSize:"1rem",marginBottom:4}}>Need Help? Call Us Anytime</div>
                <div style={{opacity:0.75,fontSize:"0.82rem",marginBottom:14}}>WhatsApp or call for instant support</div>
                <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                  <a href="tel:917718898455" style={{...S.btnSm("#2563eb","#fff"),textDecoration:"none",padding:"10px 20px"}}>📞 Call Now</a>
                  <a href="https://wa.me/917718898455" target="_blank" rel="noreferrer" style={{...S.btnSm("#059669","#fff"),textDecoration:"none",padding:"10px 20px"}}>💬 WhatsApp</a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── REQUEST FORM MODAL ── */}
      {showRequestForm && (
        <RequestModal
          type={requestType}
          customer={customer}
          onClose={()=>setShowRequestForm(false)}
          onSubmit={(req)=>{
            const complaints = JSON.parse(localStorage.getItem("nt_complaints")||"[]");
            localStorage.setItem("nt_complaints", JSON.stringify([{
              ...req, id:`REQ-${Date.now()}`, raisedOn:new Date().toLocaleDateString("en-IN"),
              customerName:customer.name, mobile:customer.mobile, customerId:customer.customerId,
              status:"Open", addedBy:"Customer Portal"
            }, ...complaints]));
            setMyComplaints([req,...myComplaints]);
            setShowRequestForm(false);
            alert("✅ Request submitted! Our team will contact you within 24 hours.");
          }}
        />
      )}

      {/* ── COMPLAINT FORM MODAL ── */}
      {showComplaintForm && (
        <ComplaintModal
          customer={customer}
          services={myServices}
          onClose={()=>setShowComplaintForm(false)}
          onSubmit={(comp)=>{
            const complaints = JSON.parse(localStorage.getItem("nt_complaints")||"[]");
            localStorage.setItem("nt_complaints", JSON.stringify([{
              ...comp, id:`COMP-${Date.now()}`, raisedOn:new Date().toLocaleDateString("en-IN"),
              customerName:customer.name, mobile:customer.mobile, customerId:customer.customerId,
              status:"Open", addedBy:"Customer Portal"
            }, ...complaints]));
            setMyComplaints([comp,...myComplaints]);
            setShowComplaintForm(false);
            alert("✅ Complaint logged! Our team will respond within 24 hours.");
          }}
        />
      )}

      {/* ── PAYMENT MODAL ── */}
      {showPaymentForm && (
        <PaymentModal
          outstanding={totalOutstanding}
          invoices={myInvoices.filter(i=>Number(i.balanceOutstanding)>0)}
          onClose={()=>setShowPaymentForm(false)}
        />
      )}

      {/* ── INVOICE MODAL ── */}
      {showInvoice && (
        <InvoiceModal inv={showInvoice} customer={customer} onClose={()=>setShowInvoice(null)} />
      )}

      {/* ── RECEIPT MODAL ── */}
      {showReceipt && (
        <ReceiptModal rec={showReceipt} customer={customer} onClose={()=>setShowReceipt(null)} />
      )}
    </div>
  );
}

// ── REQUEST MODAL ─────────────────────────────────────
function RequestModal({ type, customer, onClose, onSubmit }) {
  const [f, setF] = useState({ type: type==="reschedule"?"Reschedule Request":type==="renewal"?"AMC Renewal Request":type==="new"?"New Service Request":"General Request", preferredDate:"", preferredTime:"", serviceType:"", notes:"", priority:"Medium" });
  return (
    <ModalWrap title={type==="reschedule"?"📅 Reschedule Service":type==="renewal"?"🔄 AMC Renewal":type==="new"?"➕ Request New Service":"📋 Submit Request"} onClose={onClose}>
      <label style={S.lbl}>Request Type</label>
      <select style={{...S.inp,marginBottom:12}} value={f.type} onChange={e=>setF(p=>({...p,type:e.target.value}))}>
        {["New Service Request","Reschedule Request","AMC Renewal Request","Survey Request","General Enquiry"].map(o=><option key={o}>{o}</option>)}
      </select>
      {(type==="new"||type==="reschedule") && <>
        <label style={S.lbl}>Preferred Date</label>
        <input type="date" style={{...S.inp,marginBottom:12}} value={f.preferredDate} onChange={e=>setF(p=>({...p,preferredDate:e.target.value}))} />
        <label style={S.lbl}>Preferred Time</label>
        <select style={{...S.inp,marginBottom:12}} value={f.preferredTime} onChange={e=>setF(p=>({...p,preferredTime:e.target.value}))}>
          <option value="">Select time slot</option>
          {["Morning (8AM-12PM)","Afternoon (12PM-4PM)","Evening (4PM-7PM)"].map(o=><option key={o}>{o}</option>)}
        </select>
      </>}
      {type==="new" && <>
        <label style={S.lbl}>Service Required</label>
        <select style={{...S.inp,marginBottom:12}} value={f.serviceType} onChange={e=>setF(p=>({...p,serviceType:e.target.value}))}>
          <option value="">Select service</option>
          {["General Pest Control","Bed Bug Treatment","Termite Treatment","Deep Cleaning","Kitchen Cleaning","Other"].map(o=><option key={o}>{o}</option>)}
        </select>
      </>}
      <label style={S.lbl}>Additional Notes</label>
      <textarea style={{...S.inp,minHeight:80,resize:"vertical",marginBottom:14}} placeholder="Any specific requirements or details..." value={f.notes} onChange={e=>setF(p=>({...p,notes:e.target.value}))} />
      <button style={S.btn()} onClick={()=>onSubmit(f)}>📤 Submit Request</button>
    </ModalWrap>
  );
}

// ── COMPLAINT MODAL ───────────────────────────────────
function ComplaintModal({ customer, services, onClose, onSubmit }) {
  const [f, setF] = useState({ type:"Service Quality", serviceDate:"", description:"", priority:"Medium" });
  return (
    <ModalWrap title="⚠️ Log Complaint" onClose={onClose}>
      <label style={S.lbl}>Complaint Type</label>
      <select style={{...S.inp,marginBottom:12}} value={f.type} onChange={e=>setF(p=>({...p,type:e.target.value}))}>
        {["Service Quality","Technician Behavior","Rescheduling Issue","Payment Issue","Chemical Smell","Incomplete Work","No Show","Other"].map(o=><option key={o}>{o}</option>)}
      </select>
      <label style={S.lbl}>Service Date (if applicable)</label>
      <input type="date" style={{...S.inp,marginBottom:12}} value={f.serviceDate} onChange={e=>setF(p=>({...p,serviceDate:e.target.value}))} />
      <label style={S.lbl}>Priority</label>
      <select style={{...S.inp,marginBottom:12}} value={f.priority} onChange={e=>setF(p=>({...p,priority:e.target.value}))}>
        {["Low","Medium","High","Critical"].map(o=><option key={o}>{o}</option>)}
      </select>
      <label style={S.lbl}>Description *</label>
      <textarea style={{...S.inp,minHeight:100,resize:"vertical",marginBottom:14}} placeholder="Please describe your complaint in detail..." value={f.description} onChange={e=>setF(p=>({...p,description:e.target.value}))} />
      <button style={S.btn("#dc2626")} onClick={()=>{if(!f.description){alert("Please describe your complaint");return;}onSubmit(f);}}>⚠️ Submit Complaint</button>
    </ModalWrap>
  );
}

// ── PAYMENT MODAL ─────────────────────────────────────
function PaymentModal({ outstanding, invoices, onClose }) {
  return (
    <ModalWrap title="💳 Make Payment" onClose={onClose}>
      <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:14,marginBottom:16,textAlign:"center"}}>
        <div style={{fontSize:"0.78rem",color:"#64748b"}}>Total Outstanding</div>
        <div style={{fontSize:"1.8rem",fontWeight:800,color:"#dc2626"}}>₹{outstanding.toLocaleString("en-IN")}</div>
      </div>
      <div style={{marginBottom:16}}>
        {invoices.map((inv,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f1f5f9",fontSize:"0.84rem"}}>
            <span style={{color:"#475569"}}>{inv.invoiceNo} · {inv.serviceCategory}</span>
            <span style={{fontWeight:700,color:"#dc2626"}}>₹{Number(inv.balanceOutstanding).toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <a href="https://wa.me/917718898455?text=Hi%2C+I+want+to+make+a+payment+for+my+outstanding+balance" target="_blank" rel="noreferrer"
          style={{...S.btn("#059669"),textDecoration:"none",textAlign:"center",display:"block"}}>
          💬 Pay via WhatsApp
        </a>
        <a href="tel:917718898455" style={{...S.btn("#2563eb"),textDecoration:"none",textAlign:"center",display:"block"}}>
          📞 Call to Pay
        </a>
        <div style={{textAlign:"center",fontSize:"0.78rem",color:"#94a3b8",marginTop:4}}>
          UPI · Cash · Bank Transfer · Cheque accepted
        </div>
      </div>
    </ModalWrap>
  );
}

// ── MODAL WRAPPER ─────────────────────────────────────
function ModalWrap({ title, onClose, children }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0"}}
      onClick={onClose}>
      <div style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:500,maxHeight:"90vh",overflow:"auto",animation:"slideUp 0.2s ease"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"#fff"}}>
          <span style={{fontWeight:700,fontSize:"1rem"}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:"1.1rem",cursor:"pointer",color:"#64748b"}}>✕</button>
        </div>
        <div style={{padding:"16px 20px 32px"}}>{children}</div>
      </div>
    </div>
  );
}

// ── INVOICE MODAL ─────────────────────────────────────
function InvoiceModal({ inv, customer, onClose }) {
  const printInvoice = () => {
    const w = window.open("","_blank","width=400,height=700");
    w.document.write(`
      <html><head><title>Invoice ${inv.invoiceNo}</title>
      <style>
        body{font-family:'Plus Jakarta Sans',Arial,sans-serif;margin:0;padding:0;background:#fff;}
        .inv{max-width:380px;margin:0 auto;padding:24px 20px;}
        .header{background:linear-gradient(135deg,#1e40af,#2563eb);padding:20px;border-radius:12px;color:#fff;margin-bottom:20px;text-align:center;}
        .logo{font-size:2rem;margin-bottom:4px;}
        .co-name{font-size:1.1rem;font-weight:800;}
        .co-sub{font-size:0.75rem;opacity:0.8;margin-top:2px;}
        .inv-no{background:rgba(255,255,255,0.2);border-radius:8px;padding:6px 14px;display:inline-block;font-size:0.85rem;font-weight:700;margin-top:10px;}
        .section{margin-bottom:16px;background:#f8fafc;border-radius:10px;padding:14px;}
        .section-title{font-size:0.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;}
        .row{display:flex;justify-content:space-between;padding:4px 0;font-size:0.83rem;}
        .label{color:#64748b;}
        .val{font-weight:600;color:#0f172a;}
        .divider{border:none;border-top:1px dashed #e2e8f0;margin:10px 0;}
        .total-box{background:#0f172a;border-radius:10px;padding:14px;text-align:center;margin-bottom:16px;}
        .total-label{color:rgba(255,255,255,0.6);font-size:0.75rem;}
        .total-val{color:#fff;font-size:1.6rem;font-weight:800;}
        .paid-box{background:#dcfce7;border-radius:8px;padding:10px;text-align:center;margin-bottom:8px;}
        .due-box{background:#fee2e2;border-radius:8px;padding:10px;text-align:center;margin-bottom:16px;}
        .status-paid{background:#059669;color:#fff;border-radius:20px;padding:4px 16px;font-size:0.8rem;font-weight:700;}
        .status-due{background:#dc2626;color:#fff;border-radius:20px;padding:4px 16px;font-size:0.8rem;font-weight:700;}
        .footer{text-align:center;font-size:0.72rem;color:#94a3b8;margin-top:16px;padding-top:14px;border-top:1px solid #e2e8f0;}
        @media print{body{margin:0;}button{display:none;}}
      </style></head><body>
      <div class="inv">
        <div class="header">
          <div class="logo">🏠</div>
          <div class="co-name">New Tech Home Services</div>
          <div class="co-sub">Professional Pest Control & Cleaning</div>
          <div class="inv-no">INVOICE ${inv.invoiceNo||""}</div>
        </div>
        <div class="section">
          <div class="section-title">📋 Invoice Details</div>
          <div class="row"><span class="label">Invoice No</span><span class="val">${inv.invoiceNo||"—"}</span></div>
          <div class="row"><span class="label">Invoice Date</span><span class="val">${inv.invoiceDate||"—"}</span></div>
          <div class="row"><span class="label">Contract No</span><span class="val">${inv.contractNo||"—"}</span></div>
          <div class="row"><span class="label">Type</span><span class="val">${inv.invoiceType||"Non GST"}</span></div>
        </div>
        <div class="section">
          <div class="section-title">👤 Customer</div>
          <div class="row"><span class="label">Name</span><span class="val">${inv.customerName||customer?.name||"—"}</span></div>
          <div class="row"><span class="label">Mobile</span><span class="val">${inv.mobile||customer?.mobile||"—"}</span></div>
          <div class="row"><span class="label">Address</span><span class="val">${inv.address||"—"}</span></div>
          <div class="row"><span class="label">Customer ID</span><span class="val">${inv.customerId||customer?.customerId||"—"}</span></div>
        </div>
        <div class="section">
          <div class="section-title">🔧 Service</div>
          <div class="row"><span class="label">Department</span><span class="val">${inv.department||"—"}</span></div>
          <div class="row"><span class="label">Service</span><span class="val">${inv.serviceCategory||"—"}</span></div>
          <div class="row"><span class="label">Plan</span><span class="val">${inv.servicePlan||"—"}</span></div>
          <div class="row"><span class="label">No of Services</span><span class="val">${inv.noOfServices||"—"}</span></div>
          <div class="row"><span class="label">Contract</span><span class="val">${inv.contractStartDate||"—"} → ${inv.contractEndDate||"—"}</span></div>
          <div class="row"><span class="label">Technician</span><span class="val">${inv.technician||"—"}</span></div>
        </div>
        <div class="section">
          <div class="section-title">💰 Billing</div>
          <div class="row"><span class="label">Rate</span><span class="val">₹${Number(inv.rate||0).toLocaleString("en-IN")}</span></div>
          <div class="row"><span class="label">Discount</span><span class="val">₹${Number(inv.discount||0).toLocaleString("en-IN")}</span></div>
          <div class="row"><span class="label">Taxable Amount</span><span class="val">₹${Number(inv.taxableAmount||0).toLocaleString("en-IN")}</span></div>
          ${Number(inv.gstAmount)>0?`<div class="row"><span class="label">GST (${inv.gstPct||0}%)</span><span class="val">₹${Number(inv.gstAmount||0).toLocaleString("en-IN")}</span></div>`:""}
          <hr class="divider"/>
          <div class="row" style="font-weight:700;font-size:0.95rem;"><span>Total Invoice Amount</span><span>₹${Number(inv.totalInvoiceAmount||0).toLocaleString("en-IN")}</span></div>
        </div>
        <div class="total-box">
          <div class="total-label">TOTAL INVOICE AMOUNT</div>
          <div class="total-val">₹${Number(inv.totalInvoiceAmount||0).toLocaleString("en-IN")}</div>
        </div>
        ${Number(inv.amountReceived)>0?`<div class="paid-box"><div style="font-size:0.75rem;color:#15803d;">Amount Received</div><div style="font-weight:800;font-size:1.1rem;color:#15803d;">₹${Number(inv.amountReceived||0).toLocaleString("en-IN")}</div></div>`:""}
        ${Number(inv.balanceOutstanding)>0?`<div class="due-box"><div style="font-size:0.75rem;color:#dc2626;">Balance Outstanding</div><div style="font-weight:800;font-size:1.1rem;color:#dc2626;">₹${Number(inv.balanceOutstanding||0).toLocaleString("en-IN")}</div></div>`:""}
        <div style="text-align:center;margin-bottom:16px;">
          <span class="${Number(inv.balanceOutstanding)>0?"status-due":"status-paid"}">${inv.paymentStatus||"Pending"}</span>
        </div>
        <div class="footer">
          <div style="font-weight:700;margin-bottom:4px;">New Tech Home Services</div>
          <div>📞 +91 77188 98455 · ✉️ newtechpest01@gmail.com</div>
          <div style="margin-top:4px;">Thank you for choosing New Tech! 🏠</div>
        </div>
        <div style="text-align:center;margin-top:16px;">
          <button onclick="window.print()" style="background:#2563eb;color:#fff;border:none;padding:10px 28px;border-radius:8px;font-size:0.9rem;font-weight:700;cursor:pointer;">🖨️ Print / Save PDF</button>
        </div>
      </div></body></html>
    `);
    w.document.close();
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:600,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"92vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#1e40af,#2563eb)",padding:"16px 20px",borderRadius:"20px 20px 0 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:"1rem"}}>🧾 Invoice</div>
            <div style={{color:"rgba(255,255,255,0.75)",fontSize:"0.78rem",marginTop:2}}>{inv.invoiceNo}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={printInvoice} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",padding:"7px 14px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:"0.82rem"}}>
              🖨️ Print
            </button>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",padding:"7px 12px",borderRadius:8,cursor:"pointer",fontSize:"1rem"}}>✕</button>
          </div>
        </div>

        <div style={{padding:"16px 20px 32px"}}>
          {/* Company */}
          <div style={{textAlign:"center",padding:"16px 0",borderBottom:"1px dashed #e2e8f0",marginBottom:16}}>
            <div style={{fontSize:"1.5rem",marginBottom:4}}>🏠</div>
            <div style={{fontWeight:800,fontSize:"1rem",color:"#0f172a"}}>New Tech Home Services</div>
            <div style={{fontSize:"0.75rem",color:"#64748b",marginTop:2}}>Professional Pest Control & Cleaning</div>
            <div style={{fontSize:"0.72rem",color:"#94a3b8",marginTop:2}}>📞 77188 98455 · newtechpest01@gmail.com</div>
          </div>

          {/* Invoice meta */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            {[
              {label:"Invoice No",   val:inv.invoiceNo||"—"},
              {label:"Date",         val:inv.invoiceDate||"—"},
              {label:"Type",         val:inv.invoiceType||"Non GST"},
              {label:"Contract No",  val:inv.contractNo||"—"},
            ].map((r,i)=>(
              <div key={i} style={{background:"#f8fafc",borderRadius:8,padding:"8px 10px"}}>
                <div style={{fontSize:"0.68rem",color:"#94a3b8",marginBottom:2}}>{r.label}</div>
                <div style={{fontWeight:700,fontSize:"0.83rem",color:"#0f172a"}}>{r.val}</div>
              </div>
            ))}
          </div>

          {/* Customer */}
          <div style={{background:"#f8fafc",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:"0.7rem",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>👤 Bill To</div>
            <div style={{fontWeight:800,fontSize:"0.92rem",color:"#0f172a",marginBottom:4}}>{inv.customerName||customer?.name}</div>
            <div style={{fontSize:"0.78rem",color:"#64748b"}}>📱 {inv.mobile||customer?.mobile}</div>
            {inv.address && <div style={{fontSize:"0.78rem",color:"#64748b",marginTop:2}}>📍 {inv.address}</div>}
            {(inv.customerId||customer?.customerId) && <div style={{fontSize:"0.75rem",color:"#94a3b8",marginTop:4}}>ID: {inv.customerId||customer?.customerId}</div>}
          </div>

          {/* Service */}
          <div style={{background:"#f8fafc",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:"0.7rem",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>🔧 Service Details</div>
            {[
              {label:"Service",    val:inv.serviceCategory||"—"},
              {label:"Plan",       val:inv.servicePlan||"—"},
              {label:"Department", val:inv.department||"—"},
              {label:"No of Svcs", val:inv.noOfServices||"—"},
              {label:"Contract",   val:`${inv.contractStartDate||"—"} → ${inv.contractEndDate||"—"}`},
              {label:"Technician", val:inv.technician||"—"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #f1f5f9",fontSize:"0.82rem"}}>
                <span style={{color:"#64748b"}}>{r.label}</span>
                <span style={{fontWeight:600,color:"#0f172a",textAlign:"right",maxWidth:"60%"}}>{r.val}</span>
              </div>
            ))}
          </div>

          {/* Billing breakdown */}
          <div style={{background:"#f8fafc",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:"0.7rem",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>💰 Billing</div>
            {[
              {label:"Rate",           val:`₹${Number(inv.rate||0).toLocaleString("en-IN")}`},
              {label:"Discount",       val:`- ₹${Number(inv.discount||0).toLocaleString("en-IN")}`},
              {label:"Taxable Amount", val:`₹${Number(inv.taxableAmount||0).toLocaleString("en-IN")}`},
              ...(Number(inv.gstAmount)>0?[{label:`GST (${inv.gstPct||0}%)`, val:`₹${Number(inv.gstAmount||0).toLocaleString("en-IN")}`}]:[]),
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f1f5f9",fontSize:"0.83rem"}}>
                <span style={{color:"#64748b"}}>{r.label}</span>
                <span style={{fontWeight:600,color:"#0f172a"}}>{r.val}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{background:"#0f172a",borderRadius:12,padding:"14px 18px",marginBottom:12,textAlign:"center"}}>
            <div style={{color:"rgba(255,255,255,0.5)",fontSize:"0.72rem",marginBottom:4}}>TOTAL INVOICE AMOUNT</div>
            <div style={{color:"#fff",fontSize:"1.8rem",fontWeight:800}}>₹{Number(inv.totalInvoiceAmount||0).toLocaleString("en-IN")}</div>
          </div>

          {/* Paid / Due */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            <div style={{background:"#dcfce7",borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
              <div style={{fontSize:"0.7rem",color:"#15803d"}}>Amount Received</div>
              <div style={{fontWeight:800,color:"#15803d",fontSize:"1.1rem"}}>₹{Number(inv.amountReceived||0).toLocaleString("en-IN")}</div>
            </div>
            <div style={{background:Number(inv.balanceOutstanding)>0?"#fee2e2":"#dcfce7",borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
              <div style={{fontSize:"0.7rem",color:Number(inv.balanceOutstanding)>0?"#dc2626":"#15803d"}}>Balance</div>
              <div style={{fontWeight:800,color:Number(inv.balanceOutstanding)>0?"#dc2626":"#15803d",fontSize:"1.1rem"}}>₹{Number(inv.balanceOutstanding||0).toLocaleString("en-IN")}</div>
            </div>
          </div>

          {/* Status */}
          <div style={{textAlign:"center",marginBottom:16}}>
            <span style={{background:Number(inv.balanceOutstanding)>0?"#dc2626":"#059669",color:"#fff",padding:"6px 24px",borderRadius:20,fontWeight:700,fontSize:"0.85rem"}}>
              {Number(inv.balanceOutstanding)>0?"⏳ PAYMENT PENDING":"✅ FULLY PAID"}
            </span>
          </div>

          {/* Print button */}
          <button style={{...S.btn(),background:"#1e40af"}} onClick={printInvoice}>
            🖨️ Print Invoice / Save as PDF
          </button>

          {/* Footer */}
          <div style={{textAlign:"center",fontSize:"0.72rem",color:"#94a3b8",marginTop:14}}>
            Thank you for choosing New Tech Home Services! 🏠<br/>
            For queries: 📞 77188 98455
          </div>
        </div>
      </div>
    </div>
  );
}

// ── RECEIPT MODAL ─────────────────────────────────────
function ReceiptModal({ rec, customer, onClose }) {
  const receiptNo = `RCP-${rec.invoiceNo||Date.now()}`;

  const printReceipt = () => {
    const w = window.open("","_blank","width=380,height=600");
    w.document.write(`
      <html><head><title>Receipt ${receiptNo}</title>
      <style>
        body{font-family:'Plus Jakarta Sans',Arial,sans-serif;margin:0;padding:0;background:#fff;}
        .rec{max-width:340px;margin:0 auto;padding:20px;}
        .header{background:linear-gradient(135deg,#059669,#10b981);padding:18px;border-radius:12px;color:#fff;text-align:center;margin-bottom:18px;}
        .check{font-size:2.5rem;margin-bottom:6px;}
        .title{font-size:1.1rem;font-weight:800;}
        .sub{font-size:0.75rem;opacity:0.85;margin-top:2px;}
        .rec-no{background:rgba(255,255,255,0.2);border-radius:8px;padding:5px 14px;display:inline-block;font-size:0.82rem;font-weight:700;margin-top:8px;}
        .section{background:#f8fafc;border-radius:10px;padding:12px 14px;margin-bottom:12px;}
        .row{display:flex;justify-content:space-between;padding:4px 0;font-size:0.82rem;}
        .label{color:#64748b;}
        .val{font-weight:600;color:#0f172a;}
        .amt-box{background:#dcfce7;border:2px solid #bbf7d0;border-radius:12px;padding:14px;text-align:center;margin-bottom:12px;}
        .amt-label{font-size:0.72rem;color:#15803d;margin-bottom:4px;}
        .amt-val{font-size:1.8rem;font-weight:800;color:#15803d;}
        .footer{text-align:center;font-size:0.7rem;color:#94a3b8;margin-top:14px;border-top:1px dashed #e2e8f0;padding-top:12px;}
        @media print{button{display:none;}}
      </style></head><body>
      <div class="rec">
        <div class="header">
          <div class="check">✅</div>
          <div class="title">Payment Receipt</div>
          <div class="sub">New Tech Home Services</div>
          <div class="rec-no">${receiptNo}</div>
        </div>
        <div class="amt-box">
          <div class="amt-label">AMOUNT RECEIVED</div>
          <div class="amt-val">₹${Number(rec.receivedAmount||0).toLocaleString("en-IN")}</div>
        </div>
        <div class="section">
          <div class="row"><span class="label">Receipt No</span><span class="val">${receiptNo}</span></div>
          <div class="row"><span class="label">Receipt Date</span><span class="val">${rec.receiptDate||"—"}</span></div>
          <div class="row"><span class="label">Invoice No</span><span class="val">${rec.invoiceNo||"—"}</span></div>
          <div class="row"><span class="label">Payment Mode</span><span class="val">${rec.paymentMode||"—"}</span></div>
          ${rec.referenceNo?`<div class="row"><span class="label">Reference No</span><span class="val">${rec.referenceNo}</span></div>`:""}
          <div class="row"><span class="label">Cash Account</span><span class="val">${rec.cashAccount||"—"}</span></div>
        </div>
        <div class="section">
          <div class="row"><span class="label">Customer</span><span class="val">${rec.customerName||customer?.name||"—"}</span></div>
          <div class="row"><span class="label">Mobile</span><span class="val">${customer?.mobile||"—"}</span></div>
          <div class="row"><span class="label">Department</span><span class="val">${rec.department||"—"}</span></div>
          <div class="row"><span class="label">Invoice Amount</span><span class="val">₹${Number(rec.invoiceAmount||0).toLocaleString("en-IN")}</span></div>
          ${Number(rec.tdsAmount)>0?`<div class="row"><span class="label">TDS Deducted</span><span class="val">₹${Number(rec.tdsAmount).toLocaleString("en-IN")}</span></div>`:""}
          <div class="row" style="font-weight:700;border-top:1px solid #e2e8f0;margin-top:6px;padding-top:8px;"><span>Total Settled</span><span>₹${Number(rec.totalSettled||rec.receivedAmount||0).toLocaleString("en-IN")}</span></div>
        </div>
        <div style="text-align:center;margin-bottom:14px;">
          <span style="background:#059669;color:#fff;padding:6px 24px;border-radius:20px;font-weight:700;font-size:0.85rem;">✅ PAYMENT CONFIRMED</span>
        </div>
        <div class="footer">
          <div style="font-weight:700;margin-bottom:3px;">New Tech Home Services</div>
          <div>📞 +91 77188 98455</div>
          <div>✉️ newtechpest01@gmail.com</div>
          <div style="margin-top:6px;">This is a computer-generated receipt.</div>
        </div>
        <div style="text-align:center;margin-top:14px;">
          <button onclick="window.print()" style="background:#059669;color:#fff;border:none;padding:10px 28px;border-radius:8px;font-size:0.9rem;font-weight:700;cursor:pointer;">🖨️ Print / Save PDF</button>
        </div>
      </div></body></html>
    `);
    w.document.close();
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:600,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#059669,#10b981)",padding:"16px 20px",borderRadius:"20px 20px 0 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:"1rem"}}>✅ Payment Receipt</div>
            <div style={{color:"rgba(255,255,255,0.75)",fontSize:"0.78rem",marginTop:2}}>{receiptNo}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={printReceipt} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",padding:"7px 14px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:"0.82rem"}}>
              🖨️ Print
            </button>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",padding:"7px 12px",borderRadius:8,cursor:"pointer",fontSize:"1rem"}}>✕</button>
          </div>
        </div>

        <div style={{padding:"20px 20px 32px"}}>
          {/* Amount received big display */}
          <div style={{background:"linear-gradient(135deg,#dcfce7,#f0fdf4)",border:"2px solid #bbf7d0",borderRadius:14,padding:"18px",textAlign:"center",marginBottom:16}}>
            <div style={{fontSize:"2rem",marginBottom:4}}>✅</div>
            <div style={{fontSize:"0.78rem",color:"#15803d",fontWeight:600,marginBottom:4}}>AMOUNT RECEIVED</div>
            <div style={{fontSize:"2rem",fontWeight:800,color:"#059669"}}>₹{Number(rec.receivedAmount||0).toLocaleString("en-IN")}</div>
            <div style={{fontSize:"0.75rem",color:"#16a34a",marginTop:6}}>Payment Confirmed · {rec.receiptDate}</div>
          </div>

          {/* Receipt details */}
          <div style={{background:"#f8fafc",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:"0.7rem",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>📋 Receipt Details</div>
            {[
              {label:"Receipt No",    val:receiptNo},
              {label:"Receipt Date",  val:rec.receiptDate||"—"},
              {label:"Invoice No",    val:rec.invoiceNo||"—"},
              {label:"Payment Mode",  val:rec.paymentMode||"—"},
              ...(rec.referenceNo?[{label:"Reference No", val:rec.referenceNo}]:[]),
              {label:"Cash Account",  val:rec.cashAccount||"—"},
              {label:"Received By",   val:rec.receivedBy||"New Tech Team"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f1f5f9",fontSize:"0.82rem"}}>
                <span style={{color:"#64748b"}}>{r.label}</span>
                <span style={{fontWeight:600,color:"#0f172a"}}>{r.val}</span>
              </div>
            ))}
          </div>

          {/* Customer & payment */}
          <div style={{background:"#f8fafc",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:"0.7rem",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>👤 Customer & Payment</div>
            {[
              {label:"Customer",       val:rec.customerName||customer?.name||"—"},
              {label:"Mobile",         val:customer?.mobile||"—"},
              {label:"Department",     val:rec.department||"—"},
              {label:"Invoice Amount", val:`₹${Number(rec.invoiceAmount||0).toLocaleString("en-IN")}`},
              {label:"Amount Paid",    val:`₹${Number(rec.receivedAmount||0).toLocaleString("en-IN")}`},
              ...(Number(rec.tdsAmount)>0?[{label:"TDS", val:`₹${Number(rec.tdsAmount).toLocaleString("en-IN")}`}]:[]),
              {label:"Total Settled",  val:`₹${Number(rec.totalSettled||rec.receivedAmount||0).toLocaleString("en-IN")}`},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f1f5f9",fontSize:"0.82rem"}}>
                <span style={{color:"#64748b"}}>{r.label}</span>
                <span style={{fontWeight:600,color:"#0f172a"}}>{r.val}</span>
              </div>
            ))}
          </div>

          {/* Confirmed stamp */}
          <div style={{textAlign:"center",marginBottom:16}}>
            <span style={{background:"#059669",color:"#fff",padding:"7px 28px",borderRadius:20,fontWeight:700,fontSize:"0.88rem",letterSpacing:"0.03em"}}>
              ✅ PAYMENT CONFIRMED
            </span>
          </div>

          <button style={{...S.btn(),background:"#059669"}} onClick={printReceipt}>
            🖨️ Print Receipt / Save as PDF
          </button>

          <div style={{textAlign:"center",fontSize:"0.72rem",color:"#94a3b8",marginTop:14,lineHeight:1.6}}>
            New Tech Home Services · 📞 77188 98455<br/>
            This is a computer-generated receipt. No signature required.
          </div>
        </div>
      </div>
    </div>
  );
}
