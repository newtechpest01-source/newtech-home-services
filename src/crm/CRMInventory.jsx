import { useState, useEffect } from "react";
import "./crm.css";

// ── MASTER DATA ──────────────────────────────────────



const TREATMENTS = [
  { id:"T01", name:"Chemical Spray",    chemicals:[{name:"Cypermethrin 25EC",unit:"ML"},{name:"Chlorpyrifos 20EC",unit:"ML"},{name:"Bifenthrin",unit:"ML"},{name:"Deltamethrin",unit:"ML"}] },
  { id:"T02", name:"ULV Chemical Spray",chemicals:[{name:"ULV Chemical",unit:"ML"}] },
  { id:"T03", name:"Gel Treatment",     chemicals:[{name:"Gel Bait (Advion)",unit:"Unit"},{name:"Gel Bait (Goliath)",unit:"Unit"}] },
  { id:"T04", name:"Cockroach Trap",    chemicals:[{name:"Cockroach Trap",unit:"Unit"}] },
  { id:"T05", name:"Rodent Baiting",    chemicals:[{name:"Bread",unit:"Gram"},{name:"Rat Cake",unit:"Unit"},{name:"Ratol Cake",unit:"Unit"}] },
  { id:"T06", name:"Rodent Trapping",   chemicals:[{name:"Glue Trap",unit:"Unit"},{name:"Snap Trap",unit:"Unit"}] },
  { id:"T07", name:"Fogging",           chemicals:[{name:"Fogging Chemical",unit:"ML"},{name:"Diesel",unit:"Liter"}] },
  { id:"T08", name:"ULV Cold Fogging",  chemicals:[{name:"Gas Tin",unit:"Unit"},{name:"ULV Chemical",unit:"ML"}] },
  { id:"T09", name:"Termite Drilling",  chemicals:[{name:"Termiticide (Odourless)",unit:"ML"},{name:"Termiticide (Odour)",unit:"ML"},{name:"White Cement",unit:"KG"}] },
  { id:"T10", name:"Arrow Powder",      chemicals:[{name:"Arrow Powder",unit:"Gram"}] },
  { id:"T11", name:"Mosquito Spray",    chemicals:[{name:"Pyrethroid Spray",unit:"ML"}] },
];

const ASSET_CATEGORIES = ["Sprayer Machine","ULV Machine","Fogging Machine","Vehicle","Safety Equipment","Office Equipment","Other"];
const ASSET_STATUS     = ["Active","Under Repair","Retired","Lost"];
const REPAIR_STATUS    = ["Open","In Progress","Completed","Cancelled"];

const DEFAULT_STOCK = [
  { id:"CHM-001", name:"Cypermethrin 25EC",        category:"Insecticide", unit:"ML",    qty:2000,  minStock:500,  costPerUnit:2,    vendor:"Mahalaxmi Argo" },
  { id:"CHM-002", name:"Chlorpyrifos 20EC",         category:"Insecticide", unit:"ML",    qty:1500,  minStock:500,  costPerUnit:1.5,  vendor:"Mahalaxmi Argo" },
  { id:"CHM-003", name:"Bifenthrin",                category:"Insecticide", unit:"ML",    qty:800,   minStock:300,  costPerUnit:3,    vendor:"S.R Enterprises" },
  { id:"CHM-004", name:"Deltamethrin",              category:"Insecticide", unit:"ML",    qty:600,   minStock:200,  costPerUnit:4,    vendor:"S.R Enterprises" },
  { id:"CHM-005", name:"Gel Bait (Advion)",         category:"Gel",         unit:"Unit",  qty:30,    minStock:8,    costPerUnit:350,  vendor:"Mahalaxmi Argo" },
  { id:"CHM-006", name:"Gel Bait (Goliath)",        category:"Gel",         unit:"Unit",  qty:15,    minStock:5,    costPerUnit:280,  vendor:"Mahalaxmi Argo" },
  { id:"CHM-007", name:"Cockroach Trap",            category:"Trap",        unit:"Unit",  qty:80,    minStock:20,   costPerUnit:15,   vendor:"Local" },
  { id:"CHM-008", name:"Glue Trap",                 category:"Trap",        unit:"Unit",  qty:40,    minStock:10,   costPerUnit:20,   vendor:"Local" },
  { id:"CHM-009", name:"Snap Trap",                 category:"Trap",        unit:"Unit",  qty:20,    minStock:5,    costPerUnit:45,   vendor:"Local" },
  { id:"CHM-010", name:"Bread",                     category:"Rodent",      unit:"Gram",  qty:2000,  minStock:500,  costPerUnit:0.05, vendor:"Local" },
  { id:"CHM-011", name:"Rat Cake",                  category:"Rodent",      unit:"Unit",  qty:50,    minStock:10,   costPerUnit:25,   vendor:"Local" },
  { id:"CHM-012", name:"Ratol Cake",                category:"Rodent",      unit:"Unit",  qty:30,    minStock:10,   costPerUnit:30,   vendor:"Local" },
  { id:"CHM-013", name:"Fogging Chemical",          category:"Fogging",     unit:"ML",    qty:3000,  minStock:1000, costPerUnit:1.2,  vendor:"S.R Enterprises" },
  { id:"CHM-014", name:"Diesel",                    category:"Fogging",     unit:"Liter", qty:10,    minStock:3,    costPerUnit:95,   vendor:"Petrol Pump" },
  { id:"CHM-015", name:"Gas Tin",                   category:"ULV",         unit:"Unit",  qty:5,     minStock:2,    costPerUnit:800,  vendor:"S.R Enterprises" },
  { id:"CHM-016", name:"ULV Chemical",              category:"ULV",         unit:"ML",    qty:2000,  minStock:500,  costPerUnit:2.5,  vendor:"S.R Enterprises" },
  { id:"CHM-017", name:"Termiticide (Odourless)",   category:"Termite",     unit:"ML",    qty:2000,  minStock:500,  costPerUnit:5,    vendor:"Mahalaxmi Argo" },
  { id:"CHM-018", name:"Termiticide (Odour)",       category:"Termite",     unit:"ML",    qty:1000,  minStock:300,  costPerUnit:4,    vendor:"Mahalaxmi Argo" },
  { id:"CHM-019", name:"White Cement",              category:"Termite",     unit:"KG",    qty:25,    minStock:5,    costPerUnit:12,   vendor:"Local" },
  { id:"CHM-020", name:"Arrow Powder",              category:"Insecticide", unit:"Gram",  qty:5000,  minStock:1000, costPerUnit:0.1,  vendor:"S.R Enterprises" },
  { id:"CHM-021", name:"Pyrethroid Spray",          category:"Mosquito",    unit:"ML",    qty:1500,  minStock:500,  costPerUnit:2.2,  vendor:"Mahalaxmi Argo" },
];

const today = () => new Date().toLocaleDateString("en-IN");
const nowTime = () => new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});

const TABS = [
  ["stock",      "📦 Stock"],
  ["allocate",   "🧪 Chemical Allocation"],
  ["eod",        "📊 EOD / SOD Report"],
  ["assets",     "🔧 Asset Management"],
  ["repair",     "🛠️ Repair & Maintenance"],
  ["purchase",   "🛒 Machine Purchase"],
];

export default function CRMInventory() {
  const [activeTab,   setActiveTab]   = useState("stock");
  const [stock,       setStock]       = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [stockLogs,   setStockLogs]   = useState([]);
  const [assets,      setAssets]      = useState([]);
  const [repairs,     setRepairs]     = useState([]);
  const [machinePurchases, setMachinePurchases] = useState([]);
  const [showForm,    setShowForm]    = useState(false);
  const [formType,    setFormType]    = useState("");
  const [search,      setSearch]      = useState("");

  const user = JSON.parse(localStorage.getItem("crm_user") || "{}");

  useEffect(() => {
    const load = (k, set, def) => { const s=localStorage.getItem(k); set(s?JSON.parse(s):def||[]); };
    load("nt_stock_v2",    setStock,       DEFAULT_STOCK);
    load("nt_allocations", setAllocations);
    load("nt_stock_logs",  setStockLogs);
    load("nt_assets",      setAssets);
    load("nt_repairs",     setRepairs);
    load("nt_machine_purchases", setMachinePurchases);
  }, []);

  const saveStock = (list) => { localStorage.setItem("nt_stock_v2",JSON.stringify(list));    setStock(list); };
  const saveAlloc = (list) => { localStorage.setItem("nt_allocations",JSON.stringify(list)); setAllocations(list); };
  const saveLogs  = (list) => { localStorage.setItem("nt_stock_logs",JSON.stringify(list));  setStockLogs(list); };
  const saveAssets= (list) => { localStorage.setItem("nt_assets",JSON.stringify(list));      setAssets(list); };
  const saveRepairs=(list) => { localStorage.setItem("nt_repairs",JSON.stringify(list));     setRepairs(list); };
  const savePurch = (list) => { localStorage.setItem("nt_machine_purchases",JSON.stringify(list)); setMachinePurchases(list); };

  // ── Stock Operations ────────────────────────────────
  const adjustStock = (itemId, qty, type, note, allocId) => {
    const updated = stock.map(s => s.id===itemId ? {...s, qty: Math.max(0, s.qty + qty)} : s);
    saveStock(updated);
    const log = { id:`LOG-${Date.now()}`, itemId, itemName: stock.find(s=>s.id===itemId)?.name, qty: Math.abs(qty), type, note, allocId:allocId||"", date:today(), time:nowTime(), by:user.name };
    saveLogs([log, ...stockLogs]);
  };

  // ── Mark allocation as used (technician returned) ──
  const markUsed = (allocId, usedQtys) => {
    const alloc = allocations.find(a=>a.id===allocId);
    if(!alloc) return;
    // Deduct used from stock, return remainder
    usedQtys.forEach(u => {
      const given  = Number(u.givenQty||0);
      const used   = Number(u.usedQty||0);
      const remain = given - used;
      adjustStock(u.chemId, -used, "used", `Used for ${alloc.customerName} by ${alloc.technician}`, allocId);
      if(remain > 0) adjustStock(u.chemId, remain, "returned", `Returned from ${alloc.technician}`, allocId);
    });
    saveAlloc(allocations.map(a=>a.id===allocId?{...a,status:"Completed",usedQtys,completedOn:today()}:a));
  };

  // Low stock items
  const lowStock  = stock.filter(s => s.qty <= s.minStock);
  const zeroStock = stock.filter(s => s.qty === 0);

  // Pending allocations (services scheduled, chemicals not yet allocated)
  const services = JSON.parse(localStorage.getItem("nt_services")||"[]");
  const pendingServices = services.filter(s => s.status==="Scheduled"||s.status==="Confirmed");

  // EOD/SOD data
  const todayLogs = stockLogs.filter(l => l.date === today());
  const totalGiven    = todayLogs.filter(l=>l.type==="allocated").reduce((s,l)=>s+l.qty,0);
  const totalUsed     = todayLogs.filter(l=>l.type==="used").reduce((s,l)=>s+l.qty,0);
  const totalReturned = todayLogs.filter(l=>l.type==="returned").reduce((s,l)=>s+l.qty,0);
  const totalPurchased= todayLogs.filter(l=>l.type==="purchase").reduce((s,l)=>s+l.qty,0);

  const filteredStock = stock.filter(s => {
    const q = search.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  return (
    <div className="crm-page">
      {/* Header */}
      <div className="crm-page-header">
        <div>
          <h2>📦 Inventory Management</h2>
          <p className="crm-page-sub">Chemical Stock · Allocation · Assets · Repairs · Purchases · EOD/SOD Reports</p>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {activeTab==="stock"    && <><button className="crm-btn-secondary" onClick={()=>{setFormType("use");     setShowForm(true);}}>➖ Use</button>
                                       <button className="crm-btn-primary"   onClick={()=>{setFormType("purchase");setShowForm(true);}}>➕ Purchase</button></>}
          {activeTab==="allocate" && <button className="crm-btn-primary"     onClick={()=>{setFormType("allocate");setShowForm(true);}}>🧪 New Allocation</button>}
          {activeTab==="assets"   && <button className="crm-btn-primary"     onClick={()=>{setFormType("asset");   setShowForm(true);}}>➕ Add Asset</button>}
          {activeTab==="repair"   && <button className="crm-btn-primary"     onClick={()=>{setFormType("repair");  setShowForm(true);}}>🛠️ Log Repair</button>}
          {activeTab==="purchase" && <button className="crm-btn-primary"     onClick={()=>{setFormType("machine"); setShowForm(true);}}>🛒 New Purchase</button>}
        </div>
      </div>

      {/* Alert Bar */}
      {(zeroStock.length > 0 || lowStock.length > 0) && (
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
          {zeroStock.length > 0 && (
            <div style={{background:"#fef2f2",border:"1.5px solid #fca5a5",borderRadius:10,padding:"10px 16px",color:"#dc2626",fontWeight:600,fontSize:"0.85rem",display:"flex",alignItems:"center",gap:8}}>
              🚨 <strong>OUT OF STOCK:</strong> {zeroStock.map(s=>s.name).join(", ")} — Order immediately!
            </div>
          )}
          {lowStock.filter(s=>s.qty>0).length > 0 && (
            <div style={{background:"#fffbeb",border:"1.5px solid #fde68a",borderRadius:10,padding:"10px 16px",color:"#d97706",fontWeight:600,fontSize:"0.85rem",display:"flex",alignItems:"center",gap:8}}>
              ⚠️ <strong>LOW STOCK:</strong> {lowStock.filter(s=>s.qty>0).map(s=>`${s.name} (${s.qty} ${s.unit})`).join(", ")}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="crm-tabs" style={{overflowX:"auto",flexWrap:"nowrap"}}>
        {TABS.map(([k,l])=>(
          <button key={k} className={`crm-tab ${activeTab===k?"active":""}`} onClick={()=>setActiveTab(k)} style={{whiteSpace:"nowrap"}}>{l}</button>
        ))}
      </div>

      {/* ── STOCK TAB ── */}
      {activeTab==="stock" && (
        <>
          <div className="crm-filters">
            <input className="crm-search" placeholder="🔍 Search chemical..." value={search} onChange={e=>setSearch(e.target.value)} />
            <span className="crm-count-badge">{filteredStock.length} items</span>
            <span style={{fontSize:"0.8rem",color:"#dc2626",fontWeight:600}}>🔴 {zeroStock.length} Out of Stock</span>
            <span style={{fontSize:"0.8rem",color:"#d97706",fontWeight:600}}>⚠️ {lowStock.filter(s=>s.qty>0).length} Low Stock</span>
          </div>
          <div className="crm-table-wrap">
            <table className="crm-table">
              <thead><tr>
                <th>ID</th><th>Chemical Name</th><th>Category</th><th>Unit</th>
                <th>Current Stock</th><th>Min Stock</th><th>Cost/Unit</th>
                <th>Total Value</th><th>Vendor</th><th>Status</th>
              </tr></thead>
              <tbody>
                {filteredStock.map((s,i) => {
                  const low  = s.qty <= s.minStock;
                  const zero = s.qty === 0;
                  return (
                    <tr key={i} style={{background:zero?"#fef2f2":low?"#fffbeb":""}}>
                      <td><span className="crm-id">{s.id}</span></td>
                      <td><div style={{fontWeight:600}}>{s.name}</div></td>
                      <td>{s.category}</td>
                      <td>{s.unit}</td>
                      <td>
                        <span style={{fontSize:"1.2rem",fontWeight:800,color:zero?"#dc2626":low?"#d97706":"#059669"}}>
                          {s.qty}
                        </span>
                        <span style={{fontSize:"0.75rem",color:"#64748b",marginLeft:4}}>{s.unit}</span>
                      </td>
                      <td>{s.minStock} {s.unit}</td>
                      <td>₹{s.costPerUnit}</td>
                      <td><strong>₹{(s.qty*s.costPerUnit).toFixed(0)}</strong></td>
                      <td style={{fontSize:"0.78rem"}}>{s.vendor}</td>
                      <td>
                        <span className={`crm-status ${zero?"crm-status-red":low?"crm-status-yellow":"crm-status-green"}`}>
                          {zero?"Out of Stock":low?"Low Stock":"OK"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── CHEMICAL ALLOCATION TAB ── */}
      {activeTab==="allocate" && (
        <>
          {/* Pending Services that need allocation */}
          {pendingServices.length > 0 && (
            <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"12px 16px",marginBottom:16}}>
              <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:8}}>📅 Services Pending Chemical Allocation ({pendingServices.length})</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {pendingServices.map((s,i)=>(
                  <div key={i} style={{background:"#fff",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 12px",fontSize:"0.8rem",cursor:"pointer"}}
                    onClick={()=>{setFormType("allocate");setShowForm(true);}}>
                    <strong>{s.customerName}</strong> · {s.treatment||s.plan} · {s.scheduledDate} · 👷 {s.technician||"Unassigned"}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allocation Table */}
          {allocations.length===0 ? (
            <div className="crm-empty-state">
              <span>🧪</span>
              <p>No chemical allocations yet</p>
              <button className="crm-btn-primary" onClick={()=>{setFormType("allocate");setShowForm(true);}}>🧪 Create First Allocation</button>
            </div>
          ) : (
            <div className="crm-table-wrap">
              <table className="crm-table">
                <thead><tr>
                  <th>Alloc ID</th><th>Date</th><th>Technician</th><th>Customer</th>
                  <th>Property</th><th>Size</th><th>Service</th><th>Treatment</th>
                  <th>Chemicals Allocated</th><th>Used</th><th>Returned</th><th>Status</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {allocations.map((a,i)=>(
                    <tr key={i}>
                      <td><span className="crm-id">{a.id}</span></td>
                      <td>{a.date}</td>
                      <td><strong>{a.technician}</strong></td>
                      <td>
                        <div className="crm-customer-name">{a.customerName}</div>
                        <div className="crm-id">{a.customerId}</div>
                      </td>
                      <td>{a.propertyType}</td>
                      <td>{a.propertySize}</td>
                      <td className="crm-plan">{a.serviceName}</td>
                      <td>{a.treatmentName}</td>
                      <td>
                        <div style={{display:"flex",flexDirection:"column",gap:2}}>
                          {(a.chemicals||[]).map((c,j)=>(
                            <div key={j} style={{fontSize:"0.75rem",background:"#eff6ff",borderRadius:4,padding:"2px 6px"}}>
                              {c.chemName}: <strong>{c.givenQty} {c.unit}</strong>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        {a.usedQtys && (
                          <div style={{display:"flex",flexDirection:"column",gap:2}}>
                            {a.usedQtys.map((u,j)=>(
                              <div key={j} style={{fontSize:"0.75rem",background:"#fef2f2",borderRadius:4,padding:"2px 6px"}}>
                                {u.chemName}: <strong>{u.usedQty} {u.unit}</strong>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        {a.chemicals && a.usedQtys && (
                          <div style={{display:"flex",flexDirection:"column",gap:2}}>
                            {a.chemicals.map((c,j)=>{
                              const used = a.usedQtys?.find(u=>u.chemId===c.chemId)?.usedQty||0;
                              const rem  = Number(c.givenQty)-Number(used);
                              return <div key={j} style={{fontSize:"0.75rem",background:"#f0fdf4",borderRadius:4,padding:"2px 6px"}}>{c.chemName}: <strong>{rem}</strong></div>;
                            })}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`crm-status ${a.status==="Completed"?"crm-status-green":a.status==="Allocated"?"crm-status-blue":"crm-status-yellow"}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        {a.status==="Allocated" && (
                          <button className="crm-btn-edit" title="Mark Used" onClick={()=>{
                            const used = a.chemicals.map(c=>({...c, usedQty:c.givenQty}));
                            markUsed(a.id, used);
                          }}>✅</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── EOD / SOD REPORT ── */}
      {activeTab==="eod" && (
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Summary cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
            {[
              {icon:"📤",label:"Given Today",  val:totalGiven,    color:"#2563eb",bg:"#eff6ff"},
              {icon:"✅",label:"Used Today",   val:totalUsed,     color:"#059669",bg:"#f0fdf4"},
              {icon:"🔄",label:"Returned",     val:totalReturned, color:"#7c3aed",bg:"#f5f3ff"},
              {icon:"📥",label:"Purchased",    val:totalPurchased,color:"#d97706",bg:"#fffbeb"},
            ].map((c,i)=>(
              <div key={i} style={{background:c.bg,borderTop:`3px solid ${c.color}`,borderRadius:12,padding:"14px 16px"}}>
                <div style={{fontSize:"1.2rem"}}>{c.icon}</div>
                <div style={{fontSize:"1.4rem",fontWeight:800,color:c.color}}>{c.val}</div>
                <div style={{fontSize:"0.74rem",color:"#64748b"}}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Today's log */}
          <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}>
            <div style={{padding:"12px 16px",background:"#f8fafc",borderBottom:"1px solid #e2e8f0",fontWeight:700,fontSize:"0.88rem",display:"flex",justifyContent:"space-between"}}>
              <span>📋 Today's Stock Movement — {today()}</span>
              <span className="crm-count-badge">{todayLogs.length} transactions</span>
            </div>
            {todayLogs.length===0 ? (
              <div style={{padding:32,textAlign:"center",color:"#94a3b8"}}>No stock movement today</div>
            ) : (
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.82rem"}}>
                <thead><tr style={{background:"#f1f5f9"}}>
                  {["Time","Chemical","Qty","Unit","Type","Note","By"].map(h=>(
                    <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:"0.7rem",fontWeight:700,color:"#64748b",textTransform:"uppercase"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {todayLogs.map((l,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid #f1f5f9"}}>
                      <td style={{padding:"8px 12px"}}>{l.time}</td>
                      <td style={{padding:"8px 12px",fontWeight:600}}>{l.itemName}</td>
                      <td style={{padding:"8px 12px"}}>
                        <span style={{fontWeight:700,color:l.type==="allocated"||l.type==="purchase"?"#059669":"#dc2626"}}>
                          {l.type==="allocated"||l.type==="purchase"?"+":"-"}{l.qty}
                        </span>
                      </td>
                      <td style={{padding:"8px 12px"}}>{stock.find(s=>s.id===l.itemId)?.unit||""}</td>
                      <td style={{padding:"8px 12px"}}>
                        <span className={`crm-status crm-status-${l.type==="allocated"?"blue":l.type==="used"?"red":l.type==="returned"?"purple":l.type==="purchase"?"green":"teal"}`}>
                          {l.type}
                        </span>
                      </td>
                      <td style={{padding:"8px 12px",fontSize:"0.78rem",color:"#64748b"}}>{l.note}</td>
                      <td style={{padding:"8px 12px"}}>{l.by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Current stock snapshot */}
          <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}>
            <div style={{padding:"12px 16px",background:"#f8fafc",borderBottom:"1px solid #e2e8f0",fontWeight:700,fontSize:"0.88rem"}}>
              📦 Current Stock Snapshot — {today()}
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.82rem"}}>
              <thead><tr style={{background:"#f1f5f9"}}>
                {["Chemical","Category","Current Qty","Unit","Min Stock","Status"].map(h=>(
                  <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:"0.7rem",fontWeight:700,color:"#64748b",textTransform:"uppercase"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {stock.map((s,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #f1f5f9",background:s.qty===0?"#fef2f2":s.qty<=s.minStock?"#fffbeb":""}}>
                    <td style={{padding:"8px 12px",fontWeight:600}}>{s.name}</td>
                    <td style={{padding:"8px 12px"}}>{s.category}</td>
                    <td style={{padding:"8px 12px"}}><strong style={{color:s.qty===0?"#dc2626":s.qty<=s.minStock?"#d97706":"#059669",fontSize:"1.05rem"}}>{s.qty}</strong></td>
                    <td style={{padding:"8px 12px"}}>{s.unit}</td>
                    <td style={{padding:"8px 12px"}}>{s.minStock}</td>
                    <td style={{padding:"8px 12px"}}>
                      <span className={`crm-status ${s.qty===0?"crm-status-red":s.qty<=s.minStock?"crm-status-yellow":"crm-status-green"}`}>
                        {s.qty===0?"🚨 Out of Stock":s.qty<=s.minStock?"⚠️ Low Stock":"✅ OK"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ASSET MANAGEMENT ── */}
      {activeTab==="assets" && (
        <>
          {assets.length===0 ? (
            <div className="crm-empty-state"><span>🔧</span><p>No assets registered yet</p>
              <button className="crm-btn-primary" onClick={()=>{setFormType("asset");setShowForm(true);}}>➕ Add First Asset</button>
            </div>
          ) : (
            <div className="crm-table-wrap">
              <table className="crm-table">
                <thead><tr>
                  <th>Asset ID</th><th>Asset Name</th><th>Category</th><th>Serial No</th>
                  <th>Purchase Date</th><th>Purchase Cost</th><th>Assigned To</th>
                  <th>Last Service</th><th>Next Service Due</th><th>Status</th>
                </tr></thead>
                <tbody>
                  {assets.map((a,i)=>(
                    <tr key={i}>
                      <td><span className="crm-id">{a.assetId}</span></td>
                      <td><strong>{a.name}</strong></td>
                      <td>{a.category}</td>
                      <td>{a.serialNo||"—"}</td>
                      <td>{a.purchaseDate}</td>
                      <td><strong>₹{Number(a.purchaseCost||0).toLocaleString("en-IN")}</strong></td>
                      <td>{a.assignedTo||"—"}</td>
                      <td>{a.lastServiceDate||"—"}</td>
                      <td style={{color: a.nextServiceDate && new Date(a.nextServiceDate)<new Date()?"#dc2626":"#0f172a"}}>
                        {a.nextServiceDate||"—"}
                      </td>
                      <td><span className={`crm-status crm-status-${a.status==="Active"?"green":a.status==="Under Repair"?"orange":"red"}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── REPAIR & MAINTENANCE ── */}
      {activeTab==="repair" && (
        <>
          {repairs.length===0 ? (
            <div className="crm-empty-state"><span>🛠️</span><p>No repair records yet</p>
              <button className="crm-btn-primary" onClick={()=>{setFormType("repair");setShowForm(true);}}>🛠️ Log First Repair</button>
            </div>
          ) : (
            <div className="crm-table-wrap">
              <table className="crm-table">
                <thead><tr>
                  <th>Date</th><th>Asset</th><th>Issue</th><th>Repair Type</th>
                  <th>Vendor / Technician</th><th>Cost</th><th>Status</th><th>Completed On</th>
                </tr></thead>
                <tbody>
                  {repairs.map((r,i)=>(
                    <tr key={i}>
                      <td>{r.date}</td>
                      <td><strong>{r.assetName}</strong><br/><span className="crm-id">{r.assetId}</span></td>
                      <td>{r.issue}</td>
                      <td>{r.repairType}</td>
                      <td>{r.vendor||r.technician||"—"}</td>
                      <td><strong>₹{Number(r.cost||0).toLocaleString("en-IN")}</strong></td>
                      <td><span className={`crm-status crm-status-${r.status==="Completed"?"green":r.status==="In Progress"?"orange":"blue"}`}>{r.status}</span></td>
                      <td>{r.completedOn||"—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── MACHINE PURCHASE ── */}
      {activeTab==="purchase" && (
        <>
          {machinePurchases.length===0 ? (
            <div className="crm-empty-state"><span>🛒</span><p>No machine purchases yet</p>
              <button className="crm-btn-primary" onClick={()=>{setFormType("machine");setShowForm(true);}}>🛒 Add Purchase</button>
            </div>
          ) : (
            <div className="crm-table-wrap">
              <table className="crm-table">
                <thead><tr>
                  <th>Date</th><th>Machine Name</th><th>Category</th><th>Vendor</th>
                  <th>Model / Serial</th><th>Qty</th><th>Unit Cost</th><th>Total Cost</th>
                  <th>Payment Mode</th><th>Invoice No</th><th>Warranty</th>
                </tr></thead>
                <tbody>
                  {machinePurchases.map((p,i)=>(
                    <tr key={i}>
                      <td>{p.date}</td>
                      <td><strong>{p.machineName}</strong></td>
                      <td>{p.category}</td>
                      <td>{p.vendor}</td>
                      <td>{p.modelNo||"—"}</td>
                      <td>{p.qty}</td>
                      <td>₹{Number(p.unitCost||0).toLocaleString("en-IN")}</td>
                      <td><strong>₹{Number(p.totalCost||0).toLocaleString("en-IN")}</strong></td>
                      <td>{p.paymentMode}</td>
                      <td><span className="crm-id">{p.invoiceNo||"—"}</span></td>
                      <td>{p.warrantyUntil||"—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── FORMS ── */}
      {showForm && formType==="purchase" && <StockPurchaseForm stock={stock} onSave={(itemId,qty,note,vendor)=>{adjustStock(itemId,qty,"purchase",note); setShowForm(false);}} onClose={()=>setShowForm(false)} />}
      {showForm && formType==="use"      && <StockUseForm      stock={stock} onSave={(itemId,qty,note)=>{adjustStock(itemId,-qty,"manual_use",note); setShowForm(false);}} onClose={()=>setShowForm(false)} />}
      {showForm && formType==="allocate" && <AllocationForm stock={stock} services={pendingServices} onSave={(alloc,chemicals)=>{
        const id = `ALLOC-${Date.now()}`;
        const newAlloc = {...alloc, id, chemicals, status:"Allocated", date:today(), allocatedBy:user.name};
        saveAlloc([newAlloc,...allocations]);
        // Reserve stock
        chemicals.forEach(c => adjustStock(c.chemId, -Number(c.givenQty), "allocated", `Allocated to ${alloc.technician} for ${alloc.customerName}`, id));
        setShowForm(false);
      }} onClose={()=>setShowForm(false)} />}
      {showForm && formType==="asset"    && <AssetForm onSave={a=>{saveAssets([{...a,assetId:`AST-${Date.now()}`},...assets]);setShowForm(false);}} onClose={()=>setShowForm(false)} />}
      {showForm && formType==="repair"   && <RepairForm assets={assets} onSave={r=>{
        saveRepairs([{...r,date:today()},...repairs]);
        saveAssets(assets.map(a=>a.assetId===r.assetId?{...a,status:"Under Repair"}:a));
        setShowForm(false);
      }} onClose={()=>setShowForm(false)} />}
      {showForm && formType==="machine"  && <MachinePurchaseForm onSave={p=>{
        savePurch([{...p,date:today()},...machinePurchases]);
        saveAssets([{name:p.machineName,category:p.category,serialNo:p.modelNo,purchaseDate:today(),purchaseCost:p.totalCost,assignedTo:"",status:"Active",assetId:`AST-${Date.now()}`},...assets]);
        setShowForm(false);
      }} onClose={()=>setShowForm(false)} />}
    </div>
  );
}

// ── CHEMICAL ALLOCATION FORM ─────────────────────────
function AllocationForm({ stock, services, onSave, onClose }) {
  const [technician, setTechnician] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [serviceName,  setServiceName]  = useState("");
  const [treatmentId,  setTreatmentId]  = useState("");
  const [chemicals,    setChemicals]    = useState([]);

  const treatment = TREATMENTS.find(t=>t.id===treatmentId);

  useEffect(() => {
    if(treatment) {
      setChemicals(treatment.chemicals.map(c=>{
        const stockItem = stock.find(s=>s.name===c.name);
        return { chemId:stockItem?.id||"", chemName:c.name, unit:c.unit, givenQty:"", availableQty:stockItem?.qty||0 };
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treatmentId]);

  const fillFromService = (svc) => {
    setCustomerId(svc.customerId||"");
    setCustomerName(svc.customerName||"");
    setTechnician(svc.technician||"");
    setServiceName(svc.plan||svc.treatment||"");
    setPropertyType(svc.propertyType||"");
  };

  return (
    <div className="crm-modal-overlay" onClick={onClose}>
      <div className="crm-modal crm-modal-xl" onClick={e=>e.stopPropagation()}>
        <div className="crm-modal-header"><h3>🧪 Chemical Allocation</h3><button className="crm-modal-close" onClick={onClose}>✕</button></div>
        <div className="crm-modal-body">

          {/* Quick fill from scheduled service */}
          {services.length>0 && (
            <div className="crm-form-section">
              <div className="crm-form-section-title">📅 Fill from Scheduled Service</div>
              <select className="crm-input" onChange={e=>{const s=services.find(sv=>sv.id===e.target.value);if(s)fillFromService(s);}}>
                <option value="">Select a scheduled service to auto-fill</option>
                {services.map(s=><option key={s.id} value={s.id}>{s.customerName} · {s.scheduledDate} · {s.technician||"Unassigned"}</option>)}
              </select>
            </div>
          )}

          <div className="crm-form-section">
            <div className="crm-form-section-title">👤 Service Details</div>
            <div className="crm-form-grid">
              <FI label="Technician *"    type="select" options={["Sanjeet Varma","Deepak Sonawane"]} val={technician}   set={setTechnician} />
              <FI label="Customer Name *" val={customerName} set={setCustomerName} />
              <FI label="Customer ID"     val={customerId}   set={setCustomerId} />
              <FI label="Service Name"    val={serviceName}  set={setServiceName} placeholder="AMC 3 Services" />
              <FI label="Property Type"   type="select" options={["1RK","1BHK","2BHK","3BHK","4BHK","Bungalow","Office","Restaurant","Society"]} val={propertyType} set={setPropertyType} />
              <FI label="Property Size (sqft)" val={propertySize} set={setPropertySize} placeholder="e.g. 500 sqft" />
            </div>
          </div>

          <div className="crm-form-section">
            <div className="crm-form-section-title">🧪 Treatment & Chemicals</div>
            <div className="crm-form-group" style={{marginBottom:12}}>
              <label>Treatment Type *</label>
              <select className="crm-input" value={treatmentId} onChange={e=>setTreatmentId(e.target.value)}>
                <option value="">Select Treatment</option>
                {TREATMENTS.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            {chemicals.length>0 && (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8,padding:"8px 12px",background:"#f1f5f9",borderRadius:8,fontSize:"0.75rem",fontWeight:700,color:"#64748b",textTransform:"uppercase"}}>
                  <span>Chemical</span><span>Unit</span><span>Available Stock</span><span>Give Quantity *</span>
                </div>
                {chemicals.map((c,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8,padding:"8px 12px",background:c.availableQty===0?"#fef2f2":c.availableQty<10?"#fffbeb":"#f8fafc",borderRadius:8,border:`1px solid ${c.availableQty===0?"#fca5a5":c.availableQty<10?"#fde68a":"#e2e8f0"}`}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:"0.85rem"}}>{c.chemName}</div>
                      {c.availableQty===0 && <div style={{fontSize:"0.7rem",color:"#dc2626"}}>🚨 Out of stock!</div>}
                      {c.availableQty>0&&c.availableQty<10 && <div style={{fontSize:"0.7rem",color:"#d97706"}}>⚠️ Low stock</div>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",fontSize:"0.85rem"}}>{c.unit}</div>
                    <div style={{display:"flex",alignItems:"center"}}>
                      <span style={{fontWeight:700,color:c.availableQty===0?"#dc2626":c.availableQty<10?"#d97706":"#059669"}}>{c.availableQty} {c.unit}</span>
                    </div>
                    <input type="number" className="crm-input" placeholder="0"
                      max={c.availableQty} value={c.givenQty}
                      onChange={e=>setChemicals(chemicals.map((ch,j)=>j===i?{...ch,givenQty:e.target.value}:ch))} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="crm-modal-footer">
          <button className="crm-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="crm-btn-primary" onClick={()=>onSave({technician,customerId,customerName,propertyType,propertySize,serviceName,treatmentName:treatment?.name||""},chemicals)}>
            🧪 Allocate Chemicals
          </button>
        </div>
      </div>
    </div>
  );
}

// ── STOCK PURCHASE FORM ──────────────────────────────
function StockPurchaseForm({ stock, onSave, onClose }) {
  const [itemId,  setItemId]  = useState("");
  const [qty,     setQty]     = useState("");
  const [note,    setNote]    = useState("");
  const [vendor,  setVendor]  = useState("");
  return (
    <SimpleModal title="➕ Stock Purchase" onClose={onClose} onSave={()=>onSave(itemId,Number(qty),`Purchase from ${vendor}. ${note}`,vendor)}>
      <FI label="Chemical *"  type="select" options={stock.map(s=>s.name)} val={stock.find(s=>s.id===itemId)?.name||""} set={v=>{const s=stock.find(x=>x.name===v);setItemId(s?.id||"");}} />
      {itemId && <div style={{background:"#f0fdf4",padding:"8px 12px",borderRadius:8,fontSize:"0.82rem",color:"#15803d",fontWeight:600}}>Current Stock: {stock.find(s=>s.id===itemId)?.qty} {stock.find(s=>s.id===itemId)?.unit}</div>}
      <FI label="Quantity *"  type="number" val={qty}    set={setQty} />
      <FI label="Vendor"      val={vendor}  set={setVendor} placeholder="Vendor name" />
      <FI label="Notes"       val={note}    set={setNote} placeholder="Bill no, invoice reference..." />
    </SimpleModal>
  );
}

// ── STOCK USE FORM ───────────────────────────────────
function StockUseForm({ stock, onSave, onClose }) {
  const [itemId, setItemId] = useState("");
  const [qty,    setQty]    = useState("");
  const [note,   setNote]   = useState("");
  return (
    <SimpleModal title="➖ Manual Stock Usage" onClose={onClose} onSave={()=>onSave(itemId,Number(qty),note)}>
      <FI label="Chemical *" type="select" options={stock.map(s=>s.name)} val={stock.find(s=>s.id===itemId)?.name||""} set={v=>{const s=stock.find(x=>x.name===v);setItemId(s?.id||"");}} />
      {itemId && <div style={{background:"#fef2f2",padding:"8px 12px",borderRadius:8,fontSize:"0.82rem",color:"#dc2626",fontWeight:600}}>Current Stock: {stock.find(s=>s.id===itemId)?.qty} {stock.find(s=>s.id===itemId)?.unit}</div>}
      <FI label="Quantity *" type="number" val={qty}  set={setQty} />
      <FI label="Reason"     val={note}    set={setNote} placeholder="Reason for manual deduction..." />
    </SimpleModal>
  );
}

// ── ASSET FORM ───────────────────────────────────────
function AssetForm({ onSave, onClose }) {
  const [f,setF] = useState({name:"",category:"Sprayer Machine",serialNo:"",purchaseDate:"",purchaseCost:"",assignedTo:"",lastServiceDate:"",nextServiceDate:"",status:"Active",notes:""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return (
    <SimpleModal title="🔧 Add Asset" onClose={onClose} onSave={()=>onSave(f)}>
      <div className="crm-form-grid">
        <FI label="Asset Name *"     val={f.name}             set={v=>s("name",v)} placeholder="e.g. Sprayer Machine #1" />
        <FI label="Category"         type="select" options={ASSET_CATEGORIES} val={f.category} set={v=>s("category",v)} />
        <FI label="Serial No"        val={f.serialNo}         set={v=>s("serialNo",v)} />
        <FI label="Purchase Date"    type="date" val={f.purchaseDate}    set={v=>s("purchaseDate",v)} />
        <FI label="Purchase Cost"    type="number" val={f.purchaseCost}  set={v=>s("purchaseCost",v)} />
        <FI label="Assigned To"      type="select" options={["Unassigned","Sanjeet Varma","Deepak Sonawane","Office"]} val={f.assignedTo} set={v=>s("assignedTo",v)} />
        <FI label="Last Service"     type="date" val={f.lastServiceDate} set={v=>s("lastServiceDate",v)} />
        <FI label="Next Service Due" type="date" val={f.nextServiceDate} set={v=>s("nextServiceDate",v)} />
        <FI label="Status"           type="select" options={ASSET_STATUS} val={f.status} set={v=>s("status",v)} />
      </div>
    </SimpleModal>
  );
}

// ── REPAIR FORM ──────────────────────────────────────
function RepairForm({ assets, onSave, onClose }) {
  const [f,setF] = useState({assetId:"",assetName:"",issue:"",repairType:"External",vendor:"",cost:"",status:"Open",completedOn:"",notes:""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return (
    <SimpleModal title="🛠️ Log Repair" onClose={onClose} onSave={()=>onSave(f)}>
      <div className="crm-form-grid">
        <div className="crm-form-group">
          <label>Asset *</label>
          <select className="crm-input" value={f.assetId} onChange={e=>{const a=assets.find(x=>x.assetId===e.target.value);s("assetId",e.target.value);s("assetName",a?.name||"");}}>
            <option value="">Select Asset</option>
            {assets.map(a=><option key={a.assetId} value={a.assetId}>{a.name}</option>)}
          </select>
        </div>
        <FI label="Issue Description *" val={f.issue}       set={v=>s("issue",v)} placeholder="What is the problem?" />
        <FI label="Repair Type"         type="select" options={["External","Internal","Under Warranty"]} val={f.repairType} set={v=>s("repairType",v)} />
        <FI label="Vendor / Technician" val={f.vendor}      set={v=>s("vendor",v)} />
        <FI label="Estimated Cost"      type="number" val={f.cost} set={v=>s("cost",v)} />
        <FI label="Status"              type="select" options={REPAIR_STATUS} val={f.status} set={v=>s("status",v)} />
        {f.status==="Completed" && <FI label="Completed On" type="date" val={f.completedOn} set={v=>s("completedOn",v)} />}
      </div>
    </SimpleModal>
  );
}

// ── MACHINE PURCHASE FORM ────────────────────────────
function MachinePurchaseForm({ onSave, onClose }) {
  const [f,setF] = useState({machineName:"",category:"Sprayer Machine",vendor:"",modelNo:"",qty:"1",unitCost:"",totalCost:"",paymentMode:"Cash",invoiceNo:"",purchaseDate:"",warrantyUntil:"",notes:""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  useEffect(()=>{ setF(p=>({...p,totalCost:(Number(p.qty||0)*Number(p.unitCost||0)).toString()})); },[f.qty,f.unitCost]);
  return (
    <SimpleModal title="🛒 Machine Purchase" onClose={onClose} onSave={()=>onSave(f)}>
      <div className="crm-form-grid">
        <FI label="Machine Name *"    val={f.machineName}  set={v=>s("machineName",v)} placeholder="e.g. Knapsack Sprayer" />
        <FI label="Category"          type="select" options={ASSET_CATEGORIES} val={f.category} set={v=>s("category",v)} />
        <FI label="Vendor *"          val={f.vendor}       set={v=>s("vendor",v)} />
        <FI label="Model / Serial No" val={f.modelNo}      set={v=>s("modelNo",v)} />
        <FI label="Quantity"          type="number" val={f.qty}      set={v=>s("qty",v)} />
        <FI label="Unit Cost (₹)"     type="number" val={f.unitCost} set={v=>s("unitCost",v)} />
        <FI label="Total Cost (₹)"    type="number" val={f.totalCost} set={()=>{}} />
        <FI label="Payment Mode"      type="select" options={["Cash","HDFC Online","Cheque","UPI"]} val={f.paymentMode} set={v=>s("paymentMode",v)} />
        <FI label="Invoice No"        val={f.invoiceNo}    set={v=>s("invoiceNo",v)} />
        <FI label="Purchase Date"     type="date" val={f.purchaseDate}  set={v=>s("purchaseDate",v)} />
        <FI label="Warranty Until"    type="date" val={f.warrantyUntil} set={v=>s("warrantyUntil",v)} />
      </div>
    </SimpleModal>
  );
}

// ── Shared helpers ───────────────────────────────────
function SimpleModal({ title, onClose, onSave, children }) {
  return (
    <div className="crm-modal-overlay" onClick={onClose}>
      <div className="crm-modal crm-modal-lg" onClick={e=>e.stopPropagation()}>
        <div className="crm-modal-header"><h3>{title}</h3><button className="crm-modal-close" onClick={onClose}>✕</button></div>
        <div className="crm-modal-body" style={{display:"flex",flexDirection:"column",gap:12}}>{children}</div>
        <div className="crm-modal-footer">
          <button className="crm-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="crm-btn-primary"   onClick={onSave}>💾 Save</button>
        </div>
      </div>
    </div>
  );
}

function FI({ label, type="text", val, set, options=[], placeholder="" }) {
  return (
    <div className="crm-form-group">
      <label>{label}</label>
      {type==="select" ? (
        <select className="crm-input" value={val} onChange={e=>set(e.target.value)}>
          <option value="">Select {label}</option>
          {options.map(o=><option key={o}>{o}</option>)}
        </select>
      ) : (
        <input className="crm-input" type={type} value={val} onChange={e=>set(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}
