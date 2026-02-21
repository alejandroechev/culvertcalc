// E2: Inlet control (FHWA HDS-5 equations)
import type { GeometryResult } from './geometry.js';
import { criticalDepthRatio } from './geometry.js';
import type { InletCoefficients } from './reference.js';

export interface InletControlInput {
  Q: number;            // flow (cfs)
  geometry: GeometryResult;
  coefficients: InletCoefficients;
  slope: number;        // culvert slope (ft/ft)
  Ks?: number;          // slope correction factor (-0.5 for mitered, 0 otherwise)
}

export interface InletControlResult {
  HW: number;           // headwater depth (ft)
  HWoverD: number;      // HW/D ratio
  regime: 'unsubmerged' | 'submerged';
}

/**
 * Compute inlet control headwater per HDS-5 Form 1 equations.
 * Unsubmerged: HW/D = Hc/D + K*(Q/(A*D^0.5))^M + Ks*S
 * Submerged:   HW/D = c*(Q/(A*D^0.5))^2 + Y + Ks*S
 * Transition at Q/(A*D^0.5) ≈ 3.5 (HDS-5 guidance)
 */
export function inletControl(input: InletControlInput): InletControlResult {
  const { Q, geometry, coefficients, slope } = input;
  const { area, D } = geometry;
  const { K, M, c, Y } = coefficients;
  const Ks = input.Ks ?? 0;

  if (Q <= 0) throw new Error('Flow Q must be positive');

  const Qstar = Q / (area * Math.sqrt(D));

  // Compute both regimes
  const HcOverD = criticalDepthRatio(Q, area, D);
  const hwUnsubmerged = HcOverD + K * Math.pow(Qstar, M) + Ks * slope;
  const hwSubmerged = c * Qstar * Qstar + Y + Ks * slope;

  // Use whichever is larger (smooth transition)
  if (hwSubmerged > hwUnsubmerged) {
    return { HW: hwSubmerged * D, HWoverD: hwSubmerged, regime: 'submerged' };
  }
  return { HW: hwUnsubmerged * D, HWoverD: hwUnsubmerged, regime: 'unsubmerged' };
}
