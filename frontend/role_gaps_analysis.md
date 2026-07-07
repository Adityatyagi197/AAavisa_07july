# CRM Role-by-Role & Menu-by-Menu Detailed Gap Analysis

Yeh document details me batata hai ki kis Role ke liye, kis Menu me kaun sa feature ya UI input add kiya jayega.

---

## 1. ADMIN ROLE (Sare Menus ka access)

### Menu: Settings
* **Auto-Routing rules Tab (NEW):** Settings page me ek naya tab aayega jahan Admin auto-routing rules set kar sakega (Jaise: Client country UK/US ho to default consultant Elena ya David selected ho).
* **Stripe Accounts Config (NEW):** settings me ek config form aayega toggle option ke sath taaki 2 Stripe accounts manage/switch kiye ja sakein.
* **Multi-channel setup form:** Naya profile form input aayega jahan Admin "2 Phone Numbers, 2 FB Page, 2 Instagram, 2 WhatsApp Business accounts" fill kar sakega.

### Menu: Reports
* **Consultant Commissions Tab (NEW):** Reports section me ek naya tab aayega jo case close status track karke (Default 10% commission calculation) pure team ka transaction payout dynamic tables show karega.

### Menu: Leads Details (Lead Conversion Modal)
* **Schengen Exemption filter:** Conversion click par code validation: agar target visa "Schengen Tourist Visa" (base price €400) hai, to package selection modal step force nahi hoga aur direct Invoice trigger hogi.

---

## 2. CONSULTANT ROLE

### Menu: Social Chat Hub (NEW SIDEBAR LINK)
* **Social Inbox Hub:** Ek new page template banega jo sidebar me Consultant ko link dikhayega. Is page me alag-alag sources (WhatsApp, FB Comments, Insta DM, etc.) se aane wale chats aur post comments ek clean message window layout list me aayenge aur dynamic message box se replies execute ho sakenge.

### Menu: Leads Details & Client Details
* **Quick templates dispatch box:** Ek chat/email sender input box lagaya jayega jahan pre-filled template message body choose karke client ko send logic execute kiya ja sake.
* **Communication Logs Tab (NEW):** Details section tabs me ek naya tab add hoga jahan direct WhatsApp dialogues messages (qualification questionnaire history Q1 & Q2 aur auto greetings response) historical logs flow visible honge.

### Menu: Consultation Details
* **AWS S3 Audio Player (NEW):** Complete consultation status hone par Zoom/Meet video data audio links AWS path use karenge aur play-pause timeline UI show karenge.
* **Double Outcome Fields:** Mark complete modal me do fields aayenge: "Client Requested Service" (kya manga) aur "AAA Recommended Pathway" (kya recommend kiya).

---

## 3. FINANCE ROLE

### Menu: Payments & Invoices
* **Link Wallet selector option:** Custom check triggers me payment gateway options me "Link Wallet" string option text push kiya jayega.
* **50% Refund T&C labels:** Invoices breakdown layout aur billing policies details sections me bold red/warning standard disclaimer note display aayega.
* **Itemized Discounts breakdowns:** Table price sections checks me:
  - Base fee: `€X`
  - Main applicant discount: `-€500`
  - Dependents discount: `-€(250 * N)`
  - VAT (5%)
  - Grand Total

### Menu: Invoice Details
* **Dunning Reminder logs (NEW):** Invoice panel me dynamic reminders status entries aayengi:
  - Reminder #1: Abandoned Checkout (Immediate)
  - Reminder #2: 24h follow up
  - Reminder #3: 2 Days follow up
  - Reminder #4: 5 Days (CEO Email with Special 24h Payout discount value).

---

## 4. OPERATIONS ROLE

### Menu: Dashboard (Lead Simulator)
* **Leads Ingestion Simulator Widget (NEW):** Dashboard ya Leads page par operations user ke liye test lead generator lagaya jayega jo alag-alag sources (TikTok ads, WhatsApp ads, snapchat etc.) se leads pipeline me trigger karega check operations testing ke liye.

### Menu: Documents & Review (Compliance checks)
* **CRITICAL COMPLIANCE FIX: Permanent storage locks:** Operations list screens aur Document Center grid me se saare "Delete" buttons remove kiye jayenge.
* **Auto-Category Regex Matcher:** Client/Operations user jab file upload select karega tab drag files title keyword automatic regex validation match trigger hoga (Jaise: `marcus_passport.pdf` automatic category "Passport" dropdown me default load ho jayegi).
