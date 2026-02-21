// E5: HW-Q rating curve generation
import type { CulvertDimensions } from './geometry.js';
import { computeGeometry } from './geometry.js';
import { inletControl } from './inlet-control.js';
import { outletControl } from './outlet-control.js';
import { controllingHeadwater } from './controlling.js';
import type { InletType, PipeMaterial } from './reference.js';
import { INLET_COEFFICIENTS, MANNINGS_N, ENTRANCE_LOSS_KE } from './reference.js';

export interface RatingCurveInput {
  dimensions: CulvertDimensions;
  inletType: InletType;
  material: PipeMaterial;
  designQ: number;         // design flow (cfs)
  length: number;          // culvert length (ft)
  slope: number;           // culvert slope (ft/ft)
  tailwater: number;       // tailwater depth (ft)
  Ks?: number;
}

export interface RatingCurvePoint {
  Q: number;
  inletHW: number;
  outletHW: number;
  controllingHW: number;
  condition: 'inlet' | 'outlet';
  velocity: number;
}

/**
 * Generate HW-Q rating curve from 10% to 150% of design flow.
 */
export function generateRatingCurve(
  input: RatingCurveInput,
  steps = 15,
): RatingCurvePoint[] {
  const geometry = computeGeometry(input.dimensions);
  const coefficients = INLET_COEFFICIENTS[input.dimensions.shape][input.inletType];
  const n = MANNINGS_N[input.material];
  const Ke = ENTRANCE_LOSS_KE[input.inletType];

  const points: RatingCurvePoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const fraction = 0.1 + (1.4 * i) / steps; // 0.1 to 1.5
    const Q = input.designQ * fraction;

    const ic = inletControl({ Q, geometry, coefficients, slope: input.slope, Ks: input.Ks });
    const oc = outletControl({ Q, geometry, Ke, n, L: input.length, slope: input.slope, tailwater: input.tailwater });
    const ctrl = controllingHeadwater(ic, oc, Q, geometry.area);

    points.push({
      Q: Math.round(Q * 100) / 100,
      inletHW: Math.round(ic.HW * 1000) / 1000,
      outletHW: Math.round(oc.HW * 1000) / 1000,
      controllingHW: Math.round(ctrl.HW * 1000) / 1000,
      condition: ctrl.condition,
      velocity: Math.round(ctrl.velocity * 100) / 100,
    });
  }
  return points;
}

/** Compute a single design point result */
export function computeDesignPoint(input: RatingCurveInput) {
  const geometry = computeGeometry(input.dimensions);
  const coefficients = INLET_COEFFICIENTS[input.dimensions.shape][input.inletType];
  const n = MANNINGS_N[input.material];
  const Ke = ENTRANCE_LOSS_KE[input.inletType];

  const ic = inletControl({ Q: input.designQ, geometry, coefficients, slope: input.slope, Ks: input.Ks });
  const oc = outletControl({ Q: input.designQ, geometry, Ke, n, L: input.length, slope: input.slope, tailwater: input.tailwater });
  const ctrl = controllingHeadwater(ic, oc, input.designQ, geometry.area);

  return { inlet: ic, outlet: oc, controlling: ctrl, geometry };
}
