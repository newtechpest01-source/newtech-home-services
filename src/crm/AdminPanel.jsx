import { useState, useEffect } from "react";

// ── Auth ─────────────────────────────────────────────
const ADMIN_CREDENTIALS = [
  { mobile:"9999999999", name:"Suraj Chettiar", role:"owner" },
  { mobile:"8104553496", name:"Ajit Salunke",   role:"manager" },
];

// ── Styles ────────────────────────────────────────────
const S = {
  app:    { fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", background:"#0f172a", minHeight:"100vh" },
  login:  { minHeight:"100vh", background:"linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  lBox:   { background:"#1e293b", borderRadius:20, padding:"36px 32px", width:"100%", maxWidth:400, border:"1px solid #334155" },
  // Header
  hdr:    { background:"#1e293b", borderBottom:"1px solid #334155", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 },
  // Sidebar
  side:   { width:240, background:"#1e293b", borderRight:"1px solid #334155", minHeight:"calc(100vh - 57px)", position:"fixed", top:57, left:0 },
  sItem:  (a) => ({ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", cursor:"pointer", color:a?"#60a5fa":"#94a3b8", background:a?"rgba(96,165,250,0.1)":"transparent", borderLeft:`3px solid ${a?"#60a5fa":"transparent"}`, fontSize:"0.88rem", fontWeight:a?700:500, transition:"all 0.15s" }),
  // Main
  main:   { marginLeft:240, padding:24, background:"#0f172a", minHeight:"calc(100vh - 57px)" },
  // Cards
  card:   { background:"#1e293b", border:"1px solid #334155", borderRadius:12, marginBottom:16, overflow:"hidden" },
  cardH:  (c) => ({ padding:"12px 18px", borderBottom:"1px solid #334155", display:"flex", alignItems:"center", justifyContent:"space-between", background:c||"#1e293b" }),
  cardB:  { padding:18 },
  // Stat
  stat:   (c) => ({ background:"#0f172a", border:`1px solid ${c}33`, borderTop:`3px solid ${c}`, borderRadius:12, padding:"16px 18px" }),
  // Table
  tbl:    { width:"100%", borderCollapse:"collapse", fontSize:"0.83rem" },
  th:     { padding:"10px 14px", textAlign:"left", fontSize:"0.7rem", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:"1px solid #334155", background:"#0f172a" },
  td:     { padding:"10px 14px", borderBottom:"1px solid #1e293b", color:"#e2e8f0", verticalAlign:"middle" },
  // Input
  inp:    { width:"100%", padding:"10px 14px", background:"#0f172a", border:"1.5px solid #334155", borderRadius:9, fontSize:"0.88rem", fontFamily:"inherit", color:"#e2e8f0", outline:"none", boxSizing:"border-box" },
  lbl:    { fontSize:"0.78rem", fontWeight:600, color:"#64748b", marginBottom:5, display:"block" },
  btn:    (bg,c) => ({ padding:"10px 18px", borderRadius:9, border:"none", background:bg||"#2563eb", color:c||"#fff", fontSize:"0.85rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"opacity 0.15s" }),
  badge:  (bg,c) => ({ background:bg, color:c, padding:"3px 10px", borderRadius:20, fontSize:"0.72rem", fontWeight:700, display:"inline-block" }),
};

const ROLE_COLORS = { owner:"#f59e0b", manager:"#22c55e", sales:"#3b82f6", technician:"#8b5cf6", crm:"#ec4899", accounts:"#14b8a6" };

const NAV = [
  { key:"dashboard",   icon:"📊", label:"Dashboard" },
  { key:"users",       icon:"👥", label:"User Management" },
  { key:"technicians", icon:"👷", label:"Technicians" },
  { key:"customers",   icon:"👤", label:"Customer Accounts" },
  { key:"system",      icon:"⚙️", label:"System Settings" },
  { key:"services",    icon:"🔧", label:"Service Config" },
  { key:"zones",       icon:"📍", label:"Zones & Areas" },
  { key:"logs",        icon:"📋", label:"Activity Logs" },
  { key:"backup",      icon:"💾", label:"Data & Backup" },
];

const today = () => new Date().toLocaleDateString("en-IN");
const nowTs  = () => new Date().toLocaleString("en-IN");

export default function AdminPanel() {
  const [screen,    setScreen]    = useState("login");
  const [mobile,    setMobile]    = useState("");
  const [otp,       setOtp]       = useState("");
  const [sentOtp,   setSentOtp]   = useState("");
  const [step,      setStep]      = useState(1);
  const [admin,     setAdmin]     = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [error,     setError]     = useState("");

  // CRM data
  const [crmUsers,     setCrmUsers]     = useState([]);
  const [technicians,  setTechnicians]  = useState([]);
  const [customers,    setCustomers]    = useState([]);
  const [services,     setServices]     = useState([]);
  const [invoices,     setInvoices]     = useState([]);
  const [complaints,   setComplaints]   = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  // Forms
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTechForm, setShowTechForm] = useState(false);
  const [editUser,     setEditUser]     = useState(null);
  const [editTech,     setEditTech]     = useState(null);

  // System settings
  const [settings, setSettings] = useState({
    companyName:    "New Tech Home Services",
    whatsapp:       "917718898455",
    email:          "newtechpest01@gmail.com",
    address:        "Mumbai, Maharashtra",
    gstNo:          "",
    financialStart: "11",
    notifD15:       true,
    notifD7:        true,
    notifD3:        true,
    notif12hr:      true,
    notif6hr:       true,
    autoGstEntry:   true,
    lowStockAlert:  true,
  });

  useEffect(() => {
    if(!admin) return;
    // Load all CRM data
    const load = (k) => JSON.parse(localStorage.getItem(k)||"[]");
    setCrmUsers(load("nt_crm_users") || getDefaultUsers());
    setTechnicians(load("nt_technicians") || getDefaultTechs());
    setCustomers(load("nt_customers"));
    setServices(load("nt_services"));
    setInvoices(load("nt_invoices"));
    setComplaints(load("nt_complaints"));
    setActivityLogs(load("nt_activity_logs") || []);
    const saved = localStorage.getItem("nt_settings");
    if(saved) setSettings(JSON.parse(saved));
  }, [admin]);

  const getDefaultUsers = () => [
    { id:"USR-001", name:"Suraj Chettiar",  mobile:"9999999999", role:"owner",      status:"Active",  lastLogin:"Today",   createdOn:"01/02/2026" },
    { id:"USR-002", name:"Sales Team",       mobile:"8591722846", role:"sales",      status:"Active",  lastLogin:"Today",   createdOn:"01/02/2026" },
    { id:"USR-003", name:"Sanjeet Varma",    mobile:"8898720011", role:"technician", status:"Active",  lastLogin:"Today",   createdOn:"01/02/2026" },
    { id:"USR-004", name:"Deepak Sonawane",  mobile:"9152560389", role:"technician", status:"Active",  lastLogin:"Today",   createdOn:"01/02/2026" },
    { id:"USR-005", name:"Ajit Salunke",     mobile:"8104553496", role:"manager",    status:"Active",  lastLogin:"Today",   createdOn:"01/02/2026" },
  ];

  const getDefaultTechs = () => [
    { id:"TECH-001", name:"Sanjeet Varma",   mobile:"8898720011", zone:"West",    skills:["General Pest","Bed Bug","Termite","Fogging"],        status:"Active",  joinDate:"01/02/2026", salary:"", idProof:"", address:"" },
    { id:"TECH-002", name:"Deepak Sonawane", mobile:"9152560389", zone:"Central", skills:["General Pest","Deep Cleaning","Termite","ULV Cold Fogging"], status:"Active", joinDate:"01/02/2026", salary:"", idProof:"", address:"" },
  ];

  const logActivity = (action, details) => {
    const log = { id:`LOG-${Date.now()}`, action, details, by:admin?.name, timestamp:nowTs(), role:admin?.role };
    const logs = JSON.parse(localStorage.getItem("nt_activity_logs")||"[]");
    const updated = [log, ...logs].slice(0,200);
    localStorage.setItem("nt_activity_logs", JSON.stringify(updated));
    setActivityLogs(updated);
  };

  const saveUsers = (list) => { localStorage.setItem("nt_crm_users", JSON.stringify(list)); setCrmUsers(list); };
  const saveTechs = (list) => { localStorage.setItem("nt_technicians", JSON.stringify(list)); setTechnicians(list); };
  const saveSettings = (s)  => { localStorage.setItem("nt_settings", JSON.stringify(s)); setSettings(s); };

  // Login
  const handleSendOTP = () => {
    const a = ADMIN_CREDENTIALS.find(a=>a.mobile===mobile.trim());
    if(!a) { setError("Not authorised. Admin access only."); return; }
    const code = Math.floor(100000+Math.random()*900000).toString();
    setSentOtp(code);
    setError("");
    const msg = `🔐 *New Tech Admin Panel*\n\nOTP: *${code}*\n\nValid 10 mins. Admin access only.\n– New Tech System`;
    window.open(`https://wa.me/91${mobile}?text=${encodeURIComponent(msg)}`,"_blank");
    setStep(2);
  };

  const handleVerify = () => {
    if(otp.trim()!==sentOtp) { setError("Invalid OTP"); return; }
    const a = ADMIN_CREDENTIALS.find(a=>a.mobile===mobile.trim());
    setAdmin(a);
    setScreen("app");
    setTimeout(()=>logActivity("Login","Admin logged in"),300);
  };

  if(screen==="login") return (
    <div style={S.login}>
      <div style={S.lBox}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:"2.5rem",marginBottom:8}}>🛡️</div>
          <div style={{color:"#fff",fontWeight:800,fontSize:"1.2rem"}}>Admin Control Panel</div>
          <div style={{color:"#64748b",fontSize:"0.82rem",marginTop:4}}>New Tech Home Services · Restricted Access</div>
        </div>
        {step===1 ? (<>
          <label style={S.lbl}>📱 Admin Mobile Number</label>
          <input style={{...S.inp,marginBottom:14}} type="tel" maxLength={10} placeholder="Registered admin number" value={mobile} onChange={e=>setMobile(e.target.value)} />
          {error && <div style={{color:"#ef4444",fontSize:"0.82rem",marginBottom:10}}>{error}</div>}
          <button style={{...S.btn(),width:"100%"}} onClick={handleSendOTP} disabled={mobile.length!==10}>
            📲 Send OTP on WhatsApp
          </button>
        </>) : (<>
          <div style={{background:"rgba(34,197,94,0.1)",border:"1px solid #22c55e44",borderRadius:9,padding:"10px 14px",fontSize:"0.82rem",color:"#22c55e",marginBottom:14}}>
            OTP sent to WhatsApp: +91 {mobile}
          </div>
          <label style={S.lbl}>🔐 Enter OTP</label>
          <input style={{...S.inp,fontSize:"1.4rem",letterSpacing:10,textAlign:"center",marginBottom:14}} type="number" placeholder="------" value={otp} onChange={e=>setOtp(e.target.value)} />
          {error && <div style={{color:"#ef4444",fontSize:"0.82rem",marginBottom:10}}>{error}</div>}
          <button style={{...S.btn(),width:"100%",marginBottom:8}} onClick={handleVerify} disabled={otp.length!==6}>✅ Verify & Enter</button>
          <button style={{...S.btn("#334155"),width:"100%"}} onClick={()=>{setStep(1);setOtp("");setError("");}}>← Back</button>
        </>)}
        <div style={{textAlign:"center",color:"#475569",fontSize:"0.72rem",marginTop:16}}>🔒 Owner & Manager access only</div>
      </div>
    </div>
  );

  // Metrics
  const totalCustomers  = customers.length;
  const activeServices  = services.filter(s=>s.status!=="Completed"&&s.status!=="Cancelled").length;
  const openComplaints  = complaints.filter(c=>c.status==="Open").length;
  const totalRevenue    = invoices.reduce((s,i)=>s+Number(i.totalInvoiceAmount||0),0);

  return (
    <div style={S.app}>
      {/* Header */}
      <div style={S.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:"1.4rem"}}>🛡️</span>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:"0.95rem"}}>Admin Control Panel</div>
            <div style={{color:"#64748b",fontSize:"0.7rem"}}>New Tech Home Services · {today()}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{textAlign:"right"}}>
            <div style={{color:"#fff",fontWeight:700,fontSize:"0.85rem"}}>{admin?.name}</div>
            <div style={{fontSize:"0.7rem",color:ROLE_COLORS[admin?.role]||"#94a3b8",fontWeight:600}}>{admin?.role?.toUpperCase()}</div>
          </div>
          <button onClick={()=>{logActivity("Logout","Admin logged out");setScreen("login");setAdmin(null);setStep(1);setMobile("");setOtp("");}}
            style={{...S.btn("#ef444420","#ef4444"),padding:"6px 12px",fontSize:"0.78rem"}}>🚪 Logout</button>
        </div>
      </div>

      <div style={{display:"flex"}}>
        {/* Sidebar */}
        <div style={S.side}>
          {NAV.map(n=>(
            <div key={n.key} style={S.sItem(activeTab===n.key)} onClick={()=>setActiveTab(n.key)}>
              <span style={{fontSize:"1rem"}}>{n.icon}</span>
              <span>{n.label}</span>
            </div>
          ))}
          <div style={{margin:"12px 16px",borderTop:"1px solid #334155",paddingTop:12}}>
            <a href="/crm/dashboard" style={{...S.sItem(false),textDecoration:"none",display:"flex"}}>
              <span style={{fontSize:"1rem"}}>📊</span><span>Open CRM</span>
            </a>
            <a href="/customer" style={{...S.sItem(false),textDecoration:"none",display:"flex"}}>
              <span style={{fontSize:"1rem"}}>👤</span><span>Customer Portal</span>
            </a>
            <a href="/technician" style={{...S.sItem(false),textDecoration:"none",display:"flex"}}>
              <span style={{fontSize:"1rem"}}>👷</span><span>Tech App</span>
            </a>
          </div>
        </div>

        {/* Main */}
        <div style={S.main}>

          {/* ══ DASHBOARD ══ */}
          {activeTab==="dashboard" && (
            <>
              <div style={{marginBottom:20}}>
                <div style={{color:"#fff",fontWeight:800,fontSize:"1.3rem"}}>Welcome, {admin?.name?.split(" ")[0]} 👋</div>
                <div style={{color:"#64748b",fontSize:"0.83rem",marginTop:3}}>Complete system overview — {today()}</div>
              </div>

              {/* KPI Stats */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:20}}>
                {[
                  {icon:"👥",label:"CRM Users",       val:crmUsers.length,      color:"#3b82f6"},
                  {icon:"👷",label:"Technicians",      val:technicians.length,   color:"#8b5cf6"},
                  {icon:"👤",label:"Customers",        val:totalCustomers,        color:"#22c55e"},
                  {icon:"📅",label:"Active Services",  val:activeServices,        color:"#f59e0b"},
                  {icon:"⚠️",label:"Open Complaints",  val:openComplaints,        color:"#ef4444"},
                  {icon:"💰",label:"Total Revenue",    val:`₹${totalRevenue.toLocaleString("en-IN")}`, color:"#10b981"},
                ].map((s,i)=>(
                  <div key={i} style={S.stat(s.color)}>
                    <div style={{fontSize:"1.3rem",marginBottom:6}}>{s.icon}</div>
                    <div style={{fontSize:"1.4rem",fontWeight:800,color:s.color}}>{s.val}</div>
                    <div style={{fontSize:"0.74rem",color:"#64748b",marginTop:2}}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Access */}
              <div style={S.card}>
                <div style={S.cardH()}><span style={{color:"#fff",fontWeight:700}}>⚡ Quick Actions</span></div>
                <div style={{...S.cardB,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
                  {[
                    {icon:"👥",label:"Add CRM User",    tab:"users",       color:"#3b82f6"},
                    {icon:"👷",label:"Add Technician",  tab:"technicians", color:"#8b5cf6"},
                    {icon:"⚙️",label:"System Settings", tab:"system",      color:"#f59e0b"},
                    {icon:"🔧",label:"Service Config",  tab:"services",    color:"#10b981"},
                    {icon:"📋",label:"Activity Logs",   tab:"logs",        color:"#64748b"},
                    {icon:"💾",label:"Backup Data",     tab:"backup",      color:"#ef4444"},
                  ].map((a,i)=>(
                    <div key={i} onClick={()=>setActiveTab(a.tab)}
                      style={{background:"#0f172a",border:`1px solid ${a.color}33`,borderRadius:10,padding:"14px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:"1.2rem"}}>{a.icon}</span>
                      <span style={{fontSize:"0.82rem",fontWeight:700,color:a.color}}>{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div style={S.card}>
                <div style={S.cardH()}><span style={{color:"#fff",fontWeight:700}}>📋 Recent Activity</span></div>
                <div style={S.cardB}>
                  {activityLogs.length===0 ? (
                    <div style={{color:"#475569",textAlign:"center",padding:20}}>No activity logged yet</div>
                  ) : activityLogs.slice(0,8).map((log,i)=>(
                    <div key={i} style={{display:"flex",gap:12,padding:"7px 0",borderBottom:"1px solid #1e293b",alignItems:"flex-start"}}>
                      <span style={{color:"#64748b",fontSize:"0.72rem",whiteSpace:"nowrap",marginTop:2}}>{log.timestamp}</span>
                      <span style={{fontSize:"0.82rem",color:"#e2e8f0",flex:1}}><strong style={{color:"#60a5fa"}}>{log.by}</strong> · {log.action} — {log.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ══ USER MANAGEMENT ══ */}
          {activeTab==="users" && (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div>
                  <div style={{color:"#fff",fontWeight:800,fontSize:"1.2rem"}}>👥 User Management</div>
                  <div style={{color:"#64748b",fontSize:"0.82rem",marginTop:3}}>Manage CRM login access, roles and permissions</div>
                </div>
                <button style={S.btn()} onClick={()=>{setEditUser(null);setShowUserForm(true);}}>➕ Add User</button>
              </div>

              {/* Role legend */}
              <div style={{...S.card,marginBottom:16}}>
                <div style={S.cardH()}><span style={{color:"#fff",fontWeight:700}}>🔑 Role Permissions</span></div>
                <div style={{...S.cardB,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                  {[
                    {role:"owner",      perms:"Full access — everything",                       color:"#f59e0b"},
                    {role:"manager",    perms:"Full access — everything",                       color:"#22c55e"},
                    {role:"sales",      perms:"Leads + Customers only",                        color:"#3b82f6"},
                    {role:"technician", perms:"Own jobs + Technician App",                     color:"#8b5cf6"},
                    {role:"crm",        perms:"Customers + Calendar + Complaints",             color:"#ec4899"},
                    {role:"accounts",   perms:"Accounts + Inventory only",                     color:"#14b8a6"},
                  ].map((r,i)=>(
                    <div key={i} style={{background:"#0f172a",borderRadius:9,padding:"10px 12px",border:`1px solid ${r.color}33`}}>
                      <span style={S.badge(`${r.color}22`,r.color)}>{r.role}</span>
                      <div style={{fontSize:"0.75rem",color:"#64748b",marginTop:6}}>{r.perms}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={S.card}>
                <div style={S.cardH()}><span style={{color:"#fff",fontWeight:700}}>All CRM Users ({crmUsers.length})</span></div>
                <table style={S.tbl}>
                  <thead><tr>
                    <th style={S.th}>User ID</th><th style={S.th}>Name</th><th style={S.th}>Mobile</th>
                    <th style={S.th}>Role</th><th style={S.th}>Status</th><th style={S.th}>Last Login</th>
                    <th style={S.th}>Created</th><th style={S.th}>Actions</th>
                  </tr></thead>
                  <tbody>
                    {crmUsers.map((u,i)=>(
                      <tr key={i}>
                        <td style={S.td}><span style={{fontFamily:"monospace",fontSize:"0.75rem",color:"#94a3b8"}}>{u.id}</span></td>
                        <td style={S.td}><div style={{fontWeight:700,color:"#fff"}}>{u.name}</div></td>
                        <td style={S.td}>{u.mobile}</td>
                        <td style={S.td}><span style={S.badge(`${ROLE_COLORS[u.role]||"#64748b"}22`,ROLE_COLORS[u.role]||"#64748b")}>{u.role}</span></td>
                        <td style={S.td}><span style={S.badge(u.status==="Active"?"#22c55e22":"#ef444422",u.status==="Active"?"#22c55e":"#ef4444")}>{u.status}</span></td>
                        <td style={S.td}><span style={{fontSize:"0.78rem",color:"#64748b"}}>{u.lastLogin||"—"}</span></td>
                        <td style={S.td}><span style={{fontSize:"0.78rem",color:"#64748b"}}>{u.createdOn}</span></td>
                        <td style={S.td}>
                          <div style={{display:"flex",gap:6}}>
                            <button style={{...S.btn("#3b82f620","#3b82f6"),padding:"5px 10px",fontSize:"0.75rem"}}
                              onClick={()=>{setEditUser(u);setShowUserForm(true);}}>✏️ Edit</button>
                            <button style={{...S.btn("#ef444420","#ef4444"),padding:"5px 10px",fontSize:"0.75rem"}}
                              onClick={()=>{
                                if(!window.confirm(`${u.status==="Active"?"Deactivate":"Activate"} ${u.name}?`)) return;
                                const updated=crmUsers.map(x=>x.id===u.id?{...x,status:x.status==="Active"?"Inactive":"Active"}:x);
                                saveUsers(updated);
                                logActivity("User Status Changed",`${u.name} set to ${u.status==="Active"?"Inactive":"Active"}`);
                              }}>
                              {u.status==="Active"?"🔴 Deactivate":"🟢 Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ══ TECHNICIANS ══ */}
          {activeTab==="technicians" && (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div>
                  <div style={{color:"#fff",fontWeight:800,fontSize:"1.2rem"}}>👷 Technician Management</div>
                  <div style={{color:"#64748b",fontSize:"0.82rem",marginTop:3}}>Manage field technicians, zones, skills and access</div>
                </div>
                <button style={S.btn()} onClick={()=>{setEditTech(null);setShowTechForm(true);}}>➕ Add Technician</button>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14,marginBottom:20}}>
                {technicians.map((t,i)=>(
                  <div key={i} style={{...S.card,marginBottom:0}}>
                    <div style={{padding:"16px 18px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                        <div style={{display:"flex",gap:12,alignItems:"center"}}>
                          <div style={{width:44,height:44,borderRadius:"50%",background:"#8b5cf620",border:"2px solid #8b5cf6",color:"#8b5cf6",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"1.1rem"}}>
                            {t.name?.charAt(0)}
                          </div>
                          <div>
                            <div style={{color:"#fff",fontWeight:800,fontSize:"0.95rem"}}>{t.name}</div>
                            <div style={{color:"#64748b",fontSize:"0.75rem",marginTop:1}}>📱 {t.mobile}</div>
                          </div>
                        </div>
                        <span style={S.badge(t.status==="Active"?"#22c55e22":"#ef444422",t.status==="Active"?"#22c55e":"#ef4444")}>{t.status}</span>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                        {[
                          {label:"Tech ID",   val:t.id},
                          {label:"Zone",      val:t.zone||"—"},
                          {label:"Joined",    val:t.joinDate||"—"},
                          {label:"Address",   val:t.address||"—"},
                        ].map((r,j)=>(
                          <div key={j} style={{background:"#0f172a",borderRadius:7,padding:"6px 9px"}}>
                            <div style={{fontSize:"0.65rem",color:"#475569"}}>{r.label}</div>
                            <div style={{fontSize:"0.78rem",color:"#94a3b8",fontWeight:600,marginTop:1}}>{r.val}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:"0.68rem",color:"#64748b",marginBottom:5}}>SKILLS</div>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                          {(t.skills||[]).map(sk=>(
                            <span key={sk} style={{background:"#8b5cf620",color:"#a78bfa",fontSize:"0.7rem",padding:"2px 8px",borderRadius:5,fontWeight:600}}>{sk}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button style={{...S.btn("#3b82f620","#3b82f6"),flex:1,fontSize:"0.78rem"}}
                          onClick={()=>{setEditTech(t);setShowTechForm(true);}}>✏️ Edit</button>
                        <button style={{...S.btn(t.status==="Active"?"#ef444420":"#22c55e20",t.status==="Active"?"#ef4444":"#22c55e"),flex:1,fontSize:"0.78rem"}}
                          onClick={()=>{
                            const updated=technicians.map(x=>x.id===t.id?{...x,status:x.status==="Active"?"Inactive":"Active"}:x);
                            saveTechs(updated);
                            logActivity("Technician Status",`${t.name} → ${t.status==="Active"?"Inactive":"Active"}`);
                          }}>
                          {t.status==="Active"?"🔴 Deactivate":"🟢 Activate"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ══ CUSTOMER ACCOUNTS ══ */}
          {activeTab==="customers" && (
            <>
              <div style={{color:"#fff",fontWeight:800,fontSize:"1.2rem",marginBottom:4}}>👤 Customer Accounts</div>
              <div style={{color:"#64748b",fontSize:"0.82rem",marginBottom:20}}>All registered customers with portal access status</div>
              <div style={S.card}>
                <div style={S.cardH()}><span style={{color:"#fff",fontWeight:700}}>Customers ({customers.length})</span></div>
                {customers.length===0 ? (
                  <div style={{padding:40,textAlign:"center",color:"#475569"}}>No customers in system yet. Add via CRM → Customers module.</div>
                ) : (
                  <div style={{overflowX:"auto"}}>
                    <table style={S.tbl}>
                      <thead><tr>
                        <th style={S.th}>Customer ID</th><th style={S.th}>Name</th><th style={S.th}>Mobile</th>
                        <th style={S.th}>Service</th><th style={S.th}>Status</th><th style={S.th}>Portal Access</th>
                      </tr></thead>
                      <tbody>
                        {customers.map((c,i)=>(
                          <tr key={i}>
                            <td style={S.td}><span style={{fontFamily:"monospace",fontSize:"0.75rem",color:"#94a3b8"}}>{c.customerId}</span></td>
                            <td style={S.td}><div style={{fontWeight:700,color:"#fff"}}>{c.name||c.customerName}</div></td>
                            <td style={S.td}>{c.mobile}</td>
                            <td style={S.td}><span style={{fontSize:"0.78rem",color:"#94a3b8"}}>{c.treatment||"—"}</span></td>
                            <td style={S.td}><span style={S.badge(c.status==="Active"?"#22c55e22":"#ef444422",c.status==="Active"?"#22c55e":"#ef4444")}>{c.status||"Active"}</span></td>
                            <td style={S.td}><span style={S.badge("#3b82f620","#3b82f6")}>WhatsApp OTP</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ══ SYSTEM SETTINGS ══ */}
          {activeTab==="system" && (
            <>
              <div style={{color:"#fff",fontWeight:800,fontSize:"1.2rem",marginBottom:4}}>⚙️ System Settings</div>
              <div style={{color:"#64748b",fontSize:"0.82rem",marginBottom:20}}>Company info, notification rules, automation settings</div>

              {/* Company Info */}
              <div style={S.card}>
                <div style={S.cardH()}><span style={{color:"#fff",fontWeight:700}}>🏢 Company Information</span></div>
                <div style={S.cardB}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {[
                      {label:"Company Name",     key:"companyName"},
                      {label:"WhatsApp Number",  key:"whatsapp"},
                      {label:"Email",            key:"email"},
                      {label:"Address",          key:"address"},
                      {label:"GST Number",       key:"gstNo"},
                      {label:"Financial Month Start (day)", key:"financialStart"},
                    ].map(f=>(
                      <div key={f.key}>
                        <label style={S.lbl}>{f.label}</label>
                        <input style={S.inp} value={settings[f.key]||""} onChange={e=>setSettings(p=>({...p,[f.key]:e.target.value}))} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notification Rules */}
              <div style={S.card}>
                <div style={S.cardH()}><span style={{color:"#fff",fontWeight:700}}>🔔 Zero-Miss Notification Rules</span></div>
                <div style={S.cardB}>
                  {[
                    {label:"D-15 WhatsApp Reminder",          key:"notifD15",     desc:"Send reminder 15 days before service"},
                    {label:"D-7 WhatsApp Reminder",           key:"notifD7",      desc:"Send reminder 7 days before service"},
                    {label:"D-3 Urgent Reminder",             key:"notifD3",      desc:"3-day alert — escalate to manager if no response"},
                    {label:"12Hr Before — Technician Intro",  key:"notif12hr",    desc:"Send tech name + time morning of service"},
                    {label:"6Hr Before — On the Way",         key:"notif6hr",     desc:"Confirm technician is heading to customer"},
                    {label:"Auto GST Entry on Invoice",       key:"autoGstEntry", desc:"Auto-create GST register entry on GST invoices"},
                    {label:"Low Stock Alert",                 key:"lowStockAlert",desc:"Alert when chemical stock falls below minimum"},
                  ].map(f=>(
                    <div key={f.key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #334155"}}>
                      <div>
                        <div style={{color:"#e2e8f0",fontWeight:600,fontSize:"0.85rem"}}>{f.label}</div>
                        <div style={{color:"#64748b",fontSize:"0.75rem",marginTop:2}}>{f.desc}</div>
                      </div>
                      <div onClick={()=>setSettings(p=>({...p,[f.key]:!p[f.key]}))}
                        style={{width:44,height:24,borderRadius:12,background:settings[f.key]?"#2563eb":"#334155",position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>
                        <div style={{position:"absolute",top:2,left:settings[f.key]?20:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button style={{...S.btn(),padding:"12px 24px"}} onClick={()=>{saveSettings(settings);logActivity("Settings Saved","System settings updated");alert("✅ Settings saved!");}}>
                💾 Save All Settings
              </button>
            </>
          )}

          {/* ══ SERVICE CONFIG ══ */}
          {activeTab==="services" && (
            <>
              <div style={{color:"#fff",fontWeight:800,fontSize:"1.2rem",marginBottom:4}}>🔧 Service Configuration</div>
              <div style={{color:"#64748b",fontSize:"0.82rem",marginBottom:20}}>Service types, pricing, plans — edit in serviceCatalog.js</div>
              <div style={S.card}>
                <div style={S.cardH()}><span style={{color:"#fff",fontWeight:700}}>📋 Active Service Categories</span></div>
                <div style={S.cardB}>
                  {[
                    {cat:"Pest Control",  svcs:["General Pest Control","Bed Bug Treatment","Termite Treatment","Mosquito Control","Rodent Control","Tick Control","Honey Bee Removal","Society Pest Control"]},
                    {cat:"Cleaning",      svcs:["Deep Cleaning (Furnished)","Deep Cleaning (Unfurnished)","Kitchen Deep Cleaning","Sofa & Carpet Cleaning"]},
                  ].map((g,i)=>(
                    <div key={i} style={{marginBottom:16}}>
                      <div style={{color:"#60a5fa",fontWeight:700,fontSize:"0.82rem",marginBottom:8}}>🔹 {g.cat}</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {g.svcs.map(s=><span key={s} style={{background:"#3b82f620",color:"#93c5fd",padding:"4px 10px",borderRadius:6,fontSize:"0.78rem",fontWeight:600}}>{s}</span>)}
                      </div>
                    </div>
                  ))}
                  <div style={{background:"#0f172a",borderRadius:9,padding:"12px 14px",marginTop:10,fontSize:"0.8rem",color:"#64748b"}}>
                    💡 To edit services, plans and pricing — update <code style={{color:"#f59e0b"}}>src/crm/serviceCatalog.js</code> directly.
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══ ZONES & AREAS ══ */}
          {activeTab==="zones" && (
            <>
              <div style={{color:"#fff",fontWeight:800,fontSize:"1.2rem",marginBottom:4}}>📍 Zones & Service Areas</div>
              <div style={{color:"#64748b",fontSize:"0.82rem",marginBottom:20}}>Mumbai service coverage zones assigned to technicians</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {[
                  {zone:"West",    tech:"Sanjeet Varma",   areas:["Andheri West","Juhu","Vile Parle","Santacruz","Bandra","Khar","Versova"],         color:"#3b82f6"},
                  {zone:"Central", tech:"Deepak Sonawane", areas:["Andheri East","Kurla","Ghatkopar","Vikhroli","Mulund","Bhandup","Kanjurmarg"],    color:"#8b5cf6"},
                  {zone:"South",   tech:"Unassigned",      areas:["Dadar","Matunga","Sion","Chunabhatti","Chembur","Wadala","Mahim"],                color:"#f59e0b"},
                  {zone:"North",   tech:"Unassigned",      areas:["Malad","Goregaon","Kandivali","Borivali","Dahisar","Mira Road","Bhayander"],      color:"#10b981"},
                ].map((z,i)=>(
                  <div key={i} style={{...S.card,marginBottom:0}}>
                    <div style={{padding:"14px 16px",borderBottom:"1px solid #334155",display:"flex",justifyContent:"space-between"}}>
                      <span style={{color:"#fff",fontWeight:700}}>📍 Zone {z.zone}</span>
                      <span style={S.badge(`${z.color}22`,z.color)}>{z.tech}</span>
                    </div>
                    <div style={{padding:"12px 16px"}}>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                        {z.areas.map(a=><span key={a} style={{background:"#0f172a",color:"#94a3b8",fontSize:"0.72rem",padding:"3px 8px",borderRadius:5}}>{a}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ══ ACTIVITY LOGS ══ */}
          {activeTab==="logs" && (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div>
                  <div style={{color:"#fff",fontWeight:800,fontSize:"1.2rem"}}>📋 Activity Logs</div>
                  <div style={{color:"#64748b",fontSize:"0.82rem",marginTop:3}}>All admin and system actions with timestamps</div>
                </div>
                <button style={{...S.btn("#ef444420","#ef4444"),fontSize:"0.8rem"}}
                  onClick={()=>{if(window.confirm("Clear all logs?")){localStorage.removeItem("nt_activity_logs");setActivityLogs([]);}}}>
                  🗑️ Clear Logs
                </button>
              </div>
              <div style={S.card}>
                <table style={S.tbl}>
                  <thead><tr>
                    <th style={S.th}>Timestamp</th><th style={S.th}>Action</th><th style={S.th}>Details</th><th style={S.th}>By</th><th style={S.th}>Role</th>
                  </tr></thead>
                  <tbody>
                    {activityLogs.length===0 ? (
                      <tr><td colSpan={5} style={{...S.td,textAlign:"center",color:"#475569",padding:30}}>No logs yet</td></tr>
                    ) : activityLogs.map((log,i)=>(
                      <tr key={i}>
                        <td style={{...S.td,fontSize:"0.75rem",color:"#64748b",whiteSpace:"nowrap"}}>{log.timestamp}</td>
                        <td style={{...S.td,fontWeight:700,color:"#60a5fa"}}>{log.action}</td>
                        <td style={{...S.td,color:"#94a3b8",fontSize:"0.82rem"}}>{log.details}</td>
                        <td style={{...S.td,fontWeight:600,color:"#fff"}}>{log.by}</td>
                        <td style={S.td}><span style={S.badge(`${ROLE_COLORS[log.role]||"#64748b"}22`,ROLE_COLORS[log.role]||"#64748b")}>{log.role}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ══ BACKUP ══ */}
          {activeTab==="backup" && (
            <>
              <div style={{color:"#fff",fontWeight:800,fontSize:"1.2rem",marginBottom:4}}>💾 Data & Backup</div>
              <div style={{color:"#64748b",fontSize:"0.82rem",marginBottom:20}}>Export, backup and restore all CRM data</div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14,marginBottom:20}}>
                {[
                  {icon:"👥",label:"CRM Users",    key:"nt_crm_users"},
                  {icon:"👷",label:"Technicians",  key:"nt_technicians"},
                  {icon:"👤",label:"Customers",    key:"nt_customers"},
                  {icon:"📅",label:"Services",     key:"nt_services"},
                  {icon:"🧾",label:"Invoices",     key:"nt_invoices"},
                  {icon:"💸",label:"Expenses",     key:"nt_expenses"},
                  {icon:"📦",label:"Inventory",    key:"nt_stock_v2"},
                  {icon:"⚠️",label:"Complaints",   key:"nt_complaints"},
                ].map((d,i)=>{
                  const data = JSON.parse(localStorage.getItem(d.key)||"[]");
                  return (
                    <div key={i} style={{...S.card,marginBottom:0}}>
                      <div style={{padding:"14px 16px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                          <span style={{fontSize:"1.2rem"}}>{d.icon}</span>
                          <span style={{fontSize:"0.8rem",color:"#64748b"}}>{Array.isArray(data)?data.length:0} records</span>
                        </div>
                        <div style={{color:"#fff",fontWeight:700,fontSize:"0.88rem",marginBottom:10}}>{d.label}</div>
                        <button style={{...S.btn("#3b82f620","#3b82f6"),width:"100%",fontSize:"0.78rem"}}
                          onClick={()=>{
                            const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
                            const url=URL.createObjectURL(blob);
                            const a=document.createElement("a");
                            a.href=url;a.download=`NewTech_${d.label}_${today().replace(/\//g,"-")}.json`;
                            a.click();URL.revokeObjectURL(url);
                            logActivity("Data Export",`${d.label} exported`);
                          }}>
                          📥 Export JSON
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={S.card}>
                <div style={S.cardH()}><span style={{color:"#fff",fontWeight:700}}>📥 Export All Data</span></div>
                <div style={S.cardB}>
                  <button style={{...S.btn("#10b98120","#10b981"),marginBottom:10,display:"block",width:"100%"}}
                    onClick={()=>{
                      const all={};
                      ["nt_crm_users","nt_technicians","nt_customers","nt_services","nt_invoices","nt_receipts","nt_expenses","nt_petty","nt_purchases","nt_transfers","nt_gst","nt_complaints","nt_stock_v2","nt_allocations","nt_assets","nt_repairs","nt_settings","nt_activity_logs"].forEach(k=>{
                        const v=localStorage.getItem(k); if(v) all[k]=JSON.parse(v);
                      });
                      const blob=new Blob([JSON.stringify(all,null,2)],{type:"application/json"});
                      const url=URL.createObjectURL(blob);
                      const a=document.createElement("a");
                      a.href=url;a.download=`NewTech_FULL_BACKUP_${today().replace(/\//g,"-")}.json`;
                      a.click();URL.revokeObjectURL(url);
                      logActivity("Full Backup","Complete system backup exported");
                    }}>
                    💾 Export Complete Backup (All Data)
                  </button>
                  <div style={{fontSize:"0.78rem",color:"#64748b"}}>⚠️ Store backup safely. Contains all CRM, customer, financial and system data.</div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* ── ADD/EDIT USER FORM ── */}
      {showUserForm && (
        <UserForm
          user={editUser}
          onClose={()=>{setShowUserForm(false);setEditUser(null);}}
          onSave={(u)=>{
            let updated;
            if(editUser) {
              updated = crmUsers.map(x=>x.id===editUser.id?{...x,...u}:x);
              logActivity("User Updated",`${u.name} role:${u.role}`);
            } else {
              const newUser={...u,id:`USR-${String(crmUsers.length+1).padStart(3,"0")}`,createdOn:today(),status:"Active",lastLogin:"Never"};
              updated=[...crmUsers,newUser];
              logActivity("User Created",`${u.name} (${u.mobile}) role:${u.role}`);
            }
            saveUsers(updated);
            setShowUserForm(false);setEditUser(null);
          }}
        />
      )}

      {/* ── ADD/EDIT TECHNICIAN FORM ── */}
      {showTechForm && (
        <TechForm
          tech={editTech}
          onClose={()=>{setShowTechForm(false);setEditTech(null);}}
          onSave={(t)=>{
            let updated;
            if(editTech) {
              updated=technicians.map(x=>x.id===editTech.id?{...x,...t}:x);
              logActivity("Technician Updated",`${t.name}`);
            } else {
              const nt={...t,id:`TECH-${String(technicians.length+1).padStart(3,"0")}`,joinDate:today(),status:"Active"};
              updated=[...technicians,nt];
              logActivity("Technician Added",`${t.name} Zone:${t.zone}`);
              // Also add to CRM users
              const cu=JSON.parse(localStorage.getItem("nt_crm_users")||"[]");
              const exists=cu.find(u=>u.mobile===t.mobile);
              if(!exists){
                const nu={id:`USR-${String(cu.length+1).padStart(3,"0")}`,name:t.name,mobile:t.mobile,role:"technician",status:"Active",lastLogin:"Never",createdOn:today()};
                localStorage.setItem("nt_crm_users",JSON.stringify([...cu,nu]));
                setCrmUsers([...cu,nu]);
              }
            }
            saveTechs(updated);
            setShowTechForm(false);setEditTech(null);
          }}
        />
      )}
    </div>
  );
}

// ── USER FORM ─────────────────────────────────────────
function UserForm({ user, onClose, onSave }) {
  const [f, setF] = useState({ name:user?.name||"", mobile:user?.mobile||"", role:user?.role||"sales" });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <Modal title={user?"✏️ Edit User":"➕ Add CRM User"} onClose={onClose} onSave={()=>{if(!f.name||!f.mobile){alert("Name and mobile required");return;}onSave(f);}}>
      <div style={{marginBottom:12}}>
        <label style={S.lbl}>Full Name *</label>
        <input style={S.inp} value={f.name} onChange={e=>s("name",e.target.value)} placeholder="Full name" />
      </div>
      <div style={{marginBottom:12}}>
        <label style={S.lbl}>Mobile Number *</label>
        <input style={S.inp} type="tel" value={f.mobile} onChange={e=>s("mobile",e.target.value)} placeholder="10-digit mobile — used for OTP login" />
      </div>
      <div style={{marginBottom:12}}>
        <label style={S.lbl}>Role *</label>
        <select style={S.inp} value={f.role} onChange={e=>s("role",e.target.value)}>
          {["owner","manager","sales","technician","crm","accounts"].map(r=><option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div style={{background:"#0f172a",borderRadius:9,padding:"10px 14px",fontSize:"0.78rem",color:"#64748b"}}>
        ℹ️ Login is via WhatsApp OTP — no password needed. Mobile number is the login credential.
      </div>
    </Modal>
  );
}

// ── TECHNICIAN FORM ───────────────────────────────────
const ALL_SKILLS = ["General Pest Control","Bed Bug Treatment","Termite Treatment","Mosquito Control","Rodent Control","Fogging","ULV Cold Fogging","Deep Cleaning","Kitchen Cleaning","Sofa Cleaning"];
const ZONES      = ["West","Central","North","South","East","Navi Mumbai","Thane"];

function TechForm({ tech, onClose, onSave }) {
  const [f, setF] = useState({
    name:    tech?.name    ||"",
    mobile:  tech?.mobile  ||"",
    zone:    tech?.zone    ||"West",
    address: tech?.address ||"",
    skills:  tech?.skills  ||[],
    idProof: tech?.idProof ||"",
    salary:  tech?.salary  ||"",
    notes:   tech?.notes   ||"",
  });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  const toggleSkill = (sk) => setF(p=>({...p,skills:p.skills.includes(sk)?p.skills.filter(x=>x!==sk):[...p.skills,sk]}));

  return (
    <Modal title={tech?"✏️ Edit Technician":"➕ Add Technician"} onClose={onClose} onSave={()=>{if(!f.name||!f.mobile){alert("Name and mobile required");return;}onSave(f);}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <div>
          <label style={S.lbl}>Full Name *</label>
          <input style={S.inp} value={f.name} onChange={e=>s("name",e.target.value)} />
        </div>
        <div>
          <label style={S.lbl}>Mobile Number *</label>
          <input style={S.inp} type="tel" value={f.mobile} onChange={e=>s("mobile",e.target.value)} />
        </div>
        <div>
          <label style={S.lbl}>Zone *</label>
          <select style={S.inp} value={f.zone} onChange={e=>s("zone",e.target.value)}>
            {ZONES.map(z=><option key={z}>{z}</option>)}
          </select>
        </div>
        <div>
          <label style={S.lbl}>ID Proof No</label>
          <input style={S.inp} value={f.idProof} onChange={e=>s("idProof",e.target.value)} placeholder="Aadhaar / PAN" />
        </div>
        <div>
          <label style={S.lbl}>Monthly Salary (₹)</label>
          <input style={S.inp} type="number" value={f.salary} onChange={e=>s("salary",e.target.value)} />
        </div>
        <div>
          <label style={S.lbl}>Address</label>
          <input style={S.inp} value={f.address} onChange={e=>s("address",e.target.value)} />
        </div>
      </div>
      <div style={{marginBottom:12}}>
        <label style={S.lbl}>Skills (select all that apply)</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {ALL_SKILLS.map(sk=>(
            <button key={sk} type="button" onClick={()=>toggleSkill(sk)}
              style={{padding:"5px 10px",border:`1.5px solid ${f.skills.includes(sk)?"#8b5cf6":"#334155"}`,borderRadius:20,background:f.skills.includes(sk)?"#8b5cf620":"transparent",color:f.skills.includes(sk)?"#a78bfa":"#64748b",fontSize:"0.75rem",cursor:"pointer",fontFamily:"inherit"}}>
              {sk}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={S.lbl}>Notes</label>
        <textarea style={{...S.inp,minHeight:60,resize:"vertical"}} value={f.notes} onChange={e=>s("notes",e.target.value)} placeholder="Any special notes..." />
      </div>
    </Modal>
  );
}

// ── MODAL ─────────────────────────────────────────────
function Modal({ title, onClose, onSave, children }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:16,width:"100%",maxWidth:560,maxHeight:"90vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #334155",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:"#fff",fontWeight:700,fontSize:"1rem"}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",fontSize:"1.1rem",cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:"20px"}}>{children}</div>
        <div style={{padding:"14px 20px",borderTop:"1px solid #334155",display:"flex",justifyContent:"flex-end",gap:10}}>
          <button style={{...S.btn("#334155"),padding:"9px 20px"}} onClick={onClose}>Cancel</button>
          <button style={{...S.btn(),padding:"9px 20px"}} onClick={onSave}>💾 Save</button>
        </div>
      </div>
    </div>
  );
}
