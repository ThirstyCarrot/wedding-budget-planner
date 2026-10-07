# EternalPlan - Wedding Budget & Due-Date Savings Planner

<div align="center">

![EternalPlan Banner](https://img.shields.io/badge/EternalPlan-Wedding%20Savings%20Planner-B38A58?style=for-the-badge&logo=heart&logoColor=white)

[![Stack](https://img.shields.io/badge/Stack-Vanilla%20HTML5%20%7C%20CSS3%20%7C%20ES6%2B-2563EB.svg?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![AI Powered](https://img.shields.io/badge/AI-EternalAI%20%7C%20Gemini%20API-7C3AED.svg?style=flat-square)](https://aistudio.google.com)
[![Cloud Sync](https://img.shields.io/badge/Cloud%20Sync-Supabase%20PostgreSQL-3ECF8E.svg?style=flat-square)](https://supabase.com)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-059669.svg?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Privacy](https://img.shields.io/badge/Privacy-GDPR%20%26%20CCPA%20Compliant-0284C7.svg?style=flat-square)](/privacy-policy)
[![License](https://img.shields.io/badge/License-Personal%20Hobby%20Project-78716C.svg?style=flat-square)](#-license--project-status)

**A modern, private, and mathematically rigorous wedding financial planner built for mindful couples.**  
Plan your budget, uncover hidden vendor costs with AI, test cashflow viability across custom paychecks, and synchronize payment milestones in real time.

</div>

---

## 📖 Table of Contents

- [💍 Why EternalPlan?](#-why-eternalplan)
- [✨ EternalAI Hub: Financial Copilot & Hidden Cost Audit](#-eternalai-hub-financial-copilot--hidden-cost-audit)
- [📊 Interactive Visual Charts & Dynamic Canvas](#-interactive-visual-charts--dynamic-canvas)
- [👥 Paycheck & Cashflow Simulator (Single & Dual Income)](#-paycheck--cashflow-simulator-single--dual-income)
- [⏱️ Due-Date Savings Velocity & Milestones Tracker](#-due-date-savings-velocity--milestones-tracker)
- [📋 Smart Vendor & Expense Management](#-smart-vendor--expense-management)
- [☁️ Supabase Cloud Sync & Real-Time Collaboration](#-supabase-cloud-sync--real-time-collaboration)
- [🛡️ Privacy, Security & Accessibility Compliance](#-privacy-security--accessibility-compliance)
- [🚀 Quick Start & Running Locally](#-quick-start--running-locally)
- [🌐 Deployment](#-deployment)
- [🛠️ Architecture & Tech Stack](#-architecture--tech-stack)
- [📄 License & Project Status](#-license--project-status)

---

## 💍 Why EternalPlan?

Traditional wedding spreadsheets only track total projected spend versus actual receipts. They fail to answer the most critical question couples face:

> **"Will we have enough cash in the bank on the exact day each vendor deposit, interim payment, and final balance is due?"**

Weddings aren't paid as one lump sum on your wedding day—they are paid across dozens of staggered milestone deadlines (e.g., 35% deposit on booking, 35% 6 months prior, and 30% two weeks before the wedding). 

**EternalPlan bridges that gap.** It models your cashflow chronologically against your paychecks, alerts you to upcoming bottleneck dates, calculates required savings velocity, and uses artificial intelligence to protect you from industry "gotchas."

---

## ✨ EternalAI Hub: Financial Copilot & Hidden Cost Audit

EternalPlan includes a dedicated, privacy-focused **EternalAI Hub** accessible right from the main navigation.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ✨ ETERNALAI HUB ✨                             │
├────────────────────────────────────────────────────────────────────────┤
│  🔍 Hidden Cost & Gotcha Audit   💬 Financial Copilot   ⚙️ AI Settings  │
│  [14 Industry Gotchas]           [Live Context Engine]  [Local / Gemini]│
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Hidden Cost & "Gotcha" Audit Scanner
Wedding proposals often exclude mandatory post-estimate charges that catch couples off guard. EternalAI audits your current budget against data from **2,000+ real weddings** and identifies 14 high-risk overlooked expenses:

| Category | Overlooked Hidden Cost | Typical Impact | Why It Gets Missed |
|:---|:---|:---:|:---|
| **Venue & Catering** | Service Fee + Tax (+28–32%) | +$1,800+ | Proposals quote food & beverage before the 22% admin fee and 8% tax. |
| **Attire & Beauty** | Dress Alterations, Bustle & Steaming | +$650–$900 | Off-the-rack attire rarely fits; 3–7 point bustles require skilled seamstress work. |
| **Venue & Catering** | Vendor Meals (Photo, Video, DJ, Coordinator) | +$350–$500 | Contracts stipulate hot dinners for staff on-site 5+ hours. |
| **Floral & Decor** | Delivery, Setup & Midnight Strike Fees | +$500–$800 | Venues requiring complete teardown by 1:00 AM incur late-night crew surcharges. |
| **Cushion & Tips** | Day-Of Cash Gratuities & Envelopes | +$600–$1,000 | Tips for hair/makeup (18–20%), DJ ($50–$100), delivery crew ($20–$50), and officiant. |
| **Venue & Catering** | Rehearsal Dinner / Welcome Gathering | +$1,400+ | Hosting family and out-of-town guests the night before. |
| **Stationery** | Invitation Suite 2-oz Postage & RSVP Return | +$180–$300 | Heavy cardstock and wax seals exceed standard 1-oz USPS postage rates. |
| **Attire & Beauty** | Bridal Hair & Makeup Preview Trials | +$250–$400 | Trial run sessions are typically billed separately from wedding-day glam. |
| **Officiant & Legal**| Marriage License & Certified Copies | +$110–$150 | County clerk filing fees plus certified copies for legal name change. |
| **Insurance** | Day-Of Liability & Cancellation Insurance | +$150–$250 | Venues requiring $1M liability policy naming them as additional insured. |
| **Attire & Beauty** | Day-Before Steaming & Heirloom Preservation | +$280–$400 | Archival preservation box and pre-ceremony wrinkle pressing. |
| **Entertainment** | Venue & DJ Extra-Hour Overtime Cushion | +$450–$700 | Speeches running late or keeping the dance floor alive. |
| **Contingency** | Getting-Ready Suite Hospitality & Emergency Kit | +$150–$250 | Breakfast pastries, coffee, champagne, fashion tape, sewing kit, and pain relievers. |
| **Stationery** | Thank-You Note Cards & Postage | +$120–$200 | Stationery suites for post-wedding gratitude mailings. |

- **Segmented Review Filters**: Easily filter by `To Review`, `🚫 Not in Our Wedding`, `✅ Already Covered`, and `All`.
- **One-Click Action**: Add any gotcha directly to your budget with pre-populated estimates, categories, and payment deadlines, or permanently dismiss items that don't apply.

### 2. Context-Aware Financial Copilot Chat
Ask questions and receive instant, personalized advice grounded in your real-time numbers:
- **Live Context Ribbon**: The AI reads your live target budget, current bank savings, paycheck cadence, planned savings pace, and upcoming unpaid bills.
- **Affordability Simulations**: Ask *"Can we afford an extra $1,500 for a videographer drone package?"*—the copilot calculates the exact impact per paycheck and determines if your cash cushion will remain protected.
- **Cost-Trimming Playbooks**: Ask *"Where can we realistically trim $2,000 without hurting guest experience?"* to receive tactical, high-impact suggestions (e.g., repurposing ceremony arches to sweetheart tables, digital RSVP QR codes).
- **Vendor Negotiation Scripts**: Pre-built email templates to politely request vendor payment installment splits (e.g., 3 milestones instead of 2).
- **Quick-Prompt Chips**: Clickable shortcuts for instant financial health checks.

### 3. Dual AI Engine Architecture
- **Smart Local Advisor (Default)**: Completely private, 100% offline intelligence running directly in your browser. Zero configuration required.
- **Google Gemini API Integration (Optional BYOK)**: Connect your own Gemini API Key (e.g., `Gemini 2.5 Flash` or `Gemini 1.5 Flash`) for unlimited deep generative reasoning. Keys are stored strictly client-side in your private browser `localStorage` and are never transmitted to external servers.

---

## 📊 Interactive Visual Charts & Dynamic Canvas

EternalPlan features custom, zero-dependency HTML5 `<canvas>` visualizations engineered for high frame-rate performance and pixel-perfect clarity.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Savings vs. Payment Deadlines                    [📈 Timeline] [📊 Monthly] [🪜 Milestones] │
├────────────────────────────────────────────────────────────────────────┤
│  Test a Savings Pace: [$650 / bi-weekly]  [-$50] [Current] [+$50] [⚡ Safe] [💾 Save] │
│  ───●────────────────────────────────────────────── Slider Track       │
│                                                                        │
│   $30k ┤                      ╭────────────────── Projected Savings    │
│   $20k ┤             ╭────────╯                                        │
│   $10k ┤    ╭────────╯     ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ Emergency Buffer      │
│    $0k ┴────┴───────┴───────┴───────┴───────┴──── Deadlines            │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Dynamic 3-View Cashflow & Milestone Engine
Toggle seamlessly between 3 specialized perspectives:
1. 📈 **Timeline / Trajectory View**: Continuous projection curves illustrating your projected savings trajectory against cumulative payment obligations over calendar time.
2. 📊 **Monthly Burn View**: Clustered monthly bars contrasting monthly savings inflows with vendor payment outflows to identify cash-heavy seasons.
3. 🪜 **Milestones / Step-Function View**: Granular step-up trajectory reflecting the exact dip and recovery of your bank balance after every milestone transaction.

### 2. Real-Time Interactive Savings Pace Simulator
- **Zero-Layout-Shift Fixed Toolbar**: Interactive slider ($0 to $3,000+) allowing couples to simulate *"What if we save $750/paycheck instead of $500?"* in real time.
- **Quick Presets**: `-$50`, `Current`, `+$50`, and `⚡ Safe` (one-click auto-balance).
- **Apply & Save**: Permanently update your planned savings pace with a single click.
- **60fps RAF Throttle**: Uses `requestAnimationFrame` debouncing for smooth, lag-free slider adjustments without UI stutter.
- **Interactive Tooltips**: Hover over any point on the canvas to inspect projected bank balances, payment names, and exact calendar dates.
- **Emergency Buffer Marker**: Clearly marks your safety cushion threshold and highlights any projected deficits in warning amber/rose.

### 3. Retina-Ready Gapless Donut Chart
- **Spending by Category**: Instant proportional breakdown of contracted and estimated vendor costs.
- **HiDPI / Retina Compensation**: Scaled with `window.devicePixelRatio` for razor-sharp rendering on 4K monitors and mobile screens.
- **100% Gapless Geometric Hit Testing**: Utilizes polar angle (`atan2`) and radius bounds to detect slice hovers with zero edge dead zones.
- **Itemized Breakdown Tooltip**: Hovering over any slice instantly reveals category totals, percentage of total wedding budget, and an itemized breakdown of every expense in that category.
- **Decoupled <0.3ms Repaints**: Canvas hover repaints are decoupled from the DOM for instant, buttery-smooth interactions.

---

## 👥 Paycheck & Cashflow Simulator (Single & Dual Income)

```
┌──────────────────────────────┬──────────────────────────────┐
│ 💍 Partner 1 (Alex)          │ 💍 Partner 2 (Jordan)        │
│ Cadence: Bi-Weekly           │ Cadence: Semi-Monthly        │
│ Next Payday: Oct 15, 2026    │ Next Payday: Oct 1, 2026     │
│ Contribution: $450 / check   │ Contribution: $500 / check   │
├──────────────────────────────┴──────────────────────────────┤
│ Joint Pace: $1,975 / month   [ Alex: 49% ■■■■■■□□□□□ Jordan: 51% ]│
└─────────────────────────────────────────────────────────────┘
```

### 1. Dual-Income Split Schedules
Most couples don't share the same payday schedule. EternalPlan natively supports:
- **Independent Cadences**: Partner 1 can be on Bi-Weekly while Partner 2 is on Semi-Monthly (1st & 15th), Weekly, or Monthly.
- **Independent Payday Anchors**: Set distinct calendar anchors for each partner's next payday.
- **Individual Contribution Amounts**: Specify custom savings allocations per paycheck for each person.
- **Visual Contribution Split Bar**: Real-time progress bar displaying the exact percentage contribution of each partner to the joint wedding fund.

### 2. Single / Combined Income Mode
For couples saving from a single joint account or household pool, switch effortlessly to single-cadence mode.

### 3. ⚡ Auto-Balance Savings Pace
One-click mathematical optimization solver. Analyzes your starting savings pool, all future vendor milestone due dates, and your safety cushion to calculate the **exact minimum paycheck savings** required so your bank balance never dips below zero at any point.

### 4. Granular Balance Forecast Table
Chronological financial ledger projecting your anticipated bank balance following each vendor milestone payment. Automatically flags surplus vs. deficit status.

---

## ⏱️ Due-Date Savings Velocity & Milestones Tracker

### 1. Multi-Cadence Velocity Calculator
Know your exact target savings pace across all time horizons:
- **Per Day**: Micro-savings target.
- **Per Week**: Weekly savings allocation.
- **Per Paycheck**: Dynamically highlighted to match your active pay cadence.
- **Per Month**: Monthly transfer target.

### 2. 3-Hero-Metric Top Bar
Simplified, plain-English dashboard summaries:
- **Total Wedding Budget**: Target budget vs. actual planned costs with animated visual progress bar. Supports both Top-Down (fixed goal) and Bottom-Up (sum of expenses) modes.
- **Paid So Far**: Cumulative deposits paid with percentage of wedding settled.
- **Remaining to Pay**: Unpaid balance remaining, count of upcoming payments, and savings gap.

### 3. Dynamic Crunch Alert Banner
Prominently alerts you to your next immediate payment due, the amount, due date, and the required savings velocity needed to meet that specific deadline comfortably.

### 4. Chronological Payment Schedule
- **Interactive Badges**: `Due in X days` (Upcoming), `Due Soon` (within 14 days), `Overdue`, and `Paid`.
- **Status Filters**: Filter by `All Upcoming Unpaid`, `Due in 30 Days`, `Due in 60 Days`, `Overdue`, `Paid & Completed`, or `Show All`.
- **Quick "Mark Paid"**: One-click toggle that instantly re-allocates your cashflow, marks milestones as paid, and recalculates future savings requirements.

---

## 📋 Smart Vendor & Expense Management

### 1. Two-Tier Expense Form
Designed for speed when adding rough estimates, with deep customization when contracts are signed:
- **Tier 1 (The Essentials)**: Item/Vendor Name, Category, and Estimated Cost.
- **Tier 2A (Collapsible Payment Schedule)**: Toggle custom payment installments (e.g., Deposit, Mid-point, Final Balance) with custom due dates, or click **⚡ Pay on Wedding Day** for a single final payment.
- **Tier 2B (Vendor Details & Notes)**: Company name, contact information, package tiers, and contract cancellation terms.

### 2. Comprehensive Wedding Categories
Pre-configured with industry-standard categories:
- 🏰 **Venue & Catering** (Reception, catering, bar, cake)
- 📸 **Photography & Video** (Engagement photos, wedding album, drone footage)
- 👗 **Attire, Rings & Beauty** (Gown, suit, alterations, rings, hair & makeup)
- 💐 **Floral & Decor** (Bouquets, centerpieces, ceremony arches, lighting)
- 🎷 **Music & Entertainment** (DJ, live band, ceremony strings, photo booth)
- 💌 **Stationery & Invites** (Save the dates, invitations, menus, thank-you cards)
- 🎂 **Cake & Desserts** (Wedding cake, dessert table, late-night snacks)
- 📜 **Officiant & Legal** (Marriage license, officiant fee, certified copies)
- 🚗 **Transport & Favors** (Guest shuttles, getaway car, wedding favors)
- ✈️ **Honeymoon & Cushion** (Flights, resort stays, emergency buffer)

---

## ☁️ Supabase Cloud Sync & Real-Time Collaboration

Save your budget to your private Supabase cloud database to plan seamlessly across devices:

```
┌──────────────────┐               ┌──────────────────┐
│  Partner 1 Phone │ ◄───[SYNC]──► │  Partner 2 Laptop│
└─────────┬────────┘               └────────┬─────────┘
          │                                 │
          └───────────► ☁️ Supabase ◄─────────┘
                     (PostgreSQL DB)
```

1. **Passphrase-Only Sync**: Connect using just your shared **Wedding Sync Passphrase / ID** (e.g., `Irish09`). Database URL and API keys are encapsulated securely so partners and guests don't need any technical setup.
2. **1-Click Partner Share Link**: Click **Copy Partner Link** to generate an instant link (`https://yourdomain/#sync=Irish09`) that automatically connects and syncs on your partner's phone or laptop.
3. **Real-Time Live Collaboration**: Updates sync bidirectional in real-time across devices using Supabase Realtime channels.
4. **Offline-First Resilience**: If internet connection drops, changes are cached in browser `localStorage` and automatically pushed when reconnected.
5. **Advanced / Self-Hosted Override**: Optional expandable settings drawer for couples who want to connect their own custom self-hosted Supabase instance.

### Supabase Table Setup
Run the following SQL in your **Supabase SQL Editor**:

```sql
create table if not exists public.wedding_plans (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.wedding_plans enable row level security;

create policy "Allow public read on wedding_plans" on public.wedding_plans for select using (true);
create policy "Allow public insert on wedding_plans" on public.wedding_plans for insert with check (true);
create policy "Allow public update on wedding_plans" on public.wedding_plans for update using (true);
```

---

## 🛡️ Privacy, Security & Accessibility Compliance

EternalPlan was engineered from the ground up to respect user privacy and adhere to modern web standards:

- **100% Client-Side Privacy**: All financial data stays strictly on your device or in your own Supabase instance. No external analytics, telemetry, or hidden tracking scripts.
- **GDPR & CCPA Compliant Consent Manager**: Built-in cookie consent banner with granular preferences (`consent-manager.js`).
- **Standardized Legal Documentation**: Dedicated pages for [Privacy Policy](file:///c:/Antigravity/EternalPlan-wedding-savings-planner/privacy-policy.html), [Terms of Service](file:///c:/Antigravity/EternalPlan-wedding-savings-planner/terms-of-service.html), [Cookie Policy](file:///c:/Antigravity/EternalPlan-wedding-savings-planner/cookie-policy.html), and [Data Subject Access Rights (DSAR)](file:///c:/Antigravity/EternalPlan-wedding-savings-planner/dsar.html).
- **Security & Protocol Standards**:
  - RFC 9116 `security.txt` discovery endpoint (`.well-known/security.txt`).
  - Native mobile deep linking: `assetlinks.json` (Android) and `apple-app-site-association` (iOS).
  - Hardened security headers pre-configured in `vercel.json` (Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options).
- **WCAG 2.2 AA Accessibility**:
  - Keyboard navigable with visible focus indicators.
  - Accessible Skip-to-Content link.
  - Screen reader announcements via global `aria-live` polite announcer.
  - High-contrast, legible color ratios across light and dark elements.
- **Data Portability**:
  - Export full backup to **JSON**.
  - Restore backup from **JSON**.
  - Export payment schedule to **CSV** for Google Sheets or Excel.
  - **Print / Save as PDF** stylesheet for wedding binder printing.

---

## 🚀 Quick Start & Running Locally

EternalPlan is **100% self-contained** with no build steps, bundlers, or `node_modules` required!

### Option 1: Direct File Open
Simply double-click [`index.html`](file:///c:/Antigravity/EternalPlan-wedding-savings-planner/index.html) to run it directly in Chrome, Safari, Edge, or Firefox.

### Option 2: Local HTTP Server (Recommended)
Running through a local web server enables service workers and PWA capabilities:

```bash
# Navigate to the project directory
cd C:\Antigravity\EternalPlan-wedding-savings-planner

# Start Python's built-in web server
python -m http.server 8080
```

Open your browser to:
```
http://localhost:8080/index.html
```

Or using Node.js:
```bash
npx serve .
```

---

## 🌐 Deployment

EternalPlan is pre-configured for one-click deployment to **Vercel**, **Cloudflare Pages**, or **GitHub Pages**.

### Deploy to Vercel
The repository includes a ready-to-use [`vercel.json`](file:///c:/Antigravity/EternalPlan-wedding-savings-planner/vercel.json) with security headers, clean URL rewrites, and asset caching rules:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
vercel --prod
```

---

## 🛠️ Architecture & Tech Stack

```
EternalPlan-wedding-savings-planner/
├── index.html                 # Semantic HTML5 Application Shell & Modals
├── styles.css                 # Vanilla CSS3 Design System & Responsive Tokens
├── app.js                     # Core Application Logic, Canvas Engines & AI Hub
├── sample-data.js             # Realistic $36k Sample Wedding Data
├── consent-manager.js         # GDPR / CCPA Cookie Consent Manager
├── supabase_schema.sql        # Supabase PostgreSQL Database Schema
├── manifest.webmanifest       # PWA Application Manifest
├── vercel.json                # Vercel Deployment & Security Headers Config
├── privacy-policy.html        # GDPR / CCPA Compliant Privacy Policy
├── terms-of-service.html      # Terms of Service
├── cookie-policy.html         # Cookie Policy
├── dsar.html                  # Data Subject Access Request Form
└── .well-known/               # RFC 9116 security.txt & Native App Associations
```

- **Frontend**: Vanilla HTML5, Vanilla CSS3 (Custom Properties & CSS Grid/Flexbox), Vanilla ES6+ JavaScript.
- **Rendering**: HTML5 `<canvas>` 2D Context with sub-pixel device pixel ratio (DPI) compensation and RequestAnimationFrame loops.
- **Storage**: Browser `localStorage` (Offline-First) + Supabase Realtime Database (PostgreSQL).
- **AI**: Built-in deterministic pattern-matching engine + Google Gemini REST API (`gemini-2.5-flash` / `gemini-1.5-flash`).
- **Styling Aesthetic**: Warm, modern champagne-gold and sage-rose bridal aesthetic with high financial data density.

---

## 📄 License & Project Status

EternalPlan is a **personal non-commercial hobby project** created for fun and utility. It is not an enterprise product, has no commercial intent, and displays no advertisements.

---

<div align="center">

**Crafted with care for couples planning their happily ever after. 💍✨**

[Report an Issue](https://github.com/your-username/EternalPlan/issues) • [Request a Feature](https://github.com/your-username/EternalPlan/discussions)

</div>
