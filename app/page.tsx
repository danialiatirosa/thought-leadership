import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Masthead } from '@/components/Masthead';
import { Footer } from '@/components/Footer';
import { getAllArticles } from '@/lib/articles';
import {
  DEK,
  HEADLINE,
  HeroFigure,
  type HeroExhibit,
  Kicker,
  Meta,
  NO_UNDERLINE,
  UPCOMING,
  categoryOf,
  heroFor,
} from '@/components/home/frontPage';

export const metadata: Metadata = {
  title: 'The Index',
  description: 'Long-form, data-driven analysis on policy, capability, and strategy.',
  alternates: { canonical: '/' },
};

/**
 * Front page on a newspaper grid (after The Economist): the lead story, headline
 * first with a large chart below it, on the left; on the right, the next briefs stacked,
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
          <HeroFigure exhibit={pic} variant="card" />
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <Masthead tagline="Long-form, data-driven analysis on policy, capability, and strategy." />
      <main id="main-content" className="mx-auto max-w-[1240px] px-8 pt-8 max-[640px]:px-5">

        <div className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] pt-2 pb-10 max-[900px]:grid-cols-1 ${row.length > 0 ? 'border-b border-ink/70' : ''}`}>
          {lead ? (
            <Link
              href={`/articles/${lead.slug}`}
              style={NO_UNDERLINE}
              className="group block no-underline pr-8 border-r border-rule max-[900px]:pr-0 max-[900px]:border-r-0 max-[900px]:pb-8 max-[900px]:border-b"
            >
              <Kicker>{categoryOf(lead)}</Kicker>
              <h2 className={`${HEADLINE.lead} group-hover:text-green-mid transition-colors`}>{lead.title}</h2>
              <p className={DEK}>{lead.dek}</p>
              <Meta>{lead.readingTimeMinutes} min read</Meta>
              {leadPic ? (
                <div className="mt-7">
                  <HeroFigure exhibit={leadPic} />
                </div>
              ) : null}
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
