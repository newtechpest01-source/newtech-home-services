import { useState, useEffect } from "react";
import "./crm.css";



const TREATMENT_TYPES = ["General Pest Control","Bed Bug Treatment","Termite Treatment","Mosquito Control","Rodent Control","Deep Cleaning","Kitchen Cleaning","Bathroom Cleaning","Sofa Cleaning","Carpet Cleaning","Society Pest Control"];
const SERVICE_PLANS   = ["Single Service 30 Days","Single Service 90 Days","AMC 3 Services","AMC 4 Services","Bed Bug 45 Days","Bed Bug 90 Days","Bed Bug 180 Days","Bed Bug AMC 8 Services","Termite 1 Year","Termite 2 Year","Termite 3 Year","Society Weekly","Society Fortnightly","Society Monthly","Society Quarterly"];
const COMM_TYPES      = ["Inbound Call","Outbound Call","WhatsApp","Email","Site Visit","Auto Notification"];
const COMM_RESPONSE   = ["Confirmed","Reschedule Request","No Answer","Call Back Later","Not Interested","Complaint"];
const CATEGORIES      = ["Residential","Commercial","Society","Industrial"];
const PREMISE_CATS    = ["Apartment","House","Bungalow","Office","Restaurant","Society","Warehouse"];
const TECHNICIANS     = ["Sanjeet Varma","Deepak Sonawane"];
const LEAD_SOURCES    = ["JustDial","Google Ads","Website","Phone Call","WhatsApp","Referral","Walk-in","Instagram","Facebook","Other"];

const genCustomerId = () => {
  const d  = new Date();
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yy = String(d.getFullYear()).slice(-2);
  const serial = String(Math.floor(Math.random()*900)+100);
  return `NT-${dd}-${mm}-${yy}-${serial}`;
};

const emptyCustomer = () => ({
  customerId: genCustomerId(), leadId: "", source: "", category: "Residential",
  name: "", mobile: "", altMobile: "", email: "", location: "", address: "",
  pincode: "", landmark: "", zone: "", department: "Pest Control",
  treatment: "", premiseCat: "", premiseType: "", plan: "", chemical: "Odourless",
  numServices: "", contractPeriod: "", startDate: "", endDate: "", dayPref: "", timePref: "",
  price: "", discount: "", finalPrice: "", gst: "No", paymentMode: "", paymentMethod: "",
  paymentDate: "", paymentRemark: "", technician: "", crmAgent: "", status: "Active",
  isExisting: "No", remarks: "",
});

const emptyComm = () => ({
  type: "Outbound Call", purpose: "Follow-up", summary: "",
  response: "", nextAction: "", nextDate: "",
});

export default function CRMCustomers() {
  const [customers,   setCustomers]   = useState([]);
  
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState("All");
  const [showForm,    setShowForm]    = useState(false);
  const [form,        setForm]        = useState(emptyCustomer());
  const [saving,      setSaving]      = useState(false);
  const [selected,    setSelected]    = useState(null);
  const [showDetail,  setShowDetail]  = useState(false);
  const [commLog,     setCommLog]     = useState([]);
  const [commForm,    setCommForm]    = useState(emptyComm());
  const [addingComm,  setAddingComm]  = useState(false);
  const [activeTab,   setActiveTab]   = useState("profile");

  const user = JSON.parse(localStorage.getItem("crm_user") || "{}");

  // For now using localStorage as demo — will connect to Sheets
  useEffect(() => {
    const stored = localStorage.getItem("nt_customers");
    if (stored) setCustomers(JSON.parse(stored));
  }, []);

  const saveToLocal = (list) => {
    localStorage.setItem("nt_customers", JSON.stringify(list));
    setCustomers(list);
  };

  const handleSave = async () => {
    if (!form.name || !form.mobile) return alert("Name and Mobile required");
    setSaving(true);
    const newCustomer = {
      ...form,
      addedBy: user.name,
      addedOn: new Date().toLocaleDateString("en-IN"),
      commLog: [],
    };
    const updated = [newCustomer, ...customers];
    saveToLocal(updated);
    setShowForm(false);
    setForm(emptyCustomer());
    setSaving(false);
  };

  const handleAddComm = () => {
    if (!commForm.summary) return alert("Please add a summary");
    const log = {
      ...commForm,
      logId:    `LOG-${Date.now()}`,
      date:     new Date().toLocaleDateString("en-IN"),
      time:     new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      agent:    user.name,
    };
    const updated = customers.map(c =>
      c.customerId === selected.customerId
        ? { ...c, commLog: [log, ...(c.commLog || [])] }
        : c
    );
    saveToLocal(updated);
    const updatedCustomer = updated.find(c => c.customerId === selected.customerId);
    setSelected(updatedCustomer);
    setCommLog(updatedCustomer.commLog || []);
    setCommForm(emptyComm());
    setAddingComm(false);
  };

  const openDetail = (c) => {
    setSelected(c);
    setCommLog(c.commLog || []);
    setShowDetail(true);
    setActiveTab("profile");
  };

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.mobile.includes(q) || (c.location||"").toLowerCase().includes(q) || (c.customerId||"").toLowerCase().includes(q);
    const matchF = filter === "All" || c.status === filter;
    return matchQ && matchF;
  });

  const STATUS_COLORS = { Active: "green", Inactive: "yellow", Expired: "red", Cancelled: "red", Renewed: "blue" };

  return (
    <div className="crm-page">
      <div className="crm-page-header">
        <div>
          <h2>👤 Customers</h2>
          <p className="crm-page-sub">Customer 360° — Profile · Services · Communication · Payments</p>
        </div>
        <button className="crm-btn-primary" onClick={() => { setForm(emptyCustomer()); setShowForm(true); }}>
          ➕ Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="crm-mini-stats">
        {[
          { label: "Total", value: customers.length, color: "#2563eb" },
          { label: "Active", value: customers.filter(c => c.status === "Active").length, color: "#059669" },
          { label: "Expired", value: customers.filter(c => c.status === "Expired").length, color: "#dc2626" },
          { label: "Due Renewal", value: customers.filter(c => c.status === "Active" && c.endDate && (new Date(c.endDate) - new Date()) < 30 * 86400000).length, color: "#d97706" },
        ].map((s, i) => (
          <div key={i} className="crm-mini-stat" style={{ borderLeft: `3px solid ${s.color}` }}>
            <div className="crm-mini-stat-val" style={{ color: s.color }}>{s.value}</div>
            <div className="crm-mini-stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="crm-filters">
        <input className="crm-search" placeholder="🔍 Search by name, mobile, ID, area..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="crm-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All Status</option>
          {["Active","Inactive","Expired","Cancelled","Renewed"].map(s => <option key={s}>{s}</option>)}
        </select>
        <span className="crm-count-badge">{filtered.length} customers</span>
        <button className="crm-refresh-btn" onClick={() => { const s = localStorage.getItem("nt_customers"); if(s) setCustomers(JSON.parse(s)); }}>🔄</button>
      </div>

      {filtered.length === 0 ? (
        <div className="crm-empty-state">
          <span>👤</span>
          <p>No customers yet</p>
          <button className="crm-btn-primary" onClick={() => setShowForm(true)}>➕ Add First Customer</button>
        </div>
      ) : (
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Customer ID</th><th>Customer</th><th>Location</th>
                <th>Treatment</th><th>Plan</th><th>Contract</th>
                <th>Technician</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i} onClick={() => openDetail(c)} style={{ cursor: "pointer" }}>
                  <td><span className="crm-id">{c.customerId}</span></td>
                  <td>
                    <div className="crm-customer-name">{c.name}</div>
                    <div className="crm-customer-phone">{c.mobile}</div>
                  </td>
                  <td>{c.location}</td>
                  <td className="crm-plan">{c.treatment}</td>
                  <td className="crm-plan">{c.plan}</td>
                  <td>
                    <div style={{ fontSize: "0.78rem" }}>{c.startDate} →</div>
                    <div style={{ fontSize: "0.78rem" }}>{c.endDate}</div>
                  </td>
                  <td>{c.technician || "—"}</td>
                  <td>
                    <span className={`crm-status crm-status-${STATUS_COLORS[c.status] || "blue"}`}>{c.status}</span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="crm-actions">
                      <a href={`https://wa.me/91${c.mobile}`} target="_blank" rel="noreferrer" className="crm-btn-wa">💬</a>
                      <a href={`tel:${c.mobile}`} className="crm-btn-call">📞</a>
                      <button className="crm-btn-edit" onClick={() => openDetail(c)}>👁️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ADD CUSTOMER FORM ── */}
      {showForm && (
        <div className="crm-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="crm-modal crm-modal-xl" onClick={e => e.stopPropagation()}>
            <div className="crm-modal-header">
              <h3>➕ Add Customer — <span style={{color:"#2563eb"}}>{form.customerId}</span></h3>
              <button className="crm-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="crm-modal-body">

              {/* Existing customer toggle */}
              <div className="crm-form-section">
                <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
                  <input type="checkbox" checked={form.isExisting==="Yes"} onChange={e => setForm({...form, isExisting: e.target.checked?"Yes":"No"})} />
                  <span>📋 This is an <strong>existing customer</strong> (migrating old data)</span>
                </label>
              </div>

              <div className="crm-form-section">
                <div className="crm-form-section-title">📋 Identification</div>
                <div className="crm-form-grid">
                  <F label="Lead Source" type="select" options={LEAD_SOURCES} val={form.source} set={v => setForm({...form,source:v})} />
                  <F label="Customer Category" type="select" options={CATEGORIES} val={form.category} set={v => setForm({...form,category:v})} />
                  <F label="Lead ID (if any)" val={form.leadId} set={v => setForm({...form,leadId:v})} />
                  <F label="Department" type="select" options={["Pest Control","Housekeeping","Both"]} val={form.department} set={v => setForm({...form,department:v})} />
                </div>
              </div>

              <div className="crm-form-section">
                <div className="crm-form-section-title">👤 Contact & Location</div>
                <div className="crm-form-grid">
                  <F label="Customer Name *" val={form.name} set={v => setForm({...form,name:v})} placeholder="Full name" />
                  <F label="Mobile Number *" type="tel" val={form.mobile} set={v => setForm({...form,mobile:v})} placeholder="10-digit" />
                  <F label="Alternate Mobile" type="tel" val={form.altMobile} set={v => setForm({...form,altMobile:v})} />
                  <F label="Email" type="email" val={form.email} set={v => setForm({...form,email:v})} />
                  <F label="Location / Area" val={form.location} set={v => setForm({...form,location:v})} placeholder="Andheri West" />
                  <F label="Full Address" val={form.address} set={v => setForm({...form,address:v})} />
                  <F label="Pincode" val={form.pincode} set={v => setForm({...form,pincode:v})} />
                  <F label="Landmark" val={form.landmark} set={v => setForm({...form,landmark:v})} />
                </div>
              </div>

              <div className="crm-form-section">
                <div className="crm-form-section-title">🔧 Service & Contract</div>
                <div className="crm-form-grid">
                  <F label="Treatment Type" type="select" options={TREATMENT_TYPES} val={form.treatment} set={v => setForm({...form,treatment:v})} />
                  <F label="Premise Category" type="select" options={PREMISE_CATS} val={form.premiseCat} set={v => setForm({...form,premiseCat:v})} />
                  <F label="Premise Type" val={form.premiseType} set={v => setForm({...form,premiseType:v})} placeholder="1BHK / 2BHK / Office" />
                  <F label="Service Plan" type="select" options={SERVICE_PLANS} val={form.plan} set={v => setForm({...form,plan:v})} />
                  <F label="Preferred Chemical" type="select" options={["Odourless","Odour"]} val={form.chemical} set={v => setForm({...form,chemical:v})} />
                  <F label="No. of Services" type="number" val={form.numServices} set={v => setForm({...form,numServices:v})} />
                  <F label="Contract Start" type="date" val={form.startDate} set={v => setForm({...form,startDate:v})} />
                  <F label="Contract End" type="date" val={form.endDate} set={v => setForm({...form,endDate:v})} />
                  <F label="Day Preference" type="select" options={["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Any Day"]} val={form.dayPref} set={v => setForm({...form,dayPref:v})} />
                  <F label="Time Preference" type="select" options={["Morning (8AM-12PM)","Afternoon (12PM-4PM)","Evening (4PM-8PM)","Any Time"]} val={form.timePref} set={v => setForm({...form,timePref:v})} />
                </div>
              </div>

              <div className="crm-form-section">
                <div className="crm-form-section-title">💰 Pricing & Payment</div>
                <div className="crm-form-grid">
                  <F label="Price (₹)" type="number" val={form.price} set={v => setForm({...form,price:v})} />
                  <F label="Discount (₹)" type="number" val={form.discount} set={v => setForm({...form,discount:v})} />
                  <F label="Final Price (₹)" type="number" val={form.finalPrice} set={v => setForm({...form,finalPrice:v})} />
                  <F label="GST" type="select" options={["No","Yes"]} val={form.gst} set={v => setForm({...form,gst:v})} />
                  <F label="Payment Mode" type="select" options={["Full Payment","Partial","Credit","Pending"]} val={form.paymentMode} set={v => setForm({...form,paymentMode:v})} />
                  <F label="Payment Method" type="select" options={["Cash","UPI","Bank Transfer","Cheque"]} val={form.paymentMethod} set={v => setForm({...form,paymentMethod:v})} />
                  <F label="Payment Date" type="date" val={form.paymentDate} set={v => setForm({...form,paymentDate:v})} />
                  <F label="Payment Remark" val={form.paymentRemark} set={v => setForm({...form,paymentRemark:v})} />
                </div>
              </div>

              <div className="crm-form-section">
                <div className="crm-form-section-title">👷 Assignment</div>
                <div className="crm-form-grid">
                  <F label="Assigned Technician" type="select" options={TECHNICIANS} val={form.technician} set={v => setForm({...form,technician:v})} />
                  <F label="CRM Agent" val={form.crmAgent || user.name} set={v => setForm({...form,crmAgent:v})} />
                  <F label="Remarks" val={form.remarks} set={v => setForm({...form,remarks:v})} />
                </div>
              </div>

            </div>
            <div className="crm-modal-footer">
              <button className="crm-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="crm-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "💾 Save Customer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOMER 360 DETAIL ── */}
      {showDetail && selected && (
        <div className="crm-modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="crm-modal crm-modal-xl" onClick={e => e.stopPropagation()}>
            <div className="crm-modal-header">
              <div>
                <h3>{selected.name}</h3>
                <span className="crm-id">{selected.customerId}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href={`https://wa.me/91${selected.mobile}`} target="_blank" rel="noreferrer" className="crm-btn-action green">💬</a>
                <a href={`tel:${selected.mobile}`} className="crm-btn-action blue">📞</a>
                <button className="crm-modal-close" onClick={() => setShowDetail(false)}>✕</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="crm-tabs" style={{ padding: "0 24px", borderBottom: "1px solid #e2e8f0" }}>
              {[["profile","👤 Profile"],["services","📅 Services"],["comm","💬 Communication"],["payments","💰 Payments"]].map(([k,l]) => (
                <button key={k} className={`crm-tab ${activeTab===k?"active":""}`} onClick={() => setActiveTab(k)}>{l}</button>
              ))}
            </div>

            <div className="crm-modal-body">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="detail-grid-2">
                  <div className="detail-section">
                    <h4>📋 Basic Info</h4>
                    <DetailRow icon="👤" label="Name"     value={selected.name} />
                    <DetailRow icon="📱" label="Mobile"   value={selected.mobile} />
                    <DetailRow icon="📧" label="Email"    value={selected.email||"—"} />
                    <DetailRow icon="📍" label="Location" value={selected.location} />
                    <DetailRow icon="🏠" label="Address"  value={selected.address||"—"} />
                    <DetailRow icon="🌐" label="Source"   value={selected.source||"—"} />
                  </div>
                  <div className="detail-section">
                    <h4>🔧 Service Details</h4>
                    <DetailRow icon="🐜" label="Treatment"  value={selected.treatment||"—"} />
                    <DetailRow icon="📋" label="Plan"       value={selected.plan||"—"} />
                    <DetailRow icon="🏡" label="Property"   value={`${selected.premiseCat||""} ${selected.premiseType||""}`} />
                    <DetailRow icon="🧪" label="Chemical"   value={selected.chemical||"—"} />
                    <DetailRow icon="📅" label="Contract"   value={`${selected.startDate||"?"} → ${selected.endDate||"?"}`} />
                    <DetailRow icon="👷" label="Technician" value={selected.technician||"—"} />
                  </div>
                </div>
              )}

              {/* Communication Tab */}
              {activeTab === "comm" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h4>💬 Communication Timeline</h4>
                    <button className="crm-btn-primary" onClick={() => setAddingComm(!addingComm)}>
                      {addingComm ? "✕ Cancel" : "➕ Log Communication"}
                    </button>
                  </div>

                  {addingComm && (
                    <div className="comm-form">
                      <div className="crm-form-grid">
                        <F label="Type" type="select" options={COMM_TYPES} val={commForm.type} set={v => setCommForm({...commForm,type:v})} />
                        <F label="Purpose" type="select" options={["Service Reminder","Follow-up","Complaint","Reschedule","Payment","General Enquiry"]} val={commForm.purpose} set={v => setCommForm({...commForm,purpose:v})} />
                        <F label="Customer Response" type="select" options={COMM_RESPONSE} val={commForm.response} set={v => setCommForm({...commForm,response:v})} />
                        <F label="Next Action Date" type="date" val={commForm.nextDate} set={v => setCommForm({...commForm,nextDate:v})} />
                      </div>
                      <div className="crm-form-group" style={{marginTop:12}}>
                        <label>Summary / Notes *</label>
                        <textarea className="crm-input" rows={3} placeholder="What was discussed? Customer response? Next steps?" value={commForm.summary} onChange={e => setCommForm({...commForm,summary:e.target.value})} />
                      </div>
                      <div className="crm-form-group">
                        <label>Next Action</label>
                        <input className="crm-input" placeholder="e.g. Call back on Friday, Schedule service" value={commForm.nextAction} onChange={e => setCommForm({...commForm,nextAction:e.target.value})} />
                      </div>
                      <button className="crm-btn-primary" style={{marginTop:8}} onClick={handleAddComm}>💾 Save Log</button>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="comm-timeline">
                    {commLog.length === 0 ? (
                      <div className="crm-empty">No communication logged yet</div>
                    ) : commLog.map((log, i) => (
                      <div key={i} className="comm-entry">
                        <div className="comm-entry-icon">
                          {log.type.includes("Call") ? "📞" : log.type === "WhatsApp" ? "💬" : log.type === "Site Visit" ? "🏠" : "🔔"}
                        </div>
                        <div className="comm-entry-body">
                          <div className="comm-entry-header">
                            <span className="comm-type">{log.type}</span>
                            <span className="comm-purpose">{log.purpose}</span>
                            <span className="comm-date">{log.date} {log.time}</span>
                            <span className="comm-agent">by {log.agent}</span>
                          </div>
                          <div className="comm-summary">{log.summary}</div>
                          {log.response && <div className="comm-response">Response: <strong>{log.response}</strong></div>}
                          {log.nextAction && <div className="comm-next">Next: {log.nextAction} {log.nextDate && `(${log.nextDate})`}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Tab */}
              {activeTab === "services" && (
                <div>
                  <h4>📅 Service History</h4>
                  <div className="crm-empty">Service history will appear here once services are scheduled in the Calendar module.</div>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === "payments" && (
                <div>
                  <div className="detail-section">
                    <h4>💰 Payment Details</h4>
                    <DetailRow icon="💵" label="Price"        value={`₹${selected.price||"—"}`} />
                    <DetailRow icon="🏷️" label="Discount"     value={`₹${selected.discount||"0"}`} />
                    <DetailRow icon="✅" label="Final Price"  value={`₹${selected.finalPrice||"—"}`} />
                    <DetailRow icon="📋" label="Mode"         value={selected.paymentMode||"—"} />
                    <DetailRow icon="💳" label="Method"       value={selected.paymentMethod||"—"} />
                    <DetailRow icon="📅" label="Payment Date" value={selected.paymentDate||"—"} />
                    <DetailRow icon="📝" label="Remark"       value={selected.paymentRemark||"—"} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function F({ label, type = "text", val, set, options = [], placeholder = "" }) {
  return (
    <div className="crm-form-group">
      <label>{label}</label>
      {type === "select" ? (
        <select className="crm-input" value={val} onChange={e => set(e.target.value)}>
          <option value="">Select {label}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input className="crm-input" type={type} value={val} onChange={e => set(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-icon">{icon}</span>
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}
