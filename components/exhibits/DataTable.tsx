import type { ReactNode } from 'react';

export interface Column {
  key: string;
  label: string;
  align?: 'left' | 'right';
  numeric?: boolean;
  width?: string;
  /** Tint this column's header + body cells with a light grey background. */
  shaded?: boolean;
}

export interface DataTableRow {
  [k: string]: string | number | { value: string; tone?: 'pos' | 'neg' | 'flat' } | undefined;
}

interface GroupHeader {
  /** Group label, e.g. "QS". Omit (or use '') for a spacer over unlabelled leading columns. Used as alt text when logo is set. */
  label: string;
  /** How many of the columns array's entries, in order, this group spans. */
  span: number;
  /** Optional logo image src shown instead of the text label. */
  logo?: string;
}

interface DataTableProps {
  caption?: string;
  /** Optional row of grouped labels above the column headers, e.g. "QS" spanning 3 sub-columns. Spans must sum to columns.length. */
  groupHeader?: GroupHeader[];
  columns: Column[];
  rows: DataTableRow[];
  cellRender?: (col: Column, row: DataTableRow) => ReactNode;
}

function renderCell(col: Column, row: DataTableRow): ReactNode {
  const v = row[col.key];
  if (v == null) return '–';
  if (typeof v === 'object') {
    const cls =
      v.tone === 'pos'
        ? 'text-green font-semibold'
        : v.tone === 'neg'
          ? 'text-neg font-semibold'
          : '';
    return <span className={cls}>{v.value}</span>;
  }
  return v;
}

/**
 * Newspaper table: hairline rules only. Top of header, bottom of header,
 * bottom of table. No vertical rules. No zebra striping. Tabular numerals.
 * Numerics right-aligned, labels left-aligned.
 */
export function DataTable({ caption, groupHeader, columns, rows, cellRender }: DataTableProps) {
  return (
    <div className="my-10">
      <table
        className="w-full border-collapse font-sans text-[16px] max-[640px]:text-[13.5px]"
        style={{ fontVariantNumeric: 'tabular-nums', tableLayout: 'fixed' }}
      >
        {caption ? (
          <caption className="text-left font-serif font-medium text-[20px] mb-4 text-ink caption-top max-[640px]:text-[17px]">
            {caption}
          </caption>
        ) : null}
        <thead>
          {groupHeader ? (
            <tr>
              {groupHeader.map((g, i) => (
                <th
                  key={i}
                  colSpan={g.span}
                  scope="colgroup"
                  className={`px-2.5 pt-2 pb-2 font-sans font-semibold text-[13px] tracking-[1.2px] uppercase text-mute text-center max-[640px]:px-1.5 max-[640px]:text-[11px] ${
                    g.label ? 'border-b border-rule-soft' : ''
                  }`}
                >
                  {g.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={g.logo}
                      alt={g.label}
                      width={24}
                      height={24}
                      className="inline-block h-6 w-6 rounded-[5px] align-middle max-[640px]:h-5 max-[640px]:w-5"
                    />
                  ) : (
                    g.label
                  )}
                </th>
              ))}
            </tr>
          ) : null}
          <tr className="border-y border-ink">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={`px-2.5 py-3 font-sans font-semibold text-[14px] tracking-[1.2px] uppercase text-ink align-bottom max-[640px]:px-1.5 max-[640px]:py-2 max-[640px]:text-[12px] max-[640px]:tracking-[1px] ${
                  c.numeric || c.align === 'right' ? 'text-right' : 'text-left'
                } ${c.shaded ? 'bg-ink/[0.05]' : ''}`}
                style={c.width ? { width: c.width } : undefined}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-2.5 py-2.5 border-b border-rule text-ink/90 align-top max-[640px]:px-1.5 max-[640px]:py-2 ${
                    c.numeric
                      ? 'text-right tabular-nums whitespace-nowrap'
                      : c.align === 'right'
                        ? 'text-right'
                        : ''
                  } ${c.shaded ? 'bg-ink/[0.05]' : ''}`}
                  style={c.numeric ? { fontVariantNumeric: 'tabular-nums' } : undefined}
                >
                  {cellRender ? cellRender(c, r) : renderCell(c, r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
