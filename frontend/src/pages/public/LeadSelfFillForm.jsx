import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const TIME_SLOTS = [
  { value: "morning", label: "🌅 Morning (9:00 AM – 12:00 PM)" },
  { value: "afternoon", label: "☀️ Afternoon (12:00 PM – 5:00 PM)" },
  { value: "evening", label: "🌙 Evening (5:00 PM – 8:00 PM)" },
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
  const [step, setStep] = useState(1); // 1: email lookup, 2: fill form, 3: success
  const [email, setEmail] = useState("");
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    nationality: "",
    preferredLanguage: "English",
    meetingPreferredDate: "",
    meetingPreferredTime: "",
    meetingPreferredLanguage: "English",
    meetingNotes: "",
  });

  const handleEmailLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${API_URL}/leads/find-by-email?email=${encodeURIComponent(email)}`,
      );
      const data = res.data;
      setLead(data);
      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        nationality: data.nationality || "",
        preferredLanguage: data.preferredLanguage || "English",
        meetingPreferredDate: data.meetingPreferredDate || "",
        meetingPreferredTime: data.meetingPreferredTime || "",
        meetingPreferredLanguage:
          data.meetingPreferredLanguage || data.preferredLanguage || "English",
        meetingNotes: data.meetingNotes || "",
      });
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Email not found. Please check and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.meetingPreferredDate || !form.meetingPreferredTime) {
      setError("Please select your preferred meeting date and time.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.patch(`${API_URL}/leads/${lead.id}/meeting-preference`, form);
      setStep(3);
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
          {/* Progress indicator */}
          {step < 3 && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
              {[1, 2].map((s) => (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background:
                      step >= s
                        ? "linear-gradient(90deg, #667eea, #764ba2)"
                        : "rgba(255,255,255,0.15)",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          )}

          {/* ─── STEP 1: Email Lookup ─── */}
          {step === 1 && (
            <>
              <h2
                style={{
                  color: "#fff",
                  fontSize: "22px",
                  fontWeight: 700,
                  margin: "0 0 8px",
                }}
              >
                Verify Your Email
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "14px",
                  margin: "0 0 28px",
                  lineHeight: 1.6,
                }}
              >
                Enter the email address you provided when you first contacted
                us. We'll load your profile automatically.
              </p>

              <form onSubmit={handleEmailLookup}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={inputStyle}
                  />
                </div>
                {error && <div style={errorStyle}>{error}</div>}
                <button
                  type="submit"
                  disabled={loading}
                  style={btnPrimaryStyle}
                >
                  {loading ? "Looking up..." : "Find My Profile →"}
                </button>
              </form>
            </>
          )}

          {/* ─── STEP 2: Fill Form ─── */}
          {step === 2 && lead && (
            <>
              <h2
                style={{
                  color: "#fff",
                  fontSize: "22px",
                  fontWeight: 700,
                  margin: "0 0 4px",
                }}
              >
                Welcome, {lead.firstName}! 👋
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "14px",
                  margin: "0 0 28px",
                  lineHeight: 1.6,
                }}
              >
                Please verify your details and tell us when you'd like to meet
                with our visa expert.
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
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name *</label>
                    <input
                      required
                      value={form.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Phone Number *</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+1 234 567 8900"
                    style={inputStyle}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                    marginBottom: "28px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Nationality</label>
                    <select
                      value={form.nationality}
                      onChange={(e) =>
                        handleChange("nationality", e.target.value)
                      }
                      style={inputStyle}
                    >
                      <option value="">Select...</option>
                      {NATIONALITIES.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Your Language</label>
                    <select
                      value={form.preferredLanguage}
                      onChange={(e) =>
                        handleChange("preferredLanguage", e.target.value)
                      }
                      style={inputStyle}
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l} value={l}>
                          {l}
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
                    style={inputStyle}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>
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
                    placeholder="What would you like to discuss? E.g. 'I want to know about DNV visa requirements for my family of 4...'"
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

          {/* ─── STEP 3: Success ─── */}
          {step === 3 && (
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
