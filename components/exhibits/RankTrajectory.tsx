interface TrajectoryPoint {
  year: string;
  /** Rank, or band midpoint when banded. Lower is better. */
  value: number;
  /** Display text, e.g. "101" or "251–300". */
  display: string;
  banded: boolean;
}

interface RankTrajectoryProps {
  points: TrajectoryPoint[];
  /** Index of the point to call out with an italic annotation above it. */
  peakIndex?: number;
  peakLabel?: string;
  scaleMax?: number;
}

const WIDTH = 640;
const HEIGHT = 220;
const PAD_X = 28;
const PAD_TOP = 46;
const PAD_BOTTOM = 34;

/**
 * Single-institution rank trajectory: a spare line chart for a story that's
 * a rise-then-fall (or fall-then-rise) rather than a steady climb. Banded
 * years render as hollow dots (approximate); integer-ranked years render
 * as filled dots (exact). Lower on the chart = worse rank, since the y-axis
 * plots rank/band-midpoint directly with 1 at the top.
 */
export function RankTrajectory({ points, peakIndex, peakLabel, scaleMax = 450 }: RankTrajectoryProps) {
  const plotWidth = WIDTH - PAD_X * 2;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const xFor = (i: number) => PAD_X + (i / (points.length - 1)) * plotWidth;
  const yFor = (v: number) => PAD_TOP + (v / scaleMax) * plotHeight;

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i).toFixed(1)} ${yFor(p.value).toFixed(1)}`).join(' ');

  return (
    <div className="my-2">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" role="img" aria-label="Rank trajectory chart">
        <line x1={PAD_X} y1={PAD_TOP} x2={WIDTH - PAD_X} y2={PAD_TOP} stroke="var(--color-rule-soft)" strokeWidth={1} />
        <line
          x1={PAD_X}
          y1={HEIGHT - PAD_BOTTOM}
          x2={WIDTH - PAD_X}
          y2={HEIGHT - PAD_BOTTOM}
          stroke="var(--color-rule-soft)"
          strokeWidth={1}
        />
        <path d={linePath} fill="none" stroke="var(--color-green)" strokeWidth={1.5} />
        {points.map((p, i) => (
          <g key={i}>
            {peakIndex === i && peakLabel ? (
              <text
                x={xFor(i)}
                y={yFor(p.value) - 24}
                textAnchor="middle"
                style={{ fontSize: 11, fontStyle: 'italic', fill: 'var(--color-green)', fontFamily: 'var(--font-sans)' }}
              >
                {peakLabel}
              </text>
            ) : null}
            <text
              x={xFor(i)}
              y={yFor(p.value) - (peakIndex === i ? 12 : 12)}
              textAnchor="middle"
              style={{
                fontSize: 12,
                fontWeight: peakIndex === i ? 700 : 500,
                fill: peakIndex === i ? 'var(--color-green)' : 'var(--color-ink-mid)',
                fontFamily: 'var(--font-sans)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {p.display}
            </text>
            <circle
              cx={xFor(i)}
              cy={yFor(p.value)}
              r={p.banded ? 4 : 5.5}
              fill={p.banded ? 'var(--color-paper)' : 'var(--color-green)'}
              stroke="var(--color-green)"
              strokeWidth={p.banded ? 1.5 : 0}
            />
            <text
              x={xFor(i)}
              y={HEIGHT - PAD_BOTTOM + 22}
              textAnchor="middle"
              style={{ fontSize: 11, fill: 'var(--color-mute)', fontFamily: 'var(--font-sans)' }}
            >
              {p.year}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex items-center gap-4 mt-1 text-[10.5px] font-sans text-mute italic">
        <span>↑ higher on the chart = better rank</span>
        <span className="flex items-center gap-1.5">
          <span className="block w-[8px] h-[8px] rounded-full bg-green" />
          Exact rank
        </span>
        <span className="flex items-center gap-1.5">
          <span className="block w-[8px] h-[8px] rounded-full border border-green bg-paper" />
          Banded (approximate)
        </span>
      </div>
    </div>
  );
}
