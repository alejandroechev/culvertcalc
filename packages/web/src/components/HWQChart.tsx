import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useRef } from 'react';
import type { RatingCurvePoint } from '@culvertcalc/engine';
import { exportChartPNG, exportChartSVG } from './exportUtils';

interface Props {
  data: RatingCurvePoint[];
  designQ: number;
}

export function HWQChart({ data, designQ }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  if (data.length === 0) return null;

  return (
    <div className="card">
      <h2>HW-Q Rating Curve</h2>
      <div className="chart-container" ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="Q" label={{ value: 'Flow Q (cfs)', position: 'bottom', offset: 0 }}
              stroke="var(--text-muted)" />
            <YAxis label={{ value: 'Headwater (ft)', angle: -90, position: 'insideLeft' }}
              stroke="var(--text-muted)" />
            <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
            <Legend verticalAlign="top" />
            <ReferenceLine x={designQ} stroke="var(--text-muted)" strokeDasharray="5 5"
              label={{ value: 'Design Q', position: 'top', fill: 'var(--text-muted)', fontSize: 11 }} />
            <Line type="monotone" dataKey="inletHW" name="Inlet Control"
              stroke="#0d6efd" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="outletHW" name="Outlet Control"
              stroke="#dc3545" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="controllingHW" name="Controlling"
              stroke="#198754" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="export-bar">
        <button onClick={() => chartRef.current && exportChartPNG(chartRef.current)}>📥 PNG</button>
        <button onClick={() => chartRef.current && exportChartSVG(chartRef.current)}>📥 SVG</button>
      </div>
    </div>
  );
}
