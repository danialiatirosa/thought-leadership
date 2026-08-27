interface Tier {
  label: string;
  qs: number;
  the: number;
}

interface VolatilityChartProps {
  tiers: Tier[];
  caveat?: string;
}

const MAX = 18;

/**
 * Simple paired-bar chart. Two stripes per row (QS green, THE near-black).
 * No card. No background.
 */
export function VolatilityChart({ tiers, caveat }: VolatilityChartProps) {
  return (
    <div className="my-6">
      {tiers.map((t, i) => {
        const qsPct = Math.max(3, (t.qs / MAX) * 100);
        const thePct = Math.max(3, (t.the / MAX) * 100);
        return (
          <div key={i} className="grid grid-cols-[92px_1fr_72px] gap-3.5 items-center py-3 max-[480px]:grid-cols-[76px_1fr_56px] max-[480px]:gap-2.5">
            <div className="text-[16px] text-ink font-serif leading-tight">{t.label}</div>
            <div className="relative h-8 border-b border-rule">
              <div
                className="absolute left-0 top-[5px] h-3"
                style={{ width: `${qsPct}%`, background: 'var(--color-green)' }}
                aria-label={`QS ${t.qs}`}
              />
              <div
                className="absolute left-0 top-[17px] h-3"
                style={{ width: `${thePct}%`, background: 'var(--color-lime)' }}
                aria-label={`THE ${t.the}`}
              />
            </div>
            <div
              className="font-sans text-[15px] font-medium text-right text-ink tabular-nums"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {t.qs} / {t.the}
            </div>
          </div>
        );
      })}
      <div className="flex gap-5 mt-4 text-[13px] text-mute items-center font-sans flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3.5 h-2.5"
            style={{ background: 'var(--color-green)' }}
            aria-hidden
          />
          QS
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3.5 h-2.5"
            style={{ background: 'var(--color-lime)' }}
            aria-hidden
          />
          THE
        </div>
        {caveat ? <div className="ml-auto italic max-[480px]:ml-0 max-[480px]:basis-full">{caveat}</div> : null}
      </div>
    </div>
  );
}
