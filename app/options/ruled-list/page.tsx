import type { Metadata } from 'next';
import Link from 'next/link';
import { Masthead } from '@/components/Masthead';
import { Footer } from '@/components/Footer';
import { getAllArticles } from '@/lib/articles';
import { DEK, HeroFigure, Kicker, Meta, NO_UNDERLINE, frontPageStories, type Story } from '@/components/home/frontPage';

export const metadata: Metadata = {
  title: 'The Index (layout option: ruled list)',
  robots: { index: false, follow: false },
};

/**
 * Layout option C: a numbered, ruled contents list in the manner of a
 * magazine's issue page (Foreign Affairs, The Atlantic, the FT's Big Read).
 * Each brief is a full-width row: number, then label, headline and
 * standfirst, then its chart on the right, all hung from one top line. Calm,
 * and it scales to any number
 * of briefs without a lead to re-balance.
 */
export default function RuledListOption() {
  const stories = frontPageStories(getAllArticles());

  const row = (s: Story, i: number) => (
    <>
      <div className="font-serif text-[40px] leading-[0.8] -mt-px text-green-light/60 tabular-nums max-[760px]:hidden">
        {String(i + 1).padStart(2, '0')}
      </div>
      <div className="min-w-0">
        <Kicker>{s.kicker}</Kicker>
        <h2 className="font-serif font-normal text-green text-[34px] leading-[1.12] [text-wrap:balance] m-0 mb-3 group-hover:text-green-mid transition-colors max-[640px]:text-[26px]">
          {s.title}
        </h2>
        <p className={`${DEK} max-w-[52ch]`}>{s.dek}</p>
        <Meta>{s.meta}</Meta>
      </div>
      <div className="min-w-0 max-[760px]:order-first">
        {s.pic ? <HeroFigure exhibit={s.pic} variant="card" /> : null}
      </div>
    </>
  );

  return (
    <>
      <Masthead tagline="Long-form, data-driven analysis on policy, capability, and strategy." />
      <main id="main-content" className="mx-auto max-w-[1240px] px-8 py-6 max-[640px]:px-5">
        <ol className="list-none m-0 p-0">
          {stories.map((s, i) => {
            const cls =
              'group grid grid-cols-[72px_minmax(0,6fr)_minmax(0,5fr)] gap-x-10 items-start py-10 no-underline max-[760px]:grid-cols-1 max-[760px]:gap-y-5 max-[760px]:py-8';
            return (
              <li key={s.key} className={i > 0 ? 'border-t border-rule' : ''}>
                {s.href ? (
                  <Link href={s.href} style={NO_UNDERLINE} className={cls}>
                    {row(s, i)}
                  </Link>
                ) : (
                  <div className={cls}>{row(s, i)}</div>
                )}
              </li>
            );
          })}
        </ol>
      </main>
      <Footer />
    </>
  );
}
