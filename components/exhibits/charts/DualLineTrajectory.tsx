interface SeriesPoint {
  /** Rank for this year, or null when the institution has no entry that year (renders as a gap, never interpolated). */
  value: number | null;
  display?: string;
}

interface TrajectorySeries {
  label: string;
  color: string;
  points: SeriesPoint[];
}

interface DualLineTrajectoryProps {
  /** Shared x-axis; series.points must be the same length and aligned to this array. */
  years: string[];
  series: TrajectorySeries[];
  scaleMax?: number;
  title?: string;
}

const WIDTH = 640;
const HEIGHT = 220;
const PAD_X = 28;
const PAD_TOP = 40;
const PAD_BOTTOM = 34;

/** Contiguous runs of non-null indices, so a missing year breaks the line instead of interpolating across it. */
function runsOf(points: SeriesPoint[]): number[][] {
  const runs: number[][] = [];
  let current: number[] = [];
  points.forEach((p, i) => {
    if (p.value != null) {
      current.push(i);
    } else if (current.length) {
      runs.push(current);
      current = [];
    }
  });
  if (current.length) runs.push(current);
  return runs;
}

/**
 * Two-line rank trajectory sharing one year axis, for a "consistently strong,
 * got stronger" story rather than a single rise-then-fall arc. A null point
 * (an institution absent from a given year's data) breaks the line rather
 * than being interpolated across.
 */
export function DualLineTrajectory({ years, series, scaleMax = 60, title }: DualLineTrajectoryProps) {
  const plotWidth = WIDTH - PAD_X * 2;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const xFor = (i: number) => PAD_X + (i / (years.length - 1)) * plotWidth;
  const yFor = (v: number) => PAD_TOP + (v / scaleMax) * plotHeight;

  return (
    <div className="my-2">
      {title ? <div className="font-sans text-[14px] font-semibold text-ink mb-2">{title}</div> : null}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label={title ?? 'Rank trajectory chart'}
      >
        <line x1={PAD_X} y1={PAD_TOP} x2={WIDTH - PAD_X} y2={PAD_TOP} stroke="var(--color-rule-soft)" strokeWidth={1} />
        <line
          x1={PAD_X}
          y1={HEIGHT - PAD_BOTTOM}
          x2={WIDTH - PAD_X}
          y2={HEIGHT - PAD_BOTTOM}
          stroke="var(--color-rule-soft)"
          strokeWidth={1}
        />
        {series.map((s, si) => (
          <g key={si}>
            {runsOf(s.points).map((run, ri) => {
              const d = run
                .map((i, j) => `${j === 0 ? 'M' : 'L'} ${xFor(i).toFixed(1)} ${yFor(s.points[i]!.value as number).toFixed(1)}`)
                .join(' ');
              return <path key={ri} d={d} fill="none" stroke={s.color} strokeWidth={1.75} />;
            })}
            {s.points.map((p, i) =>
              p.value != null ? <circle key={i} cx={xFor(i)} cy={yFor(p.value)} r={3.5} fill={s.color} /> : null,
            )}
          </g>
        ))}
        {years.map((y, i) => (
          <text
            key={i}
            x={xFor(i)}
            y={HEIGHT - PAD_BOTTOM + 20}
            textAnchor="middle"
            style={{ fontSize: 10.5, fill: 'var(--color-mute)', fontFamily: 'var(--font-sans)' }}
          >
            {y}
          </text>
        ))}
        {series.map((s, si) => {
          const available = s.points.map((p, i) => ({ p, i })).filter((x) => x.p.value != null);
          if (available.length === 0) return null;
          const first = available[0]!;
          const last = available[available.length - 1]!;
          return [first, last].map((entry, k) => (
            <text
              key={`${si}-${k}`}
              x={xFor(entry.i)}
              y={yFor(entry.p.value as number) - 10}
              textAnchor="middle"
              style={{
                fontSize: 12,
                fontWeight: 700,
                fill: s.color,
                fontFamily: 'var(--font-sans)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {entry.p.display ?? entry.p.value}
            </text>
          ));
        })}
      </svg>
      <div className="flex items-center gap-4 mt-1 text-[11px] font-sans text-mute flex-wrap">
        <span>↑ higher on the chart = better rank</span>
        {series.map((s, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="block w-3 h-[2.5px]" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
