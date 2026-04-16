import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./crm.css";

const TEAM = [
  { mobile: "9999999999", name: "Suraj Chettiar",  role: "owner"      },
  { mobile: "8591722846", name: "Sales Team",       role: "sales"      },
  { mobile: "8898720011", name: "Sanjeet Varma",    role: "technician" },
  { mobile: "9152560389", name: "Deepak Sonawane",  role: "technician" },
  { mobile: "8104553496", name: "Ajit Salunke",     role: "manager"    },
];

export default function CRMLogin() {
  const navigate = useNavigate();
  const [mobile,  setMobile]  = useState("");
  const [otp,     setOtp]     = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [step,    setStep]    = useState(1);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    const user = TEAM.find(t => t.mobile === mobile.trim());
    if (!user) { setError("Mobile number not registered. Contact admin."); return; }
    setLoading(true);
    setError("");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(otp);
    const msg = `🔐 *New Tech Home Services CRM*\n\nYour OTP is: *${otp}*\n\nValid for 10 minutes. Do not share.`;
    window.open(`https://wa.me/91${mobile}?text=${encodeURIComponent(msg)}`);
    setLoading(false);
    setStep(2);
  };

  const handleVerifyOTP = () => {
    if (otp.trim() === sentOtp) {
      const user = TEAM.find(t => t.mobile === mobile.trim());
      localStorage.setItem("crm_user", JSON.stringify({ mobile: user.mobile, name: user.name, role: user.role, loginTime: new Date().toISOString() }));
      navigate("/crm/dashboard");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="crm-login-page">
      <div className="crm-login-box">
        <div className="crm-login-logo">
          <span className="crm-logo-icon">🏠</span>
          <div><h2>New Tech Home Services</h2><p>Business OS — CRM Portal</p></div>
        </div>

        {step === 1 ? (
          <>
            <h3 className="crm-login-title">Login with Mobile OTP</h3>
            <p className="crm-login-sub">Enter your registered mobile number</p>
            <div className="crm-input-group">
              <label>📱 Mobile Number</label>
              <input type="tel" maxLength={10} className="crm-input" placeholder="10-digit mobile number"
                value={mobile} onChange={e => setMobile(e.target.value)} />
            </div>
            {error && <div className="crm-error">{error}</div>}
            <button className="crm-btn-primary" disabled={mobile.length !== 10 || loading} onClick={handleSendOTP}>
              {loading ? "Sending..." : "📲 Send OTP on WhatsApp"}
            </button>
          </>
        ) : (
          <>
            <h3 className="crm-login-title">Enter OTP</h3>
            <p className="crm-login-sub">OTP sent to WhatsApp: +91 {mobile}</p>
            <div className="crm-input-group">
              <label>🔐 OTP</label>
              <input type="number" className="crm-input crm-otp-input" placeholder="6-digit OTP"
                value={otp} onChange={e => setOtp(e.target.value)} />
            </div>
            {error && <div className="crm-error">{error}</div>}
            <button className="crm-btn-primary" disabled={otp.length !== 6} onClick={handleVerifyOTP}>
              ✅ Verify & Login
            </button>
            <button className="crm-btn-secondary" onClick={() => { setStep(1); setOtp(""); setError(""); }}>
              ← Change Number
            </button>
          </>
        )}
        <p className="crm-login-note">🔒 Secure login — New Tech team only</p>
      </div>
    </div>
  );
}
