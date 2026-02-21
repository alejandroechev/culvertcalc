import { describe, it, expect } from 'vitest';
import { inletControl } from '../inlet-control.js';
import { computeGeometry } from '../geometry.js';
import { INLET_COEFFICIENTS } from '../reference.js';

describe('E2: Inlet Control', () => {
  const geom = computeGeometry({ shape: 'circular', diameter: 3 });
  const coeff = INLET_COEFFICIENTS.circular.headwall;

  it('computes headwater for 50 cfs through 3ft circular with headwall', () => {
    const r = inletControl({ Q: 50, geometry: geom, coefficients: coeff, slope: 0.01 });
    expect(r.HW).toBeGreaterThan(0);
    expect(r.HWoverD).toBeGreaterThan(0);
    expect(['unsubmerged', 'submerged']).toContain(r.regime);
  });

  it('headwater increases with increasing flow', () => {
    const r1 = inletControl({ Q: 20, geometry: geom, coefficients: coeff, slope: 0.01 });
    const r2 = inletControl({ Q: 80, geometry: geom, coefficients: coeff, slope: 0.01 });
    expect(r2.HW).toBeGreaterThan(r1.HW);
  });

  it('throws for non-positive flow', () => {
    expect(() => inletControl({ Q: 0, geometry: geom, coefficients: coeff, slope: 0.01 })).toThrow();
  });

  it('handles rectangular culvert', () => {
    const rectGeom = computeGeometry({ shape: 'rectangular', span: 4, rise: 3 });
    const rectCoeff = INLET_COEFFICIENTS.rectangular.headwall;
    const r = inletControl({ Q: 60, geometry: rectGeom, coefficients: rectCoeff, slope: 0.005 });
    expect(r.HW).toBeGreaterThan(0);
  });

  it('slope correction Ks affects headwater', () => {
    const r1 = inletControl({ Q: 50, geometry: geom, coefficients: coeff, slope: 0.02, Ks: 0 });
    const r2 = inletControl({ Q: 50, geometry: geom, coefficients: coeff, slope: 0.02, Ks: -0.5 });
    expect(r2.HW).toBeLessThan(r1.HW);
  });
});
