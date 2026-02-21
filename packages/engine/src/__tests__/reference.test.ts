import { describe, it, expect } from 'vitest';
import { INLET_COEFFICIENTS, MANNINGS_N, ENTRANCE_LOSS_KE } from '../reference.js';

describe('E6: Reference Data Tables', () => {
  it('has inlet coefficients for all shape × inlet combinations', () => {
    const shapes = ['circular', 'rectangular', 'elliptical'] as const;
    const inlets = ['headwall', 'mitered', 'projecting'] as const;
    for (const s of shapes) {
      for (const i of inlets) {
        const c = INLET_COEFFICIENTS[s][i];
        expect(c.K).toBeGreaterThan(0);
        expect(c.M).toBeGreaterThan(0);
        expect(c.c).toBeGreaterThan(0);
        expect(c.Y).toBeGreaterThan(0);
      }
    }
  });

  it('has Manning n for all pipe materials', () => {
    const materials = ['concrete', 'cmp', 'hdpe', 'pvc', 'steel'] as const;
    for (const m of materials) {
      expect(MANNINGS_N[m]).toBeGreaterThan(0);
      expect(MANNINGS_N[m]).toBeLessThan(0.1);
    }
  });

  it('has entrance loss Ke for all inlet types', () => {
    const inlets = ['headwall', 'mitered', 'projecting'] as const;
    for (const i of inlets) {
      expect(ENTRANCE_LOSS_KE[i]).toBeGreaterThan(0);
      expect(ENTRANCE_LOSS_KE[i]).toBeLessThanOrEqual(1.0);
    }
  });

  it('CMP has higher Manning n than concrete', () => {
    expect(MANNINGS_N.cmp).toBeGreaterThan(MANNINGS_N.concrete);
  });

  it('projecting inlet has highest Ke', () => {
    expect(ENTRANCE_LOSS_KE.projecting).toBeGreaterThan(ENTRANCE_LOSS_KE.headwall);
    expect(ENTRANCE_LOSS_KE.projecting).toBeGreaterThan(ENTRANCE_LOSS_KE.mitered);
  });
});
