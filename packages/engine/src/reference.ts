// FHWA HDS-5 Reference Data Tables (public domain)

/** Inlet control coefficients by shape and inlet type */
export interface InletCoefficients {
  /** Unsubmerged coefficient K */
  K: number;
  /** Unsubmerged exponent M */
  M: number;
  /** Submerged coefficient c */
  c: number;
  /** Submerged constant Y */
  Y: number;
}

export type CulvertShape = 'circular' | 'rectangular' | 'elliptical';
export type InletType = 'projecting' | 'mitered' | 'headwall';

/** HDS-5 Chart 1-4 inlet coefficients (Form 1 equations) */
export const INLET_COEFFICIENTS: Record<CulvertShape, Record<InletType, InletCoefficients>> = {
  circular: {
    headwall:   { K: 0.0098, M: 2.0, c: 0.0398, Y: 0.67 },
    mitered:    { K: 0.0078, M: 2.0, c: 0.0210, Y: 0.74 },
    projecting: { K: 0.0045, M: 2.0, c: 0.0317, Y: 0.69 },
  },
  rectangular: {
    headwall:   { K: 0.0083, M: 2.0, c: 0.0379, Y: 0.69 },
    mitered:    { K: 0.0145, M: 2.0, c: 0.0300, Y: 0.74 },
    projecting: { K: 0.0340, M: 1.0, c: 0.0496, Y: 0.57 },
  },
  elliptical: {
    headwall:   { K: 0.0098, M: 2.0, c: 0.0398, Y: 0.67 },
    mitered:    { K: 0.0078, M: 2.0, c: 0.0210, Y: 0.74 },
    projecting: { K: 0.0045, M: 2.0, c: 0.0317, Y: 0.69 },
  },
};

export type PipeMaterial = 'concrete' | 'cmp' | 'hdpe' | 'pvc' | 'steel';

/** Manning's n by pipe material */
export const MANNINGS_N: Record<PipeMaterial, number> = {
  concrete: 0.012,
  cmp:      0.024,
  hdpe:     0.012,
  pvc:      0.009,
  steel:    0.012,
};

/** Entrance loss coefficient Ke by inlet type */
export const ENTRANCE_LOSS_KE: Record<InletType, number> = {
  headwall:   0.5,
  mitered:    0.7,
  projecting: 0.9,
};
