import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://aaa-consultancy-production.up.railway.app/api/v1";

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
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: unified form, 2: success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Optional lookup state
  const [lookupOpen, setLookupOpen] = useState(false);
  const [lookupEmail, setLookupEmail] = useState("");
  const [isExistingLead, setIsExistingLead] = useState(false);
  const [customizationSettings, setCustomizationSettings] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/settings/customization`)
      .then(res => {
        setCustomizationSettings(res.data);
      })
      .catch(err => console.error("Failed to load customization settings:", err));
  }, []);

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
    dependentsDetails: [],
    meetingPreferredDate: "",
    meetingPreferredTime: "",
    meetingPreferredLanguage: "English",
    meetingNotes: "",
  });

  const [nationalitySearch, setNationalitySearch] = useState("");
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);

  // Parse URL query parameters on mount to auto-populate fields or load from ID
  useEffect(() => {
    const searchString = window.location.search || (window.location.hash.includes("?") ? window.location.hash.split("?")[1] : "");
    const params = new URLSearchParams(searchString);
    const idParam = params.get("id") || "";
    const phoneParam = params.get("phone") || params.get("whatsapp") || "";
    const emailParam = params.get("email") || "";
    const serviceParam = params.get("service") || params.get("program") || "";
    const applicantsParam = params.get("applicants") || "";
    const nationalityParam = params.get("nationality") || "";

    if (idParam) {
      setLoading(true);
      axios.get(`${API_URL}/leads/${idParam}/public-details`)
        .then((res) => {
          const data = res.data;
          setForm((prev) => {
            const applicantsVal = data.applicantsCount || prev.applicantsCount;
            const count = getDepsCount(applicantsVal);
            const currentDeps = data.dependentsDetails || [];
            const initialDeps = [];
            for (let i = 0; i < count; i++) {
              initialDeps.push({
                firstName: currentDeps[i]?.firstName || "",
                lastName: currentDeps[i]?.lastName || "",
                relation: currentDeps[i]?.relation || "Spouse",
                passportNumber: currentDeps[i]?.passportNumber || "",
                nationality: currentDeps[i]?.nationality || ""
              });
            }
            return {
              ...prev,
              id: data.id,
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || "",
              phone: data.phone || "",
              nationality: data.nationality || "",
              preferredLanguage: data.preferredLanguage || "English",
              serviceId: data.serviceType || "dnv",
              applicantsCount: applicantsVal,
              dependentsDetails: initialDeps,
              meetingPreferredDate: data.meetingPreferredDate || "",
              meetingPreferredTime: data.meetingPreferredTime || "",
              meetingPreferredLanguage: data.meetingPreferredLanguage || data.preferredLanguage || "English",
              meetingNotes: data.meetingNotes || "",
            };
          });
          if (data.nationality) {
            setNationalitySearch(data.nationality);
          }
          setIsExistingLead(true);
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Invalid or expired booking link.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setForm((prev) => {
        const applicantsVal = applicantsParam ? decodeURIComponent(applicantsParam).trim() : prev.applicantsCount;
        const count = getDepsCount(applicantsVal);
        const initialDeps = [];
        for (let i = 0; i < count; i++) {
          initialDeps.push({ firstName: "", lastName: "", relation: "Spouse", passportNumber: "", nationality: "" });
        }
        
        return {
          ...prev,
          phone: phoneParam ? decodeURIComponent(phoneParam).trim() : prev.phone,
          email: emailParam ? decodeURIComponent(emailParam).trim() : prev.email,
          serviceId: serviceParam ? decodeURIComponent(serviceParam).trim() : prev.serviceId,
          applicantsCount: applicantsVal,
          dependentsDetails: initialDeps,
          nationality: nationalityParam ? decodeURIComponent(nationalityParam).trim() : prev.nationality,
        };
      });
      if (nationalityParam) {
        setNationalitySearch(decodeURIComponent(nationalityParam).trim());
      }
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

  const getDepsCount = (countStr) => {
    if (!countStr || countStr === 'Main Only') return 0;
    const numericVal = parseInt(countStr, 10);
    if (!isNaN(numericVal) && String(numericVal) === countStr.trim()) {
      return Math.max(0, numericVal - 1);
    }
    const match = countStr.match(/Main\s*\+\s*(\d+)/i);
    if (match) {
      return parseInt(match[1], 10);
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      setError("Please fill in all required personal details (Name, Email, Phone).");
      return;
    }
    if (form.serviceId === "sworn_translation") {
      navigate("/public/translation", { state: { prefilledLead: form } });
      return;
    }
    if (!form.meetingPreferredDate || !form.meetingPreferredTime) {
      setError("Please select your preferred meeting date and time.");
      return;
    }
    const flowSettings = customizationSettings?.flowAutomationSettings || {};
    const selectTime = form.meetingPreferredTime;
    const allowedStart = flowSettings.bookingAllowedStart || '09:00';
    const allowedEnd = flowSettings.bookingAllowedEnd || '18:00';
    if (selectTime && (selectTime < allowedStart || selectTime > allowedEnd)) {
      setError(`Preferred meeting time must be between ${allowedStart} and ${allowedEnd}.`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isExistingLead && form.id) {
        await axios.patch(`${API_URL}/leads/${form.id}/meeting-preference`, form);
      } else {
        await axios.post(`${API_URL}/leads`, form);
      }
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
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "applicantsCount") {
        const count = getDepsCount(value);
        const currentDeps = prev.dependentsDetails || [];
        const newDeps = [];
        for (let i = 0; i < count; i++) {
          newDeps.push({
            firstName: currentDeps[i]?.firstName || "",
            lastName: currentDeps[i]?.lastName || "",
            relation: currentDeps[i]?.relation || "Spouse",
            passportNumber: currentDeps[i]?.passportNumber || "",
            nationality: currentDeps[i]?.nationality || "",
            age: currentDeps[i]?.age || ""
          });
        }
        updated.dependentsDetails = newDeps;
      }
      return updated;
    });
  };

  const handleDependentChange = (index, field, value) => {
    setForm((prev) => {
      const updatedDeps = [...prev.dependentsDetails];
      updatedDeps[index] = { ...updatedDeps[index], [field]: value };
      return { ...prev, dependentsDetails: updatedDeps };
    });
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
              </div>

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
                      disabled={isExistingLead}
                      style={{
                        ...inputStyle,
                        background: isExistingLead ? "rgba(255, 255, 255, 0.03)" : inputStyle.background,
                        color: isExistingLead ? "rgba(255, 255, 255, 0.4)" : inputStyle.color,
                        border: isExistingLead ? "1px solid rgba(255, 255, 255, 0.08)" : inputStyle.border,
                        cursor: isExistingLead ? "not-allowed" : "text"
                      }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name *</label>
                    <input
                      required
                      value={form.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      placeholder="Doe"
                      disabled={isExistingLead}
                      style={{
                        ...inputStyle,
                        background: isExistingLead ? "rgba(255, 255, 255, 0.03)" : inputStyle.background,
                        color: isExistingLead ? "rgba(255, 255, 255, 0.4)" : inputStyle.color,
                        border: isExistingLead ? "1px solid rgba(255, 255, 255, 0.08)" : inputStyle.border,
                        cursor: isExistingLead ? "not-allowed" : "text"
                      }}
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
                      disabled={isExistingLead}
                      style={{
                        ...inputStyle,
                        background: isExistingLead ? "rgba(255, 255, 255, 0.03)" : inputStyle.background,
                        color: isExistingLead ? "rgba(255, 255, 255, 0.4)" : inputStyle.color,
                        border: isExistingLead ? "1px solid rgba(255, 255, 255, 0.08)" : inputStyle.border,
                        cursor: isExistingLead ? "not-allowed" : "text"
                      }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+971 50 123 4567"
                      disabled={isExistingLead}
                      style={{
                        ...inputStyle,
                        background: isExistingLead ? "rgba(255, 255, 255, 0.03)" : inputStyle.background,
                        color: isExistingLead ? "rgba(255, 255, 255, 0.4)" : inputStyle.color,
                        border: isExistingLead ? "1px solid rgba(255, 255, 255, 0.08)" : inputStyle.border,
                        cursor: isExistingLead ? "not-allowed" : "text"
                      }}
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
                      onFocus={() => !isExistingLead && setShowNationalityDropdown(true)}
                      onBlur={() => {
                        // Delay to allow onClick selection
                        setTimeout(() => setShowNationalityDropdown(false), 250);
                      }}
                      disabled={isExistingLead}
                      style={{
                        ...inputStyle,
                        background: isExistingLead ? "rgba(255, 255, 255, 0.03)" : inputStyle.background,
                        color: isExistingLead ? "rgba(255, 255, 255, 0.4)" : inputStyle.color,
                        border: isExistingLead ? "1px solid rgba(255, 255, 255, 0.08)" : inputStyle.border,
                        cursor: isExistingLead ? "not-allowed" : "text"
                      }}
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

                {form.dependentsDetails && form.dependentsDetails.length > 0 && (
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "14px",
                      padding: "20px",
                      marginBottom: "24px",
                    }}
                  >
                    <div style={{ ...sectionHeaderStyle, borderBottom: "none", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      👨‍👩‍👧‍👦 Dependent Details
                    </div>
                    {form.dependentsDetails.map((dep, idx) => (
                      <div
                        key={idx}
                        style={{
                          marginBottom: idx === form.dependentsDetails.length - 1 ? 0 : "20px",
                          borderBottom: idx === form.dependentsDetails.length - 1 ? "none" : "1px dashed rgba(255, 255, 255, 0.1)",
                          paddingBottom: idx === form.dependentsDetails.length - 1 ? 0 : "20px",
                        }}
                      >
                        <div style={{ color: "#a0aec0", fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>
                          Dependent #{idx + 1}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                          <div>
                            <label style={labelStyle}>First Name *</label>
                            <input
                              required
                              value={dep.firstName}
                              onChange={(e) => handleDependentChange(idx, "firstName", e.target.value)}
                              placeholder="First Name"
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Last Name *</label>
                            <input
                              required
                              value={dep.lastName}
                              onChange={(e) => handleDependentChange(idx, "lastName", e.target.value)}
                              placeholder="Last Name"
                              style={inputStyle}
                            />
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr", gap: "10px" }}>
                          <div>
                            <label style={labelStyle}>Relation *</label>
                            <select
                              value={dep.relation}
                              onChange={(e) => handleDependentChange(idx, "relation", e.target.value)}
                              style={{ ...inputStyle, color: "#fff" }}
                            >
                              <option value="Spouse" style={{ background: "#24243e" }}>Spouse</option>
                              <option value="Child" style={{ background: "#24243e" }}>Child</option>
                              <option value="Parent" style={{ background: "#24243e" }}>Parent</option>
                              <option value="Other" style={{ background: "#24243e" }}>Other</option>
                            </select>
                          </div>
                          <div>
                            <label style={labelStyle}>Passport Number</label>
                            <input
                              value={dep.passportNumber}
                              onChange={(e) => handleDependentChange(idx, "passportNumber", e.target.value)}
                              placeholder="Optional"
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Age *</label>
                            <input
                              type="number"
                              required
                              min="0"
                              max="120"
                              value={dep.age || ""}
                              onChange={(e) => handleDependentChange(idx, "age", e.target.value)}
                              placeholder="Age"
                              style={inputStyle}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Section: Meeting Preferences */}
                {form.serviceId !== "sworn_translation" && (
                  <>
                    <div style={sectionHeaderStyle}>📅 Meeting Preferences</div>

                    <div style={{ marginBottom: "14px" }}>
                      <label style={labelStyle}>Preferred Meeting Date *</label>
                      <input
                        type="date"
                        required={form.serviceId !== "sworn_translation"}
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
                      <input
                        type="time"
                        required={form.serviceId !== "sworn_translation"}
                        value={form.meetingPreferredTime}
                        onChange={(e) =>
                          handleChange("meetingPreferredTime", e.target.value)
                        }
                        style={{ ...inputStyle, color: "#fff" }}
                      />
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
                  </>
                )}

                {error && <div style={errorStyle}>{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  style={btnPrimaryStyle}
                >
                  {loading
                    ? "Submitting..."
                    : form.serviceId === "sworn_translation"
                    ? "✅ Proceed to Sworn Translation Quote"
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
