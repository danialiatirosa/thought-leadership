/**
 * UAE PISA 2025 against the OECD average, one row per subject (redrawn from
 * the brief's Word chart in the site's palette). Markers are labelled
 * directly on the first row, so there is no legend or axis: every point
 * carries its own value.
 */
interface Row {
  subject: string;
  uae: number;
  oecd: number;
}

const ROWS: Row[] = [
  { subject: 'Science', uae: 458, oecd: 482 },
  { subject: 'Mathematics', uae: 453, oecd: 463 },
  { subject: 'Reading', uae: 433, oecd: 461 },
];

const MIN = 420;
const MAX = 495;
const X0 = 150;
const X1 = 585;
const x = (v: number) => X0 + ((v - MIN) / (MAX - MIN)) * (X1 - X0);
const TOP = 62;
const ROW_H = 74;

export function PisaScoresDot() {
  const height = TOP + (ROWS.length - 1) * ROW_H + 40;
  const muted = 'var(--color-ink-soft)';
  return (
    <svg
      viewBox={`0 0 600 ${height}`}
      role="img"
      aria-label="UAE PISA 2025 scores against the OECD average. Science 458, OECD 482. Mathematics 453, OECD 463. Reading 433, OECD 461."
      className="block w-full h-auto font-sans"
      fontFamily="Inter, sans-serif"
    >
      {ROWS.map((r, i) => {
        const y = TOP + i * ROW_H;
        const first = i === 0;
        return (
          <g key={r.subject}>
            {first ? (
              <g fontSize={12} fill={muted} textAnchor="middle">
                <text x={x(r.uae)} y={y - 34} fill="var(--color-green)" fontWeight={600}>
                  UAE 2025
                </text>
                <text x={x(r.oecd)} y={y - 34}>OECD average</text>
              </g>
            ) : null}

            <text x={X0 - 16} y={y + 5} textAnchor="end" fontSize={14} fill="var(--color-ink)">
              {r.subject}
            </text>
            <line x1={X0} x2={X1} y1={y} y2={y} stroke="var(--color-ink)" strokeOpacity={0.08} strokeWidth={14} strokeLinecap="round" />

            {/* Benchmark */}
            <rect x={x(r.oecd) - 1.5} y={y - 11} width={3} height={22} fill="var(--color-ink)" />
            <circle cx={x(r.uae)} cy={y} r={8} fill="var(--color-green)" stroke="var(--color-paper)" strokeWidth={2} />

            {/* Values */}
            <g fontSize={12.5} textAnchor="middle" fill={muted}>
              <text x={x(r.uae)} y={y + 27} fontSize={13} fontWeight={700} fill="var(--color-green)">
                {r.uae}
              </text>
              <text x={x(r.oecd)} y={y + 27}>{r.oecd}</text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
