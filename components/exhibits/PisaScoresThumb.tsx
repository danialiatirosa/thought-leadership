/**
 * Small-slot version of PisaScoresDot: UAE 2022 to 2025 against the OECD
 * average, one row per subject, labels sized for a ~350px column.
 */
const ROWS = [
  { subject: 'Science', uae: 458, gain: 26, oecd: 482 },
  { subject: 'Maths', uae: 453, gain: 21, oecd: 463 },
  { subject: 'Reading', uae: 433, gain: 15, oecd: 461 },
];

const MIN = 410;
const MAX = 495;
const X0 = 78;
const X1 = 350;
const x = (v: number) => X0 + ((v - MIN) / (MAX - MIN)) * (X1 - X0);

export function PisaScoresThumb() {
  return (
    <svg
      viewBox="0 0 360 178"
      role="img"
      aria-label="UAE PISA scores 2022 to 2025 against the OECD average: science 458 (up 26, OECD 482), mathematics 453 (up 21, OECD 463), reading 433 (up 15, OECD 461)"
      className="block w-full h-auto"
      fontFamily="Inter, sans-serif"
    >
      <g fontSize={12} fill="var(--color-ink-soft)">
        <circle cx={X0 + 4} cy={12} r={4} fill="var(--color-rule)" />
        <text x={X0 + 12} y={16}>2022</text>
        <circle cx={X0 + 52} cy={12} r={5} fill="var(--color-green)" />
        <text x={X0 + 61} y={16}>2025</text>
        <rect x={X0 + 104} y={4} width={2.5} height={16} fill="var(--color-ink)" />
        <text x={X0 + 112} y={16}>OECD average</text>
      </g>
      {ROWS.map((r, i) => {
        const y = 56 + i * 50;
        const from = r.uae - r.gain;
        return (
          <g key={r.subject}>
            <text x={X0 - 10} y={y + 5} textAnchor="end" fontSize={14} fill="var(--color-ink)">
              {r.subject}
            </text>
            <line x1={X0} x2={X1} y1={y} y2={y} stroke="var(--color-ink)" strokeOpacity={0.08} strokeWidth={10} strokeLinecap="round" />
            <circle cx={x(from)} cy={y} r={4.5} fill="var(--color-rule)" />
            <line x1={x(from) + 6} x2={x(r.uae) - 8} y1={y} y2={y} stroke="var(--color-green)" strokeWidth={2.5} />
            <rect x={x(r.oecd) - 1.25} y={y - 9} width={2.5} height={18} fill="var(--color-ink)" />
            <circle cx={x(r.uae)} cy={y} r={6.5} fill="var(--color-green)" stroke="var(--color-paper)" strokeWidth={1.5} />
            <text x={x(r.uae)} y={y + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-green)">
              {r.uae}
            </text>
            <text x={x(r.oecd)} y={y + 22} textAnchor="middle" fontSize={12} fill="var(--color-ink-soft)">
              {r.oecd}
            </text>
            <text x={(x(from) + x(r.uae)) / 2} y={y - 9} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--color-green)">
              +{r.gain}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
