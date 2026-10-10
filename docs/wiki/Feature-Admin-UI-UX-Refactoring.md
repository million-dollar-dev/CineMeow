# Feature: Comprehensive Admin Portal UI/UX Refactoring & Design System

| Metadata | Details |
| :--- | :--- |
| **Feature ID** | FEAT-UI-001 |
| **Category** | Frontend / Design System / UX Harmonization |
| **Target Services** | `frontend/admin-frontend`, `design-system` |
| **Status** | Live |
| **Priority** | P0 - Critical |
| **Primary Owner** | Frontend & UI/UX Team |

---

## 1. Overview

### 1.1 Purpose
Establish a unified, modern, high-performance Design System and harmonize the entire user interface across the CineMeow Admin Portal. The initiative transforms fragmented, inconsistent administrative pages into a cohesive cinema operations control center with refined aesthetics, intuitive workflows, responsive layouts, and zero-horizontal-scroll data tables.

### 1.2 Background
In early development phases, admin pages (Movies, Showtimes, Cinemas, FnB, Pricing, Accounts) were developed independently with varying color palettes, divergent modal layouts, mismatched table paddings, and fragmented UX controls. Administrators faced cumbersome horizontal scrollbars to reach action buttons, inconsistent status colors, and disjointed page headers.

This feature encompasses the end-to-end refactoring of the administrative portal shell, shared design tokens, modal framework, and every operational domain view into a unified design standard.

### 1.3 Design System & Aesthetic Principles

- **Color Palette:** Curated modern light theme utilizing deep violet/indigo primary accents (`#6366F1`, `#4F46E5`), slate neutrals (`#0F172A` to `#F8FAFC`), and jewel-toned status badges (emerald for active/paid, amber for pending, rose for cancelled/expired).
- **Typography:** Modern clean sans-serif typography with strict typographic scale (`text-[10px]` micro-badges to `text-2xl` bold page titles).
- **Surfaces & Elevation:** Clean card layouts, border-based separation (`border-slate-200/80`), subtle shadows (`shadow-xs`, `shadow-2xs`), and rounded geometric corners (`rounded-2xl`, `rounded-xl`).
- **Micro-Interactions:** 360° spin animations on page refresh, smooth hover state elevations, and active scale feedback (`active:scale-95`).

---

## 2. Goals & Success Metrics

- Unify all 12 administrative pages under a single cohesive design system.
- Standardize all modal dialogs through a reusable, battle-tested `AdminModalLayout`.
- Eliminate horizontal table scrollbars across all management views on standard desktop resolutions (1280px+).
- Establish synchronous page headers with live breadcrumbs, consistent padding, and synchronized refresh animations.
- Deliver instant visual feedback with interactive seat map studios and live client preview panels.
- **Success Metrics:**
  - 100% modal consistency across all domain entities.
  - Zero compilation or Vite build errors (`npm run build` passes with 0 warnings/errors).
  - Streamlined operational task completion time for theater managers and ticket clerks.

---

## 3. Scope

| Category | In Scope | Out of Scope |
| :--- | :--- | :--- |
| **Application Shell** | • Topbar: 80px alignment, live date, global search, notifications, profile menu<br>• Sidebar: Spacious 64px collapsed mode, jewel active states, 8+ core modules | • Public client frontend marketing pages |
| **Modal Framework** | • Standard `AdminModalLayout` with top gradient stripe, header badges, and action footer<br>• Dedicated profile & change password modals | • Replacing backend Spring Boot validation logic |
| **Domain Pages Refactored** | • Dashboard & Analytics<br>• Movie Catalog<br>• Showtime Scheduling<br>• Cinemas & Seat Studio<br>• Brand Management<br>• Pricing & Surcharges<br>• FnB Concessions<br>• Promotions & Vouchers<br>• Account Management (Admin & Customer tabs)<br>• Transaction Ledger & Refunds<br>• Notification Center<br>• System Settings & Rules | • Core database schema modifications |
| **Table & Layout UX** | • Column width optimization and horizontal scroll elimination<br>• Uniform page headers and stat badge layouts<br>• Synchronized spinning refresh button behavior | • Native mobile apps (iOS / Android) |

---

## 4. Architecture & Technical Design

### 4.1 Component Architecture Hierarchy

```text
frontend/admin-frontend/src/
├── components/
│   ├── AdminModalLayout.jsx        <-- Standard modal framework
│   ├── Sidebar.jsx                 <-- Primary collapsible navigation shell
│   ├── Topbar.jsx                  <-- Global application header
│   ├── CustomDropdown.jsx          <-- Elevated z-index custom filter select
│   ├── AccountManagement/          <-- Admin/Customer & Profile dialogs
│   ├── BookingManagement/          <-- Quick lookup & Ticket detail dialogs
│   ├── CinemaManagement/           <-- Seat studio & Screen hall dialogs
│   ├── MovieManagement/            <-- Movie edit with client live preview
│   └── TransactionManagement/      <-- Audit & Refund dialogs
├── pages/                          <-- 12 Synchronized domain pages
├── redux/slices/                   <-- Sidebar, auth, snackbar state slices
└── constants/                      <-- Status configs, badges, role definitions
```

### 4.2 Standard Modal Framework (`AdminModalLayout`)

All creation and modification flows utilize `AdminModalLayout.jsx` guaranteeing:
1. **Top Gradient Stripe:** Violet-to-indigo brand identity stripe across the top edge.
2. **Standardized Header (`AdminModalHeader`):** Distinct colored icon box, title, subtitle, and mode pill ("Tạo mới" vs "Cập nhật").
3. **Scrollable Content View:** Contained vertical scroll with consistent `p-6` spacing.
4. **Action Footer (`AdminModalFooter`):** Mandatory field hint, cancel button, and primary action button with loading spinner state (`CircularProgress`).

### 4.3 Shell & Navigation Harmonization

- **Topbar:** Integrates route meta dictionary (`pageMeta`), date formatting in Vietnamese, search input with `⌘K` badge, interactive notification menu, and user avatar dropdown linking directly to personal profile and password management.
- **Sidebar:** Dynamic route tracking, tooltip support when collapsed, smooth transition animations, and persistent expanded state in Redux.

---

## 5. Domain Pages & Features Refactored

### 5.1 Executive Dashboard (`/dashboard`)
- Real-time cinema revenue KPI cards with percentage delta indicators.
- Synchronized stat badge colors and layouts.
- Interactive revenue & ticket sales analytics charts.
- Synchronized spinning refresh action button.

### 5.2 Movie Catalog (`/movies`)
- Grid and table view toggles with responsive poster cards.
- Movie edit modal featuring a **Client Detail Live Preview panel**, enabling administrators to inspect client-facing layout, banner aspect ratios (16:9), and typography prior to saving.

### 5.3 Showtime Scheduling (`/showtimes`)
- Conflict-detection timeline and studio ticket pass preview card.
- Compact column formatting preventing horizontal table overflow.
- Rapid filtering by cinema, screen room, date, and movie title.

### 5.4 Cinemas & Interactive Seat Studio (`/cinemas`)
- Interactive **Seat Map Studio** supporting Regular, VIP, and Couple seats.
- Visual seat coordinates (`Row A-J`, `Col 1-14`), status toggling (Available, Blocked, Maintenance), and pricing tier badges.
- Screen room specification editor and branch location manager.

### 5.5 Brand & Chain Management (`/brands`)
- Cinema chain partner management with live client preview card.
- Corporate branding assets, logos, and support hotlines.

### 5.6 Pricing & Surcharges (`/pricing`)
- Seat type base prices (Regular, VIP, Sweetbox/Couple).
- Day-of-week multipliers, weekend surcharges, and holiday rates.
- Standardized filter toolbars and action buttons.

### 5.7 Food & Beverage Concession (`/fnb`)
- Combo item catalogs, pricing, status toggles (In Stock, Out of Stock, Warning).
- Standardized page header and stats grid matching other domain views.

### 5.8 Promotions & Vouchers (`/promotion`)
- Discount engine rules: percentage-off, fixed amount, minimum spend, and quota limits.
- Status badges: Active, Scheduled, Expired, Depleted.

### 5.9 Account & Role Management (`/accounts`)
- Dual-tab layout: **Tài khoản quản trị** (Internal Admin Staff) & **Khách hàng** (Client Users).
- Role badges: `SUPER_ADMIN`, `CINEMA_MANAGER`, `MARKETING_SPECIALIST`, `AUDIT_OFFICER`.
- Reset password generation modal with random secure string creator.

### 5.10 Transaction Ledger & Refunds (`/transactions`)
- Centralized payment ledger tracking transactions across VNPay, MoMo, and Cash.
- Column spacing optimized to display Order ID, Customer, Cinema, Amount, Method, Status, and Action without horizontal scrollbars.
- **Refund Transaction Modal:** Process ticket refunds with cancellation reason, refund percentage calculator, and audit remarks.

### 5.11 Notification Center (`/notifications`)
- System alerts, low concession stock warnings, and transaction anomalies.
- Filter by priority (Urgent, Warning, Info, Success) and mark-as-read workflows.

### 5.12 System Settings & Rules (`/settings`)
- Booking hold countdown timeouts (e.g., 10 minutes).
- Payment gateway credentials and operational maintenance toggles.

### 5.13 Administrator Profile & Security
- **AdminProfileModal:** Personal details update (Full Name, Work Email, Phone) with live avatar synchronization in Topbar.
- **ChangePasswordModal:** Form with visibility toggles, strength validation, and confirmation match check.

---

## 6. UX Innovations & Polish

1. **Zero-Horizontal-Scroll Data Tables:** Eliminated the necessity of scrolling horizontally to access action buttons by compacting padding (`px-3`, `py-3.5`), utilizing icon buttons with tooltips, and truncating secondary text with ellipsis.
2. **Synchronized Spinning Refresh Animation:** Standardized refresh buttons across all pages with a synchronized 360° rotation animation when clicked (`animate-[spin_700ms_ease-in-out]`).
3. **Live Client Preview Panels:** Integrated side-by-side previews into editing modals (Movies, Brands) so admins immediately preview the end-user visual output before submitting.
4. **Z-Index Layering Integrity:** Standardized dropdown z-index hierarchies (`z-50`) to prevent custom select menus from being clipped by table cards or sticky headers.

---

## 7. Risk Management

| Risk | Impact | Mitigation Strategy |
| :--- | :---: | :--- |
| **Component Style Inconsistency** | High | Standardized all modals onto `AdminModalLayout.jsx` and created shared styling tokens in Tailwind. |
| **Table Column Overflow on Small Laptops** | High | Tailored font sizes (`text-xs`), used compact badge pills, and removed unnecessary column gaps to fit 1280px viewports without scrollbars. |
| **Bundle Size Bloat** | Medium | Reused native MUI icons, avoided heavy third-party UI libraries, and cleaned up unused dependencies. Verified with `npm run build`. |
| **Broken State on Page Refresh** | Medium | Leveraged Redux Toolkit for persistent UI preferences (sidebar toggle) and synchronized mock stores. |

---

## 8. Definition of Done (DoD)

- [x] All 12 admin domain pages adhere to the unified design language and color palette.
- [x] Application shell (Sidebar & Topbar) aligned with dynamic breadcrumbs and profile controls.
- [x] `AdminModalLayout` adopted across all entity creation and edit workflows.
- [x] Zero horizontal scrollbars required to execute table action buttons on standard desktop screens.
- [x] Spinning refresh animation synchronized across all pages.
- [x] Toast notification system (`openSnackbar`) operational across all CRUD actions.
- [x] `npm run build` succeeds cleanly with 0 compilation errors.
- [x] Documentation written, formatted according to standards, and registered in Wiki Feature Index.
