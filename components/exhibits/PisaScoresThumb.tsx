/**
 * Small-slot version of PisaScoresDot: UAE 2025 against the OECD average,
 * one row per subject, labels sized for a ~350px column.
 */
const ROWS = [
  { subject: 'Science', uae: 458, oecd: 482 },
  { subject: 'Maths', uae: 453, oecd: 463 },
  { subject: 'Reading', uae: 433, oecd: 461 },
];

const MIN = 420;
const MAX = 495;
const X0 = 78;
const X1 = 350;
const x = (v: number) => X0 + ((v - MIN) / (MAX - MIN)) * (X1 - X0);

export function PisaScoresThumb() {
  return (
    <svg
      viewBox="0 0 360 178"
      role="img"
      aria-label="UAE PISA 2025 scores against the OECD average: science 458 (OECD 482), mathematics 453 (OECD 463), reading 433 (OECD 461)"
      className="block w-full h-auto"
      fontFamily="Inter, sans-serif"
    >
      <g fontSize={12} fill="var(--color-ink-soft)">
        <circle cx={X0 + 4} cy={12} r={5} fill="var(--color-green)" />
        <text x={X0 + 13} y={16}>UAE 2025</text>
        <rect x={X0 + 80} y={4} width={2.5} height={16} fill="var(--color-ink)" />
        <text x={X0 + 88} y={16}>OECD average</text>
      </g>
      {ROWS.map((r, i) => {
        const y = 56 + i * 50;
        return (
          <g key={r.subject}>
            <text x={X0 - 10} y={y + 5} textAnchor="end" fontSize={14} fill="var(--color-ink)">
              {r.subject}
            </text>
            <line x1={X0} x2={X1} y1={y} y2={y} stroke="var(--color-ink)" strokeOpacity={0.08} strokeWidth={10} strokeLinecap="round" />
            <rect x={x(r.oecd) - 1.25} y={y - 9} width={2.5} height={18} fill="var(--color-ink)" />
            <circle cx={x(r.uae)} cy={y} r={6.5} fill="var(--color-green)" stroke="var(--color-paper)" strokeWidth={1.5} />
            <text x={x(r.uae)} y={y + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-green)">
              {r.uae}
            </text>
            <text x={x(r.oecd)} y={y + 22} textAnchor="middle" fontSize={12} fill="var(--color-ink-soft)">
              {r.oecd}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
