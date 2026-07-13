import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const TIME_SLOTS = [
  { value: "9-10", label: "🌅 09:00 AM – 10:00 AM" },
  { value: "10-11", label: "🌅 10:00 AM – 11:00 AM" },
  { value: "11-12", label: "🌅 11:00 AM – 12:00 PM" },
  { value: "12-13", label: "☀️ 12:00 PM – 01:00 PM" },
  { value: "13-14", label: "☀️ 01:00 PM – 02:00 PM" },
  { value: "14-15", label: "☀️ 02:00 PM – 03:00 PM" },
  { value: "15-16", label: "☀️ 03:00 PM – 04:00 PM" },
  { value: "16-17", label: "☀️ 04:00 PM – 05:00 PM" },
  { value: "17-18", label: "🌙 05:00 PM – 06:00 PM" },
  { value: "18-19", label: "🌙 06:00 PM – 07:00 PM" },
  { value: "19-20", label: "🌙 07:00 PM – 08:00 PM" }
];

const LANGUAGES = ["English", "Arabic", "Urdu", "Spanish", "French", "German"];

const NATIONALITIES = [
  "Pakistani",
  "Indian",
  "Bangladeshi",
  "Egyptian",
  "Moroccan",
  "Algerian",
  "Saudi Arabian",
  "Emirati",
  "Nigerian",
  "British",
  "American",
  "Canadian",
  "Filipino",
  "Indonesian",
  "Syrian",
  "Lebanese",
  "Jordanian",
  "Yemeni",
  "Other",
];

export const LeadSelfFillForm = () => {
  const [step, setStep] = useState(1); // 1: unified form, 2: success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Optional lookup state
  const [lookupOpen, setLookupOpen] = useState(false);
  const [lookupEmail, setLookupEmail] = useState("");

  // Form fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    preferredLanguage: "English",
    serviceId: "dnv",
    applicantsCount: "Main Only",
    meetingPreferredDate: "",
    meetingPreferredTime: "",
    meetingPreferredLanguage: "English",
    meetingNotes: "",
  });

  const [nationalitySearch, setNationalitySearch] = useState("");
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);

  // Parse URL query parameters on mount to auto-populate fields
  useEffect(() => {
    const searchString = window.location.search || (window.location.hash.includes("?") ? window.location.hash.split("?")[1] : "");
    const params = new URLSearchParams(searchString);
    
    const phoneParam = params.get("phone") || params.get("whatsapp") || "";
    const emailParam = params.get("email") || "";
    const serviceParam = params.get("service") || params.get("program") || "";
    const applicantsParam = params.get("applicants") || "";
    const nationalityParam = params.get("nationality") || "";

    setForm((prev) => ({
      ...prev,
      phone: phoneParam ? decodeURIComponent(phoneParam).trim() : prev.phone,
      email: emailParam ? decodeURIComponent(emailParam).trim() : prev.email,
      serviceId: serviceParam ? decodeURIComponent(serviceParam).trim() : prev.serviceId,
      applicantsCount: applicantsParam ? decodeURIComponent(applicantsParam).trim() : prev.applicantsCount,
      nationality: nationalityParam ? decodeURIComponent(nationalityParam).trim() : prev.nationality,
    }));
    if (nationalityParam) {
      setNationalitySearch(decodeURIComponent(nationalityParam).trim());
    }
  }, []);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupEmail) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${API_URL}/leads/find-by-email?email=${encodeURIComponent(lookupEmail.trim())}`,
      );
      const data = res.data;
      setForm((prev) => ({
        ...prev,
        firstName: data.firstName || prev.firstName,
        lastName: data.lastName || prev.lastName,
        phone: data.phone || prev.phone,
        email: data.email || prev.email,
        nationality: data.nationality || prev.nationality,
        preferredLanguage: data.preferredLanguage || prev.preferredLanguage,
        serviceId: data.serviceType || prev.serviceId,
        meetingPreferredDate: data.meetingPreferredDate || prev.meetingPreferredDate,
        meetingPreferredTime: data.meetingPreferredTime || prev.meetingPreferredTime,
        meetingPreferredLanguage:
          data.meetingPreferredLanguage || data.preferredLanguage || prev.meetingPreferredLanguage,
        meetingNotes: data.meetingNotes || prev.meetingNotes,
      }));
      if (data.nationality) {
        setNationalitySearch(data.nationality);
      }
      setLookupOpen(false);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Profile not found with this email. Please fill in details manually.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      setError("Please fill in all required personal details (Name, Email, Phone).");
      return;
    }
    if (!form.meetingPreferredDate || !form.meetingPreferredTime) {
      setError("Please select your preferred meeting date and time.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // POST /leads handles both creating new leads and updating existing leads by phone
      await axios.post(`${API_URL}/leads`, form);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  const filteredNationalities = NATIONALITIES.filter((n) =>
    n.toLowerCase().includes(nationalitySearch.toLowerCase())
  );

  const SERVICES = [
    { id: "dnv", name: "Digital Nomad Visa (DNV)" },
    { id: "nlv", name: "Non-Lucrative Visa (NLV)" },
    { id: "business", name: "Self-Employed / Business Residency" },
    { id: "study", name: "Study Visa" },
    { id: "tourist", name: "Tourist Visa (Schengen – Spain)" },
    { id: "sworn_translation", name: "Spanish Sworn Translation" }
  ];

  const APPLICANTS = [
    { value: "Main Only", label: "Main Applicant Only" },
    { value: "Main + 1", label: "Main + 1 Dependent" },
    { value: "Main + 2", label: "Main + 2 Dependents" },
    { value: "Main + 3", label: "Main + 3 Dependents" },
    { value: "Main + 4", label: "Main + 4 Dependents" },
    { value: "Main + 5", label: "Main + 5 Dependents" }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div style={{ width: "100%", maxWidth: "560px" }}>
        {/* Logo / Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              🌍
            </div>
            <span
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.5px",
              }}
            >
              AAA Visa
            </span>
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px",
              margin: 0,
            }}
          >
            Free Eligibility Consultation Booking
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px",
            padding: "36px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          }}
        >
          {/* ─── STEP 1: Unified Booking & Intake Form ─── */}
          {step === 1 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h2
                  style={{
                    color: "#fff",
                    fontSize: "22px",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Book Assessment 📅
                </h2>
                <button
                  type="button"
                  onClick={() => setLookupOpen(!lookupOpen)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#667eea",
                    fontSize: "13px",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontFamily: "inherit",
                  }}
                >
                  {lookupOpen ? "Cancel Autofill" : "Load My Details"}
                </button>
              </div>

              {lookupOpen && (
                <div
                  style={{
                    background: "rgba(102,126,234,0.1)",
                    border: "1px solid rgba(102,126,234,0.25)",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
                    Enter email to retrieve previously saved details:
                  </p>
                  <form onSubmit={handleLookup} style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={lookupEmail}
                      onChange={(e) => setLookupEmail(e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      style={{ ...btnPrimaryStyle, width: "auto", padding: "10px 16px" }}
                    >
                      {loading ? "Loading..." : "Autofill"}
                    </button>
                  </form>
                </div>
              )}

              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "14px",
                  margin: "0 0 28px",
                  lineHeight: 1.6,
                }}
              >
                Please provide your details and choose a convenient date/time for your Free 20-Minute Eligibility Assessment.
              </p>

              <form onSubmit={handleSubmit}>
                {/* Section: Personal Details */}
                <div style={sectionHeaderStyle}>📋 Your Details</div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>First Name *</label>
                    <input
                      required
                      value={form.firstName}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      placeholder="John"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name *</label>
                    <input
                      required
                      value={form.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      placeholder="Doe"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="you@example.com"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+971 50 123 4567"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                    marginBottom: "28px",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <label style={labelStyle}>Nationality *</label>
                    <input
                      type="text"
                      required
                      placeholder="Search nationality..."
                      value={form.nationality}
                      onChange={(e) => {
                        handleChange("nationality", e.target.value);
                        setNationalitySearch(e.target.value);
                        setShowNationalityDropdown(true);
                      }}
                      onFocus={() => setShowNationalityDropdown(true)}
                      onBlur={() => {
                        // Delay to allow onClick selection
                        setTimeout(() => setShowNationalityDropdown(false), 250);
                      }}
                      style={inputStyle}
                    />
                    {showNationalityDropdown && filteredNationalities.length > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          background: "#24243e",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: "10px",
                          maxHeight: "200px",
                          overflowY: "auto",
                          zIndex: 1000,
                          marginTop: "4px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                        }}
                      >
                        {filteredNationalities.map((n) => (
                          <div
                            key={n}
                            onClick={() => {
                              handleChange("nationality", n);
                              setNationalitySearch(n);
                              setShowNationalityDropdown(false);
                            }}
                            style={{
                              padding: "10px 14px",
                              color: "#fff",
                              cursor: "pointer",
                              fontSize: "14px",
                              borderBottom: "1px solid rgba(255,255,255,0.05)",
                              textAlign: "left",
                              transition: "background 0.2s ease"
                            }}
                            onMouseDown={() => {
                              handleChange("nationality", n);
                              setNationalitySearch(n);
                              setShowNationalityDropdown(false);
                            }}
                            onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.08)"}
                            onMouseLeave={(e) => e.target.style.background = "transparent"}
                          >
                            {n}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>Your Language</label>
                    <select
                      value={form.preferredLanguage}
                      onChange={(e) =>
                        handleChange("preferredLanguage", e.target.value)
                      }
                      style={{ ...inputStyle, color: "#fff" }}
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l} value={l} style={{ background: "#24243e", color: "#fff" }}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section: Visa Program */}
                <div style={sectionHeaderStyle}>✈️ Relocation Details</div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                    marginBottom: "28px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Visa Program of Interest</label>
                    <select
                      value={form.serviceId}
                      onChange={(e) =>
                        handleChange("serviceId", e.target.value)
                      }
                      style={{ ...inputStyle, color: "#fff" }}
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id} style={{ background: "#24243e", color: "#fff" }}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Total Applicants</label>
                    <select
                      value={form.applicantsCount}
                      onChange={(e) =>
                        handleChange("applicantsCount", e.target.value)
                      }
                      style={{ ...inputStyle, color: "#fff" }}
                    >
                      {APPLICANTS.map((a) => (
                        <option key={a.value} value={a.value} style={{ background: "#24243e", color: "#fff" }}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section: Meeting Preferences */}
                <div style={sectionHeaderStyle}>📅 Meeting Preferences</div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Preferred Meeting Date *</label>
                  <input
                    type="date"
                    required
                    min={today}
                    value={form.meetingPreferredDate}
                    onChange={(e) =>
                      handleChange("meetingPreferredDate", e.target.value)
                    }
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Preferred Time Slot *</label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <label
                        key={slot.value}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          cursor: "pointer",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: `1px solid ${form.meetingPreferredTime === slot.value ? "#667eea" : "rgba(255,255,255,0.15)"}`,
                          background:
                            form.meetingPreferredTime === slot.value
                              ? "rgba(102,126,234,0.2)"
                              : "transparent",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <input
                          type="radio"
                          name="timeSlot"
                          value={slot.value}
                          checked={form.meetingPreferredTime === slot.value}
                          onChange={(e) =>
                            handleChange("meetingPreferredTime", e.target.value)
                          }
                          style={{ accentColor: "#667eea" }}
                        />
                        <span style={{ color: "#fff", fontSize: "14px" }}>
                          {slot.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Consultation Language</label>
                  <select
                    value={form.meetingPreferredLanguage}
                    onChange={(e) =>
                      handleChange("meetingPreferredLanguage", e.target.value)
                    }
                    style={{ ...inputStyle, color: "#fff" }}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l} style={{ background: "#24243e", color: "#fff" }}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "28px" }}>
                  <label style={labelStyle}>
                    Your Questions / Goals (optional)
                  </label>
                  <textarea
                    value={form.meetingNotes}
                    onChange={(e) =>
                      handleChange("meetingNotes", e.target.value)
                    }
                    rows={3}
                    placeholder="What would you like to discuss? E.g. 'I want to know about DNV visa requirements for my family...'"
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: "80px",
                    }}
                  />
                </div>

                {error && <div style={errorStyle}>{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  style={btnPrimaryStyle}
                >
                  {loading
                    ? "Submitting..."
                    : "✅ Confirm My Booking Preferences"}
                </button>
              </form>
            </>
          )}

          {/* ─── STEP 2: Success ─── */}
          {step === 2 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
              <h2
                style={{
                  color: "#fff",
                  fontSize: "24px",
                  fontWeight: 800,
                  margin: "0 0 12px",
                }}
              >
                All Done!
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  margin: "0 0 28px",
                }}
              >
                Shukriya! Aapki details aur meeting preferences save ho gayi
                hain.
                <br />
                Hamari team jald hi aapse ek confirmed meeting time ke saath
                contact karegi.
              </p>
              <div
                style={{
                  background: "rgba(102,126,234,0.15)",
                  border: "1px solid rgba(102,126,234,0.4)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "13px",
                    margin: "0 0 4px",
                  }}
                >
                  What happens next:
                </p>
                <ul
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "14px",
                    margin: 0,
                    paddingLeft: "18px",
                    lineHeight: 2,
                  }}
                >
                  <li>Our team reviews your preferred time</li>
                  <li>A visa expert is assigned to your case</li>
                  <li>
                    You receive a WhatsApp/Email confirmation with meeting link
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.3)",
            fontSize: "12px",
            marginTop: "20px",
          }}
        >
          © 2026 AAA Visa Consultancy · All rights reserved
        </p>
      </div>
    </div>
  );
};

// ── Shared Styles ──
const labelStyle = {
  display: "block",
  color: "rgba(255,255,255,0.6)",
  fontSize: "12px",
  fontWeight: 600,
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease",
  fontFamily: "inherit",
};

const btnPrimaryStyle = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
  transition: "opacity 0.2s ease",
  fontFamily: "inherit",
};

const errorStyle = {
  background: "rgba(239,68,68,0.15)",
  border: "1px solid rgba(239,68,68,0.4)",
  borderRadius: "10px",
  color: "#fca5a5",
  padding: "10px 14px",
  fontSize: "13px",
  marginBottom: "16px",
};

const sectionHeaderStyle = {
  color: "rgba(255,255,255,0.5)",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "14px",
  paddingBottom: "8px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

export default LeadSelfFillForm;
