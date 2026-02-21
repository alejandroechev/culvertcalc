import { describe, it, expect } from 'vitest';
import { outletControl } from '../outlet-control.js';
import { computeGeometry } from '../geometry.js';
import { MANNINGS_N, ENTRANCE_LOSS_KE } from '../reference.js';

describe('E3: Outlet Control', () => {
  const geom = computeGeometry({ shape: 'circular', diameter: 3 });

  it('computes headwater for 50 cfs through 3ft circular, 100ft long', () => {
    const r = outletControl({
      Q: 50, geometry: geom,
      Ke: ENTRANCE_LOSS_KE.headwall, n: MANNINGS_N.concrete,
      L: 100, slope: 0.01, tailwater: 2,
    });
    expect(r.HW).toBeGreaterThan(0);
    expect(r.H).toBeGreaterThan(0);
    expect(r.velocityHead).toBeGreaterThan(0);
  });

  it('headwater increases with culvert length', () => {
    const short = outletControl({
      Q: 50, geometry: geom, Ke: 0.5, n: 0.012,
      L: 50, slope: 0.01, tailwater: 2,
    });
    const long = outletControl({
      Q: 50, geometry: geom, Ke: 0.5, n: 0.012,
      L: 200, slope: 0.01, tailwater: 2,
    });
    expect(long.H).toBeGreaterThan(short.H);
  });

  it('headwater increases with roughness', () => {
    const smooth = outletControl({
      Q: 50, geometry: geom, Ke: 0.5, n: 0.009,
      L: 100, slope: 0.01, tailwater: 2,
    });
    const rough = outletControl({
      Q: 50, geometry: geom, Ke: 0.5, n: 0.024,
      L: 100, slope: 0.01, tailwater: 2,
    });
    expect(rough.H).toBeGreaterThan(smooth.H);
  });

  it('HW is non-negative', () => {
    const r = outletControl({
      Q: 5, geometry: geom, Ke: 0.5, n: 0.012,
      L: 50, slope: 0.05, tailwater: 0.5,
    });
    expect(r.HW).toBeGreaterThanOrEqual(0);
  });
});
