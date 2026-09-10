'use client';

import { useState } from 'react';
import { Flag } from './Flag';

interface Institution {
  name: string;
  /** Display text for the rank/band, e.g. "177" or "201–250". */
  display: string;
  /** Numeric value used to size the bar (integer rank, or band midpoint). */
  sortValue: number;
}

interface FootprintRow {
  /** e.g. "THE Top 500" or "QS Top 500". */
  system: string;
  start: number;
  end: number;
  startYear: string;
  /** Heading for the detail panel when this row is active, e.g. "The seven institutions". */
  detailTitle: string;
  scaleMax: number;
  scaleNote: string;
  institutions: Institution[];
}

interface FootprintGroup {
  country: string;
  /** Country name for the vector flag shown in the group header, e.g. "United Arab Emirates". */
  flag?: string;
  rows: FootprintRow[];
}

interface GCCFootprintExplorerProps {
  groups: FootprintGroup[];
  /** Flat index into all rows across all groups, in order. */
  defaultIndex?: number;
  /** Most recent year in the data, used in axis labels and the detail panel. */
  toYear?: string;
}

const FOOTPRINT_MAX = 10;

export function GCCFootprintExplorer({ groups, defaultIndex = 1, toYear = '2026' }: GCCFootprintExplorerProps) {
  const flatRows = groups.flatMap((g, groupIndex) =>
    g.rows.map((r, rowIndexInGroup) => ({
      ...r,
      groupIndex,
      country: g.country,
      flag: g.flag,
      isFirstInGroup: rowIndexInGroup === 0,
    })),
  );

  const [active, setActive] = useState(defaultIndex);
  const row = flatRows[active];

  return (
    <div className="my-2 grid grid-cols-[1.15fr_1fr] gap-x-10 max-[760px]:grid-cols-1 max-[760px]:gap-y-8">
      <div className="pt-5 border-t border-green/25">
        <div className="m-0 mb-1 font-sans text-[15px] font-semibold text-ink normal-case tracking-normal" style={{ fontSize: 15, textTransform: 'none', letterSpacing: 'normal', color: 'var(--color-ink)' }}>
          Footprint: number of universities in the Top 500, 2016 to {toYear}
        </div>
        <p className="m-0 mb-4 font-sans text-[11px] italic text-mute">Hover or tap a row to see its institutions</p>

        <div className="flex items-center justify-between mb-2 px-1">
          <span className="font-sans text-[12px] tracking-[0.5px] uppercase text-mute">From 2016/2017 ↓</span>
          <span className="font-sans text-[12px] tracking-[0.5px] uppercase text-mute">→ To {toYear}</span>
        </div>

        <div className="space-y-3">
          {groups.map((g, groupIndex) => (
            <div key={groupIndex} className="border border-rule rounded-[6px] bg-green/[0.03] px-3 pt-3 pb-1">
              <div className="flex items-center gap-2 mb-1 px-2">
                {g.flag ? <Flag country={g.flag} width={18} /> : null}
                <span className="font-sans text-[13px] font-semibold tracking-[0.3px] text-ink uppercase">
                  {g.country}
                </span>
              </div>
              {g.rows.map((r, rowIndexInGroup) => {
                const flatIndex = flatRows.findIndex(
                  (fr) => fr.groupIndex === groupIndex && fr.system === r.system && fr.start === r.start && fr.end === r.end,
                );
                const startPct = (r.start / FOOTPRINT_MAX) * 100;
                const endPct = (r.end / FOOTPRINT_MAX) * 100;
                const isActive = flatIndex === active;
                return (
                  <button
                    key={rowIndexInGroup}
                    type="button"
                    onMouseEnter={() => setActive(flatIndex)}
                    onFocus={() => setActive(flatIndex)}
                    onClick={() => setActive(flatIndex)}
                    className={`block w-full text-left relative py-4 px-2 -mx-2 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent ${
                      isActive ? 'bg-green/[0.07]' : 'hover:bg-green/[0.04]'
                    }`}
                  >
                    <div className="text-[13px] font-serif text-ink mb-5 mt-1">{r.system}</div>
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
                      <svg
                        className="absolute top-1/2 -translate-y-1/2"
                        style={{ left: `${endPct}%` }}
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        aria-hidden
                      >
                        <polygon points="0,1 0,10 11,5.5" fill="var(--color-green)" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-5 border-t-2 border-green">
        <div className="flex items-center gap-1.5 font-sans text-[12px] tracking-[0.5px] uppercase text-green font-semibold mb-1">
          <span>↳ Detail:</span>
          {row.flag ? <Flag country={row.flag} width={14} /> : null}
          <span>
            {row.country} · {row.system} · {toYear}
          </span>
        </div>
        <div className="m-0 mb-4 font-sans font-semibold" style={{ fontSize: 15, textTransform: 'none', letterSpacing: 'normal', color: 'var(--color-ink)' }}>
          {row.detailTitle}
        </div>
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
        <div className="flex items-center justify-between mt-3 text-[12.5px] font-sans text-mute italic">
          <span>← Lower rank is better</span>
          <span>{row.scaleNote}</span>
        </div>
      </div>
    </div>
  );
}
