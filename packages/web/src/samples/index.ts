import type { FormState } from '../types';

export interface Sample {
  id: string;
  name: string;
  description: string;
  data: FormState;
}

export const SAMPLES: Sample[] = [
  {
    id: 'hds5-example1',
    name: 'HDS-5 Example 1: 36″ CMP Pipe',
    description: 'FHWA HDS-5 worked example — 36" corrugated metal pipe with headwall inlet, moderate flow',
    data: {
      shape: 'circular',
      diameter: 3,
      span: 4,
      rise: 3,
      inletType: 'headwall',
      material: 'cmp',
      designQ: 60,
      tailwater: 1.5,
      length: 200,
      slope: 0.012,
    },
  },
  {
    id: 'highway-box',
    name: 'Highway Crossing Box Culvert',
    description: '6\'×4\' rectangular concrete box culvert with headwall inlet under a highway, high flow',
    data: {
      shape: 'rectangular',
      diameter: 3,
      span: 6,
      rise: 4,
      inletType: 'headwall',
      material: 'concrete',
      designQ: 200,
      tailwater: 3,
      length: 80,
      slope: 0.005,
    },
  },
  {
    id: 'driveway-pipe',
    name: 'Low-Flow Driveway Pipe',
    description: '18" HDPE pipe with projecting inlet for a small driveway crossing',
    data: {
      shape: 'circular',
      diameter: 1.5,
      span: 4,
      rise: 3,
      inletType: 'projecting',
      material: 'hdpe',
      designQ: 10,
      tailwater: 0.5,
      length: 40,
      slope: 0.02,
    },
  },
  {
    id: 'large-storm-drain',
    name: 'Large Storm Drain (60″ RCP)',
    description: '60" reinforced concrete pipe on steep slope with headwall, high design flow',
    data: {
      shape: 'circular',
      diameter: 5,
      span: 4,
      rise: 3,
      inletType: 'headwall',
      material: 'concrete',
      designQ: 300,
      tailwater: 3,
      length: 150,
      slope: 0.015,
    },
  },
  {
    id: 'elliptical-culvert',
    name: 'Elliptical Culvert',
    description: 'Concrete elliptical culvert (5\' span × 3\' rise) with headwall, moderate flow',
    data: {
      shape: 'elliptical',
      diameter: 3,
      span: 5,
      rise: 3,
      inletType: 'headwall',
      material: 'concrete',
      designQ: 80,
      tailwater: 2,
      length: 120,
      slope: 0.008,
    },
  },
  {
    id: 'outlet-control-dominant',
    name: 'Outlet Control Dominant',
    description: 'Long culvert with low slope where outlet control governs — 48" CMP, 500 ft length',
    data: {
      shape: 'circular',
      diameter: 4,
      span: 4,
      rise: 3,
      inletType: 'headwall',
      material: 'cmp',
      designQ: 100,
      tailwater: 3.5,
      length: 500,
      slope: 0.002,
    },
  },
];
