import type { RatingCurvePoint, ControllingResult, GeometryResult } from '@culvertcalc/engine';
import type { FormState } from '../types';

interface Props {
  form: FormState;
  controlling: ControllingResult;
  geometry: GeometryResult;
  curve: RatingCurvePoint[];
}

export function PrintReport({ form, controlling, geometry, curve }: Props) {
  return (
    <div className="print-report">
      <h1 style={{ textAlign: 'center', marginBottom: 4 }}>CulvertCalc — Hydraulics Report</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: 16 }}>
        FHWA HDS-5 Methodology
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
        <tbody>
          <tr><td style={tdLabel}>Shape</td><td style={tdVal}>{form.shape}</td>
              <td style={tdLabel}>Inlet Type</td><td style={tdVal}>{form.inletType}</td></tr>
          <tr><td style={tdLabel}>Dimensions</td>
              <td style={tdVal}>{form.shape === 'circular' ? `⌀${form.diameter} ft` : `${form.span}×${form.rise} ft`}</td>
              <td style={tdLabel}>Material</td><td style={tdVal}>{form.material}</td></tr>
          <tr><td style={tdLabel}>Length</td><td style={tdVal}>{form.length} ft</td>
              <td style={tdLabel}>Slope</td><td style={tdVal}>{form.slope} ft/ft</td></tr>
          <tr><td style={tdLabel}>Design Q</td><td style={tdVal}>{form.designQ} cfs</td>
              <td style={tdLabel}>Tailwater</td><td style={tdVal}>{form.tailwater} ft</td></tr>
        </tbody>
      </table>

      <h3>Results</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
        <tbody>
          <tr><td style={tdLabel}>Controlling Condition</td><td style={tdVal}>{controlling.condition}</td></tr>
          <tr><td style={tdLabel}>Headwater</td><td style={tdVal}>{controlling.HW.toFixed(2)} ft</td></tr>
          <tr><td style={tdLabel}>HW/D</td><td style={tdVal}>{(controlling.HW / geometry.D).toFixed(2)}</td></tr>
          <tr><td style={tdLabel}>Velocity</td><td style={tdVal}>{controlling.velocity.toFixed(1)} ft/s</td></tr>
        </tbody>
      </table>

      <h3>Rating Curve Data</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={th}>Q (cfs)</th><th style={th}>Inlet HW (ft)</th>
            <th style={th}>Outlet HW (ft)</th><th style={th}>Controlling HW (ft)</th>
            <th style={th}>Condition</th>
          </tr>
        </thead>
        <tbody>
          {curve.map((p, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={td}>{p.Q}</td><td style={td}>{p.inletHW}</td>
              <td style={td}>{p.outletHW}</td><td style={td}>{p.controllingHW}</td>
              <td style={td}>{p.condition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tdLabel: React.CSSProperties = { padding: '4px 8px', fontWeight: 600, borderBottom: '1px solid #ddd', width: '25%' };
const tdVal: React.CSSProperties = { padding: '4px 8px', borderBottom: '1px solid #ddd' };
const th: React.CSSProperties = { padding: '4px 8px', textAlign: 'left' };
const td: React.CSSProperties = { padding: '3px 8px' };
