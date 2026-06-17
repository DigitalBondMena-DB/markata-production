import { Article, SeoData, Topic, Category } from './home.interface';

export interface CategoryPageData {
  id: number;
  name: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  action_title?: string;
  action_text?: string;
  display_type?: 'grid' | 'cards' | 'list';
  image?: {
    url: string | null;
    thumbnail: string | null;
    medium?: string | null;
    large?: string | null;
    alt?: string | null;
  } | null;
  topics?: Topic[];
  categories?: Category[];
  articles: {
    data: Article[];
    links: {
      first: string | null;
      last: string | null;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      per_page: number;
      to: number;
      total: number;
    };
  };
}

export interface CategoryPageResponse {
  data: CategoryPageData;
  seo: SeoData;
  meta: {
    locale: string;
  };
}
