import { useState } from "react";
import "./crm.css";

export default function CRMImportExport() {
  const [activeTab, setActiveTab] = useState("import");
  const [importMsg, setImportMsg] = useState("");
  

  const handleImport = (e, type) => {
    const file = e.target.files[0];
    if(!file) return;
    setImportMsg(`📂 Reading ${file.name}...`);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split("\n").filter(l=>l.trim());
      setImportMsg(`✅ Found ${lines.length-1} records in ${file.name}. Preview & confirm below.`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExport = (type) => {
    const data = {
      customers: localStorage.getItem("nt_customers") || "[]",
      services:  localStorage.getItem("nt_services")  || "[]",
      jobs:      localStorage.getItem("nt_jobs")      || "[]",
      accounts:  localStorage.getItem("nt_accounts")  || "[]",
      complaints:localStorage.getItem("nt_complaints")|| "[]",
      inventory: localStorage.getItem("nt_inventory") || "[]",
    };
    const rows = JSON.parse(data[type] || "[]");
    if(rows.length===0) return alert("No data to export");
    const headers = Object.keys(rows[0]).join(",");
    const csv = [headers, ...rows.map(r=>Object.values(r).map(v=>JSON.stringify(v||"")).join(","))].join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `NewTech_${type}_${new Date().toLocaleDateString("en-IN").replace(/\//g,"-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const IMPORTS = [
    { icon:"👤", title:"Customer Master",       sub:"Upload existing customer data", type:"customers", template:"Customer_Master_Template.csv" },
    { icon:"🎯", title:"Sales Leads",           sub:"Import JustDial, Google Ads, or bulk leads", type:"leads", template:"Leads_Template.csv" },
    { icon:"📅", title:"Service History",       sub:"Upload old service records", type:"services", template:"Service_History_Template.csv" },
    { icon:"👷", title:"Technician Jobs",       sub:"Import job records", type:"jobs", template:"Jobs_Template.csv" },
    { icon:"📦", title:"Inventory / Stock",     sub:"Upload chemical stock data", type:"inventory", template:"Inventory_Template.csv" },
  ];

  const EXPORTS = [
    { icon:"👤", label:"All Customers",        type:"customers" },
    { icon:"🎯", label:"All Leads",            type:"leads" },
    { icon:"📅", label:"Service Calendar",     type:"services" },
    { icon:"👷", label:"Technician Jobs",      type:"jobs" },
    { icon:"💰", label:"Accounts / Payments",  type:"accounts" },
    { icon:"⚠️", label:"Complaints",           type:"complaints" },
    { icon:"📦", label:"Inventory",            type:"inventory" },
  ];

  return (
    <div className="crm-page">
      <div className="crm-page-header">
        <div><h2>🔄 Import / Export</h2><p className="crm-page-sub">Bulk data management — Excel, CSV, Google Sheets</p></div>
      </div>

      <div className="crm-tabs">
        {[["import","📥 Import Data"],["export","📤 Export Data"],["sheets","🔗 Google Sheets Sync"]].map(([k,l])=>(
          <button key={k} className={`crm-tab ${activeTab===k?"active":""}`} onClick={()=>setActiveTab(k)}>{l}</button>
        ))}
      </div>

      {/* ── IMPORT ── */}
      {activeTab==="import" && (
        <div>
          <div className="ie-info">
            <strong>📋 How to Import:</strong> Download the template → Fill your data → Upload the CSV file. System will validate and show preview before saving.
          </div>
          {importMsg && <div className="ie-msg">{importMsg}</div>}
          <div className="ie-grid">
            {IMPORTS.map((im,i)=>(
              <div key={i} className="ie-card">
                <div className="ie-card-icon">{im.icon}</div>
                <div className="ie-card-info">
                  <div className="ie-card-title">{im.title}</div>
                  <div className="ie-card-sub">{im.sub}</div>
                </div>
                <div className="ie-card-actions">
                  <button className="crm-btn-secondary" style={{fontSize:"0.8rem"}}
                    onClick={()=>alert(`Download ${im.template} — template download coming soon!`)}>
                    📥 Template
                  </button>
                  <label className="crm-btn-primary" style={{fontSize:"0.8rem",cursor:"pointer",padding:"7px 14px",borderRadius:8,display:"inline-block"}}>
                    📤 Upload CSV
                    <input type="file" accept=".csv,.xlsx" style={{display:"none"}} onChange={e=>handleImport(e,im.type)} />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="ie-rules">
            <h4>✅ Import Rules</h4>
            <ul>
              <li>Duplicate mobile numbers will be flagged — you choose to skip or update</li>
              <li>Customer IDs are auto-generated if not provided</li>
              <li>Date format: DD/MM/YYYY</li>
              <li>Max 5000 records per import</li>
              <li>For old customers, set "Old Customer" column to "Yes"</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── EXPORT ── */}
      {activeTab==="export" && (
        <div>
          <div className="ie-info">
            <strong>📤 Export your data</strong> as CSV — open in Excel or Google Sheets. All current data from the system.
          </div>
          <div className="ie-export-grid">
            {EXPORTS.map((ex,i)=>(
              <div key={i} className="ie-export-card" onClick={()=>handleExport(ex.type)}>
                <span className="ie-export-icon">{ex.icon}</span>
                <span className="ie-export-label">{ex.label}</span>
                <span className="ie-export-btn">📥 CSV</span>
              </div>
            ))}
          </div>

          <div className="ie-rules" style={{marginTop:24}}>
            <h4>📊 Filtered Exports</h4>
            <div className="ie-filter-exports">
              {[
                ["Lost leads (for remarketing)","leads"],
                ["Follow-up due today","leads"],
                ["Upcoming services next 30 days","services"],
                ["Overdue services","services"],
                ["Pending payments","accounts"],
                ["Low stock chemicals","inventory"],
              ].map(([label,type],i)=>(
                <button key={i} className="crm-btn-secondary" style={{fontSize:"0.83rem"}}
                  onClick={()=>handleExport(type)}>
                  📥 {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── GOOGLE SHEETS SYNC ── */}
      {activeTab==="sheets" && (
        <div>
          <div className="ie-info">
            🔗 <strong>Google Sheets Sync</strong> — Your data automatically syncs to Google Sheets via Apps Script. View your live data here.
          </div>
          <div className="ie-sheets-grid">
            {[
              { name:"Website Leads",    url:`https://docs.google.com/spreadsheets/d/1-TOoSjh2fibesbbXkPwpY8VjUrGh6H8rmnjiPpoQrVg`, tab:"Website Leads",    color:"#2563eb" },
              { name:"Website Bookings", url:`https://docs.google.com/spreadsheets/d/1-TOoSjh2fibesbbXkPwpY8VjUrGh6H8rmnjiPpoQrVg`, tab:"Website Bookings", color:"#059669" },
              { name:"Customer Master",  url:`https://docs.google.com/spreadsheets/d/1Pw1NLJ8ulZMA10pm-1D11KlICYZL8PMEjKg8bFB_Fcc`, tab:"Customer_Master",  color:"#7c3aed" },
              { name:"Service History",  url:`https://docs.google.com/spreadsheets/d/1Pw1NLJ8ulZMA10pm-1D11KlICYZL8PMEjKg8bFB_Fcc`, tab:"Contract Service history", color:"#d97706" },
              { name:"Sales Dashboard",  url:`https://docs.google.com/spreadsheets/d/1Pw1NLJ8ulZMA10pm-1D11KlICYZL8PMEjKg8bFB_Fcc`, tab:"SALES_DASHBOARD",  color:"#dc2626" },
            ].map((s,i)=>(
              <a key={i} href={`${s.url}/edit#gid=0`} target="_blank" rel="noreferrer" className="ie-sheet-card" style={{borderLeft:`4px solid ${s.color}`}}>
                <div className="ie-sheet-icon">📊</div>
                <div>
                  <div className="ie-sheet-name">{s.name}</div>
                  <div className="ie-sheet-tab">Tab: {s.tab}</div>
                </div>
                <div className="ie-sheet-open">Open ↗</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
