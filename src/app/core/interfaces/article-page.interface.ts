import { Article } from './home.interface';

export interface ImageDetails {
  url: string | null;
  thumbnail: string | null;
  medium: string | null;
  large: string | null;
  alt: string | null;
}

export interface AuthorDetails {
  id: number;
  name: string;
  job_title: string;
  description: string;
  created_at: string;
  image: {
    url: string | null;
    thumbnail: string | null;
  } | null;
}

export interface TaxonomyInfo {
  id: number;
  name: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  action_title?: string;
  action_text?: string;
  is_active?: boolean;
  image?: ImageDetails;
  sort_order?: number;
}

export interface ArticleDetails {
  id: number;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  short_text: string;
  first_paragraph: string;
  brief: string;
  body: string;
  image_alt: string | null;
  reading_time: number;
  views_count: number;
  is_featured: boolean;
  status: string;
  is_active: boolean;
  published_at: string;
  image: ImageDetails | null;
  share?: {
    facebook: string | null;
    linkedin: string | null;
    twitter: string | null;
  };
  faq_schema?: any;
  author: AuthorDetails | null;
  category: TaxonomyInfo | null;
  topic: TaxonomyInfo | null;
  is_favorite?: boolean | null;
  audio?: {
    url: string | null;
  };
  created_at: string;
}

export interface SimplifiedArticle {
  id: number;
  title: string;
  slug: string;
  short_text: string;
  reading_time: number;
  published_at: string;
  image: ImageDetails | null;
  author: AuthorDetails | null;
  topic: TaxonomyInfo | null;
  category: TaxonomyInfo | null;
}

export interface ArticleDetailsResponse {
  data: ArticleDetails;
  other_slug: string;
  next_articles: SimplifiedArticle[];
  related_articles: SimplifiedArticle[];
  random_articles: SimplifiedArticle[];
  seo: {
    page_key: string;
    meta_title: string;
    meta_description: string;
    keywords: string;
    canonical_url: string;
    robots: string;
    og: {
      title: string;
      description: string;
      image: string | null;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
      image: string | null;
    };
    schema_markup: any;
  };
  meta: {
    locale: string;
  };
}

export interface ArticlesListResponse {
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
}