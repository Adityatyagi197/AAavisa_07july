# AAA Business Consultancy CRM - Portal Roles & Complete Workflow

Based on your client's requirements, I have analyzed the entire flow and mapped it to the 6 portals you mentioned (`Superadmin`, `Admin`, `Agent`, `Finance`, `Operations`, `Marketing`). 

Below is a detailed breakdown of what each portal does, its roles, and how the client's 11-Phase workflow operates within your system.

---

## 1. Portals Overview & Roles

### 1. Superadmin Portal
**Role:** Complete system oversight and configuration.
* **Responsibilities:**
  * Manage users (Create/Edit/Delete Admins, Agents, Finance, Operations, Marketing).
  * Configure system-wide settings (Pricing, packages, translation rate per word).
  * Define global policies (e.g., 10-minute No-Show policy).
  * Integrate third-party systems (Payment gateways, WhatsApp API, Cloud storage for recordings).
  * Full access to all data, dashboards, and override capabilities.

### 2. Admin Portal
**Role:** Day-to-day management and supervision.
* **Responsibilities:**
  * Oversee all departments (Agents, Operations, Finance, Marketing).
  * Manually assign leads/consultations to Agents (if not automated).
  * Approve complex cases, refunds, and appeals.
  * View comprehensive analytics (Lead conversions, team performance, overall revenue).
  * Override CRM lead statuses manually when exceptions occur.

### 3. Agent Portal (Consultant)
**Role:** Direct client consultation and assessment.
* **Responsibilities:**
  * View assigned consultations in the calendar (client details visible, contact info hidden pre-consultation).
  * Conduct the eligibility assessment (meeting recorded automatically).
  * Mark consultation outcome: `COMPLETED` or `NO SHOW`.
  * If completed, submit assessment details: Eligibility, Recommended Service, Package, and internal notes.
  * Resubmission triggering (recommending resubmissions or appeals after refusal).

### 4. Finance Portal
**Role:** Revenue, invoicing, and refund management.
* **Responsibilities:**
  * Track successful and pending payments.
  * Generate and manage invoices/receipts.
  * Handle the "Refund Workflow": Reviewing, approving, and completing refunds based on the company policy.
  * Monitor payment gateways (Apple Pay, Google Pay, Tabby, Tamara, etc.).

### 5. Operations Portal (Case Specialists / Lawyers)
**Role:** Case processing, document review, and government submission.
* **Responsibilities:**
  * Access the Document Portal to review client-uploaded documents.
  * Update statuses: `Documents Under Review`, `Additional Documents Required`, `Ready to Submit`.
  * Manage government submissions and Embassy/BLS appointments.
  * Handle Post-Approval administrative support (Premium Packages).
  * Manage Resubmission & Appeal workflows (Lawyer assignments, appeal deadlines).

### 6. Marketing Portal
**Role:** Lead generation, tracking, and promotions.
* **Responsibilities:**
  * Track lead sources (FB Ads, TikTok Ads, WhatsApp API, etc.).
  * Manage Automated First Responses for DMs and Comments.
  * Monitor lead temperatures (Hot, Warm, Cold).
  * Configure automated discounts (e.g., the Day 5 discount email from the CEO).

---

## 2. Workflow Execution (Phase by Phase Mapping)

Does the client requirement fit into this 6-portal structure? **Yes, perfectly.** Here is how the flow works across the portals.

### PHASE 1: Lead Generation & Auto-Response
* **Flow:** Leads come in via various sources. An automated WhatsApp link is sent.
* **Portal:** **Marketing** tracks the sources. The system (backend) handles the automated response.

### PHASE 2 & 3: Assessment Booking & Confirmation
* **Flow:** Client booked via the WhatsApp link. Fills the form (Service type, applicants, language). System prevents duplicate bookings or re-bookings for past No-Shows.
* **Portal:** **System Automation** handles reminders (24h, 1h, 10m). **Admin** can oversee all bookings. 
* *Translation Exception:* If service 6 (Translation) is selected, the system auto-calculates words/price. **Finance** tracks the immediate payment for translation.

### PHASE 4: Consultant Assignment
* **Flow:** Assignment based on Nationality, Language, Service, Time. 
* **Portal:** **Agent** portal calendar updates automatically. **Admin** has the power to re-assign manually if needed. 

### PHASE 5 & 6: Consultation & Outcome
* **Flow:** Agent conducts the meeting. 
* **Portal:** **Agent** uses action buttons (`COMPLETED` or `NO SHOW`). 
  * If `NO SHOW`: System tags client as Not Interested, sends cancellation email. 
  * If `COMPLETED`: Agent fills the Eligibility form.

### PHASE 7: Post-Consultation (Package Selection)
* **Flow:** Client receives a comparison table of packages based on the Agent's recommendation. System calculates the final price based on the number of applicants.

### PHASE 8 & 9: Payment Process & Success
* **Flow:** Client receives payment link with Terms & Conditions checkbox. Upon success, client gets dashboard access to upload documents.
* **Portal:** **Finance** monitors the payment. **Operations** is notified once the payment is successful and the client starts uploading documents.

### PHASE 10: Payment Not Completed
* **Flow:** Automated reminders sent over 5 days. Day 5 includes a special discount. 
* **Portal:** **Marketing** oversees the discount campaigns. **Agent/Admin** sees the client status as `Waiting for Payment`.

### PHASE 11: CRM Status Management & Operations
* **Flow:** The core processing phase. Client uploads docs permanently. 
* **Portal:** **Operations** takes over here. They review docs, request missing ones, and submit the application. They update statuses (`Under Government Review`, `Visa Approved`, `Visa Refused`).
* **AI Assistant:** Available in the **Agent, Admin, and Operations** portals to quickly summarize the case, check missing requirements, and predict success probability (hidden from the client).
* **Resubmission/Appeal:** If refused, **Agent or Operations** initiates the Resubmission or Appeal option. Case history is preserved under the same Client ID.
* **Refund:** If applicable, **Finance** handles the refund statuses (`Refund Under Review` -> `Completed`).

---

## 3. UI/UX Checklist (Based on Client Requirements)

To ensure your UI fulfills exactly what the client asked for, verify these specific features exist in your designs/code:

1. **One-Time Booking Link:** Ensure the booking link expires/locks after use or if the user is marked as a "No Show" (locking via Email/Name/Phone).
2. **Consultant View Restrictions:** The Agent's UI must hide the client's email and phone number *before* the consultation.
3. **Meeting Action Buttons:** The Agent's UI during/after a meeting must have strictly two main outcome buttons: `COMPLETED` and `NO SHOW`.
4. **Translation Word Calculator:** The booking form needs dynamic calculation logic for Sworn Translation (Service 6).
5. **Client Dashboard (Document Portal):** 
   * Must have a non-deletable upload system.
   * Auto-categorization of documents.
6. **AI Assistant Sidebar/Button:** The UI for internal staff (Agents/Admin/Ops) needs an "AI Summary" button that triggers a pop-up or side-panel showing the specific bullet points requested (Client Objective, Missing Requirements, Probability of Success, etc.).
7. **Case History Preservation:** The CRM UI should show multiple application cycles (Application 1, Application 2) under a single Client Profile without creating duplicate leads.
8. **Manual Status Override:** A `[+]` button in the UI for staff to manually change lead statuses.
