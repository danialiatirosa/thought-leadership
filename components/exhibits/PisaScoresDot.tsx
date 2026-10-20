/**
 * UAE PISA 2025 against 2022, the OECD average and Dubai, one row per
 * subject (redrawn from the brief's Word chart in the site's palette).
 * Scores are from the brief; each 2022 dot sits at the 2025 score minus the
 * reported gain.
 */
interface Row {
  subject: string;
  uae: number;
  gain?: number;
  oecd: number;
  dubai?: number;
  note?: string;
}

const ROWS: Row[] = [
  { subject: 'Science', uae: 458, gain: 26, oecd: 482, dubai: 506 },
  { subject: 'Mathematics', uae: 453, gain: 21, oecd: 463, dubai: 496 },
  { subject: 'Reading', uae: 433, gain: 15, oecd: 461, dubai: 484 },
  { subject: 'Computational problem-solving', uae: 476, oecd: 500, note: 'new in 2025' },
];

const MIN = 400;
const MAX = 520;
const X0 = 190;
const X1 = 585;
const x = (v: number) => X0 + ((v - MIN) / (MAX - MIN)) * (X1 - X0);
const ROW_H = 78;
const TOP = 70;

export function PisaScoresDot() {
  const axisY = TOP + ROWS.length * ROW_H - 20;
  const muted = 'var(--color-ink-soft)';
  return (
    <svg
      viewBox={`0 0 600 ${axisY + 30}`}
      role="img"
      aria-label="UAE PISA scores in 2025 against 2022, the OECD average and Dubai. Science 458 (up 26), OECD 482, Dubai 506. Mathematics 453 (up 21), OECD 463, Dubai 496. Reading 433 (up 15), OECD 461, Dubai 484. Computational problem-solving, new in 2025: UAE 476, OECD 500."
      className="block w-full h-auto font-sans"
      fontFamily="Inter, sans-serif"
    >
      {/* Legend */}
      <g fontSize={12.5} fill={muted}>
        <circle cx={X0 - 175} cy={18} r={6} fill="var(--color-rule)" />
        <text x={X0 - 164} y={22}>UAE 2022</text>
        <circle cx={X0 - 92} cy={18} r={7} fill="var(--color-green)" />
        <text x={X0 - 80} y={22}>UAE 2025</text>
        <rect x={X0 - 8} y={10} width={3} height={16} fill="var(--color-ink)" />
        <text x={X0 + 2} y={22}>OECD average 2025</text>
        <rect x={X0 + 130} y={12} width={11} height={11} fill="var(--color-lime)" transform={`rotate(45 ${X0 + 135.5} 17.5)`} />
        <text x={X0 + 149} y={22}>Dubai 2025</text>
      </g>

      {ROWS.map((r, i) => {
        const y = TOP + i * ROW_H;
        const from = r.gain !== undefined ? r.uae - r.gain : null;
        return (
          <g key={r.subject}>
            <text x={X0 - 18} y={y + 5} textAnchor="end" fontSize={14} fill="var(--color-ink)">
              {r.subject === 'Computational problem-solving' ? (
                <>
                  <tspan x={X0 - 18} dy={-8}>Computational</tspan>
                  <tspan x={X0 - 18} dy={17}>problem-solving</tspan>
                </>
              ) : (
                r.subject
              )}
            </text>
            <line x1={X0} x2={X1} y1={y} y2={y} stroke="var(--color-ink)" strokeOpacity={0.08} strokeWidth={14} strokeLinecap="round" />
            {from !== null ? (
              <>
                <circle cx={x(from)} cy={y} r={6} fill="var(--color-rule)" />
                <line x1={x(from) + 8} x2={x(r.uae) - 13} y1={y} y2={y} stroke="var(--color-green)" strokeWidth={2.5} />
                <path d={`M${x(r.uae) - 13},${y - 5} L${x(r.uae) - 7},${y} L${x(r.uae) - 13},${y + 5} Z`} fill="var(--color-green)" />
                <text x={(x(from) + x(r.uae)) / 2} y={y - 13} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-green)">
                  +{r.gain}
                </text>
              </>
            ) : (
              <text x={(x(r.uae) + x(r.oecd)) / 2} y={y - 14} textAnchor="middle" fontSize={12} fontStyle="italic" fill={muted}>
                {r.note ?? ''}
              </text>
            )}
            <rect x={x(r.oecd) - 1.5} y={y - 11} width={3} height={22} fill="var(--color-ink)" />
            <text x={x(r.oecd)} y={y + 27} textAnchor="middle" fontSize={12.5} fill={muted}>
              {r.oecd}
            </text>
            {r.dubai !== undefined ? (
              <>
                <rect x={x(r.dubai) - 6} y={y - 6} width={12} height={12} fill="var(--color-lime)" transform={`rotate(45 ${x(r.dubai)} ${y})`} />
                <text x={x(r.dubai)} y={y + 27} textAnchor="middle" fontSize={12.5} fill={muted}>
                  {r.dubai}
                </text>
              </>
            ) : null}
            <circle cx={x(r.uae)} cy={y} r={8} fill="var(--color-green)" stroke="var(--color-paper)" strokeWidth={2} />
            <text x={x(r.uae)} y={y + 27} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-ink)">
              {r.uae}
            </text>
          </g>
        );
      })}

      {[400, 420, 440, 460, 480, 500, 520].map((v) => (
        <text key={v} x={x(v)} y={axisY + 20} textAnchor="middle" fontSize={12} fill={muted}>
          {v}
        </text>
      ))}
    </svg>
  );
}
