# Smart EPN Workshop Management Dashboard

> **⚠️ DEMONSTRATION DATA — For assessment and demo purposes only**

A complete, responsive, frontend-only web application for the Electrical Wiring Workshop (EPN) at **Politeknik Kuching Sarawak, Malaysia**.

---

## 🚀 Quick Start

### Option 1 — Open Locally (Recommended for Testing)
1. Download or clone this repository
2. Open the `epn-dashboard/` folder
3. Double-click `index.html` to open in your browser
4. No installation, no server required

### Option 2 — GitHub Pages (Live URL)
1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Set Source to `main` branch, folder `/epn-dashboard` (or root)
4. Your dashboard will be live at `https://username.github.io/epn-dashboard/`

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Workshop Supervisor | supervisor@epn.edu.my | `Supervisor@2026` |
| Lecturer | lecturer@epn.edu.my | `Lecturer@2026` |
| Student | student@epn.edu.my | `Student@2026` |

> These credentials are pre-loaded automatically on first launch. You can also register new accounts from the login page.

---

## 📁 Project Structure

```
epn-dashboard/
├── index.html                    ← Login & Registration page
├── dashboard-supervisor.html     ← Supervisor Dashboard
├── dashboard-lecturer.html       ← Lecturer Dashboard
├── dashboard-student.html        ← Student Dashboard
├── css/
│   ├── style.css                 ← Global layout, sidebar, cards, tables
│   └── auth.css                  ← Login/Register page styles
├── js/
│   ├── auth.js                   ← Login, register, session management
│   ├── data.js                   ← Demo seed data & localStorage helpers
│   ├── dashboard-supervisor.js
│   ├── dashboard-lecturer.js
│   └── dashboard-student.js
└── README.md
```

---

## 👥 User Roles & Features

### 🔴 Workshop Supervisor
- Full access to all modules
- 8 summary cards (tools, materials, sessions, maintenance, safety)
- 3 Chart.js charts (utilisation, borrowing trends, material usage)
- Tool borrowing & return management (approve, mark returned/damaged)
- Consumable materials — issue & add stock
- Workshop bookings & usage records view
- Maintenance records management
- Safety inspection records
- Activity log
- User management
- CSV export for all modules
- Dark mode & BM/EN language toggle

### 🟡 Lecturer
- Dashboard with 4 summary cards
- Record workshop usage (with auto-calculated duration)
- Workshop booking with **clash detection**
- Tool transactions for own class (approve borrow, mark returned)
- Issue consumable materials
- View material stock (read-only)
- My reports & CSV export
- Dark mode & BM/EN language toggle

### 🟢 Student
- Dashboard with 3 summary cards
- Submit tool borrow requests (blocked if has overdue items)
- View own transaction history with status badges
- Overdue alert banner
- Change password in profile
- Dark mode & BM/EN language toggle

---

## 💾 Data Storage

All data is stored in the **browser's `localStorage`**. No server or database is required.

| localStorage Key | Contents |
|---|---|
| `epn_current_user` | Current logged-in user session |
| `epn_users` | All registered user accounts |
| `epn_tools` | Tool inventory (15 tools) |
| `epn_materials` | Consumable materials stock (12 items) |
| `epn_tool_transactions` | Tool borrowing transactions |
| `epn_material_transactions` | Material issue/receipt records |
| `epn_bookings` | Workshop bookings |
| `epn_usage_records` | Workshop usage records |
| `epn_maintenance` | Maintenance records |
| `epn_safety_inspections` | Safety inspection records |
| `epn_activity_log` | Activity log entries |

### Reset Demo Data
To restore all demo data to its original state:
1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Type: `localStorage.clear()` and press Enter
4. Refresh the page — demo data will reload automatically

---

## ✨ Features

| Feature | Status |
|---|---|
| Login & Registration (3 roles) | ✅ |
| Role-based redirect to correct dashboard | ✅ |
| Demo credentials hint on login page | ✅ |
| 8 summary cards (Supervisor) | ✅ |
| 3 Chart.js charts | ✅ |
| Tool borrowing & return | ✅ |
| Approve/reject borrow requests | ✅ |
| Mark tools as Returned / Damaged | ✅ |
| Consumable materials management | ✅ |
| Low stock alert banner | ✅ |
| Issue material & add stock | ✅ |
| Workshop booking with clash detection | ✅ |
| Workshop usage recording (duration auto-calc) | ✅ |
| Maintenance records | ✅ |
| Safety inspection records | ✅ |
| Activity log | ✅ |
| User management | ✅ |
| CSV export for all modules | ✅ |
| Dark mode toggle | ✅ |
| Bahasa Malaysia / English toggle | ✅ |
| Responsive (desktop, tablet, mobile) | ✅ |
| Print-friendly CSS | ✅ |
| Student overdue block | ✅ |
| Password change (Student profile) | ✅ |
| Searchable tables | ✅ |
| Status badges (colour-coded) | ✅ |

---

## 🗓️ Demo Data Summary

| Dataset | Records |
|---|---|
| Tools (reusable) | 15 — multimeters, pliers, screwdrivers, wire strippers, power drills, etc. |
| Consumable materials | 12 — PVC cables, switches, sockets, conduits, connectors, etc. |
| Tool transactions | 10 — Borrowed, Returned, Overdue, Damaged, Missing, Requested |
| Material transactions | 8 — Issues and receipts |
| Workshop bookings | 6 — Completed, Confirmed, Pending |
| Workshop usage records | 5 |
| Maintenance records | 4 — Pending, In Progress, Completed |
| Safety inspections | 3 — Safe, Attention Required |
| Users | 5 demo accounts |

---

## 🛠️ Technology

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Charts | Chart.js (via CDN) |
| Data | Browser localStorage |
| Hosting | GitHub Pages (static) |
| Date format | DD/MM/YYYY (Malaysian standard) |
| Currency | RM |

---

## 📋 Notes for Assessors

- Click the **"Use"** buttons on the login page to auto-fill demo credentials
- Dark Mode and BM/EN toggle persist between sessions
- All data added during demo (new borrows, issues, bookings) is saved in localStorage until cleared
- Status badges are colour-coded: 🔵 Borrowed, 🟢 Returned, 🔴 Overdue, 🟠 Damaged, ⚫ Missing
- Overdue items are highlighted in red rows in all tables
- Low stock materials are highlighted in orange rows

---

*Smart EPN Workshop Management Dashboard — Politeknik Kuching Sarawak &copy; 2026*
*⚠️ DEMONSTRATION DATA — Assessment purposes only*
