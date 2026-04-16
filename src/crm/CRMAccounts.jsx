import { useState, useEffect } from "react";
import "./crm.css";

// ── Master Data (from your Google Sheets) ─────────────
const DEPARTMENTS   = ["Pest Control","Housekeeping","Pest Control / Housekeeping"];
const PORTFOLIOS    = ["B2C","Hotel","Society","Office","Shop","Clinic"];
const CASH_ACCOUNTS = ["HDFC - NewTech Pest","Cash - NewTech Services","GPay - NKGSB Suraj","Petty Cash","Suraj Sir HDFC","Laxman Sir-NKGB"];
const LEAD_SOURCES  = ["Google Ad","Just Dial","Existing Customer","Reference","Suraj Sir Reference","Natraj Sir Reference","Laxman Sir Reference","Ajit Sir Reference","Walk-in","WhatsApp","Instagram","Facebook","Other"];
const SALESPERSONS  = ["Nandini","Suraj Sir","Rasika","Karishma","Laxman Sir","Ajit Sir","Other"];
const TECHNICIANS   = ["Sanjeet Varma","Deepak Sonawane"];
const SERVICE_CATS  = ["General Pest Control","Bed Bugs Treatment","Bed Bugs Treatment Herbal","Anti-Termite Treatment","Rodent Control","Thermal Fogging","General Pest Control (Herbal)","Full Deep Cleaning","Deep Cleaning","Office Deep Cleaning","Un Furnished Flat Cleaning","Kitchen Cleaning","Carpet Shampooing","Other"];
const SERVICE_PLANS = ["AMC","Quarterly","Monthly","Single Service","One Month","45 Days","90 Days","180 Days","Weekly","Fortnightly","Alternate Month"];
const PAYMENT_MODES = ["Cash","HDFC Online","NTP Cheque","NTP HDFC BANK","SURAJ NKGSB","GPay","UPI","Bank Transfer","Suraj Sir HDFC"];
const PAYMENT_STATUS= ["Paid","Pending","Partial"];
const INVOICE_TYPES = ["GST","Non GST"];
const EXPENSE_TYPES = ["Direct","Indirect"];
const GST_RATES     = [0,5,12,18,28];

// Expense Heads from your Expense_Master sheet
const EXPENSE_HEADS = {
  "Bank Charges":                ["Auto Mandate","AQB Charges","CASH DEPOSIT Charges","Bulk Transaction Charges","International Transaction Charges"],
  "Chemical Purchase":           ["Mahalaxmi Argo","S.R Enterprises","Other"],
  "Deposit":                     ["Cash Deposit","Received From Suraj Sir"],
  "GST Payment":                 ["GST Payment Paid"],
  "Laptop Rent":                 ["Laptop Rent"],
  "Marketing":                   ["Google Ad","Canva","Facebook AD Charges"],
  "Advertisement Expense":       ["Facebook AD","Facebook Ads Refund"],
  "Material Purchase":           ["Housekeeping Material Purchase","Mask Purchase","Pest Control Material","Rat Cake"],
  "Meal Expenses":               ["Suraj Sir Snacks","Tea Expenses","Water Bottle Expense","Food Expenses"],
  "Mobile Recharge":             ["Mobile Recharge"],
  "Office Expenses":             ["Office Maintenance & Pooja","Electrical Equipment","Safety Equipment"],
  "Operating Expenses":          ["Bread Expense","Cement Purchase","Diesel Expenses","White Cement Purchase","Ratol Cake"],
  "Repair & Maintenance":        ["Pest Control Pump Repair","Machinery Repair","Vehicle Maintenance"],
  "Salary Expense":              ["Feb Salary Expense","Mar Salary Expense"],
  "Stationary":                  ["File Purchase","Pen Purchase","Xerox","Calendar Purchase","Folder and Xerox","Whitner Purchase","Folder File","Print Paper","Diary Purchase","Marker Purchase","Register Purchase"],
  "Transfer":                    ["Transfer to Suraj Sir"],
  "Travelling Expenses":         ["Bus Travelling Expense","Parking Charges","Pest Control Travelling","Petrol Expense","Survey Travelling Expense","Travelling Expenses"],
  "Housekeeping Travelling Expenses": ["Housekeeping Travelling"],
  "Uniform Expenses":            ["Supervisor Batch Purchase"],
  "Loans & Advances":            ["Security Deposit"],
  "Personal Expenses":           ["Food Expenses"],
  "Software":                    ["Subscription Charges","Anthropic"],
  "Other":                       ["Other"],
};

const TABS = [
  ["dashboard",    "📊 Dashboard"],
  ["invoice",      "🧾 Invoice Register"],
  ["receipt",      "✅ Receipt Register"],
  ["expense",      "💸 Expense Register"],
  ["petty",        "💵 Petty Cash"],
  ["purchase",     "🛒 Purchase Register"],
  ["transfer",     "🔄 Cash Transfer"],
  ["gst",          "📋 GST Register"],
  ["amc",          "🔁 AMC Renewals"],
];

const fmt  = n => `₹${Number(n||0).toLocaleString("en-IN")}`;
const today = () => new Date().toLocaleDateString("en-IN");
const genNo = (prefix) => `${prefix}/${String(Math.floor(Math.random()*9000)+1000)}/${new Date().getFullYear()%100}-${(new Date().getFullYear()+1)%100}`;

export default function CRMAccounts() {
  const [activeTab,   setActiveTab]   = useState("dashboard");
  const [invoices,    setInvoices]    = useState([]);
  const [receipts,    setReceipts]    = useState([]);
  const [expenses,    setExpenses]    = useState([]);
  const [petty,       setPetty]       = useState([]);
  const [purchases,   setPurchases]   = useState([]);
  const [transfers,   setTransfers]   = useState([]);
  const [gstReg,      setGstReg]      = useState([]);
  const [showForm,    setShowForm]    = useState(false);
  const [formType,    setFormType]    = useState("");

  const user = JSON.parse(localStorage.getItem("crm_user") || "{}");

  useEffect(() => {
    const load = (k, set) => { const s = localStorage.getItem(k); if(s) set(JSON.parse(s)); };
    load("nt_invoices",    setInvoices);
    load("nt_receipts",    setReceipts);
    load("nt_expenses",    setExpenses);
    load("nt_petty",       setPetty);
    load("nt_purchases",   setPurchases);
    load("nt_transfers",   setTransfers);
    load("nt_gst",         setGstReg);
  }, []);

  const saveData = (key, list, setter) => { localStorage.setItem(key, JSON.stringify(list)); setter(list); };

  // ── Dashboard metrics ────────────────────────────────
  const totalRevenue    = invoices.reduce((s,i)=>s+Number(i.taxableAmount||0),0);
  const totalCollection = receipts.reduce((s,r)=>s+Number(r.receivedAmount||0),0);
  const totalOutstanding= invoices.reduce((s,i)=>s+Number(i.balanceOutstanding||0),0);
  const totalDirectExp  = [...expenses.filter(e=>e.expenseType==="Direct"), ...petty.filter(p=>p.expenseType==="Direct")].reduce((s,e)=>s+Number(e.totalExpenseAmount||e.amount||0),0);
  const totalIndirectExp= [...expenses.filter(e=>e.expenseType==="Indirect"), ...petty.filter(p=>p.expenseType==="Indirect")].reduce((s,e)=>s+Number(e.totalExpenseAmount||e.amount||0),0);
  const totalPurchases  = purchases.reduce((s,p)=>s+Number(p.totalPurchaseAmount||0),0);
  const totalProfit     = totalRevenue - totalDirectExp - totalIndirectExp;
  const profitPct       = totalRevenue>0?((totalProfit/totalRevenue)*100).toFixed(1):"0.0";

  // Cash account balances
  const cashBalances = CASH_ACCOUNTS.map(ca => {
    const received  = receipts.filter(r=>r.cashAccount===ca).reduce((s,r)=>s+Number(r.receivedAmount||0),0);
    const expPaid   = expenses.filter(e=>e.cashAccount===ca).reduce((s,e)=>s+Number(e.totalExpenseAmount||0),0);
    const purPaid   = purchases.filter(p=>p.cashAccount===ca).reduce((s,p)=>s+Number(p.totalPaid||0),0);
    const tfrOut    = transfers.filter(t=>t.fromAccount===ca).reduce((s,t)=>s+Number(t.transferAmount||0),0);
    const tfrIn     = transfers.filter(t=>t.toAccount===ca).reduce((s,t)=>s+Number(t.transferAmount||0),0);
    const balance   = received - expPaid - purPaid - tfrOut + tfrIn;
    return { ca, received, expPaid, balance };
  });

  // AMC renewals from invoices
  const amcContracts = invoices.filter(i => i.servicePlan==="AMC" && i.contractEndDate).map(i => {
    const end  = new Date(i.contractEndDate.split("/").reverse().join("-"));
    const diff = Math.ceil((end - new Date()) / 86400000);
    return { ...i, daysLeft: diff, priority: diff<=30?"🔴 Urgent": diff<=90?"🟡 Soon":"🟢 Normal" };
  }).sort((a,b)=>a.daysLeft-b.daysLeft);

  const openForm = (type) => { setFormType(type); setShowForm(true); };

  return (
    <div className="crm-page">

      {/* Header */}
      <div className="crm-page-header">
        <div>
          <h2>💰 Accounts & Finance</h2>
          <p className="crm-page-sub">Invoice · Receipt · Expense · Petty Cash · Purchase · GST · AMC</p>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button className="crm-btn-secondary" style={{fontSize:"0.8rem"}} onClick={()=>openForm("petty")}>💵 Petty Cash</button>
          <button className="crm-btn-secondary" style={{fontSize:"0.8rem"}} onClick={()=>openForm("expense")}>💸 Expense</button>
          <button className="crm-btn-secondary" style={{fontSize:"0.8rem"}} onClick={()=>openForm("receipt")}>✅ Receipt</button>
          <button className="crm-btn-primary"   style={{fontSize:"0.8rem"}} onClick={()=>openForm("invoice")}>🧾 New Invoice</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10,marginBottom:20}}>
        {[
          {icon:"💵",label:"Revenue",    val:fmt(totalRevenue),    color:"#2563eb",bg:"#eff6ff"},
          {icon:"✅",label:"Collection", val:fmt(totalCollection), color:"#059669",bg:"#f0fdf4"},
          {icon:"⏳",label:"Outstanding",val:fmt(totalOutstanding),color:"#dc2626",bg:"#fef2f2"},
          {icon:"💸",label:"Direct Exp", val:fmt(totalDirectExp),  color:"#d97706",bg:"#fffbeb"},
          {icon:"📋",label:"Indirect Exp",val:fmt(totalIndirectExp),color:"#7c3aed",bg:"#f5f3ff"},
          {icon:"🛒",label:"Purchases",  val:fmt(totalPurchases),  color:"#0891b2",bg:"#ecfeff"},
          {icon:"📊",label:`Profit ${profitPct}%`,val:fmt(totalProfit),color:totalProfit>=0?"#059669":"#dc2626",bg:totalProfit>=0?"#f0fdf4":"#fef2f2"},
        ].map((c,i)=>(
          <div key={i} style={{background:c.bg,borderTop:`3px solid ${c.color}`,borderRadius:12,padding:"12px 14px",boxShadow:"0 1px 3px rgba(0,0,0,0.07)"}}>
            <div style={{fontSize:"1.1rem",marginBottom:3}}>{c.icon}</div>
            <div style={{fontSize:"1.1rem",fontWeight:800,color:c.color}}>{c.val}</div>
            <div style={{fontSize:"0.72rem",color:"#64748b",marginTop:1}}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="crm-tabs" style={{overflowX:"auto",flexWrap:"nowrap"}}>
        {TABS.map(([k,l])=>(
          <button key={k} className={`crm-tab ${activeTab===k?"active":""}`} onClick={()=>setActiveTab(k)} style={{whiteSpace:"nowrap"}}>{l}</button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {activeTab==="dashboard" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>

          {/* Cash Account Balances */}
          <MiniTable title="🏦 Cash Account Balances" cols={["Account","Received","Expenses","Balance"]}
            rows={cashBalances.map(c=>[c.ca, fmt(c.received), fmt(c.expPaid),
              <span style={{fontWeight:700,color:c.balance>=0?"#059669":"#dc2626"}}>{fmt(c.balance)}</span>])} />

          {/* Recent Invoices */}
          <MiniTable title="🧾 Recent Invoices" cols={["Invoice No","Customer","Amount","Status"]}
            rows={invoices.slice(0,8).map(i=>[
              <span className="crm-id">{i.invoiceNo}</span>, i.customerName,
              fmt(i.totalInvoiceAmount),
              <span className={`crm-status crm-status-${i.paymentStatus==="Paid"?"green":i.paymentStatus==="Partial"?"orange":"red"}`}>{i.paymentStatus||"Pending"}</span>
            ])} />

          {/* AMC Due Soon */}
          <MiniTable title="🔁 AMC Renewals Due" cols={["Customer","Days Left","Priority","Value"]}
            rows={amcContracts.slice(0,6).map(a=>[a.customerName, a.daysLeft, a.priority, fmt(a.totalInvoiceAmount)])} />

          {/* Dept breakdown */}
          <MiniTable title="🏗️ Department Summary" cols={["Dept","Revenue","Collection","Outstanding"]}
            rows={DEPARTMENTS.slice(0,2).map(dept=>{
              const di = invoices.filter(i=>i.department===dept);
              const dr = receipts.filter(r=>r.department===dept);
              return [dept, fmt(di.reduce((s,i)=>s+Number(i.taxableAmount||0),0)),
                fmt(dr.reduce((s,r)=>s+Number(r.receivedAmount||0),0)),
                fmt(di.reduce((s,i)=>s+Number(i.balanceOutstanding||0),0))];
            })} />
        </div>
      )}

      {/* ── INVOICE REGISTER ── */}
      {activeTab==="invoice" && (
        <Register title="🧾 Invoice Register" data={invoices} onAdd={()=>openForm("invoice")}
          cols={["Invoice No","Date","Customer","Dept","Service","Plan","Portfolio","Lead Source","Rate","Discount","Taxable","GST%","GST Amt","Total","Received","Outstanding","Status"]}
          renderRow={inv=>[
            <span className="crm-id">{inv.invoiceNo}</span>,
            inv.invoiceDate, <div><div className="crm-customer-name">{inv.customerName}</div><div className="crm-id">{inv.customerId}</div></div>,
            inv.department, <span className="crm-plan">{inv.serviceCategory}</span>, inv.servicePlan,
            inv.portfolioType, <span className="crm-source-tag">{inv.leadSource}</span>,
            fmt(inv.rate), fmt(inv.discount), fmt(inv.taxableAmount),
            `${inv.gstPct||0}%`, fmt(inv.gstAmount), <strong>{fmt(inv.totalInvoiceAmount)}</strong>,
            <span style={{color:"#059669",fontWeight:600}}>{fmt(inv.amountReceived)}</span>,
            <span style={{color:"#dc2626",fontWeight:600}}>{fmt(inv.balanceOutstanding)}</span>,
            <span className={`crm-status crm-status-${inv.paymentStatus==="Paid"?"green":inv.paymentStatus==="Partial"?"orange":"red"}`}>{inv.paymentStatus||"Pending"}</span>
          ]} />
      )}

      {/* ── RECEIPT REGISTER ── */}
      {activeTab==="receipt" && (
        <Register title="✅ Receipt Register" data={receipts} onAdd={()=>openForm("receipt")}
          cols={["Receipt Date","Invoice No","Customer","Dept","Invoice Amt","Received","TDS","Total Settled","Payment Mode","Receipt Type","Cash Account","Portfolio"]}
          renderRow={r=>[
            r.receiptDate, <span className="crm-id">{r.invoiceNo}</span>,
            <div><div className="crm-customer-name">{r.customerName}</div><div className="crm-id">{r.customerId}</div></div>,
            r.department, fmt(r.invoiceAmount),
            <strong style={{color:"#059669"}}>{fmt(r.receivedAmount)}</strong>,
            fmt(r.tdsAmount), fmt(r.totalSettled),
            r.paymentMode, r.receiptType||"—", r.cashAccount, r.portfolioType
          ]} />
      )}

      {/* ── EXPENSE REGISTER ── */}
      {activeTab==="expense" && (
        <Register title="💸 Expense Register" data={expenses} onAdd={()=>openForm("expense")}
          cols={["Date","Voucher","Dept","Expense Head","Sub Head","Type","Portfolio","Customer","Description","Amount","GST","Total","Payment Mode","Cash Account","Approved By"]}
          renderRow={e=>[
            e.expenseDate, <span className="crm-id">{e.voucherNo||"—"}</span>,
            e.department, e.expenseHead, e.expenseSubHead,
            <span className={`crm-status crm-status-${e.expenseType==="Direct"?"blue":"purple"}`}>{e.expenseType}</span>,
            e.portfolioType||"—", e.customerName||"—", e.expenseDescription||"—",
            fmt(e.expenseAmount), fmt(e.gstAmount),
            <strong style={{color:"#dc2626"}}>{fmt(e.totalExpenseAmount)}</strong>,
            e.paymentMode, e.cashAccount, e.approvedBy||"—"
          ]} />
      )}

      {/* ── PETTY CASH ── */}
      {activeTab==="petty" && (
        <Register title="💵 Petty Cash Register" data={petty} onAdd={()=>openForm("petty")}
          cols={["Date","Voucher","Dept","Type","Portfolio","Expense Head","Sub Head","Amount","Paid To","Cash Account"]}
          renderRow={p=>[
            p.txnDate, <span className="crm-id">{p.voucherNo||"—"}</span>,
            p.department,
            <span className={`crm-status crm-status-${p.expenseType==="Direct"?"blue":"purple"}`}>{p.expenseType}</span>,
            p.portfolioType||"—", p.expenseHead, p.expenseSubHead,
            <strong style={{color:"#dc2626"}}>{fmt(p.amount)}</strong>,
            p.paidTo||"—", p.cashAccount
          ]} />
      )}

      {/* ── PURCHASE REGISTER ── */}
      {activeTab==="purchase" && (
        <Register title="🛒 Purchase Register" data={purchases} onAdd={()=>openForm("purchase")}
          cols={["Date","Purchase No","Vendor","GST No","Dept","Head","Sub Head","Bill No","Taxable","GST%","GST Amt","Total","Paid","Balance","Due Date","Status"]}
          renderRow={p=>[
            p.purchaseDate, <span className="crm-id">{p.purchaseNo}</span>,
            <div><div className="crm-customer-name">{p.vendorName}</div><div className="crm-id">{p.vendorId}</div></div>,
            p.vendorGstNo||"—", p.department, p.purchaseHead, p.purchaseSubHead,
            p.billNo||"—", fmt(p.taxableAmount), `${p.gstPct||0}%`, fmt(p.gstAmount),
            <strong>{fmt(p.totalPurchaseAmount)}</strong>,
            <span style={{color:"#059669"}}>{fmt(p.totalPaid)}</span>,
            <span style={{color:"#dc2626"}}>{fmt(p.balancePayable)}</span>,
            p.dueDate||"—",
            <span className={`crm-status crm-status-${p.paymentStatus==="Paid"?"green":"red"}`}>{p.paymentStatus||"Unpaid"}</span>
          ]} />
      )}

      {/* ── CASH TRANSFER ── */}
      {activeTab==="transfer" && (
        <Register title="🔄 Cash Transfer Register" data={transfers} onAdd={()=>openForm("transfer")}
          cols={["Date","Dept","From Account","To Account","Amount","Transfer Mode","Purpose"]}
          renderRow={t=>[
            t.txnDate, t.department||"—",
            <span style={{background:"#fee2e2",color:"#dc2626",padding:"2px 8px",borderRadius:5,fontSize:"0.78rem"}}>{t.fromAccount}</span>,
            <span style={{background:"#dcfce7",color:"#15803d",padding:"2px 8px",borderRadius:5,fontSize:"0.78rem"}}>{t.toAccount}</span>,
            <strong>{fmt(t.transferAmount)}</strong>,
            t.transferMode||"—", t.purpose||"—"
          ]} />
      )}

      {/* ── GST REGISTER ── */}
      {activeTab==="gst" && (
        <Register title="📋 GST Register" data={gstReg} onAdd={()=>openForm("invoice")}
          cols={["Invoice No","Customer","Date","Type","Dept","Taxable","GST Rate","CGST","SGST","IGST","Total GST","Period","Filing Status","Outstanding GST"]}
          renderRow={g=>[
            <span className="crm-id">{g.invoiceNo}</span>, g.customerName, g.invoiceDate,
            g.invoiceType, g.department, fmt(g.taxableValue),
            `${g.gstRate||0}%`, fmt(g.cgst), fmt(g.sgst), fmt(g.igst),
            <strong>{fmt(g.totalGst)}</strong>,
            g.gstPeriod||"—",
            <span className={`crm-status crm-status-${g.filingStatus==="Filed"?"green":"orange"}`}>{g.filingStatus||"Pending"}</span>,
            <span style={{color:"#dc2626",fontWeight:600}}>{fmt(g.outstandingGst)}</span>
          ]} />
      )}

      {/* ── AMC RENEWALS ── */}
      {activeTab==="amc" && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <h3 style={{fontSize:"0.95rem",fontWeight:700}}>🔁 AMC Renewal Tracker</h3>
              <p style={{fontSize:"0.78rem",color:"#64748b",marginTop:2}}>
                Total AMC Contracts: {amcContracts.length} &nbsp;·&nbsp;
                Due in 30 days: <span style={{color:"#dc2626",fontWeight:700}}>{amcContracts.filter(a=>a.daysLeft<=30).length}</span> &nbsp;·&nbsp;
                Due in 90 days: <span style={{color:"#d97706",fontWeight:700}}>{amcContracts.filter(a=>a.daysLeft<=90).length}</span>
              </p>
            </div>
          </div>
          {amcContracts.length===0 ? (
            <div className="crm-empty-state"><span>🔁</span><p>No AMC contracts yet — create invoices with AMC plan to track renewals</p></div>
          ) : (
            <div className="crm-table-wrap">
              <table className="crm-table">
                <thead><tr>
                  <th>Customer</th><th>Portfolio</th><th>Salesperson</th>
                  <th>Contract Start</th><th>Contract End</th><th>Days Left</th>
                  <th>Priority</th><th>Invoice Value</th><th>Status</th>
                </tr></thead>
                <tbody>
                  {amcContracts.map((a,i)=>(
                    <tr key={i} style={{background:a.daysLeft<=30?"#fef2f2":a.daysLeft<=90?"#fffbeb":""}}>
                      <td><div className="crm-customer-name">{a.customerName}</div><div className="crm-id">{a.customerId}</div></td>
                      <td>{a.portfolioType}</td>
                      <td>{a.salesperson||"—"}</td>
                      <td>{a.contractStartDate}</td>
                      <td>{a.contractEndDate}</td>
                      <td><strong style={{color:a.daysLeft<=30?"#dc2626":a.daysLeft<=90?"#d97706":"#059669"}}>{a.daysLeft}d</strong></td>
                      <td>{a.priority}</td>
                      <td><strong>{fmt(a.totalInvoiceAmount)}</strong></td>
                      <td><span className={`crm-status crm-status-${a.daysLeft<0?"red":a.daysLeft<=30?"orange":"green"}`}>{a.daysLeft<0?"Expired":a.daysLeft<=30?"Due Soon":"Active"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── FORMS ── */}
      {showForm && formType==="invoice" && (
        <InvoiceForm onSave={inv=>{
          const list=[inv,...invoices]; saveData("nt_invoices",list,setInvoices);
          // Auto create GST entry if GST invoice
          if(inv.invoiceType==="GST"&&Number(inv.gstAmount)>0){
            const g={invoiceNo:inv.invoiceNo,customerId:inv.customerId,customerName:inv.customerName,invoiceDate:inv.invoiceDate,invoiceType:inv.invoiceType,department:inv.department,taxableValue:inv.taxableAmount,gstRate:inv.gstPct,cgst:inv.gstAmount/2,sgst:inv.gstAmount/2,igst:0,totalGst:inv.gstAmount,outstandingGst:inv.gstAmount,filingStatus:"Pending"};
            saveData("nt_gst",[g,...gstReg],setGstReg);
          }
          setShowForm(false);
        }} onClose={()=>setShowForm(false)} user={user} />
      )}
      {showForm && formType==="receipt" && (
        <ReceiptForm invoices={invoices} onSave={rec=>{
          const list=[rec,...receipts]; saveData("nt_receipts",list,setReceipts);
          // Update invoice payment status
          const updated=invoices.map(inv=>inv.invoiceNo===rec.invoiceNo?{...inv,amountReceived:(Number(inv.amountReceived||0)+Number(rec.receivedAmount)).toString(),balanceOutstanding:Math.max(0,Number(inv.balanceOutstanding||0)-Number(rec.receivedAmount)).toString(),paymentStatus:Number(inv.balanceOutstanding||0)-Number(rec.receivedAmount)<=0?"Paid":"Partial"}:inv);
          saveData("nt_invoices",updated,setInvoices);
          setShowForm(false);
        }} onClose={()=>setShowForm(false)} user={user} />
      )}
      {showForm && formType==="expense" && (
        <ExpenseForm onSave={exp=>{saveData("nt_expenses",[exp,...expenses],setExpenses);setShowForm(false);}} onClose={()=>setShowForm(false)} user={user} />
      )}
      {showForm && formType==="petty" && (
        <PettyForm onSave={p=>{saveData("nt_petty",[p,...petty],setPetty);setShowForm(false);}} onClose={()=>setShowForm(false)} user={user} />
      )}
      {showForm && formType==="purchase" && (
        <PurchaseForm onSave={p=>{saveData("nt_purchases",[p,...purchases],setPurchases);setShowForm(false);}} onClose={()=>setShowForm(false)} user={user} />
      )}
      {showForm && formType==="transfer" && (
        <TransferForm onSave={t=>{saveData("nt_transfers",[t,...transfers],setTransfers);setShowForm(false);}} onClose={()=>setShowForm(false)} user={user} />
      )}
    </div>
  );
}

// ── INVOICE FORM ────────────────────────────────────
function InvoiceForm({ onSave, onClose, user }) {
  const [f, setF] = useState({
    invoiceDate:today(), invoiceNo:genNo("NTP"), contractNo:"", customerId:"", customerName:"", mobile:"", address:"", city:"Mumbai", state:"Maharashtra", pincode:"", department:"Pest Control", serviceCategory:"", servicePlan:"", portfolioType:"B2C", residentialCommercial:"Residential", areaSqft:"", leadSource:"", salesperson:"", technician:"", contractStartDate:"", contractEndDate:"", noOfServices:"", rate:"", discount:"0", taxableAmount:"", gstPct:"18", gstAmount:"", totalInvoiceAmount:"", amountReceived:"0", balanceOutstanding:"", paymentStatus:"Pending", invoiceType:"Non GST", migrationFlag:"No", remarks:""
  });

  // Auto-calculate amounts
  useEffect(() => {
    const taxable = (Number(f.rate||0) - Number(f.discount||0));
    const gstAmt  = taxable * (Number(f.gstPct||0)/100);
    const total   = taxable + gstAmt;
    const balance = total - Number(f.amountReceived||0);
    setF(p=>({...p, taxableAmount:taxable.toFixed(2), gstAmount:gstAmt.toFixed(2), totalInvoiceAmount:total.toFixed(2), balanceOutstanding:balance.toFixed(2)}));
  }, [f.rate, f.discount, f.gstPct, f.amountReceived]);

  const s = (k,v) => setF(p=>({...p,[k]:v}));

  return (
    <Modal title="🧾 New Invoice" onClose={onClose} onSave={()=>onSave({...f,addedBy:user.name})} size="xl">
      <Section title="📋 Invoice Details">
        <Grid>
          <F label="Invoice Date *" type="date" val={f.invoiceDate} set={v=>s("invoiceDate",v)} />
          <F label="Invoice No *"   val={f.invoiceNo}   set={v=>s("invoiceNo",v)} />
          <F label="Contract No"    val={f.contractNo}  set={v=>s("contractNo",v)} />
          <F label="Invoice Type"   type="select" options={INVOICE_TYPES} val={f.invoiceType} set={v=>s("invoiceType",v)} />
        </Grid>
      </Section>
      <Section title="👤 Customer">
        <Grid>
          <F label="Customer Name *" val={f.customerName} set={v=>s("customerName",v)} placeholder="Full name" />
          <F label="Customer ID"     val={f.customerId}   set={v=>s("customerId",v)}   placeholder="CUST-ID-..." />
          <F label="Mobile"          val={f.mobile}       set={v=>s("mobile",v)}       type="tel" />
          <F label="City"            val={f.city}         set={v=>s("city",v)} />
          <F label="State"           val={f.state}        set={v=>s("state",v)} />
          <F label="Pincode"         val={f.pincode}      set={v=>s("pincode",v)} />
        </Grid>
      </Section>
      <Section title="🔧 Service Details">
        <Grid>
          <F label="Department"      type="select" options={DEPARTMENTS}  val={f.department}    set={v=>s("department",v)} />
          <F label="Service Category"type="select" options={SERVICE_CATS} val={f.serviceCategory} set={v=>s("serviceCategory",v)} />
          <F label="Service Plan"    type="select" options={SERVICE_PLANS}val={f.servicePlan}   set={v=>s("servicePlan",v)} />
          <F label="Portfolio Type"  type="select" options={PORTFOLIOS}   val={f.portfolioType} set={v=>s("portfolioType",v)} />
          <F label="Res / Commercial"type="select" options={["Residential","Commercial"]} val={f.residentialCommercial} set={v=>s("residentialCommercial",v)} />
          <F label="Area (sqft)"     val={f.areaSqft}     set={v=>s("areaSqft",v)} />
          <F label="Lead Source"     type="select" options={LEAD_SOURCES}  val={f.leadSource}   set={v=>s("leadSource",v)} />
          <F label="Salesperson"     type="select" options={SALESPERSONS}  val={f.salesperson}  set={v=>s("salesperson",v)} />
          <F label="Technician"      type="select" options={TECHNICIANS}   val={f.technician}   set={v=>s("technician",v)} />
          <F label="No of Services"  val={f.noOfServices} set={v=>s("noOfServices",v)} type="number" />
          <F label="Contract Start"  val={f.contractStartDate} set={v=>s("contractStartDate",v)} type="date" />
          <F label="Contract End"    val={f.contractEndDate}   set={v=>s("contractEndDate",v)}   type="date" />
        </Grid>
      </Section>
      <Section title="💰 Pricing">
        <Grid>
          <F label="Rate (₹) *"      val={f.rate}         set={v=>s("rate",v)}     type="number" />
          <F label="Discount (₹)"    val={f.discount}     set={v=>s("discount",v)} type="number" />
          <F label="GST %"           type="select" options={GST_RATES.map(String)} val={f.gstPct} set={v=>s("gstPct",v)} />
          <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"12px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["Taxable Amt",f.taxableAmount],["GST Amt",f.gstAmount],["Total Invoice",f.totalInvoiceAmount],["Balance",f.balanceOutstanding]].map(([l,v])=>(
              <div key={l}><div style={{fontSize:"0.7rem",color:"#64748b"}}>{l}</div><div style={{fontWeight:800,color:"#059669"}}>₹{Number(v||0).toLocaleString("en-IN")}</div></div>
            ))}
          </div>
          <F label="Amount Received" val={f.amountReceived} set={v=>s("amountReceived",v)} type="number" />
          <F label="Payment Status"  type="select" options={PAYMENT_STATUS} val={f.paymentStatus} set={v=>s("paymentStatus",v)} />
        </Grid>
      </Section>
      <Section title="📝 Remarks"><textarea className="crm-input" rows={2} value={f.remarks} onChange={e=>s("remarks",e.target.value)} /></Section>
    </Modal>
  );
}

// ── RECEIPT FORM ────────────────────────────────────
function ReceiptForm({ invoices, onSave, onClose, user }) {
  const [f, setF] = useState({ receiptDate:today(), invoiceDate:"", invoiceNo:"", customerId:"", customerName:"", department:"Pest Control", invoiceType:"", invoiceAmount:"", receivedAmount:"", tdsAmount:"0", totalSettled:"", paymentMode:"Cash", receiptType:"", referenceNo:"", receivedBy:user.name, remarks:"", portfolioType:"B2C", cashAccount:"HDFC - NewTech Pest" });
  const s = (k,v) => setF(p=>({...p,[k]:v}));

  const fillFromInvoice = (invNo) => {
    const inv = invoices.find(i=>i.invoiceNo===invNo);
    if(inv) setF(p=>({...p,invoiceNo:invNo,invoiceDate:inv.invoiceDate,customerId:inv.customerId,customerName:inv.customerName,department:inv.department,invoiceType:inv.invoiceType,invoiceAmount:inv.totalInvoiceAmount,portfolioType:inv.portfolioType}));
  };

  useEffect(() => {
    const settled = Number(f.receivedAmount||0) + Number(f.tdsAmount||0);
    setF(p=>({...p,totalSettled:settled.toString()}));
  }, [f.receivedAmount, f.tdsAmount]);

  return (
    <Modal title="✅ Record Receipt" onClose={onClose} onSave={()=>onSave({...f,addedBy:user.name})} size="lg">
      <Section title="🔗 Link to Invoice">
        <Grid>
          <div className="crm-form-group">
            <label>Invoice No *</label>
            <select className="crm-input" value={f.invoiceNo} onChange={e=>{s("invoiceNo",e.target.value);fillFromInvoice(e.target.value);}}>
              <option value="">Select Invoice</option>
              {invoices.filter(i=>i.paymentStatus!=="Paid").map(i=><option key={i.invoiceNo} value={i.invoiceNo}>{i.invoiceNo} — {i.customerName} — ₹{i.balanceOutstanding}</option>)}
            </select>
          </div>
          <F label="Receipt Date *" type="date" val={f.receiptDate} set={v=>s("receiptDate",v)} />
          <F label="Customer" val={f.customerName} set={v=>s("customerName",v)} />
          <F label="Department" type="select" options={DEPARTMENTS} val={f.department} set={v=>s("department",v)} />
        </Grid>
      </Section>
      <Section title="💰 Payment Details">
        <Grid>
          <F label="Invoice Amount"   val={f.invoiceAmount}   set={v=>s("invoiceAmount",v)}   type="number" />
          <F label="Received Amount *"val={f.receivedAmount}  set={v=>s("receivedAmount",v)}  type="number" />
          <F label="TDS Amount"       val={f.tdsAmount}       set={v=>s("tdsAmount",v)}       type="number" />
          <F label="Total Settled"    val={f.totalSettled}    set={()=>{}}                    type="number" />
          <F label="Payment Mode"     type="select" options={PAYMENT_MODES}   val={f.paymentMode}   set={v=>s("paymentMode",v)} />
          <F label="Cash Account"     type="select" options={CASH_ACCOUNTS}   val={f.cashAccount}   set={v=>s("cashAccount",v)} />
          <F label="Receipt Type"     type="select" options={["","GST","Non GST","Advance"]} val={f.receiptType} set={v=>s("receiptType",v)} />
          <F label="Reference No"     val={f.referenceNo}     set={v=>s("referenceNo",v)} />
          <F label="Portfolio"        type="select" options={PORTFOLIOS}      val={f.portfolioType} set={v=>s("portfolioType",v)} />
          <F label="Received By"      val={f.receivedBy}      set={v=>s("receivedBy",v)} />
        </Grid>
      </Section>
    </Modal>
  );
}

// ── EXPENSE FORM ────────────────────────────────────
function ExpenseForm({ onSave, onClose, user }) {
  const [f, setF] = useState({ expenseDate:today(), voucherNo:"", department:"Pest Control", expenseHead:"", expenseSubHead:"", expenseType:"Direct", portfolioType:"", customerId:"", customerName:"", invoiceNo:"", serviceCategory:"", expenseDescription:"", expenseAmount:"", gstAmount:"0", totalExpenseAmount:"", paymentMode:"HDFC Online", paidTo:"", approvedBy:user.name, cashAccount:"HDFC - NewTech Pest", remarks:"" });
  const s = (k,v) => setF(p=>({...p,[k]:v}));

  useEffect(() => {
    setF(p=>({...p,totalExpenseAmount:(Number(p.expenseAmount||0)+Number(p.gstAmount||0)).toString()}));
  }, [f.expenseAmount, f.gstAmount]);

  const subHeads = EXPENSE_HEADS[f.expenseHead] || [];

  return (
    <Modal title="💸 Record Expense" onClose={onClose} onSave={()=>onSave({...f,addedBy:user.name})} size="lg">
      <Section title="📋 Classification">
        <Grid>
          <F label="Expense Date *" type="date" val={f.expenseDate} set={v=>s("expenseDate",v)} />
          <F label="Department"     type="select" options={DEPARTMENTS}  val={f.department}   set={v=>s("department",v)} />
          <F label="Expense Head *" type="select" options={Object.keys(EXPENSE_HEADS)} val={f.expenseHead} set={v=>{s("expenseHead",v);s("expenseSubHead","");}} />
          <F label="Sub Head"       type="select" options={subHeads}     val={f.expenseSubHead} set={v=>s("expenseSubHead",v)} />
          <F label="Expense Type"   type="select" options={EXPENSE_TYPES} val={f.expenseType} set={v=>s("expenseType",v)} />
          <F label="Portfolio"      type="select" options={["","..."].concat(PORTFOLIOS)} val={f.portfolioType} set={v=>s("portfolioType",v)} />
          <F label="Customer Name"  val={f.customerName} set={v=>s("customerName",v)} />
          <F label="Invoice No"     val={f.invoiceNo}    set={v=>s("invoiceNo",v)} />
          <F label="Service Category" type="select" options={["","..."].concat(SERVICE_CATS)} val={f.serviceCategory} set={v=>s("serviceCategory",v)} />
          <F label="Description"    val={f.expenseDescription} set={v=>s("expenseDescription",v)} />
        </Grid>
      </Section>
      <Section title="💰 Amount">
        <Grid>
          <F label="Expense Amount *" val={f.expenseAmount} set={v=>s("expenseAmount",v)} type="number" />
          <F label="GST Amount"       val={f.gstAmount}     set={v=>s("gstAmount",v)}     type="number" />
          <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:9,padding:"10px 14px"}}>
            <div style={{fontSize:"0.7rem",color:"#64748b"}}>Total Expense</div>
            <div style={{fontWeight:800,color:"#dc2626",fontSize:"1.2rem"}}>₹{Number(f.totalExpenseAmount||0).toLocaleString("en-IN")}</div>
          </div>
          <F label="Payment Mode"  type="select" options={PAYMENT_MODES}  val={f.paymentMode}  set={v=>s("paymentMode",v)} />
          <F label="Cash Account"  type="select" options={CASH_ACCOUNTS}  val={f.cashAccount}  set={v=>s("cashAccount",v)} />
          <F label="Paid To"       val={f.paidTo}       set={v=>s("paidTo",v)} />
          <F label="Approved By"   val={f.approvedBy}   set={v=>s("approvedBy",v)} />
        </Grid>
      </Section>
    </Modal>
  );
}

// ── PETTY CASH FORM ──────────────────────────────────
function PettyForm({ onSave, onClose, user }) {
  const [f, setF] = useState({ txnDate:today(), voucherNo:"", department:"Pest Control", expenseType:"Direct", portfolioType:"B2C", customerId:"", customerName:"", expenseHead:"", expenseSubHead:"", amount:"", paymentMode:"Cash", paidTo:"", approvedBy:user.name, cashAccount:"Petty Cash", remarks:"" });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  const subHeads = EXPENSE_HEADS[f.expenseHead] || [];

  return (
    <Modal title="💵 Petty Cash Entry" onClose={onClose} onSave={()=>onSave({...f,addedBy:user.name})} size="lg">
      <Section title="📋 Details">
        <Grid>
          <F label="Date *"       type="date" val={f.txnDate}    set={v=>s("txnDate",v)} />
          <F label="Voucher No"   val={f.voucherNo}              set={v=>s("voucherNo",v)} />
          <F label="Department"   type="select" options={DEPARTMENTS}    val={f.department}   set={v=>s("department",v)} />
          <F label="Expense Type" type="select" options={EXPENSE_TYPES}  val={f.expenseType}  set={v=>s("expenseType",v)} />
          <F label="Portfolio"    type="select" options={PORTFOLIOS}     val={f.portfolioType}set={v=>s("portfolioType",v)} />
          <F label="Expense Head" type="select" options={Object.keys(EXPENSE_HEADS)} val={f.expenseHead} set={v=>{s("expenseHead",v);s("expenseSubHead","");}} />
          <F label="Sub Head"     type="select" options={subHeads}       val={f.expenseSubHead} set={v=>s("expenseSubHead",v)} />
          <F label="Amount *"     val={f.amount}  set={v=>s("amount",v)} type="number" />
          <F label="Paid To"      val={f.paidTo}  set={v=>s("paidTo",v)} />
          <F label="Approved By"  val={f.approvedBy} set={v=>s("approvedBy",v)} />
          <F label="Cash Account" type="select" options={CASH_ACCOUNTS} val={f.cashAccount} set={v=>s("cashAccount",v)} />
        </Grid>
      </Section>
    </Modal>
  );
}

// ── PURCHASE FORM ────────────────────────────────────
function PurchaseForm({ onSave, onClose, user }) {
  const [f, setF] = useState({ purchaseDate:today(), purchaseNo:"PR"+Date.now().toString().slice(-4), vendorId:"", vendorName:"", vendorGstNo:"", department:"Pest Control", purchaseHead:"Chemical Purchase", purchaseSubHead:"", purchaseType:"", billNo:"", billDate:"", expenseLinkType:"Indirect", customerId:"", invoiceNo:"", taxableAmount:"", gstPct:"18", gstAmount:"", totalPurchaseAmount:"", totalPaid:"0", balancePayable:"", dueDate:"", paymentStatus:"Unpaid", remarks:"", portfolioType:"" });
  const s = (k,v) => setF(p=>({...p,[k]:v}));

  useEffect(() => {
    const gst   = Number(f.taxableAmount||0) * (Number(f.gstPct||0)/100);
    const total = Number(f.taxableAmount||0) + gst;
    const bal   = total - Number(f.totalPaid||0);
    setF(p=>({...p,gstAmount:gst.toFixed(2),totalPurchaseAmount:total.toFixed(2),balancePayable:bal.toFixed(2)}));
  }, [f.taxableAmount,f.gstPct,f.totalPaid]);

  return (
    <Modal title="🛒 Purchase Entry" onClose={onClose} onSave={()=>onSave({...f,addedBy:user.name})} size="lg">
      <Section title="📋 Vendor Details">
        <Grid>
          <F label="Purchase Date *" type="date" val={f.purchaseDate} set={v=>s("purchaseDate",v)} />
          <F label="Purchase No"     val={f.purchaseNo}  set={v=>s("purchaseNo",v)} />
          <F label="Vendor Name *"   val={f.vendorName}  set={v=>s("vendorName",v)} />
          <F label="Vendor ID"       val={f.vendorId}    set={v=>s("vendorId",v)} />
          <F label="Vendor GST No"   val={f.vendorGstNo} set={v=>s("vendorGstNo",v)} />
          <F label="Bill No"         val={f.billNo}      set={v=>s("billNo",v)} />
          <F label="Bill Date"       type="date" val={f.billDate} set={v=>s("billDate",v)} />
          <F label="Department"      type="select" options={DEPARTMENTS} val={f.department} set={v=>s("department",v)} />
          <F label="Purchase Head"   type="select" options={Object.keys(EXPENSE_HEADS)} val={f.purchaseHead} set={v=>s("purchaseHead",v)} />
          <F label="Expense Type"    type="select" options={["Direct","Indirect"]} val={f.expenseLinkType} set={v=>s("expenseLinkType",v)} />
        </Grid>
      </Section>
      <Section title="💰 Amount">
        <Grid>
          <F label="Taxable Amount *" val={f.taxableAmount} set={v=>s("taxableAmount",v)} type="number" />
          <F label="GST %"            type="select" options={GST_RATES.map(String)} val={f.gstPct} set={v=>s("gstPct",v)} />
          <F label="GST Amount"       val={f.gstAmount}     set={()=>{}}    type="number" />
          <F label="Total Amount"     val={f.totalPurchaseAmount} set={()=>{}} type="number" />
          <F label="Total Paid"       val={f.totalPaid}     set={v=>s("totalPaid",v)} type="number" />
          <F label="Balance Payable"  val={f.balancePayable}set={()=>{}}    type="number" />
          <F label="Due Date"         type="date" val={f.dueDate}   set={v=>s("dueDate",v)} />
          <F label="Payment Status"   type="select" options={["Unpaid","Partial","Paid"]} val={f.paymentStatus} set={v=>s("paymentStatus",v)} />
        </Grid>
      </Section>
    </Modal>
  );
}

// ── CASH TRANSFER FORM ───────────────────────────────
function TransferForm({ onSave, onClose, user }) {
  const [f, setF] = useState({ txnDate:today(), department:"", fromAccount:"HDFC - NewTech Pest", toAccount:"Suraj Sir HDFC", transferAmount:"", transferMode:"", purpose:"", remarks:"" });
  const s = (k,v) => setF(p=>({...p,[k]:v}));

  return (
    <Modal title="🔄 Cash Transfer" onClose={onClose} onSave={()=>onSave({...f,addedBy:user.name})} size="lg">
      <Section title="Transfer Details">
        <Grid>
          <F label="Date *"           type="date"   val={f.txnDate}        set={v=>s("txnDate",v)} />
          <F label="Department"       type="select" options={["","..."].concat(DEPARTMENTS)} val={f.department} set={v=>s("department",v)} />
          <F label="From Account *"   type="select" options={CASH_ACCOUNTS} val={f.fromAccount}     set={v=>s("fromAccount",v)} />
          <F label="To Account *"     type="select" options={CASH_ACCOUNTS} val={f.toAccount}       set={v=>s("toAccount",v)} />
          <F label="Amount *"         type="number" val={f.transferAmount}  set={v=>s("transferAmount",v)} />
          <F label="Transfer Mode"    val={f.transferMode} set={v=>s("transferMode",v)} />
          <F label="Purpose"          val={f.purpose}      set={v=>s("purpose",v)} />
          <F label="Remarks"          val={f.remarks}      set={v=>s("remarks",v)} />
        </Grid>
      </Section>
    </Modal>
  );
}

// ── Shared UI Components ─────────────────────────────
function Register({ title, data, onAdd, cols, renderRow }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter(r => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <input className="crm-search" style={{width:240}} placeholder="🔍 Search..." value={search} onChange={e=>setSearch(e.target.value)} />
          <span className="crm-count-badge">{filtered.length} records</span>
        </div>
        <button className="crm-btn-primary" style={{fontSize:"0.82rem"}} onClick={onAdd}>➕ Add New</button>
      </div>
      {filtered.length===0 ? (
        <div className="crm-empty-state"><span>📋</span><p>No records yet</p><button className="crm-btn-primary" onClick={onAdd}>➕ Add First Record</button></div>
      ) : (
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead><tr>{cols.map((c,i)=><th key={i}>{c}</th>)}</tr></thead>
            <tbody>{filtered.map((row,i)=><tr key={i}>{renderRow(row).map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MiniTable({ title, cols, rows }) {
  return (
    <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",boxShadow:"0 1px 3px rgba(0,0,0,0.07)",overflow:"hidden",marginBottom:16}}>
      <div style={{padding:"10px 14px",background:"#f8fafc",borderBottom:"1px solid #e2e8f0",fontSize:"0.86rem",fontWeight:700}}>{title}</div>
      {rows.length===0 ? <div style={{padding:20,textAlign:"center",color:"#94a3b8",fontSize:"0.82rem"}}>No data yet</div> : (
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.8rem"}}>
          <thead><tr style={{background:"#f1f5f9"}}>{cols.map((c,i)=><th key={i} style={{padding:"7px 10px",textAlign:"left",fontSize:"0.68rem",fontWeight:700,color:"#64748b",textTransform:"uppercase"}}>{c}</th>)}</tr></thead>
          <tbody>{rows.map((row,i)=><tr key={i} style={{borderBottom:"1px solid #f8fafc"}}>{row.map((cell,j)=><td key={j} style={{padding:"7px 10px",color:"#0f172a"}}>{cell}</td>)}</tr>)}</tbody>
        </table>
      )}
    </div>
  );
}

function Modal({ title, onClose, onSave, children, size="lg" }) {
  return (
    <div className="crm-modal-overlay" onClick={onClose}>
      <div className={`crm-modal crm-modal-${size}`} onClick={e=>e.stopPropagation()}>
        <div className="crm-modal-header"><h3>{title}</h3><button className="crm-modal-close" onClick={onClose}>✕</button></div>
        <div className="crm-modal-body">{children}</div>
        <div className="crm-modal-footer">
          <button className="crm-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="crm-btn-primary" onClick={onSave}>💾 Save</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="crm-form-section">
      <div className="crm-form-section-title">{title}</div>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="crm-form-grid">{children}</div>;
}

function F({ label, type="text", val, set, options=[], placeholder="" }) {
  return (
    <div className="crm-form-group">
      <label>{label}</label>
      {type==="select" ? (
        <select className="crm-input" value={val} onChange={e=>set(e.target.value)}>
          <option value="">Select {label}</option>
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input className="crm-input" type={type} value={val} onChange={e=>set(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}
