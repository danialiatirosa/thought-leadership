import type { Article } from '@/types/article';
import { ScrollReveal } from './ScrollReveal';

interface ArticleMetaProps {
  article: Article;
}

/**
 * Hairline + small-caps label for the lead section, placed in the article
 * body at the start of the executive summary (the page passes `article` to
 * the MDX body as a prop). Date and reading time live in the hero byline.
 */
export function ArticleMeta({ article }: ArticleMetaProps) {
  const lead = article.sections?.[0];
  if (!lead) return null;
  return (
    <ScrollReveal className="flex items-center gap-4 mb-8 flex-wrap">
      <span aria-hidden className="block h-px w-10 bg-green-light" />
      <div className="ui-caps font-sans text-[11px] tracking-[1.6px] uppercase font-medium">
        <span className="text-green font-semibold tracking-[2px]">
          {lead.number ? `Section ${lead.number} — ` : null}
          {lead.label}
        </span>
      </div>
    </ScrollReveal>
  );
}
