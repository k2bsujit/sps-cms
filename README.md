# SP Surya - PM Surya Ghar Solar Management & Quotation Portal

A modern web application built for **SP Surya Solar Solutions**, an empaneled solar rooftop vendor operating in Balasore, Bhadrak, and Mayurbhanj under the **PM Surya Ghar Muft Bijli Yojana** in Odisha.

---

## 🛠 Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **UI & Styling:** Tailwind CSS, Lucide React icons, shadcn/ui components
- **Database & ORM:** PostgreSQL with Prisma ORM
- **PDF Engine:** `@react-pdf/renderer` (Pixel-perfect 6-Page Corporate Proposal)
- **Excel Processor:** `xlsx` (SheetJS) for bidirectional Data Grid Export/Import

---

## 📋 Core Modules

### 1. Dynamic 6-Page Quotation Generator (`/quotation`)
- **Interactive Sizing & BOQ Engine:**
  - Standard 3 kW benchmark: 6x 580Wp Mono Half-Cut Bifacial TOPCon modules (3.48 kWp DC array).
  - 3.3 kW Gen 4 Smart On-Grid String Inverter with Wi-Fi telemetry.
  - 30m DC Solar Cable (4 sq.mm), 30m AC Cable, 3x Chemical Earthing pits, Copper Lightning Arrestor, HDGI 160 km/h Cyclone Structure.
- **Financial & Subsidy Architecture:**
  - Base Package: ₹1,42,857 + 5% GST (₹7,143) = ₹1,50,000 Grand Total.
  - Central DBT Subsidy: ₹78,000 (MNRE PM Surya Ghar).
  - Odisha State Additional Subsidy: up to ₹60,000 (₹20,000/kW).
  - Net Customer Out-of-Pocket Investment: ₹12,000.
- **6-Page Corporate PDF Layout:**
  - **Page 1:** SP Surya Branding, Site Coordinates, 3kW System Overview, Monthly Generation (~390 kWh) & Bill Savings.
  - **Page 2:** Mandatory PM Surya Ghar Documentation Rules in **English & Odia** (strict character matching on Aadhaar, Electricity Bill, Bank Passbook, PAN).
  - **Page 3:** Itemized BOQ Table (10 Line items) + Commercial Supply/Installation Costing & Subsidy Matrix.
  - **Page 4:** Milestone Payment Terms (₹10,000 Token, 75% Dispatch Advance, 25% Installation Day Balance) + Official SP Surya SBI Bank Details.
  - **Page 5:** TPNODL Execution Milestones, Demand Note (₹3,747 1-Phase / ₹4,334 3-Phase), Warranties (12/30-yr panels, 8-10 yr inverter, 5-yr free comprehensive AMC).
  - **Page 6:** 15-Point Vendor vs Client Responsibility Matrix & Contract Acceptance.

---

### 2. Post-Installation Customer Management Data Grid (`/installations`)
- **Excel-Style Data Grid:**
  - Customer Name, Contact Number, Location, District.
  - Project Size (kW), Brand (`WAAREE`, `TATA`, `ADANI`, `VIKRAM`), Phase (`Single Phase` / `Three Phase`).
  - Project Cost, GN Meter Inclusion (`Including cost`), Payment Type (`Cash`, `Loan SBI`, `Loan PNB`).
  - Demand Note Charges, Bank Quotation, Invoice Cost.
  - Subsidy Status (`Both Subsidy Came`, `Pending`, `Central Came`).
  - Installation Date, Meter Connection Date.
  - **Next Maintenance Date:** Auto-calculated **exactly 90 days** from Meter Connection Date for quarterly preventive visits.
  - Remarks.
- **Data Operations:**
  - Real-time search & multi-filtering (Location, Brand, Subsidy Status).
  - Add / Edit Customer Modal with auto-calculations.
  - 1-Click Excel Export (`.xlsx`).
  - Drag-and-Drop Bulk Excel Import with schema validator.

---

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.
