// CRMBookings.jsx
import { useState, useEffect } from "react";
import "./crm.css";

const SHEET_ID = "1-TOoSjh2fibesbbXkPwpY8VjUrGh6H8rmnjiPpoQrVg";


export default function CRMBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("All");
  

  const today = new Date().toISOString().split("T")[0];

  const fetch_ = async () => {
    setLoading(true);
    try {
      const r    = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Website%20Bookings`);
      const text = await r.text();
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = (json.table?.rows || []).map(r => ({
        bookingId:   r.c[0]?.v  || "",
        customerId:  r.c[1]?.v  || "",
        date:        r.c[2]?.v  || "",
        slot:        r.c[3]?.v  || "",
        zone:        r.c[4]?.v  || "",
        technician:  r.c[5]?.v  || "",
        name:        r.c[6]?.v  || "",
        phone:       r.c[7]?.v  || "",
        email:       r.c[8]?.v  || "",
        property:    r.c[9]?.v  || "",
        size:        r.c[10]?.v || "",
        area:        r.c[11]?.v || "",
        pests:       r.c[12]?.v || "",
        plan:        r.c[13]?.v || "",
        finalPrice:  r.c[14]?.v || "",
        status:      r.c[15]?.v || "Confirmed",
        submittedAt: r.c[16]?.v || "",
      }));
      setBookings(rows.reverse());
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const mQ = !q || b.name.toLowerCase().includes(q) || b.phone.includes(q) || b.bookingId.includes(q);
    const mF = filter === "All" || b.status === filter;
    return mQ && mF;
  });

  const STATUS_COLOR = { Confirmed:"blue", Completed:"green", Cancelled:"red", Pending:"yellow", "In Progress":"teal" };

  return (
    <div className="crm-page">
      <div className="crm-page-header">
        <div>
          <h2>📅 Bookings</h2>
          <p className="crm-page-sub">All website & manual bookings — Assign · Track · Complete</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <span className="crm-count-badge">{filtered.length}</span>
          <button className="crm-refresh-btn" onClick={fetch_}>🔄 Refresh</button>
        </div>
      </div>

      <div className="crm-filters">
        <input className="crm-search" placeholder="🔍 Search name, phone, booking ID..." value={search} onChange={e=>setSearch(e.target.value)} />
        <div className="crm-filter-tabs">
          {["All","Confirmed","In Progress","Completed","Cancelled"].map(s=>(
            <button key={s} className={`crm-filter-tab ${filter===s?"active":""}`} onClick={()=>setFilter(s)}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="crm-loading"><div className="crm-spinner"/><p>Loading...</p></div> :
      filtered.length===0 ? <div className="crm-empty-state"><span>📅</span><p>No bookings</p></div> : (
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead><tr>
              <th>Booking ID</th><th>Date & Slot</th><th>Customer</th><th>Area</th>
              <th>Plan</th><th>Amount</th><th>Technician</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((b,i)=>(
                <tr key={i} className={b.date===today?"crm-today-row":""}>
                  <td>
                    <span className="crm-id">{b.bookingId}</span>
                    {b.date===today&&<span className="crm-today-badge">TODAY</span>}
                  </td>
                  <td><div>{b.date}</div><div className="crm-slot">{b.slot}</div></td>
                  <td><div className="crm-customer-name">{b.name}</div><div className="crm-customer-phone">{b.phone}</div></td>
                  <td>{b.area}<br/><small>Zone {b.zone}</small></td>
                  <td className="crm-plan">{b.plan}</td>
                  <td><strong>₹{b.finalPrice}</strong></td>
                  <td>
                    {b.technician||<span style={{color:"#ef4444",fontSize:"0.8rem"}}>⚠️ Unassigned</span>}
                  </td>
                  <td><span className={`crm-status crm-status-${(STATUS_COLOR[b.status]||"blue")}`}>{b.status}</span></td>
                  <td>
                    <div className="crm-actions">
                      <a href={`https://wa.me/91${b.phone}`} target="_blank" rel="noreferrer" className="crm-btn-wa">💬</a>
                      <a href={`tel:${b.phone}`} className="crm-btn-call">📞</a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
