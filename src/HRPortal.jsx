import { useState, useEffect } from "react";

// ── Constants ─────────────────────────────────────────
const COMPANY = "New Tech Home Services";
const OT_RATES = { backoffice: 45, pestcontrol: 45, deepcleaning: 50 };
const NIGHT_RATES = { swati: 400, chinagate: 500, both: 700 };
const PAID_LEAVES_PER_YEAR = 8;

const DEPARTMENTS = [
  "CRM (Customer Relationship Management)",
  "Sales",
  "Marketing",
  "Social Media Marketing",
  "Accounts",
  "Inventory & Store",
  "Housekeeping Technicians",
  "Pest Control Technicians",
  "HR",
  "Management",
  "Other",
];

// Designations are fully flexible — user can type custom or pick from suggestions
const DESIGNATION_SUGGESTIONS = [
  // Entry Level
  "Trainee","Intern","Helper","Assistant",
  // Technicians
  "Technician","Senior Technician","Lead Technician","Technician Supervisor",
  // Operations
  "Field Executive","Operations Executive","Operations Manager",
  // Sales & Marketing
  "Sales Executive","Senior Sales Executive","Sales Manager","Marketing Executive","Marketing Manager","Digital Marketing Executive","Social Media Executive","Social Media Manager",
  // CRM
  "CRM Executive","CRM Manager","Customer Support Executive","Customer Relations Manager",
  // Accounts & Store
  "Accounts Executive","Accountant","Senior Accountant","Store Keeper","Store Manager","Inventory Executive",
  // HR
  "HR Executive","HR Manager","HR Assistant",
  // Management
  "Team Leader","Supervisor","Assistant Manager","Manager","Senior Manager","General Manager","Director","Owner",
  // Custom
  "Other (Custom)",
];

const SALARY_MODES = ["Cash", "GPay", "Online Transfer", "Cheque"];
const SHIFTS = ["Morning (9:30-18:30)", "Afternoon (14:00-23:00)", "Night (22:00-07:00)"];

// Sample employees
const SAMPLE_EMPLOYEES = [
  { id:"EMP-001", name:"Sanjeet Varma",   mobile:"8898720011", dept:"Pest Control Technicians",  designation:"Senior Technician", salary:15000, joinDate:"01/02/2026", status:"Active", weeklyOff:"Tuesday", salaryMode:"GPay",  paidLeavesUsed:0, advances:[], bankName:"SBI", accountNo:"", ifsc:"", branch:"Andheri" },
  { id:"EMP-002", name:"Deepak Sonawane", mobile:"9152560389", dept:"Housekeeping Technicians",   designation:"Technician",        salary:12000, joinDate:"01/02/2026", status:"Active", weeklyOff:"Tuesday", salaryMode:"Cash",  paidLeavesUsed:0, advances:[], bankName:"",    accountNo:"", ifsc:"", branch:"" },
  { id:"EMP-003", name:"Ajit Salunke",    mobile:"8104553496", dept:"Management",                 designation:"Manager",           salary:25000, joinDate:"01/05/2022", status:"Active", weeklyOff:"Tuesday", salaryMode:"Online Transfer", paidLeavesUsed:0, advances:[], bankName:"HDFC", accountNo:"", ifsc:"", branch:"Vile Parle" },
];

// ── Styles ─────────────────────────────────────────────
const C = {
  bg:       "#0a0e1a",
  surface:  "#111827",
  card:     "#1a2235",
  border:   "#1e2d45",
  accent:   "#3b82f6",
  accent2:  "#10b981",
  accent3:  "#f59e0b",
  danger:   "#ef4444",
  purple:   "#8b5cf6",
  text:     "#f1f5f9",
  muted:    "#64748b",
  sub:      "#94a3b8",
};

const S = {
  app:    { fontFamily:"'DM Sans',system-ui,sans-serif", background:C.bg, minHeight:"100vh", color:C.text },
  // Login
  loginBg:{ minHeight:"100vh", background:`linear-gradient(135deg,${C.bg} 0%,#0d1b2e 60%,#091520 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  loginBox:{ background:C.surface, borderRadius:20, padding:"40px 36px", width:"100%", maxWidth:420, border:`1px solid ${C.border}`, boxShadow:"0 32px 80px rgba(0,0,0,0.6)" },
  // Header
  hdr:    { background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 },
  // Sidebar
  side:   { width:220, background:C.surface, borderRight:`1px solid ${C.border}`, minHeight:"calc(100vh - 57px)", position:"fixed", top:57, left:0, overflowY:"auto" },
  sItem:  (a) => ({ display:"flex", alignItems:"center", gap:10, padding:"9px 16px", cursor:"pointer", color:a?C.accent:C.sub, background:a?`${C.accent}15`:"transparent", borderLeft:`2px solid ${a?C.accent:"transparent"}`, fontSize:"0.84rem", fontWeight:a?700:400, transition:"all 0.15s" }),
  // Main
  main:   { marginLeft:220, padding:24, background:C.bg, minHeight:"calc(100vh - 57px)" },
  // Cards
  card:   { background:C.card, border:`1px solid ${C.border}`, borderRadius:12, marginBottom:16, overflow:"hidden" },
  cardH:  (c) => ({ padding:"12px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:c||C.card }),
  cardB:  { padding:18 },
  // Stat
  stat:   (c) => ({ background:C.card, border:`1px solid ${c}44`, borderTop:`3px solid ${c}`, borderRadius:12, padding:"16px 18px" }),
  // Table
  tbl:    { width:"100%", borderCollapse:"collapse", fontSize:"0.82rem" },
  th:     { padding:"10px 14px", textAlign:"left", fontSize:"0.68rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:`1px solid ${C.border}`, background:C.bg },
  td:     { padding:"10px 14px", borderBottom:`1px solid ${C.border}22`, color:C.sub, verticalAlign:"middle" },
  // Input
  inp:    { width:"100%", padding:"9px 13px", background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:8, fontSize:"0.86rem", fontFamily:"inherit", color:C.text, outline:"none", boxSizing:"border-box" },
  lbl:    { fontSize:"0.76rem", fontWeight:600, color:C.muted, marginBottom:5, display:"block", textTransform:"uppercase", letterSpacing:"0.04em" },
  btn:    (bg,c) => ({ padding:"9px 18px", borderRadius:8, border:"none", background:bg||C.accent, color:c||"#fff", fontSize:"0.84rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"opacity 0.15s" }),
  badge:  (bg,c) => ({ background:bg, color:c, padding:"3px 10px", borderRadius:20, fontSize:"0.7rem", fontWeight:700, display:"inline-block" }),
  row:    { display:"flex", gap:12, marginBottom:12 },
  col:    { flex:1 },
};

// ── HR Login ──────────────────────────────────────────
const HR_USERS = [
  { id:"HR001", name:"Suraj Chettiar", role:"owner",   mobile:"9999999999" },
  { id:"HR002", name:"Ajit Salunke",   role:"manager", mobile:"8104553496" },
];

export default function HRPortal() {
  const [screen,    setScreen]    = useState("login");
  const [hrUser,    setHrUser]    = useState(null);
  const [mobile,    setMobile]    = useState("");
  const [pin,       setPin]       = useState("");
  const [error,     setError]     = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data
  const [employees, setEmployees] = useState(() => {
    const s = localStorage.getItem("nt_hr_employees");
    return s ? JSON.parse(s) : SAMPLE_EMPLOYEES;
  });
  const [attendance, setAttendance] = useState(() => JSON.parse(localStorage.getItem("nt_hr_attendance")||"[]"));
  const [advances,   setAdvances]   = useState(() => JSON.parse(localStorage.getItem("nt_hr_advances")||"[]"));
  const [leaves,     setLeaves]     = useState(() => JSON.parse(localStorage.getItem("nt_hr_leaves")||"[]"));
  const [warnings,    setWarnings]   = useState(() => JSON.parse(localStorage.getItem("nt_hr_warnings")||"[]"));
  const [kraReviews,  setKraReviews] = useState(() => JSON.parse(localStorage.getItem("nt_hr_kra")||"[]"));

  const saveEmployees  = (d) => { localStorage.setItem("nt_hr_employees",  JSON.stringify(d)); setEmployees(d); };
  const saveAttendance = (d) => { localStorage.setItem("nt_hr_attendance", JSON.stringify(d)); setAttendance(d); };
  const saveAdvances   = (d) => { localStorage.setItem("nt_hr_advances",   JSON.stringify(d)); setAdvances(d); };
  const saveLeaves     = (d) => { localStorage.setItem("nt_hr_leaves",     JSON.stringify(d)); setLeaves(d); };
  const saveWarnings   = (d) => { localStorage.setItem("nt_hr_warnings",   JSON.stringify(d)); setWarnings(d); };
  const saveKraReviews = (d) => { localStorage.setItem("nt_hr_kra",        JSON.stringify(d)); setKraReviews(d); };

  const login = () => {
    const u = HR_USERS.find(u => u.mobile === mobile.trim());
    if (!u) { setError("Mobile number not found"); return; }
    if (pin !== "1234") { setError("Invalid PIN"); return; }
    setHrUser(u);
    setScreen("app");
  };

  if (screen === "login") return (
    <div style={S.loginBg}>
      <div style={S.loginBox}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:"2.5rem",marginBottom:8}}>👥</div>
          <div style={{color:C.text,fontWeight:800,fontSize:"1.2rem"}}>{COMPANY}</div>
          <div style={{color:C.muted,fontSize:"0.82rem",marginTop:4}}>HR Management Portal</div>
        </div>
        <div style={{marginBottom:12}}>
          <label style={S.lbl}>Mobile Number</label>
          <input style={S.inp} type="tel" placeholder="10-digit mobile" value={mobile} onChange={e=>setMobile(e.target.value)} />
        </div>
        <div style={{marginBottom:16}}>
          <label style={S.lbl}>PIN</label>
          <input style={S.inp} type="password" placeholder="Enter PIN (1234)" value={pin} onChange={e=>setPin(e.target.value)} maxLength={4} />
        </div>
        {error && <div style={{color:C.danger,fontSize:"0.8rem",marginBottom:10}}>{error}</div>}
        <button style={{...S.btn(),width:"100%",padding:"12px"}} onClick={login}>🔐 Login to HR Portal</button>
        <div style={{textAlign:"center",color:C.muted,fontSize:"0.72rem",marginTop:14}}>Authorized Personnel Only · PIN: 1234</div>
      </div>
    </div>
  );

  const NAV = [
    { key:"dashboard",   icon:"📊", label:"Dashboard" },
    { key:"attendance",  icon:"⏱️", label:"Attendance" },
    { key:"employees",   icon:"👥", label:"Employees" },
    { key:"salary",      icon:"💰", label:"Salary" },
    { key:"advances",    icon:"💳", label:"Salary Advance" },
    { key:"leaves",      icon:"🌴", label:"Leave Management" },
    { key:"documents",   icon:"📄", label:"Documents" },
    { key:"warnings",    icon:"⚠️", label:"Warnings & Memo" },
    { key:"interview",   icon:"📋", label:"Interview Form" },
    { key:"joining",     icon:"✅", label:"Joining Form" },
    { key:"appointment", icon:"📝", label:"Appointment Letter" },
    { key:"krakpi",      icon:"🎯", label:"KRA / KPI" },
  ];

  // Metrics
  const today = new Date().toLocaleDateString("en-IN");
  const pendingAdvances = advances.filter(a=>a.status==="Pending").length;
  const pendingLeaves = leaves.filter(l=>l.status==="Pending").length;

  return (
    <div style={S.app}>
      {/* Header */}
      <div style={S.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:"1.3rem"}}>👥</span>
          <div>
            <div style={{color:C.text,fontWeight:800,fontSize:"0.95rem"}}>{COMPANY} — HR Portal</div>
            <div style={{color:C.muted,fontSize:"0.7rem"}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{color:C.sub,fontSize:"0.82rem"}}>{hrUser?.name} · <span style={{color:C.accent}}>{hrUser?.role}</span></span>
          <button onClick={()=>{setScreen("login");setHrUser(null);setPin("");setMobile("");}} style={{...S.btn(`${C.danger}20`,C.danger),padding:"6px 12px",fontSize:"0.76rem"}}>Logout</button>
        </div>
      </div>

      <div style={{display:"flex"}}>
        {/* Sidebar */}
        <div style={S.side}>
          {NAV.map(n=>(
            <div key={n.key} style={S.sItem(activeTab===n.key)} onClick={()=>setActiveTab(n.key)}>
              <span style={{fontSize:"0.95rem"}}>{n.icon}</span>
              <span>{n.label}</span>
              {n.key==="advances" && pendingAdvances>0 && <span style={{...S.badge(C.danger,"#fff"),marginLeft:"auto",fontSize:"0.65rem",padding:"1px 6px"}}>{pendingAdvances}</span>}
              {n.key==="leaves"   && pendingLeaves>0   && <span style={{...S.badge(C.accent3,"#000"),marginLeft:"auto",fontSize:"0.65rem",padding:"1px 6px"}}>{pendingLeaves}</span>}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={S.main}>

          {/* ══ DASHBOARD ══ */}
          {activeTab==="dashboard" && (
            <DashboardTab employees={employees} attendance={attendance} advances={advances} leaves={leaves} warnings={warnings} today={today} />
          )}

          {/* ══ ATTENDANCE ══ */}
          {activeTab==="attendance" && (
            <AttendanceTab employees={employees} attendance={attendance} saveAttendance={saveAttendance} today={today} />
          )}

          {/* ══ EMPLOYEES ══ */}
          {activeTab==="employees" && (
            <EmployeesTab employees={employees} saveEmployees={saveEmployees} />
          )}

          {/* ══ SALARY ══ */}
          {activeTab==="salary" && (
            <SalaryTab employees={employees} attendance={attendance} advances={advances} saveAdvances={saveAdvances} />
          )}

          {/* ══ SALARY ADVANCE ══ */}
          {activeTab==="advances" && (
            <AdvancesTab employees={employees} advances={advances} saveAdvances={saveAdvances} />
          )}

          {/* ══ LEAVES ══ */}
          {activeTab==="leaves" && (
            <LeavesTab employees={employees} leaves={leaves} saveLeaves={saveLeaves} />
          )}

          {/* ══ DOCUMENTS ══ */}
          {activeTab==="documents" && (
            <DocumentsTab employees={employees} />
          )}

          {/* ══ WARNINGS ══ */}
          {activeTab==="warnings" && (
            <WarningsTab employees={employees} warnings={warnings} saveWarnings={saveWarnings} />
          )}

          {/* ══ INTERVIEW FORM ══ */}
          {activeTab==="interview" && <InterviewForm />}

          {/* ══ JOINING FORM ══ */}
          {activeTab==="joining" && <JoiningForm />}

          {/* ══ APPOINTMENT LETTER ══ */}
          {activeTab==="appointment" && <AppointmentLetter employees={employees} />}

          {/* ══ KRA / KPI ══ */}
          {activeTab==="krakpi" && <KRAKPITab employees={employees} kraReviews={kraReviews} saveKraReviews={saveKraReviews} saveEmployees={saveEmployees} />}

        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────
function DashboardTab({ employees, attendance, advances, leaves, warnings, today }) {
  const active = employees.filter(e=>e.status==="Active");
  const todayAtt = attendance.filter(a=>a.date===today);
  const present = todayAtt.filter(a=>a.inTime&&!a.outTime).length;
  const completed = todayAtt.filter(a=>a.inTime&&a.outTime).length;
  const totalMonthSalary = active.reduce((s,e)=>s+Number(e.salary||0),0);
  const pendingAdv = advances.filter(a=>a.status==="Pending").length;
  const pendingLeave = leaves.filter(l=>l.status==="Pending").length;
  const activeWarnings = warnings.filter(w=>w.type!=="Termination Letter").length;

  return (
    <>
      <div style={{marginBottom:20}}>
        <div style={{color:C.text,fontWeight:800,fontSize:"1.3rem"}}>HR Dashboard</div>
        <div style={{color:C.muted,fontSize:"0.82rem",marginTop:3}}>Overview — {today}</div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:20}}>
        {[
          {icon:"👥",label:"Total Employees",  val:active.length,           color:C.accent},
          {icon:"✅",label:"Present Today",     val:present+completed,       color:C.accent2},
          {icon:"💰",label:"Monthly Salary",   val:`₹${totalMonthSalary.toLocaleString("en-IN")}`, color:C.accent3},
          {icon:"💳",label:"Pending Advances", val:pendingAdv,              color:C.danger},
          {icon:"🌴",label:"Pending Leaves",   val:pendingLeave,            color:C.purple},
          {icon:"⚠️",label:"Active Warnings",  val:activeWarnings,          color:C.danger},
        ].map((s,i)=>(
          <div key={i} style={S.stat(s.color)}>
            <div style={{fontSize:"1.3rem",marginBottom:6}}>{s.icon}</div>
            <div style={{fontSize:"1.5rem",fontWeight:800,color:s.color}}>{s.val}</div>
            <div style={{fontSize:"0.72rem",color:C.muted,marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Today's Attendance */}
      <div style={S.card}>
        <div style={S.cardH()}><span style={{color:C.text,fontWeight:700}}>⏱️ Today's Attendance Status</span></div>
        <table style={S.tbl}>
          <thead><tr>
            <th style={S.th}>Employee</th><th style={S.th}>Dept</th><th style={S.th}>In Time</th><th style={S.th}>Out Time</th><th style={S.th}>Hours</th><th style={S.th}>OT</th><th style={S.th}>Status</th>
          </tr></thead>
          <tbody>
            {active.map((emp,i)=>{
              const att = todayAtt.find(a=>a.empId===emp.id);
              const hrs = att?.inTime && att?.outTime ? calcHours(att.inTime, att.outTime) : null;
              const ot  = hrs ? Math.max(0, hrs - 9) : 0;
              return (
                <tr key={i}>
                  <td style={{...S.td,color:C.text,fontWeight:600}}>{emp.name}</td>
                  <td style={S.td}>{emp.dept}</td>
                  <td style={{...S.td,color:C.accent2}}>{att?.inTime||"—"}</td>
                  <td style={{...S.td,color:C.accent3}}>{att?.outTime||"—"}</td>
                  <td style={S.td}>{hrs ? `${hrs.toFixed(2)}h` : "—"}</td>
                  <td style={{...S.td,color:C.accent3}}>{ot>0?`${ot.toFixed(2)}h`:"—"}</td>
                  <td style={S.td}>
                    <span style={S.badge(
                      att?.inTime&&att?.outTime?`${C.accent2}22`:att?.inTime?`${C.accent}22`:`${C.danger}22`,
                      att?.inTime&&att?.outTime?C.accent2:att?.inTime?C.accent:C.danger
                    )}>{att?.inTime&&att?.outTime?"Completed":att?.inTime?"Present":"Absent"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── ATTENDANCE ────────────────────────────────────────
function AttendanceTab({ employees, attendance, saveAttendance, today }) {
  const [selDate, setSelDate] = useState(today);
  const [inTimes, setInTimes] = useState({});
  const [outTimes,setOutTimes]= useState({});
  const [nightWork,setNightWork]=useState({});
  const active = employees.filter(e=>e.status==="Active");

  // Load existing for selected date
  useEffect(()=>{
    const dayAtt = attendance.filter(a=>a.date===selDate);
    const iT={}, oT={}, nW={};
    dayAtt.forEach(a=>{ iT[a.empId]=a.inTime||""; oT[a.empId]=a.outTime||""; nW[a.empId]=a.nightWork||"none"; });
    setInTimes(iT); setOutTimes(oT); setNightWork(nW);
  },[selDate, attendance]);

  const saveDay = () => {
    const otherDays = attendance.filter(a=>a.date!==selDate);
    const dayRecords = active.map(emp=>{
      const iT = inTimes[emp.id]||"";
      const oT = outTimes[emp.id]||"";
      const hrs = iT&&oT ? calcHours(iT,oT) : 0;
      const ot  = Math.max(0, hrs-9);
      const otRate = emp.dept==="Deep Cleaning"?OT_RATES.deepcleaning:OT_RATES.pestcontrol;
      const otAmt  = ot * otRate;
      const nW  = nightWork[emp.id]||"none";
      const nightAmt = nW==="swati"?NIGHT_RATES.swati:nW==="chinagate"?NIGHT_RATES.chinagate:nW==="both"?NIGHT_RATES.both:0;
      const dailySalary = emp.salary/26; // 26 working days
      const dayAmt = iT ? dailySalary + otAmt + nightAmt : 0;
      return { date:selDate, empId:emp.id, empName:emp.name, inTime:iT, outTime:oT, hours:hrs, ot, otAmount:otAmt, nightWork:nW, nightAmount:nightAmt, dayAmount:dayAmt, isWeeklyOff:isWeeklyOff(selDate,emp.weeklyOff), isHoliday:false };
    });
    saveAttendance([...otherDays, ...dayRecords]);
    alert("✅ Attendance saved for "+selDate);
  };

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{color:C.text,fontWeight:800,fontSize:"1.2rem"}}>⏱️ Attendance Management</div>
          <div style={{color:C.muted,fontSize:"0.82rem",marginTop:3}}>Manual In/Out Time Entry · OT Auto-calculated</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <input type="date" style={{...S.inp,width:160}} value={toInputDate(selDate)} onChange={e=>setSelDate(toDisplayDate(e.target.value))} />
          <button style={S.btn()} onClick={saveDay}>💾 Save Attendance</button>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardH()}>
          <span style={{color:C.text,fontWeight:700}}>📅 {selDate} — Attendance Entry</span>
          <span style={{...S.badge(`${C.accent}22`,C.accent),fontSize:"0.75rem"}}>{active.length} Employees</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={S.tbl}>
            <thead><tr>
              <th style={S.th}>Employee</th><th style={S.th}>Dept</th><th style={S.th}>In Time</th><th style={S.th}>Out Time</th><th style={S.th}>Hours</th><th style={S.th}>OT Hrs</th><th style={S.th}>OT Amt</th><th style={S.th}>Night Work</th><th style={S.th}>Night Amt</th><th style={S.th}>Day Total</th>
            </tr></thead>
            <tbody>
              {active.map((emp,i)=>{
                const iT = inTimes[emp.id]||"";
                const oT = outTimes[emp.id]||"";
                const hrs = iT&&oT ? calcHours(iT,oT) : 0;
                const ot  = Math.max(0, hrs-9);
                const otRate = emp.dept==="Housekeeping Technicians"?OT_RATES.deepcleaning:OT_RATES.pestcontrol;
                const otAmt  = ot * otRate;
                const nW  = nightWork[emp.id]||"none";
                const nightAmt = nW==="swati"?NIGHT_RATES.swati:nW==="chinagate"?NIGHT_RATES.chinagate:nW==="both"?NIGHT_RATES.both:0;
                const dailySalary = emp.salary/26;
                const dayTotal = iT ? dailySalary + otAmt + nightAmt : 0;
                const wOff = isWeeklyOff(selDate,emp.weeklyOff);
                return (
                  <tr key={i} style={{background:wOff?`${C.purple}10`:"transparent"}}>
                    <td style={{...S.td,color:C.text,fontWeight:600}}>
                      {emp.name}
                      {wOff && <span style={{...S.badge(`${C.purple}22`,C.purple),marginLeft:6,fontSize:"0.65rem"}}>Day Off</span>}
                    </td>
                    <td style={S.td}>{emp.dept}</td>
                    <td style={S.td}>
                      <input type="time" style={{...S.inp,padding:"5px 8px",width:100}} value={iT} onChange={e=>setInTimes(p=>({...p,[emp.id]:e.target.value}))} disabled={wOff} />
                    </td>
                    <td style={S.td}>
                      <input type="time" style={{...S.inp,padding:"5px 8px",width:100}} value={oT} onChange={e=>setOutTimes(p=>({...p,[emp.id]:e.target.value}))} disabled={wOff||!iT} />
                    </td>
                    <td style={{...S.td,color:hrs>9?C.accent3:C.accent2}}>{hrs>0?`${hrs.toFixed(2)}h`:"—"}</td>
                    <td style={{...S.td,color:C.accent3}}>{ot>0?`${ot.toFixed(2)}h`:"—"}</td>
                    <td style={{...S.td,color:C.accent3}}>{otAmt>0?`₹${otAmt.toFixed(0)}`:"—"}</td>
                    <td style={S.td}>
                      <select style={{...S.inp,padding:"5px 8px",width:130}} value={nW} onChange={e=>setNightWork(p=>({...p,[emp.id]:e.target.value}))} disabled={wOff}>
                        <option value="none">None</option>
                        <option value="swati">Swati Snacks (₹400)</option>
                        <option value="chinagate">China Gate (₹500)</option>
                        <option value="both">Both Hotels (₹700)</option>
                      </select>
                    </td>
                    <td style={{...S.td,color:C.purple}}>{nightAmt>0?`₹${nightAmt}`:"—"}</td>
                    <td style={{...S.td,color:C.accent2,fontWeight:700}}>{dayTotal>0?`₹${dayTotal.toFixed(0)}`:"—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rules */}
      <div style={S.card}>
        <div style={S.cardH()}><span style={{color:C.text,fontWeight:700}}>📋 Salary Rules</span></div>
        <div style={{...S.cardB,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[
            {title:"Office Hours",    info:"9:30 AM – 6:30 PM (9 hrs)",                           color:C.accent},
            {title:"OT Rate",         info:"Back Office & Pest Control: ₹45/hr | Deep Cleaning: ₹50/hr", color:C.accent3},
            {title:"Night Work",      info:"Swati: ₹400 | China Gate: ₹500 | Both: ₹700",        color:C.purple},
            {title:"Weekly Off",      info:"Tuesday (default) | One employee: Sunday",            color:C.accent2},
            {title:"Paid Leaves",     info:"8 per year | Max 1 per month application",           color:C.accent2},
            {title:"Working Days",    info:"26 days/month for salary calculation",                color:C.accent},
          ].map((r,i)=>(
            <div key={i} style={{background:C.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${r.color}33`}}>
              <div style={{color:r.color,fontWeight:700,fontSize:"0.8rem",marginBottom:4}}>{r.title}</div>
              <div style={{color:C.sub,fontSize:"0.75rem"}}>{r.info}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── EMPLOYEES ─────────────────────────────────────────
function EmployeesTab({ employees, saveEmployees }) {
  const [showForm, setShowForm] = useState(false);
  const [editEmp,  setEditEmp]  = useState(null);
  const [form,     setForm]     = useState(getBlankEmp());

  function getBlankEmp() {
    return { id:"", name:"", fatherName:"", mobile:"", email:"", address:"", permanentAddress:"", dob:"", bloodGroup:"", maritalStatus:"Single", pan:"", aadhar:"", dept:"Pest Control", designation:"Technician", salary:12000, joinDate:new Date().toLocaleDateString("en-IN"), weeklyOff:"Tuesday", salaryMode:"Cash", shift:"Morning (9:30-18:30)", bankName:"", accountNo:"", ifsc:"", branch:"", status:"Active", probation:"6 months", paidLeavesUsed:0, advances:[], photo:"" };
  }

  const openAdd = () => { setForm(getBlankEmp()); setEditEmp(null); setShowForm(true); };
  const openEdit = (e) => { setForm({...e}); setEditEmp(e); setShowForm(true); };

  const save = () => {
    if(!form.name||!form.mobile){alert("Name and Mobile required");return;}
    let updated;
    if(editEmp){
      updated = employees.map(e=>e.id===editEmp.id?{...form}:e);
    } else {
      const newId = `EMP-${String(employees.length+1).padStart(3,"0")}`;
      updated = [...employees, {...form, id:newId}];
    }
    saveEmployees(updated);
    setShowForm(false);
  };

  const toggleStatus = (emp) => {
    const updated = employees.map(e=>e.id===emp.id?{...e,status:e.status==="Active"?"Inactive":"Active"}:e);
    saveEmployees(updated);
  };

  const s = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{color:C.text,fontWeight:800,fontSize:"1.2rem"}}>👥 Employee Management</div>
          <div style={{color:C.muted,fontSize:"0.82rem",marginTop:3}}>All employees with complete details</div>
        </div>
        <button style={S.btn()} onClick={openAdd}>➕ Add Employee</button>
      </div>

      <div style={S.card}>
        <div style={{overflowX:"auto"}}>
          <table style={S.tbl}>
            <thead><tr>
              <th style={S.th}>ID</th><th style={S.th}>Name</th><th style={S.th}>Mobile</th><th style={S.th}>Dept</th><th style={S.th}>Designation</th><th style={S.th}>Salary</th><th style={S.th}>Joined</th><th style={S.th}>Weekly Off</th><th style={S.th}>Mode</th><th style={S.th}>Status</th><th style={S.th}>Actions</th>
            </tr></thead>
            <tbody>
              {employees.map((e,i)=>(
                <tr key={i}>
                  <td style={{...S.td,fontFamily:"monospace",color:C.muted,fontSize:"0.75rem"}}>{e.id}</td>
                  <td style={{...S.td,color:C.text,fontWeight:700}}>{e.name}</td>
                  <td style={S.td}>{e.mobile}</td>
                  <td style={S.td}>{e.dept}</td>
                  <td style={S.td}>{e.designation}</td>
                  <td style={{...S.td,color:C.accent2,fontWeight:700}}>₹{Number(e.salary).toLocaleString("en-IN")}</td>
                  <td style={S.td}>{e.joinDate}</td>
                  <td style={S.td}>{e.weeklyOff}</td>
                  <td style={S.td}>{e.salaryMode}</td>
                  <td style={S.td}><span style={S.badge(e.status==="Active"?`${C.accent2}22`:`${C.danger}22`,e.status==="Active"?C.accent2:C.danger)}>{e.status}</span></td>
                  <td style={S.td}>
                    <div style={{display:"flex",gap:6}}>
                      <button style={{...S.btn(`${C.accent}22`,C.accent),padding:"4px 10px",fontSize:"0.74rem"}} onClick={()=>openEdit(e)}>✏️</button>
                      <button style={{...S.btn(e.status==="Active"?`${C.danger}22`:`${C.accent2}22`,e.status==="Active"?C.danger:C.accent2),padding:"4px 10px",fontSize:"0.74rem"}} onClick={()=>toggleStatus(e)}>
                        {e.status==="Active"?"🔴":"🟢"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowForm(false)}>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,width:"100%",maxWidth:700,maxHeight:"90vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:C.text,fontWeight:700}}>{editEmp?"✏️ Edit Employee":"➕ Add Employee"}</span>
              <button onClick={()=>setShowForm(false)} style={{background:"none",border:"none",color:C.muted,fontSize:"1.1rem",cursor:"pointer"}}>✕</button>
            </div>
            <div style={{padding:20}}>
              <div style={{color:C.accent,fontWeight:700,fontSize:"0.8rem",textTransform:"uppercase",marginBottom:12}}>Personal Details</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                {[
                  {label:"Full Name *",      key:"name"},
                  {label:"Father's Name",    key:"fatherName"},
                  {label:"Mobile *",         key:"mobile"},
                  {label:"Email",            key:"email"},
                  {label:"Date of Birth",    key:"dob"},
                  {label:"Blood Group",      key:"bloodGroup"},
                  {label:"PAN Number",       key:"pan"},
                  {label:"Aadhar Number",    key:"aadhar"},
                ].map(f=>(
                  <div key={f.key}>
                    <label style={S.lbl}>{f.label}</label>
                    <input style={S.inp} value={form[f.key]||""} onChange={e=>s(f.key,e.target.value)} />
                  </div>
                ))}
              </div>
              <div style={{marginBottom:12}}>
                <label style={S.lbl}>Correspondence Address</label>
                <input style={S.inp} value={form.address||""} onChange={e=>s("address",e.target.value)} />
              </div>
              <div style={{marginBottom:16}}>
                <label style={S.lbl}>Permanent Address</label>
                <input style={S.inp} value={form.permanentAddress||""} onChange={e=>s("permanentAddress",e.target.value)} />
              </div>

              <div style={{color:C.accent,fontWeight:700,fontSize:"0.8rem",textTransform:"uppercase",marginBottom:12}}>Employment Details</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                <div>
                  <label style={S.lbl}>Department</label>
                  <select style={S.inp} value={form.dept} onChange={e=>s("dept",e.target.value)}>
                    {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.lbl}>Designation</label>
                  <select style={S.inp} value={DESIGNATION_SUGGESTIONS.includes(form.designation)?form.designation:"Other (Custom)"} onChange={e=>{if(e.target.value!=="Other (Custom)")s("designation",e.target.value);}}>
                    {DESIGNATION_SUGGESTIONS.map(d=><option key={d}>{d}</option>)}
                  </select>
                  {(!DESIGNATION_SUGGESTIONS.includes(form.designation)||form.designation==="Other (Custom)") && (
                    <input style={{...S.inp,marginTop:6}} placeholder="Type custom designation..." value={form.designation==="Other (Custom)"?"":form.designation} onChange={e=>s("designation",e.target.value)} />
                  )}
                  <div style={{color:C.muted,fontSize:"0.7rem",marginTop:4}}>💡 Pick from list or select "Other (Custom)" to type your own</div>
                </div>
                <div>
                  <label style={S.lbl}>Monthly Salary (₹)</label>
                  <input style={S.inp} type="number" value={form.salary} onChange={e=>s("salary",e.target.value)} />
                </div>
                <div>
                  <label style={S.lbl}>Date of Joining</label>
                  <input style={S.inp} value={form.joinDate||""} onChange={e=>s("joinDate",e.target.value)} placeholder="DD/MM/YYYY" />
                </div>
                <div>
                  <label style={S.lbl}>Weekly Off</label>
                  <select style={S.inp} value={form.weeklyOff} onChange={e=>s("weeklyOff",e.target.value)}>
                    {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.lbl}>Salary Mode</label>
                  <select style={S.inp} value={form.salaryMode} onChange={e=>s("salaryMode",e.target.value)}>
                    {SALARY_MODES.map(m=><option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.lbl}>Shift</label>
                  <select style={S.inp} value={form.shift} onChange={e=>s("shift",e.target.value)}>
                    {SHIFTS.map(sh=><option key={sh}>{sh}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.lbl}>Marital Status</label>
                  <select style={S.inp} value={form.maritalStatus} onChange={e=>s("maritalStatus",e.target.value)}>
                    {["Single","Married","Divorced","Widowed"].map(m=><option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div style={{color:C.accent,fontWeight:700,fontSize:"0.8rem",textTransform:"uppercase",marginBottom:12}}>Bank Details</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
                {[
                  {label:"Bank Name",    key:"bankName"},
                  {label:"Account No",   key:"accountNo"},
                  {label:"IFSC Code",    key:"ifsc"},
                  {label:"Branch Name",  key:"branch"},
                ].map(f=>(
                  <div key={f.key}>
                    <label style={S.lbl}>{f.label}</label>
                    <input style={S.inp} value={form[f.key]||""} onChange={e=>s(f.key,e.target.value)} />
                  </div>
                ))}
              </div>

              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button style={{...S.btn(`${C.border}`,C.sub)}} onClick={()=>setShowForm(false)}>Cancel</button>
                <button style={S.btn()} onClick={save}>💾 Save Employee</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── SALARY ────────────────────────────────────────────
function SalaryTab({ employees, attendance, advances, saveAdvances }) {
  const [selMonth, setSelMonth] = useState(new Date().toISOString().slice(0,7));
  const active = employees.filter(e=>e.status==="Active");

  const calcEmployeeSalary = (emp) => {
    const [yr,mo] = selMonth.split("-");
    const monthAtt = attendance.filter(a=>{
      const parts = a.date.split("/");
      if(parts.length!==3) return false;
      const d = new Date(`${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`);
      return d.getFullYear()===Number(yr) && d.getMonth()===Number(mo)-1 && a.empId===emp.id;
    });

    const presentDays = monthAtt.filter(a=>a.inTime).length;
    const totalOT     = monthAtt.reduce((s,a)=>s+(a.ot||0),0);
    const totalNight  = monthAtt.reduce((s,a)=>s+(a.nightAmount||0),0);
    const otRate      = emp.dept==="Housekeeping Technicians"?OT_RATES.deepcleaning:OT_RATES.pestcontrol;
    const otAmount    = totalOT * otRate;

    const dailyRate   = emp.salary / 26;
    const earnedSalary= presentDays * dailyRate;

    // Deductions
    const monthAdvances = advances.filter(a=>a.empId===emp.id && a.status==="Approved" && !a.deducted);
    const advDeduction  = monthAdvances.reduce((s,a)=>s+Number(a.amount||0),0);

    const gross = earnedSalary + otAmount + totalNight;
    const net   = gross - advDeduction;

    return { presentDays, totalOT:totalOT.toFixed(2), otAmount:otAmount.toFixed(0), totalNight:totalNight.toFixed(0), earnedSalary:earnedSalary.toFixed(0), gross:gross.toFixed(0), advDeduction:advDeduction.toFixed(0), net:net.toFixed(0), monthAdvances };
  };

  const printSlip = (emp) => {
    const sal = calcEmployeeSalary(emp);
    const [yr,mo] = selMonth.split("-");
    const monthName = new Date(yr,mo-1,1).toLocaleString("en-IN",{month:"long",year:"numeric"});
    const w = window.open("","_blank","width=500,height=700");
    w.document.write(`
      <html><head><title>Pay Slip</title>
      <style>
        body{font-family:Arial,sans-serif;margin:0;padding:20px;color:#000;}
        .header{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:10px;}
        .co{font-size:1.2rem;font-weight:800;}h3{text-align:center;margin:8px 0;border:1px solid #000;padding:5px;}
        table{width:100%;border-collapse:collapse;}td,th{border:1px solid #000;padding:6px 10px;font-size:0.85rem;}
        .total{font-weight:800;background:#f0f0f0;}
        .footer{margin-top:20px;display:flex;justify-content:space-between;font-size:0.8rem;}
        @media print{button{display:none;}}
      </style></head><body>
      <div class="header">
        <div><div class="co">New Tech Home Services</div><div style="font-size:0.75rem">Vile Parle (E), Mumbai-57</div></div>
        <div style="text-align:right;font-size:0.8rem">Ph: 7718898455<br>newtechpest01@gmail.com</div>
      </div>
      <h3>PAY SLIP FOR THE MONTH OF ${monthName.toUpperCase()}</h3>
      <table style="margin-bottom:10px">
        <tr><td><b>Employee Name</b></td><td>${emp.name}</td><td><b>Emp ID</b></td><td>${emp.id}</td></tr>
        <tr><td><b>Designation</b></td><td>${emp.designation}</td><td><b>Department</b></td><td>${emp.dept}</td></tr>
        <tr><td><b>Date of Joining</b></td><td>${emp.joinDate}</td><td><b>Present Days</b></td><td>${sal.presentDays}</td></tr>
        <tr><td><b>Monthly Salary</b></td><td>₹${Number(emp.salary).toLocaleString("en-IN")}</td><td><b>Payment Mode</b></td><td>${emp.salaryMode}</td></tr>
      </table>
      <table>
        <tr><th>Earnings</th><th>Amount</th><th>Deductions</th><th>Amount</th></tr>
        <tr><td>Basic Salary (${sal.presentDays} days)</td><td>₹${sal.earnedSalary}</td><td>Salary Advance</td><td>₹${sal.advDeduction}</td></tr>
        <tr><td>Overtime (${sal.totalOT} hrs)</td><td>₹${sal.otAmount}</td><td>Fine</td><td>₹0</td></tr>
        <tr><td>Night Work Allowance</td><td>₹${sal.totalNight}</td><td>Loan</td><td>₹0</td></tr>
        <tr><td>Night (Incentive/Bonus)</td><td>₹0</td><td>Uniform</td><td>₹0</td></tr>
        <tr class="total"><td><b>Gross Salary</b></td><td><b>₹${sal.gross}</b></td><td><b>Total Deduction</b></td><td><b>₹${sal.advDeduction}</b></td></tr>
      </table>
      <div style="background:#000;color:#fff;padding:8px 10px;display:flex;justify-content:space-between;margin-top:0;font-weight:800;font-size:1rem">
        <span>NET SALARY</span><span>₹${sal.net}</span>
      </div>
      <div class="footer">
        <div>Employee Signature: ______________</div>
        <div>Authorized Signature: ______________</div>
      </div>
      <div style="text-align:center;margin-top:20px"><button onclick="window.print()">🖨️ Print Pay Slip</button></div>
      </body></html>
    `);
    w.document.close();
  };

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{color:C.text,fontWeight:800,fontSize:"1.2rem"}}>💰 Salary Management</div>
          <div style={{color:C.muted,fontSize:"0.82rem",marginTop:3}}>Monthly salary with OT, night work and advance deductions</div>
        </div>
        <input type="month" style={{...S.inp,width:160}} value={selMonth} onChange={e=>setSelMonth(e.target.value)} />
      </div>

      <div style={S.card}>
        <div style={{overflowX:"auto"}}>
          <table style={S.tbl}>
            <thead><tr>
              <th style={S.th}>Employee</th><th style={S.th}>Dept</th><th style={S.th}>Present Days</th><th style={S.th}>Basic Earned</th><th style={S.th}>OT Hrs</th><th style={S.th}>OT Amt</th><th style={S.th}>Night</th><th style={S.th}>Gross</th><th style={S.th}>Advance Ded.</th><th style={S.th}>Net Salary</th><th style={S.th}>Mode</th><th style={S.th}>Slip</th>
            </tr></thead>
            <tbody>
              {active.map((emp,i)=>{
                const sal = calcEmployeeSalary(emp);
                return (
                  <tr key={i}>
                    <td style={{...S.td,color:C.text,fontWeight:700}}>{emp.name}</td>
                    <td style={S.td}>{emp.dept}</td>
                    <td style={{...S.td,color:C.accent}}>{sal.presentDays}</td>
                    <td style={S.td}>₹{sal.earnedSalary}</td>
                    <td style={{...S.td,color:C.accent3}}>{sal.totalOT}h</td>
                    <td style={{...S.td,color:C.accent3}}>₹{sal.otAmount}</td>
                    <td style={{...S.td,color:C.purple}}>₹{sal.totalNight}</td>
                    <td style={{...S.td,color:C.accent2,fontWeight:700}}>₹{sal.gross}</td>
                    <td style={{...S.td,color:C.danger}}>₹{sal.advDeduction}</td>
                    <td style={{...S.td,color:C.accent2,fontWeight:800,fontSize:"0.95rem"}}>₹{sal.net}</td>
                    <td style={S.td}><span style={S.badge(`${C.accent}22`,C.accent)}>{emp.salaryMode}</span></td>
                    <td style={S.td}>
                      <button style={{...S.btn(`${C.accent2}22`,C.accent2),padding:"4px 10px",fontSize:"0.74rem"}} onClick={()=>printSlip(emp)}>🖨️ Slip</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── ADVANCES ──────────────────────────────────────────
function AdvancesTab({ employees, advances, saveAdvances }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ empId:"", amount:"", reason:"", requestDate:new Date().toLocaleDateString("en-IN"), installments:1 });
  const s = (k,v) => setForm(p=>({...p,[k]:v}));

  const submitAdvance = () => {
    if(!form.empId||!form.amount){alert("Select employee and enter amount");return;}
    const emp = employees.find(e=>e.id===form.empId);
    const newAdv = { id:`ADV-${Date.now()}`, empId:form.empId, empName:emp?.name, amount:Number(form.amount), reason:form.reason, requestDate:form.requestDate, installments:Number(form.installments), status:"Pending", approvedBy:"", approvedDate:"", deducted:false };
    saveAdvances([newAdv,...advances]);
    setShowForm(false);
    setForm({ empId:"", amount:"", reason:"", requestDate:new Date().toLocaleDateString("en-IN"), installments:1 });
  };

  const approve = (adv) => {
    const updated = advances.map(a=>a.id===adv.id?{...a,status:"Approved",approvedDate:new Date().toLocaleDateString("en-IN")}:a);
    saveAdvances(updated);
  };

  const reject = (adv) => {
    const updated = advances.map(a=>a.id===adv.id?{...a,status:"Rejected"}:a);
    saveAdvances(updated);
  };

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{color:C.text,fontWeight:800,fontSize:"1.2rem"}}>💳 Salary Advance</div>
          <div style={{color:C.muted,fontSize:"0.82rem",marginTop:3}}>Request and approve salary advances — auto-deducted from monthly salary</div>
        </div>
        <button style={S.btn()} onClick={()=>setShowForm(true)}>➕ New Advance Request</button>
      </div>

      {showForm && (
        <div style={{...S.card,marginBottom:16}}>
          <div style={S.cardH()}><span style={{color:C.text,fontWeight:700}}>New Advance Request</span></div>
          <div style={{...S.cardB,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
            <div>
              <label style={S.lbl}>Employee</label>
              <select style={S.inp} value={form.empId} onChange={e=>s("empId",e.target.value)}>
                <option value="">Select</option>
                {employees.filter(e=>e.status==="Active").map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label style={S.lbl}>Amount (₹)</label>
              <input style={S.inp} type="number" value={form.amount} onChange={e=>s("amount",e.target.value)} />
            </div>
            <div>
              <label style={S.lbl}>Installments</label>
              <select style={S.inp} value={form.installments} onChange={e=>s("installments",e.target.value)}>
                {[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={S.lbl}>Reason</label>
              <input style={S.inp} value={form.reason} onChange={e=>s("reason",e.target.value)} placeholder="Purpose..." />
            </div>
          </div>
          <div style={{...S.cardB,paddingTop:0,display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button style={{...S.btn(`${C.border}`,C.sub)}} onClick={()=>setShowForm(false)}>Cancel</button>
            <button style={S.btn()} onClick={submitAdvance}>📤 Submit Request</button>
          </div>
        </div>
      )}

      <div style={S.card}>
        <table style={S.tbl}>
          <thead><tr>
            <th style={S.th}>ID</th><th style={S.th}>Employee</th><th style={S.th}>Amount</th><th style={S.th}>Installments</th><th style={S.th}>Reason</th><th style={S.th}>Request Date</th><th style={S.th}>Status</th><th style={S.th}>Actions</th>
          </tr></thead>
          <tbody>
            {advances.length===0 ? (
              <tr><td colSpan={8} style={{...S.td,textAlign:"center",color:C.muted,padding:30}}>No advance requests</td></tr>
            ) : advances.map((a,i)=>(
              <tr key={i}>
                <td style={{...S.td,fontFamily:"monospace",color:C.muted,fontSize:"0.72rem"}}>{a.id}</td>
                <td style={{...S.td,color:C.text,fontWeight:700}}>{a.empName}</td>
                <td style={{...S.td,color:C.accent3,fontWeight:700}}>₹{Number(a.amount).toLocaleString("en-IN")}</td>
                <td style={S.td}>{a.installments} month{a.installments>1?"s":""}</td>
                <td style={S.td}>{a.reason||"—"}</td>
                <td style={S.td}>{a.requestDate}</td>
                <td style={S.td}><span style={S.badge(a.status==="Approved"?`${C.accent2}22`:a.status==="Rejected"?`${C.danger}22`:`${C.accent3}22`,a.status==="Approved"?C.accent2:a.status==="Rejected"?C.danger:C.accent3)}>{a.status}</span></td>
                <td style={S.td}>
                  {a.status==="Pending" && (
                    <div style={{display:"flex",gap:6}}>
                      <button style={{...S.btn(`${C.accent2}22`,C.accent2),padding:"4px 10px",fontSize:"0.74rem"}} onClick={()=>approve(a)}>✅ Approve</button>
                      <button style={{...S.btn(`${C.danger}22`,C.danger),padding:"4px 10px",fontSize:"0.74rem"}} onClick={()=>reject(a)}>❌ Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── LEAVES ────────────────────────────────────────────
function LeavesTab({ employees, leaves, saveLeaves }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ empId:"", leaveType:"Paid Leave", fromDate:"", toDate:"", reason:"", days:1 });
  const s = (k,v) => setForm(p=>({...p,[k]:v}));

  const submit = () => {
    if(!form.empId||!form.fromDate){alert("Select employee and from date");return;}
    const emp = employees.find(e=>e.id===form.empId);
    const newLeave = { id:`LV-${Date.now()}`, empId:form.empId, empName:emp?.name, leaveType:form.leaveType, fromDate:form.fromDate, toDate:form.toDate||form.fromDate, days:form.days, reason:form.reason, appliedDate:new Date().toLocaleDateString("en-IN"), status:"Pending" };
    saveLeaves([newLeave,...leaves]);
    setShowForm(false);
  };

  const approve = (l) => saveLeaves(leaves.map(lv=>lv.id===l.id?{...lv,status:"Approved"}:lv));
  const reject  = (l) => saveLeaves(leaves.map(lv=>lv.id===l.id?{...lv,status:"Rejected"}:lv));

  const leaveBalance = (empId) => {
    const used = leaves.filter(l=>l.empId===empId&&l.leaveType==="Paid Leave"&&l.status==="Approved").reduce((s,l)=>s+Number(l.days||1),0);
    return Math.max(0, PAID_LEAVES_PER_YEAR - used);
  };

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{color:C.text,fontWeight:800,fontSize:"1.2rem"}}>🌴 Leave Management</div>
          <div style={{color:C.muted,fontSize:"0.82rem",marginTop:3}}>8 paid leaves/year · Max 1 application/month</div>
        </div>
        <button style={S.btn()} onClick={()=>setShowForm(true)}>➕ Apply Leave</button>
      </div>

      {/* Leave balance */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:16}}>
        {employees.filter(e=>e.status==="Active").map((emp,i)=>(
          <div key={i} style={{...S.card,marginBottom:0}}>
            <div style={{padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{color:C.text,fontWeight:700,fontSize:"0.86rem"}}>{emp.name}</div>
                <div style={{color:C.muted,fontSize:"0.74rem",marginTop:2}}>{emp.dept}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:leaveBalance(emp.id)>0?C.accent2:C.danger,fontWeight:800,fontSize:"1.2rem"}}>{leaveBalance(emp.id)}</div>
                <div style={{color:C.muted,fontSize:"0.68rem"}}>Paid leaves left</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{...S.card,marginBottom:16}}>
          <div style={S.cardH()}><span style={{color:C.text,fontWeight:700}}>Apply Leave</span></div>
          <div style={{...S.cardB,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
            <div>
              <label style={S.lbl}>Employee</label>
              <select style={S.inp} value={form.empId} onChange={e=>s("empId",e.target.value)}>
                <option value="">Select</option>
                {employees.filter(e=>e.status==="Active").map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label style={S.lbl}>Leave Type</label>
              <select style={S.inp} value={form.leaveType} onChange={e=>s("leaveType",e.target.value)}>
                {["Paid Leave","Sick Leave","Casual Leave","Unpaid Leave"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={S.lbl}>From Date</label>
              <input type="date" style={S.inp} value={form.fromDate} onChange={e=>s("fromDate",e.target.value)} />
            </div>
            <div>
              <label style={S.lbl}>No. of Days</label>
              <input type="number" style={S.inp} min={1} max={8} value={form.days} onChange={e=>s("days",e.target.value)} />
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={S.lbl}>Reason</label>
              <input style={S.inp} value={form.reason} onChange={e=>s("reason",e.target.value)} placeholder="Reason for leave..." />
            </div>
          </div>
          <div style={{...S.cardB,paddingTop:0,display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button style={{...S.btn(`${C.border}`,C.sub)}} onClick={()=>setShowForm(false)}>Cancel</button>
            <button style={S.btn()} onClick={submit}>📤 Submit</button>
          </div>
        </div>
      )}

      <div style={S.card}>
        <table style={S.tbl}>
          <thead><tr>
            <th style={S.th}>Employee</th><th style={S.th}>Leave Type</th><th style={S.th}>From</th><th style={S.th}>Days</th><th style={S.th}>Reason</th><th style={S.th}>Applied</th><th style={S.th}>Status</th><th style={S.th}>Action</th>
          </tr></thead>
          <tbody>
            {leaves.length===0 ? (
              <tr><td colSpan={8} style={{...S.td,textAlign:"center",color:C.muted,padding:30}}>No leave applications</td></tr>
            ) : leaves.map((l,i)=>(
              <tr key={i}>
                <td style={{...S.td,color:C.text,fontWeight:700}}>{l.empName}</td>
                <td style={S.td}><span style={S.badge(l.leaveType==="Paid Leave"?`${C.accent2}22`:`${C.accent3}22`,l.leaveType==="Paid Leave"?C.accent2:C.accent3)}>{l.leaveType}</span></td>
                <td style={S.td}>{l.fromDate}</td>
                <td style={S.td}>{l.days} day{l.days>1?"s":""}</td>
                <td style={S.td}>{l.reason||"—"}</td>
                <td style={S.td}>{l.appliedDate}</td>
                <td style={S.td}><span style={S.badge(l.status==="Approved"?`${C.accent2}22`:l.status==="Rejected"?`${C.danger}22`:`${C.accent3}22`,l.status==="Approved"?C.accent2:l.status==="Rejected"?C.danger:C.accent3)}>{l.status}</span></td>
                <td style={S.td}>
                  {l.status==="Pending" && (
                    <div style={{display:"flex",gap:6}}>
                      <button style={{...S.btn(`${C.accent2}22`,C.accent2),padding:"4px 10px",fontSize:"0.74rem"}} onClick={()=>approve(l)}>✅</button>
                      <button style={{...S.btn(`${C.danger}22`,C.danger),padding:"4px 10px",fontSize:"0.74rem"}} onClick={()=>reject(l)}>❌</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── DOCUMENTS ─────────────────────────────────────────
function DocumentsTab({ employees }) {
  return (
    <>
      <div style={{color:C.text,fontWeight:800,fontSize:"1.2rem",marginBottom:4}}>📄 HR Documents</div>
      <div style={{color:C.muted,fontSize:"0.82rem",marginBottom:20}}>Generate and print all HR documents</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
        {[
          {icon:"📋",label:"Interview Form",     desc:"Blank form for new candidates",        color:C.accent},
          {icon:"✅",label:"Employee Joining Form",desc:"3-page joining form with bank details",color:C.accent2},
          {icon:"📝",label:"Appointment Letter",  desc:"Formal offer letter",                  color:C.accent3},
          {icon:"🌴",label:"Leave Application",   desc:"Leave request form",                   color:C.purple},
          {icon:"💳",label:"Salary Advance Form", desc:"Advance request form",                 color:C.danger},
          {icon:"💰",label:"Salary Slip Format",  desc:"Monthly pay slip template",            color:C.accent2},
          {icon:"⚠️",label:"Warning Letter",      desc:"Employee warning template",            color:C.danger},
          {icon:"📄",label:"Memo",                desc:"Internal memo template",               color:C.accent},
          {icon:"🚫",label:"Termination Letter",  desc:"Employment termination",               color:C.danger},
          {icon:"🤝",label:"Offer Letter",        desc:"Job offer template",                   color:C.accent3},
        ].map((d,i)=>(
          <div key={i} style={{...S.card,marginBottom:0,cursor:"pointer"}} onClick={()=>alert(`${d.label} — Print feature coming in next update!`)}>
            <div style={{padding:"16px 14px"}}>
              <div style={{fontSize:"1.5rem",marginBottom:8}}>{d.icon}</div>
              <div style={{color:C.text,fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>{d.label}</div>
              <div style={{color:C.muted,fontSize:"0.75rem",marginBottom:10}}>{d.desc}</div>
              <button style={{...S.btn(`${d.color}22`,d.color),width:"100%",fontSize:"0.78rem"}}>🖨️ Print / Generate</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── WARNINGS ──────────────────────────────────────────
function WarningsTab({ employees, warnings, saveWarnings }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ empId:"", type:"Warning Letter", subject:"", description:"", date:new Date().toLocaleDateString("en-IN") });
  const s = (k,v) => setForm(p=>({...p,[k]:v}));

  const submit = () => {
    if(!form.empId){alert("Select employee");return;}
    const emp = employees.find(e=>e.id===form.empId);
    saveWarnings([{...form,id:`WARN-${Date.now()}`,empName:emp?.name},...warnings]);
    setShowForm(false);
  };

  const printDoc = (w) => {
    const win = window.open("","_blank");
    const isTermination = w.type==="Termination Letter";
    win.document.write(`
      <html><head><title>${w.type}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;max-width:700px;margin:0 auto;}
      .header{display:flex;justify-content:space-between;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:20px;}
      h2{color:${isTermination?"#dc2626":"#d97706"};border-bottom:2px solid currentColor;padding-bottom:5px;}
      .footer{margin-top:40px;display:flex;justify-content:space-between;}
      @media print{button{display:none;}}</style></head><body>
      <div class="header">
        <div><strong>New Tech Home Services</strong><br><small>Vile Parle (E), Mumbai-57</small></div>
        <div style="text-align:right"><small>Date: ${w.date}</small></div>
      </div>
      <p>To,<br><strong>${w.empName}</strong></p>
      <h2>${w.type.toUpperCase()}</h2>
      <p><strong>Subject:</strong> ${w.subject||w.type}</p>
      <p>${w.description||"This letter is issued as per company policy."}</p>
      ${isTermination?`<p>Your last working day will be <strong>${w.date}</strong>. Please hand over all company property before departure.</p>`:`<p>We expect immediate improvement. Failure to comply may result in further disciplinary action.</p>`}
      <div class="footer">
        <div>Employee Signature: ______________<br><small>Date: __________</small></div>
        <div>HR / Management: ______________<br><small>Date: __________</small></div>
      </div>
      <div style="text-align:center;margin-top:20px"><button onclick="window.print()">🖨️ Print</button></div>
      </body></html>
    `);
    win.document.close();
  };

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{color:C.text,fontWeight:800,fontSize:"1.2rem"}}>⚠️ Warnings, Memos & Notices</div>
          <div style={{color:C.muted,fontSize:"0.82rem",marginTop:3}}>Issue warning letters, memos and termination notices</div>
        </div>
        <button style={S.btn(C.danger)} onClick={()=>setShowForm(true)}>➕ Issue Document</button>
      </div>

      {showForm && (
        <div style={{...S.card,marginBottom:16}}>
          <div style={S.cardH()}><span style={{color:C.text,fontWeight:700}}>Issue Warning / Memo</span></div>
          <div style={{...S.cardB,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            <div>
              <label style={S.lbl}>Employee</label>
              <select style={S.inp} value={form.empId} onChange={e=>s("empId",e.target.value)}>
                <option value="">Select</option>
                {employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label style={S.lbl}>Document Type</label>
              <select style={S.inp} value={form.type} onChange={e=>s("type",e.target.value)}>
                {["Warning Letter","Memo","Show Cause Notice","Termination Letter","Suspension Letter"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={S.lbl}>Date</label>
              <input style={S.inp} value={form.date} onChange={e=>s("date",e.target.value)} />
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={S.lbl}>Subject</label>
              <input style={S.inp} value={form.subject} onChange={e=>s("subject",e.target.value)} placeholder="Subject of the notice..." />
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={S.lbl}>Description</label>
              <textarea style={{...S.inp,minHeight:80,resize:"vertical"}} value={form.description} onChange={e=>s("description",e.target.value)} placeholder="Detailed description..." />
            </div>
          </div>
          <div style={{...S.cardB,paddingTop:0,display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button style={{...S.btn(`${C.border}`,C.sub)}} onClick={()=>setShowForm(false)}>Cancel</button>
            <button style={S.btn(C.danger)} onClick={submit}>📤 Issue Document</button>
          </div>
        </div>
      )}

      <div style={S.card}>
        <table style={S.tbl}>
          <thead><tr>
            <th style={S.th}>Employee</th><th style={S.th}>Type</th><th style={S.th}>Subject</th><th style={S.th}>Date</th><th style={S.th}>Actions</th>
          </tr></thead>
          <tbody>
            {warnings.length===0 ? (
              <tr><td colSpan={5} style={{...S.td,textAlign:"center",color:C.muted,padding:30}}>No warnings or memos issued</td></tr>
            ) : warnings.map((w,i)=>(
              <tr key={i}>
                <td style={{...S.td,color:C.text,fontWeight:700}}>{w.empName}</td>
                <td style={S.td}><span style={S.badge(w.type==="Termination Letter"?`${C.danger}22`:`${C.accent3}22`,w.type==="Termination Letter"?C.danger:C.accent3)}>{w.type}</span></td>
                <td style={{...S.td,color:C.sub}}>{w.subject||"—"}</td>
                <td style={S.td}>{w.date}</td>
                <td style={S.td}>
                  <button style={{...S.btn(`${C.accent}22`,C.accent),padding:"4px 10px",fontSize:"0.74rem"}} onClick={()=>printDoc(w)}>🖨️ Print</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── INTERVIEW FORM ────────────────────────────────────
function InterviewForm() {
  const [f, setF] = useState({ firstName:"", lastName:"", mobile:"", email:"", address:"", pin:"", gender:"Male", class10:"", class12:"", graduation:"", postGrad:"", specialization:"", companyName:"", position:"", location:"", from:"", to:"", supervisor:"", currentSalary:"", expectedSalary:"", availableDate:"", position_applied:"Pest Control Technician" });
  const s = (k,v) => setF(p=>({...p,[k]:v}));

  const print = () => {
    const w = window.open("","_blank");
    w.document.write(`
      <html><head><title>Interview Form</title>
      <style>body{font-family:Arial,sans-serif;padding:30px;font-size:0.85rem;}
      .header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #000;margin-bottom:15px;padding-bottom:10px;}
      h3{background:#1a1a1a;color:#fff;padding:6px 10px;margin:10px 0 8px;}
      table{width:100%;border-collapse:collapse;}td{border:1px solid #ccc;padding:6px 8px;}
      .field{border-bottom:1px solid #ccc;min-width:120px;display:inline-block;min-height:16px;}
      .section{margin:12px 0;}label{font-weight:600;}
      @media print{button{display:none;}}</style></head><body>
      <div class="header">
        <div><strong style="font-size:1.1rem">NEW TECH HOME SERVICES</strong><br><small>Interview Application Form</small></div>
        <div style="text-align:right"><small>Date: ${new Date().toLocaleDateString("en-IN")}</small></div>
      </div>
      <h3>PERSONAL INFORMATION</h3>
      <table><tr>
        <td><label>First Name:</label><br>${f.firstName}</td>
        <td><label>Last Name:</label><br>${f.lastName}</td>
        <td><label>Gender:</label><br>${f.gender}</td>
        <td><label>Mobile:</label><br>${f.mobile}</td>
      </tr><tr>
        <td colspan="2"><label>Current Address:</label><br>${f.address}</td>
        <td><label>Pin No:</label><br>${f.pin}</td>
        <td><label>Email ID:</label><br>${f.email}</td>
      </tr></table>
      <h3>EDUCATION INFORMATION</h3>
      <table><tr><th>Class</th><th>Board/University</th><th>Passing Year</th><th>Result</th><th>Specialization</th></tr>
        <tr><td>10th</td><td></td><td></td><td>${f.class10}</td><td></td></tr>
        <tr><td>12th</td><td></td><td></td><td>${f.class12}</td><td></td></tr>
        <tr><td>Graduation</td><td></td><td></td><td>${f.graduation}</td><td>${f.specialization}</td></tr>
        <tr><td>Post Graduation</td><td></td><td></td><td>${f.postGrad}</td><td></td></tr>
      </table>
      <h3>PROFESSIONAL EXPERIENCE</h3>
      <table><tr><th>Company Name</th><th>Position</th><th>Location</th><th>From</th><th>To</th><th>Supervisor/Manager</th></tr>
        <tr><td>${f.companyName}</td><td>${f.position}</td><td>${f.location}</td><td>${f.from}</td><td>${f.to}</td><td>${f.supervisor}</td></tr>
        <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
        <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
      </table>
      <h3>POSITIONS</h3>
      <div style="padding:8px">Position Applied For: <strong>${f.position_applied}</strong> &nbsp;&nbsp; Current Salary: ₹${f.currentSalary} &nbsp;&nbsp; Expected Salary: ₹${f.expectedSalary} &nbsp;&nbsp; Available From: ${f.availableDate}</div>
      <div style="margin-top:20px;font-size:0.8rem;border:1px solid #ccc;padding:10px"><strong>Acknowledgement:</strong> I certify all the answers given herein are true and complete to the best of my knowledge. In the event of employment, I understand that false or misleading information given in my application / interview may result in discharge.</div>
      <div style="margin-top:20px;display:flex;justify-content:space-between;"><div>Candidate Signature: ______________</div><div>Date: ______________</div></div>
      <div style="text-align:center;margin-top:20px"><button onclick="window.print()">🖨️ Print Form</button></div>
      </body></html>
    `);
    w.document.close();
  };

  return (
    <>
      <div style={{color:C.text,fontWeight:800,fontSize:"1.2rem",marginBottom:4}}>📋 Interview Application Form</div>
      <div style={{color:C.muted,fontSize:"0.82rem",marginBottom:20}}>Fill details and print for candidate interview</div>
      <div style={S.card}>
        <div style={S.cardH(`${C.accent}15`)}><span style={{color:C.accent,fontWeight:700}}>👤 Personal Information</span></div>
        <div style={{...S.cardB,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
          {[{l:"First Name",k:"firstName"},{l:"Last Name",k:"lastName"},{l:"Mobile",k:"mobile"},{l:"Email",k:"email"},{l:"Address",k:"address"},{l:"PIN Code",k:"pin"},{l:"Gender",k:"gender",opts:["Male","Female","Other"]},{l:"Position Applied",k:"position_applied",opts:["Pest Control Technician","Housekeeping Technician","Sales Executive","Marketing Executive","Social Media Executive","CRM Executive","Accounts Executive","Store Keeper","HR Executive","Manager","Other"]}].map(f=>(
            <div key={f.k}>
              <label style={S.lbl}>{f.l}</label>
              {f.opts ? <select style={S.inp} value={f[f.k]} onChange={e=>s(f.k,e.target.value)}>{f.opts.map(o=><option key={o}>{o}</option>)}</select>
              : <input style={S.inp} value={f[f.k]||""} onChange={e=>s(f.k,e.target.value)} />}
            </div>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardH(`${C.accent2}15`)}><span style={{color:C.accent2,fontWeight:700}}>🎓 Education</span></div>
        <div style={{...S.cardB,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
          {[{l:"10th Result",k:"class10"},{l:"12th Result",k:"class12"},{l:"Graduation",k:"graduation"},{l:"Post Graduation",k:"postGrad"},{l:"Specialization",k:"specialization"}].map(f=>(
            <div key={f.k}><label style={S.lbl}>{f.l}</label><input style={S.inp} value={f[f.k]||""} onChange={e=>s(f.k,e.target.value)} /></div>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardH(`${C.accent3}15`)}><span style={{color:C.accent3,fontWeight:700}}>💼 Experience & Salary</span></div>
        <div style={{...S.cardB,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[{l:"Company Name",k:"companyName"},{l:"Position",k:"position"},{l:"Location",k:"location"},{l:"From Date",k:"from"},{l:"To Date",k:"to"},{l:"Supervisor Mobile",k:"supervisor"},{l:"Current Salary",k:"currentSalary"},{l:"Expected Salary",k:"expectedSalary"},{l:"Available From",k:"availableDate"}].map(f=>(
            <div key={f.k}><label style={S.lbl}>{f.l}</label><input style={S.inp} value={f[f.k]||""} onChange={e=>s(f.k,e.target.value)} /></div>
          ))}
        </div>
      </div>
      <button style={{...S.btn(),padding:"12px 24px"}} onClick={print}>🖨️ Print Interview Form</button>
    </>
  );
}

// ── JOINING FORM ──────────────────────────────────────
function JoiningForm() {
  const [f, setF] = useState({ name:"", fatherName:"", corrAddress:"", permAddress:"", tel:"", mobile:"", email:"", dob:"", pan:"", bloodGroup:"", maritalStatus:"Single", emergencyName:"", emergencyRelation:"", emergencyContact:"", bankName:"", accountNo:"", ifsc:"", branchName:"", degree1:"", degree2:"", from1:"", to1:"", uni1:"", pct1:"", spec1:"", doj:"", probation:"6 months" });
  const s = (k,v) => setF(p=>({...p,[k]:v}));

  const print = () => {
    const w = window.open("","_blank");
    w.document.write(`
      <html><head><title>Employee Joining Form</title>
      <style>body{font-family:Arial,sans-serif;padding:30px;font-size:0.85rem;}
      .header{display:flex;justify-content:space-between;align-items:center;border:2px solid #000;padding:10px;margin-bottom:15px;}
      .logo{font-size:1.3rem;font-weight:800;border:2px solid #000;padding:5px 10px;}
      h3{text-decoration:underline;font-size:0.9rem;margin:12px 0 6px;}
      table{width:100%;border-collapse:collapse;margin-bottom:8px;}td{border:1px solid #ccc;padding:5px 8px;font-size:0.82rem;}
      .photo{border:1px solid #ccc;width:80px;height:100px;float:right;text-align:center;line-height:100px;color:#999;font-size:0.75rem;}
      @media print{button{display:none;}}</style></head><body>
      <div class="header">
        <div class="logo">NEW-TECH Since 2008</div>
        <div style="font-size:0.8rem;text-align:center"><strong>EMPLOYEE JOINING FORM</strong></div>
        <div class="photo">PHOTOGRAPH</div>
      </div>
      <h3>PERSONAL DETAILS</h3>
      <table><tr><td><b>Name:</b> ${f.name}</td><td><b>Father's Name:</b> ${f.fatherName}</td></tr>
      <tr><td colspan="2"><b>Correspondence Address:</b> ${f.corrAddress}</td></tr>
      <tr><td colspan="2"><b>Permanent Address:</b> ${f.permAddress}</td></tr>
      <tr><td><b>Telephone:</b> ${f.tel}</td><td><b>Mobile:</b> ${f.mobile}</td></tr>
      <tr><td><b>Email ID:</b> ${f.email}</td><td><b>Date of Birth:</b> ${f.dob}</td></tr>
      <tr><td><b>Pan Card No:</b> ${f.pan}</td><td><b>Blood Group:</b> ${f.bloodGroup}</td></tr>
      <tr><td><b>Marital Status:</b> ${f.maritalStatus}</td><td><b>Contact No:</b> ${f.mobile}</td></tr>
      </table>
      <h3>EMERGENCY CONTACT DETAILS</h3>
      <table><tr><td><b>Name:</b> ${f.emergencyName}</td><td><b>Relation:</b> ${f.emergencyRelation}</td><td><b>Contact No:</b> ${f.emergencyContact}</td></tr></table>
      <h3>BANK DETAILS</h3>
      <table><tr><td><b>Bank Name:</b> ${f.bankName}</td><td><b>Account Number:</b> ${f.accountNo}</td></tr>
      <tr><td><b>IFSC Code:</b> ${f.ifsc}</td><td><b>Branch Name:</b> ${f.branchName}</td></tr></table>
      <h3>EDUCATIONAL DETAILS</h3>
      <table><tr><th>Degree</th><th>University/Institute</th><th>From</th><th>To</th><th>Percentage/Grade</th><th>Specialization</th></tr>
      <tr><td>${f.degree1}</td><td>${f.uni1}</td><td>${f.from1}</td><td>${f.to1}</td><td>${f.pct1}</td><td>${f.spec1}</td></tr>
      <tr><td>${f.degree2}</td><td></td><td></td><td></td><td></td><td></td></tr></table>
      <h3>IMPORTANT DETAILS</h3>
      <table><tr><td><b>Date of Joining (DOJ):</b> ${f.doj}</td><td><b>Probation Completion:</b> 6 months</td><td><b>Confirmation Date:</b></td></tr></table>
      <div style="margin:15px 0;border:1px solid #ccc;padding:10px;font-size:0.8rem"><b>DECLARATION:</b> I hereby declare that the above statements made in my application form are true, complete and correct to the best of my knowledge and belief. In the event of any information being found false or in corrected any stage, my services are liable to be terminated without notice.</div>
      <table style="margin-top:20px"><tr><td><b>Date:</b> ___________</td><td><b>Place:</b> ___________</td><td style="text-align:right"><b>Signature:</b> ___________</td></tr></table>
      <div style="margin-top:10px;font-size:0.75rem;text-align:center;border-top:1px solid #ccc;padding-top:8px">Residential | Housing Societies | Commercial | offices | School | Restaurant | Hotel | Pre- & Post Construction<br>Shreyas Apt., Shop No.2, Shradhanand Road, Near Saibaba Mandir, Vile Parle (E), Mumbai-57<br>Mob: 9619817225 / 9930478436 Office: 7208645036 Email: newtechpest01@gmail.com</div>
      <div style="text-align:center;margin-top:20px"><button onclick="window.print()">🖨️ Print Joining Form</button></div>
      </body></html>
    `);
    w.document.close();
  };

  return (
    <>
      <div style={{color:C.text,fontWeight:800,fontSize:"1.2rem",marginBottom:4}}>✅ Employee Joining Form</div>
      <div style={{color:C.muted,fontSize:"0.82rem",marginBottom:20}}>Complete joining form matching your New-Tech format</div>
      <div style={S.card}>
        <div style={S.cardH(`${C.accent}15`)}><span style={{color:C.accent,fontWeight:700}}>👤 Personal Details</span></div>
        <div style={{...S.cardB,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[{l:"Full Name",k:"name"},{l:"Father's Name",k:"fatherName"},{l:"Mobile",k:"mobile"},{l:"Telephone",k:"tel"},{l:"Email ID",k:"email"},{l:"Date of Birth",k:"dob"},{l:"PAN Card No",k:"pan"},{l:"Blood Group",k:"bloodGroup"},{l:"Marital Status",k:"maritalStatus",opts:["Single","Married","Divorced","Widowed"]},{l:"Date of Joining",k:"doj"}].map(f=>(
            <div key={f.k}><label style={S.lbl}>{f.l}</label>
              {f.opts?<select style={S.inp} value={f[f.k]||""} onChange={e=>s(f.k,e.target.value)}>{f.opts.map(o=><option key={o}>{o}</option>)}</select>
              :<input style={S.inp} value={f[f.k]||""} onChange={e=>s(f.k,e.target.value)} />}
            </div>
          ))}
          <div style={{gridColumn:"1/-1"}}><label style={S.lbl}>Correspondence Address</label><input style={S.inp} value={f.corrAddress||""} onChange={e=>s("corrAddress",e.target.value)} /></div>
          <div style={{gridColumn:"1/-1"}}><label style={S.lbl}>Permanent Address</label><input style={S.inp} value={f.permAddress||""} onChange={e=>s("permAddress",e.target.value)} /></div>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardH(`${C.danger}15`)}><span style={{color:C.danger,fontWeight:700}}>🚨 Emergency Contact</span></div>
        <div style={{...S.cardB,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[{l:"Name",k:"emergencyName"},{l:"Relation",k:"emergencyRelation"},{l:"Contact No",k:"emergencyContact"}].map(f=>(
            <div key={f.k}><label style={S.lbl}>{f.l}</label><input style={S.inp} value={f[f.k]||""} onChange={e=>s(f.k,e.target.value)} /></div>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardH(`${C.accent2}15`)}><span style={{color:C.accent2,fontWeight:700}}>🏦 Bank Details</span></div>
        <div style={{...S.cardB,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[{l:"Bank Name",k:"bankName"},{l:"Account Number",k:"accountNo"},{l:"IFSC Code",k:"ifsc"},{l:"Branch Name",k:"branchName"}].map(f=>(
            <div key={f.k}><label style={S.lbl}>{f.l}</label><input style={S.inp} value={f[f.k]||""} onChange={e=>s(f.k,e.target.value)} /></div>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardH(`${C.accent3}15`)}><span style={{color:C.accent3,fontWeight:700}}>🎓 Education Details</span></div>
        <div style={{...S.cardB,display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12}}>
          {[{l:"Degree 1",k:"degree1"},{l:"University",k:"uni1"},{l:"From",k:"from1"},{l:"To",k:"to1"},{l:"Percentage",k:"pct1"},{l:"Specialization",k:"spec1"},{l:"Degree 2",k:"degree2"}].map(f=>(
            <div key={f.k}><label style={S.lbl}>{f.l}</label><input style={S.inp} value={f[f.k]||""} onChange={e=>s(f.k,e.target.value)} /></div>
          ))}
        </div>
      </div>
      <button style={{...S.btn(),padding:"12px 24px"}} onClick={print}>🖨️ Print Joining Form</button>
    </>
  );
}

// ── APPOINTMENT LETTER ────────────────────────────────
function AppointmentLetter({ employees }) {
  const [empId, setEmpId] = useState("");
  const [customSalary, setCustomSalary] = useState("");
  const emp = employees.find(e=>e.id===empId);

  const print = () => {
    if(!emp){alert("Select an employee");return;}
    const sal = customSalary || emp.salary;
    const w = window.open("","_blank");
    w.document.write(`
      <html><head><title>Appointment Letter</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;max-width:750px;margin:0 auto;font-size:0.88rem;line-height:1.6;}
      .header{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #000;padding-bottom:15px;margin-bottom:20px;}
      .logo{font-size:1.4rem;font-weight:800;}h2{font-size:1rem;margin:15px 0 5px;text-decoration:underline;}
      .ref{font-size:0.8rem;color:#666;}
      .footer{border-top:2px solid #000;padding-top:10px;margin-top:20px;font-size:0.8rem;text-align:center;}
      .sig{display:flex;justify-content:space-between;margin-top:40px;}
      @media print{button{display:none;}}</style></head><body>
      <div class="header">
        <div>
          <img src="" alt="" style="height:50px" onerror="this.style.display='none'"/>
          <div class="logo">New-Tech Pest Control</div>
          <div style="font-size:0.75rem;color:#555">Your Health is Our Wealth!</div>
        </div>
        <div style="text-align:right;font-size:0.8rem">Residential | Housing Societies | Commercial<br>Shreyas Apt., Shop No.2, Vile Parle (E), Mumbai-57<br>Mob: 9619817225 Office: 7208645036</div>
      </div>
      <p class="ref">REF NO: NEW TECH PEST CONTROL/${emp.dept.toUpperCase().replace(/ /g,"_")}/${emp.id}</p>
      <p>${new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</p>
      <p><strong>${emp.name}</strong><br>${emp.address||"Mumbai"}</p>
      <p><strong>Subject: Letter of Appointment</strong></p>
      <p>Dear <strong>${emp.name}</strong>,</p>
      <p>This has reference to your application and subsequent interviews you have had with New Tech Pest Control. We are pleased to appoint you as <strong>${emp.designation}</strong> in its ${emp.dept} function based at Mumbai. Your employment will be governed by the following terms and conditions:</p>
      <h2>1. Monthly Gross Salary</h2><p>You will be paid a monthly gross salary of <strong>Rs. ${Number(sal).toLocaleString("en-IN")}/- (Rupees ${numberToWords(Number(sal))} Only)</strong> per month.</p>
      <h2>2. Working Hours</h2><p>Your working hours will be 9:30 am to 6:30 pm as per the current company policy. The company observes a 6 day work week.</p>
      <h2>3. Date of Appointment</h2><p>Your date of appointment as per company records is <strong>${emp.joinDate}</strong>.</p>
      <h2>4. Salary Increase</h2><p>Increase in your salary will be reviewed periodically as per the policy of the Company. Increments in the salary range will be on the basis of demonstrated results and effectiveness of performance during the period of review.</p>
      <h2>5. Probation Period</h2><p>You will be on probation for a period of six months from the date of your appointment. On satisfactory completion of the probation period, you will be confirmed in service.</p>
      <h2>6. Leave</h2><p>You will be entitled to 8 Paid Leaves per year, with a maximum of 1 leave application per month. You will also be governed by the current Leave Policy of the company for permanent employees.</p>
      <h2>7. Weekly Off</h2><p>Your weekly off day will be <strong>${emp.weeklyOff}</strong>.</p>
      <h2>8. Notice Period</h2><p>While on probation, this appointment may be terminated by either side by giving Forty-five days' notice.</p>
      <h2>9. Confidential Information</h2><p>You will not, at any time, without the consent of the Company disclose or divulge any information regarding Company's affairs.</p>
      <p>We welcome you to the <strong>New Tech Pest Control</strong> family and trust we will have a long and mutually rewarding association.</p>
      <p>Yours faithfully,</p>
      <div class="sig">
        <div><p><b>Details of Perquisites & Allowances:</b></p>
        <p>Name: ${emp.name}<br>Designation: ${emp.designation}<br>Department: ${emp.dept}<br>Basic Salary: ₹${Number(sal).toLocaleString("en-IN")}/-<br>Date of Joining: ${emp.joinDate}<br>Probation: Six months</p></div>
        <div style="text-align:right"><p><b>Name: Suraj Laxman Chettiar</b><br>Signature: ______________<br>Operations & Accounts Head<br>Date: __________</p>
        <p style="margin-top:20px"><b>Name: ${emp.name}</b><br>Signature: ______________<br>${emp.designation}<br>Date: __________</p></div>
      </div>
      <div class="footer">Residential | Housing Societies | Commercial | offices | School | Restaurant | Hotel | Pre- & Post Construction<br>Shreyas Apt., Shop No.2, Shradhanand Road, Near Saibaba Mandir, Vile Parle (E), Mumbai-57<br>Mob: 9619817225 / 9930478436 &nbsp; Email: newtechpest01@gmail.com &nbsp; Web: www.new-techpest.com</div>
      <div style="text-align:center;margin-top:20px"><button onclick="window.print()">🖨️ Print Appointment Letter</button></div>
      </body></html>
    `);
    w.document.close();
  };

  return (
    <>
      <div style={{color:C.text,fontWeight:800,fontSize:"1.2rem",marginBottom:4}}>📝 Appointment Letter</div>
      <div style={{color:C.muted,fontSize:"0.82rem",marginBottom:20}}>Generate official appointment letter matching New-Tech format</div>
      <div style={S.card}>
        <div style={{padding:20}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <div>
              <label style={S.lbl}>Select Employee</label>
              <select style={S.inp} value={empId} onChange={e=>setEmpId(e.target.value)}>
                <option value="">-- Select Employee --</option>
                {employees.map(e=><option key={e.id} value={e.id}>{e.name} — {e.designation}</option>)}
              </select>
            </div>
            <div>
              <label style={S.lbl}>Override Salary (optional)</label>
              <input style={S.inp} type="number" placeholder={emp?`Current: ₹${emp.salary}`:"Select employee first"} value={customSalary} onChange={e=>setCustomSalary(e.target.value)} />
            </div>
          </div>
          {emp && (
            <div style={{background:C.bg,borderRadius:10,padding:"12px 16px",marginBottom:16,border:`1px solid ${C.border}`}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                {[{l:"Name",v:emp.name},{l:"Designation",v:emp.designation},{l:"Department",v:emp.dept},{l:"Salary",v:`₹${emp.salary}`},{l:"Join Date",v:emp.joinDate},{l:"Weekly Off",v:emp.weeklyOff},{l:"Mode",v:emp.salaryMode},{l:"Status",v:emp.status}].map((r,i)=>(
                  <div key={i}><div style={{color:C.muted,fontSize:"0.68rem",textTransform:"uppercase"}}>{r.l}</div><div style={{color:C.text,fontWeight:600,fontSize:"0.84rem",marginTop:2}}>{r.v}</div></div>
                ))}
              </div>
            </div>
          )}
          <button style={{...S.btn(),padding:"12px 24px"}} onClick={print}>🖨️ Generate Appointment Letter</button>
        </div>
      </div>
    </>
  );
}

// ── KRA / KPI MODULE ─────────────────────────────────
const KRA_TEMPLATES = {
  "CRM (Customer Relationship Management)": [
    { kra:"Customer Retention",    kpi:"Repeat customer rate",              weight:25, target:"> 80% customers return" },
    { kra:"Customer Retention",    kpi:"Complaint resolution time",        weight:15, target:"< 24 hours resolution" },
    { kra:"Lead Conversion",       kpi:"Lead follow-up rate",              weight:20, target:"> 90% leads followed up" },
    { kra:"Communication",         kpi:"Response time to inquiries",       weight:15, target:"< 2 hours response" },
    { kra:"Attendance",            kpi:"Monthly attendance",               weight:15, target:"Min 24 working days" },
    { kra:"Teamwork & Conduct",    kpi:"Discipline & attitude",            weight:10, target:"No disciplinary action" },
  ],
  "Sales": [
    { kra:"Revenue Generation",    kpi:"Monthly sales target achievement", weight:30, target:"> 90% target met" },
    { kra:"Revenue Generation",    kpi:"New client acquisition",           weight:20, target:"> 5 new clients/month" },
    { kra:"Lead Management",       kpi:"Lead conversion rate",             weight:20, target:"> 30% leads converted" },
    { kra:"Customer Relations",    kpi:"Client satisfaction score",        weight:15, target:"> 4/5 rating" },
    { kra:"Attendance",            kpi:"Monthly attendance",               weight:10, target:"Min 24 working days" },
    { kra:"Teamwork & Conduct",    kpi:"Team collaboration",               weight:5,  target:"No disciplinary action" },
  ],
  "Marketing": [
    { kra:"Campaign Performance",  kpi:"Campaign ROI",                     weight:25, target:"> 3x return on spend" },
    { kra:"Lead Generation",       kpi:"Leads generated per month",        weight:25, target:"> 50 qualified leads" },
    { kra:"Brand Visibility",      kpi:"Website/offline reach",            weight:15, target:"Month-on-month growth" },
    { kra:"Content & Execution",   kpi:"Campaigns executed on time",       weight:20, target:"100% on schedule" },
    { kra:"Attendance",            kpi:"Monthly attendance",               weight:10, target:"Min 24 working days" },
    { kra:"Teamwork & Conduct",    kpi:"Coordination & discipline",        weight:5,  target:"No disciplinary action" },
  ],
  "Social Media Marketing": [
    { kra:"Content Creation",      kpi:"Posts published per month",        weight:20, target:"> 20 posts/month" },
    { kra:"Audience Growth",       kpi:"Follower growth rate",             weight:20, target:"> 5% growth/month" },
    { kra:"Engagement",            kpi:"Likes/comments/shares rate",       weight:20, target:"> 3% engagement rate" },
    { kra:"Lead Generation",       kpi:"Leads from social media",          weight:20, target:"> 10 leads/month" },
    { kra:"Attendance",            kpi:"Monthly attendance",               weight:15, target:"Min 24 working days" },
    { kra:"Teamwork & Conduct",    kpi:"Coordination & discipline",        weight:5,  target:"No disciplinary action" },
  ],
  "Accounts": [
    { kra:"Accuracy",              kpi:"Billing/invoice error rate",       weight:25, target:"< 1% errors" },
    { kra:"Timeliness",            kpi:"Reports submitted on time",        weight:20, target:"100% on due date" },
    { kra:"Collections",           kpi:"Outstanding payment follow-up",   weight:20, target:"> 90% collected on time" },
    { kra:"Compliance",            kpi:"GST/TDS filings on time",          weight:20, target:"Zero late filings" },
    { kra:"Attendance",            kpi:"Monthly attendance",               weight:10, target:"Min 24 working days" },
    { kra:"Teamwork & Conduct",    kpi:"Data confidentiality & discipline",weight:5,  target:"No disciplinary action" },
  ],
  "Inventory & Store": [
    { kra:"Stock Accuracy",        kpi:"Inventory count accuracy",         weight:25, target:"< 1% discrepancy" },
    { kra:"Stock Management",      kpi:"Stockout incidents",               weight:20, target:"Zero stockouts" },
    { kra:"Issue & Receipt",       kpi:"On-time material issue to team",   weight:20, target:"> 95% on time" },
    { kra:"Wastage Control",       kpi:"Chemical/material wastage",        weight:20, target:"< 3% wastage" },
    { kra:"Attendance",            kpi:"Monthly attendance",               weight:10, target:"Min 24 working days" },
    { kra:"Teamwork & Conduct",    kpi:"Record keeping & discipline",      weight:5,  target:"No disciplinary action" },
  ],
  "Housekeeping Technicians": [
    { kra:"Service Quality",       kpi:"Rework / re-clean requests",       weight:25, target:"< 2/month" },
    { kra:"Service Quality",       kpi:"Checklist completion",             weight:15, target:"100% checklist done" },
    { kra:"Attendance & Punctuality", kpi:"On-time arrival at site",      weight:15, target:"> 90% days on time" },
    { kra:"Attendance & Punctuality", kpi:"Monthly attendance",           weight:10, target:"Min 24 working days" },
    { kra:"Customer Satisfaction", kpi:"Customer feedback score",         weight:20, target:"> 4/5 rating" },
    { kra:"Productivity",          kpi:"Sites handled per month",         weight:10, target:"> 15 sites/month" },
    { kra:"Teamwork & Conduct",    kpi:"Equipment handling & discipline", weight:5,  target:"No damage reported" },
  ],
  "Pest Control Technicians": [
    { kra:"Service Quality",       kpi:"Customer complaint rate",          weight:25, target:"< 2 complaints/month" },
    { kra:"Service Quality",       kpi:"Job completion rate",              weight:15, target:"> 95% jobs completed" },
    { kra:"Attendance & Punctuality", kpi:"On-time arrival",              weight:15, target:"> 90% days on time" },
    { kra:"Attendance & Punctuality", kpi:"Monthly attendance",           weight:10, target:"Min 24 working days" },
    { kra:"Customer Satisfaction", kpi:"Customer feedback score",         weight:20, target:"> 4/5 rating" },
    { kra:"Productivity",          kpi:"Number of jobs handled/month",    weight:10, target:"> 20 jobs/month" },
    { kra:"Teamwork & Conduct",    kpi:"Team coordination & discipline",  weight:5,  target:"No disciplinary action" },
  ],
  "HR": [
    { kra:"Recruitment",           kpi:"Positions filled on time",         weight:20, target:"> 90% within 30 days" },
    { kra:"Employee Relations",    kpi:"Grievance resolution time",        weight:20, target:"< 48 hours" },
    { kra:"Compliance",            kpi:"HR compliance & documentation",    weight:20, target:"100% records updated" },
    { kra:"Attendance Management", kpi:"Attendance accuracy",              weight:15, target:"Zero discrepancies" },
    { kra:"Training",              kpi:"Training sessions conducted",      weight:10, target:"> 1 training/month" },
    { kra:"Attendance",            kpi:"Monthly attendance",               weight:10, target:"Min 24 working days" },
    { kra:"Teamwork & Conduct",    kpi:"Discipline & confidentiality",     weight:5,  target:"No disciplinary action" },
  ],
  "Management": [
    { kra:"Team Management",       kpi:"Team productivity score",          weight:20, target:"> 85% team efficiency" },
    { kra:"Team Management",       kpi:"Employee retention rate",          weight:15, target:"< 10% attrition/year" },
    { kra:"Business Growth",       kpi:"Revenue target achievement",       weight:20, target:"> 90% target met" },
    { kra:"Business Growth",       kpi:"New client acquisition",           weight:15, target:"> 3 new clients/month" },
    { kra:"Attendance",            kpi:"Monthly attendance",               weight:10, target:"Min 25 working days" },
    { kra:"Client Relations",      kpi:"Client retention rate",            weight:15, target:"> 85% retained" },
    { kra:"Reporting",             kpi:"MIS & reports on time",            weight:5,  target:"100% on time" },
  ],
  "Other": [
    { kra:"Work Output",           kpi:"Task completion rate",             weight:30, target:"> 90% tasks on time" },
    { kra:"Quality",               kpi:"Error / rework rate",              weight:20, target:"< 5% errors" },
    { kra:"Attendance & Punctuality", kpi:"Monthly attendance",           weight:20, target:"Min 24 working days" },
    { kra:"Communication",         kpi:"Team coordination",                weight:15, target:"Positive feedback" },
    { kra:"Teamwork & Conduct",    kpi:"Discipline & attitude",            weight:15, target:"No disciplinary action" },
  ],
};

const RATING_LABELS = { 1:"Poor", 2:"Below Average", 3:"Average", 4:"Good", 5:"Excellent" };
const RATING_COLORS = { 1:C.danger, 2:"#f97316", 3:C.accent3, 4:C.accent, 5:C.accent2 };

function KRAKPITab({ employees, kraReviews, saveKraReviews, saveEmployees }) {
  const [subTab,       setSubTab]       = useState("reviews");
  const [selEmpId,     setSelEmpId]     = useState("");
  const [reviewPeriod, setReviewPeriod] = useState(new Date().toISOString().slice(0,7));
  const [ratings,      setRatings]      = useState({});
  const [comments,     setComments]     = useState({});
  const [reviewNotes,  setReviewNotes]  = useState("");


  const active = employees.filter(e=>e.status==="Active");

  const getTemplate = (emp) => {
    if(!emp) return KRA_TEMPLATES["Other"];
    // Direct match first
    if(KRA_TEMPLATES[emp.dept]) return KRA_TEMPLATES[emp.dept];
    // Partial match
    const key = Object.keys(KRA_TEMPLATES).find(k => emp.dept.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(emp.dept.toLowerCase()));
    return KRA_TEMPLATES[key] || KRA_TEMPLATES["Other"];
  };

  const startReview = (empId) => {
    const emp = employees.find(e=>e.id===empId);
    const template = getTemplate(emp);
    const initRatings = {};
    const initComments = {};
    template.forEach((_,i) => { initRatings[i]=3; initComments[i]=""; });
    setRatings(initRatings);
    setComments(initComments);
    setReviewNotes("");
    setSelEmpId(empId);
    setSubTab("conduct");
  };

  const calcScore = (ratingMap, template) => {
    let total = 0;
    template.forEach((t,i) => { total += (Number(ratingMap[i]||3) * t.weight); });
    return (total / 100).toFixed(2);
  };

  const getRecommendation = (score) => {
    if(score >= 4.5) return { label:"Promote + Hike 20%+", color:C.accent2, icon:"🚀" };
    if(score >= 4.0) return { label:"Increment 15%",       color:C.accent2, icon:"⬆️" };
    if(score >= 3.5) return { label:"Increment 10%",       color:C.accent,  icon:"📈" };
    if(score >= 3.0) return { label:"Increment 5%",        color:C.accent3, icon:"➡️" };
    if(score >= 2.0) return { label:"No Increment — PIP",  color:"#f97316", icon:"⚠️" };
    return                  { label:"Warning / Termination", color:C.danger, icon:"🚨" };
  };

  const submitReview = () => {
    const emp = employees.find(e=>e.id===selEmpId);
    if(!emp){alert("Select employee");return;}
    const template = getTemplate(emp);
    const score = Number(calcScore(ratings, template));
    const rec = getRecommendation(score);
    const hikePercent = score>=4.5?20:score>=4.0?15:score>=3.5?10:score>=3.0?5:0;
    const newSalary = hikePercent>0 ? Math.round(emp.salary*(1+hikePercent/100)) : emp.salary;

    const review = {
      id:`KRA-${Date.now()}`,
      empId:selEmpId,
      empName:emp.name,
      dept:emp.dept,
      designation:emp.designation,
      period:reviewPeriod,
      reviewDate:new Date().toLocaleDateString("en-IN"),
      ratings:{...ratings},
      comments:{...comments},
      notes:reviewNotes,
      score,
      recommendation:rec.label,
      hikePercent,
      currentSalary:emp.salary,
      proposedSalary:newSalary,
      status:"Completed",
      template:template.map((t,i)=>({...t,rating:ratings[i]||3,comment:comments[i]||""})),
    };

    saveKraReviews([review,...kraReviews]);
    setSubTab("reviews");
    setSelEmpId("");
  };

  const applyHike = (review) => {
    if(!window.confirm(`Apply ${review.hikePercent}% increment to ${review.empName}?\nCurrent: ₹${review.currentSalary} → New: ₹${review.proposedSalary}`)) return;
    const updated = employees.map(e=>e.id===review.empId?{...e,salary:review.proposedSalary}:e);
    saveEmployees(updated);
    saveKraReviews(kraReviews.map(r=>r.id===review.id?{...r,status:"Hike Applied",appliedDate:new Date().toLocaleDateString("en-IN")}:r));
    alert("✅ Salary updated successfully!");
  };

  const printReview = (review) => {
    const w = window.open("","_blank");
    w.document.write(`
      <html><head><title>KRA Review — ${review.empName}</title>
      <style>body{font-family:Arial,sans-serif;padding:30px;font-size:0.85rem;}
      .header{display:flex;justify-content:space-between;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:15px;}
      h3{background:#1a1a1a;color:#fff;padding:6px 10px;margin:12px 0 6px;}
      table{width:100%;border-collapse:collapse;}td,th{border:1px solid #ccc;padding:6px 8px;}
      th{background:#f0f0f0;font-weight:700;}
      .score{font-size:1.5rem;font-weight:800;color:${RATING_COLORS[Math.round(review.score)]||"#000"};}
      .rec{padding:10px;border:2px solid #000;margin-top:10px;font-weight:700;}
      @media print{button{display:none;}}</style></head><body>
      <div class="header">
        <div><strong>NEW TECH HOME SERVICES</strong><br><small>KRA / KPI Performance Review</small></div>
        <div style="text-align:right"><small>Review Date: ${review.reviewDate}<br>Period: ${review.period}</small></div>
      </div>
      <table style="margin-bottom:12px"><tr>
        <td><b>Employee:</b> ${review.empName}</td><td><b>ID:</b> ${review.empId}</td>
        <td><b>Department:</b> ${review.dept}</td><td><b>Designation:</b> ${review.designation}</td>
      </tr></table>
      <h3>KPI RATINGS</h3>
      <table><tr><th>KRA</th><th>KPI</th><th>Weight</th><th>Target</th><th>Rating (1-5)</th><th>Score</th><th>Comments</th></tr>
      ${review.template.map(t=>`<tr><td>${t.kra}</td><td>${t.kpi}</td><td>${t.weight}%</td><td>${t.target}</td><td style="text-align:center;font-weight:700">${t.rating}/5 — ${RATING_LABELS[t.rating]}</td><td style="text-align:center">${(t.rating*t.weight/100).toFixed(2)}</td><td>${t.comment||""}</td></tr>`).join("")}
      <tr style="background:#f0f0f0;font-weight:800"><td colspan="5">TOTAL WEIGHTED SCORE</td><td style="text-align:center">${review.score}/5</td><td></td></tr>
      </table>
      <div style="display:flex;gap:20px;margin-top:12px;align-items:flex-start">
        <div class="rec">Recommendation: ${review.recommendation} ${review.hikePercent>0?`| Hike: ${review.hikePercent}%`:""}<br>Current Salary: ₹${review.currentSalary} → Proposed: ₹${review.proposedSalary}</div>
      </div>
      ${review.notes?`<p><b>Reviewer Notes:</b> ${review.notes}</p>`:""}
      <div style="display:flex;justify-content:space-between;margin-top:30px">
        <div>Employee Signature: ______________<br><small>Date: __________</small></div>
        <div>HR Signature: ______________<br><small>Date: __________</small></div>
        <div>Director Signature: ______________<br><small>Date: __________</small></div>
      </div>
      <div style="text-align:center;margin-top:20px"><button onclick="window.print()">🖨️ Print Review</button></div>
      </body></html>
    `);
    w.document.close();
  };

  const emp = employees.find(e=>e.id===selEmpId);
  const template = emp ? getTemplate(emp) : [];
  const currentScore = emp ? Number(calcScore(ratings, template)) : 0;
  const currentRec = getRecommendation(currentScore);

  // Summary stats
  const avgScore = kraReviews.length ? (kraReviews.reduce((s,r)=>s+Number(r.score),0)/kraReviews.length).toFixed(2) : 0;
  const hikesApplied = kraReviews.filter(r=>r.status==="Hike Applied").length;
  const pendingHikes = kraReviews.filter(r=>r.status==="Completed"&&r.hikePercent>0).length;

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{color:C.text,fontWeight:800,fontSize:"1.2rem"}}>🎯 KRA / KPI — Increment & Promotion</div>
          <div style={{color:C.muted,fontSize:"0.82rem",marginTop:3}}>Performance review · Salary increment · Promotion decisions</div>
        </div>
        <button style={S.btn(C.accent2)} onClick={()=>setSubTab(subTab==="reviews"?"conduct":"reviews")}>
          {subTab==="reviews"?"➕ Conduct Review":"📋 View Reviews"}
        </button>
      </div>

      {/* KPI Summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        {[
          {icon:"📊",label:"Total Reviews",   val:kraReviews.length,      color:C.accent},
          {icon:"⭐",label:"Avg Score",        val:`${avgScore}/5`,        color:C.accent3},
          {icon:"✅",label:"Hikes Applied",    val:hikesApplied,           color:C.accent2},
          {icon:"⏳",label:"Pending Hikes",    val:pendingHikes,           color:C.purple},
        ].map((s,i)=>(
          <div key={i} style={S.stat(s.color)}>
            <div style={{fontSize:"1.2rem",marginBottom:4}}>{s.icon}</div>
            <div style={{fontSize:"1.4rem",fontWeight:800,color:s.color}}>{s.val}</div>
            <div style={{fontSize:"0.72rem",color:C.muted,marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sub Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[{k:"reviews",l:"📋 All Reviews"},{k:"conduct",l:"➕ New Review"},{k:"scorecard",l:"📊 Scorecard"}].map(t=>(
          <button key={t.k} style={{...S.btn(subTab===t.k?C.accent:`${C.border}`,subTab===t.k?"#fff":C.sub),padding:"7px 16px",fontSize:"0.82rem"}} onClick={()=>setSubTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {/* ── ALL REVIEWS ── */}
      {subTab==="reviews" && (
        <div style={S.card}>
          <table style={S.tbl}>
            <thead><tr>
              <th style={S.th}>Employee</th><th style={S.th}>Dept</th><th style={S.th}>Period</th><th style={S.th}>Score</th><th style={S.th}>Rating</th><th style={S.th}>Recommendation</th><th style={S.th}>Hike %</th><th style={S.th}>Salary Change</th><th style={S.th}>Status</th><th style={S.th}>Actions</th>
            </tr></thead>
            <tbody>
              {kraReviews.length===0 ? (
                <tr><td colSpan={10} style={{...S.td,textAlign:"center",color:C.muted,padding:30}}>No reviews yet — conduct your first KRA review</td></tr>
              ) : kraReviews.map((r,i)=>{
                const rec = getRecommendation(r.score);
                return (
                  <tr key={i}>
                    <td style={{...S.td,color:C.text,fontWeight:700}}>{r.empName}</td>
                    <td style={S.td}>{r.dept}</td>
                    <td style={S.td}>{r.period}</td>
                    <td style={S.td}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:50,height:6,borderRadius:3,background:C.border,overflow:"hidden"}}>
                          <div style={{width:`${(r.score/5)*100}%`,height:"100%",background:RATING_COLORS[Math.round(r.score)]||C.accent}} />
                        </div>
                        <span style={{color:RATING_COLORS[Math.round(r.score)]||C.accent,fontWeight:700}}>{r.score}</span>
                      </div>
                    </td>
                    <td style={S.td}><span style={S.badge(`${RATING_COLORS[Math.round(r.score)]}22`,RATING_COLORS[Math.round(r.score)]||C.accent)}>{RATING_LABELS[Math.round(r.score)]}</span></td>
                    <td style={{...S.td,color:rec.color,fontWeight:600}}>{rec.icon} {r.recommendation}</td>
                    <td style={{...S.td,color:r.hikePercent>0?C.accent2:C.muted,fontWeight:700}}>{r.hikePercent>0?`+${r.hikePercent}%`:"—"}</td>
                    <td style={S.td}>{r.hikePercent>0?<span style={{color:C.accent2}}>₹{r.currentSalary} → ₹{r.proposedSalary}</span>:"—"}</td>
                    <td style={S.td}><span style={S.badge(r.status==="Hike Applied"?`${C.accent2}22`:`${C.accent}22`,r.status==="Hike Applied"?C.accent2:C.accent)}>{r.status}</span></td>
                    <td style={S.td}>
                      <div style={{display:"flex",gap:5}}>
                        <button style={{...S.btn(`${C.accent}22`,C.accent),padding:"4px 8px",fontSize:"0.72rem"}} onClick={()=>printReview(r)}>🖨️</button>
                        {r.status==="Completed" && r.hikePercent>0 && (
                          <button style={{...S.btn(`${C.accent2}22`,C.accent2),padding:"4px 8px",fontSize:"0.72rem"}} onClick={()=>applyHike(r)}>✅ Apply</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── CONDUCT REVIEW ── */}
      {subTab==="conduct" && (
        <>
          <div style={S.card}>
            <div style={S.cardH(`${C.accent}15`)}><span style={{color:C.accent,fontWeight:700}}>Select Employee & Review Period</span></div>
            <div style={{...S.cardB,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <div>
                <label style={S.lbl}>Employee</label>
                <select style={S.inp} value={selEmpId} onChange={e=>{ setSelEmpId(e.target.value); if(e.target.value){ const em=employees.find(x=>x.id===e.target.value); const t=getTemplate(em); const r={},c={}; t.forEach((_,i)=>{r[i]=3;c[i]="";}); setRatings(r); setComments(c); }}}>
                  <option value="">-- Select Employee --</option>
                  {active.map(e=><option key={e.id} value={e.id}>{e.name} — {e.designation}</option>)}
                </select>
              </div>
              <div>
                <label style={S.lbl}>Review Period (Month)</label>
                <input type="month" style={S.inp} value={reviewPeriod} onChange={e=>setReviewPeriod(e.target.value)} />
              </div>
              {emp && (
                <div style={{background:C.bg,borderRadius:8,padding:"10px 14px",border:`1px solid ${C.border}`}}>
                  <div style={{color:C.muted,fontSize:"0.7rem",marginBottom:4}}>CURRENT SALARY</div>
                  <div style={{color:C.accent2,fontWeight:800,fontSize:"1.1rem"}}>₹{Number(emp.salary).toLocaleString("en-IN")}</div>
                  <div style={{color:C.muted,fontSize:"0.72rem",marginTop:2}}>{emp.dept} · Joined {emp.joinDate}</div>
                </div>
              )}
            </div>
          </div>

          {emp && (
            <>
              {/* Live Score Card */}
              <div style={{...S.card,background:`linear-gradient(135deg,${C.card},#1e2a3d)`,border:`1px solid ${currentRec.color}44`}}>
                <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{color:C.muted,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.1em"}}>Live Score</div>
                    <div style={{color:currentRec.color,fontWeight:900,fontSize:"2.5rem",lineHeight:1}}>{currentScore.toFixed(2)}<span style={{fontSize:"1rem",color:C.muted}}>/5</span></div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:"1.5rem"}}>{currentRec.icon}</div>
                    <div style={{color:currentRec.color,fontWeight:700,fontSize:"0.9rem",marginTop:4}}>{currentRec.label}</div>
                    {currentScore>=3.0 && <div style={{color:C.muted,fontSize:"0.75rem",marginTop:2}}>Proposed: ₹{Math.round(emp.salary*(1+(currentScore>=4.5?20:currentScore>=4.0?15:currentScore>=3.5?10:5)/100)).toLocaleString("en-IN")}</div>}
                  </div>
                  <div style={{flex:1,maxWidth:200,padding:"0 20px"}}>
                    <div style={{height:8,background:C.border,borderRadius:4,overflow:"hidden"}}>
                      <div style={{width:`${(currentScore/5)*100}%`,height:"100%",background:currentRec.color,transition:"width 0.3s"}} />
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",color:C.muted,fontSize:"0.68rem",marginTop:4}}>
                      <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* KPI Rating Table */}
              <div style={S.card}>
                <div style={S.cardH()}><span style={{color:C.text,fontWeight:700}}>📊 KPI Ratings — {emp.name} ({emp.dept})</span></div>
                <table style={S.tbl}>
                  <thead><tr>
                    <th style={S.th}>KRA Area</th><th style={S.th}>KPI Metric</th><th style={S.th}>Weight</th><th style={S.th}>Target</th><th style={S.th}>Rating (1–5)</th><th style={S.th}>Weighted Score</th><th style={S.th}>Comments</th>
                  </tr></thead>
                  <tbody>
                    {template.map((t,i)=>{
                      const r = Number(ratings[i]||3);
                      const ws = (r*t.weight/100).toFixed(2);
                      return (
                        <tr key={i}>
                          <td style={{...S.td,color:C.text,fontWeight:600,fontSize:"0.8rem"}}>{t.kra}</td>
                          <td style={{...S.td,color:C.sub,fontSize:"0.8rem"}}>{t.kpi}</td>
                          <td style={{...S.td,color:C.accent3,fontWeight:700}}>{t.weight}%</td>
                          <td style={{...S.td,color:C.muted,fontSize:"0.77rem"}}>{t.target}</td>
                          <td style={S.td}>
                            <div style={{display:"flex",gap:4,alignItems:"center"}}>
                              {[1,2,3,4,5].map(n=>(
                                <button key={n} onClick={()=>setRatings(p=>({...p,[i]:n}))} style={{width:28,height:28,borderRadius:6,border:`2px solid ${r===n?RATING_COLORS[n]:C.border}`,background:r===n?`${RATING_COLORS[n]}22`:"transparent",color:r===n?RATING_COLORS[n]:C.muted,fontWeight:r===n?800:400,cursor:"pointer",fontSize:"0.8rem",transition:"all 0.15s"}}>
                                  {n}
                                </button>
                              ))}
                              <span style={{color:RATING_COLORS[r],fontSize:"0.72rem",marginLeft:4,fontWeight:700}}>{RATING_LABELS[r]}</span>
                            </div>
                          </td>
                          <td style={{...S.td,color:RATING_COLORS[r],fontWeight:700}}>{ws}</td>
                          <td style={S.td}>
                            <input style={{...S.inp,padding:"4px 8px",fontSize:"0.78rem"}} placeholder="Optional comment..." value={comments[i]||""} onChange={e=>setComments(p=>({...p,[i]:e.target.value}))} />
                          </td>
                        </tr>
                      );
                    })}
                    <tr style={{background:`${C.bg}`}}>
                      <td colSpan={5} style={{...S.td,color:C.text,fontWeight:800,textAlign:"right"}}>TOTAL WEIGHTED SCORE:</td>
                      <td style={{...S.td,color:currentRec.color,fontWeight:900,fontSize:"1.1rem"}}>{currentScore.toFixed(2)}/5</td>
                      <td style={S.td}></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={S.card}>
                <div style={S.cardH()}><span style={{color:C.text,fontWeight:700}}>📝 Reviewer Notes & Final Decision</span></div>
                <div style={S.cardB}>
                  <label style={S.lbl}>Overall Comments / Reviewer Notes</label>
                  <textarea style={{...S.inp,minHeight:80,resize:"vertical",marginBottom:16}} placeholder="Overall performance summary, specific achievements, areas of improvement..." value={reviewNotes} onChange={e=>setReviewNotes(e.target.value)} />
                  <div style={{background:C.bg,borderRadius:10,padding:"14px 16px",border:`1px solid ${currentRec.color}44`,marginBottom:16}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
                      <div><div style={{color:C.muted,fontSize:"0.7rem",textTransform:"uppercase"}}>Final Score</div><div style={{color:currentRec.color,fontWeight:800,fontSize:"1.2rem"}}>{currentScore.toFixed(2)}/5</div></div>
                      <div><div style={{color:C.muted,fontSize:"0.7rem",textTransform:"uppercase"}}>Performance</div><div style={{color:currentRec.color,fontWeight:700}}>{RATING_LABELS[Math.round(currentScore)]||"Average"}</div></div>
                      <div><div style={{color:C.muted,fontSize:"0.7rem",textTransform:"uppercase"}}>Recommendation</div><div style={{color:currentRec.color,fontWeight:700}}>{currentRec.icon} {currentRec.label}</div></div>
                      <div><div style={{color:C.muted,fontSize:"0.7rem",textTransform:"uppercase"}}>Proposed Salary</div><div style={{color:C.accent2,fontWeight:800}}>₹{currentScore>=3.0?Math.round(emp.salary*(1+(currentScore>=4.5?20:currentScore>=4.0?15:currentScore>=3.5?10:5)/100)).toLocaleString("en-IN"):emp.salary.toLocaleString("en-IN")}</div></div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                    <button style={{...S.btn(`${C.border}`,C.sub)}} onClick={()=>setSubTab("reviews")}>Cancel</button>
                    <button style={S.btn(C.accent2)} onClick={submitReview}>💾 Submit Review & Save</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ── SCORECARD ── */}
      {subTab==="scorecard" && (
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
            {active.map((emp,i)=>{
              const empReviews = kraReviews.filter(r=>r.empId===emp.id);
              const latest = empReviews[0];
              const rec = latest ? getRecommendation(latest.score) : null;
              return (
                <div key={i} style={{...S.card,marginBottom:0}}>
                  <div style={{padding:"14px 16px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div>
                        <div style={{color:C.text,fontWeight:700,fontSize:"0.9rem"}}>{emp.name}</div>
                        <div style={{color:C.muted,fontSize:"0.75rem",marginTop:2}}>{emp.designation} · {emp.dept}</div>
                      </div>
                      {latest && <span style={{...S.badge(`${RATING_COLORS[Math.round(latest.score)]}22`,RATING_COLORS[Math.round(latest.score)]),fontSize:"0.72rem"}}>{latest.score}/5</span>}
                    </div>
                    {latest ? (
                      <>
                        <div style={{height:6,background:C.border,borderRadius:3,overflow:"hidden",marginBottom:8}}>
                          <div style={{width:`${(latest.score/5)*100}%`,height:"100%",background:RATING_COLORS[Math.round(latest.score)]||C.accent}} />
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                          <div style={{color:rec.color,fontSize:"0.78rem",fontWeight:600}}>{rec.icon} {latest.recommendation}</div>
                          <div style={{color:C.muted,fontSize:"0.72rem"}}>{latest.period}</div>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.75rem"}}>
                          <span style={{color:C.muted}}>Current: <span style={{color:C.text,fontWeight:700}}>₹{Number(emp.salary).toLocaleString("en-IN")}</span></span>
                          {latest.hikePercent>0 && <span style={{color:C.accent2,fontWeight:700}}>+{latest.hikePercent}% proposed</span>}
                        </div>
                      </>
                    ) : (
                      <div style={{color:C.muted,fontSize:"0.78rem",textAlign:"center",padding:"10px 0"}}>No review conducted yet</div>
                    )}
                    <button style={{...S.btn(`${C.accent}22`,C.accent),width:"100%",marginTop:10,fontSize:"0.78rem",padding:"7px"}} onClick={()=>{startReview(emp.id);setSubTab("conduct");}}>
                      {latest?"🔄 New Review":"➕ Conduct Review"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scoring Guide */}
          <div style={{...S.card,marginTop:16}}>
            <div style={S.cardH()}><span style={{color:C.text,fontWeight:700}}>📖 Scoring Guide — Increment & Promotion Policy</span></div>
            <div style={S.cardB}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                {[
                  {range:"4.5 – 5.0",label:"Excellent",       action:"Promote + 20%+ Hike",    color:C.accent2},
                  {range:"4.0 – 4.4",label:"Good",            action:"15% Salary Increment",   color:C.accent},
                  {range:"3.5 – 3.9",label:"Above Average",   action:"10% Salary Increment",   color:"#06b6d4"},
                  {range:"3.0 – 3.4",label:"Average",         action:"5% Salary Increment",    color:C.accent3},
                  {range:"2.0 – 2.9",label:"Below Average",   action:"No Increment — PIP",     color:"#f97316"},
                  {range:"1.0 – 1.9",label:"Poor",            action:"Warning / Termination",  color:C.danger},
                ].map((g,i)=>(
                  <div key={i} style={{background:C.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${g.color}44`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span style={{color:g.color,fontWeight:800,fontSize:"0.85rem"}}>{g.range}</span>
                      <span style={S.badge(`${g.color}22`,g.color)}>{g.label}</span>
                    </div>
                    <div style={{color:C.sub,fontSize:"0.75rem"}}>{g.action}</div>
                  </div>
                ))}
              </div>
              <div style={{background:C.bg,borderRadius:8,padding:"12px 14px",marginTop:12,border:`1px solid ${C.border}`,fontSize:"0.78rem",color:C.muted}}>
                💡 <strong style={{color:C.sub}}>How scoring works:</strong> Each KPI has a weight (%). Rating (1–5) × Weight = Weighted Score. All weighted scores added = Total Score out of 5. Hike is applied after Director approval via the "Apply Hike" button.
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ── Helpers ───────────────────────────────────────────
function calcHours(inTime, outTime) {
  if(!inTime||!outTime) return 0;
  const [ih,im] = inTime.split(":").map(Number);
  const [oh,om] = outTime.split(":").map(Number);
  let mins = (oh*60+om) - (ih*60+im);
  if(mins<0) mins += 24*60; // overnight
  return mins/60;
}

function isWeeklyOff(dateStr, weeklyOff) {
  const parts = dateStr.split("/");
  if(parts.length!==3) return false;
  const d = new Date(`${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`);
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return days[d.getDay()]===weeklyOff;
}

function toInputDate(displayDate) {
  if(!displayDate) return "";
  const parts = displayDate.split("/");
  if(parts.length!==3) return "";
  return `${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`;
}

function toDisplayDate(inputDate) {
  if(!inputDate) return "";
  const [y,m,d] = inputDate.split("-");
  return `${d}/${m}/${y}`;
}

function numberToWords(num) {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if(num<20) return ones[num];
  if(num<100) return tens[Math.floor(num/10)]+(num%10?" "+ones[num%10]:"");
  if(num<1000) return ones[Math.floor(num/100)]+" Hundred"+(num%100?" "+numberToWords(num%100):"");
  if(num<100000) return numberToWords(Math.floor(num/1000))+" Thousand"+(num%1000?" "+numberToWords(num%1000):"");
  return numberToWords(Math.floor(num/100000))+" Lakh"+(num%100000?" "+numberToWords(num%100000):"");
}
