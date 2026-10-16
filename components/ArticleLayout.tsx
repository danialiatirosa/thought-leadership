import type { ReactNode } from 'react';

interface ArticleLayoutProps {
  children: ReactNode;
}

/**
 * Wraps the article body. Single neutral surface, no dark / alt variants.
 * Inner column is 820px so prose, exhibits and tables share the same axis.
 */
export function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <article className="prose-article mx-auto max-w-[820px] px-8 py-12 max-[640px]:px-5 max-[640px]:py-8">
      {children}
    </article>
  );
}

interface SectionProps {
  id: string;
  /** Retained as latent prop for backward compatibility, ignored visually. */
  variant?: 'default' | 'alt' | 'dark';
  /** 'highlight' sets the section on a faint teal panel (used for the executive summary). */
  tone?: 'default' | 'highlight';
  children: ReactNode;
}

/**
 * Article sections are now visually identical. The variant prop is kept so
 * existing MDX continues to compile, but does not change appearance.
 */
export function ArticleSection({ id, tone, children }: SectionProps) {
  // The highlight panel bleeds into the article's side padding so the text
  // column keeps its width. Top padding is small because the hidden Section 01
  // header above the first line still carries its own bottom margin.
  const className =
    tone === 'highlight'
      ? 'bg-green/[0.06] rounded-sm -mx-8 px-8 pt-2 pb-12 mb-6 max-[640px]:-mx-5 max-[640px]:px-5 max-[640px]:pt-1 max-[640px]:pb-8'
      : 'py-12 first:pt-4 max-[640px]:py-8';
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}
