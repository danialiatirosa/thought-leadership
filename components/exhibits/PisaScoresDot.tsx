/**
 * UAE PISA 2025 against 2022 and the OECD average, one row per subject
 * (redrawn from the brief's Word chart in the site's palette). Scores are
 * from the brief; each 2022 dot sits at the 2025 score minus the reported
 * gain and carries the gain rather than its own score. Markers are labelled
 * directly on the first row, so there is no legend or axis.
 */
interface Row {
  subject: string;
  uae: number;
  gain: number;
  oecd: number;
}

const ROWS: Row[] = [
  { subject: 'Science', uae: 458, gain: 26, oecd: 482 },
  { subject: 'Mathematics', uae: 453, gain: 21, oecd: 463 },
  { subject: 'Reading', uae: 433, gain: 15, oecd: 461 },
];

const MIN = 405;
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
      aria-label="UAE PISA scores, 2022 to 2025, against the OECD average. Science 458 (up 26), OECD 482. Mathematics 453 (up 21), OECD 463. Reading 433 (up 15), OECD 461."
      className="block w-full h-auto font-sans"
      fontFamily="Inter, sans-serif"
    >
      {ROWS.map((r, i) => {
        const y = TOP + i * ROW_H;
        const from = r.uae - r.gain;
        const first = i === 0;
        return (
          <g key={r.subject}>
            {first ? (
              <g fontSize={12} fill={muted} textAnchor="middle">
                <text x={x(from)} y={y - 34}>UAE 2022</text>
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

            {/* 2022 to 2025 move */}
            <circle cx={x(from)} cy={y} r={6} fill="var(--color-rule)" />
            <line x1={x(from) + 8} x2={x(r.uae) - 13} y1={y} y2={y} stroke="var(--color-green)" strokeWidth={2.5} />
            <path d={`M${x(r.uae) - 13},${y - 5} L${x(r.uae) - 7},${y} L${x(r.uae) - 13},${y + 5} Z`} fill="var(--color-green)" />
            <text x={(x(from) + x(r.uae)) / 2} y={y - 13} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-green)">
              +{r.gain}
            </text>

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
