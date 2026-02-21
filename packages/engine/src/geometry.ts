// E1: Culvert geometry calculations
import type { CulvertShape } from './reference.js';

export interface GeometryResult {
  /** Full cross-sectional area (ft²) */
  area: number;
  /** Wetted perimeter (ft) */
  wettedPerimeter: number;
  /** Hydraulic radius = A/P (ft) */
  hydraulicRadius: number;
  /** Characteristic vertical dimension D (ft) — diameter or rise */
  D: number;
}

export interface CulvertDimensions {
  shape: CulvertShape;
  /** Diameter for circular (ft) */
  diameter?: number;
  /** Width/span for rectangular or elliptical (ft) */
  span?: number;
  /** Height/rise for rectangular or elliptical (ft) */
  rise?: number;
}

export function computeGeometry(dims: CulvertDimensions): GeometryResult {
  switch (dims.shape) {
    case 'circular': {
      const d = dims.diameter;
      if (!d || d <= 0) throw new Error('Diameter must be positive');
      const area = (Math.PI / 4) * d * d;
      const wettedPerimeter = Math.PI * d;
      return { area, wettedPerimeter, hydraulicRadius: area / wettedPerimeter, D: d };
    }
    case 'rectangular': {
      const w = dims.span;
      const h = dims.rise;
      if (!w || !h || w <= 0 || h <= 0) throw new Error('Span and rise must be positive');
      const area = w * h;
      const wettedPerimeter = 2 * (w + h);
      return { area, wettedPerimeter, hydraulicRadius: area / wettedPerimeter, D: h };
    }
    case 'elliptical': {
      const a = dims.span;
      const b = dims.rise;
      if (!a || !b || a <= 0 || b <= 0) throw new Error('Span and rise must be positive');
      const area = (Math.PI / 4) * a * b;
      // Ramanujan approximation for ellipse perimeter
      const h = ((a / 2 - b / 2) ** 2) / ((a / 2 + b / 2) ** 2);
      const wettedPerimeter = Math.PI * (a / 2 + b / 2) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
      return { area, wettedPerimeter, hydraulicRadius: area / wettedPerimeter, D: b };
    }
    default:
      throw new Error(`Unknown shape: ${dims.shape}`);
  }
}

/** Critical depth Hc/D approximation for full-pipe flow */
export function criticalDepthRatio(Q: number, area: number, D: number, g = 32.2): number {
  // Approximate Hc/D using specific energy at critical flow
  const V = Q / area;
  const Fr2 = (V * V) / (g * D);
  // Hc/D ≈ 0.5 * (Fr^2 + 1)^(1/3) — simplified for full pipe
  return Math.min(0.5 * Math.pow(Fr2 + 1, 1 / 3), 1.0);
}
