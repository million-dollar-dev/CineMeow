# CineMeow Feature Index & Roadmap

This page serves as the single source of truth for tracking the implementation status, architectural scope, and service dependencies for all CineMeow platform features.

> [!TIP]
> Before implementing any new feature, register it here with an allocated `FEAT-XXX` code, specify its target microservices, and link its design document.

---

## Status Legend

| Status | Badge | Definition |
| :--- | :---: | :--- |
| **Live** | `🟢 Live` | Fully implemented, tested, and running in production/staging. |
| **In Progress** | `🟡 In Progress` | Currently being implemented or under code review. |
| **Planned** | `🔵 Planned` | Requirements and acceptance criteria approved; ready for sprint backlog. |
| **In Design** | `🟣 In Design` | Architecture, data modeling, or API contract discussion underway. |

---

## Comprehensive Feature Catalog

| Code | Feature Title | Target Microservices | Priority | Status | Specification Doc |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **FEAT-UI-001** | Admin Portal UI/UX Refactoring & Design System | `admin-frontend`, `design-system` | P0 | `🟢 Live` | [[Feature-Admin-UI-UX-Refactoring]] |
| **FEAT-ARCH-001** | Refactor Backend into Parent Module | `backend/`, `core/` | P0 | `🟡 In Progress` | [[Feature-Refactor-Backend-Services]] |
| **FEAT-001** | Real-time Seat Hold & Release | `booking-service`, Redis | P0 | `🟢 Live` | [[Feature-Booking]] |
| **FEAT-002** | Payment Gateway Integration (VNPay / MoMo) | `payment-service` | P0 | `🟢 Live` | [[Feature-Payment]] |
| **FEAT-003** | Cinema & Screen Topology Management | `cinema-service`, `admin-frontend` | P1 | `🟢 Live` | [[Feature-Cinema-Management]] |
| **FEAT-004** | Dynamic Showtime Scheduling Engine | `showtime-service`, `movie-service` | P1 | `🟢 Live` | [[Feature-Showtimes]] |
| **FEAT-005** | Discount Engine & Voucher Rules | `promotion-service` | P1 | `🟡 In Progress` | [[Feature-Promotion]] |
| **FEAT-006** | Concession (FnB) Ordering & Bundling | `booking-service`, `fnb-service` | P2 | `🟡 In Progress` | [[Feature-FnB-Concessions]] |
| **FEAT-007** | Automated Ticket Refund & Cancellation | `booking-service`, `payment-service` | P1 | `🔵 Planned` | [[Feature-Refund-Handling]] |
| **FEAT-008** | Loyalty Points & Customer Tiering | `profile-service`, `promotion-service` | P2 | `🔵 Planned` | [[Feature-Loyalty-Program]] |
| **FEAT-009** | Multi-Branch / Tenant Operations | `cinema-service`, `auth-service` | P2 | `🟣 In Design` | [[Feature-Tenant-Management]] |
| **FEAT-010** | Electronic Invoicing & Audit Export | `payment-service`, `notification-service` | P3 | `🟣 In Design` | [[Feature-E-Invoicing]] |

---

## How to Register a New Feature

When proposing a new capability:

1. **Assign an Identifier:** Allocate the next available sequential ID (`FEAT-011`, `FEAT-012`, etc.).
2. **Define Ownership:** Identify all affected microservices (e.g., `booking-service`, `frontend/admin-frontend`).
3. **Assign Initial Status:** Set to `🟣 In Design`.
4. **Create Specification:** Create a dedicated Wiki page named `Feature-<Name>` using the template located at `docs/templates/feature-spec-template.md`.
5. **Update Status:** As development progresses through PRs, update the badge to `🟡 In Progress` and finally `🟢 Live`.
