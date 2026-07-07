AAA Business Consultancy CRM — Complete Flow & Functional Specification Manual
This document provides a highly detailed functional specification and flow analysis of the AAA Business Consultancy CRM system. It describes the precise behavior of every single menu item, step-by-step user interface actions, calculations, components, and the exact changes implemented in source files.

📁 1. Frontend File Layout & Architecture Overview
The frontend codebase is a React application built with the following structure under /src:


src/
├── components/           # Reusable UI Controls (AppTable, AppModal, StatCard, StatusBadge, PageHeader)
├── constants/            # Static data structures & visa services configurations (mockData.js)
├── contexts/             # Global React Contexts (AuthContext.jsx, AlertContext.jsx)
├── hooks/                # Custom React Hooks (useAuth.js)
├── layouts/              # Screen skeletons (DashboardLayout.jsx, AuthLayout.jsx)
├── pages/                # Operational Views grouped by feature directories:
│   ├── auth/             # Login, ForgotPassword, ResetPassword
│   ├── dashboard/        # Role-specific dashboards (SuperAdmin, Admin, Operations, Agent, Finance, Marketing)
│   ├── leads/            # SuperAdminLeadList, SuperAdminLeadDetails, AdminLeadList, AdminLeadDetails
│   ├── clients/          # Client lists, profile editors, document verification
│   ├── consultations/    # Consultation list, Calendar, meeting details
│   ├── team/             # Agents directories, performance logs, customization screens
│   ├── social/           # Live chat window, templates dispatcher
│   ├── marketing/        # Campaigns list, exports
│   ├── settings/         # Payment gateways, tax configs, SuperAdminCustomization
│   └── integrations/     # WhatsApp API, ChatGPT, AWS setups
├── routes/               # Routing configurations (AppRoutes.jsx)
└── services/             # Simulated Database and state methods (dbService.js)
📋 2. Comprehensive Menu-by-Menu Feature Specifications
Here is how every single sidebar menu item functions in the UI, including buttons, modals, and operational calculations:

1. Dashboard (/dashboard)
Behavior: Dynamically maps to the user's role prefix dashboard:
Super Admin Dashboard: Displays overall business analytics (monthly conversions, lead distributions, consultant performance lists).
Admin / Operations Dashboard: Focuses on operational metrics (pending assignments, active client counts, documents awaiting checks).
Agent Dashboard: Shows personal commission rates, upcoming meetings calendar widgets, and performance metrics (conversion ratios).
Finance Dashboard: Visualizes transaction gateway metrics (Stripe vs Apple Pay), invoicing schedules, and outstanding balances.
Marketing Dashboard: Shows lead acquisition funnels, campaign counts, and conversions per channel.
Interactive Cards: Clicking on any statistical card (e.g. "Pending Payments") navigates the user to the corresponding sub-list (e.g. Invoices List) with appropriate filters auto-applied.
2. Agents Directory (/[role-prefix]/agents)
Behavior: Renders the directory list of all consultant agents and administrators.
Core UI Elements:
Add Agent Button: Opens a form modal to enter Agent Name, Email, Commission Rate (0% to 100%), Profile Avatar URL, and Role selection (Admin, Operations, Consultant, Finance, Marketing).
Custom Permissions Action: Opens the dynamic override modal (SuperAdminAgents.jsx) where the Super Admin can toggle individual menus and dashboard cards.
Visual Highlights: Purple labels indicate "Custom" overrides, with glow borders surrounding the agent's grid card or row.
3. Leads (/[role-prefix]/leads)
Behavior: Contains the list of all prospective immigration candidates.
Core Actions:
Add Lead Button: Opens a yup-validated form to input personal, nationality, preferred language, target visa, and acquisition channel data.
Assign Agent Button (Admins & Operations only): Opens a selection modal to assign or reallocate the lead to a specific consultant.
View Details Action: Redirects to the Lead Details page (blocked for Marketing).
Lead Details Views:
Overview Tab: Shows personal contact info and notes.
Meetings Tab: Lists consultation logs and includes a booking form.
Billing Tab: Displays invoiced retainer records.
Timeline Tab: Audit log of all events (e.g., "Carlos reassigned lead to Sofia").
4. Consultations / Calendar (/[role-prefix]/consultations/calendar)
Behavior: A calendar workspace rendering booked slots.
Core Actions:
Clicking a calendar cell opens the schedule slot modal.
Allows choosing a time slot, assigning the customer, selecting the agent, and setting meeting options.
Navigates to Consultation Details where meeting notes can be saved.
5. Clients (/[role-prefix]/clients)
Behavior: Lists active paying clients.
Stage Representation: Includes status badges representing:
Waiting for Payment: Retainer invoice is pending.
Under Process: Invoice is paid; document upload is active.
Approved: Visa approved.
Rejected: Visa rejected by authorities.
6. Doc Verification (/[role-prefix]/documents/verify)
Behavior: Operations check center.
Actions:
Displays uploaded files (Passport, remote employment documents, bank records).
Approve Button: Marks the document status as verified.
Reject Button: Prompts for feedback comment, sets status to "Action Required", and alerts the client in their portal.
7. Finance (/payments / /finance/payments)
Behavior: Financial workspace.
Core Actions:
Create Invoice: Standard invoice generator.
Refund & Commissions Hub: Displays the Dispatch Refund dashboard.
Dispatch Refund Button: Reverses 50% of the paid fee for rejected visas.
🧮 3. Detailed Calculations & Calculations Models
The CRM features automated models for payments, package add-ons, and refund transactions:

1. Relocation Packages Pricing Model
When a lead is converted to a client, the invoice amount is generated according to this formula:

$$\text{Invoice Amount} = \text{Base Price} + \text{Addon Price} - \text{Total Discount}$$

Where:

Base Price: Set by the target visa service:
Digital Nomad Visa (DNV): €1,500
Golden Visa: €4,000
Non-Lucrative Visa: €1,200
Student Visa: €800
Schengen Tourist Visa: €400 (Relocation package selections are disabled for tourist visas).
Relocation Addon:
Residency Processing Only: €0
Residency + Relocation Assistance: €700
Applicant Discounts:
Main Applicant: €500 discount (only applicable on Residency + Relocation premium package).
Dependents: €250 discount per dependent.
2. Payout & Agent Commission Model
Agent commissions are calculated on a per-invoice basis when client payments change:

$$\text{Earned Commission} = \text{Net Invoice Amount Paid} \times \left( \frac{\text{Agent Commission Rate}}{100} \right)$$

Commissions are dynamically updated in the agent's dashboard as soon as payments are cleared.
🔧 4. Deep-Dive Source Code Customization Details
Here are the precise details of how the bugs and loop errors were resolved across the codebase files:

1. The Redirection Loop / Route Guard Flicker (AppRoutes.jsx)
The Bug: If a page was dynamically forbidden for a user's role (or their custom overrides), the redirect guard threw them back to /dashboard. But since /dashboard resolves to the prefix landing path, it caused continuous route shifts and loop flickering.
The Fix: Refactored ProtectedRoute to redirect to the first allowed menu path (getDynamicRedirectPath) based on the user's custom settings. Introduced getPrefixForRole helper to ensure correct prefix matching:
js

const getPrefixForRole = (role) => {
  if (!role) return 'super_admin';
  if (role === 'consultant') return 'agent';
  if (role === 'marketing') return 'marketing-manager';
  return role;
};
2. Marketing Manager Prefix Realignment (AppRoutes.jsx, Dashboard.jsx)
The Bug: Routing structure had conflicting prefix targets /marketing/dashboard and /marketing/marketing, which collided with the /marketing feature page.
The Fix: Renamed all marketing routes to use the /marketing-manager/ prefix.
diff

- path="/marketing/dashboard"
+ path="/marketing-manager/dashboard"
- path="/marketing/leads"
+ path="/marketing-manager/leads"
- path="/marketing/marketing"
+ path="/marketing-manager/marketing"
Updated Dashboard.jsx getRolePrefix helper to map isMarketing strictly to 'marketing-manager', which resolves login-landing loop flickering.
3. Lead Details Crash Resolved (AdminLeadDetails.jsx & SuperAdminLeadDetails.jsx)
The Bug: Accessing the lead details page as marketing or other roles resulted in a blank screen. This was caused by two issues:
ForumIcon was used in Tab 5 but not imported at the top of the files.
liveReplyText state was referenced in the chat textarea binding but was never defined.
The Fix: Added the missing import and state hooks in both components:
js

import ForumIcon from '@mui/icons-material/Forum';
// ...
const [liveReplyText, setLiveReplyText] = useState('');
4. Marketing Role Access Restrictions (AdminLeadList.jsx)
The Bug: Marketing executives could click through and read internal logs and chat records of candidate leads.
The Fix: Checked user role inside the leads table; row-clicks and eye action buttons are disabled for marketing users:
js

onRowClick={currentUser?.role === 'marketing' ? null : (row) => navigate(`/leads/details/${row.id}`)}
Modified /marketing-manager/leads/details/:id route guard in AppRoutes.jsx to restrict access strictly to super_admin.