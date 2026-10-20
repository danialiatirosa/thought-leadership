import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Masthead } from '@/components/Masthead';
import { Footer } from '@/components/Footer';
import { SVGStackedArea } from '@/components/exhibits/SVGStackedArea';
import { getAllArticles } from '@/lib/articles';
import { formatLongDate } from '@/lib/format';
import { CATEGORY_LABELS, type Article } from '@/types/article';
import {
  stackedAreaPaths,
  stackedAreaLegend,
  stackedAreaInlineLabels,
  stackedAreaYears,
} from '@/content/articles/rankings-decade-told-straight.data';

export const metadata: Metadata = {
  title: 'The Index',
  description: 'Long-form, data-driven analysis on policy, capability, and strategy.',
  alternates: { canonical: '/' },
};

interface HeroExhibit {
  heading: string;
  sub: string;
  source: string;
  chart: ReactNode;
}

/** Front-page pictures, keyed by an article's `heroExhibit` frontmatter. Each
 *  carries its own heading and source so the chart reads on its own. */
const HERO_EXHIBITS: Record<string, HeroExhibit> = {
  'regional-composition': {
    heading: 'Asia’s share of the Top 100 more than doubled, from 9% to 21%',
    sub: 'Composition of the Times Higher Education WUR Top 100 by region, 2016 to 2027 (% share)',
    source: 'Source: Times Higher Education World University Rankings, 2016 to 2027',
    chart: (
      <SVGStackedArea
        title="Composition of the THE WUR Top 100 by region, 2016 to 2027"
        paths={stackedAreaPaths}
        legend={stackedAreaLegend}
        years={stackedAreaYears}
        inlineLabels={stackedAreaInlineLabels}
      />
    ),
  },
  'pisa-trend': {
    heading: 'UAE scores are still below OECD average but improved in all subjects',
    sub: 'UAE and OECD average performance in PISA, 2012 to 2025',
    source: 'Source: OECD, PISA 2012 to 2025',
    chart: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/articles/pisa-2025/uae-oecd-trend-2012-2025.png"
        alt="Line charts of UAE and OECD average PISA scores in science, mathematics and reading, 2012 to 2025"
        width={2040}
        height={690}
        className="block w-full h-auto mix-blend-multiply"
      />
    ),
  },
};

/** Chart with its heading; `compact` (secondary cards) drops the subtitle and source. */
function HeroFigure({ exhibit, compact = false }: { exhibit: HeroExhibit; compact?: boolean }) {
  return (
    <figure className="m-0">
      <figcaption className={compact ? 'mb-2' : 'mb-3'}>
        <div
          className={`font-sans font-semibold text-ink leading-[1.3] ${compact ? 'text-[13px]' : 'text-[15px]'}`}
        >
          {exhibit.heading}
        </div>
        {compact ? null : (
          <div className="font-sans text-[13px] text-mute leading-[1.4] mt-0.5">{exhibit.sub}</div>
        )}
      </figcaption>
      {exhibit.chart}
      {compact ? null : <div className="font-sans text-[11px] text-mute mt-2">{exhibit.source}</div>}
    </figure>
  );
}

function heroFor(article: Article): HeroExhibit | null {
  return article.heroExhibit ? (HERO_EXHIBITS[article.heroExhibit] ?? null) : null;
}

/** Date and reading time. No author: every brief is by Tamkeen Policy and Strategy. */
function Byline({ article }: { article: Article }) {
  return (
    <div className="ui-caps font-sans text-[11px] tracking-[1.5px] uppercase text-mute font-medium">
      <span className="whitespace-nowrap">{formatLongDate(article.publishedAt)}</span>
      <span className="text-mute/60 mx-2.5">·</span>
      <span className="whitespace-nowrap">{article.readingTimeMinutes} min read</span>
    </div>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="ui-caps font-sans text-[11px] tracking-[2px] uppercase text-green font-semibold">
      {children}
    </div>
  );
}


/**
 * Front page, newspaper-style. The newest brief is the lead story (headline
 * and standfirst beside its chart); the next three sit in a ruled row of
 * cards below; anything older drops into a compact list. Slots only render
 * when there are articles to fill them.
 */
export default function HomePage() {
  const [lead, ...rest] = getAllArticles();
  const secondary = rest.slice(0, 3);
  const older = rest.slice(3);
  const hero = lead ? heroFor(lead) : null;

  return (
    <>
      <Masthead />
      <main id="main-content" className="mx-auto max-w-[1240px] px-8 max-[640px]:px-5">
        <p className="m-0 py-4 border-b border-ink/70 font-serif italic text-[16px] text-mute text-center max-[640px]:text-[14px]">
          Long-form, data-driven analysis on policy, capability, and strategy.
        </p>

        {lead ? (
          <Link
            href={`/articles/${lead.slug}`}
            // Inline because the global a { border-bottom } rule is unlayered and beats Tailwind's border utilities.
            style={{ borderBottom: '1px solid color-mix(in srgb, var(--color-ink) 70%, transparent)' }}
            className={`group no-underline border-none py-10 border-b border-ink/70 grid gap-x-10 max-[900px]:grid-cols-1 max-[900px]:gap-y-6 max-[640px]:py-7 ${
              hero ? 'grid-cols-[minmax(0,5fr)_minmax(0,7fr)]' : 'grid-cols-1'
            }`}
          >
            <div className="min-w-0 self-center">
              <div className="mb-4">
                <Kicker>{CATEGORY_LABELS[lead.category]?.short ?? 'Latest brief'}</Kicker>
              </div>
              <h2 className="font-serif font-medium text-green text-[38px] leading-[1.12] -tracking-[0.4px] [text-wrap:balance] m-0 mb-4 group-hover:text-green-mid transition-colors max-[640px]:text-[30px]">
                {lead.title}
              </h2>
              <p className="font-serif italic text-[19px] leading-[1.5] text-ink/85 m-0 mb-5 max-w-[60ch] max-[640px]:text-[17px]">
                {lead.dek}
              </p>
              <Byline article={lead} />
            </div>
            {hero ? (
              <div className="min-w-0 max-[900px]:order-first">
                <HeroFigure exhibit={hero} />
              </div>
            ) : null}
          </Link>
        ) : null}

        {secondary.length > 0 ? (
          <section
            // As many columns as there are cards (up to three), so two briefs share the row evenly.
            className={`grid py-8 border-b border-ink/70 max-[900px]:grid-cols-1 ${
              ['', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3'][secondary.length]
            }`}
          >
            {secondary.map((a, i) => {
              const pic = heroFor(a);
              // A lone card sits text-left, chart-right; in a row of two or three
              // the chart tops each card.
              const solo = secondary.length === 1;
              return (
                <Link
                  key={a.slug}
                  href={`/articles/${a.slug}`}
                  style={{ borderBottom: 'none' }}
                  className={`group no-underline border-none px-6 first:pl-0 last:pr-0 max-[900px]:px-0 max-[900px]:py-6 ${
                    i > 0 ? 'border-l border-rule max-[900px]:border-l-0 max-[900px]:border-t' : ''
                  } ${
                    solo && pic
                      ? 'grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-x-10 items-center max-[900px]:grid-cols-1 max-[900px]:gap-y-4'
                      : 'block'
                  }`}
                >
                  {pic && !solo ? (
                    <div className="mb-4">
                      <HeroFigure exhibit={pic} compact />
                    </div>
                  ) : null}
                  <div className="min-w-0">
                    <div className="mb-2">
                      <Kicker>{CATEGORY_LABELS[a.category]?.short ?? 'Brief'}</Kicker>
                    </div>
                    <h3 className="font-serif font-medium text-green text-[28px] leading-[1.2] m-0 mb-2 [text-wrap:balance] group-hover:text-green-mid transition-colors max-[640px]:text-[24px]">
                      {a.title}
                    </h3>
                    <p className="font-serif italic text-[17px] leading-[1.5] text-ink/80 m-0 mb-3 max-w-[56ch]">
                      {a.dek}
                    </p>
                    <Byline article={a} />
                  </div>
                  {pic && solo ? (
                    <div className="min-w-0 max-[900px]:order-first">
                      <HeroFigure exhibit={pic} compact />
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </section>
        ) : null}

        {older.length > 0 ? (
          <section className="py-8 border-b border-ink/70">
            <div className="pb-3 mb-1 border-b-2 border-ink">
              <Kicker>More from The Index</Kicker>
            </div>
            <ol className="list-none m-0 p-0">
              {older.map((a) => (
                <li key={a.slug} className="border-b border-rule last:border-b-0">
                  <Link
                    href={`/articles/${a.slug}`}
                    style={{ borderBottom: 'none' }}
                    className="flex items-baseline justify-between gap-6 py-4 group no-underline border-none max-[640px]:flex-col max-[640px]:gap-1"
                  >
                    <span className="font-serif text-[20px] leading-[1.3] text-green group-hover:text-green-mid transition-colors">
                      {a.title}
                    </span>
                    <span className="ui-caps font-sans text-[11px] tracking-[1.5px] uppercase text-mute whitespace-nowrap">
                      {formatLongDate(a.publishedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
