export interface FavoriteImage {
  url: string;
  thumbnail: string;
  medium?: string;
  alt?: string;
}

export interface FavoriteAuthor {
  id: number;
  name: string;
  image: {
    url: string;
    thumbnail: string;
  };
}

export interface FavoriteTaxonomy {
  id: number;
  name: string;
  slug: string;
}

export interface FavoriteItem {
  id: number;
  title: string;
  slug: string;
  short_text: string;
  reading_time: number;
  published_at: string;
  image: FavoriteImage;
  author: FavoriteAuthor;
  topic: FavoriteTaxonomy;
  category: FavoriteTaxonomy;
  is_favorite: boolean;
}

export interface FavoritesResponse {
  data: FavoriteItem[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
