import type { Metadata } from 'next';
import Link from 'next/link';
import { Masthead } from '@/components/Masthead';
import { Footer } from '@/components/Footer';
import { getAllArticles } from '@/lib/articles';
import { DEK, HeroFigure, Kicker, Meta, NO_UNDERLINE, frontPageStories, type Story } from '@/components/home/frontPage';

export const metadata: Metadata = {
  title: 'The Index (layout option: three columns)',
  robots: { index: false, follow: false },
};

/**
 * Layout option B: three equal columns, one brief each, no lead. Each column
 * reads the same way: label, headline, standfirst, read time, then its chart.
 * The columns share row tracks (subgrid) so headlines and charts line up
 * across the page whatever the headline length.
 */
export default function ThreeColumnsOption() {
  const stories = frontPageStories(getAllArticles()).slice(0, 3);

  const body = (s: Story) => (
    <>
      <div className="min-w-0">
        <Kicker>{s.kicker}</Kicker>
        <h2 className="font-serif font-normal text-green text-[30px] leading-[1.15] [text-wrap:balance] m-0 mb-3 group-hover:text-green-mid transition-colors max-[640px]:text-[26px]">
          {s.title}
        </h2>
        <p className={DEK}>{s.dek}</p>
        <Meta>{s.meta}</Meta>
      </div>
      <div className="min-w-0 pt-6">{s.pic ? <HeroFigure exhibit={s.pic} variant="card" /> : null}</div>
    </>
  );

  return (
    <>
      <Masthead tagline="Long-form, data-driven analysis on policy, capability, and strategy." />
      <main id="main-content" className="mx-auto max-w-[1240px] px-8 py-10 max-[640px]:px-5">
        <div className="grid grid-cols-3 grid-rows-[auto_auto] max-[900px]:grid-cols-1 max-[900px]:grid-rows-none">
          {stories.map((s, i) => {
            const cls = `group row-span-2 grid grid-rows-subgrid no-underline px-8 first:pl-0 last:pr-0 max-[900px]:row-span-1 max-[900px]:grid-rows-none max-[900px]:px-0 max-[900px]:py-8 ${
              i > 0 ? 'border-l border-rule max-[900px]:border-l-0 max-[900px]:border-t' : ''
            }`;
            return s.href ? (
              <Link key={s.key} href={s.href} style={NO_UNDERLINE} className={cls}>
                {body(s)}
              </Link>
            ) : (
              <div key={s.key} className={cls}>
                {body(s)}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
