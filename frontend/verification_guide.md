# AAA Business Consultancy CRM - Features Verification Guide

Aapne jo naye features add kiye hain, unhe browser me verify karne ke liye niche diye gaye steps ko follow karein.

---

## 1. Lead Ingestion Simulator Widget (Operations Test Tool)
* **Kahan check karein:** Dashboard (`/dashboard`)
* **Verifying Steps:**
  1. Top navbar me role switcher dropdown se **"Admin"** ya **"Operations"** role select karein.
  2. Sidebar se **Dashboard** open karein. Right side me **"Lead Ingestion Simulator"** card widget dikhai dega.
  3. Form fields fill karein:
     - **Candidate Full Name:** `Rahul Sharma` (ya koi bhi test name)
     - **Traffic Source:** `WhatsApp Campaign` (ya snapchat, tiktok etc.)
     - **Visa Pathway:** `Digital Nomad Visa (DNV)`
     - **Nationality & Market:** `United Kingdom (English)`
  4. **"Ingest Test Lead"** button click karein.
* **Expected Result:**
  - Screen par green color ka toast alert aayega: *"Test lead for Rahul Sharma successfully ingested!"*
  - **Recent Lead registrations** table automatically refresh hoga aur top par `Rahul Sharma` ka name show hoga.
  - Sidebar me **"Recent Live Activities"** panel me audit entry add ho jayegi: *"New Lead Added: Lead Rahul Sharma has been added..."*

---

## 2. Unified Social Chat Hub
* **Kahan check karein:** Sidebar -> Social Inbox (`/social-inbox`)
* **Verifying Steps:**
  1. Sidebar me **"Social Inbox"** link par click karein.
  2. Left panel me **WhatsApp, Facebook, Instagram, Telegram** tabs par click karke search/filtering test karein.
  3. Kisi chat (e.g., `Amelia Watson`) par click karein.
  4. Reply box me:
     - **Templates:** **"Quick Templates"** dropdown se **"Documents Request"** select karein. Input box me pre-filled message text auto-load ho jayega.
     - **Send Reply:** **"Send"** button click karein (ya keyboard par Enter press karein).
* **Expected Result:**
  - Aapka message chat screen ke right side me green (WhatsApp style) bubble me time stamp ke sath add ho jayega.
  - Send hone ke **1.5 seconds baad** client ki taraf se automated mock reply popup hogi: *"Thank you for the update! I will look into this and get back to you shortly."*

---

## 3. Consultation S3 Audio Player & Double Outcomes
* **Kahan check karein:** Sidebar -> Consultations (`/consultations`)
* **Verifying Steps:**
  1. Consultations list me kisi bhi **"Scheduled"** status wali meeting par click karein taaki details page open ho sake.
  2. Header me **"Mark Complete"** green button par click karein.
  3. Modal popup me ab aapko **dono outcome options** milenge:
     - **Client Requested Service (Assessment Start):** select `Study Visa`
     - **Recommended Spain Visa Pathway:** select `Digital Nomad Visa (DNV)`
     - **Notes:** enter some test comments.
  4. **"Submit Outcome"** button par click karein.
* **Expected Result:**
  - Status chip change hokar **"Completed"** ho jayegi.
  - Card title change hokar **"Automated Meeting Recording (AWS S3 Cloud)"** aayega.
  - Recording card me **play-pause button**, **volume slider**, aur **interactive timeline seek-bar** work karega (play karne par timeline time forward run hone lagegi).
  - Assessment Outcome section me dono selected values properly display ho jayengi:
    - *Client Requested Service:* Study Visa
    - *AAA Recommended Visa Pathway:* Digital Nomad Visa (DNV)

---

## 4. Compliance Check - Permanent Storage Locks
* **Kahan check karein:** Sidebar -> Documents (`/documents`) ya Client details profile file list.
* **Verifying Steps:**
  1. Kisi client ka profile details document center open karein jahan files list uploaded dikhti hain.
* **Expected Result:**
  - Kisi bhi list screen ya grid me se documents/files ke saamne se **"Delete" actions aur trash can buttons completely removed** hain, taaki compliance lock maintain rahe aur files delete na ki ja sakein.

---

## 5. Auto-Category Matcher
* **Kahan check karein:** Sidebar -> Documents (`/documents`) -> Upload files box.
* **Verifying Steps:**
  1. Apne laptop/desktop se ek file select karein jiska filename keywords match kare (e.g., `rahul_passport_copy.pdf` ya `bank_statement_2026.pdf`).
  2. File upload box me drag & drop ya select karein.
* **Expected Result:**
  - Upload details screen par file input block keyword recognize karke dropdown document type category ko automatically **"Passport"** ya **"Bank Statement"** select kar dega (no manual change needed).
