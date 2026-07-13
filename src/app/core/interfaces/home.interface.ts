export interface Image {
  url: string | null;
  thumbnail: string | null;
  medium?: string | null;
  alt?: string | null;
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
}

export interface Author {
  id: number;
  name: string;
  job_title?: string;
  description?: string;
  image: Image | null;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  short_text: string;
  reading_time: number;
  published_at: string;
  image: Image | null;
  author: Author | null;
  topic: Topic | null;
  is_favorite?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: Image | null;
}

export interface CategoryWithArticles {
  id: number;
  name: string;
  slug: string;
  display_type: 'grid' | 'cards' | 'list';
  image: Image | null;
  articles: Article[];
}

export interface SeoSocial {
  title: string;
  description: string;
  image: string | null;
}

export interface TwitterSeo extends SeoSocial {
  card: string;
}

export interface SeoData {
  page_key: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  canonical_url: string | null;
  robots: string;
  og: SeoSocial;
  twitter: TwitterSeo;
  schema_markup: string | any | null;
}

export interface HomeData {
  seo: SeoData;
  latest_articles: Article[];
  categories: Category[];
  by_display_type: {
    grid?: CategoryWithArticles[];
    cards?: CategoryWithArticles[];
    list?: CategoryWithArticles[];
  };
  campaign_intelligence: Article[];
  authors: Author[];
}

export interface HomeResponse {
  data: HomeData;
  meta: {
    locale: string;
  };
}
