# Feature: [Feature Name]

| Metadata | Details |
| :--- | :--- |
| **Feature ID** | FEAT-XXX |
| **Category** | [Business Feature / Architecture / Technical Debt / Integration] |
| **Target Services** | [e.g., booking-service, payment-service, admin-frontend] |
| **Status** | [In Design / Planned / In Progress / Live] |
| **Priority** | [P0 - Critical / P1 - High / P2 - Medium / P3 - Low] |
| **Author / Tech Lead** | [Name or Team] |

---

## 1. Overview

### 1.1 Purpose
[Describe what this feature does and what business problem it solves.]

### 1.2 Background & User Problem
[Context regarding the current limitation or customer pain point.]

---

## 2. Goals & Success Metrics

- [Primary operational or business goal 1]
- [Primary operational or business goal 2]
- **Success Metric:** [e.g., 99.9% booking success rate, <200ms API latency]

---

## 3. Scope

| In Scope | Out of Scope |
| :--- | :--- |
| • [Specific capability included] | • [Related capability deferred to later phase] |
| • [Specific API or UI flow included] | • [Infrastructure or edge case explicitly excluded] |

---

## 4. Architecture & Technical Design

### 4.1 Affected Components
- **[Service Name]:** [What changes inside this service]
- **[Database / Storage]:** [New tables, migrations, or cache keys]

### 4.2 API Contracts (If Applicable)
```http
POST /api/v1/resource
Content-Type: application/json

{
  "field": "value"
}
```

### 4.3 Key Technical Decisions
- [Decision 1: Why chosen, alternatives rejected]
- [Decision 2: Performance or consistency trade-off]

---

## 5. Implementation Roadmap

### Phase 1: Preparation & Design
- [ ] [Task 1]
- [ ] [Task 2]

### Phase 2: Core Development
- [ ] [Task 3]
- [ ] [Task 4]

### Phase 3: Testing & Rollout
- [ ] [Task 5]
- [ ] [Task 6]

---

## 6. Risks & Mitigation

| Risk Description | Severity | Mitigation Strategy |
| :--- | :---: | :--- |
| [Potential failure mode or latency risk] | [High / Med / Low] | [How to prevent or recover from this risk] |

---

## 7. Definition of Done (DoD)

- [ ] Core business requirements implemented and verified.
- [ ] Automated unit and integration tests written (coverage >= 80%).
- [ ] API documentation (Swagger/OpenAPI) updated.
- [ ] Wiki Feature Index status updated to `Live`.
