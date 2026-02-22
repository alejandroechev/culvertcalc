import type { RatingCurvePoint } from '@culvertcalc/engine';

// CSV export for results/rating curve
export function exportResultsCSV(
  curve: RatingCurvePoint[],
  designQ: number,
  controllingHW: number,
  condition: string,
) {
  const header = 'Q (cfs),Inlet HW (ft),Outlet HW (ft),Controlling HW (ft),Condition';
  const rows = curve.map(p =>
    `${p.Q},${p.inletHW},${p.outletHW},${p.controllingHW},${p.condition}`
  );
  const summary = `\nDesign Point\n${designQ},,,${controllingHW},${condition}`;
  const csv = [header, ...rows, summary].join('\n');
  downloadBlob(csv, 'culvertcalc-results.csv', 'text/csv');
}

// PNG export from chart container
export function exportChartPNG(container: HTMLElement) {
  const svg = container.querySelector('svg');
  if (!svg) return;
  const clone = svg.cloneNode(true) as SVGElement;

  // Inline computed styles for recharts elements
  const origEls = svg.querySelectorAll('*');
  const cloneEls = clone.querySelectorAll('*');
  origEls.forEach((el, i) => {
    const cs = getComputedStyle(el);
    const target = cloneEls[i] as SVGElement;
    if (cs.fill) target.style.fill = cs.fill;
    if (cs.stroke) target.style.stroke = cs.stroke;
    if (cs.strokeWidth) target.style.strokeWidth = cs.strokeWidth;
    if (cs.fontSize) target.style.fontSize = cs.fontSize;
    if (cs.fontFamily) target.style.fontFamily = cs.fontFamily;
  });

  const data = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([data], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(b => {
      if (b) downloadBlob(b, 'culvertcalc-chart.png', 'image/png');
      URL.revokeObjectURL(url);
    });
  };
  img.src = url;
}

// SVG export from chart container
export function exportChartSVG(container: HTMLElement) {
  const svg = container.querySelector('svg');
  if (!svg) return;
  const clone = svg.cloneNode(true) as SVGElement;

  const origEls = svg.querySelectorAll('*');
  const cloneEls = clone.querySelectorAll('*');
  origEls.forEach((el, i) => {
    const cs = getComputedStyle(el);
    const target = cloneEls[i] as SVGElement;
    if (cs.fill) target.style.fill = cs.fill;
    if (cs.stroke) target.style.stroke = cs.stroke;
    if (cs.strokeWidth) target.style.strokeWidth = cs.strokeWidth;
    if (cs.fontSize) target.style.fontSize = cs.fontSize;
    if (cs.fontFamily) target.style.fontFamily = cs.fontFamily;
  });

  const data = new XMLSerializer().serializeToString(clone);
  downloadBlob(data, 'culvertcalc-chart.svg', 'image/svg+xml');
}

function downloadBlob(content: string | Blob, filename: string, type: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
