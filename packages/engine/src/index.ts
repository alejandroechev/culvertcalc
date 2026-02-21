export { computeGeometry, criticalDepthRatio } from './geometry.js';
export type { GeometryResult, CulvertDimensions } from './geometry.js';

export { inletControl } from './inlet-control.js';
export type { InletControlInput, InletControlResult } from './inlet-control.js';

export { outletControl } from './outlet-control.js';
export type { OutletControlInput, OutletControlResult } from './outlet-control.js';

export { controllingHeadwater } from './controlling.js';
export type { ControllingResult, ControllingCondition } from './controlling.js';

export { generateRatingCurve, computeDesignPoint } from './rating-curve.js';
export type { RatingCurveInput, RatingCurvePoint } from './rating-curve.js';

export { INLET_COEFFICIENTS, MANNINGS_N, ENTRANCE_LOSS_KE } from './reference.js';
export type { InletCoefficients, CulvertShape, InletType, PipeMaterial } from './reference.js';
