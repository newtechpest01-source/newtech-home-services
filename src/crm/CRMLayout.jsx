import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CRMDashboard    from "./CRMDashboard";
import CRMLeads        from "./CRMLeads";
import CRMCustomers    from "./CRMCustomers";
import CRMBookings     from "./CRMBookings";
import CRMCalendar     from "./CRMCalendar";
import CRMTechnicians  from "./CRMTechnicians";
import CRMAccounts     from "./CRMAccounts";
import CRMInventory    from "./CRMInventory";
import CRMComplaints   from "./CRMComplaints";
import CRMImportExport from "./CRMImportExport";
import "./crm.css";

const NAV_GROUPS = [
  {
    group: "SALES",
    items: [
      { path: "/crm/dashboard", icon: "📊", label: "Dashboard" },
      { path: "/crm/leads",     icon: "🎯", label: "Sales & Leads" },
      { path: "/crm/customers", icon: "👤", label: "Customers" },
    ]
  },
  {
    group: "OPERATIONS",
    items: [
      { path: "/crm/bookings",    icon: "📅", label: "Bookings" },
      { path: "/crm/calendar",    icon: "📆", label: "Service Calendar", alert: "orange" },
      { path: "/crm/technicians", icon: "👷", label: "Technicians" },
      { path: "/crm/complaints",  icon: "⚠️", label: "Complaints", alert: "red" },
    ]
  },
  {
    group: "FINANCE",
    items: [
      { path: "/crm/accounts",  icon: "💰", label: "Accounts" },
      { path: "/crm/inventory", icon: "📦", label: "Inventory", alert: "yellow" },
    ]
  },
  {
    group: "TOOLS",
    items: [
      { path: "/crm/importexport", icon: "🔄", label: "Import / Export" },
    ]
  },
];

const ROLE_COLORS = {
  owner: "#f59e0b", manager: "#22c55e", sales: "#3b82f6",
  technician: "#8b5cf6", crm: "#ec4899", accounts: "#14b8a6",
};

export default function CRMLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [collapsed,  setCollapsed]  = useState(false);

  const userStr = localStorage.getItem("crm_user");
  const user    = userStr ? JSON.parse(userStr) : null;
  if (!user) { navigate("/crm/login"); return null; }

  const handleLogout = () => {
    localStorage.removeItem("crm_user");
    navigate("/crm/login");
  };

  const allNav    = NAV_GROUPS.flatMap(g => g.items);
  const activePage = allNav.find(n => location.pathname.startsWith(n.path))?.label || "Dashboard";
  const roleColor  = ROLE_COLORS[user.role] || "#2563eb";

  return (
    <div className={`crm-layout ${collapsed ? "crm-collapsed" : ""}`}>

      {/* ══ SIDEBAR ══ */}
      <aside className={`crm-sidebar ${menuOpen ? "crm-sidebar-open" : ""}`}>

        {/* Brand */}
        <div className="crm-brand">
          <div className="crm-brand-logo">🏠</div>
          {!collapsed && (
            <div>
              <div className="crm-brand-name">New Tech</div>
              <div className="crm-brand-sub">Business OS</div>
            </div>
          )}
          <button className="crm-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "»" : "«"}
          </button>
        </div>

        {/* User card */}
        <div className="crm-user-card">
          <div className="crm-user-av" style={{ background: roleColor }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div>
              <div className="crm-user-nm">{user.name}</div>
              <div className="crm-user-rl" style={{ color: roleColor }}>
                ● {user.role?.toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Nav groups */}
        <nav className="crm-nav">
          {NAV_GROUPS.map(group => (
            <div key={group.group} className="crm-nav-group">
              {!collapsed && <div className="crm-nav-group-label">{group.group}</div>}
              {group.items.map(item => {
                const active = location.pathname.startsWith(item.path);
                return (
                  <div key={item.path}
                    className={`crm-nav-item ${active ? "active" : ""}`}
                    onClick={() => { navigate(item.path); setMenuOpen(false); }}
                    title={collapsed ? item.label : ""}
                  >
                    <span className="crm-nav-icon">{item.icon}</span>
                    {!collapsed && <>
                      <span className="crm-nav-label">{item.label}</span>
                      {item.alert === "red"    && <span className="crm-dot red" />}
                      {item.alert === "orange" && <span className="crm-dot orange" />}
                      {item.alert === "yellow" && <span className="crm-dot yellow" />}
                    </>}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="crm-sidebar-foot">
          <div className="crm-nav-item" onClick={handleLogout}>
            <span className="crm-nav-icon">🚪</span>
            {!collapsed && <span className="crm-nav-label">Logout</span>}
          </div>
          <a href="/" className="crm-nav-item" style={{ textDecoration: "none" }}>
            <span className="crm-nav-icon">🌐</span>
            {!collapsed && <span className="crm-nav-label">Website</span>}
          </a>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <div className="crm-main">

        {/* Topbar */}
        <header className="crm-topbar">
          <div className="crm-topbar-left">
            <button className="crm-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            <div>
              <h1 className="crm-page-title">{activePage}</h1>
              <div className="crm-breadcrumb">New Tech CRM › {activePage}</div>
            </div>
          </div>
          <div className="crm-topbar-right">
            <div className="crm-topbar-date">
              📅 {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </div>
            <div className="crm-topbar-user">
              <div className="crm-user-av sm" style={{ background: roleColor }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span>{user.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="crm-content">
          <Routes>
            <Route path="dashboard"    element={<CRMDashboard />} />
            <Route path="leads"        element={<CRMLeads />} />
            <Route path="customers"    element={<CRMCustomers />} />
            <Route path="bookings"     element={<CRMBookings />} />
            <Route path="calendar"     element={<CRMCalendar />} />
            <Route path="technicians"  element={<CRMTechnicians />} />
            <Route path="accounts"     element={<CRMAccounts />} />
            <Route path="inventory"    element={<CRMInventory />} />
            <Route path="complaints"   element={<CRMComplaints />} />
            <Route path="importexport" element={<CRMImportExport />} />
            <Route path="*"            element={<CRMDashboard />} />
          </Routes>
        </main>
      </div>

      {menuOpen && <div className="crm-overlay" onClick={() => setMenuOpen(false)} />}
    </div>
  );
}
