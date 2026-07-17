import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://aaa-consultancy-production.up.railway.app/api/v1';

const LANGUAGES = [
  { value: 'English', label: 'English 🇺🇸' },
  { value: 'Arabic', label: 'Arabic 🇦🇪' },
  { value: 'French', label: 'French 🇫🇷' },
  { value: 'Urdu', label: 'Urdu 🇵🇰' }
];

const SwornTranslationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefilled = location.state?.prefilledLead || {};

  const [formData, setFormData] = useState({
    firstName: prefilled.firstName || '',
    lastName: prefilled.lastName || '',
    email: prefilled.email || '',
    phone: prefilled.phone || '',
    nationality: prefilled.nationality || '',
    sourceLanguage: 'English',
    targetLanguage: 'Spanish'
  });

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all personal details first.');
      return;
    }
    if (!file) {
      setError('Please upload a PDF document.');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('document', file);

    try {
      setStatus('loading');
      setError(null);
      
      const res = await axios.post(`${API_URL}/booking/translation/upload`, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setQuote(res.data.data);
        setStatus('success');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setError(err.response?.data?.message || 'Failed to upload and calculate document words.');
    }
  };

  const handleProceed = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all personal details first.');
      return;
    }
    if (!quote) return;
    if (!file) {
      setError('Please upload a PDF document.');
      return;
    }

    try {
      setStatus('loading');
      setError(null);

      const formDataCheckout = new FormData();
      formDataCheckout.append('document', file);
      formDataCheckout.append('firstName', formData.firstName);
      formDataCheckout.append('lastName', formData.lastName);
      formDataCheckout.append('email', formData.email);
      formDataCheckout.append('phone', formData.phone);
      formDataCheckout.append('nationality', formData.nationality);
      formDataCheckout.append('sourceLanguage', formData.sourceLanguage);
      formDataCheckout.append('targetLanguage', formData.targetLanguage);
      formDataCheckout.append('wordCount', quote.wordCount);
      formDataCheckout.append('estimatedPrice', quote.estimatedPrice);

      const res = await axios.post(`${API_URL}/booking/translation/checkout`, formDataCheckout, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success && res.data.data.paymentUrl) {
        window.location.href = res.data.data.paymentUrl;
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setError(err.response?.data?.message || 'Failed to initialize payment checkout.');
    }
  };

  return (
    <div style={wrapperStyle}>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div style={{ width: '100%', maxWidth: '600px' }}>
        {/* Header Block */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
              }}
            >
              🌍
            </div>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.5px',
              }}
            >
              AAA Visa
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>
            Certified Spanish Sworn Translation
          </p>
        </div>

        {/* Card Panel */}
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 6px' }}>
              Sworn Translation Quote
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>
              Upload your PDF document to get an instant word count and estimated price.
            </p>
          </div>

          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Grid: First Name & Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Grid: Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Grid: Nationality & Source Language */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  placeholder="Search nationality..."
                  value={formData.nationality}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Source Language *</label>
                <select
                  name="sourceLanguage"
                  value={formData.sourceLanguage}
                  onChange={handleInputChange}
                  style={{ ...inputStyle, color: '#fff' }}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value} style={{ background: '#24243e', color: '#fff' }}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Language (Static Spanish) */}
            <div>
              <label style={labelStyle}>Target Language</label>
              <input
                type="text"
                readOnly
                value="Spanish (Español) 🇪🇸"
                style={{
                  ...inputStyle,
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: 'rgba(255, 255, 255, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            {/* File Upload Box */}
            <div>
              <label style={labelStyle}>Upload PDF Document *</label>
              <input
                type="file"
                accept="application/pdf"
                required
                onChange={handleFileChange}
                style={{
                  ...inputStyle,
                  padding: '8px 12px',
                  cursor: 'pointer'
                }}
              />
            </div>

            <div style={{ paddingTop: '10px' }}>
              <button
                type="submit"
                disabled={status === 'loading' || !file}
                style={btnPrimaryStyle}
              >
                {status === 'loading' ? 'Calculating words...' : '🔍 Get Instant Quote'}
              </button>
            </div>
          </form>

          {status === 'error' && (
            <div style={errorCardStyle}>
              <p style={{ color: '#ff8a8a', fontSize: '13px', margin: 0, fontWeight: 600 }}>
                ⚠️ {error}
              </p>
            </div>
          )}

          {status === 'success' && quote && (
            <div style={successCardStyle}>
              <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: '0 0 16px', textAlign: 'center' }}>
                📊 Your Estimated Quote
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Word Count</span>
                  <span style={{ color: '#fff', fontSize: '20px', fontWeight: 800 }}>{quote.wordCount} words</span>
                </div>
                <div style={{ textAlign: 'center', background: 'rgba(56, 239, 125, 0.06)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56, 239, 125, 0.2)' }}>
                  <span style={{ display: 'block', color: 'rgba(56, 239, 125, 0.7)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Estimated Price</span>
                  <span style={{ color: '#38ef7d', fontSize: '20px', fontWeight: 800 }}>
                    {new Intl.NumberFormat('en-IE', { style: 'currency', currency: quote.currency }).format(quote.estimatedPrice)}
                  </span>
                </div>
              </div>
              <div>
                <button
                  onClick={handleProceed}
                  style={btnCheckoutStyle}
                >
                  💳 Proceed with Payment (Stripe Checkout)
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '20px' }}>
          © 2026 AAA Visa Consultancy · All rights reserved
        </p>
      </div>
    </div>
  );
};

// ── Theme Style Definitions (Twin to Intake Form) ──
const wrapperStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  fontFamily: "'Inter', sans-serif"
};

const cardStyle = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '20px',
  padding: '36px',
  boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  color: 'rgba(255,255,255,0.6)',
  fontSize: '12px',
  fontWeight: 600,
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease',
  fontFamily: 'inherit'
};

const btnPrimaryStyle = {
  width: '100%',
  padding: '14px',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'opacity 0.2s ease'
};

const btnCheckoutStyle = {
  width: '100%',
  padding: '14px',
  background: 'linear-gradient(135deg, #11998e, #38ef7d)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'opacity 0.2s ease'
};

const errorCardStyle = {
  background: 'rgba(239, 68, 68, 0.12)',
  border: '1px solid rgba(239, 68, 68, 0.35)',
  borderRadius: '10px',
  padding: '12px 16px',
  marginTop: '16px'
};

const successCardStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '14px',
  padding: '20px',
  marginTop: '24px'
};

export default SwornTranslationForm;
