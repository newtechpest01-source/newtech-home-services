import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./crm.css";

const SHEET_ID   = "1-TOoSjh2fibesbbXkPwpY8VjUrGh6H8rmnjiPpoQrVg";


// Helper
const today     = () => new Date().toISOString().split("T")[0];
const todayDate = () => new Date();
const diffDays  = (d) => {
  const diff = new Date(d) - todayDate();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const HOUR = new Date().getHours();
const GREETING = HOUR < 12 ? "Good Morning" : HOUR < 17 ? "Good Afternoon" : "Good Evening";

export default function CRMDashboard() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("crm_user") || "{}");

  const [stats,     setStats]     = useState({ leads: 0, todayLeads: 0, customers: 0, bookings: 0, todayJobs: 0, revenue: 0, pending: 0, overdue: 0 });
  const [urgent,    setUrgent]    = useState([]);
  const [noResp,    setNoResp]    = useState([]);
  const [thisWeek,  setThisWeek]  = useState([]);
  
  
  const [loading,   setLoading]   = useState(true);
  const [lastSync,  setLastSync]  = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Leads
      const lr  = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Website%20Leads`);
      const lt  = await lr.text();
      const lj  = JSON.parse(lt.substring(47, lt.length - 2));
      const leads = (lj.table?.rows || []).map(r => ({
        id:     r.c[0]?.v || "",
        date:   r.c[1]?.v || "",
        name:   r.c[3]?.v || "",
        phone:  r.c[4]?.v || "",
        area:   r.c[8]?.v || "",
        status: r.c[14]?.v || "New",
        price:  r.c[13]?.v || 0,
      }));

      const todayStr = new Date().toLocaleDateString("en-IN");
      const todayLeads = leads.filter(l => l.date === todayStr).length;
      const totalRev   = leads.filter(l => l.status === "Converted").reduce((s, l) => s + Number(l.price || 0), 0);

      // Bookings
      const br  = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Website%20Bookings`);
      const bt  = await br.text();
      const bj  = JSON.parse(bt.substring(47, bt.length - 2));
      const bookings = (bj.table?.rows || []).map(r => ({
        id:        r.c[0]?.v || "",
        date:      r.c[2]?.v || "",
        slot:      r.c[3]?.v || "",
        technician:r.c[5]?.v || "",
        name:      r.c[6]?.v || "",
        phone:     r.c[7]?.v || "",
        area:      r.c[11]?.v || "",
        plan:      r.c[13]?.v || "",
        price:     r.c[14]?.v || 0,
        status:    r.c[15]?.v || "Confirmed",
      }));

      const todayJobs = bookings.filter(b => b.date === today()).length;

      // Build urgent — today + overdue
      const urgentItems = bookings
        .filter(b => {
          const d = diffDays(b.date);
          return (d <= 0) && b.status !== "Completed" && b.status !== "Cancelled";
        })
        .map(b => ({ ...b, daysLabel: diffDays(b.date) === 0 ? "TODAY" : `${Math.abs(diffDays(b.date))}d OVERDUE`, urgent: true }));

      // No response — bookings in next 15 days with no confirmation
      const noRespItems = bookings
        .filter(b => {
          const d = diffDays(b.date);
          return d > 0 && d <= 15 && b.status === "Confirmed";
        })
        .map(b => ({ ...b, daysLabel: `D-${diffDays(b.date)}` }));

      // This week
      const weekItems = bookings
        .filter(b => { const d = diffDays(b.date); return d > 0 && d <= 7; })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setStats({
        leads:      leads.length,
        todayLeads,
        customers:  0,
        bookings:   bookings.length,
        todayJobs,
        revenue:    totalRev,
        pending:    bookings.filter(b => b.status === "Confirmed").length,
        overdue:    urgentItems.filter(b => diffDays(b.date) < 0).length,
      });

      setUrgent(urgentItems);
      setNoResp(noRespItems);
      setThisWeek(weekItems);
      setLastSync(new Date().toLocaleTimeString("en-IN"));
    } catch (err) {
      console.error("Dashboard error:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const STAT_CARDS = [
    { icon: "🎯", label: "Total Leads",    value: stats.leads,      color: "#2563eb", bg: "#eff6ff", path: "/crm/leads"    },
    { icon: "🆕", label: "Today's Leads",  value: stats.todayLeads, color: "#059669", bg: "#ecfdf5", path: "/crm/leads"    },
    { icon: "📅", label: "Total Bookings", value: stats.bookings,   color: "#7c3aed", bg: "#f5f3ff", path: "/crm/bookings" },
    { icon: "⚡", label: "Today's Jobs",   value: stats.todayJobs,  color: "#d97706", bg: "#fffbeb", path: "/crm/bookings" },
    { icon: "🔴", label: "Overdue Jobs",   value: stats.overdue,    color: "#dc2626", bg: "#fef2f2", path: "/crm/calendar" },
    { icon: "⏳", label: "Pending Confirm",value: stats.pending,    color: "#0891b2", bg: "#ecfeff", path: "/crm/calendar" },
  ];

  return (
    <div className="crm-dashboard">

      {/* Welcome */}
      <div className="dash-welcome">
        <div>
          <h2>{GREETING}, {user.name?.split(" ")[0]}! 👋</h2>
          <p>Here's your complete business overview — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <div className="dash-sync">
          {lastSync && <span>Last sync: {lastSync}</span>}
          <button className="crm-btn-sm" onClick={fetchData}>🔄 Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="crm-loading"><div className="crm-spinner" /><p>Loading dashboard...</p></div>
      ) : (
        <>
          {/* ── STAT CARDS ── */}
          <div className="dash-stats">
            {STAT_CARDS.map((c, i) => (
              <div key={i} className="dash-stat-card"
                style={{ borderTop: `3px solid ${c.color}`, background: c.bg, cursor: "pointer" }}
                onClick={() => navigate(c.path)}
              >
                <div className="dash-stat-icon">{c.icon}</div>
                <div className="dash-stat-val" style={{ color: c.color }}>{c.value}</div>
                <div className="dash-stat-lbl">{c.label}</div>
              </div>
            ))}
          </div>

          {/* ── PANEL 1: URGENT / TODAY ── */}
          <DashPanel
            title="🚨 Needs Immediate Action"
            subtitle={`${urgent.length} service${urgent.length !== 1 ? "s" : ""}`}
            color="red"
            empty="No urgent items today ✅"
            onViewAll={() => navigate("/crm/calendar")}
          >
            {urgent.map((b, i) => (
              <div key={i} className="dash-row dash-row-red">
                <div className="dash-row-left">
                  <span className="dash-tag red">{b.daysLabel}</span>
                  <div>
                    <div className="dash-row-name">{b.name}</div>
                    <div className="dash-row-sub">{b.plan} · {b.area}</div>
                  </div>
                </div>
                <div className="dash-row-right">
                  <span className="dash-row-tech">👷 {b.technician || "Unassigned"}</span>
                  <a href={`tel:${b.phone}`} className="crm-btn-icon">📞</a>
                  <a href={`https://wa.me/91${b.phone}`} target="_blank" rel="noreferrer" className="crm-btn-icon">💬</a>
                </div>
              </div>
            ))}
          </DashPanel>

          {/* ── PANEL 2: NO RESPONSE ── */}
          <DashPanel
            title="⚠️ No Response to Notifications"
            subtitle={`${noResp.length} service${noResp.length !== 1 ? "s" : ""} need follow-up`}
            color="orange"
            empty="All customers have responded ✅"
            onViewAll={() => navigate("/crm/calendar")}
          >
            {noResp.map((b, i) => (
              <div key={i} className="dash-row dash-row-orange">
                <div className="dash-row-left">
                  <span className="dash-tag orange">{b.daysLabel}</span>
                  <div>
                    <div className="dash-row-name">{b.name}</div>
                    <div className="dash-row-sub">{b.plan} · {b.area} · {b.date}</div>
                  </div>
                </div>
                <div className="dash-row-right">
                  <span className="crm-status crm-status-pending">Call Required</span>
                  <a href={`tel:${b.phone}`} className="crm-btn-icon">📞</a>
                  <a href={`https://wa.me/91${b.phone}`} target="_blank" rel="noreferrer" className="crm-btn-icon">💬</a>
                </div>
              </div>
            ))}
          </DashPanel>

          {/* ── PANEL 3: THIS WEEK ── */}
          <DashPanel
            title="📅 This Week's Services"
            subtitle={`${thisWeek.length} upcoming`}
            color="blue"
            empty="No services scheduled this week"
            onViewAll={() => navigate("/crm/calendar")}
          >
            {thisWeek.map((b, i) => (
              <div key={i} className="dash-row">
                <div className="dash-row-left">
                  <span className="dash-tag blue">D-{diffDays(b.date)}</span>
                  <div>
                    <div className="dash-row-name">{b.name}</div>
                    <div className="dash-row-sub">{b.date} · {b.slot} · {b.area}</div>
                  </div>
                </div>
                <div className="dash-row-right">
                  <span className="dash-row-tech">👷 {b.technician || "—"}</span>
                  <span className={`crm-status crm-status-${(b.status||"confirmed").toLowerCase()}`}>{b.status}</span>
                </div>
              </div>
            ))}
          </DashPanel>

          {/* ── QUICK ACTIONS ── */}
          <div className="dash-actions">
            <h3>⚡ Quick Actions</h3>
            <div className="dash-action-grid">
              {[
                { icon: "➕", label: "Add New Lead",      path: "/crm/leads",        color: "#2563eb" },
                { icon: "👤", label: "Add Customer",      path: "/crm/customers",    color: "#059669" },
                { icon: "📅", label: "Schedule Service",  path: "/crm/calendar",     color: "#7c3aed" },
                { icon: "👷", label: "Assign Technician", path: "/crm/technicians",  color: "#d97706" },
                { icon: "💰", label: "Record Payment",    path: "/crm/accounts",     color: "#0891b2" },
                { icon: "📦", label: "Update Stock",      path: "/crm/inventory",    color: "#dc2626" },
                { icon: "⚠️", label: "Log Complaint",     path: "/crm/complaints",   color: "#9333ea" },
                { icon: "🔄", label: "Import Data",       path: "/crm/importexport", color: "#374151" },
              ].map((a, i) => (
                <div key={i} className="dash-action-btn"
                  style={{ borderLeft: `3px solid ${a.color}` }}
                  onClick={() => navigate(a.path)}
                >
                  <span style={{ fontSize: "1.3rem" }}>{a.icon}</span>
                  <span>{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DashPanel({ title, subtitle, color, children, empty, onViewAll }) {
  const [open, setOpen] = useState(true);
  const hasContent = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <div className={`dash-panel dash-panel-${color}`}>
      <div className="dash-panel-header" onClick={() => setOpen(!open)}>
        <div>
          <span className="dash-panel-title">{title}</span>
          <span className={`dash-panel-badge badge-${color}`}>{subtitle}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="crm-btn-sm" onClick={(e) => { e.stopPropagation(); onViewAll(); }}>View All →</button>
          <span className="dash-panel-toggle">{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div className="dash-panel-body">
          {hasContent ? children : <div className="dash-empty">{empty}</div>}
        </div>
      )}
    </div>
  );
}
