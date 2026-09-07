'use client';

import { useState } from 'react';

interface Institution {
  name: string;
  /** Display text for the rank/band, e.g. "177" or "201–250". */
  display: string;
  /** Numeric value used to size the bar (integer rank, or band midpoint). */
  sortValue: number;
}

interface FootprintRow {
  label: string;
  /** Flag emoji shown before the label. */
  flag?: string;
  start: number;
  end: number;
  startYear: string;
  /** Heading for the detail panel when this row is active, e.g. "The seven institutions". */
  detailTitle: string;
  scaleMax: number;
  scaleNote: string;
  institutions: Institution[];
  /** Set on the first row of a new country group to add a little extra space above it. */
  newGroup?: boolean;
}

interface GCCFootprintExplorerProps {
  rows: FootprintRow[];
  defaultIndex?: number;
}

const FOOTPRINT_MAX = 10;

export function GCCFootprintExplorer({ rows, defaultIndex = 1 }: GCCFootprintExplorerProps) {
  const [active, setActive] = useState(defaultIndex);
  const row = rows[active];

  return (
    <div className="my-2 grid grid-cols-[1.15fr_1fr] gap-x-10 max-[760px]:grid-cols-1 max-[760px]:gap-y-8">
      <div className="pt-5 border-t border-green/25">
        <h4 className="m-0 mb-1 font-sans text-[11px] tracking-[1.6px] uppercase font-semibold text-ink">
          Footprint, 2016 to 2026
        </h4>
        <p className="m-0 mb-4 font-sans text-[11px] italic text-mute">Hover or tap a row to see its institutions</p>

        <div className="flex items-center justify-between mb-2 px-1">
          <span className="font-sans text-[10px] tracking-[1px] uppercase text-mute">From year ↓</span>
          <span className="font-sans text-[10px] tracking-[1px] uppercase text-mute">→ To 2026</span>
        </div>

        <div>
          {rows.map((r, i) => {
            const startPct = (r.start / FOOTPRINT_MAX) * 100;
            const endPct = (r.end / FOOTPRINT_MAX) * 100;
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`block w-full text-left relative py-4 px-2 -mx-2 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent ${
                  isActive ? 'bg-green/[0.07]' : 'hover:bg-green/[0.04]'
                } ${r.newGroup ? 'mt-3 border-t border-rule-soft' : ''}`}
              >
                <div className="text-[13px] font-serif text-ink mb-5 mt-1">
                  {r.flag ? <span aria-hidden className="mr-1.5">{r.flag}</span> : null}
                  {r.label}
                </div>
                <div className="relative h-4">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-rule-soft -translate-y-1/2" />
                  <div
                    className="absolute top-1/2 h-[1.5px] bg-green -translate-y-1/2"
                    style={{ left: `${startPct}%`, width: `${endPct - startPct}%` }}
                  />
                  <span
                    className="absolute bottom-[9px] font-sans text-[11px] text-mute -translate-x-1/2 tabular-nums"
                    style={{ left: `${startPct}%` }}
                  >
                    {r.start}
                  </span>
                  <span
                    className="absolute top-1/2 block w-[7px] h-[7px] rounded-full bg-mute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${startPct}%` }}
                  />
                  <span
                    className="absolute bottom-[9px] font-sans text-[12px] font-semibold text-green -translate-x-1/2 tabular-nums"
                    style={{ left: `${endPct}%` }}
                  >
                    {r.end}
                  </span>
                  <span
                    className="absolute top-1/2 block w-[8px] h-[8px] rounded-full bg-green -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${endPct}%` }}
                  />
                  <svg
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: `calc(${endPct}% - 2px)` }}
                    width="9"
                    height="8"
                    viewBox="0 0 9 8"
                    aria-hidden
                  >
                    <path d="M0,4 L7,0.5 L7,7.5 Z" fill="var(--color-green)" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-2 px-1 text-[10.5px] font-sans text-mute italic">
          <span>higher = better</span>
          <span>higher = better</span>
        </div>

        <div className="flex items-center gap-4 mt-4 text-[11px] font-sans text-mute">
          <span className="flex items-center gap-1.5">
            <span className="block w-[7px] h-[7px] rounded-full bg-mute" />
            First year on the list
          </span>
          <span className="flex items-center gap-1.5">
            <span className="block w-[8px] h-[8px] rounded-full bg-green" />
            2026
          </span>
        </div>
      </div>

      <div className="pt-5 border-t-2 border-green">
        <div className="font-sans text-[10px] tracking-[1px] uppercase text-green font-semibold mb-1">
          ↳ Detail of &ldquo;{row.label}&rdquo;
        </div>
        <h4 className="m-0 mb-4 font-sans text-[11px] tracking-[1.6px] uppercase font-semibold text-ink">
          {row.detailTitle}
        </h4>
        <div>
          {row.institutions.map((inst, i) => {
            const pct = (inst.sortValue / row.scaleMax) * 100;
            return (
              <div key={i} className="grid grid-cols-[1fr_70px] gap-3 items-center py-3 border-b border-rule last:border-b-0">
                <div>
                  <div className="text-[13px] font-serif text-ink mb-1.5">{inst.name}</div>
                  <div className="relative h-[7px] rounded-sm bg-rule-soft/50 overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-lime rounded-sm" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="text-right font-sans text-[13px] font-semibold text-green tabular-nums">
                  {inst.display}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-3 text-[11px] font-sans text-mute italic">
          <span>← Lower rank is better</span>
          <span>{row.scaleNote}</span>
        </div>
      </div>
    </div>
  );
}
