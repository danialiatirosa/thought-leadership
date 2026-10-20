import type { ReactNode } from 'react';
import { SVGStackedArea } from '@/components/exhibits/SVGStackedArea';
import { PisaScoresDot } from '@/components/exhibits/PisaScoresDot';
import { PisaScoresThumb } from '@/components/exhibits/PisaScoresThumb';
import { CATEGORY_LABELS, type Article } from '@/types/article';
import {
  stackedAreaPaths,
  stackedAreaLegend,
  stackedAreaInlineLabels,
  stackedAreaYears,
} from '@/content/articles/rankings-decade-told-straight.data';


/* Shared building blocks for the front page and its layout options. */

export interface HeroExhibit {
  heading: string;
  sub: string;
  source: string;
  chart: ReactNode;
  /** Simplified version for small slots (big labels, no legend); falls back to `chart`. */
  thumb?: ReactNode;
}

/** Front-page pictures, keyed by an article's `heroExhibit` frontmatter. Each
 *  carries its own heading and source so the chart reads on its own. */
export const HERO_EXHIBITS: Record<string, HeroExhibit> = {
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
    thumb: <RegionShareThumb />,
  },
  'pisa-scores': {
    heading: 'UAE scores are still below OECD average but improved in all subjects',
    sub: 'UAE performance in PISA 2025 against 2022, Dubai 2025 and the OECD average',
    source: 'Source: OECD, PISA 2022 and 2025',
    chart: <PisaScoresDot />,
    thumb: <PisaScoresThumb />,
  },
};

/**
 * Chart with its heading. `full` (lead story) adds the subtitle and source;
 * `card` keeps only the heading; `thumb` is the bare chart, used like a
 * thumbnail picture beside a headline.
 */
export function HeroFigure({
  exhibit,
  variant = 'full',
}: {
  exhibit: HeroExhibit;
  variant?: 'full' | 'card' | 'thumb';
}) {
  if (variant === 'thumb') return <figure className="m-0">{exhibit.thumb ?? exhibit.chart}</figure>;
  return (
    <figure className="m-0">
      <figcaption className="mb-2">
        <div className="font-sans font-semibold text-ink leading-[1.3] text-[14px]">{exhibit.heading}</div>
        {variant === 'full' ? (
          <div className="font-sans text-[13px] text-mute leading-[1.4] mt-0.5">{exhibit.sub}</div>
        ) : null}
      </figcaption>
      {variant === 'card' ? (exhibit.thumb ?? exhibit.chart) : exhibit.chart}
      {variant === 'full' ? <div className="font-sans text-[11px] text-mute mt-2">{exhibit.source}</div> : null}
    </figure>
  );
}

export function heroFor(article: Article): HeroExhibit | null {
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

/*
 * Small-slot chart versions. A full chart shrunk to a third of its width
 * leaves 6px type, so these are drawn for the slot instead: big labels set
 * inside the shapes, start and end only, no legend or gridlines.
 */
const THUMB_LABEL = { fontFamily: 'Inter, sans-serif', fontWeight: 600 } as const;

/** Share of the THE Top 100 by region, 2016 to 2027 (same paths as the article's chart). */
function RegionShareThumb() {
  return (
    <div>
      <svg viewBox="0 -4 820 308" role="img" aria-label="Share of the THE Top 100 by region, 2016 to 2027: Asia's band widens while North America and Europe narrow" className="block w-full h-auto">
        {stackedAreaPaths.map((p, i) => (
          <path key={i} d={p.d} fill={p.fill} />
        ))}
        <text x={24} y={250} fontSize={46} fill="var(--color-paper)" {...THUMB_LABEL}>North America</text>
        <text x={24} y={125} fontSize={46} fill="var(--color-paper)" {...THUMB_LABEL}>Europe</text>
        <text x={800} y={62} fontSize={40} textAnchor="end" fill="var(--color-ink)" {...THUMB_LABEL}>Asia</text>
      </svg>
      <div className="flex justify-between font-sans text-[12px] text-mute mt-1">
        <span>2016</span>
        <span>2027</span>
      </div>
    </div>
  );
}

/** Funding across TRL 1 to 9, dipping at TRL 4 to 6. Illustrative shape. */
function ValleyOfDeathThumb() {
  const x = (trl: number) => 20 + (trl - 1) * 70;
  return (
    <div>
      <svg viewBox="0 0 600 230" role="img" aria-label="Funding across Technology Readiness Levels 1 to 9, dipping at TRL 4 to 6 where UAE funding is missing" className="block w-full h-auto">
        <rect x={x(3.6)} y={0} width={x(6.4) - x(3.6)} height={220} fill="var(--color-lime)" opacity={0.3} />
        <text x={x(5)} y={40} fontSize={30} textAnchor="middle" fill="var(--color-ink)" {...THUMB_LABEL}>
          Funding gap
        </text>
        <path
          d={`M${x(1)},60 C${x(2)},60 ${x(3)},80 ${x(4)},150 C${x(4.6)},195 ${x(5.4)},195 ${x(6)},150 C${x(7)},80 ${x(8)},60 ${x(9)},60`}
          fill="none"
          stroke="var(--color-green)"
          strokeWidth={6}
        />
        <line x1={x(1)} x2={x(9)} y1={220} y2={220} stroke="var(--color-ink-soft)" strokeWidth={2} />
      </svg>
      <div className="flex justify-between font-sans text-[12px] text-mute mt-1">
        <span>TRL 1 · Research</span>
        <span>TRL 4–6</span>
        <span>TRL 9 · Market</span>
      </div>
    </div>
  );
}

/** Briefs in preparation: shown as unlinked cards after the published ones. */
export const UPCOMING: { title: string; dek: string; category: string; exhibit: HeroExhibit }[] = [
  {
    title: 'Research Commercialization in the UAE',
    dek: 'UAE outlook for research commercialization, what best-in-class ecosystems are doing and the way forward for UAE',
    category: 'Research',
    exhibit: {
      heading: 'The ‘valley of death’: UAE funding runs dry between lab and market (TRL 4–6)',
      sub: 'Funding across Technology Readiness Levels 1 to 9 (illustrative)',
      source: 'Illustrative',
      chart: <ValleyOfDeathSketch />,
      thumb: <ValleyOfDeathThumb />,
    },
  },
];

/** Reading time only, as on a newspaper front page; every brief is by Tamkeen Policy and Strategy. */
export function Meta({ children }: { children: ReactNode }) {
  return <div className="font-sans text-[13px] text-mute">{children}</div>;
}

/** Section label above a headline: small, sentence case, in the accent colour. */
export function Kicker({ children }: { children: ReactNode }) {
  return <div className="font-sans text-[14px] font-medium text-green mb-1.5">{children}</div>;
}

export function categoryOf(a: Article): string {
  return CATEGORY_LABELS[a.category]?.short ?? 'Brief';
}

/** Headline sizes: one per tier, used everywhere. */
export const HEADLINE = {
  lead: 'font-serif font-normal text-green text-[38px] leading-[1.12] -tracking-[0.3px] [text-wrap:balance] m-0 mb-3 max-[640px]:text-[30px]',
  side: 'font-serif font-normal text-green text-[26px] leading-[1.18] [text-wrap:balance] m-0 mb-2',
  small: 'font-serif font-normal text-green text-[20px] leading-[1.25] [text-wrap:balance] m-0 mb-2',
};
export const DEK = 'font-serif text-[17px] leading-[1.45] text-ink/85 m-0 mb-3';
// The global a { border-bottom } rule is unlayered and beats Tailwind's border utilities.
export const NO_UNDERLINE = { borderBottom: 'none' } as const;


/** One front-page slot: a published brief (linked) or an upcoming one (not linked). */
export interface Story {
  key: string;
  href?: string;
  kicker: ReactNode;
  title: string;
  dek: string;
  meta: string;
  pic: HeroExhibit | null;
}

/** Published briefs newest first, then upcoming ones, as uniform slots. */
export function frontPageStories(articles: Article[]): Story[] {
  return [
    ...articles.map((a) => ({
      key: a.slug,
      href: `/articles/${a.slug}`,
      kicker: categoryOf(a),
      title: a.title,
      dek: a.dek,
      meta: `${a.readingTimeMinutes} min read`,
      pic: heroFor(a),
    })),
    ...UPCOMING.map((u) => ({
      key: u.title,
      kicker: (
        <>
          Coming up <span className="text-mute/60 mx-1">·</span> {u.category}
        </>
      ),
      title: u.title,
      dek: u.dek,
      meta: 'In preparation',
      pic: u.exhibit,
    })),
  ];
}
