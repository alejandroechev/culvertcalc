import { describe, it, expect } from 'vitest';
import { computeGeometry } from '../geometry.js';

describe('E1: Culvert Geometry', () => {
  describe('Circular', () => {
    it('computes area, perimeter, hydraulic radius for 3ft diameter', () => {
      const r = computeGeometry({ shape: 'circular', diameter: 3 });
      expect(r.area).toBeCloseTo(Math.PI * 9 / 4, 4);       // 7.069
      expect(r.wettedPerimeter).toBeCloseTo(Math.PI * 3, 4); // 9.425
      expect(r.hydraulicRadius).toBeCloseTo(3 / 4, 4);       // 0.75
      expect(r.D).toBe(3);
    });

    it('throws for non-positive diameter', () => {
      expect(() => computeGeometry({ shape: 'circular', diameter: 0 })).toThrow();
      expect(() => computeGeometry({ shape: 'circular', diameter: -1 })).toThrow();
    });
  });

  describe('Rectangular', () => {
    it('computes for 4ft × 3ft box', () => {
      const r = computeGeometry({ shape: 'rectangular', span: 4, rise: 3 });
      expect(r.area).toBe(12);
      expect(r.wettedPerimeter).toBe(14);
      expect(r.hydraulicRadius).toBeCloseTo(12 / 14, 4);
      expect(r.D).toBe(3);
    });

    it('throws for missing dimensions', () => {
      expect(() => computeGeometry({ shape: 'rectangular', span: 4 })).toThrow();
    });
  });

  describe('Elliptical', () => {
    it('computes for 3ft span × 2ft rise', () => {
      const r = computeGeometry({ shape: 'elliptical', span: 3, rise: 2 });
      expect(r.area).toBeCloseTo(Math.PI * 3 * 2 / 4, 3); // 4.712
      expect(r.D).toBe(2);
      expect(r.hydraulicRadius).toBeGreaterThan(0);
      expect(r.wettedPerimeter).toBeGreaterThan(0);
    });
  });
});
