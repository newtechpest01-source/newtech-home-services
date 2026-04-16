// ═══════════════════════════════════════════════════
//  SERVICE & PRODUCT MASTER — New Tech Home Services
//  Single source of truth used across entire CRM
// ═══════════════════════════════════════════════════

export const SERVICE_CATALOG = [

  // ─── 1. GENERAL PEST CONTROL ─────────────────────
  {
    id:       "SVC-001",
    category: "Pest Control",
    name:     "General Pest Control",
    icon:     "🪲",
    description: "Crawling insects — cockroach, ants, spiders. Safe odourless spray + gel bait.",
    pests:    ["Cockroach","Ants","Spiders","Crawling Insects"],
    chemical: ["Odourless Spray","Gel Bait","Cockroach Trap"],
    premises: ["1RK","1BHK","2BHK","3BHK","4BHK","Bungalow","Office","Shop","Restaurant","Factory"],
    plans: [
      { planId:"GP-01", name:"Single Service",           duration:"30 Days",  services:1, gapDays:0,   guarantee:"30 Days" },
      { planId:"GP-02", name:"Single Service",           duration:"90 Days",  services:1, gapDays:0,   guarantee:"90 Days" },
      { planId:"GP-03", name:"AMC 3 Services",           duration:"1 Year",   services:3, gapDays:124, guarantee:"1 Year"  },
      { planId:"GP-04", name:"AMC 4 Services",           duration:"1 Year",   services:4, gapDays:90,  guarantee:"1 Year"  },
    ],
    gelNote:  "Gel applied same day if low infestation. 7 days after 1st treatment if heavy infestation.",
    pricing: {
      "1RK":     { base:600,  gst:false },
      "1BHK":    { base:800,  gst:false },
      "2BHK":    { base:1000, gst:false },
      "3BHK":    { base:1200, gst:false },
      "4BHK":    { base:1400, gst:false },
      "Bungalow":{ base:1800, gst:false },
      "Office":  { base:1200, gst:false },
    },
  },

  // ─── 2. BED BUG TREATMENT ────────────────────────
  {
    id:       "SVC-002",
    category: "Pest Control",
    name:     "Bed Bug Treatment",
    icon:     "🛏️",
    description: "Spray treatment to eliminate bed bugs. House to be vacated during treatment.",
    pests:    ["Bed Bugs"],
    chemical: ["Odourless Spray","Residual Spray"],
    premises: ["1RK","1BHK","2BHK","3BHK","4BHK","Bungalow","Hotel Room"],
    plans: [
      { planId:"BB-01", name:"45 Days Plan",    duration:"45 Days",  services:2, gapDays:10,  guarantee:"45 Days"  },
      { planId:"BB-02", name:"90 Days Plan",    duration:"90 Days",  services:3, gapDays:30,  guarantee:"90 Days"  },
      { planId:"BB-03", name:"180 Days Plan",   duration:"180 Days", services:4, gapDays:45,  guarantee:"180 Days" },
      { planId:"BB-04", name:"AMC 8 Services",  duration:"1 Year",   services:8, gapDays:45,  guarantee:"1 Year"   },
    ],
    pricing: {
      "1RK":     { base:1200, gst:false },
      "1BHK":    { base:1500, gst:false },
      "2BHK":    { base:2000, gst:false },
      "3BHK":    { base:2500, gst:false },
      "4BHK":    { base:3000, gst:false },
      "Bungalow":{ base:4000, gst:false },
    },
  },

  // ─── 3. TERMITE TREATMENT ────────────────────────
  {
    id:       "SVC-003",
    category: "Pest Control",
    name:     "Termite Treatment",
    icon:     "🪵",
    description: "Drilling injection treatment. Pits drilled at 1ft intervals at wall-floor junction, filled with anti-termite chemical.",
    pests:    ["Termites","White Ants"],
    chemical: ["Termiticide (Odourless)","Termiticide (Odour)","White Cement"],
    premises: ["1RK","1BHK","2BHK","3BHK","4BHK","Bungalow","Office","Shop","Factory"],
    plans: [
      { planId:"TR-01", name:"1 Year Plan",  duration:"1 Year",  services:3, gapDays:124, guarantee:"1 Year"  },
      { planId:"TR-02", name:"2 Year Plan",  duration:"2 Years", services:6, gapDays:124, guarantee:"2 Years" },
      { planId:"TR-03", name:"3 Year Plan",  duration:"3 Years", services:9, gapDays:124, guarantee:"3 Years" },
    ],
    pricing: {
      "1RK":     { base:2500, gst:false },
      "1BHK":    { base:3000, gst:false },
      "2BHK":    { base:4000, gst:false },
      "3BHK":    { base:5000, gst:false },
      "4BHK":    { base:6000, gst:false },
      "Bungalow":{ base:8000, gst:false },
    },
  },

  // ─── 4. MOSQUITO CONTROL ─────────────────────────
  {
    id:       "SVC-004",
    category: "Pest Control",
    name:     "Mosquito Control",
    icon:     "🦟",
    description: "Full spray for mosquito control. House closed for 2 hours after treatment. Effect lasts 3–4 months.",
    pests:    ["Mosquitoes"],
    chemical: ["Pyrethroid Spray"],
    premises: ["1RK","1BHK","2BHK","3BHK","4BHK","Bungalow","Office","Society"],
    plans: [
      { planId:"MQ-01", name:"Single Service",  duration:"One Time",  services:1, gapDays:0,  guarantee:"No Guarantee" },
      { planId:"MQ-02", name:"Quarterly AMC",   duration:"1 Year",    services:4, gapDays:90, guarantee:"1 Year"       },
    ],
    pricing: {
      "1RK":     { base:500,  gst:false },
      "1BHK":    { base:700,  gst:false },
      "2BHK":    { base:900,  gst:false },
      "3BHK":    { base:1100, gst:false },
      "4BHK":    { base:1300, gst:false },
      "Bungalow":{ base:1800, gst:false },
    },
  },

  // ─── 5. RODENT CONTROL ───────────────────────────
  {
    id:       "SVC-005",
    category: "Pest Control",
    name:     "Rodent Control",
    icon:     "🐀",
    description: "Bait station and trap installation. Rodent access points sealed.",
    pests:    ["Rats","Mice"],
    chemical: ["Rodenticide Bait","Glue Trap","Snap Trap"],
    premises: ["1RK","1BHK","2BHK","3BHK","4BHK","Bungalow","Office","Restaurant","Warehouse"],
    plans: [
      { planId:"RD-01", name:"Single Service",  duration:"One Time",  services:1, gapDays:0,  guarantee:"No Guarantee" },
      { planId:"RD-02", name:"Quarterly AMC",   duration:"1 Year",    services:4, gapDays:90, guarantee:"1 Year"       },
    ],
    pricing: {
      "1RK":     { base:800,  gst:false },
      "1BHK":    { base:1000, gst:false },
      "2BHK":    { base:1200, gst:false },
      "3BHK":    { base:1500, gst:false },
      "4BHK":    { base:1800, gst:false },
      "Bungalow":{ base:2500, gst:false },
    },
  },

  // ─── 6. TICK CONTROL ─────────────────────────────
  {
    id:       "SVC-006",
    category: "Pest Control",
    name:     "Tick Control",
    icon:     "🦠",
    description: "Safe chemical spray to eliminate ticks on pets, gardens and homes.",
    pests:    ["Ticks"],
    chemical: ["Acaricide Spray"],
    premises: ["1BHK","2BHK","3BHK","4BHK","Bungalow","Garden"],
    plans: [
      { planId:"TK-01", name:"Single Service",  duration:"One Time",  services:1, gapDays:0, guarantee:"No Guarantee" },
    ],
    pricing: {
      "1BHK":    { base:800,  gst:false },
      "2BHK":    { base:1000, gst:false },
      "Bungalow":{ base:1500, gst:false },
    },
  },

  // ─── 7. HONEY BEE REMOVAL ────────────────────────
  {
    id:       "SVC-007",
    category: "Pest Control",
    name:     "Honey Bee Removal",
    icon:     "🐝",
    description: "Eco-friendly bee relocation. Hive removed without harming the bees.",
    pests:    ["Honey Bees","Wasps"],
    chemical: ["Eco-safe Repellent"],
    premises: ["1RK","1BHK","2BHK","3BHK","4BHK","Bungalow","Office","Building"],
    plans: [
      { planId:"HB-01", name:"Single Service",  duration:"One Time",  services:1, gapDays:0, guarantee:"No Guarantee" },
    ],
    pricing: {
      "Any":     { base:1500, gst:false },
    },
  },

  // ─── 8. SOCIETY PEST CONTROL ─────────────────────
  {
    id:       "SVC-008",
    category: "Pest Control",
    name:     "Society / Commercial Pest Control",
    icon:     "🏢",
    description: "Common area pest control for housing societies, offices, restaurants, factories.",
    pests:    ["All Pests"],
    chemical: ["Odourless Spray","Gel Bait","Rodenticide"],
    premises: ["Society (up to 20 flats)","Society (21–50 flats)","Society (51–100 flats)","Office","Restaurant","Factory","Warehouse"],
    plans: [
      { planId:"SC-01", name:"Weekly Once",       duration:"Ongoing", services:52, gapDays:7,  guarantee:"Ongoing" },
      { planId:"SC-02", name:"Weekly Twice",      duration:"Ongoing", services:104,gapDays:3,  guarantee:"Ongoing" },
      { planId:"SC-03", name:"Weekly Thrice",     duration:"Ongoing", services:156,gapDays:2,  guarantee:"Ongoing" },
      { planId:"SC-04", name:"Fortnightly",       duration:"Ongoing", services:26, gapDays:14, guarantee:"Ongoing" },
      { planId:"SC-05", name:"Monthly",           duration:"1 Year",  services:12, gapDays:30, guarantee:"1 Year"  },
      { planId:"SC-06", name:"Alternate Month",   duration:"1 Year",  services:6,  gapDays:60, guarantee:"1 Year"  },
      { planId:"SC-07", name:"Quarterly",         duration:"1 Year",  services:4,  gapDays:90, guarantee:"1 Year"  },
    ],
    pricing: {
      "Society (up to 20 flats)":  { base:2000, gst:true  },
      "Society (21–50 flats)":     { base:3500, gst:true  },
      "Society (51–100 flats)":    { base:5000, gst:true  },
      "Office":                    { base:2500, gst:true  },
      "Restaurant":                { base:3000, gst:true  },
      "Factory":                   { base:5000, gst:true  },
      "Warehouse":                 { base:4000, gst:true  },
    },
  },

  // ─── 9. DEEP CLEANING (FURNISHED) ────────────────
  {
    id:       "SVC-009",
    category: "Cleaning",
    name:     "Deep Cleaning (Furnished)",
    icon:     "🧹",
    description: "Full deep clean of furnished flat/office. Sofa, carpet, floor, washroom, kitchen included.",
    pests:    [],
    chemical: ["Floor Cleaner","Disinfectant","Degreaser"],
    premises: ["1RK","1BHK","2BHK","3BHK","4BHK","Bungalow","Office"],
    plans: [
      { planId:"DC-01", name:"One Time Service",  duration:"One Time", services:1, gapDays:0, guarantee:"No Guarantee" },
      { planId:"DC-02", name:"Monthly",           duration:"6 Months", services:6, gapDays:30,guarantee:"6 Months"    },
    ],
    pricing: {
      "1RK":     { base:1500,  gst:false },
      "1BHK":    { base:2000,  gst:false },
      "2BHK":    { base:2800,  gst:false },
      "3BHK":    { base:3500,  gst:false },
      "4BHK":    { base:4200,  gst:false },
      "Bungalow":{ base:6000,  gst:false },
      "Office":  { base:3000,  gst:false },
    },
  },

  // ─── 10. DEEP CLEANING (UNFURNISHED) ─────────────
  {
    id:       "SVC-010",
    category: "Cleaning",
    name:     "Deep Cleaning (Unfurnished)",
    icon:     "🧽",
    description: "Floor, tiles, kitchen, washrooms, windows — post-construction or vacant property.",
    pests:    [],
    chemical: ["Acid Cleaner","Floor Cleaner","Tile Cleaner"],
    premises: ["1RK","1BHK","2BHK","3BHK","4BHK","Bungalow","Office"],
    plans: [
      { planId:"DU-01", name:"One Time Service", duration:"One Time", services:1, gapDays:0, guarantee:"No Guarantee" },
    ],
    pricing: {
      "1RK":     { base:1200, gst:false },
      "1BHK":    { base:1800, gst:false },
      "2BHK":    { base:2400, gst:false },
      "3BHK":    { base:3000, gst:false },
      "4BHK":    { base:3800, gst:false },
      "Bungalow":{ base:5000, gst:false },
    },
  },

  // ─── 11. KITCHEN DEEP CLEANING ───────────────────
  {
    id:       "SVC-011",
    category: "Cleaning",
    name:     "Kitchen Deep Cleaning",
    icon:     "🍳",
    description: "Chimney, tiles, sink, shelves, exhaust fan — thorough kitchen cleaning.",
    pests:    [],
    chemical: ["Degreaser","Chimney Cleaner","Tile Acid"],
    premises: ["Kitchen Only","1BHK Kitchen","2BHK Kitchen","3BHK Kitchen","Commercial Kitchen"],
    plans: [
      { planId:"KC-01", name:"One Time Service", duration:"One Time", services:1, gapDays:0, guarantee:"No Guarantee" },
      { planId:"KC-02", name:"Monthly",          duration:"6 Months", services:6, gapDays:30,guarantee:"6 Months"    },
    ],
    pricing: {
      "Kitchen Only":     { base:800,  gst:false },
      "1BHK Kitchen":     { base:1000, gst:false },
      "2BHK Kitchen":     { base:1200, gst:false },
      "3BHK Kitchen":     { base:1500, gst:false },
      "Commercial Kitchen":{ base:3000, gst:true  },
    },
  },

  // ─── 12. SOFA / CARPET CLEANING ──────────────────
  {
    id:       "SVC-012",
    category: "Cleaning",
    name:     "Sofa & Carpet Cleaning",
    icon:     "🛋️",
    description: "Steam cleaning and shampooing for sofas, carpets, mattresses.",
    pests:    [],
    chemical: ["Shampoo","Fabric Cleaner","Deodoriser"],
    premises: ["Sofa Only","Carpet Only","Sofa + Carpet","Mattress"],
    plans: [
      { planId:"SF-01", name:"One Time Service", duration:"One Time", services:1, gapDays:0, guarantee:"No Guarantee" },
    ],
    pricing: {
      "Sofa Only":       { base:800,  gst:false },
      "Carpet Only":     { base:600,  gst:false },
      "Sofa + Carpet":   { base:1200, gst:false },
      "Mattress":        { base:400,  gst:false },
    },
  },
];

// ─── FLAT LOOKUP (all unique premise types) ────────
export const ALL_PREMISES = [...new Set(SERVICE_CATALOG.flatMap(s => s.premises))];

// ─── CATEGORIES ────────────────────────────────────
export const SERVICE_CATEGORIES = [...new Set(SERVICE_CATALOG.map(s => s.category))];

// ─── QUICK LOOKUP ──────────────────────────────────
export const getServiceById = (id) => SERVICE_CATALOG.find(s => s.id === id);
export const getServiceByName = (name) => SERVICE_CATALOG.find(s => s.name === name);
export const getPlans = (serviceId) => getServiceById(serviceId)?.plans || [];
export const getPrice = (serviceId, premise) => {
  const svc = getServiceById(serviceId);
  return svc?.pricing?.[premise] || svc?.pricing?.["Any"] || null;
};
