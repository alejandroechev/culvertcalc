import type { CulvertShape } from '@culvertcalc/engine';

interface Props {
  shape: CulvertShape;
  dim1: number; // diameter or span
  dim2: number; // rise (ignored for circular)
}

export function CrossSection({ shape, dim1, dim2 }: Props) {
  const W = 180, H = 140;
  const cx = W / 2, cy = H / 2;
  const scale = 30;

  return (
    <div className="cross-section">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        {/* Water fill hint */}
        {shape === 'circular' && (
          <>
            <circle cx={cx} cy={cy} r={dim1 * scale / 2}
              fill="none" stroke="var(--primary)" strokeWidth="2.5" />
            <text x={cx} y={cy + 4} textAnchor="middle"
              fontSize="11" fill="var(--text-muted)">
              ⌀{dim1} ft
            </text>
          </>
        )}
        {shape === 'rectangular' && (
          <>
            <rect x={cx - dim1 * scale / 2} y={cy - dim2 * scale / 2}
              width={dim1 * scale} height={dim2 * scale}
              fill="none" stroke="var(--primary)" strokeWidth="2.5" />
            <text x={cx} y={cy - dim2 * scale / 2 - 6} textAnchor="middle"
              fontSize="10" fill="var(--text-muted)">{dim1}ft × {dim2}ft</text>
          </>
        )}
        {shape === 'elliptical' && (
          <>
            <ellipse cx={cx} cy={cy} rx={dim1 * scale / 2} ry={dim2 * scale / 2}
              fill="none" stroke="var(--primary)" strokeWidth="2.5" />
            <text x={cx} y={cy + 4} textAnchor="middle"
              fontSize="10" fill="var(--text-muted)">{dim1}×{dim2} ft</text>
          </>
        )}
      </svg>
    </div>
  );
}
