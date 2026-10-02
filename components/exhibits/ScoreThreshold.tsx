'use client';

import { useMemo, useState } from 'react';

/** [rank, overall score] pairs per system and edition, exact ranks only. */
type ScoreTable = Record<'THE' | 'QS', Record<string, [number, number][]>>;

interface ScoreThresholdProps {
  /** Imported from content/data/score-thresholds.json */
  data: ScoreTable;
  /** Place shown when the chart first loads. Default 100. */
  defaultPlace?: number;
}

const YEARS = Array.from({ length: 12 }, (_, i) => 2016 + i);
const PLACES = [50, 100, 150, 200, 300, 500];
/** Deepest place each publisher gives an exact overall score for, by edition. */
const COVERAGE = {
  THE: (y: number) => (y >= 2027 ? 300 : 200),
  QS: (y: number) => (y <= 2018 ? 400 : y <= 2023 ? 500 : y <= 2025 ? 600 : 700),
};
const MARKERS = [
  { year: 2024, label: 'THE WUR 3.0 · QS revision' },
  { year: 2026, label: 'QS normalisation change' },
];
const SERIES = [
  { sys: 'QS' as const, color: 'var(--color-green)' },
  { sys: 'THE' as const, color: 'var(--color-lime)' },
];

function scoreAtPlace(rows: [number, number][] | undefined, place: number, limit: number) {
  if (!rows || place > limit) return null;
  let score: number | null = null;
  for (const [rank, s] of rows) {
    if (rank <= place) score = s;
    else break;
  }
  return score;
}

function placeForScore(rows: [number, number][] | undefined, score: number) {
  if (!rows || rows.length === 0) return null;
  if (score > rows[0][1]) return 1;
  let place: number | null = null;
  for (const [rank, s] of rows) if (s >= score) place = rank;
  if (place === null) return null;
  const last = rows[rows.length - 1];
  if (place === last[0] && last[1] > score) return null; // below the published range
  return place;
}

const W = 820;
const H = 360;
const PAD = { l: 52, r: 20, t: 34, b: 34 };

export function ScoreThreshold({ data, defaultPlace = 100 }: ScoreThresholdProps) {
  const [mode, setMode] = useState<'place' | 'score'>('place');
  const [place, setPlace] = useState(defaultPlace);
  const [score, setScore] = useState(60);

  const series = useMemo(
    () =>
      SERIES.map((s) => ({
        ...s,
        points: YEARS.map((y) => {
          const rows = data[s.sys][String(y)];
          const v =
            mode === 'place'
              ? scoreAtPlace(rows, place, COVERAGE[s.sys](y))
              : placeForScore(rows, score);
          return { y, v };
        }),
      })),
    [data, mode, place, score],
  );

  const values = series.flatMap((s) => s.points.map((p) => p.v)).filter((v): v is number => v != null);
  let lo: number;
  let hi: number;
  let ticks: number[];
  if (mode === 'place') {
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
    mode === 'place' ? PAD.t + (1 - (v - lo) / (hi - lo)) * ph : PAD.t + ((v - lo) / (hi - lo)) * ph;

  const summary = series
    .map((s) => {
      const pts = s.points.filter((p) => p.v != null);
      if (pts.length < 2) return null;
      const a = pts[0];
      const b = pts[pts.length - 1];
      return mode === 'place'
        ? `${s.sys}: ${a.v!.toFixed(1)} in ${a.y}, ${b.v!.toFixed(1)} in ${b.y}`
        : `${s.sys}: about ${a.v} in ${a.y}, about ${b.v} in ${b.y}`;
    })
    .filter(Boolean)
    .join(' · ');

  const btn = (active: boolean) =>
    `px-3 py-1.5 border-r border-rule last:border-r-0 cursor-pointer ${
      active ? 'bg-[var(--color-green-deep)] text-[var(--color-paper)]' : 'bg-transparent text-ink'
    }`;

  return (
    <div className="my-6 font-sans">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] mb-4">
        <div className="inline-flex border border-rule rounded-[3px] overflow-hidden" role="group" aria-label="View">
          <button type="button" className={btn(mode === 'place')} aria-pressed={mode === 'place'} onClick={() => setMode('place')}>
            Score for a place
          </button>
          <button type="button" className={btn(mode === 'score')} aria-pressed={mode === 'score'} onClick={() => setMode('score')}>
            Place for a score
          </button>
        </div>
        {mode === 'place' ? (
          <div className="inline-flex border border-rule rounded-[3px] overflow-hidden" role="group" aria-label="Place">
            {PLACES.map((p) => (
              <button key={p} type="button" className={btn(place === p)} aria-pressed={place === p} onClick={() => setPlace(p)}>
                {p}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <label htmlFor="score-threshold-input" className="text-mute uppercase tracking-[1px] text-[11px] font-semibold">
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
              className="w-[5.5em] px-2 py-1 border border-rule rounded-[3px] bg-transparent text-ink tabular-nums"
            />
            <input
              type="range"
              min={20}
              max={100}
              step={0.1}
              value={score}
              aria-label="Score"
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-[min(220px,40vw)] accent-[var(--color-green)]"
            />
          </div>
        )}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img"
        aria-label={mode === 'place' ? `Overall score at place ${place}, QS and THE, 2016 to 2027` : `Place earned by a score of ${score}, QS and THE, 2016 to 2027`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={yv(t)} y2={yv(t)} stroke="var(--color-rule-soft)" strokeWidth={1} />
            <text x={PAD.l - 8} y={yv(t) + 4} textAnchor="end" fontSize={12} fill="var(--color-mute)">
              {t}
            </text>
          </g>
        ))}
        <text x={PAD.l - 8} y={PAD.t - 16} textAnchor="end" fontSize={11} fill="var(--color-mute)">
          {mode === 'place' ? 'Score' : 'Place'}
        </text>
        {YEARS.map((y) => (
          <text key={y} x={x(y)} y={H - PAD.b + 22} textAnchor="middle" fontSize={12} fill="var(--color-mute)">
            &apos;{String(y).slice(2)}
          </text>
        ))}
        {MARKERS.map((m) => (
          <g key={m.year}>
            <line x1={x(m.year)} x2={x(m.year)} y1={PAD.t - 6} y2={PAD.t + ph} stroke="var(--color-neg)" strokeWidth={1.2} strokeDasharray="4 4" />
            <text x={x(m.year) + 5} y={PAD.t - 10} fontSize={11} fill="var(--color-neg)">
              {m.label}
            </text>
          </g>
        ))}
        {series.map((s) => {
          const segments: string[][] = [[]];
          for (const p of s.points) {
            if (p.v == null) segments.push([]);
            else segments[segments.length - 1].push(`${x(p.y)},${yv(p.v)}`);
          }
          return (
            <g key={s.sys}>
              {segments.filter((seg) => seg.length > 1).map((seg, i) => (
                <polyline key={i} points={seg.join(' ')} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" />
              ))}
              {s.points.map((p) =>
                p.v == null ? null : (
                  <circle key={p.y} cx={x(p.y)} cy={yv(p.v)} r={4} fill={s.color}>
                    <title>{`${s.sys} ${p.y}: ${mode === 'place' ? p.v.toFixed(1) : `place ${p.v}`}`}</title>
                  </circle>
                ),
              )}
            </g>
          );
        })}
      </svg>

      <div className="flex gap-5 mt-3 text-[13px] text-mute items-center flex-wrap">
        {SERIES.map((s) => (
          <div key={s.sys} className="flex items-center gap-2">
            <span className="inline-block w-4 h-[3px]" style={{ background: s.color }} aria-hidden />
            {s.sys}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 border-t-2 border-dashed" style={{ borderColor: 'var(--color-neg)' }} aria-hidden />
          Methodology change
        </div>
      </div>

      <p className="mt-3 text-[14px] text-ink m-0" aria-live="polite">
        {summary
          ? `${mode === 'place' ? `Score at place ${place}` : `A score of ${score}`}. ${summary}.`
          : 'No published scores cover this choice. Try a higher place or a higher score.'}
      </p>
    </div>
  );
}
