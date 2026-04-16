import { useState, useEffect } from "react";
import { SERVICE_CATALOG, SERVICE_CATEGORIES } from "./serviceCatalog";

export default function ServicePicker({ value = {}, onChange, showPrice = true }) {
  const [category,    setCategory]   = useState(value.category   || "");
  const [serviceId,   setServiceId]  = useState(value.serviceId  || "");
  const [planId,      setPlanId]     = useState(value.planId     || "");
  const [premise,     setPremise]    = useState(value.premise    || "");
  const [qty,         setQty]        = useState(value.qty        || 1);
  const [discount,    setDiscount]   = useState(value.discount   || 0);
  const [customPrice, setCustomPrice]= useState(value.customPrice|| "");
  const [chemical,    setChemical]   = useState(value.chemical   || "Odourless");
  const [notes,       setNotes]      = useState(value.notes      || "");

  const service    = SERVICE_CATALOG.find(s => s.id === serviceId);
  const plan       = service?.plans.find(p => p.planId === planId);
  const priceObj   = service?.pricing?.[premise] || service?.pricing?.["Any"];
  const basePrice  = priceObj?.base || 0;
  const calcPrice  = customPrice !== "" ? Number(customPrice) : basePrice * qty;
  const finalPrice = Math.max(0, calcPrice - Number(discount));
  const filtered   = category ? SERVICE_CATALOG.filter(s => s.category === category) : SERVICE_CATALOG;

  useEffect(() => {
    onChange?.({
      category, serviceId, serviceName: service?.name || "",
      planId, planName: plan?.name || "", premise, qty, chemical,
      discount: Number(discount),
      customPrice: customPrice !== "" ? Number(customPrice) : null,
      finalPrice, gstApplicable: priceObj?.gst || false,
      totalServices: plan?.services || 1,
      gapDays: plan?.gapDays || 0,
      guarantee: plan?.guarantee || "", notes,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, serviceId, planId, premise, qty, discount, customPrice, chemical, notes]);

  const inp = { width:"100%", padding:"9px 12px", border:"1.5px solid #e2e8f0", borderRadius:9, fontSize:"0.88rem", fontFamily:"inherit", color:"#0f172a", outline:"none", boxSizing:"border-box", background:"#fff" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* ── Category Pills ── */}
      <div>
        <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Service Category</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[["","📋 All"], ...SERVICE_CATEGORIES.map(c => [c, c === "Pest Control" ? "🪲 Pest Control" : "🧹 Cleaning"])].map(([val, lbl]) => (
            <button key={val} type="button"
              onClick={() => { setCategory(val); setServiceId(""); setPlanId(""); setPremise(""); }}
              style={{ padding:"7px 16px", borderRadius:20, border:`1.5px solid ${category===val?"#2563eb":"#e2e8f0"}`, background:category===val?"#2563eb":"#f8fafc", color:category===val?"#fff":"#64748b", fontSize:"0.82rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* ── Service Cards ── */}
      <div>
        <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Select Service *</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px,1fr))", gap:10 }}>
          {filtered.map(svc => (
            <div key={svc.id}
              onClick={() => { setServiceId(svc.id); setPlanId(""); setPremise(""); }}
              style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"12px 14px", border:`2px solid ${serviceId===svc.id?"#2563eb":"#e2e8f0"}`, borderRadius:10, cursor:"pointer", background:serviceId===svc.id?"#eff6ff":"#fff", position:"relative", transition:"all 0.15s" }}>
              <span style={{ fontSize:"1.5rem", flexShrink:0 }}>{svc.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"0.88rem", fontWeight:700, color:"#0f172a", marginBottom:3 }}>{svc.name}</div>
                <div style={{ fontSize:"0.74rem", color:"#64748b", lineHeight:1.4 }}>{svc.description}</div>
                {svc.pests.length > 0 && (
                  <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:5 }}>
                    {svc.pests.map(p => <span key={p} style={{ background:"#fee2e2", color:"#dc2626", fontSize:"0.68rem", fontWeight:600, padding:"2px 6px", borderRadius:4 }}>{p}</span>)}
                  </div>
                )}
              </div>
              {serviceId===svc.id && (
                <span style={{ position:"absolute", top:8, right:8, background:"#2563eb", color:"#fff", width:20, height:20, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:700 }}>✓</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Plans + Premise + Price (after service selected) ── */}
      {service && (
        <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:12, padding:16, display:"flex", flexDirection:"column", gap:14 }}>

          {/* Plans */}
          <div>
            <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#64748b", textTransform:"uppercase", marginBottom:8 }}>📋 Select Plan</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(155px,1fr))", gap:8 }}>
              {service.plans.map(p => (
                <div key={p.planId} onClick={() => setPlanId(p.planId)}
                  style={{ padding:"10px 12px", border:`1.5px solid ${planId===p.planId?"#2563eb":"#e2e8f0"}`, borderRadius:9, cursor:"pointer", background:planId===p.planId?"#eff6ff":"#fff", boxShadow:planId===p.planId?"0 0 0 2px rgba(37,99,235,0.12)":"none" }}>
                  <div style={{ fontSize:"0.86rem", fontWeight:700, color:"#0f172a" }}>{p.name}</div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginTop:5 }}>
                    {[`📅 ${p.duration}`, `🔧 ${p.services} svc`, p.gapDays > 0 && `⏱ ${p.gapDays}d gap`].filter(Boolean).map((t,i) => (
                      <span key={i} style={{ fontSize:"0.7rem", color:"#64748b", background:"#f1f5f9", padding:"2px 6px", borderRadius:4 }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ fontSize:"0.7rem", color:"#059669", fontWeight:600, marginTop:4 }}>✅ {p.guarantee}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Premise */}
          <div>
            <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#64748b", textTransform:"uppercase", marginBottom:8 }}>🏠 Premise Type</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {service.premises.map(pr => (
                <button key={pr} type="button" onClick={() => { setPremise(pr); setCustomPrice(""); }}
                  style={{ padding:"8px 12px", border:`1.5px solid ${premise===pr?"#2563eb":"#e2e8f0"}`, borderRadius:8, background:premise===pr?"#2563eb":"#fff", color:premise===pr?"#fff":"#475569", fontSize:"0.8rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                  {pr}
                  {service.pricing?.[pr] && <span style={{ fontSize:"0.68rem", opacity:0.85, fontWeight:700 }}>₹{service.pricing[pr].base}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Chemical preference */}
          {service.chemical?.some(c => c.includes("Odour")) && (
            <div>
              <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#64748b", textTransform:"uppercase", marginBottom:8 }}>🧪 Chemical</div>
              <div style={{ display:"flex", gap:8 }}>
                {["Odourless","Odour"].map(c => (
                  <button key={c} type="button" onClick={() => setChemical(c)}
                    style={{ padding:"7px 16px", border:`1.5px solid ${chemical===c?"#2563eb":"#e2e8f0"}`, borderRadius:8, background:chemical===c?"#eff6ff":"#fff", color:chemical===c?"#2563eb":"#64748b", fontSize:"0.82rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                    {c === "Odourless" ? "✅" : "⚠️"} {c}
                  </button>
                ))}
              </div>
              {chemical === "Odour" && (
                <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:7, padding:"8px 12px", fontSize:"0.8rem", color:"#92400e", marginTop:6 }}>
                  ⚠️ House must be closed for 2 hours after treatment
                </div>
              )}
            </div>
          )}

          {/* Gel note */}
          {service.gelNote && (
            <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:7, padding:"10px 12px", fontSize:"0.8rem", color:"#15803d" }}>
              🧴 <strong>Gel Note:</strong> {service.gelNote}
            </div>
          )}

          {/* Pricing */}
          {showPrice && (
            <div>
              <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#64748b", textTransform:"uppercase", marginBottom:8 }}>💰 Pricing</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:10, alignItems:"end" }}>
                {[
                  { label:"Qty / Units", val:qty,         set:v=>setQty(Number(v)),        type:"number", min:1 },
                  { label:"Base Price (₹)", val:customPrice!==""?customPrice:basePrice, set:setCustomPrice, type:"number", ph: basePrice?`₹${basePrice}`:"Enter price" },
                  { label:"Discount (₹)", val:discount,   set:setDiscount,               type:"number" },
                ].map(f => (
                  <div key={f.label} style={{ display:"flex", flexDirection:"column", gap:5 }}>
                    <label style={{ fontSize:"0.76rem", fontWeight:600, color:"#64748b" }}>{f.label}</label>
                    <input style={inp} type={f.type} min={f.min||0} value={f.val} placeholder={f.ph||""} onChange={e => f.set(e.target.value)} />
                  </div>
                ))}
                <div style={{ background:"#fff", border:"2px solid #2563eb", borderRadius:10, padding:"10px 14px", textAlign:"center" }}>
                  <div style={{ fontSize:"0.66rem", fontWeight:700, color:"#64748b", textTransform:"uppercase" }}>Final Price</div>
                  <div style={{ fontSize:"1.4rem", fontWeight:800, color:"#2563eb", lineHeight:1.1 }}>₹{finalPrice.toLocaleString("en-IN")}</div>
                  {priceObj?.gst && <div style={{ fontSize:"0.66rem", color:"#64748b", marginTop:2 }}>+ GST</div>}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <label style={{ fontSize:"0.76rem", fontWeight:600, color:"#64748b" }}>Special Instructions</label>
            <textarea style={{ ...inp, resize:"vertical", minHeight:60 }}
              placeholder="Customer requirements, access notes, special instructions..."
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          {/* Summary bar */}
          {serviceId && planId && premise && (
            <div style={{ display:"flex", alignItems:"center", gap:12, background:"#2563eb", borderRadius:10, padding:"14px 16px", color:"#fff" }}>
              <span style={{ fontSize:"1.6rem" }}>{service.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"0.9rem", fontWeight:700 }}>{service.name} · {plan?.name} · {premise}</div>
                <div style={{ fontSize:"0.74rem", opacity:0.85, marginTop:2 }}>
                  {plan?.services} service{plan?.services>1?"s":""}{plan?.gapDays>0?` · ${plan.gapDays}d gap`:""} · Guarantee: {plan?.guarantee} · {chemical}
                </div>
              </div>
              <div style={{ fontSize:"1.5rem", fontWeight:800, whiteSpace:"nowrap" }}>₹{finalPrice.toLocaleString("en-IN")}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Compact inline version ──────────────────────────
export function ServicePickerCompact({ value = {}, onChange }) {
  const [serviceId, setServiceId] = useState(value.serviceId || "");
  const [planId,    setPlanId]    = useState(value.planId    || "");
  const [premise,   setPremise]   = useState(value.premise   || "");
  const [price,     setPrice]     = useState(value.finalPrice|| "");

  const service = SERVICE_CATALOG.find(s => s.id === serviceId);
  const plan    = service?.plans.find(p => p.planId === planId);
  const inp = { width:"100%", padding:"7px 10px", border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:"0.82rem", fontFamily:"inherit", color:"#0f172a", outline:"none", background:"#fff", boxSizing:"border-box", marginBottom:6 };

  useEffect(() => {
    onChange?.({ serviceId, serviceName:service?.name||"", planId, planName:plan?.name||"", premise, finalPrice:Number(price), totalServices:plan?.services||1, gapDays:plan?.gapDays||0, guarantee:plan?.guarantee||"" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, planId, premise, price]);

  return (
    <div>
      <select style={inp} value={serviceId} onChange={e => { setServiceId(e.target.value); setPlanId(""); setPremise(""); }}>
        <option value="">Select Service</option>
        {SERVICE_CATALOG.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
      </select>
      {service && (
        <select style={inp} value={planId} onChange={e => setPlanId(e.target.value)}>
          <option value="">Select Plan</option>
          {service.plans.map(p => <option key={p.planId} value={p.planId}>{p.name} ({p.services} svc · {p.guarantee})</option>)}
        </select>
      )}
      {service && (
        <select style={inp} value={premise} onChange={e => { setPremise(e.target.value); setPrice(service.pricing?.[e.target.value]?.base||""); }}>
          <option value="">Select Premise</option>
          {service.premises.map(pr => <option key={pr} value={pr}>{pr}{service.pricing?.[pr]?` — ₹${service.pricing[pr].base}`:""}</option>)}
        </select>
      )}
      {service && <input style={inp} type="number" placeholder="Final Price (₹)" value={price} onChange={e => setPrice(e.target.value)} />}
    </div>
  );
}
