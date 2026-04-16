export default function StickyBar({
  price,
  liveTotal,
  addonsTotal,
  service,
  subService,
  size,
  plan,
  variant,
  addons,
  filteredAddons,
  updateAddonQty,
  addToCart,
  cart,
  grandTotal,
  bestOffer,
  formatSizeLabel,
  config,
  setBookingType,
}) {
  if (!price) return null;

  return (
    <div className="sticky-wrapper">

      {/* 🔥 MAIN STICKY BAR */}
      <div className="sticky-bar premium-bar">

        {/* OFFER STRIP */}
        {bestOffer?.value > 0 && (
          <div className="offer-strip">
            <span className="offer-tag">{bestOffer.name}</span>
            <span className="offer-name">
              Best offer applied · Limited time
            </span>
            <span className="offer-saving">
              Save ₹{Math.round(bestOffer.value)}
            </span>
          </div>
        )}

        {/* ADDON CHIPS STRIP */}
        {service === "cleaning" && plan && filteredAddons.length > 0 && (
          <div className="addon-strip">
            {filteredAddons.map((a) => {
              const selected = addons[a.id];

              return (
                <div
                  key={a.id}
                  className={`addon-chip ${
                    selected ? "addon-chip-selected" : ""
                  }`}
                  onClick={() => !selected && updateAddonQty(a, "add")}
                >
                  <span className="addon-chip-name">{a.addonName}</span>

                  {selected ? (
                    <>
                      <div className="chip-qty">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAddonQty(a, "remove");
                          }}
                        >
                          −
                        </button>

                        <span>{selected.qty}</span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAddonQty(a, "add");
                          }}
                        >
                          +
                        </button>
                      </div>

                      <span className="chip-price">
                        ₹{a.price * selected.qty}
                      </span>
                    </>
                  ) : (
                    <span className="chip-price">+₹{a.price}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MAIN BAR */}
        <div className="bar-main">

          {/* LEFT */}
          <div className="bar-left">
            <div className="bar-service-name">
              {config[service]?.subServices[subService]?.label}
              {size ? ` · ${formatSizeLabel(size)}` : ""}
            </div>

            <div className="bar-meta">
              {plan && plan}
              {variant ? ` · ${variant}` : ""}
              <span
                style={{
                  marginLeft: "6px",
                  color: "#16a34a",
                  fontWeight: "500",
                }}
              >
                ⚡ Fast Service
              </span>
            </div>
          </div>

          {/* CENTER */}
          <div className="bar-center">
            <div className="bar-price">
              ₹{liveTotal.toLocaleString("en-IN")}
            </div>

            <div className="bar-gst">
              +₹{Math.round(liveTotal * 0.18).toLocaleString("en-IN")} GST ·
              Total ₹{Math.round(liveTotal * 1.18).toLocaleString("en-IN")}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bar-actions">
            <button className="btn-cart premium-btn" onClick={addToCart}>
              Add to Cart →
            </button>
          </div>
        </div>

        {/* VIEW CART BAR */}
        {cart.length > 0 && (
          <div
            className="view-cart-bar"
            onClick={() => setBookingType("booking")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="view-cart-count">
                {cart.length} item{cart.length > 1 ? "s" : ""}
              </span>
              <span className="view-cart-label">View cart</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span className="view-cart-total">
                ₹{Math.round(grandTotal).toLocaleString("en-IN")}
              </span>
              <span>›</span>
            </div>
          </div>
        )}
      </div>

      {/* 🔥 FLOATING CONTACT BUTTONS (FIXED POSITION) */}
      <div className="contact-floating">

        <a href="tel:+918591722846" className="contact-btn call-btn">
          📞 Call
        </a>

        <a
          href={`https://wa.me/918591722846?text=Hi I want ${service} service`}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-btn whatsapp-btn"
        >
          💬 WhatsApp
        </a>

      </div>

    </div>
  );
}