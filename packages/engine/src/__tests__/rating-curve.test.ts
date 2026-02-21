import { describe, it, expect } from 'vitest';
import { generateRatingCurve, computeDesignPoint } from '../rating-curve.js';
import type { RatingCurveInput } from '../rating-curve.js';

const baseInput: RatingCurveInput = {
  dimensions: { shape: 'circular', diameter: 3 },
  inletType: 'headwall',
  material: 'concrete',
  designQ: 50,
  length: 100,
  slope: 0.01,
  tailwater: 2,
};

describe('E5: HW-Q Rating Curve', () => {
  it('generates correct number of points', () => {
    const curve = generateRatingCurve(baseInput, 10);
    expect(curve).toHaveLength(11); // 0..10 inclusive
  });

  it('flow range spans 10% to 150% of design Q', () => {
    const curve = generateRatingCurve(baseInput, 10);
    expect(curve[0].Q).toBeCloseTo(5, 0);  // 10% of 50
    expect(curve[curve.length - 1].Q).toBeCloseTo(75, 0); // 150% of 50
  });

  it('controlling HW increases monotonically with Q', () => {
    const curve = generateRatingCurve(baseInput);
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i].controllingHW).toBeGreaterThanOrEqual(curve[i - 1].controllingHW);
    }
  });

  it('each point has valid condition', () => {
    const curve = generateRatingCurve(baseInput);
    curve.forEach(p => expect(['inlet', 'outlet']).toContain(p.condition));
  });

  it('computeDesignPoint returns consistent results', () => {
    const dp = computeDesignPoint(baseInput);
    expect(dp.controlling.HW).toBeGreaterThan(0);
    expect(dp.geometry.area).toBeCloseTo(Math.PI * 9 / 4, 3);
  });
});
