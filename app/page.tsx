import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Masthead } from '@/components/Masthead';
import { Footer } from '@/components/Footer';
import { SVGStackedArea } from '@/components/exhibits/SVGStackedArea';
import { getAllArticles } from '@/lib/articles';
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

/**
 * Chart with its heading. `full` (lead story) adds the subtitle and source;
 * `card` keeps only the heading; `thumb` is the bare chart, used like a
 * thumbnail picture beside a headline.
 */
function HeroFigure({
  exhibit,
  variant = 'full',
}: {
  exhibit: HeroExhibit;
  variant?: 'full' | 'card' | 'thumb';
}) {
  if (variant === 'thumb') return <figure className="m-0">{exhibit.chart}</figure>;
  return (
    <figure className="m-0">
      <figcaption className="mb-2">
        <div className="font-sans font-semibold text-ink leading-[1.3] text-[14px]">{exhibit.heading}</div>
        {variant === 'full' ? (
          <div className="font-sans text-[13px] text-mute leading-[1.4] mt-0.5">{exhibit.sub}</div>
        ) : null}
      </figcaption>
      {exhibit.chart}
      {variant === 'full' ? <div className="font-sans text-[11px] text-mute mt-2">{exhibit.source}</div> : null}
    </figure>
  );
}

function heroFor(article: Article): HeroExhibit | null {
  return article.heroExhibit ? (HERO_EXHIBITS[article.heroExhibit] ?? null) : null;
}

/**
 * Valley-of-death sketch for the upcoming commercialization brief: funding
 * across Technology Readiness Levels 1 to 9, dipping at TRL 4 to 6 where the
 * UAE's funding is missing. Illustrative shape, not data.
 */
function ValleyOfDeathSketch() {
  // Drawn on the same 1000 x 434 canvas, type sizes and greys as the
  // stacked-area chart so the two cards read as one set.
  const x = (trl: number) => 90 + (trl - 1) * 102.5;
  const base = 304;
  const tick = { fontSize: 19, fill: 'var(--color-ink-soft)' } as const;
  return (
    <svg
      viewBox="0 0 1000 434"
      role="img"
      aria-label="Illustrative valley of death curve across TRL 1 to 9, with a funding gap at TRL 4 to 6"
      className="block w-full h-auto font-sans"
      fontFamily="Inter, sans-serif"
    >
      <rect x={x(3.6)} y={4} width={x(6.4) - x(3.6)} height={base - 4} fill="var(--color-lime)" opacity={0.3} />
      <text x={(x(4) + x(6)) / 2} y={34} textAnchor="middle" fontSize={19} fontWeight={600} fill="var(--color-ink)">
        UAE funding gap
      </text>
      <path
        d={`M${x(1)},70 C${x(2)},70 ${x(3)},90 ${x(4)},190 C${x(4.6)},250 ${x(5.4)},250 ${x(6)},190 C${x(7)},90 ${x(8)},70 ${x(9)},70`}
        fill="none"
        stroke="var(--color-green)"
        strokeWidth={5}
      />
      <line x1={x(1)} x2={x(9)} y1={base} y2={base} stroke="var(--color-ink-soft)" strokeWidth={1.5} />
      <text x={30} y={base / 2} transform={`rotate(-90 30 ${base / 2})`} textAnchor="middle" {...tick}>
        Funding
      </text>
      {Array.from({ length: 9 }, (_, i) => (
        <text key={i} x={x(i + 1)} y={base + 30} textAnchor="middle" {...tick}>
          {i + 1}
        </text>
      ))}
      <text x={x(1)} y={base + 72} {...tick}>Research</text>
      <text x={x(5)} y={base + 72} textAnchor="middle" {...tick}>Technology Readiness Level</text>
      <text x={x(9)} y={base + 72} textAnchor="end" {...tick}>Market</text>
    </svg>
  );
}

/** Briefs in preparation: shown as unlinked cards after the published ones. */
const UPCOMING: { title: string; dek: string; category: string; exhibit: HeroExhibit }[] = [
  {
    title: 'Research Commercialization in the UAE',
    dek: 'UAE outlook for research commercialization, what best-in-class ecosystems are doing and the way forward for UAE',
    category: 'Research',
    exhibit: {
      heading: 'The ‘valley of death’: where UAE funding is missing (TRL 4–6), illustrative',
      sub: 'Funding across Technology Readiness Levels 1 to 9 (illustrative)',
      source: 'Illustrative',
      chart: <ValleyOfDeathSketch />,
    },
  },
];

/** Reading time only, as on a newspaper front page; every brief is by Tamkeen Policy and Strategy. */
function Meta({ children }: { children: ReactNode }) {
  return <div className="font-sans text-[13px] text-mute">{children}</div>;
}

/** Section label above a headline: small, sentence case, in the accent colour. */
function Kicker({ children }: { children: ReactNode }) {
  return <div className="font-sans text-[14px] font-medium text-green mb-1.5">{children}</div>;
}

function categoryOf(a: Article): string {
  return CATEGORY_LABELS[a.category]?.short ?? 'Brief';
}

/** Headline sizes: one per tier, used everywhere. */
const HEADLINE = {
  lead: 'font-serif font-normal text-green text-[38px] leading-[1.12] -tracking-[0.3px] [text-wrap:balance] m-0 mb-3 max-[640px]:text-[30px]',
  side: 'font-serif font-normal text-green text-[26px] leading-[1.18] [text-wrap:balance] m-0 mb-2',
  small: 'font-serif font-normal text-green text-[20px] leading-[1.25] [text-wrap:balance] m-0 mb-2',
};
const DEK = 'font-serif text-[17px] leading-[1.45] text-ink/85 m-0 mb-3';
// The global a { border-bottom } rule is unlayered and beats Tailwind's border utilities.
const NO_UNDERLINE = { borderBottom: 'none' } as const;

/**
 * Front page on a newspaper grid (after The Economist): the lead story with
 * a large chart on top on the left; on the right, the next briefs stacked,
 * each headline beside its chart, with upcoming briefs (unlinked) after the
 * published ones. Anything older drops into a row of small cards below.
 */
export default function HomePage() {
  const [lead, ...rest] = getAllArticles();
  const side = rest.slice(0, 3);
  const upcoming = UPCOMING.slice(0, Math.max(0, 3 - side.length));
  const row = rest.slice(3, 7);
  const leadPic = lead ? heroFor(lead) : null;

  const sideItem = (
    key: string,
    i: number,
    kicker: ReactNode,
    title: string,
    dek: string,
    meta: string,
    pic: HeroExhibit | null,
  ) => (
    <div
      key={key}
      className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-6 items-start max-[640px]:grid-cols-1 max-[640px]:gap-y-3 ${
        i > 0 ? 'mt-6 pt-6 border-t border-rule' : ''
      }`}
    >
      <div className="min-w-0">
        <Kicker>{kicker}</Kicker>
        <h3 className={`${HEADLINE.side} group-hover:text-green-mid transition-colors`}>{title}</h3>
        <p className={DEK}>{dek}</p>
        <Meta>{meta}</Meta>
      </div>
      {pic ? (
        <div className="min-w-0 pt-1 max-[640px]:order-first">
          <HeroFigure exhibit={pic} variant="thumb" />
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <Masthead />
      <main id="main-content" className="mx-auto max-w-[1240px] px-8 max-[640px]:px-5">
        <p className="m-0 py-4 border-b border-ink/70 font-serif italic text-[16px] text-mute text-center max-[640px]:text-[14px]">
          Long-form, data-driven analysis on policy, capability, and strategy.
        </p>

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] py-8 border-b border-ink/70 max-[900px]:grid-cols-1">
          {lead ? (
            <Link
              href={`/articles/${lead.slug}`}
              style={NO_UNDERLINE}
              className="group block no-underline pr-8 border-r border-rule max-[900px]:pr-0 max-[900px]:border-r-0 max-[900px]:pb-8 max-[900px]:border-b"
            >
              {leadPic ? (
                <div className="mb-5">
                  <HeroFigure exhibit={leadPic} />
                </div>
              ) : null}
              <Kicker>{categoryOf(lead)}</Kicker>
              <h2 className={`${HEADLINE.lead} group-hover:text-green-mid transition-colors`}>{lead.title}</h2>
              <p className={DEK}>{lead.dek}</p>
              <Meta>{lead.readingTimeMinutes} min read</Meta>
            </Link>
          ) : null}

          <div className="pl-8 min-w-0 max-[900px]:pl-0 max-[900px]:pt-8">
            {side.map((a, i) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} style={NO_UNDERLINE} className="group block no-underline">
                {sideItem(a.slug, i, categoryOf(a), a.title, a.dek, `${a.readingTimeMinutes} min read`, heroFor(a))}
              </Link>
            ))}
            {upcoming.map((u, j) =>
              // Not a link: the brief is not published yet.
              sideItem(
                u.title,
                side.length + j,
                <>
                  Coming up <span className="text-mute/60 mx-1">·</span> {u.category}
                </>,
                u.title,
                u.dek,
                'In preparation',
                u.exhibit,
              ),
            )}
          </div>
        </div>

        {row.length > 0 ? (
          <section className="grid grid-cols-4 py-8 border-b border-ink/70 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-y-6">
            {row.map((a, i) => {
              const pic = heroFor(a);
              return (
                <Link
                  key={a.slug}
                  href={`/articles/${a.slug}`}
                  style={NO_UNDERLINE}
                  className={`group block no-underline px-5 first:pl-0 last:pr-0 max-[640px]:px-0 ${
                    i > 0 ? 'border-l border-rule max-[640px]:border-l-0' : ''
                  }`}
                >
                  {pic ? (
                    <div className="mb-3">
                      <HeroFigure exhibit={pic} variant="thumb" />
                    </div>
                  ) : null}
                  <Kicker>{categoryOf(a)}</Kicker>
                  <h3 className={`${HEADLINE.small} group-hover:text-green-mid transition-colors`}>{a.title}</h3>
                  <Meta>{a.readingTimeMinutes} min read</Meta>
                </Link>
              );
            })}
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
