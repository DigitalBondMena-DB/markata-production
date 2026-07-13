import { Image } from "./home.interface";

export interface SocialMediaLink {
  id: number;
  name: string;
  image: Image;
  url: string;
  sort_order: number;
}

export interface SocialResponse {
  data: SocialMediaLink[];
}
