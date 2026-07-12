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
  short_text: string;
  video_url: string | null;
  reading_time: number;
  views_count: number;
  published_at: string;
  episodes_count: number;
  image: BroadcastImage | null;
  is_favorite: boolean;
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
