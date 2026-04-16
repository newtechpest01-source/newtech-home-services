import React, { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');

  .cs-wrap {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 860px;
    margin: 0 auto;
    padding: 8px 0 32px;
  }

  /* ── SECTION CARD ── */
  .cs-card {
    background: #fff;
    border-radius: 18px;
    border: 1px solid #efefef;
    overflow: hidden;
  }

  .cs-card-header {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 16px 20px 14px;
    border-bottom: 1px solid #f5f5f5;
  }

  .cs-card-header-icon {
    font-size: 18px;
    line-height: 1;
  }

  .cs-card-title {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #111;
    margin: 0;
  }

  .cs-card-body {
    padding: 16px 20px;
  }

  /* ── CART ITEM ── */
  .cs-cart-item {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .cs-item-icon {
    width: 42px;
    height: 42px;
    background: #fff4ee;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .cs-item-main {
    flex: 1;
    min-width: 0;
  }

  .cs-item-name {
    font-family: 'Sora', sans-serif;
    font-size: 14.5px;
    font-weight: 700;
    color: #111;
    margin: 0 0 6px;
  }

  .cs-item-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .cs-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #f5f5f5;
    border-radius: 7px;
    padding: 3px 9px;
    font-size: 11.5px;
    color: #555;
    font-weight: 500;
  }

  .cs-item-price {
    font-family: 'Sora', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #111;
    flex-shrink: 0;
  }

  .cs-remove-btn {
    width: 28px;
    height: 28px;
    border: none;
    background: #f8f8f8;
    border-radius: 8px;
    cursor: pointer;
    color: #bbb;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s;
    flex-shrink: 0;
  }
  .cs-remove-btn:hover { background: #ffe8e2; color: #ff5722; }

  /* ── OFFERS ── */
  .cs-offers-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cs-offer-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 15px;
    border-radius: 13px;
    border: 1.5px solid #e8e8e8;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    position: relative;
    background: #fff;
  }

  .cs-offer-row:hover {
    border-color: #ff7043;
    box-shadow: 0 2px 12px rgba(255,112,67,0.1);
  }

  .cs-offer-row.selected {
    border-color: #ff5722;
    background: #fff9f7;
    box-shadow: 0 2px 16px rgba(255,87,34,0.12);
  }

  .cs-offer-radio {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #ddd;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s;
  }

  .cs-offer-row.selected .cs-offer-radio {
    border-color: #ff5722;
    background: #ff5722;
  }

  .cs-offer-radio-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fff;
  }

  .cs-offer-info { flex: 1; min-width: 0; }

  .cs-offer-name {
    font-size: 13.5px;
    font-weight: 600;
    color: #111;
    margin: 0 0 2px;
  }

  .cs-offer-sub {
    font-size: 11.5px;
    color: #999;
    margin: 0;
  }

  .cs-offer-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .cs-offer-discount {
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #2e7d32;
  }

  .cs-offer-best {
    background: linear-gradient(135deg, #ffd600, #ffab00);
    color: #5d4000;
    font-size: 10px;
    font-weight: 700;
    font-family: 'Sora', sans-serif;
    border-radius: 99px;
    padding: 3px 9px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  /* ── PRICE SUMMARY ── */
  .cs-summary {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .cs-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13.5px;
    color: #777;
  }

  .cs-summary-row.saving { color: #2e7d32; font-weight: 600; }

  .cs-summary-row.gst { color: #888; }

  .cs-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #e8e8e8, transparent);
    margin: 4px 0;
  }

  .cs-summary-row.total {
    font-family: 'Sora', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #111;
  }

  .cs-summary-row.total .cs-total-amount { color: #ff5722; }

  .cs-saving-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #e8f5e9;
    color: #2e7d32;
    font-size: 11px;
    font-weight: 600;
    border-radius: 99px;
    padding: 2px 10px;
  }

  /* ── CTA SECTION ── */
  .cs-cta-label {
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 12px;
  }

  .cs-cta-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .cs-btn {
    padding: 15px 20px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  }
  .cs-btn:hover { transform: translateY(-1px); }
  .cs-btn:active { transform: translateY(0); }

  .cs-btn-quote {
    background: #fff;
    color: #ff5722;
    border: 2px solid #ff5722;
    box-shadow: 0 2px 10px rgba(255,87,34,0.1);
  }
  .cs-btn-quote:hover {
    background: #fff9f7;
    box-shadow: 0 4px 16px rgba(255,87,34,0.15);
  }

  .cs-btn-book {
    background: linear-gradient(135deg, #ff5722 0%, #ff7043 100%);
    color: #fff;
    box-shadow: 0 4px 18px rgba(255,87,34,0.35);
  }
  .cs-btn-book:hover {
    box-shadow: 0 6px 24px rgba(255,87,34,0.42);
  }

  .cs-btn-icon { font-size: 16px; }
  .cs-btn-arrow { transition: transform 0.2s; }
  .cs-btn-book:hover .cs-btn-arrow { transform: translateX(3px); }

  .cs-trust-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 14px;
  }

  .cs-trust-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    color: #aaa;
  }
  .cs-trust-item span:first-child { color: #4caf50; font-size: 12px; }
`;

// ── demo data (replace with real props in production) ──
const DEMO_CART = [
  {
    name: "Full Home Cleaning",
    price: 5699,
    tags: [
      { icon: "🏠", label: "Residential" },
      { icon: "🏢", label: "Apartment" },
      { icon: "🛏️", label: "1 BHK" },
      { icon: "✨", label: "Furnished" },
      { icon: "⭐", label: "Premium Care" },
    ],
  },
];

const OFFERS = [
  { id: "first", name: "First Time User Deal", sub: "12% off your first booking", discount: "12% off", best: true },
  { id: "ltd",   name: "Limited Time Deal",    sub: "Flat discount on this service", discount: "₹150 off", best: false },
];

export default function CartSection({ cart: propCart, onRemove, onQuote, onBook }) {
  const cart = propCart || DEMO_CART;
  const [selectedOffer, setSelectedOffer] = useState("first");

  const subtotal = cart.reduce((s, i) => s + i.price, 0);

  const getDiscount = () => {
    if (selectedOffer === "first") return Math.round(subtotal * 0.12);
    if (selectedOffer === "ltd")   return 150;
    return 0;
  };

  const discount   = getDiscount();
  const afterDisc  = subtotal - discount;
  const gst        = Math.round(afterDisc * 0.18);
  const total      = afterDisc + gst;

  const getEmoji = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("kitchen"))  return "🍳";
    if (n.includes("bathroom")) return "🚿";
    if (n.includes("villa"))    return "🏡";
    if (n.includes("pest"))     return "🐛";
    return "🧹";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cs-wrap">

        {/* ── CART ITEMS ── */}
        <div className="cs-card">
          <div className="cs-card-header">
            <span className="cs-card-header-icon">🛒</span>
            <h3 className="cs-card-title">Cart</h3>
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#aaa" }}>
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="cs-card-body">
            {cart.map((item, i) => (
              <div key={i} className="cs-cart-item">
                <div className="cs-item-icon">{getEmoji(item.name)}</div>
                <div className="cs-item-main">
                  <p className="cs-item-name">{item.name}</p>
                  <div className="cs-item-tags">
                    {(item.tags || []).map((t, ti) => (
                      <span key={ti} className="cs-tag">
                        {t.icon} {t.label}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="cs-item-price">₹{item.price.toLocaleString("en-IN")}</span>
                <button className="cs-remove-btn" onClick={() => onRemove?.(i)}>✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* ── OFFERS ── */}
        <div className="cs-card">
          <div className="cs-card-header">
            <span className="cs-card-header-icon">🎉</span>
            <h3 className="cs-card-title">Available Offers</h3>
          </div>
          <div className="cs-card-body">
            <div className="cs-offers-list">
              {OFFERS.map((offer) => (
                <div
                  key={offer.id}
                  className={`cs-offer-row ${selectedOffer === offer.id ? "selected" : ""}`}
                  onClick={() => setSelectedOffer(offer.id)}
                >
                  <div className="cs-offer-radio">
                    {selectedOffer === offer.id && <div className="cs-offer-radio-dot" />}
                  </div>
                  <div className="cs-offer-info">
                    <p className="cs-offer-name">{offer.name}</p>
                    <p className="cs-offer-sub">{offer.sub}</p>
                  </div>
                  <div className="cs-offer-right">
                    <span className="cs-offer-discount">{offer.discount}</span>
                    {offer.best && <span className="cs-offer-best">Best!</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PRICE SUMMARY ── */}
        <div className="cs-card">
          <div className="cs-card-header">
            <span className="cs-card-header-icon">🧾</span>
            <h3 className="cs-card-title">Price Summary</h3>
          </div>
          <div className="cs-card-body">
            <div className="cs-summary">
              <div className="cs-summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="cs-summary-row saving">
                  <span>Discount ({OFFERS.find(o => o.id === selectedOffer)?.name})</span>
                  <span>−₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="cs-summary-row gst">
                <span>GST @ 18%</span>
                <span>+₹{gst.toLocaleString("en-IN")}</span>
              </div>
              <div className="cs-divider" />
              <div className="cs-summary-row total">
                <span>Total</span>
                <span className="cs-total-amount">₹{total.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                  <span className="cs-saving-pill">🎉 You save ₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="cs-card">
          <div className="cs-card-body">
            <p className="cs-cta-label">What would you like to do?</p>
            <div className="cs-cta-row">
              <button className="cs-btn cs-btn-quote" onClick={onQuote}>
                <span className="cs-btn-icon">📋</span> Get Instant Quote
              </button>
              <button className="cs-btn cs-btn-book" onClick={onBook}>
                <span className="cs-btn-icon">📅</span> Book Now
                <span className="cs-btn-arrow">→</span>
              </button>
            </div>
            <div className="cs-trust-row">
              <span className="cs-trust-item"><span>✓</span> No advance payment</span>
              <span className="cs-trust-item"><span>✓</span> Free cancellation</span>
              <span className="cs-trust-item"><span>✓</span> Verified experts</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
