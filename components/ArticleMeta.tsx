import type { Article } from '@/types/article';
import { formatLongDate } from '@/lib/format';
import { ScrollReveal } from './ScrollReveal';

interface ArticleMetaProps {
  article: Article;
}

/**
 * Hairline + small-caps line: lead section, date, reading time. Placed in the
 * article body at the start of Section 01 (the page passes `article` to the
 * MDX body as a prop).
 */
export function ArticleMeta({ article }: ArticleMetaProps) {
  return (
    <ScrollReveal className="flex items-center gap-4 mb-8 flex-wrap">
      <span aria-hidden className="block h-px w-10 bg-green-light" />
      <div className="ui-caps font-sans text-[11px] tracking-[1.6px] uppercase text-mute font-medium">
        {article.sections?.[0] ? (
          <>
            <span className="text-green font-semibold tracking-[2px]">
              Section {article.sections[0].number} — {article.sections[0].label}
            </span>
            <span className="text-mute/60 mx-2.5">·</span>
          </>
        ) : null}
        {formatLongDate(article.publishedAt)}
        <span className="text-mute/60 mx-2.5">·</span>
        {article.readingTimeMinutes} min read
      </div>
    </ScrollReveal>
  );
}
