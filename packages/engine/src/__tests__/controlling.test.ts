import { describe, it, expect } from 'vitest';
import { controllingHeadwater } from '../controlling.js';
import type { InletControlResult } from '../inlet-control.js';
import type { OutletControlResult } from '../outlet-control.js';

describe('E4: Controlling Headwater', () => {
  it('selects inlet control when inlet HW > outlet HW', () => {
    const inlet: InletControlResult = { HW: 5.0, HWoverD: 1.67, regime: 'unsubmerged' };
    const outlet: OutletControlResult = { HW: 3.5, H: 2.0, velocityHead: 0.5, ho: 2.0 };
    const r = controllingHeadwater(inlet, outlet, 50, 7.07);
    expect(r.condition).toBe('inlet');
    expect(r.HW).toBe(5.0);
  });

  it('selects outlet control when outlet HW > inlet HW', () => {
    const inlet: InletControlResult = { HW: 3.0, HWoverD: 1.0, regime: 'unsubmerged' };
    const outlet: OutletControlResult = { HW: 6.0, H: 4.0, velocityHead: 0.8, ho: 3.0 };
    const r = controllingHeadwater(inlet, outlet, 50, 7.07);
    expect(r.condition).toBe('outlet');
    expect(r.HW).toBe(6.0);
  });

  it('computes velocity correctly', () => {
    const inlet: InletControlResult = { HW: 5.0, HWoverD: 1.67, regime: 'unsubmerged' };
    const outlet: OutletControlResult = { HW: 3.5, H: 2.0, velocityHead: 0.5, ho: 2.0 };
    const r = controllingHeadwater(inlet, outlet, 50, 10);
    expect(r.velocity).toBeCloseTo(5.0, 4);
  });
});
