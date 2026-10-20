export type ArticleStatus = 'draft' | 'published';

/**
 * The publication's five themes. Every brief is filed under exactly one; the
 * theme name is the label shown above its headline.
 */
export type CategoryId = 'schools' | 'higher-education' | 'research' | 'ai-in-education' | 'skills';

export interface Author {
  id: string;
  name: string;
  bio?: string;
  affiliation?: string;
}

export interface ArticleFrontmatter {
  title: string;
  dek: string;
  emphasis?: string;
  slug: string;
  category: CategoryId;
  categoryNumber: number;
  publishedAt: string;
  filedFrom?: string;
  authors: string[];
  readingTime?: number;
  heroExhibit?: string;
  /** Latest ranking edition the article's data covers. Defaults to 2026. */
  dataEndYear?: number;
  /** Whether the analysis uses the World Bank R&D-as-share-of-GDP indicator. Defaults to true. */
  usesWorldBankRd?: boolean;
  /** Hide the closing 'About this analysis' box. Defaults to false. */
  hideClosing?: boolean;
  /** Hide 'The Index' wordmark in the masthead and footer. Defaults to false. */
  hideWordmark?: boolean;
  tags?: string[];
  status: ArticleStatus;
}

export interface ArticleSection {
  id: string;
  number: string;
  label?: string;
  title: string;
}

export interface Article extends ArticleFrontmatter {
  filePath: string;
  readingTimeMinutes: number;
  sections: ArticleSection[];
  resolvedAuthors: Author[];
}

export const CATEGORY_LABELS: Record<CategoryId, { label: string; short: string; blurb: string }> = {
  schools: {
    label: 'Schools',
    short: 'Schools',
    blurb: 'Learning outcomes, assessment and the school systems that shape them.',
  },
  'higher-education': {
    label: 'Higher Education',
    short: 'Higher Education',
    blurb: 'Universities, rankings, access and the strategies behind them.',
  },
  research: {
    label: 'Research & Innovation',
    short: 'Research & Innovation',
    blurb: 'Research output, funding and the path from lab to market.',
  },
  'ai-in-education': {
    label: 'AI in Education',
    short: 'AI in Education',
    blurb: 'How AI is changing teaching, learning and assessment.',
  },
  skills: {
    label: 'Skills & Workforce',
    short: 'Skills & Workforce',
    blurb: 'Graduate outcomes, talent and the labour market.',
  },
};

export const CATEGORY_KEYS: CategoryId[] = ['schools', 'higher-education', 'research', 'ai-in-education', 'skills'];

export interface CategoryHeadline {
  text: string;
  italic: string;
  standfirst: string;
}

export const CATEGORY_HEADLINES: Record<CategoryId, CategoryHeadline> = {
  schools: {
    text: 'What students learn, and how we know.',
    italic: 'how we know',
    standfirst: 'Learning outcomes, international assessments such as PISA, and the policies that move them.',
  },
  'higher-education': {
    text: 'How universities compete, and what it rewards.',
    italic: 'what it rewards',
    standfirst: 'Rankings, research strength, access and the national strategies behind them.',
  },
  research: {
    text: 'From discovery to market.',
    italic: 'to market',
    standfirst: 'Research output, funding and the commercialization that turns it into value.',
  },
  'ai-in-education': {
    text: 'Learning alongside machines.',
    italic: 'alongside machines',
    standfirst: 'AI in classrooms and universities: what helps, what harms and what to measure.',
  },
  skills: {
    text: 'From education to work.',
    italic: 'to work',
    standfirst: 'Graduate outcomes, talent pipelines and the skills the economy needs.',
  },
};
