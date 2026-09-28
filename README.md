# EternalPlan - Wedding Budget & Due-Date Savings Planner

A web application designed for couples to plan their dream wedding budget and calculate exactly how much money needs to be saved by each payment due date (deposits, interim milestones, and final balances) to ensure a smooth, stress-free wedding journey.

---

## 💍 Core Features

### 1. Smart Due-Date Savings Velocity Calculator
- Calculates the exact savings rate required across multiple cadences:
  - **Per Day**
  - **Per Week**
  - **Per Paycheck** (Bi-Weekly, Weekly, Semi-Monthly, Monthly)
  - **Per Month**
- Analyzes each upcoming payment milestone against your current savings pool to determine how much new money must be put away by that exact due date.
- Identifies **Bottleneck Milestones**—those payments where the required savings pace peaks, warning you ahead of time.

### 2. Paycheck & Cashflow Simulator
- Simulates your wedding bank account balance chronologically over time.
- Factors in your starting savings, your paycheck frequency, planned paycheck contributions, and your safety cushion.
- Automatically flags any potential cash deficit dates where bills would exceed available cash.
- **⚡ Auto-Balance Savings Pace**: One-click optimization that solves for the exact minimum paycheck savings required to keep your balance positive through every single vendor milestone.

### 3. Payment Schedule & Due Date Tracker
- Chronological timeline cards with status badges:
  - `Due in X days` (Upcoming)
  - `Due Soon` (within 14 days)
  - `Overdue`
  - `Paid`
- Shows cumulative money due up to that milestone and required pace.
- Quick **"Mark Paid"** button to update balances and milestone statuses in real-time.
- Filters: All Upcoming, Due in 30 Days, Due in 60 Days, Overdue, Paid & Completed.

### 4. Comprehensive Wedding Budget & Vendor Management
- Pre-loaded with realistic wedding categories:
  - 🏰 Venue & Catering
  - 📸 Photography & Video
  - 👗 Attire, Rings & Beauty
  - 💐 Floral & Decor
  - 🎷 Music & Entertainment
  - 💌 Stationery & Invites
  - 🎂 Cake & Desserts
  - 📜 Officiant & Legal
  - 🚗 Transport & Favors
  - ✈️ Honeymoon & Cushion
- Supports multi-milestone payment splits per vendor (e.g. 35% deposit on booking, 35% 6 months prior, 30% final balance).
- Tracks Estimated Cost vs Contracted/Actual Cost vs Paid to Date vs Remaining Due.

### 5. Interactive Visual Charts
- **Cashflow & Milestone Trajectory Chart**: Dual-line canvas chart showing projected bank balance alongside cumulative payments due.
- **Budget Allocation Donut Chart**: Proportional visual distribution of wedding spend across categories.

### 6. Data Persistence, Backup & Print
- Automatically saves all changes to your browser's `localStorage`.
- Export & restore backups with **JSON**.
- Export payment schedule to **CSV** for spreadsheets or financial planners.
- Clean **Print / Save as PDF** styling for offline binders and meetings with partners or wedding planners.

---

## 🚀 Running the App Locally

The application is completely self-contained (HTML5, Vanilla CSS3, Vanilla ES6 JavaScript).

To run locally with the built-in HTTP server:
```bash
cd C:\Antigravity\wedding-budget-planner
python -m http.server 8080
```
Then open your browser to:
`http://localhost:8080/index.html`

Alternatively, you can double-click `index.html` to open it directly in Chrome, Edge, Safari, or Firefox!
