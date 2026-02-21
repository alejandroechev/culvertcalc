// E4: Controlling headwater determination
import type { InletControlResult } from './inlet-control.js';
import type { OutletControlResult } from './outlet-control.js';

export type ControllingCondition = 'inlet' | 'outlet';

export interface ControllingResult {
  HW: number;
  condition: ControllingCondition;
  inletHW: number;
  outletHW: number;
  velocity: number;
}

export function controllingHeadwater(
  inlet: InletControlResult,
  outlet: OutletControlResult,
  Q: number,
  area: number,
): ControllingResult {
  const condition: ControllingCondition = inlet.HW >= outlet.HW ? 'inlet' : 'outlet';
  const HW = Math.max(inlet.HW, outlet.HW);
  const velocity = Q / area;
  return { HW, condition, inletHW: inlet.HW, outletHW: outlet.HW, velocity };
}
