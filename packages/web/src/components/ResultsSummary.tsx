import type { ControllingResult, InletControlResult, OutletControlResult, GeometryResult } from '@culvertcalc/engine';

interface Props {
  controlling: ControllingResult;
  inlet: InletControlResult;
  outlet: OutletControlResult;
  geometry: GeometryResult;
  designQ: number;
}

export function ResultsSummary({ controlling, inlet, outlet, geometry, designQ }: Props) {
  const outletVelocity = designQ / geometry.area;

  return (
    <div className="card">
      <h2>Results Summary</h2>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span>Controlling Condition: </span>
        <span className={`condition-badge ${controlling.condition}`}>
          {controlling.condition === 'inlet' ? '⬆ Inlet Control' : '⬇ Outlet Control'}
        </span>
      </div>

      <div className="result-grid">
        <div className="result-item">
          <div className="value">{controlling.HW.toFixed(2)}</div>
          <div className="label">Headwater (ft)</div>
        </div>
        <div className="result-item">
          <div className="value">{(controlling.HW / geometry.D).toFixed(2)}</div>
          <div className="label">HW/D Ratio</div>
        </div>
        <div className="result-item">
          <div className="value">{outletVelocity.toFixed(1)}</div>
          <div className="label">Velocity (ft/s)</div>
        </div>
        <div className="result-item">
          <div className="value">{designQ.toFixed(0)}</div>
          <div className="label">Design Q (cfs)</div>
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div>Inlet Control HW: {inlet.HW.toFixed(2)} ft ({inlet.regime})</div>
        <div>Outlet Control HW: {outlet.HW.toFixed(2)} ft</div>
      </div>
    </div>
  );
}
