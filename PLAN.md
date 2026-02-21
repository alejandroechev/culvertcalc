# CulvertCalc — Culvert Hydraulics (HDS-5)

## Mission
Replace HY-8 (painful Windows tool) with a browser-based culvert calculator per FHWA HDS-5.

## Architecture
- `packages/engine/` — Inlet/outlet control calculations, HW-Q curves, 6 flow types
- `packages/web/` — React + Vite, culvert cross-section diagram, HW-Q chart
- `packages/cli/` — Node runner for batch culvert sizing

## MVP Features (Free Tier)
1. Enter culvert geometry (circular, rectangular, elliptical)
2. Define inlet configuration (projecting, mitered, headwall)
3. Enter design flow and tailwater elevation
4. Compute inlet control and outlet control headwater — report controlling condition
5. Output HW-Q rating curve plot
6. Single-culvert summary report (PDF)

## Engine Tasks

### E1: Culvert Geometry
- Circular: diameter → area, wetted perimeter, hydraulic radius
- Rectangular: width × height → same
- Elliptical: span × rise → same (approximation formulas)
- **Validation**: Manual geometry calculation

### E2: Inlet Control (FHWA HDS-5 equations)
- Unsubmerged: `HW/D = Hc/D + K × (Q/(A×D^0.5))^M + Ks × S`
- Submerged: `HW/D = c × (Q/(A×D^0.5))^2 + Y + Ks × S`
- K, M, c, Y coefficients from HDS-5 Chart 1-4 tables (by shape + inlet type)
- **Validation**: HDS-5 worked examples (published by FHWA, public domain)

### E3: Outlet Control (FHWA HDS-5 equations)
- `HW = H + ho - L×S`
- H = entrance loss + friction loss + exit loss
- `H = (Ke + 19.63×n²×L/R^1.33 + 1) × V²/2g`
- Manning's n by material, Ke by inlet type
- **Validation**: HDS-5 worked examples

### E4: Controlling Headwater
- Compare inlet control HW vs outlet control HW
- Controlling = higher of the two
- Report which condition controls

### E5: HW-Q Rating Curve
- Compute HW for range of Q values (10% to 150% of design Q)
- Generate [Q, HW_inlet, HW_outlet, HW_controlling] data series
- **Validation**: Match HDS-5 nomograph readings

### E6: Reference Data Tables
- Inlet coefficients K, M, c, Y for each shape × inlet type combination
- Manning's n values by pipe material (concrete, CMP, HDPE, PVC)
- Entrance loss coefficients Ke
- All from FHWA HDS-5 (public domain)

## Web UI Tasks

### W1: Culvert Input Form
- Shape selector (circular/rectangular/elliptical)
- Dimension inputs with cross-section diagram that updates live
- Inlet type selector with visual icons
- Material selector → auto-fill Manning's n

### W2: Flow & Tailwater Inputs
- Design flow (cfs), tailwater elevation (ft)
- Culvert length, slope, invert elevations

### W3: HW-Q Chart
- Recharts line chart: Q vs HW for inlet control, outlet control, controlling
- Highlight design flow point
- Hover for exact values

### W4: Results Summary
- Controlling condition (inlet/outlet)
- Design HW, velocity, outlet velocity
- Pass/fail against max allowable HW

### W5: Report
- Print-friendly single-culvert summary
- Cross-section diagram + HW-Q chart + results table

### W6: Toolbar & Theme
- New, Calculate, Report buttons
- Light/dark theme

## Key Equations (FHWA HDS-5 — public domain)
- Inlet control unsubmerged: `HW/D = Hc/D + K(Q/AD^0.5)^M + KsS`
- Inlet control submerged: `HW/D = c(Q/AD^0.5)^2 + Y + KsS`
- Outlet control: `HW = H + ho - LS`, where `H = (Ke + 19.63n²L/R^1.33 + 1)V²/2g`
- Manning's: `V = (1.49/n) × R^(2/3) × S^(1/2)`

## Validation Strategy
- FHWA HDS-5 Example Problems (published, public domain)
- Compare to HY-8 output for identical inputs
- Manual nomograph readings from HDS-5 charts
