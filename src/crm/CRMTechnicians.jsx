import { useState, useEffect } from "react";
import "./crm.css";

const TEAM = [
  { id: "TECH-001", name: "Sanjeet Varma",   mobile: "8898720011", role: "Senior Technician", zone: "West", services: ["General Pest","Bed Bug","Termite"] },
  { id: "TECH-002", name: "Deepak Sonawane", mobile: "9152560389", role: "Technician",        zone: "Central", services: ["General Pest","Deep Cleaning","Termite"] },
];

const emptyJob = () => ({
  techId:"", date: new Date().toLocaleDateString("en-IN"), customerId:"", customerName:"",
  address:"", plan:"", startTime:"", endTime:"", status:"Assigned",
  chemical1:"", chemical1Qty:"", chemical2:"", chemical2Qty:"",
  gelDone:"No", expense:"", expenseNote:"", paymentCollected:"", paymentMethod:"Cash",
  notes:"",
});

export default function CRMTechnicians() {
  const [jobs,      setJobs]      = useState([]);
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(emptyJob());
  const [selTech,   setSelTech]   = useState(null);
  const [activeTab, setActiveTab] = useState("today");

  const user = JSON.parse(localStorage.getItem("crm_user") || "{}");

  useEffect(() => {
    const s = localStorage.getItem("nt_jobs");
    if(s) setJobs(JSON.parse(s));
  }, []);

  const save = (list) => { localStorage.setItem("nt_jobs",JSON.stringify(list)); setJobs(list); };

  const handleSave = () => {
    if(!form.customerName||!form.techId) return alert("Select technician and customer");
    save([{ ...form, id:`JOB-${Date.now()}`, addedBy:user.name }, ...jobs]);
    setShowForm(false); setForm(emptyJob());
  };

  const today = new Date().toLocaleDateString("en-IN");

  const todayJobs = jobs.filter(j => j.date === today);
  const allJobs   = jobs;

  return (
    <div className="crm-page">
      <div className="crm-page-header">
        <div><h2>👷 Technicians</h2><p className="crm-page-sub">Daily jobs · Attendance · Chemicals · Expenses · Payments</p></div>
        <button className="crm-btn-primary" onClick={()=>setShowForm(true)}>➕ Assign Job</button>
      </div>

      {/* Technician Cards */}
      <div className="tech-cards">
        {TEAM.map(t => {
          const tjobs = jobs.filter(j => j.techId===t.id && j.date===today);
          const done  = tjobs.filter(j=>j.status==="Done").length;
          return (
            <div key={t.id} className={`tech-card ${selTech?.id===t.id?"selected":""}`} onClick={()=>setSelTech(selTech?.id===t.id?null:t)}>
              <div className="tech-card-av">{t.name.charAt(0)}</div>
              <div className="tech-card-info">
                <div className="tech-card-name">{t.name}</div>
                <div className="tech-card-role">{t.role} · Zone {t.zone}</div>
                <div className="tech-card-mobile">📱 {t.mobile}</div>
              </div>
              <div className="tech-card-stats">
                <div className="tech-stat"><span className="tech-stat-val">{tjobs.length}</span><span className="tech-stat-lbl">Today</span></div>
                <div className="tech-stat"><span className="tech-stat-val" style={{color:"#059669"}}>{done}</span><span className="tech-stat-lbl">Done</span></div>
                <div className="tech-stat"><span className="tech-stat-val" style={{color:"#d97706"}}>{tjobs.length-done}</span><span className="tech-stat-lbl">Pending</span></div>
              </div>
              <div className="tech-card-services">
                {t.services.map(s=><span key={s} className="tech-service-tag">{s}</span>)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="crm-tabs">
        {[["today","Today's Jobs"],["all","All Jobs"]].map(([k,l])=>(
          <button key={k} className={`crm-tab ${activeTab===k?"active":""}`} onClick={()=>setActiveTab(k)}>{l}</button>
        ))}
      </div>

      <JobTable jobs={activeTab==="today"?todayJobs:allJobs} onUpdate={(id,field,val)=>{
        save(jobs.map(j=>j.id===id?{...j,[field]:val}:j));
      }} />

      {showForm && (
        <div className="crm-modal-overlay" onClick={()=>setShowForm(false)}>
          <div className="crm-modal crm-modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="crm-modal-header">
              <h3>➕ Assign Job</h3>
              <button className="crm-modal-close" onClick={()=>setShowForm(false)}>✕</button>
            </div>
            <div className="crm-modal-body">
              <div className="crm-form-grid">
                <div className="crm-form-group"><label>Technician *</label>
                  <select className="crm-input" value={form.techId} onChange={e=>setForm({...form,techId:e.target.value})}>
                    <option value="">Select</option>
                    {TEAM.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="crm-form-group"><label>Date</label>
                  <input type="date" className="crm-input" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
                </div>
                <div className="crm-form-group"><label>Customer ID</label>
                  <input className="crm-input" value={form.customerId} onChange={e=>setForm({...form,customerId:e.target.value})} />
                </div>
                <div className="crm-form-group"><label>Customer Name *</label>
                  <input className="crm-input" value={form.customerName} onChange={e=>setForm({...form,customerName:e.target.value})} />
                </div>
                <div className="crm-form-group" style={{gridColumn:"span 2"}}><label>Address</label>
                  <input className="crm-input" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
                </div>
                <div className="crm-form-group"><label>Service Plan</label>
                  <input className="crm-input" value={form.plan} onChange={e=>setForm({...form,plan:e.target.value})} />
                </div>
                <div className="crm-form-group"><label>Expected Payment (₹)</label>
                  <input className="crm-input" type="number" value={form.paymentCollected} onChange={e=>setForm({...form,paymentCollected:e.target.value})} />
                </div>
                <div className="crm-form-group"><label>Chemical 1</label>
                  <input className="crm-input" placeholder="Cypermethrin" value={form.chemical1} onChange={e=>setForm({...form,chemical1:e.target.value})} />
                </div>
                <div className="crm-form-group"><label>Qty 1</label>
                  <input className="crm-input" placeholder="50ml" value={form.chemical1Qty} onChange={e=>setForm({...form,chemical1Qty:e.target.value})} />
                </div>
                <div className="crm-form-group"><label>Notes</label>
                  <textarea className="crm-input" rows={2} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
                </div>
              </div>
            </div>
            <div className="crm-modal-footer">
              <button className="crm-btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
              <button className="crm-btn-primary" onClick={handleSave}>💾 Assign Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function JobTable({ jobs, onUpdate }) {

  if(jobs.length===0) return <div className="crm-empty-state"><span>👷</span><p>No jobs found</p></div>;
  return (
    <div className="crm-table-wrap">
      <table className="crm-table">
        <thead><tr>
          <th>Date</th><th>Customer</th><th>Address</th><th>Plan</th>
          <th>Chemicals</th><th>Expense</th><th>Payment</th><th>Status</th><th>Gel Done</th>
        </tr></thead>
        <tbody>
          {jobs.map((j,i)=>(
            <tr key={i}>
              <td>{j.date}</td>
              <td><div className="crm-customer-name">{j.customerName}</div><div className="crm-id">{j.customerId}</div></td>
              <td style={{fontSize:"0.8rem",maxWidth:150}}>{j.address}</td>
              <td className="crm-plan">{j.plan}</td>
              <td style={{fontSize:"0.78rem"}}>{j.chemical1} {j.chemical1Qty}<br/>{j.chemical2} {j.chemical2Qty}</td>
              <td>₹{j.expense||"0"}<br/><small>{j.expenseNote}</small></td>
              <td><strong>₹{j.paymentCollected||"0"}</strong><br/><small>{j.paymentMethod}</small></td>
              <td>
                <select className="crm-select" style={{fontSize:"0.75rem",padding:"3px 6px"}}
                  value={j.status} onChange={e=>onUpdate(j.id,"status",e.target.value)}>
                  {["Assigned","In Progress","Done","Cancelled"].map(s=><option key={s}>{s}</option>)}
                </select>
              </td>
              <td>
                <select className="crm-select" style={{fontSize:"0.75rem",padding:"3px 6px"}}
                  value={j.gelDone} onChange={e=>onUpdate(j.id,"gelDone",e.target.value)}>
                  <option>No</option><option>Yes</option><option>Scheduled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
