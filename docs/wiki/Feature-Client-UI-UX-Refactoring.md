# Feature: Comprehensive Client Portal UI/UX Refactoring & Dark Cinema Design System

| Metadata | Details |
| :--- | :--- |
| **Feature ID** | CM-000003 |
| **Category** | Frontend / Design System / UX Harmonization |
| **Target Services** | `frontend/client-frontend` |
| **Status** | 🟢 Live |
| **Priority** | P0 - Critical |
| **Primary Owner** | Frontend & UI/UX Team |

---

## 1. Overview

### 1.1 Purpose
Deliver an immersive, high-conversion, dark-luxury cinema ticketing and content portal across the CineMeow Client Frontend. This initiative transforms fragmented web pages into a cohesive entertainment hub featuring atmospheric cinema textures, unified smart filters, sticky booking panels, interactive E-ticket cards, and seamless multi-device responsiveness.

### 1.2 Background
Earlier versions of the client frontend presented disparate styling, inconsistent movie card dimensions, clashing dropdown filter menus, and clipped sticky sidebars. Users experienced layout shifting between Now Playing and Coming Soon views, disconnected showtime selectors, and generic white backgrounds lacking movie theater atmosphere.

This feature unifies the client frontend under a signature **Dark Cinema Aesthetic**, standardizes all filtering controls with elevated `CustomDropdown` components, optimizes media backdrops, and redesigns user profile workflows into an interactive cinema experience.

### 1.3 Design System & Aesthetic Principles

- **Dark Cinema Color Palette:** Deep charcoal and midnight obsidian backgrounds (`#0B0F19`, `#111827`, `#1F2937`) complemented by electric violet/indigo primary accents (`#6366F1`, `#8B5CF6`), neon cyan details (`#06B6D4`), and warm amber rating stars (`#F59E0B`).
- **Atmospheric Textures & Depth:** RoPhim-styled dotted halftone overlays, backlit neon spotlights, and softened 16:9 blurred backdrop banners providing depth without visual clutter.
- **Typography:** Modern high-legibility sans-serif typography with strict typographic scale (`text-xs` badge pills to `text-4xl` hero titles).
- **Surfaces & Cards:** Glassmorphic translucent cards (`backdrop-blur-md`, `bg-slate-900/60`), subtle borders (`border-white/10`), rounded geometric corners (`rounded-2xl`, `rounded-xl`), and hover scale micro-interactions (`hover:scale-[1.02]`).

---

## 2. Goals & Success Metrics

- Unify all 12+ public and authenticated client pages under a cohesive Dark Cinema Design System.
- Standardize all filter toolbars across catalog pages with the reusable, high z-index `CustomDropdown` component.
- Deliver a cinema-grade **Movie Detail Page** featuring blurred 16:9 backdrops, sticky aside booking panels, and trailer modal overlays.
- Provide a feature-rich **User Profile** page with 4 synchronized tabs, transaction tracking, and an interactive digital ticket popup modal with QR codes.
- Ensure 100% responsiveness without horizontal overflow or clipping across viewport widths from mobile (375px) to ultra-wide desktop (1920px).
- **Success Metrics:**
  - Zero compilation errors (`npm run build` passes with 0 warnings/errors).
  - Faster movie discovery and showtime selection for end users.
  - Consistent visual fidelity matching modern cinema streaming and ticketing platforms.

---

## 3. Scope

| Category | In Scope | Out of Scope |
| :--- | :--- | :--- |
| **Application Shell** | • Sticky glassmorphism Header with navigation links and user avatar menu<br>• Cinema-themed Footer with partner brand logos, quick links, and hotlines | • Admin operations portal (covered by CM-000002) |
| **Discovery & Home** | • Hero spotlight carousel with RoPhim dotted texture and thumbnail rail<br>• QuickBookingWidget for rapid movie/cinema/showtime selection<br>• Blockbuster showcase and partner brand strips | • Backend recommendation ML model training |
| **Catalog & Scheduling** | • Now Playing (`/phim-dang-chieu`), Coming Soon (`/phim-sap-chieu`), and Full Catalog (`/movies`)<br>• Unified `CustomDropdown` filters (Genre, Format, Age Rating, City, Cinema Brand)<br>• Integrated trailer modals with YouTube embed player | • Modifying Spring Boot JPA backend schemas |
| **Movie Details** | • 16:9 backdrop banner with subtle blur and edge vignette gradients<br>• Sticky right aside panel for date and cinema selection during scroll<br>• Full cast/crew galleries, age rating pills, and genre tags | • Native mobile apps (iOS / Android) |
| **User Account & Tickets** | • Dark-themed User Profile with 4 tabs (Profile, Orders, Vouchers, Password)<br>• Interactive E-Ticket modal popup with booking QR code and barcode details | • Payment gateway banking integration (handled in payment-service) |
| **Cinema Partners & News** | • Interactive Brand Page (`/brands`) with chain profile switchers<br>• Promotional and movie editorial blog catalog and detail pages | • Third-party advertising network SDKs |

---

## 4. Architecture & Technical Design

### 4.1 Component Architecture Hierarchy

```text
frontend/client-frontend/src/
├── components/
│   ├── Header.jsx                 <-- Sticky glassmorphic top navigation bar
│   ├── Footer.jsx                 <-- Dark luxury footer with brand showcase
│   ├── CustomDropdown.jsx         <-- High z-index reusable filter selector
│   ├── RatingCard.jsx             <-- Age rating badge pills (P, K, T13, T16, T18)
│   ├── TopReviewSection.jsx       <-- Compact review showcase widget
│   ├── FeatureMovies/             <-- Hero carousel with thumbnail rail & dotted texture
│   ├── MovieDetail/               <-- Backdrop banner, sticky booking aside, trailer modal
│   ├── NowPlaying/                <-- Catalog grid, smart toolbar, quick actions
│   ├── CommingSoon/               <-- Upcoming countdown cards and reminder triggers
│   └── UserProfile/               <-- Account tabs, transaction list, E-ticket modal
├── pages/                         <-- Synchronized client view pages
├── redux/                         <-- Redux Toolkit state slices
└── data/                          <-- Brand catalogs, genres, and movie mock data
```

### 4.2 Unified Filter Architecture (`CustomDropdown`)

To prevent third-party select styling conflicts and eliminate card clipping:
1. **Elevated Z-Index Layering:** Explicit `z-50` dropdown positioning guarantees menus float cleanly above movie cards, badges, and sticky headers.
2. **Standardized Trigger Badge:** Formats selection with icons (calendar, pin, format, film reel) and age classification pills (`T18`, `T16`, `T13`, `P`, `K`).
3. **Synchronized Active States:** Highlights selected items with purple/indigo glows and clear-filter resets.

### 4.3 Sticky Aside Panel & Viewport Architecture

- On the **Movie Detail Page**, the main container disables `overflow-x: hidden` to allow CSS `position: sticky; top: 96px;` to function reliably.
- The right aside panel stays fixed alongside the user while they browse lengthy synopsis texts, actor lists, and review feeds.

---

## 5. Domain Pages Refactored

### 5.1 Cinema Showcase Homepage (`/`)
- **Hero Spotlight Rail:** High-resolution movie spotlight with RoPhim-style dotted halftone texture (10px–12px spacing), backdrop glow, and interactive thumbnail navigation.
- **QuickBookingWidget:** One-stop dropdown bar enabling users to pick Movie, Cinema, Date, and Showtime directly from the home screen.
- **Brand Showcase:** Interactive partner strip displaying prominent cinema operators (CGV, Lotte, BHD, Galaxy, Beta, Mega GS, CineStar).
- **VIP Membership Banner:** Promotional banner promoting loyalty rewards and perks.

### 5.2 Now Playing & Movies Catalog (`/phim-dang-chieu`, `/movies`)
- Unified multi-criteria filter toolbar supporting: Genre, Format (2D, 3D, IMAX, 4DX), City, and Age Rating.
- Responsive poster card grid with release tags, IMDb/CineMeow ratings, and quick "Đặt vé" hover buttons.
- Interactive trailer playback modal.

### 5.3 Coming Soon & Blockbuster Hype (`/phim-sap-chieu`)
- Atmospheric dark luxury card grid featuring premiere release countdown badges.
- Interactive notification reminder button ("Nhận thông báo khi có vé").
- Integrated compact `TopReviewSection` fitting neatly within a single viewport frame.

### 5.4 Movie Detail & Showtimes Hub (`/movie/:id`)
- **16:9 Backdrop Banner:** Softly blurred cinematic banner with atmospheric dark vignette gradients for optimal text legibility.
- **Sticky Showtimes Sidebar:** Persists on screen during scrolling for immediate theater and time-slot selection.
- **Metadata Badges:** Color-coded age ratings, runtimes, audio languages, and format tags.
- **Interactive Trailer Modal:** Video popup with smooth backdrop dismissals.

### 5.5 Cinema Chains & Partner Hub (`/brands`)
- Multi-brand switcher allowing users to browse individual cinema chains.
- Dedicated brand profiles featuring amenities (IMAX, Dolby Atmos, Gold Class), address directories, and active brand vouchers.

### 5.6 User Account Profile & E-Ticket Studio (`/profile`)
- Unified dark theme with 4 tabs:
  1. **Thông tin cá nhân:** Account details, avatar, and phone verification status.
  2. **Lịch sử đặt vé:** Order list with status badges (Đã thanh toán, Đã xem, Đã hủy).
  3. **Ưu đãi của tôi:** Saved promotional vouchers and expiry indicators.
  4. **Đổi mật khẩu:** Secure credential update form with visibility toggles.
- **Interactive E-Ticket Modal:** Clicking any booking displays a digital cinema ticket pass complete with booking code, room hall, seat coordinates, and a scannable QR code.

### 5.7 Showtimes Matrix (`/lich-chieu`)
- Horizontal multi-day calendar tab strip with active date highlighting.
- Grouped showtimes organized by cinema brand, branch location, and projection format.

### 5.8 Editorial, Blogs & Promotions (`/promotions`, `/blog`)
- Responsive promotion cards with discount badges, terms of service, and copyable voucher codes.
- Cinema news and film review articles with reading time indicators.

---

## 6. UX Polish & Key Innovations

1. **RoPhim Dotted Halftone Texture:** Custom overlay on hero banners inspired by modern streaming layouts, providing tactile depth without compromising image clarity.
2. **Sticky Aside Panel Without Overflow Clipping:** Reorganized DOM hierarchy to guarantee aside stickiness without breaking page-level scrolling.
3. **Z-Index Layering Integrity:** Standardized all custom dropdowns to `z-50` with portal-like behavior to prevent layering bugs underneath adjacent movie cards.
4. **Digital Cinema Pass (E-Ticket):** Replaced plain order tables with interactive cinema tickets featuring barcode, seat identifiers, and QR codes ready for theater turnstiles.

---

## 7. Risk Management

| Risk | Impact | Mitigation Strategy |
| :--- | :---: | :--- |
| **Dropdown Menus Clipped by Cards** | High | Standardized `CustomDropdown.jsx` with elevated `z-50` indexing and positioned relative containers. |
| **Sticky Sidebar Failing to Stick** | High | Removed `overflow-x: hidden` from parent page wrappers and applied `sticky top-24` with bounded heights. |
| **Hero Image Resolution Degradation** | Medium | Configured Unsplash and CDN image sources with optimized `auto=format&fit=crop&w=1920&q=80` parameters. |
| **Heavy Bundle Size from Video Players** | Medium | Utilized native iframe YouTube embeds inside trailer modals, rendering conditionally only when opened. |

---

## 8. Definition of Done (DoD)

- [x] All 12+ client portal pages adhere to the unified Dark Cinema Design System.
- [x] Application shell (Sticky Header & Footer) fully responsive across mobile, tablet, and desktop viewports.
- [x] `CustomDropdown` component adopted across all catalog filtering toolbars.
- [x] Movie Detail Page features 16:9 backdrop, sticky showtimes sidebar, and trailer modal.
- [x] User Profile page implements 4 tabs and interactive E-ticket QR modal.
- [x] RoPhim-styled halftone texture integrated into hero banner components.
- [x] `npm run build` succeeds cleanly with 0 compilation errors.
- [x] Feature registered and linked in CineMeow Feature Index and Wiki Home.
