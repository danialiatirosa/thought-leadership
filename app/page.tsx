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

/** Lead-story pictures, keyed by an article's `heroExhibit` frontmatter. */
const HERO_EXHIBITS: Record<string, ReactNode> = {
  'regional-composition': (
    <SVGStackedArea
      title="Composition of the THE WUR Top 100 by region, 2016 to 2027"
      paths={stackedAreaPaths}
      legend={stackedAreaLegend}
      years={stackedAreaYears}
      inlineLabels={stackedAreaInlineLabels}
    />
  ),
};

function Byline({ article }: { article: Article }) {
  return (
    <div className="ui-caps font-sans text-[11px] tracking-[1.5px] uppercase text-mute font-medium">
      By{' '}
      <span className="text-ink">{article.resolvedAuthors.map((a) => a.name).join(', ')}</span>
      <span className="text-mute/60 mx-2.5">·</span>
      {formatLongDate(article.publishedAt)}
      <span className="text-mute/60 mx-2.5">·</span>
      {article.readingTimeMinutes} min read
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
 * Front page, newspaper-style: the latest brief as a lead story (picture,
 * headline, standfirst) with an "In this brief" contents rail beside it, and
 * any earlier briefs in a ruled row of cards below.
 */
export default function HomePage() {
  const [lead, ...rest] = getAllArticles();
  const hero = lead?.heroExhibit ? HERO_EXHIBITS[lead.heroExhibit] : null;

  return (
    <>
      <Masthead />
      <main id="main-content" className="mx-auto max-w-[1240px] px-8 max-[640px]:px-5">
        <p className="m-0 py-4 border-b border-ink/70 font-serif italic text-[16px] text-mute text-center max-[640px]:text-[14px]">
          Long-form, data-driven analysis on policy, capability, and strategy.
        </p>

        {lead ? (
          <section className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-x-10 py-10 border-b border-ink/70 max-[900px]:grid-cols-1 max-[900px]:gap-y-10 max-[640px]:py-7">
            <Link
              href={`/articles/${lead.slug}`}
              className="block group no-underline border-none min-w-0"
            >
              <div className="mb-4">
                <Kicker>{CATEGORY_LABELS[lead.category]?.short ?? 'Latest brief'}</Kicker>
              </div>
              {hero ? <div className="mb-6">{hero}</div> : null}
              <h2 className="font-serif font-medium text-green text-[44px] leading-[1.1] -tracking-[0.5px] m-0 mb-3 group-hover:text-green-mid transition-colors max-[640px]:text-[30px]">
                {lead.title}
              </h2>
              <p className="font-serif italic text-[19px] leading-[1.5] text-ink/85 m-0 mb-4 max-w-[60ch] max-[640px]:text-[17px]">
                {lead.dek}
              </p>
              <Byline article={lead} />
            </Link>

            <aside className="border-l border-rule pl-10 min-w-0 max-[900px]:border-l-0 max-[900px]:pl-0 max-[900px]:border-t max-[900px]:pt-8">
              <div className="pb-3 border-b-2 border-ink">
                <Kicker>In this brief</Kicker>
              </div>
              <ol className="list-none m-0 p-0">
                {lead.sections.map((s) => (
                  <li key={s.id} className="border-b border-rule">
                    <Link
                      href={`/articles/${lead.slug}#${s.id}`}
                      className="block py-4 group no-underline border-none"
                    >
                      {s.number ? (
                        <div className="ui-caps font-sans text-[10.5px] tracking-[1.6px] uppercase text-mute font-medium mb-1">
                          Section {s.number}
                        </div>
                      ) : null}
                      <div className="font-serif text-[19px] leading-[1.3] text-green group-hover:text-green-mid transition-colors">
                        {s.label}
                      </div>
                      {s.title && s.title !== s.label ? (
                        <div className="font-serif text-[15px] leading-[1.45] text-ink/75 mt-1">
                          {s.title}
                        </div>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ol>
            </aside>
          </section>
        ) : null}

        {rest.length > 0 ? (
          <section className="py-10 border-b border-ink/70">
            <div className="mb-6">
              <Kicker>More from The Index</Kicker>
            </div>
            <div className="grid grid-cols-3 gap-x-10 max-[900px]:grid-cols-1 max-[900px]:gap-y-8">
              {rest.map((a) => (
                <Link
                  key={a.slug}
                  href={`/articles/${a.slug}`}
                  className="block group no-underline border-none border-t border-rule pt-5"
                >
                  <h3 className="font-serif font-medium text-green text-[24px] leading-[1.2] m-0 mb-2 group-hover:text-green-mid transition-colors">
                    {a.title}
                  </h3>
                  <p className="font-serif text-[16px] leading-[1.5] text-ink/80 m-0 mb-3">{a.dek}</p>
                  <Byline article={a} />
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
