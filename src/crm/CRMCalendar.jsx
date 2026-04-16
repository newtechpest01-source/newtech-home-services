import { useState, useEffect } from "react";
import "./crm.css";

const TECHNICIANS = ["Sanjeet Varma","Deepak Sonawane"];
const TIME_SLOTS  = ["8:00 AM – 10:00 AM","10:00 AM – 12:00 PM","12:00 PM – 2:00 PM","2:00 PM – 4:00 PM","4:00 PM – 6:00 PM","6:00 PM – 8:00 PM"];
const STATUSES    = ["Scheduled","Confirmed","Done","Postponed","Cancelled","Overdue"];

const STATUS_COLOR = { Scheduled:"blue", Confirmed:"teal", Done:"green", Postponed:"yellow", Cancelled:"red", Overdue:"red" };

const diffDays = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  let d;
  if (parts.length === 3) {
    d = new Date(2000 + parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  } else {
    d = new Date(dateStr);
  }
  return Math.ceil((d - new Date()) / 86400000);
};

const emptyService = () => ({
  customerId: "", customerName: "", mobile: "", treatment: "", plan: "", serviceNo: "",
  scheduledDate: "", timeSlot: "", technician: "", status: "Scheduled",
  gelRequired: "No", gelSameDay: "", gelScheduledDate: "",
  confirmStatus: "Pending", d15Sent: "No", d7Sent: "No", d3Sent: "No",
  notes: "", zone: "",
});

export default function CRMCalendar() {
  const [services,  setServices]  = useState([]);
  const [filter,    setFilter]    = useState("All");
  const [techFilter,setTechFilter]= useState("All");
  const [search,    setSearch]    = useState("");
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(emptyService());
  const [activeView,setActiveView]= useState("alerts");

  const user = JSON.parse(localStorage.getItem("crm_user") || "{}");

  useEffect(() => {
    const stored = localStorage.getItem("nt_services");
    if (stored) setServices(JSON.parse(stored));
  }, []);

  const save = (list) => {
    localStorage.setItem("nt_services", JSON.stringify(list));
    setServices(list);
  };

  const handleSave = () => {
    if (!form.customerName || !form.scheduledDate) return alert("Customer name and date required");
    const newSvc = { ...form, id: `SVC-${Date.now()}`, addedBy: user.name, addedOn: new Date().toLocaleDateString("en-IN") };
    save([newSvc, ...services]);
    setShowForm(false);
    setForm(emptyService());
  };

  const updateStatus = (id, status) => {
    save(services.map(s => s.id === id ? { ...s, status } : s));
  };

  // Auto-mark overdue
  const enriched = services.map(s => {
    const d = diffDays(s.scheduledDate);
    if (d !== null && d < 0 && s.status === "Scheduled") return { ...s, status: "Overdue", overdueDays: Math.abs(d) };
    return { ...s, diff: d };
  });

  // Alert buckets
  const urgent    = enriched.filter(s => (s.diff !== null && s.diff <= 0) || s.status === "Overdue");
  const noResp    = enriched.filter(s => s.diff !== null && s.diff > 0 && s.diff <= 15 && s.confirmStatus === "Pending");
  const thisWeek  = enriched.filter(s => s.diff !== null && s.diff > 0 && s.diff <= 7);
  const next30    = enriched.filter(s => s.diff !== null && s.diff > 7 && s.diff <= 30);
  const gelPending = enriched.filter(s => s.gelRequired === "Yes" && s.gelSameDay === "No" && (!s.gelScheduledDate || diffDays(s.gelScheduledDate) >= 0) && s.status !== "Done");

  const filtered = enriched.filter(s => {
    const q = search.toLowerCase();
    const mQ = !q || (s.customerName||"").toLowerCase().includes(q) || (s.customerId||"").toLowerCase().includes(q) || (s.mobile||"").includes(q);
    const mF = filter === "All" || s.status === filter;
    const mT = techFilter === "All" || s.technician === techFilter;
    return mQ && mF && mT;
  });

  return (
    <div className="crm-page">
      <div className="crm-page-header">
        <div>
          <h2>📆 Service Calendar</h2>
          <p className="crm-page-sub">Zero missed services — Schedule · Track · Notify · Complete</p>
        </div>
        <button className="crm-btn-primary" onClick={() => setShowForm(true)}>➕ Schedule Service</button>
      </div>

      {/* Alert summary pills */}
      <div className="cal-alert-pills">
        <div className="cal-pill red" onClick={() => setActiveView("alerts")}>
          🚨 {urgent.length} Urgent
        </div>
        <div className="cal-pill orange" onClick={() => setActiveView("noresponse")}>
          ⚠️ {noResp.length} No Response
        </div>
        <div className="cal-pill blue" onClick={() => setActiveView("week")}>
          📅 {thisWeek.length} This Week
        </div>
        <div className="cal-pill purple" onClick={() => setActiveView("month")}>
          📆 {next30.length} Next 30 Days
        </div>
        <div className="cal-pill teal" onClick={() => setActiveView("gel")}>
          🧪 {gelPending.length} Gel Pending
        </div>
        <div className="cal-pill gray" onClick={() => setActiveView("all")}>
          📋 {enriched.length} All
        </div>
      </div>

      {/* View: Alerts */}
      {activeView === "alerts" && (
        <CalSection title="🚨 Urgent — Today & Overdue" color="red" items={urgent}
          onUpdate={updateStatus} empty="No urgent items ✅" />
      )}

      {activeView === "noresponse" && (
        <CalSection title="⚠️ No Response to Notifications" color="orange" items={noResp}
          onUpdate={updateStatus} empty="All customers confirmed ✅" />
      )}

      {activeView === "week" && (
        <CalSection title="📅 This Week" color="blue" items={thisWeek}
          onUpdate={updateStatus} empty="No services this week" />
      )}

      {activeView === "month" && (
        <CalSection title="📆 Next 30 Days" color="purple" items={next30}
          onUpdate={updateStatus} empty="No services in next 30 days" />
      )}

      {activeView === "gel" && (
        <CalSection title="🧪 Gel Treatments Pending" color="teal" items={gelPending}
          onUpdate={updateStatus} empty="No gel treatments pending ✅" />
      )}

      {activeView === "all" && (
        <>
          <div className="crm-filters">
            <input className="crm-search" placeholder="🔍 Search customer, ID, mobile..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="crm-select" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="All">All Status</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="crm-select" value={techFilter} onChange={e => setTechFilter(e.target.value)}>
              <option value="All">All Technicians</option>
              {TECHNICIANS.map(t => <option key={t}>{t}</option>)}
            </select>
            <span className="crm-count-badge">{filtered.length}</span>
          </div>
          <CalSection title="📋 All Services" color="gray" items={filtered}
            onUpdate={updateStatus} empty="No services scheduled yet" />
        </>
      )}

      {/* ── ADD SERVICE FORM ── */}
      {showForm && (
        <div className="crm-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="crm-modal crm-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="crm-modal-header">
              <h3>📅 Schedule New Service</h3>
              <button className="crm-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="crm-modal-body">
              <div className="crm-form-grid">
                <div className="crm-form-group">
                  <label>Customer ID</label>
                  <input className="crm-input" placeholder="NT-DD-MM-YY-001" value={form.customerId} onChange={e => setForm({...form,customerId:e.target.value})} />
                </div>
                <div className="crm-form-group">
                  <label>Customer Name *</label>
                  <input className="crm-input" value={form.customerName} onChange={e => setForm({...form,customerName:e.target.value})} />
                </div>
                <div className="crm-form-group">
                  <label>Mobile</label>
                  <input className="crm-input" type="tel" value={form.mobile} onChange={e => setForm({...form,mobile:e.target.value})} />
                </div>
                <div className="crm-form-group">
                  <label>Treatment Type *</label>
                  <select className="crm-input" value={form.treatment} onChange={e => setForm({...form,treatment:e.target.value})}>
                    <option value="">Select Treatment</option>
                    <option>General Pest Control</option>
                    <option>Bed Bug Treatment</option>
                    <option>Termite Treatment</option>
                    <option>Mosquito Control</option>
                    <option>Rodent Control</option>
                    <option>Deep Cleaning</option>
                    <option>Kitchen Cleaning</option>
                    <option>Bathroom Cleaning</option>
                    <option>Sofa Cleaning</option>
                    <option>Carpet Cleaning</option>
                    <option>Society Pest Control</option>
                  </select>
                </div>
                <div className="crm-form-group">
                  <label>Service Plan</label>
                  <input className="crm-input" placeholder="AMC 3 Services" value={form.plan} onChange={e => setForm({...form,plan:e.target.value})} />
                </div>
                <div className="crm-form-group">
                  <label>Service No</label>
                  <input className="crm-input" placeholder="1 of 3" value={form.serviceNo} onChange={e => setForm({...form,serviceNo:e.target.value})} />
                </div>
                <div className="crm-form-group">
                  <label>Scheduled Date *</label>
                  <input className="crm-input" type="date" value={form.scheduledDate} onChange={e => setForm({...form,scheduledDate:e.target.value})} />
                </div>
                <div className="crm-form-group">
                  <label>Time Slot</label>
                  <select className="crm-input" value={form.timeSlot} onChange={e => setForm({...form,timeSlot:e.target.value})}>
                    <option value="">Select Slot</option>
                    {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="crm-form-group">
                  <label>Assign Technician</label>
                  <select className="crm-input" value={form.technician} onChange={e => setForm({...form,technician:e.target.value})}>
                    <option value="">Select Technician</option>
                    {TECHNICIANS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="crm-form-group">
                  <label>Gel Treatment Required?</label>
                  <select className="crm-input" value={form.gelRequired} onChange={e => setForm({...form,gelRequired:e.target.value})}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {form.gelRequired === "Yes" && (
                  <div className="crm-form-group">
                    <label>Gel Same Day?</label>
                    <select className="crm-input" value={form.gelSameDay} onChange={e => setForm({...form,gelSameDay:e.target.value})}>
                      <option value="">Decide after 1st visit</option>
                      <option value="Yes">Yes — same day</option>
                      <option value="No">No — 7 days later</option>
                    </select>
                  </div>
                )}
                <div className="crm-form-group" style={{gridColumn:"span 2"}}>
                  <label>Notes</label>
                  <textarea className="crm-input" rows={2} value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} placeholder="Customer day preference, special instructions..." />
                </div>
              </div>

              <div className="cal-notify-preview">
                <div className="cal-notify-title">🔔 Notification Schedule (Auto)</div>
                <div className="cal-notify-row">
                  <span className="cal-tag orange">D-15</span>
                  <span>WhatsApp reminder will be sent 15 days before service</span>
                </div>
                <div className="cal-notify-row">
                  <span className="cal-tag blue">D-7</span>
                  <span>7-day reminder sent. No response → CRM alert</span>
                </div>
                <div className="cal-notify-row">
                  <span className="cal-tag purple">D-3</span>
                  <span>3-day reminder. No response → Urgent alert to manager</span>
                </div>
                <div className="cal-notify-row">
                  <span className="cal-tag green">12Hr</span>
                  <span>Morning of service — technician name + time sent</span>
                </div>
                <div className="cal-notify-row">
                  <span className="cal-tag green">6Hr</span>
                  <span>Technician on the way — contact number shared</span>
                </div>
              </div>
            </div>
            <div className="crm-modal-footer">
              <button className="crm-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="crm-btn-primary" onClick={handleSave}>📅 Schedule Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CalSection({ title, color, items, onUpdate, empty }) {
  return (
    <div className={`cal-section cal-section-${color}`}>
      <div className="cal-section-title">{title} <span className="crm-count-badge">{items.length}</span></div>
      {items.length === 0 ? (
        <div className="dash-empty">{empty}</div>
      ) : (
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Customer</th><th>Service</th><th>Date</th>
                <th>Time Slot</th><th>Technician</th><th>Status</th>
                <th>Confirm</th><th>Notifications</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s, i) => {
                const d = s.diff;
                return (
                  <tr key={i} className={s.status === "Overdue" || (d !== null && d < 0) ? "crm-today-row" : ""}>
                    <td>
                      <div className="crm-customer-name">{s.customerName}</div>
                      <div className="crm-customer-phone">{s.mobile}</div>
                      <div className="crm-id" style={{marginTop:2}}>{s.customerId}</div>
                    </td>
                    <td>
                      <div className="crm-plan" style={{fontWeight:700,color:"#0f172a"}}>{s.treatment||"—"}</div>
                      <div className="crm-plan" style={{marginTop:2}}>{s.plan}</div>
                      <div style={{fontSize:"0.75rem",color:"#64748b"}}>{s.serviceNo}</div>
                    </td>
                    <td>
                      <div>{s.scheduledDate}</div>
                      {d !== null && (
                        <div className={`cal-days-tag ${d < 0 ? "red" : d === 0 ? "orange" : d <= 3 ? "yellow" : "blue"}`}>
                          {d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? "TODAY" : `D-${d}`}
                        </div>
                      )}
                    </td>
                    <td>{s.timeSlot||"—"}</td>
                    <td>{s.technician||<span style={{color:"#ef4444"}}>Unassigned</span>}</td>
                    <td>
                      <span className={`crm-status crm-status-${STATUS_COLOR[s.status]||"blue"}`}>{s.status}</span>
                    </td>
                    <td>
                      <span className={`crm-status ${s.confirmStatus==="Confirmed"?"crm-status-green":"crm-status-yellow"}`}>
                        {s.confirmStatus||"Pending"}
                      </span>
                    </td>
                    <td>
                      <div style={{display:"flex",flexDirection:"column",gap:2,fontSize:"0.7rem"}}>
                        <span style={{color: s.d15Sent==="Yes"?"#059669":"#94a3b8"}}>D-15: {s.d15Sent||"No"}</span>
                        <span style={{color: s.d7Sent==="Yes"?"#059669":"#94a3b8"}}>D-7: {s.d7Sent||"No"}</span>
                        <span style={{color: s.d3Sent==="Yes"?"#059669":"#94a3b8"}}>D-3: {s.d3Sent||"No"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="crm-actions" style={{flexDirection:"column",gap:4}}>
                        <select className="crm-select" style={{fontSize:"0.75rem",padding:"3px 6px"}}
                          value={s.status} onChange={e => onUpdate(s.id, e.target.value)}>
                          {STATUSES.map(st => <option key={st}>{st}</option>)}
                        </select>
                        {s.mobile && <a href={`https://wa.me/91${s.mobile}`} target="_blank" rel="noreferrer" className="crm-btn-wa" style={{fontSize:"0.8rem"}}>💬</a>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
