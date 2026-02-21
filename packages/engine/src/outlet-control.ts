// E3: Outlet control (FHWA HDS-5 equations)
import type { GeometryResult } from './geometry.js';

export interface OutletControlInput {
  Q: number;              // flow (cfs)
  geometry: GeometryResult;
  Ke: number;             // entrance loss coefficient
  n: number;              // Manning's n
  L: number;              // culvert length (ft)
  slope: number;          // culvert slope (ft/ft)
  tailwater: number;      // tailwater depth above outlet invert (ft)
}

export interface OutletControlResult {
  HW: number;             // headwater depth above inlet invert (ft)
  H: number;              // total energy losses (ft)
  velocityHead: number;   // V²/2g (ft)
  ho: number;             // downstream depth used (ft)
}

const G = 32.2; // acceleration due to gravity (ft/s²)

/**
 * Compute outlet control headwater per HDS-5.
 * H = (Ke + 19.63*n²*L/R^1.33 + 1) * V²/(2g)
 * HW = H + ho - L*S
 * ho = max(tailwater, (dc + D)/2)
 */
export function outletControl(input: OutletControlInput): OutletControlResult {
  const { Q, geometry, Ke, n, L, slope, tailwater } = input;
  const { area, hydraulicRadius: R, D } = geometry;

  if (Q <= 0) throw new Error('Flow Q must be positive');

  const V = Q / area;
  const velocityHead = (V * V) / (2 * G);

  // Friction loss term coefficient: 19.63 = 29 * n² * L / R^(4/3) correction
  // Full formula: H = (Ke + 19.63*n²*L/R^1.333 + 1) * V²/2g
  const frictionCoeff = 19.63 * n * n * L / Math.pow(R, 4 / 3);
  const H = (Ke + frictionCoeff + 1.0) * velocityHead;

  // Approximate critical depth dc ≈ 0.6 * D for full flow
  const dc = 0.6 * D;
  const ho = Math.max(tailwater, (dc + D) / 2);

  const HW = H + ho - L * slope;

  return { HW: Math.max(HW, 0), H, velocityHead, ho };
}
