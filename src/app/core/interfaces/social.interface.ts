export interface SocialMediaLink {
  id: number;
  name: string;
  icon: string;
  url: string;
  sort_order: number;
}

export interface SocialResponse {
  data: SocialMediaLink[];
}
