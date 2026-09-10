interface ScatterPoint {
  x: number;
  y: number;
  r?: number;
  /** True if either axis value is a band midpoint (jittered) rather than an exact rank. Renders hollow. */
  banded?: boolean;
  /** Optional tooltip text, e.g. institution name and both ranks. */
  title?: string;
}

interface ScatterOutlier {
  x: number;
  y: number;
  label: string;
  labelX?: number;
  labelY?: number;
  banded?: boolean;
  title?: string;
}

interface SVGScatterProps {
  title?: string;
  points: ScatterPoint[];
  outliers?: ScatterOutlier[];
  diagonal?: boolean;
  diagonalLabel?: string;
  diagonalLabelX?: number;
  diagonalLabelY?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xTicks?: { x: number; label: string }[];
  yTicks?: { y: number; label: string }[];
  /** Radius for background points (not outliers). Default 3. */
  pointRadius?: number;
  /** Opacity for non-banded background points. Default 0.6. */
  pointOpacity?: number;
  /** Opacity for banded (hollow) background points. Default 0.75. */
  bandedPointOpacity?: number;
  /** Show an in-chart legend explaining filled vs. hollow (banded) dots. Default false. */
  legend?: boolean;
  legendX?: number;
  legendY?: number;
  legendSolidLabel?: string;
  legendBandedLabel?: string;
}

const DEFAULT_X_TICKS = [
  { x: 0, label: '1' },
  { x: 164, label: '100' },
  { x: 328, label: '200' },
  { x: 492, label: '300' },
  { x: 656, label: '400' },
  { x: 820, label: '500' },
];

const DEFAULT_Y_TICKS = [
  { y: 4, label: '1' },
  { y: 84, label: '100' },
  { y: 164, label: '200' },
  { y: 244, label: '300' },
  { y: 324, label: '400' },
];

export function SVGScatter({
  title = 'Scatter chart',
  points,
  outliers = [],
  diagonal = false,
  diagonalLabel,
  diagonalLabelX,
  diagonalLabelY,
  xAxisLabel,
  yAxisLabel,
  xTicks,
  yTicks,
  pointRadius = 3,
  pointOpacity = 0.6,
  bandedPointOpacity = 0.75,
  legend = false,
  legendX = 520,
  legendY = 20,
  legendSolidLabel = 'Exact rank on both systems',
  legendBandedLabel = 'One rank estimated from a THE band',
}: SVGScatterProps) {
  const resolvedXTicks = xTicks ?? DEFAULT_X_TICKS;
  const resolvedYTicks = yTicks ?? DEFAULT_Y_TICKS;
  return (
    <svg
      viewBox="0 0 1000 460"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
      className="block w-full h-auto font-sans"
    >
      <title>{title}</title>
      <desc>{title}</desc>
      <g transform="translate(80,40)">
        <g stroke="var(--color-rule-soft)" strokeWidth={1} fill="none">
          {resolvedYTicks.map((t, i) => (
            <line key={`hg${i}`} x1={0} y1={t.y} x2={820} y2={t.y} />
          ))}
          {resolvedXTicks.map((t, i) => (
            <line key={`vg${i}`} x1={t.x} y1={0} x2={t.x} y2={320} />
          ))}
        </g>

        {diagonal ? (
          <>
            <line
              x1={resolvedXTicks[0].x}
              y1={resolvedYTicks[0].y}
              x2={resolvedXTicks[resolvedXTicks.length - 1].x}
              y2={resolvedYTicks[resolvedYTicks.length - 1].y}
              stroke="var(--color-ink-soft)"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            {diagonalLabel ? (
              <text
                x={diagonalLabelX ?? 700}
                y={diagonalLabelY ?? 274}
                fontSize={13}
                fill="var(--color-ink-soft)"
                fontStyle="italic"
              >
                {diagonalLabel}
              </text>
            ) : null}
          </>
        ) : null}

        {legend ? (
          <g fontSize={12} fill="var(--color-ink-soft)">
            <circle cx={legendX} cy={legendY} r={4.5} fill="var(--color-tamkeen-deep)" />
            <text x={legendX + 12} y={legendY + 4}>
              {legendSolidLabel}
            </text>
            <circle
              cx={legendX}
              cy={legendY + 20}
              r={4.5}
              fill="var(--color-paper)"
              stroke="var(--color-tamkeen-deep)"
              strokeWidth={1}
            />
            <text x={legendX + 12} y={legendY + 24}>
              {legendBandedLabel}
            </text>
          </g>
        ) : null}

        <g>
          {points.map((p, i) =>
            p.banded ? (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={p.r ?? pointRadius}
                fill="var(--color-paper)"
                stroke="var(--color-tamkeen-deep)"
                strokeWidth={1}
                opacity={bandedPointOpacity}
              >
                {p.title ? <title>{p.title}</title> : null}
              </circle>
            ) : (
              <circle key={i} cx={p.x} cy={p.y} r={p.r ?? pointRadius} fill="var(--color-tamkeen-deep)" opacity={pointOpacity}>
                {p.title ? <title>{p.title}</title> : null}
              </circle>
            ),
          )}
        </g>

        <g fill="#A0342A">
          {outliers.map((o, i) => (
            <circle key={`f${i}`} cx={o.x} cy={o.y} r={4} fill={o.banded ? 'var(--color-paper)' : '#A0342A'} stroke={o.banded ? '#A0342A' : 'none'} strokeWidth={o.banded ? 1.4 : 0}>
              {o.title ? <title>{o.title}</title> : null}
            </circle>
          ))}
        </g>
        <g fill="none" stroke="#A0342A" strokeWidth={1.4}>
          {outliers.map((o, i) => (
            <circle key={`r${i}`} cx={o.x} cy={o.y} r={8} />
          ))}
        </g>
        {outliers.map((o, i) => (
          <text
            key={`t${i}`}
            x={o.labelX ?? o.x + 14}
            y={o.labelY ?? o.y - 4}
            fontSize={13}
            fill="var(--color-ink)"
          >
            {o.label}
          </text>
        ))}

        <g stroke="var(--color-rule)" strokeWidth={1} fill="var(--color-ink-soft)" fontSize={13}>
          <line x1={0} y1={320} x2={820} y2={320} />
          <line x1={0} y1={0} x2={0} y2={320} />
          {resolvedXTicks.map((t, i) => (
            <text key={`x${i}`} x={t.x} y={340} textAnchor="middle" stroke="none">
              {t.label}
            </text>
          ))}
          {resolvedYTicks.map((t, i) => (
            <text key={`y${i}`} x={-12} y={t.y} textAnchor="end" stroke="none">
              {t.label}
            </text>
          ))}
        </g>
        {xAxisLabel ? (
          <text x={410} y={378} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--color-ink)">
            {xAxisLabel}
          </text>
        ) : null}
        {yAxisLabel ? (
          <text
            transform="translate(-58,160) rotate(-90)"
            textAnchor="middle"
            fontSize={15}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            {yAxisLabel}
          </text>
        ) : null}
      </g>
    </svg>
  );
}
