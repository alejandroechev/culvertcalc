import type { CulvertShape, InletType, PipeMaterial } from '@culvertcalc/engine';

export interface FormState {
  shape: CulvertShape;
  diameter: number;
  span: number;
  rise: number;
  inletType: InletType;
  material: PipeMaterial;
  designQ: number;
  tailwater: number;
  length: number;
  slope: number;
}

export const DEFAULT_FORM: FormState = {
  shape: 'circular',
  diameter: 3,
  span: 4,
  rise: 3,
  inletType: 'headwall',
  material: 'concrete',
  designQ: 50,
  tailwater: 2,
  length: 100,
  slope: 0.01,
};
