# Feature: Refactor Backend Services into a Parent Module

| Metadata | Details |
| :--- | :--- |
| **Feature ID** | FEAT-ARCH-001 |
| **Category** | Architecture / Refactoring |
| **Target Scope** | `backend/`, `core/` (Multi-module Maven) |
| **Status** | In Progress |
| **Primary Owner** | Backend Core Team |

---

## 1. Overview

### 1.1 Purpose
Consolidate CineMeow's independent backend services into a unified multi-module Maven project hierarchy. Core business-domain services are aggregated under a dedicated parent module named `core` to establish clear module boundaries, simplify dependency management, and prepare the codebase for scalable development.

### 1.2 Background
Previously, backend services existed as detached projects with individual lifecycles and build configurations. As system complexity grew, maintaining independent POMs and configurations introduced duplication and drift. This refactoring unifies all backend code into a single repository and multi-module build hierarchy.

### 1.3 Target Structure

```text
project/
├── pom.xml (Root aggregator)
├── frontend/
│   ├── admin/
│   └── client/
└── backend/
    ├── pom.xml (Backend aggregator & dependency management)
    ├── api-gateway/
    ├── auth/
    ├── core/
    │   ├── pom.xml (Core domain aggregator)
    │   ├── profile/
    │   ├── movie/
    │   ├── cinema/
    │   ├── showtime/
    │   └── promotion/
    ├── booking/
    ├── payment/
    └── notification/
```

- **Core Parent:** Aggregates `profile`, `movie`, `cinema`, `showtime`, and `promotion`.
- **Top-level Backend Modules:** Infrastructure and autonomous edge services (`api-gateway`, `auth`, `booking`, `payment`, `notification`) remain directly under `backend/`.

---

## 2. Goals & Objectives

- Establish a predictable, standardized Maven multi-module hierarchy.
- Consolidate backend source code into a single, cohesive repository.
- Centralize shared dependency management and build plugins without creating tight runtime coupling.
- Preserve 100% of existing business logic, API contracts, and database operations.
- Improve build velocity, CI/CD reproducibility, and local development setup.

---

## 3. Scope

| Category | In Scope | Out of Scope |
| :--- | :--- | :--- |
| **Project Structure** | • Directory restructuring to target layout<br>• Maven POM hierarchy setup (`root`, `backend`, `core`)<br>• Inter-module dependency mapping | • Implementing new functional business features<br>• Rewriting existing domain services or business logic |
| **Build & Config** | • Dependency version convergence<br>• Maven plugin management centralization<br>• Build verification from project root | • Redesigning database schemas<br>• Changing API endpoints or contracts |
| **Infrastructure** | • Verifying local application entry points | • Introducing Kubernetes, Helm, or new cloud orchestrations |

> [!WARNING]
> Any changes to runtime port mapping, shared packaging (monolithic jar), or application startup must be explicitly scoped separately if intended for this phase.

---

## 4. Module Responsibilities

### 4.1 Maven Aggregators

| Module | Location | Type | Responsibility |
| :--- | :--- | :--- | :--- |
| **Root** | `project/pom.xml` | Aggregator | Coordinates whole-project build lifecycle. |
| **Backend** | `backend/pom.xml` | Parent / Aggregator | Manages backend dependency versions (`dependencyManagement`) and plugin configurations. |
| **Core** | `backend/core/pom.xml` | Domain Parent | Aggregates domain modules. **Not a shared utility library.** |

### 4.2 Core Domain Services (`backend/core/`)

- **Profile:** Manages user account profile states, customer data, and preferences.
- **Movie:** Owns film catalogue metadata, genres, age limits, and media assets.
- **Cinema:** Manages physical theaters, auditoriums, and seat topological maps.
- **Showtime:** Manages scheduling calendar, auditorium slot allocation, and conflict detection.
- **Promotion:** Manages voucher issuance, discount calculation rules, and active campaigns.

### 4.3 Autonomous Services (`backend/`)

- **API Gateway:** Global reverse proxy, routing, SSL, and rate limiting.
- **Auth:** Identity validation, JWT generation, and RBAC token checks.
- **Booking:** Ticket reservation workflows, seat locking, and checkout state machines.
- **Payment:** External payment gateway integrations (VNPay, MoMo) and transaction auditing.
- **Notification:** Asynchronous customer alerts, email receipts, and SMS gateways.

---

## 5. Architectural Constraints

- **No Shared Dumping Ground:** The `core` module must remain an aggregator; it must not hold miscellaneous utility code or cross-domain helpers.
- **Strict Boundary Ownership:** Each child module strictly owns its respective domain entities, repositories, and APIs.
- **Zero Circular Dependencies:** Maven dependencies between modules must be strictly acyclic.
- **Runtime vs. Build Time Separation:** Grouping modules under a common Maven parent does not equate to running on a single port or within a single JVM.

> [!IMPORTANT]
> If the eventual requirement is to run core services inside a unified Spring Boot application runtime, a distinct entry-point artifact and configuration packaging strategy must be defined separately.

---

## 6. Implementation Roadmap

### Phase 1: Dependency & Baseline Analysis
- [ ] Map all existing dependencies, plugins, and third-party libraries across services.
- [ ] Identify duplicate dependency versions and establish a version baseline.
- [ ] Document existing port configurations, application profiles, and database connections.

### Phase 2: Maven Multi-Module Hierarchy Setup
- [ ] Configure `project/pom.xml` root POM.
- [ ] Configure `backend/pom.xml` with shared `<dependencyManagement>`.
- [ ] Configure `backend/core/pom.xml` as the parent aggregator.
- [ ] Declare parent coordinates and module references across all child POMs.

### Phase 3: Code Migration & Path Realignment
- [ ] Move service directories into their target layout.
- [ ] Correct relative paths in configuration files and resource bundles.
- [ ] Update build scripts, CI configurations, and local startup profiles.

### Phase 4: Build Verification & Validation
- [ ] Execute clean build: `mvn clean compile` from root directory.
- [ ] Run full test suites across all child modules.
- [ ] Verify application boot and sanity-check health endpoints for each service.

---

## 7. Risk Management

| Risk | Impact | Mitigation Strategy |
| :--- | :---: | :--- |
| **Invalid POM Parent References** | High | Validate relative paths (`<relativePath>`), group IDs, and version coordinates explicitly before migration. |
| **Dependency Version Conflicts** | High | Standardize versions within `backend/pom.xml` under `<dependencyManagement>` to prevent transitively conflicting JARs. |
| **Broken Configuration / Resource Paths** | Medium | Audit Spring `application.yml` resource loaders, file references, and classpath locations after directory relocations. |
| **Accidental Business Logic Drift** | High | Restrict changes strictly to build files and directory paths. Run automated tests to verify zero behavioral changes. |
| **Misconception of Single-Port Execution** | Medium | Clarify in documentation that multi-module packaging does not automatically unify runtime process execution. |

---

## 8. Definition of Done (DoD)

- [ ] All specified modules reside in their designated directory locations.
- [ ] `mvn clean install` passes successfully from the project root without errors.
- [ ] No circular dependencies exist across modules.
- [ ] All existing automated tests continue to pass.
- [ ] No regressions or unexpected contract changes observed in existing APIs.
- [ ] Documentation and developer onboarding guide updated to reflect the new layout.
