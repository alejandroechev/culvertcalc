# CulvertCalc — Business Plan

## Product Summary

**CulvertCalc** is a browser-based culvert hydraulics calculator implementing FHWA HDS-5 equations. It targets civil/hydraulic engineers who currently rely on HY-8 (free but Windows-only desktop app from FHWA) or CulvertMaster (~$1,500/yr from Bentley). CulvertCalc delivers instant inlet control, outlet control, and HW-Q rating curves with zero installation.

**Live:** [culvertcalc.vercel.app](https://culvertcalc.vercel.app)

---

## Market Analysis

### Target Users
- Civil engineers designing road crossings and drainage structures
- DOT reviewers checking culvert submittals
- Environmental consultants sizing stream crossings
- Engineering students learning culvert hydraulics

### Competitors

| Product | Price | Platform | Strengths | Weaknesses |
|---------|-------|----------|-----------|------------|
| **HY-8** (FHWA) | Free | Windows desktop | Government standard, multi-barrel, energy dissipators | Windows-only, dated UI, no cloud, no mobile |
| **CulvertMaster** (Bentley) | ~$1,500/yr | Windows desktop | Full-featured, CAD integration | Expensive, heavyweight install, subscription lock-in |
| **CulvertCalc** | Free / Freemium | Browser (any device) | Instant access, modern UI, mobile-friendly, HDS-5 validated | Single culvert only (MVP), no multi-barrel yet |

### Opportunity
HY-8 is the de facto standard but is a legacy Windows app with no web version. CulvertMaster is expensive and overkill for quick sizing. There is no modern, browser-based alternative that implements HDS-5 correctly. CulvertCalc fills this gap.

---

## Current State (MVP)

### Features Shipped
- Three culvert shapes: circular, rectangular, elliptical
- Inlet control (unsubmerged + submerged) per HDS-5
- Outlet control with entrance, friction, and exit losses
- Controlling headwater determination
- Interactive HW-Q rating curve (10%–150% of design Q)
- Built-in reference data (K/M/c/Y coefficients, Manning's n, Ke)
- Print-friendly single-culvert report
- Light/dark theme

### Test Coverage
- **48 tests** (27 unit + 21 E2E)
- Validated against FHWA HDS-5 worked examples
- HY-8 output comparison for cross-validation

### Survey Results (User Validation)
| Metric | Score |
|--------|-------|
| Professional Use | 75% would use professionally |
| Scales to Real Projects | 50% agree |
| Useful Tool | 80% find it useful |
| Incremental Premium ($50-99) | 55% would pay |
| Major Premium ($200+) | 70% would pay |

### Strengths
- Correct HDS-5 equations with full coefficient tables
- Three shapes with live cross-section diagram
- Interactive rating curves with hover values
- Zero install, works on any device

### Weaknesses
- Single culvert only — no multi-barrel analysis
- No debris/blockage modeling
- No fish passage analysis
- No energy dissipator design
- No tailwater rating curves

---

## Monetization Strategy

### Free Tier (Current)
All MVP features remain free forever:
- Single culvert analysis (circular, rectangular, elliptical)
- Inlet and outlet control computation
- HW-Q rating curve (interactive)
- Basic print report
- Full reference data tables

### Phase 2 — Professional ($99–199/yr)

| Feature | Effort | Description |
|---------|--------|-------------|
| Multi-barrel analysis | L | Side-by-side barrels with combined HW-Q curve; handles mixed shapes/sizes |
| PDF rating curve report | M | Branded PDF export with culvert diagram, rating curve chart, results table, and engineer stamp block |
| Tailwater rating curves | M | Downstream channel rating curve input; TW vs Q for accurate outlet control |
| Embankment overtopping | M | Road overflow computation when HW exceeds embankment; combined culvert + overflow discharge |

**Target:** Engineers who need multi-barrel sizing and deliverable reports. Covers 80% of routine DOT culvert design work.

### Phase 3 — Enterprise ($249–399/yr)

| Feature | Effort | Description |
|---------|--------|-------------|
| Energy dissipator design | L | USBR Type II–VI stilling basins and riprap aprons per HEC-14; auto-selects dissipator type from Froude number |
| Fish passage analysis | L | Fish-friendly culvert design per FHWA HEC-26; embedment depth, velocity barriers, passage flow windows |
| Scour analysis | L | Outlet scour prediction per HEC-18; scour hole geometry, riprap sizing, countermeasure selection |
| FEMA compliance reports | XL | FEMA flood study format reports; no-rise certification documentation; floodway analysis outputs |

**Target:** Specialists doing environmental permitting, FEMA studies, and stream restoration projects. Competes directly with CulvertMaster's advanced features at 1/5 the price.

---

## Revenue Projections

| Scenario | Free Users | Pro ($149 avg) | Enterprise ($324 avg) | ARR |
|----------|-----------|----------------|----------------------|-----|
| Conservative (Y1) | 2,000 | 40 (2%) | 5 (0.25%) | $7,580 |
| Moderate (Y2) | 5,000 | 150 (3%) | 30 (0.6%) | $32,070 |
| Optimistic (Y3) | 10,000 | 400 (4%) | 100 (1%) | $92,000 |

### Key Assumptions
- Civil engineering is a smaller niche than lab sciences — lower total addressable market
- Government engineers (DOT) may face procurement hurdles — focus on consultants first
- HY-8 is free but desktop-only; conversion opportunity is convenience + reports + multi-barrel
- CulvertMaster users are price-sensitive — $249/yr vs $1,500/yr is compelling

---

## Validation Plan

### Phase 2 Validation
- All FHWA HDS-5 worked examples (Chapter 3, 4, 5)
- Multi-barrel: HY-8 output comparison for twin and triple barrel configurations
- Tailwater: verify against known channel rating curves
- Overtopping: FHWA HDS-5 Chapter 6 embankment overflow examples

### Phase 3 Validation
- Energy dissipators: USBR Engineering Monograph No. 25 worked examples
- Fish passage: FHWA HEC-26 design examples and Washington DOF guidelines
- Scour: HEC-18 worked examples and NCHRP Report 568 data
- FEMA reports: compare format against accepted FEMA submissions

### Ongoing QA
- Regression suite against HY-8 output for all supported configurations
- Each new feature adds ≥10 validated test cases
- Cross-platform testing (Chrome, Firefox, Safari, mobile)

---

## Go-to-Market

### Phase 1 — Awareness (Current)
- SEO for "culvert calculator online", "HDS-5 calculator", "free culvert sizing"
- Reddit/LinkedIn posts in civil engineering communities
- Submit to FHWA resource lists and university course materials

### Phase 2 — Conversion
- Freemium gate: multi-barrel and PDF reports require account
- Engineering blog posts: "HDS-5 Culvert Design: Step-by-Step Guide"
- Conference presence: TRB Annual Meeting, State DOT workshops
- DOT pilot programs: offer free Enterprise tier to one state DOT for testimonials

### Phase 3 — Expansion
- API access for integration with GIS and CAD workflows
- Batch analysis (CSV upload → multi-culvert results)
- Integration with StormLab for watershed-to-culvert workflow
- CE continuing education credit partnerships

---

## Technical Roadmap

```
Phase 1 (MVP) ✅ Complete
├── HDS-5 inlet/outlet control
├── 3 shapes (circular, rectangular, elliptical)
├── HW-Q rating curves
├── Print report
└── 48 validated tests

Phase 2 (Professional) — Q3-Q4 2025
├── Multi-barrel engine + combined curves
├── PDF export (react-pdf or jsPDF)
├── Tailwater rating curve input
└── Embankment overtopping module

Phase 3 (Enterprise) — 2026
├── Energy dissipator selection + sizing
├── Fish passage velocity/depth analysis
├── Outlet scour prediction
└── FEMA compliance report generator
```

---

## Key Metrics

| Metric | Target |
|--------|--------|
| Monthly active users | 500 (Y1), 2,000 (Y2) |
| Free → Pro conversion | 3% |
| Pro → Enterprise upsell | 15% |
| Churn (annual) | < 20% |
| Test coverage | > 90% |
| HDS-5 validation | 100% of published examples |
| Support response time | < 24 hours |

---

## Risk Factors

| Risk | Mitigation |
|------|------------|
| HY-8 releases a web version | Move faster on multi-barrel + reports; HY-8 development is slow (government pace) |
| Small addressable market | Keep costs near zero (Vercel free tier); cross-sell with StormLab |
| Engineers distrust browser tools | Publish full validation suite; show HDS-5 equation references inline |
| Government procurement barriers | Target private consultants first; offer invoicing for DOT purchases |
| Bentley undercuts on price | Compete on UX and accessibility, not just price |
