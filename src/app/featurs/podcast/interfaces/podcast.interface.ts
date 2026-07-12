import { SeoData } from '@core/interfaces/home.interface';

export interface BroadcastImage {
  url: string;
  thumbnail: string;
  medium: string;
  alt: string | null;
}

export interface Broadcast {
  id: number;
  title: string;
  slug: string;
  short_text: string | null;
  video_url: string | null;
  reading_time: number;
  views_count: number;
  published_at: string;
  episodes_count: number;
  image: BroadcastImage | null;
  is_favorite: boolean | null;
  // Details fields:
  meta_title?: string | null;
  meta_description?: string | null;
  first_paragraph?: string | null;
  brief?: string | null;
  body?: string;
  image_alt?: string | null;
  is_featured?: boolean;
  status?: string;
  is_active?: boolean;
  audio?: any | null;
  share?: {
    facebook: string | null;
    linkedin: string | null;
    twitter: string | null;
  };
  faq_schema?: any[];
  episodes?: any[];
  created_at?: string;
  author?: any;
  category?: any;
  topic?: any;
}

export interface BroadcastDetailsResponse {
  data: Broadcast;
  other_slug: string;
  next_broadcasts: Broadcast[];
  related_broadcasts: Broadcast[];
  random_broadcasts: Broadcast[];
  seo: SeoData;
  meta: {
    locale: string;
  };
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface BroadcastsPaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface BroadcastsPaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginatedBroadcasts {
  data: Broadcast[];
  links: BroadcastsPaginationLinks;
  meta: BroadcastsPaginationMeta;
}

export interface BroadcastCounter {
  id: number;
  title: string;
  value: string;
  sort_order: number;
}

export interface BroadcastsData {
  latest: Broadcast | null;
  broadcasts: PaginatedBroadcasts;
  featured_broadcasts: Broadcast[];
  counters: BroadcastCounter[];
  favorites: Broadcast[];
}

export interface BroadcastsResponse {
  data: BroadcastsData;
  meta: {
    locale: string;
  };
}
