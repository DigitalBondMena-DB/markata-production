export interface SiteSettings {
  site_name: string;
  logo_url: string;
  favicon_url: string;
  email: string;
  phone: string;
  address: string;
  copyright: string;
  tracking: {
    google_analytics: string | null;
    google_tag_manager: string | null;
    facebook_pixel: string | null;
  };
}

export interface SiteSettingsResponse {
  data: SiteSettings;
}
