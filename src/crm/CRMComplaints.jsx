import { useState, useEffect } from "react";
import "./crm.css";

const TYPES      = ["Service Quality","Rescheduling","Payment Issue","Technician Behavior","Chemical Smell","No Show","Incomplete Work","Other"];
const PRIORITIES = ["Low","Medium","High","Critical"];
const STATUSES   = ["Open","In Progress","Resolved","Closed","Cancelled"];

const emptyComp = () => ({
  customerId:"", customerName:"", mobile:"", serviceDate:"",
  type:"", priority:"Medium", description:"", assignedTo:"",
  status:"Open", resolution:"",
});

export default function CRMComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [showForm,   setShowForm]   = useState(false);
  const [form,       setForm]       = useState(emptyComp());
  const [filter,     setFilter]     = useState("All");
  const user = JSON.parse(localStorage.getItem("crm_user") || "{}");

  useEffect(() => {
    const s = localStorage.getItem("nt_complaints");
    if(s) setComplaints(JSON.parse(s));
  }, []);

  const save = (list) => { localStorage.setItem("nt_complaints",JSON.stringify(list)); setComplaints(list); };
  const handleSave = () => {
    if(!form.customerName) return alert("Customer name required");
    save([{ ...form, id:`COMP-${Date.now()}`, raisedOn:new Date().toLocaleDateString("en-IN"), addedBy:user.name }, ...complaints]);
    setShowForm(false); setForm(emptyComp());
  };
  const updateStatus = (id,status) => save(complaints.map(c=>c.id===id?{...c,status}:c));

  const filtered = complaints.filter(c => filter==="All" || c.status===filter);
  const open = complaints.filter(c=>c.status==="Open").length;
  const PRIORITY_COLOR = { Low:"blue", Medium:"orange", High:"red", Critical:"red" };
  const STATUS_COLOR   = { Open:"red","In Progress":"orange", Resolved:"green", Closed:"teal", Cancelled:"yellow" };

  return (
    <div className="crm-page">
      <div className="crm-page-header">
        <div><h2>⚠️ Complaints</h2><p className="crm-page-sub">Track · Resolve · Close — every complaint linked to Customer ID</p></div>
        <button className="crm-btn-primary" onClick={()=>setShowForm(true)}>➕ Log Complaint</button>
      </div>

      {open>0 && <div className="inv-alert">🔴 <strong>{open} open complaint{open!==1?"s":""}</strong> require attention!</div>}

      <div className="crm-filter-tabs" style={{marginBottom:16}}>
        {["All","Open","In Progress","Resolved","Closed"].map(s=>(
          <button key={s} className={`crm-filter-tab ${filter===s?"active":""}`} onClick={()=>setFilter(s)}>{s}</button>
        ))}
      </div>

      {filtered.length===0 ? <div className="crm-empty-state"><span>⚠️</span><p>No complaints {filter!=="All"?`with status "${filter}"`:"found"}</p></div> : (
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead><tr><th>Complaint ID</th><th>Date</th><th>Customer</th><th>Type</th><th>Priority</th><th>Assigned To</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((c,i)=>(
                <tr key={i}>
                  <td><span className="crm-id">{c.id}</span></td>
                  <td>{c.raisedOn}</td>
                  <td>
                    <div className="crm-customer-name">{c.customerName}</div>
                    <div className="crm-customer-phone">{c.mobile}</div>
                    <div className="crm-id">{c.customerId}</div>
                  </td>
                  <td>{c.type}</td>
                  <td><span className={`crm-status crm-status-${PRIORITY_COLOR[c.priority]||"blue"}`}>{c.priority}</span></td>
                  <td>{c.assignedTo||"—"}</td>
                  <td><span className={`crm-status crm-status-${STATUS_COLOR[c.status]||"blue"}`}>{c.status}</span></td>
                  <td>
                    <select className="crm-select" style={{fontSize:"0.75rem",padding:"3px 6px"}}
                      value={c.status} onChange={e=>updateStatus(c.id,e.target.value)}>
                      {STATUSES.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="crm-modal-overlay" onClick={()=>setShowForm(false)}>
          <div className="crm-modal crm-modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="crm-modal-header">
              <h3>⚠️ Log Complaint</h3>
              <button className="crm-modal-close" onClick={()=>setShowForm(false)}>✕</button>
            </div>
            <div className="crm-modal-body">
              <div className="crm-form-grid">
                <div className="crm-form-group"><label>Customer ID</label><input className="crm-input" value={form.customerId} onChange={e=>setForm({...form,customerId:e.target.value})} /></div>
                <div className="crm-form-group"><label>Customer Name *</label><input className="crm-input" value={form.customerName} onChange={e=>setForm({...form,customerName:e.target.value})} /></div>
                <div className="crm-form-group"><label>Mobile</label><input className="crm-input" type="tel" value={form.mobile} onChange={e=>setForm({...form,mobile:e.target.value})} /></div>
                <div className="crm-form-group"><label>Service Date</label><input type="date" className="crm-input" value={form.serviceDate} onChange={e=>setForm({...form,serviceDate:e.target.value})} /></div>
                <div className="crm-form-group"><label>Complaint Type</label>
                  <select className="crm-input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                    <option value="">Select</option>
                    {TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="crm-form-group"><label>Priority</label>
                  <select className="crm-input" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                    {PRIORITIES.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="crm-form-group"><label>Assigned To</label><input className="crm-input" value={form.assignedTo||user.name} onChange={e=>setForm({...form,assignedTo:e.target.value})} /></div>
                <div className="crm-form-group" style={{gridColumn:"span 2"}}><label>Description *</label>
                  <textarea className="crm-input" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the complaint in detail..." />
                </div>
              </div>
            </div>
            <div className="crm-modal-footer">
              <button className="crm-btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
              <button className="crm-btn-primary" onClick={handleSave}>💾 Save Complaint</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
