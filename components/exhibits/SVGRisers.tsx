import { Flag } from './Flag';

interface RiserRow {
  label: string;
  /**
   * Plotted by raw value (smaller = further left), not by chronology. For a
   * "risers" list this field ends up holding the most-recent (2026) rank,
   * since it is always smaller than fromRank's counterpart for a riser.
   */
  fromRank: number;
  /** Plotted by raw value (larger = further right); ends up holding the first-appearance rank for a riser. */
  toRank: number;
  /** Country name for the vector flag shown before the institution name, e.g. "China". */
  flag?: string;
}

interface SVGRisersProps {
  title?: string;
  rows: RiserRow[];
}

const FROM_X = 0;
const TO_X = 600;
const RANK_TO_PX = 3;

export function SVGRisers({ title = 'Top risers slope chart', rows }: SVGRisersProps) {
  return (
    <svg
      viewBox="0 0 1000 540"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
      className="block w-full h-auto font-sans"
    >
      <title>{title}</title>
      <desc>{title}</desc>
      <g transform="translate(280,30)">
        <line x1={FROM_X} y1={0} x2={FROM_X} y2={490} stroke="var(--color-rule)" />
        <line x1={TO_X} y1={0} x2={TO_X} y2={490} stroke="var(--color-rule)" />
        <text x={FROM_X} y={-12} fontSize={14} fill="var(--color-ink)" textAnchor="middle">
          Most recent (2026) ↓
        </text>
        <text x={TO_X} y={-12} fontSize={14} fill="var(--color-ink)" textAnchor="middle">
          → First appearance
        </text>
        <text x={FROM_X} y={512} fontSize={12} textAnchor="middle" fill="var(--color-ink-soft)">
          low number = better
        </text>
        <text x={TO_X} y={512} fontSize={12} textAnchor="middle" fill="var(--color-ink-soft)">
          low number = better
        </text>

        {rows.map((r, i) => {
          const y = 20 + i * 30;
          const startX = FROM_X + r.fromRank * RANK_TO_PX;
          const endX = FROM_X + r.toRank * RANK_TO_PX;
          const textX = r.flag ? -32 : -10;
          return (
            <g key={i} transform={`translate(0,${y})`}>
              {r.flag ? <Flag country={r.flag} x={-28} y={-6} width={16} /> : null}
              <text
                x={textX}
                y={4}
                textAnchor="end"
                fontSize={15}
                fontWeight={600}
                fill="var(--color-ink)"
              >
                {r.label}
              </text>
              <line x1={startX} y1={0} x2={endX - 36} y2={0} stroke="#2E5B66" strokeWidth={2} />
              <polygon points={`${startX},0 ${startX + 10},-5 ${startX + 10},5`} fill="#2E5B66" />
              <circle cx={startX} cy={0} r={4} fill="#2E5B66" />
              <circle cx={endX - 36} cy={0} r={4} fill="var(--color-ink-soft)" />
              <text
                x={startX - 5}
                y={-10}
                textAnchor="end"
                fontFamily="JetBrains Mono, ui-monospace, monospace"
                fontSize={17}
                fontWeight={600}
                fill="#2E5B66"
              >
                #{r.fromRank}
              </text>
              <text
                x={endX - 31}
                y={-10}
                fontFamily="JetBrains Mono, ui-monospace, monospace"
                fontSize={17}
                fontWeight={600}
                fill="var(--color-ink-soft)"
              >
                #{r.toRank}
              </text>
            </g>
          );
        })}

        <g transform="translate(0,470)">
          <circle cx={0} cy={0} r={4} fill="var(--color-ink-soft)" />
          <text x={10} y={4} fontSize={13} fill="var(--color-ink-soft)">
            First appearance (decade-start rank)
          </text>
          <circle cx={260} cy={0} r={4} fill="#2E5B66" />
          <text x={270} y={4} fontSize={13} fill="var(--color-ink-soft)">
            Most recent rank (2026)
          </text>
        </g>
      </g>
    </svg>
  );
}
