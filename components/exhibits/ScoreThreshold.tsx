'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

/** [rank, overall score] pairs per system and edition, exact ranks only. */
type ScoreTable = Record<'THE' | 'QS', Record<string, [number, number][]>>;

interface ScoreThresholdProps {
  /** Imported from content/data/score-thresholds.json */
  data: ScoreTable;
  /** Rank shown when the chart first loads. Default 100. */
  defaultRank?: number;
}

const YEARS = Array.from({ length: 12 }, (_, i) => 2016 + i);
const RANKS = [50, 100, 150, 200];
/** Deepest rank each publisher gives an exact overall score for, by edition. */
const COVERAGE = {
  THE: (y: number) => (y >= 2027 ? 300 : 200),
  QS: (y: number) => (y <= 2018 ? 400 : y <= 2023 ? 500 : y <= 2025 ? 600 : 700),
};
const MARKERS = [
  { year: 2024, label: '2024: THE WUR 3.0, QS revision', short: '2024: new methods' },
  { year: 2026, label: '2026: QS normalisation change', short: '2026: QS change' },
];
const SERIES = [
  { sys: 'QS' as const, color: 'var(--color-green)' },
  { sys: 'THE' as const, color: 'var(--color-lime)' },
];

function scoreAtRank(rows: [number, number][] | undefined, rank: number, limit: number) {
  if (!rows || rank > limit) return null;
  let score: number | null = null;
  for (const [r, s] of rows) {
    if (r <= rank) score = s;
    else break;
  }
  return score;
}

function rankForScore(rows: [number, number][] | undefined, score: number) {
  if (!rows || rows.length === 0) return null;
  if (score > rows[0][1]) return 1;
  let rank: number | null = null;
  for (const [r, s] of rows) if (s >= score) rank = r;
  if (rank === null) return null;
  const last = rows[rows.length - 1];
  if (rank === last[0] && last[1] > score) return null; // below the published range
  return rank;
}

// Inline styles so the article's prose typography cannot restyle the controls.
const groupStyle: CSSProperties = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  border: '1px solid var(--color-rule)',
  borderRadius: 3,
  overflow: 'hidden',
};
const buttonStyle = (active: boolean, last: boolean): CSSProperties => ({
  font: '500 13px/1 var(--font-inter), system-ui, sans-serif',
  padding: '8px 12px',
  margin: 0,
  border: 0,
  borderRight: last ? 0 : '1px solid var(--color-rule)',
  background: active ? 'var(--color-green-deep)' : 'transparent',
  color: active ? 'var(--color-paper)' : 'var(--color-ink)',
  cursor: 'pointer',
  textIndent: 0,
});
const labelStyle: CSSProperties = {
  font: '600 11px/1 var(--font-inter), system-ui, sans-serif',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  color: 'var(--color-mute)',
};

const H = 340;

export function ScoreThreshold({ data, defaultRank = 100 }: ScoreThresholdProps) {
  const [mode, setMode] = useState<'rank' | 'score'>('rank');
  const [rank, setRank] = useState(defaultRank);
  const [score, setScore] = useState(60);
  const boxRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(760);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => setW(Math.max(300, Math.round(el.getBoundingClientRect().width)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const narrow = W < 560;
  const PAD = { l: narrow ? 34 : 44, r: narrow ? 12 : 20, t: 46, b: 30 };

  const series = useMemo(
    () =>
      SERIES.map((s) => ({
        ...s,
        points: YEARS.map((y) => {
          const rows = data[s.sys][String(y)];
          const v = mode === 'rank' ? scoreAtRank(rows, rank, COVERAGE[s.sys](y)) : rankForScore(rows, score);
          return { y, v };
        }),
      })),
    [data, mode, rank, score],
  );

  const values = series.flatMap((s) => s.points.map((p) => p.v)).filter((v): v is number => v != null);
  let lo: number;
  let hi: number;
  let ticks: number[];
  if (mode === 'rank') {
    lo = values.length ? Math.floor((Math.min(...values) - 5) / 10) * 10 : 0;
    hi = values.length ? Math.min(100, Math.ceil((Math.max(...values) + 5) / 10) * 10) : 100;
    ticks = [];
    for (let t = lo; t <= hi; t += 10) ticks.push(t);
  } else {
    const max = values.length ? Math.max(...values) : 500;
    const step = max > 300 ? 100 : max > 120 ? 50 : max > 40 ? 20 : 5;
    lo = 1;
    hi = Math.max(step, Math.ceil(max / step) * step);
    ticks = [1];
    for (let t = step; t <= hi; t += step) ticks.push(t);
  }
  const pw = W - PAD.l - PAD.r;
  const ph = H - PAD.t - PAD.b;
  const x = (y: number) => PAD.l + ((y - 2016) / 11) * pw;
  const yv = (v: number) =>
    mode === 'rank' ? PAD.t + (1 - (v - lo) / (hi - lo)) * ph : PAD.t + ((v - lo) / (hi - lo)) * ph;

  const summary = series
    .map((s) => {
      const pts = s.points.filter((p) => p.v != null);
      if (pts.length < 2) return null;
      const a = pts[0];
      const b = pts[pts.length - 1];
      return mode === 'rank'
        ? `${s.sys} ${a.v!.toFixed(1)} in ${a.y}, ${b.v!.toFixed(1)} in ${b.y}`
        : `${s.sys} about ${a.v} in ${a.y}, about ${b.v} in ${b.y}`;
    })
    .filter(Boolean)
    .join('; ');

  return (
    <div className="my-6 font-sans not-prose">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 20px', marginBottom: 16 }}>
        <div style={groupStyle} role="group" aria-label="View">
          <button type="button" style={buttonStyle(mode === 'rank', false)} aria-pressed={mode === 'rank'} onClick={() => setMode('rank')}>
            Score at a rank
          </button>
          <button type="button" style={buttonStyle(mode === 'score', true)} aria-pressed={mode === 'score'} onClick={() => setMode('score')}>
            Rank for a score
          </button>
        </div>
        {mode === 'rank' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={labelStyle}>Rank</span>
            <div style={groupStyle} role="group" aria-label="Rank">
              {RANKS.map((r, i) => (
                <button key={r} type="button" style={buttonStyle(rank === r, i === RANKS.length - 1)} aria-pressed={rank === r} onClick={() => setRank(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <label htmlFor="score-threshold-input" style={labelStyle}>
              Score
            </label>
            <input
              id="score-threshold-input"
              type="number"
              min={20}
              max={100}
              step={0.1}
              value={score}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isFinite(v) && e.target.value !== '') setScore(Math.min(100, Math.max(20, v)));
              }}
              style={{ width: '5.5em', font: '500 14px var(--font-inter), system-ui, sans-serif', padding: '6px 8px', border: '1px solid var(--color-rule)', borderRadius: 3, background: 'transparent', color: 'var(--color-ink)' }}
            />
            <input
              type="range"
              min={20}
              max={100}
              step={0.1}
              value={score}
              aria-label="Score"
              onChange={(e) => setScore(Number(e.target.value))}
              style={{ width: 'min(220px, 45vw)', accentColor: 'var(--color-green)' }}
            />
          </div>
        )}
      </div>

      <div ref={boxRef} style={{ width: '100%' }}>
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
          role="img"
          aria-label={mode === 'rank' ? `Overall score at rank ${rank}, QS and THE, 2016 to 2027` : `Rank earned by a score of ${score}, QS and THE, 2016 to 2027`}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.l} x2={W - PAD.r} y1={yv(t)} y2={yv(t)} stroke="var(--color-rule-soft)" strokeWidth={1} />
              <text x={PAD.l - 6} y={yv(t) + 4} textAnchor="end" fontSize={12} fill="var(--color-mute)">
                {t}
              </text>
            </g>
          ))}
          <text x={4} y={PAD.t - 30} fontSize={11} fill="var(--color-mute)">
            {mode === 'rank' ? 'Score' : 'Rank'}
          </text>
          {YEARS.map((y, i) =>
            narrow && i % 2 === 1 ? null : (
              <text key={y} x={x(y)} y={H - PAD.b + 20} textAnchor="middle" fontSize={12} fill="var(--color-mute)">
                {narrow ? `'${String(y).slice(2)}` : y}
              </text>
            ),
          )}
          {MARKERS.map((m, i) => {
            const mx = x(m.year);
            const rowY = i === 0 ? PAD.t - 22 : PAD.t - 8;
            const anchorEnd = mx > W * 0.6;
            return (
              <g key={m.year}>
                <line x1={mx} x2={mx} y1={PAD.t - 2} y2={PAD.t + ph} stroke="var(--color-neg)" strokeWidth={1.2} strokeDasharray="4 4" />
                <text x={anchorEnd ? mx - 5 : mx + 5} y={rowY} textAnchor={anchorEnd ? 'end' : 'start'} fontSize={11} fill="var(--color-neg)">
                  {narrow ? m.short : m.label}
                </text>
              </g>
            );
          })}
          {series.map((s) => {
            const segments: string[][] = [[]];
            for (const p of s.points) {
              if (p.v == null) segments.push([]);
              else segments[segments.length - 1].push(`${x(p.y)},${yv(p.v)}`);
            }
            return (
              <g key={s.sys}>
                {segments
                  .filter((seg) => seg.length > 1)
                  .map((seg, i) => (
                    <polyline key={i} points={seg.join(' ')} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" />
                  ))}
                {s.points.map((p) =>
                  p.v == null ? null : (
                    <circle key={p.y} cx={x(p.y)} cy={yv(p.v)} r={4} fill={s.color}>
                      <title>{`${s.sys} ${p.y}: ${mode === 'rank' ? p.v.toFixed(1) : `rank ${p.v}`}`}</title>
                    </circle>
                  ),
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', marginTop: 12, font: '400 13px/1.4 var(--font-inter), system-ui, sans-serif', color: 'var(--color-mute)' }}>
        {SERIES.map((s) => (
          <span key={s.sys} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 16, height: 3, background: s.color, display: 'inline-block' }} aria-hidden />
            {s.sys}
          </span>
        ))}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 16, borderTop: '2px dashed var(--color-neg)', display: 'inline-block' }} aria-hidden />
          Methodology change
        </span>
      </div>

      <div style={{ marginTop: 10, font: '400 13px/1.5 var(--font-inter), system-ui, sans-serif', color: 'var(--color-ink)' }} aria-live="polite">
        {summary
          ? `${mode === 'rank' ? `Score at rank ${rank}` : `A score of ${score}`}: ${summary}.`
          : 'No published scores cover this choice. Try a higher rank or a higher score.'}
      </div>
    </div>
  );
}
