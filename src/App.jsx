import "./App.css";
import logo from "./assets/logo.png";
// import introVideo from './videos/introduction_video.mp4'
import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import QuoteFlow from "./pages/QuoteFlow";
import termite from "./images/services/termite-drilling.jpg";
// import akash from "./testimonials/akash_dube.mp4";
// import love from "./testimonials/love_tanna.mp4";
// import jeetu from "./testimonials/jeetu_patel.mp4";
// import nidhi from "./testimonials/nidhi.mp4";
import deepCleaningBanner from "./images/deep_cleaning_most_booked_services/furnished_apartment_deep_cleaning.png";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TechnicianApp from "./crm/TechnicianApp";
import CustomerPortal from "./crm/CustomerPortal";
import AdminPanel from "./crm/AdminPanel";
import PWAInstallPrompt, { usePWA, OfflineBar, UpdateBanner } from "./PWAInstallPrompt";
import HRPortal from "./HRPortal";

// ── CRM imports — MUST be default imports, no curly braces ──
import CRMLogin  from "./crm/CRMLogin";
import CRMLayout from "./crm/CRMLayout";

function importAll(r) { return r.keys().map(r); }
const pestImages     = importAll(require.context("./images/pest_control_services", false, /\.(png|jpe?g|svg)$/));
const cleaningImages = importAll(require.context("./images/deep_cleaning_most_booked_services", false, /\.(png|jpe?g|svg)$/)).filter((img) => !img.includes("/office_deep_cleaning.png"));
const offerImages    = importAll(require.context("./offers", false, /\.(png|jpe?g|svg)$/)).sort((a, b) => a.localeCompare(b));

const phone        = "918591722846";
const openWhatsApp = (msg) => window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);

const pestData = [
  { title: "Apartment Anti Termite Treatment",  price: "1499", rating: "4.8" },
  { title: "Apartment Bed Bug Treatment",        price: "999",  rating: "4.7" },
  { title: "Apartment General Pest Control",     price: "799",  rating: "4.6" },
  { title: "Office General Pest Control",        price: "1999", rating: "4.8" },
  { title: "Restaurant General Pest Control",    price: "2499", rating: "4.9" },
  { title: "Society Anti Termite Treatment",     price: "2999", rating: "4.8" },
  { title: "Society Drainage Pest Control",      price: "1299", rating: "4.6" },
  { title: "Society General Pest Control",       price: "1799", rating: "4.7" },
  { title: "Society Mosquito Control",           price: "699",  rating: "4.5" },
  { title: "Society Rodent Control",             price: "899",  rating: "4.6" },
  { title: "Society Rat Guard Installation",     price: "899",  rating: "4.6" },
];

const cleaningData = [
  { title: "Carpet Cleaning",                     price: "799",  rating: "4.7" },
  { title: "Balcony Cleaning",                    price: "999",  rating: "4.8" },
  { title: "Bathroom Cleaning",                   price: "499",  rating: "4.8" },
  { title: "Furnished Apartment Deep Cleaning",   price: "3699", rating: "4.6" },
  { title: "Furnished Office Deep Cleaning",      price: "4499", rating: "4.6" },
  { title: "Kitchen Cleaning",                    price: "999",  rating: "4.9" },
  { title: "Sofa Cleaning",                       price: "599",  rating: "4.8" },
  { title: "Unfurnished Apartment Deep Cleaning", price: "2999", rating: "4.6" },
  { title: "Unfurnished Office Deep Cleaning",    price: "3499", rating: "4.6" },
  { title: "Window Cleaning",                     price: "499",  rating: "4.7" },
];

const titles     = ["Combo & Package Deals","Festive Offers","First Time User Deals","Limited Time Deals","Loyalty Rewards","Personalized Offers","Referral Rewards","Special Discounts","Weekend Specials","Yearly Service Offers"];
const offersData = offerImages.map((img, i) => ({ img, title: titles[i] || "Special Offer" }));

const testimonialData = [
  { video: "https://www.youtube.com/embed/YOUR_VIDEO_1", name: "Akash Dube"  },
  { video: "https://www.youtube.com/embed/YOUR_VIDEO_2", name: "Love Tanna"  },
  { video: "https://www.youtube.com/embed/YOUR_VIDEO_3", name: "Jeetu Patel" },
  { video: "https://www.youtube.com/embed/YOUR_VIDEO_4", name: "Nidhi"       },
];

const pestFAQ = [
  { question: "Is pest control safe for kids and pets?",       answer: "Yes, we use government-approved and safe chemicals."                    },
  { question: "How long does pest control take?",              answer: "Usually 30–60 minutes depending on area size."                          },
  { question: "Do I need to leave my home?",                   answer: "No, only minimal precautions are required."                             },
  { question: "How often should pest control be done?",        answer: "Every 3–6 months for best results."                                     },
  { question: "Will pests come back after treatment?",         answer: "We provide warranty and follow-up support."                             },
  { question: "Do you provide termite treatment?",             answer: "Yes, pre and post construction termite treatments are available."       },
  { question: "What types of pests do you cover?",             answer: "Cockroaches, ants, termites, rodents, mosquitoes, bed bugs."            },
  { question: "Is there any smell after service?",             answer: "Mild smell may remain for few hours."                                   },
  { question: "Do you offer same-day service?",                answer: "Yes, same-day service is available in most areas."                      },
  { question: "Do you provide warranty?",                      answer: "Yes, depending on service type."                                        },
  { question: "What preparation is required before service?",  answer: "Clear kitchen area and cover food items."                               },
  { question: "Do you service offices and societies?",         answer: "Yes, we handle residential and commercial properties."                  },
];

const cleaningFAQ = [
  { question: "What is included in deep cleaning?",    answer: "Kitchen, bathroom, floors, furniture, and hidden areas cleaning."  },
  { question: "How long does deep cleaning take?",     answer: "4–8 hours depending on home size."                                 },
  { question: "Do I need to be present?",              answer: "Not mandatory but recommended."                                    },
  { question: "Do you bring cleaning equipment?",      answer: "Yes, our team carries all tools and chemicals."                    },
  { question: "Is deep cleaning safe?",                answer: "Yes, we use safe and eco-friendly products."                       },
  { question: "How often should I do deep cleaning?",  answer: "Every 6 months is recommended."                                   },
  { question: "Do you clean sofas and carpets?",       answer: "Yes, specialized cleaning is available."                          },
  { question: "Will stains be removed completely?",    answer: "Most stains are removed, but depends on condition."                },
  { question: "Do you provide bathroom cleaning?",     answer: "Yes, complete bathroom deep cleaning is included."                 },
  { question: "Do you clean windows and fans?",        answer: "Yes, we cover windows, fans, and fixtures."                       },
  { question: "Do you offer office deep cleaning?",    answer: "Yes, we handle commercial cleaning."                               },
  { question: "What preparation is needed?",           answer: "Remove valuables and fragile items."                               },
];

const blogData = [
  { title: "5 Signs Your Home Needs Pest Control",          desc: "Identify early pest problems before they become serious.",   category: "Pest Control"  },
  { title: "How to Prevent Termites in Your Home",          desc: "Simple tips to protect your furniture and walls.",           category: "Pest Control"  },
  { title: "Why Deep Cleaning is Important Every 6 Months", desc: "Maintain hygiene and keep your home germ-free.",             category: "Deep Cleaning" },
  { title: "Kitchen Cleaning Tips for a Healthy Home",      desc: "Remove grease, bacteria and maintain hygiene easily.",       category: "Deep Cleaning" },
  { title: "How to Keep Your Bathroom Germ-Free",           desc: "Daily habits to maintain a clean and hygienic bathroom.",    category: "Deep Cleaning" },
  { title: "Mosquito Control Tips for Mumbai Homes",        desc: "Prevent mosquito breeding and stay safe from diseases.",     category: "Pest Control"  },
];

const locationData = {
  Mumbai: [
    "Churchgate","Marine Lines","Charni Road","Grant Road","Mumbai Central","Mahalakshmi",
    "Lower Parel","Prabhadevi","Dadar","Matunga Road","Mahim Jn","Bandra","Khar Road",
    "Santacruz","Vile Parle","Andheri","Jogeshwari","Ram Mandir","Goregaon","Malad",
    "Kandivali","Borivali","Dahisar","CSMT","Masjid","Sandhurst Road","Byculla",
    "Chinchpokli","Currey Road","Parel","Matunga","Sion","Kurla","Vidhyavihar","Ghatkopar",
    "Vikhroli","Kanjur Marg","Bhandup","Nahur","Mulund","Dockyarad Road","Reay Road",
    "Cotton Green","Sewri","Vadala Road","GTB Nagar","Chunabhatti","Tilaknagar","Chembur",
    "Govandi","Mankhurd",
  ],
  "Navi Mumbai": [
    "Vashi","Sanpada","Juinagar","Nerul","Seawood Darave","Belapur CBD","Kharghar",
    "Mansarovar","Khandeshwar","Panvel","Airoli","Rabale","Ghansoli","Koparkhairane","Turbhe",
  ],
  Thane: [
    "Mira Road","Bhayander","Naigaon","Vasai Road","Nalla Sopara","Virar","Thane","Kalva",
    "Mumbra","Diva Jn","Kopar","Dombivli","Thakurli","Kalyan","Vithalwadi","Ulhas Nagar",
    "Ambernath","Badalpur",
  ],
};

const mumbaiAreas = [
  ...locationData["Mumbai"],
  ...locationData["Navi Mumbai"],
  ...locationData["Thane"],
];

const serviceChips = [
  { icon: "🐜", label: "Pest Control",   fn: (of) => of("quote")   },
  { icon: "🧹", label: "Deep Cleaning",  fn: (of) => of("quote")   },
  { icon: "🕷️", label: "Termite",        fn: (of) => of("quote")   },
  { icon: "🛏️", label: "Bed Bugs",       fn: (of) => of("quote")   },
  { icon: "🦟", label: "Mosquito",       fn: (of) => of("quote")   },
  { icon: "🍳", label: "Kitchen Clean",  fn: (of) => of("quote")   },
  { icon: "🚿", label: "Bathroom Clean", fn: (of) => of("quote")   },
  { icon: "🛋️", label: "Sofa Cleaning",  fn: (of) => of("quote")   },
  { icon: "📅", label: "Schedule",       fn: (of) => of("booking") },
  { icon: "💳", label: "Payment",        fn: () => openWhatsApp("Hi, I need payment help.")          },
  { icon: "⚠️", label: "Complaints",     fn: () => openWhatsApp("Hi, I want to raise a complaint.")  },
  { icon: "💬", label: "Talk to Us",     fn: () => openWhatsApp("Hi, I want to talk to your team.") },
];

/* ── MAIN APP ── */
function App() {
  usePWA(); // ← ADD THIS LINE

  const [showQuote, setShowQuote]         = useState(false);
  const [quoteMode, setQuoteMode]         = useState("quote");
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showLocation, setShowLocation]   = useState(false);
  const [selectedArea, setSelectedArea]   = useState("");
  const [selectedCity, setSelectedCity]   = useState("");
  const [locationSet, setLocationSet]     = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  // eslint-disable-next-line no-unused-vars
  const [showRenewal, setShowRenewal]     = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [bannerIndex, setBannerIndex]     = useState(0);

  const heroBanners = [
    { tag: "🏆 Mumbai's #1 Service",   title: "Your Home,",      highlight: "Safe & Spotless",   sub: "Every Day",             desc: "Professional Pest Control & Deep Cleaning — Same-Day Service Available Across Mumbai"     },
    { tag: "🧹 Deep Cleaning Special", title: "Get Flat",        highlight: "15% OFF",           sub: "on Deep Cleaning",      desc: "Furnished & Unfurnished Apartment Deep Cleaning by Expert Professionals"                 },
    { tag: "🛏️ Most Booked Service",   title: "Bed Bugs?",       highlight: "100% Elimination",  sub: "Guaranteed!",           desc: "Advanced Bed Bug Treatment with 45-day, 90-day & Annual Warranty Plans"                  },
    { tag: "🐜 Termite Protection",    title: "Protect Your Home", highlight: "From Termites",   sub: "Up to 3 Year Warranty", desc: "Pre & Post Construction Anti Termite Treatment — Government Approved Chemicals"          },
    { tag: "🦟 Mosquito Season",       title: "Say Goodbye To",  highlight: "Mosquitoes",        sub: "This Season!",          desc: "Society & Apartment Mosquito Control — Safe for Kids & Pets"                            },
    { tag: "🏠 Full Home Care",        title: "Combo Deal —",    highlight: "Pest + Cleaning",   sub: "Save Up to 15%",        desc: "Book Pest Control & Deep Cleaning Together and Get an Exclusive Combo Discount"          },
    { tag: "⚡ Same Day Service",       title: "Need Service",    highlight: "Today?",            sub: "We're Available Now!",  desc: "Call or WhatsApp us — Same Day Service Available Across Mumbai"                         },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollLeft  = (id) => document.getElementById(id)?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = (id) => document.getElementById(id)?.scrollBy({ left:  300, behavior: "smooth" });
  const openFlow    = (mode) => { setQuoteMode(mode); setShowQuote(true); };

  const filteredChips = serviceChips.filter(s =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <BrowserRouter>
    <Routes>

  {/* ── CRM Login ── */}
  <Route path="/crm/login" element={<CRMLogin />} />

  {/* ── CRM App (layout + nested pages) ── */}
  <Route path="/crm/*" element={<CRMLayout />} />

  {/* ── Technician App ── */}
  <Route path="/technician" element={<TechnicianApp />} />

  <Route path="/customer" element={<CustomerPortal />} />

  <Route path="/admin" element={<AdminPanel />} />

  <Route path="/hr" element={<HRPortal />} />

  {/* ── Main Website ── */}
<Route path="/*" element={
  <div className="app-wrap">

    <OfflineBar />
    <UpdateBanner />
    <PWAInstallPrompt />

    {/* OFFER BAR */}
      ...
                  <div className="offer-bar">
              <div className="offer-track">
                <span>⚡ Cockroach & Ants – 10% OFF (₹299)</span>
                <span>🛏️ Bed Bugs – 12% OFF (₹499)</span>
                <span>🐜 Termite – 15% OFF (₹699)</span>
                <span>🧹 Kitchen Cleaning – 5% OFF</span>
                <span>🚿 Bathroom Cleaning – 5% OFF</span>
                <span>🏠 Full Home Cleaning – 10% OFF</span>
                <span>📦 Yearly Plan – 15% OFF</span>
                <span>⚡ Instant Booking – 5% OFF</span>
                <span>⚡ Cockroach & Ants – 10% OFF (₹299)</span>
                <span>🛏️ Bed Bugs – 12% OFF (₹499)</span>
                <span>🐜 Termite – 15% OFF (₹699)</span>
                <span>🧹 Kitchen Cleaning – 5% OFF</span>
              </div>
            </div>

            {/* NAVBAR */}
            <nav className="navbar-v2">
              <div className="nav-brand">
                <img src={logo} alt="logo" className="nav-logo" />
                <div>
                  <div className="nav-name">New Tech Home Services</div>
                  <div className="nav-sub">Mumbai's Trusted Service Partner</div>
                </div>
              </div>
              <div className="nav-right">
                <a href="tel:+918591722846" className="nav-phone">📞 +91 85917 22846</a>
                <button className="nav-login">👤 Customer Login</button>
              </div>
            </nav>

            {/* HERO */}
            <section className="hero-v2">
              {/* LOCATION BAR */}
              <div className="hero-locbar">
                <div className="locbar-left">
                  <div className="hero-loc-btn" onClick={() => setShowLocation(!showLocation)}>
                    <span>{selectedArea ? "📍" : "🔍"}</span>
                    <span className="hero-loc-name">{selectedArea ? selectedArea : "Search Your Location"}</span>
                    <span className="hero-loc-arrow">▾</span>
                  </div>
                  {selectedArea && (
                    <button className="hero-loc-clear" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArea(""); setSelectedCity(""); setLocationSet(false); setShowLocation(false);
                    }}>✕ Clear</button>
                  )}
                </div>
                <div className="locbar-offers">
                  <div className="locbar-badge locbar-badge-new"    onClick={() => setShowQuoteForm(true)}>🎉 New — 10% OFF</div>
                  <div className="locbar-badge locbar-badge-repeat" onClick={() => setShowQuoteForm(true)}>🔁 Repeat — 15% OFF</div>
                  <div className="locbar-badge locbar-badge-combo"  onClick={() => setShowQuoteForm(true)}>🤝 Combo — 15% OFF</div>
                  <div className="locbar-badge locbar-badge-renew"  onClick={() => alert("Customer Login coming soon! 🔄")}>🔄 Renewal — 15% OFF</div>
                </div>
                <div className="locbar-right">
                  <span className="hero-rating-pill">⭐ 4.1 · 20,000+ Customers</span>
                  <a href="tel:+918591722846" className="hero-call-pill">📞 Call Now</a>
                </div>
                {showLocation && (
                  <div className="hero-loc-drop">
                    <p className="hero-loc-head">Select Your City & Area</p>
                    {Object.entries(locationData).map(([city, areas]) => (
                      <div key={city}>
                        <div className="hero-loc-city">{city}</div>
                        {areas.map(a => (
                          <div key={a} className="hero-loc-item"
                            onClick={() => { setSelectedArea(a); setSelectedCity(city); setLocationSet(true); setShowLocation(false); }}>
                            📍 {a}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* LOCATION BANNER */}
              {locationSet && (
                <div className="loc-hero-banner">
                  <div className="loc-hero-left">
                    <div className="loc-hero-city-tag">📍 {selectedCity}</div>
                    <h2 className="loc-hero-title">{selectedArea}</h2>
                    <p className="loc-hero-sub">Pest Control & Deep Cleaning Services in <strong>{selectedArea}</strong> — Same Day Service Available</p>
                    <div className="loc-hero-actions">
                      <button className="hbtn-quote" onClick={() => setShowQuoteForm(true)}>💰 Get Quote in {selectedArea}</button>
                      <button className="hbtn-book"  onClick={() => openWhatsApp(`Hi, I need pest control / cleaning service in ${selectedArea}, ${selectedCity}. Please assist.`)}>📲 WhatsApp for {selectedArea}</button>
                    </div>
                    <div className="loc-hero-tags">
                      <span>🐜 Pest Control in {selectedArea}</span>
                      <span>🧹 Deep Cleaning in {selectedArea}</span>
                      <span>🕷️ Termite Control in {selectedArea}</span>
                      <span>🛏️ Bed Bug Treatment in {selectedArea}</span>
                    </div>
                  </div>
                  <div className="loc-hero-right">
                    <div className="loc-info-card">
                      <div className="loc-info-row"><span className="loc-info-icon">⚡</span><div><div className="loc-info-title">Same Day Service</div><div className="loc-info-sub">Available in {selectedArea}</div></div></div>
                      <div className="loc-info-row"><span className="loc-info-icon">✅</span><div><div className="loc-info-title">Verified Technicians</div><div className="loc-info-sub">Background checked staff</div></div></div>
                      <div className="loc-info-row"><span className="loc-info-icon">🏅</span><div><div className="loc-info-title">Service Warranty</div><div className="loc-info-sub">Guaranteed results</div></div></div>
                      <div className="loc-info-row"><span className="loc-info-icon">💰</span><div><div className="loc-info-title">Best Price in {selectedArea}</div><div className="loc-info-sub">No hidden charges</div></div></div>
                      <button className="loc-call-btn" onClick={() => openWhatsApp(`Hi, I need service in ${selectedArea}`)}>📞 Call for {selectedArea} Service</button>
                    </div>
                  </div>
                </div>
              )}

              {/* MAIN GRID */}
              <div className="hero-grid">
                <div className="hero-left">
                  {locationSet ? (
                    <>
                      <div className="hero-tag">📍 Serving {selectedCity}</div>
                      <h1 className="hero-h1">Pest Control &<br/>Deep Cleaning in<br/><span className="hero-accent-loc">{selectedArea}</span></h1>
                      <p className="hero-desc-loc">✅ Professional <strong>Pest Control & Deep Cleaning</strong> services in <strong>{selectedArea}</strong>, {selectedCity}. Same-day service available. Verified technicians. Service warranty included.</p>
                      <div className="loc-seo-tags">
                        <span>🐜 Pest Control in {selectedArea}</span>
                        <span>🧹 Deep Cleaning in {selectedArea}</span>
                        <span>🕷️ Termite Control in {selectedArea}</span>
                        <span>🛏️ Bed Bug Treatment in {selectedArea}</span>
                        <span>🦟 Mosquito Control in {selectedArea}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="hero-tag">{heroBanners[bannerIndex].tag}</div>
                      <h1 className="hero-h1">
                        {heroBanners[bannerIndex].title}<br/>
                        <span className="hero-accent">{heroBanners[bannerIndex].highlight}</span><br/>
                        {heroBanners[bannerIndex].sub}
                      </h1>
                      <p className="hero-desc">{heroBanners[bannerIndex].desc}</p>
                    </>
                  )}
                  {!locationSet && (
                    <div className="banner-dots">
                      {heroBanners.map((_, i) => (
                        <div key={i} className={`banner-dot ${bannerIndex === i ? "banner-dot-active" : ""}`} onClick={() => setBannerIndex(i)} />
                      ))}
                    </div>
                  )}
                  <div className="hero-search">
                    <span>🔍</span>
                    <input placeholder="Search services — pest control, cleaning, termite..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <div className="hero-btns">
                    <button className="hbtn-quote"  onClick={() => setShowQuoteForm(true)}>💰 Get Free Quote</button>
                    <button className="hbtn-book"   onClick={() => openFlow("booking")}>📅 Book Service</button>
                    <button className="hbtn-survey" onClick={() => openWhatsApp("Hi, I want to book a survey.")}>🔍 Survey</button>
                    <button className="hbtn-renew"  onClick={() => alert("Customer Login coming soon! Please login to renew your service. 🔄")}>🔄 Renew Service</button>
                  </div>
                  <p className="hero-urgency-v2">⚡ Limited Slots Today — Book Now & Save!</p>
                  <div className="hero-pills">
                    <span>✅ Govt Approved Chemicals</span>
                    <span>✅ Verified Technicians</span>
                    <span>✅ Service Warranty</span>
                  </div>
                  <div className="chips-grid">
                    {filteredChips.map((s, i) => (
                      <div key={i} className="chip" onClick={() => s.fn(openFlow)}>
                        <span className="chip-icon">{s.icon}</span>
                        <span className="chip-label">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="hero-right-v2">
                  <div className="hero-form-v2">
                    <div className="hform-head">
                      <h3>📋 Book a Service</h3>
                      <span className="hform-badge">Free Callback in 15 min</span>
                    </div>
                    <input className="hform-inp" type="text" placeholder="Your Full Name *" />
                    <input className="hform-inp" type="tel"  placeholder="Mobile Number *" />
                    <select className="hform-inp">
                      <option value="">Select Service *</option>
                      <optgroup label="🐜 Pest Control">
                        <option>General Pest Control</option>
                        <option>Bed Bug Treatment</option>
                        <option>Termite Treatment</option>
                        <option>Rodent Control</option>
                        <option>Mosquito Control</option>
                      </optgroup>
                      <optgroup label="🧹 Deep Cleaning">
                        <option>Full Home Deep Cleaning</option>
                        <option>Kitchen Cleaning</option>
                        <option>Bathroom Cleaning</option>
                        <option>Sofa Cleaning</option>
                        <option>Carpet Cleaning</option>
                      </optgroup>
                    </select>
                    <select className="hform-inp">
                      <option value="">Select Area *</option>
                      {mumbaiAreas.map(a => <option key={a}>{a}</option>)}
                    </select>
                    <button className="hform-btn" onClick={() => openWhatsApp("Hi, I want to book a service.")}>
                      🚀 Book Now — Free Callback
                    </button>
                    <p className="hform-note">🔒 No spam • 100% Safe & Secure</p>
                  </div>
                  <div className="hero-video-v2">
  <span className="hvideo-label">📹 Watch How We Work</span>
  <iframe
    width="100%"
    height="200"
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    title="New Tech Home Services"
    frameBorder="0"
    allow="autoplay; encrypted-media"
    allowFullScreen
  />
</div>
                </div>
              </div>

              {/* STATS BAR */}
              <div className="hero-statsbar">
                {[
                  { n: "20,000+",  l: "Pest Control Customers" },
                  { n: "2,000+",   l: "Deep Cleaning Customers" },
                  { n: "4.1 ★",    l: "Google Rating"           },
                  { n: "12+",      l: "Years Experience"        },
                  { n: "Same Day", l: "Service Available"       },
                ].map((s, i) => (
                  <div key={i} className="hstat">
                    <span className="hstat-num">{s.n}</span>
                    <span className="hstat-lbl">{s.l}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* PEST SERVICES */}
            <section className="section-v2">
              <div className="sec-header">
                <div><p className="sec-tag">Most Booked</p><h2 className="sec-title">Pest Control Services</h2></div>
                <button className="sec-see-all">See All →</button>
              </div>
              <div className="slider-wrap-v2">
                <button className="sldr-btn" onClick={() => scrollLeft("pest")}>◀</button>
                <div className="slider-container" id="pest"><div className="slider">{pestData.map((s, i) => <ServiceCard key={i} img={pestImages[i]} {...s} />)}</div></div>
                <button className="sldr-btn" onClick={() => scrollRight("pest")}>▶</button>
              </div>
            </section>

            {/* CLEANING SERVICES */}
            <section className="section-v2 section-gray">
              <div className="sec-header">
                <div><p className="sec-tag">Most Booked</p><h2 className="sec-title">Deep Cleaning Services</h2></div>
                <button className="sec-see-all">See All →</button>
              </div>
              <div className="slider-wrap-v2">
                <button className="sldr-btn" onClick={() => scrollLeft("clean")}>◀</button>
                <div className="slider-container" id="clean"><div className="slider">{cleaningData.map((s, i) => <ServiceCard key={i} img={cleaningImages[i]} {...s} />)}</div></div>
                <button className="sldr-btn" onClick={() => scrollRight("clean")}>▶</button>
              </div>
            </section>

            {/* OFFERS */}
            <section className="section-v2">
              <div className="sec-header">
                <div><p className="sec-tag">Exclusive</p><h2 className="sec-title">Best Offers For You</h2></div>
              </div>
              <div className="offers-scroll">{offersData.map((o, i) => <OfferCard key={i} img={o.img} title={o.title} />)}</div>
            </section>

            {/* TESTIMONIALS */}
            <section className="section-v2 section-gray">
              <div className="sec-header">
                <div><p className="sec-tag">Reviews</p><h2 className="sec-title">What Our Customers Say</h2></div>
              </div>
              <div className="google-trust-card">
                <div className="google-left"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" /></div>
                <div className="google-center"><h3>4.1 ★★★★★</h3><p>Based on 16+ Google Reviews</p><span className="trust-text">Trusted by customers across Mumbai</span></div>
                <div className="google-right"><a href="https://www.google.com/search?q=New+Tech+Services+Mumbai" target="_blank" rel="noreferrer" className="review-btn">View Reviews</a></div>
              </div>
              <div className="stats-row">
                <div className="stat-box"><h3>20,000+</h3><p>Pest Control Customers</p></div>
                <div className="stat-box"><h3>2,000+</h3><p>Deep Cleaning Customers</p></div>
                <div className="stat-box"><h3>4.1 ★</h3><p>Google Rating</p></div>
                <div className="stat-box"><h3>12+</h3><p>Years Experience</p></div>
              </div>
              <div className="slider-wrap-v2">
                <button className="sldr-btn" onClick={() => scrollLeft("testimonials")}>◀</button>
                <div className="slider-container" id="testimonials"><div className="slider">{testimonialData.map((t, i) => <TestimonialCard key={i} video={t.video} name={t.name} />)}</div></div>
                <button className="sldr-btn" onClick={() => scrollRight("testimonials")}>▶</button>
              </div>
            </section>

            {/* FAQ */}
            <section className="section-v2">
              <div className="sec-header"><div><p className="sec-tag">Help</p><h2 className="sec-title">Frequently Asked Questions</h2></div></div>
              <div className="faq-cols">
                <div><h3 className="faq-title">🐜 Pest Control FAQs</h3><div className="faq-container">{pestFAQ.map((f, i) => <FAQItem key={i} {...f} />)}</div></div>
                <div><h3 className="faq-title">🧹 Deep Cleaning FAQs</h3><div className="faq-container">{cleaningFAQ.map((f, i) => <FAQItem key={i} {...f} />)}</div></div>
              </div>
            </section>

            {/* BLOG */}
            <section className="section-v2 section-gray">
              <div className="sec-header">
                <div><p className="sec-tag">Knowledge</p><h2 className="sec-title">Home Care & Awareness</h2></div>
                <button className="sec-see-all">See All →</button>
              </div>
              <div className="blog-grid">{blogData.map((b, i) => <BlogCard key={i} {...b} />)}</div>
            </section>

            {/* BANNERS */}
            <section className="banner-v2">
              <div className="banner-content">
                <span className="banner-tag">🐜 Pest Control</span>
                <h2>Protect Your Home From Termites</h2>
                <p>Pre & post construction termite treatment with up to 3 year warranty</p>
                <button className="banner-cta" onClick={() => openFlow("booking")}>Book Now →</button>
              </div>
              <img src={termite} alt="Termite Control" />
            </section>

            <section className="banner-v2 banner-v2-blue">
              <div className="banner-content">
                <span className="banner-tag">🧹 Deep Cleaning</span>
                <h2>Deep Cleaning Experts</h2>
                <p>Complete home deep cleaning by trained professionals with eco-safe products</p>
                <button className="banner-cta" onClick={() => openFlow("booking")}>Book Now →</button>
              </div>
              <img src={deepCleaningBanner} alt="Deep Cleaning" />
            </section>

            {/* LOCATION COVERAGE */}
            <section className="location-section">
              <div className="location-inner">
                <div className="loc-header">
                  <p className="sec-tag">Service Areas</p>
                  <h2 className="sec-title">We Serve All Across Mumbai & Beyond</h2>
                  <p className="loc-sub">From <strong>Virar to Churchgate</strong> · From <strong>Badlapur to CST</strong> · From <strong>Panvel to CST</strong></p>
                </div>
                <div className="loc-routes">
                  {[
                    { title: "🚇 Western Line", sub: "Virar to Churchgate", areas: ["Virar","Nalasopara","Vasai","Bhayandar","Mira Road","Dahisar","Borivali","Kandivali","Malad","Goregaon","Jogeshwari","Andheri","Vile Parle","Santacruz","Khar","Bandra","Dadar","Mumbai Central","Churchgate"] },
                    { title: "🚇 Central Line",  sub: "Badlapur to CST",   areas: ["Badlapur","Ambernath","Ulhasnagar","Kalyan","Dombivli","Thane","Mulund","Bhandup","Kanjurmarg","Vikhroli","Ghatkopar","Kurla","Sion","Dadar","CST"] },
                    { title: "🚇 Harbour Line",  sub: "Panvel to CST",     areas: ["Panvel","Kharghar","Belapur","Vashi","Sanpada","Juinagar","Nerul","Seawoods","Airoli","Ghansoli","Rabale","Kopar Khairane","Turbhe","Andheri","Kurla","CST"] },
                  ].map(route => (
                    <div key={route.title} className="loc-route-card">
                      <div className="loc-route-title">{route.title}</div>
                      <div className="loc-route-sub">{route.sub}</div>
                      <div className="loc-areas">
                        {route.areas.map(a => (
                          <span key={a} className="loc-area-chip"
                            onClick={() => openWhatsApp(`Hi, I need pest control / cleaning service in ${a}. Please assist.`)}>
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="loc-services-list">
                  <h3>Services Available in All Areas</h3>
                  <div className="loc-service-tags">
                    {["Pest Control Services","Cockroach Treatment","Bed Bug Treatment","Termite Control","Rodent Control","Mosquito Control","Deep Cleaning Services","Kitchen Cleaning","Bathroom Cleaning","Sofa Cleaning","Carpet Cleaning","Full Home Deep Cleaning","Office Pest Control","Society Pest Control","Post Construction Cleaning"].map(s => (
                      <span key={s} className="loc-service-tag"
                        onClick={() => openWhatsApp(`Hi, I need ${s} service. Please assist.`)}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="footer-v2">
              <div className="footer-v2-grid">
                <div className="footer-brand">
                  <img src={logo} alt="logo" className="footer-logo" />
                  <h3>New Tech Home Services</h3>
                  <p>Professional Pest Control & Deep Cleaning Services in Mumbai. Trusted by 20,000+ customers.</p>
                  <div className="footer-contacts">
                    <a href="tel:+918591722846">📞 +91 85917 22846</a>
                    <a href="mailto:support@newtechservices.com">📧 support@newtechservices.com</a>
                    <span>📍 Mumbai, Maharashtra</span>
                  </div>
                </div>
                <div>
                  <h4>Pest Control</h4>
                  <ul><li>General Pest Control</li><li>Bed Bug Treatment</li><li>Termite Control</li><li>Rodent Control</li><li>Mosquito Control</li><li>Drainage Pest Control</li></ul>
                </div>
                <div>
                  <h4>Deep Cleaning</h4>
                  <ul><li>Full Home Deep Cleaning</li><li>Kitchen Cleaning</li><li>Bathroom Cleaning</li><li>Sofa Cleaning</li><li>Carpet Cleaning</li><li>Window Cleaning</li></ul>
                </div>
                <div>
                  <h4>Quick Links</h4>
                  <ul><li>About Us</li><li>Our Services</li><li>Offers & Deals</li><li>Customer Reviews</li><li>Blog</li><li>Contact Us</li></ul>
                  <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="footer-wa">💬 WhatsApp Us</a>
                </div>
              </div>
              <div className="footer-v2-bottom">
                <p>© 2026 New Tech Home Services | All Rights Reserved</p>
                <p>Made with ❤️ for Mumbai</p>
              </div>
            </footer>

            {/* FLOATING BUTTONS */}
            <div className="floating-v2">
              <button className="fv2-survey" onClick={() => openWhatsApp("Hi, I want to book a survey.")}>🔍 Survey</button>
              <button className="fv2-quote"  onClick={() => setShowQuoteForm(true)}>💰 Quote</button>
              <button className="fv2-chat"   onClick={() => openWhatsApp("Hi, I need help.")}>💬 Chat</button>
            </div>

            {/* QUICK ENQUIRY */}
            {showQuoteForm && (
              <div className="qe-overlay">
                <div className="qe-box">
                  <div className="qe-header">
                    <h3>💰 Get Free Quote</h3>
                    <button className="qe-close" onClick={() => setShowQuoteForm(false)}>✕</button>
                  </div>
                  <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
                    Share your details — we'll send your quote on WhatsApp within minutes!
                  </p>
                  <input className="qe-input" placeholder="Your Full Name *" />
                  <input className="qe-input" placeholder="Mobile Number *" type="tel" />
                  <select className="qe-input">
                    <option>Select Service *</option>
                    <option>General Pest Control</option><option>Bed Bug Treatment</option>
                    <option>Termite Treatment</option><option>Full Home Deep Cleaning</option>
                    <option>Kitchen Cleaning</option><option>Other</option>
                  </select>
                  <select className="qe-input">
                    <option>Select Area *</option>
                    {mumbaiAreas.map(a => <option key={a}>{a}</option>)}
                  </select>
                  <textarea className="qe-input" rows="2" placeholder="Any specific requirements..." />
                  <button className="qe-submit"
                    onClick={() => { openWhatsApp("Hi, I want a free quote for pest control / cleaning service."); setShowQuoteForm(false); }}>
                    📲 Send My Quote Request on WhatsApp
                  </button>
                </div>
              </div>
            )}

            {/* RENEWAL MODAL */}
            {showRenewal && (
              <div className="qe-overlay">
                <div className="qe-box">
                  <div className="qe-header">
                    <h3>🔄 Renew My Service</h3>
                    <button className="qe-close" onClick={() => setShowRenewal(false)}>✕</button>
                  </div>
                  <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
                    🎉 Renewal customers get <strong>15% OFF</strong> — Enter your details below!
                  </p>
                  <input className="qe-input" placeholder="Your Full Name *" />
                  <input className="qe-input" placeholder="Mobile Number *" type="tel" />
                  <input className="qe-input" placeholder="Previous Service (e.g. Pest Control)" />
                  <input className="qe-input" placeholder="Previous Invoice / Job Number (if any)" />
                  <select className="qe-input">
                    <option>Select Service to Renew *</option>
                    <option>General Pest Control</option><option>Bed Bug Treatment</option>
                    <option>Termite Treatment — 1 Year</option><option>Termite Treatment — 2 Year</option>
                    <option>Termite Treatment — 3 Year</option>
                    <option>Annual Maintenance Contract (AMC)</option>
                    <option>Deep Cleaning</option><option>Other</option>
                  </select>
                  <select className="qe-input">
                    <option>Select Your Area *</option>
                    {mumbaiAreas.map(a => <option key={a}>{a}</option>)}
                  </select>
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: "#166534", fontWeight: 600 }}>
                    🎉 You save 15% as a Renewal Customer!
                  </div>
                  <button className="qe-submit"
                    onClick={() => { openWhatsApp("Hi, I want to renew my service. Please assist with 15% renewal discount."); setShowRenewal(false); }}>
                    📲 Send Renewal Request on WhatsApp
                  </button>
                </div>
              </div>
            )}

            {/* QUOTE FLOW */}
            {showQuote && <QuoteFlow mode={quoteMode} onClose={() => setShowQuote(false)} />}

          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

/* ── COMPONENTS ── */
function ServiceCard({ img, title, price, rating }) {
  return (
    <div className="scard">
      <div className="scard-img"><img src={img} alt={title} /></div>
      <div className="scard-body">
        <h4>{title}</h4>
        <div className="scard-meta">
          <span className="scard-rating">⭐ {rating}</span>
          <span className="scard-price">From ₹{price}</span>
        </div>
        <button className="scard-btn"
          onClick={() => window.open(`https://wa.me/918591722846?text=${encodeURIComponent(`Hi, I want to book ${title}. Please assist.`)}`)}>
          Book Now
        </button>
      </div>
    </div>
  );
}

function OfferCard({ img, title }) {
  return (
    <div className="offer-banner">
      <img src={img} alt={title} />
      <div className="offer-overlay"><button className="explore-btn">Explore</button></div>
    </div>
  );
}

function TestimonialCard({ video, name }) {
  return (
    <div className="tcard">
      <video src={video} autoPlay loop muted playsInline className="tcard-video" />
      <p className="tcard-name">{name}</p>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item" onClick={() => setOpen(!open)}>
      <div className="faq-question"><h4>{question}</h4><span>{open ? "−" : "+"}</span></div>
      {open && <p className="faq-answer">{answer}</p>}
    </div>
  );
}

function BlogCard({ title, desc, category }) {
  return (
    <div className="blog-card-v2">
      <span className="blog-cat-v2">{category}</span>
      <h4>{title}</h4>
      <p>{desc}</p>
      <button className="blog-read-v2">Read More →</button>
    </div>
  );
}

export default App;
