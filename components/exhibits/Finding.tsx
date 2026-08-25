import type { ReactNode } from 'react';
import { TrendArrow } from './KpiStrip';

interface FindingProps {
  /** 1-based position, used for the "Finding 0N" kicker when there is no num. */
  index: number;
  /** Headline stat, KPI-strip style (e.g. "+11", "3x", ">100"). Omit for a text-only finding. */
  num?: string;
  unit?: string;
  tone?: 'pos' | 'neg' | 'default';
  trend?: 'up' | 'down' | 'flat';
  title: string;
  children: ReactNode;
}

/**
 * One finding, KPI-strip typography carried down into a single full-width
 * row so charts can be interleaved between findings in the MDX flow. A
 * stat-bearing finding leads with a big serif number (same treatment as
 * <KpiStrip>); a finding with no natural number falls back to a small
 * "Finding 0N" kicker in its place.
 */
export function Finding({ index, num, unit, tone, trend, title, children }: FindingProps) {
  return (
    <div className="my-10 grid grid-cols-[minmax(88px,168px)_1fr] gap-x-8 items-start pt-8 border-t border-green/25 first:pt-0 first:border-t-0 max-[640px]:grid-cols-1 max-[640px]:gap-y-3">
      <div className="min-w-0">
        {num ? (
          <div
            className={`font-serif font-medium leading-none -tracking-[0.6px] tabular-nums whitespace-nowrap ${
              tone === 'neg' ? 'text-ink' : 'text-green'
            }`}
            style={{
              fontFeatureSettings: '"lnum" 1, "tnum" 1',
              fontSize: 'clamp(28px, 3.4vw, 38px)',
            }}
          >
            {num}
            {unit ? <span className="text-[0.5em] tracking-normal font-normal text-mute ml-1">{unit}</span> : null}
            {trend ? <TrendArrow direction={trend} /> : null}
          </div>
        ) : (
          <div className="ui-caps font-sans text-[11px] tracking-[1.6px] uppercase text-green font-semibold">
            Finding {String(index).padStart(2, '0')}
          </div>
        )}
      </div>
      <div>
        <h4 className="m-0 mb-2 font-serif text-[19px] font-semibold normal-case tracking-[-0.1px] text-green leading-[1.3]">
          {title}
        </h4>
        <div className="[&>p]:m-0 text-[15px] leading-[1.55] text-ink/85 max-w-none">{children}</div>
      </div>
    </div>
  );
}
