export interface TaxonomyItem {
  id: number;
  name: string;
  slug: string;
}

export interface BreakingNewsItem {
  id: number;
  title: string;
  slug: string;
}

export interface TaxonomiesData {
  categories: TaxonomyItem[];
  topics: TaxonomyItem[];
  breaking_news: BreakingNewsItem[];
}

export interface TaxonomiesResponse {
  data: TaxonomiesData;
  meta: {
    locale: string;
    categories_count: number;
    topics_count: number;
    breaking_news_count: number;
  };
}
