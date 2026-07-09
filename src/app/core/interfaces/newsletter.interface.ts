export interface NewsletterSubscription {
  id: number;
  email: string;
  locale: string;
  is_active: boolean;
  subscribed_at: string;
}

export interface NewsletterSubscribeResponse {
  data: NewsletterSubscription;
  message: string;
}
