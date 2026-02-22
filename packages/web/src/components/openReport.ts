import type { FormState } from '../types';
import type { ControllingResult, GeometryResult, RatingCurvePoint } from '@culvertcalc/engine';

interface ReportData {
  form: FormState;
  controlling: ControllingResult;
  geometry: GeometryResult;
  curve: RatingCurvePoint[];
}

function buildHTML(data: ReportData): string {
  const { form, controlling, geometry, curve } = data;
  const dims = form.shape === 'circular'
    ? `⌀${form.diameter} ft`
    : `${form.span} × ${form.rise} ft`;
  const velocity = (form.designQ / geometry.area).toFixed(1);
  const hwD = (controlling.HW / geometry.D).toFixed(2);

  const curveRows = curve.map(p =>
    `<tr><td>${p.Q}</td><td>${p.inletHW}</td><td>${p.outletHW}</td><td>${p.controllingHW}</td><td>${p.condition}</td></tr>`
  ).join('');

  // Build SVG rating curve chart
  const chartSVG = buildChartSVG(curve, form.designQ);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>CulvertCalc Report</title>
<style>
  body { font-family: 'Segoe UI', system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; color: #212529; }
  h1 { text-align: center; margin-bottom: 4px; }
  .subtitle { text-align: center; color: #666; margin-bottom: 20px; }
  .print-hint { text-align: center; background: #e3f2fd; padding: 8px; border-radius: 6px; margin-bottom: 20px; font-size: 0.85rem; color: #1565c0; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th, td { padding: 6px 10px; border-bottom: 1px solid #ddd; text-align: left; }
  th { font-weight: 600; border-bottom: 2px solid #333; }
  td.label { font-weight: 600; width: 25%; }
  h3 { margin-top: 16px; margin-bottom: 8px; }
  .chart-wrap { text-align: center; margin: 16px 0; }
  @media print {
    .print-hint { display: none; }
    body { padding: 0; }
  }
</style>
</head>
<body>
  <h1>CulvertCalc — Hydraulics Report</h1>
  <p class="subtitle">FHWA HDS-5 Methodology</p>
  <p class="print-hint">💡 Use <strong>Ctrl+P</strong> or <strong>File → Print</strong> to save as PDF</p>

  <h3>Culvert Parameters</h3>
  <table>
    <tr><td class="label">Shape</td><td>${form.shape}</td><td class="label">Inlet Type</td><td>${form.inletType}</td></tr>
    <tr><td class="label">Dimensions</td><td>${dims}</td><td class="label">Material</td><td>${form.material}</td></tr>
    <tr><td class="label">Length</td><td>${form.length} ft</td><td class="label">Slope</td><td>${form.slope} ft/ft</td></tr>
    <tr><td class="label">Design Q</td><td>${form.designQ} cfs</td><td class="label">Tailwater</td><td>${form.tailwater} ft</td></tr>
  </table>

  <h3>Results</h3>
  <table>
    <tr><td class="label">Controlling Condition</td><td>${controlling.condition === 'inlet' ? 'Inlet Control' : 'Outlet Control'}</td></tr>
    <tr><td class="label">Headwater</td><td>${controlling.HW.toFixed(2)} ft</td></tr>
    <tr><td class="label">HW/D Ratio</td><td>${hwD}</td></tr>
    <tr><td class="label">Velocity</td><td>${velocity} ft/s</td></tr>
  </table>

  <h3>HW-Q Rating Curve</h3>
  <div class="chart-wrap">${chartSVG}</div>

  <h3>Rating Curve Data</h3>
  <table>
    <thead><tr><th>Q (cfs)</th><th>Inlet HW (ft)</th><th>Outlet HW (ft)</th><th>Controlling HW (ft)</th><th>Condition</th></tr></thead>
    <tbody>${curveRows}</tbody>
  </table>
</body>
</html>`;
}

function buildChartSVG(curve: RatingCurvePoint[], designQ: number): string {
  if (curve.length === 0) return '';

  const W = 700, H = 350;
  const pad = { top: 30, right: 30, bottom: 50, left: 60 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  const qs = curve.map(p => p.Q);
  const allHW = curve.flatMap(p => [
    typeof p.inletHW === 'number' ? p.inletHW : 0,
    typeof p.outletHW === 'number' ? p.outletHW : 0,
    typeof p.controllingHW === 'number' ? p.controllingHW : 0,
  ]);
  const minQ = Math.min(...qs), maxQ = Math.max(...qs);
  const maxHW = Math.max(...allHW) * 1.1;

  const sx = (q: number) => pad.left + ((q - minQ) / (maxQ - minQ)) * plotW;
  const sy = (hw: number) => pad.top + plotH - (hw / maxHW) * plotH;

  const makeLine = (key: 'inletHW' | 'outletHW' | 'controllingHW', color: string, width: number) => {
    const pts = curve
      .filter(p => typeof p[key] === 'number' && p[key] > 0)
      .map(p => `${sx(p.Q).toFixed(1)},${sy(p[key] as number).toFixed(1)}`)
      .join(' ');
    return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
  };

  // Grid lines
  const gridLines: string[] = [];
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const v = (maxHW / yTicks) * i;
    const y = sy(v);
    gridLines.push(`<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="#ddd" stroke-width="0.5"/>`);
    gridLines.push(`<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#666">${v.toFixed(1)}</text>`);
  }
  const xTicks = 5;
  for (let i = 0; i <= xTicks; i++) {
    const v = minQ + ((maxQ - minQ) / xTicks) * i;
    const x = sx(v);
    gridLines.push(`<line x1="${x}" y1="${pad.top}" x2="${x}" y2="${pad.top + plotH}" stroke="#ddd" stroke-width="0.5"/>`);
    gridLines.push(`<text x="${x}" y="${pad.top + plotH + 16}" text-anchor="middle" font-size="11" fill="#666">${v.toFixed(0)}</text>`);
  }

  // Design Q reference line
  const dqX = sx(designQ);
  const dqLine = designQ >= minQ && designQ <= maxQ
    ? `<line x1="${dqX}" y1="${pad.top}" x2="${dqX}" y2="${pad.top + plotH}" stroke="#999" stroke-dasharray="5,5" stroke-width="1"/>
       <text x="${dqX}" y="${pad.top - 6}" text-anchor="middle" font-size="10" fill="#999">Design Q</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="max-width:100%">
    <rect width="${W}" height="${H}" fill="white" rx="4"/>
    ${gridLines.join('\n')}
    ${dqLine}
    ${makeLine('inletHW', '#0d6efd', 2)}
    ${makeLine('outletHW', '#dc3545', 2)}
    ${makeLine('controllingHW', '#198754', 3)}
    <text x="${W / 2}" y="${H - 6}" text-anchor="middle" font-size="12" fill="#666">Flow Q (cfs)</text>
    <text x="16" y="${H / 2}" text-anchor="middle" font-size="12" fill="#666" transform="rotate(-90,16,${H / 2})">Headwater (ft)</text>
    <g transform="translate(${pad.left + 10},${pad.top + 10})">
      <line x1="0" y1="0" x2="20" y2="0" stroke="#0d6efd" stroke-width="2"/><text x="24" y="4" font-size="10" fill="#333">Inlet Control</text>
      <line x1="0" y1="16" x2="20" y2="16" stroke="#dc3545" stroke-width="2"/><text x="24" y="20" font-size="10" fill="#333">Outlet Control</text>
      <line x1="0" y1="32" x2="20" y2="32" stroke="#198754" stroke-width="3"/><text x="24" y="36" font-size="10" fill="#333">Controlling</text>
    </g>
  </svg>`;
}

export function openReport(data: ReportData) {
  const html = buildHTML(data);
  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}
