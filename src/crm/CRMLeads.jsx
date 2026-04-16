import { useState, useEffect } from "react";
import ServicePicker from "./ServicePicker";
import "./crm.css";

const SHEET_ID   = "1-TOoSjh2fibesbbXkPwpY8VjUrGh6H8rmnjiPpoQrVg";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyvAouj8t_PC7QFDnvEs5P0SipDJasaLEMkCRl9rkZGdVhTakpB8eg01zKTBRSgeQcW/exec";

const LEAD_SOURCES  = ["JustDial","Google Ads","Website","Phone Call","WhatsApp","Referral","Walk-in","Instagram","Facebook","NoBroker","Sulekha","Other"];
const LEAD_STATUSES = ["New","Follow-up","Quotation Shared","Survey","Waiting for Final Status","Win","Lost"];
const LOST_REASONS  = ["Price Too High","Went to Competitor","No Response","Not Interested","Budget Issue","Postponed Indefinitely","Wrong Number","Duplicate Lead"];

const STATUS_COLOR = {
  "New": "blue", "Follow-up": "orange", "Quotation Shared": "purple",
  "Survey": "teal", "Waiting for Final Status": "yellow",
  "Win": "green", "Lost": "red",
};

const emptyLead = () => ({
  leadId: "", date: new Date().toLocaleDateString("en-IN"), time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  source: "", name: "", mobile: "", altMobile: "",
  email: "", location: "", property: "", status: "New", followUpDate: "",
  notes: "", lostReason: "", assignedTo: "", remarks: "",
  // Service data from ServicePicker
  serviceData: {},
});

export default function CRMLeads() {
  const [leads,      setLeads]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [showForm,   setShowForm]   = useState(false);
  const [form,       setForm]       = useState(emptyLead());
  const [saving,     setSaving]     = useState(false);
  const [selected,   setSelected]   = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab,  setActiveTab]  = useState("all");

  const user = JSON.parse(localStorage.getItem("crm_user") || "{}");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const r    = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Website%20Leads`);
      const text = await r.text();
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = (json.table?.rows || []).map((r, i) => ({
        _idx:       i,
        leadId:     r.c[0]?.v  || `LD-${String(i+1).padStart(3,"0")}`,
        date:       r.c[1]?.v  || "",
        type:       r.c[2]?.v  || "",
        name:       r.c[3]?.v  || "",
        mobile:     r.c[4]?.v  || "",
        email:      r.c[5]?.v  || "",
        property:   r.c[6]?.v  || "",
        size:       r.c[7]?.v  || "",
        location:   r.c[8]?.v  || "",
        service:    r.c[9]?.v  || "",
        plans:      r.c[10]?.v || "",
        origPrice:  r.c[11]?.v || "",
        offer:      r.c[12]?.v || "",
        finalPrice: r.c[13]?.v || "",
        status:     r.c[14]?.v || "New",
        source:     r.c[15]?.v || "Website",
        followUpDate: "",
        notes:      "",
        assignedTo: "",
      }));
      setLeads(rows.reverse());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  // Pipeline counts
  const pipeline = LEAD_STATUSES.reduce((acc, s) => {
    acc[s] = leads.filter(l => l.status === s).length;
    return acc;
  }, {});

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchQ = !q || l.name.toLowerCase().includes(q) || (l.mobile||"").includes(q) || (l.location||"").toLowerCase().includes(q) || (l.service||"").toLowerCase().includes(q);
    const matchF = filter === "All" || l.status === filter;
    const matchS = sourceFilter === "All" || l.source === sourceFilter;
    const matchT = activeTab === "all" || (activeTab === "today" && l.date === new Date().toLocaleDateString("en-IN")) || (activeTab === "followup" && l.followUpDate === new Date().toLocaleDateString("en-IN"));
    return matchQ && matchF && matchS && matchT;
  });

  const handleSave = async () => {
    if (!form.name || !form.mobile) return alert("Name and Mobile are required");
    setSaving(true);
    try {
      const leadId = `LD-${new Date().toLocaleDateString("en-IN").split("/").join("-")}-${String(leads.length + 1).padStart(3,"0")}`;
      await fetch(SCRIPT_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveLead", ...form, leadId, addedBy: user.name }),
      });
      setShowForm(false);
      setForm(emptyLead());
      await fetchLeads();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const openDetail = (lead) => { setSelected(lead); setShowDetail(true); };

  return (
    <div className="crm-page">

      {/* Header */}
      <div className="crm-page-header">
        <div>
          <h2>🎯 Sales & Leads</h2>
          <p className="crm-page-sub">Manage all lead sources · Track pipeline · Follow-up</p>
        </div>
        <button className="crm-btn-primary" onClick={() => { setForm(emptyLead()); setShowForm(true); }}>
          ➕ Add Lead
        </button>
      </div>

      {/* Pipeline bar */}
      <div className="pipeline-bar">
        {LEAD_STATUSES.map(s => (
          <div key={s} className={`pipeline-stage ${filter === s ? "active" : ""}`}
            onClick={() => setFilter(filter === s ? "All" : s)}>
            <div className={`pipeline-dot ${STATUS_COLOR[s]}`} />
            <div className="pipeline-label">{s}</div>
            <div className="pipeline-count">{pipeline[s] || 0}</div>
          </div>
        ))}
        <div className={`pipeline-stage ${filter === "All" ? "active" : ""}`}
          onClick={() => setFilter("All")}>
          <div className="pipeline-dot gray" />
          <div className="pipeline-label">All</div>
          <div className="pipeline-count">{leads.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="crm-tabs">
        {[["all","All Leads"],["today","Today"],["followup","Follow-up Due"]].map(([k,l]) => (
          <button key={k} className={`crm-tab ${activeTab === k ? "active" : ""}`}
            onClick={() => setActiveTab(k)}>{l}</button>
        ))}
      </div>

      {/* Filters */}
      <div className="crm-filters">
        <input className="crm-search" placeholder="🔍 Search name, mobile, area, service..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="crm-select" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
          <option value="All">All Sources</option>
          {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="crm-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All Status</option>
          {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="crm-count-badge">{filtered.length} leads</span>
        <button className="crm-refresh-btn" onClick={fetchLeads}>🔄</button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="crm-loading"><div className="crm-spinner" /><p>Loading leads...</p></div>
      ) : filtered.length === 0 ? (
        <div className="crm-empty-state"><span>🎯</span><p>No leads found</p></div>
      ) : (
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>#</th><th>Lead ID</th><th>Date</th><th>Source</th>
                <th>Customer</th><th>Location</th><th>Service</th>
                <th>Price</th><th>Status</th><th>Follow-up</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={i} onClick={() => openDetail(l)} style={{ cursor: "pointer" }}>
                  <td>{filtered.length - i}</td>
                  <td><span className="crm-id">{l.leadId}</span></td>
                  <td>{l.date}</td>
                  <td><span className="crm-source-tag">{l.source || "Website"}</span></td>
                  <td>
                    <div className="crm-customer-name">{l.name}</div>
                    <div className="crm-customer-phone">{l.mobile}</div>
                  </td>
                  <td>{l.location}</td>
                  <td className="crm-plan">
                    <div>{l.serviceData?.serviceName || l.service || l.plans || "—"}</div>
                    {l.serviceData?.planName && <div style={{fontSize:"0.72rem",color:"#64748b"}}>{l.serviceData.planName}</div>}
                    {l.serviceData?.premise  && <div style={{fontSize:"0.72rem",color:"#64748b"}}>{l.serviceData.premise}</div>}
                  </td>
                  <td><strong>₹{l.serviceData?.finalPrice || l.finalPrice || l.origPrice || "—"}</strong></td>
                  <td onClick={e => e.stopPropagation()}>
                    <span className={`crm-status crm-status-${STATUS_COLOR[l.status] || "blue"}`}>{l.status}</span>
                  </td>
                  <td>{l.followUpDate || "—"}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="crm-actions">
                      <a href={`https://wa.me/91${l.mobile}?text=${encodeURIComponent(`Hi ${l.name}, this is New Tech Home Services. Regarding your enquiry for ${l.serviceData?.serviceName || l.service || "our services"}...`)}`}
                        target="_blank" rel="noreferrer" className="crm-btn-wa" title="WhatsApp">💬</a>
                      <a href={`tel:${l.mobile}`} className="crm-btn-call" title="Call">📞</a>
                      <button className="crm-btn-edit" onClick={() => openDetail(l)} title="View">👁️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ADD LEAD FORM ── */}
      {showForm && (
        <div className="crm-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="crm-modal crm-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="crm-modal-header">
              <h3>➕ Add New Lead</h3>
              <button className="crm-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="crm-modal-body">
              <div className="crm-form-section">
                <div className="crm-form-section-title">📋 Lead Information</div>
                <div className="crm-form-grid">
                  <div className="crm-form-group">
                    <label>Lead Source *</label>
                    <select className="crm-input" value={form.source} onChange={e => setForm({...form, source: e.target.value})}>
                      <option value="">Select Source</option>
                      {LEAD_SOURCES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="crm-form-group">
                    <label>Lead Status</label>
                    <select className="crm-input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                      {LEAD_STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="crm-form-group">
                    <label>Follow-up Date</label>
                    <input type="date" className="crm-input" value={form.followUpDate} onChange={e => setForm({...form, followUpDate: e.target.value})} />
                  </div>
                  <div className="crm-form-group">
                    <label>Assigned To</label>
                    <input className="crm-input" placeholder="Sales agent name" value={form.assignedTo || user.name} onChange={e => setForm({...form, assignedTo: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* ── SERVICE PICKER ── */}
              <div className="crm-form-section">
                <div className="crm-form-section-title">🔧 Service Required — Select & Customize</div>
                <ServicePicker
                  value={form.serviceData}
                  onChange={serviceData => setForm({ ...form, serviceData })}
                  showPrice={true}
                />
              </div>

              <div className="crm-form-section">
                <div className="crm-form-section-title">👤 Customer Details</div>
                <div className="crm-form-grid">
                  <div className="crm-form-group">
                    <label>Customer Name *</label>
                    <input className="crm-input" placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="crm-form-group">
                    <label>Mobile Number *</label>
                    <input className="crm-input" type="tel" placeholder="10-digit mobile" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
                  </div>
                  <div className="crm-form-group">
                    <label>Alternate Mobile</label>
                    <input className="crm-input" type="tel" placeholder="Optional" value={form.altMobile} onChange={e => setForm({...form, altMobile: e.target.value})} />
                  </div>
                  <div className="crm-form-group">
                    <label>Email</label>
                    <input className="crm-input" type="email" placeholder="Optional" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="crm-form-group">
                    <label>Location / Area</label>
                    <input className="crm-input" placeholder="e.g. Andheri West" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                  </div>
                  <div className="crm-form-group">
                    <label>Property Type</label>
                    <input className="crm-input" placeholder="1BHK / 2BHK / Office" value={form.property} onChange={e => setForm({...form, property: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="crm-form-section">
                <div className="crm-form-section-title">📝 Notes</div>
                <div className="crm-form-group">
                  <label>Follow-up Notes</label>
                  <textarea className="crm-input" rows={3} placeholder="What was discussed? What's the next step?" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                </div>
                {form.status === "Lost" && (
                  <div className="crm-form-group">
                    <label>Lost Reason</label>
                    <select className="crm-input" value={form.lostReason} onChange={e => setForm({...form, lostReason: e.target.value})}>
                      <option value="">Select Reason</option>
                      {LOST_REASONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="crm-modal-footer">
              <button className="crm-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="crm-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "💾 Save Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LEAD DETAIL PANEL ── */}
      {showDetail && selected && (
        <div className="crm-modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="crm-modal crm-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="crm-modal-header">
              <h3>👤 {selected.name} — {selected.leadId}</h3>
              <button className="crm-modal-close" onClick={() => setShowDetail(false)}>✕</button>
            </div>
            <div className="crm-modal-body">
              <div className="detail-grid">
                <DetailRow icon="📱" label="Mobile"   value={selected.mobile} />
                <DetailRow icon="📍" label="Location" value={selected.location} />
                <DetailRow icon="🏠" label="Property" value={selected.property} />
                <DetailRow icon="🔧" label="Service"  value={selected.service || selected.plans} />
                <DetailRow icon="💰" label="Price"    value={`₹${selected.finalPrice || selected.origPrice || "—"}`} />
                <DetailRow icon="📊" label="Status"   value={<span className={`crm-status crm-status-${STATUS_COLOR[selected.status]}`}>{selected.status}</span>} />
                <DetailRow icon="🌐" label="Source"   value={selected.source || "Website"} />
                <DetailRow icon="📅" label="Date"     value={selected.date} />
              </div>

              <div className="detail-actions">
                <h4>🚀 Quick Actions</h4>
                <div className="detail-action-btns">
                  <a href={`https://wa.me/91${selected.mobile}?text=${encodeURIComponent(`Hi ${selected.name}, this is New Tech Home Services...`)}`}
                    target="_blank" rel="noreferrer" className="crm-btn-action green">💬 WhatsApp</a>
                  <a href={`tel:${selected.mobile}`} className="crm-btn-action blue">📞 Call Now</a>
                  <button className="crm-btn-action orange"
                    onClick={() => { setShowDetail(false); alert("Convert to Customer — Coming in Phase 2"); }}>
                    ✅ Convert to Customer
                  </button>
                </div>
              </div>

              <div className="detail-notes">
                <h4>📝 Add Follow-up Note</h4>
                <textarea className="crm-input" rows={3} placeholder="Log your follow-up notes here..." />
                <button className="crm-btn-primary" style={{ marginTop: 8 }}>💾 Save Note</button>
              </div>
            </div>
          </div>
        </div>
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
