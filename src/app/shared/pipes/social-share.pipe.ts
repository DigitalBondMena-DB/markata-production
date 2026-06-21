import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'socialShare'
})
export class SocialSharePipe implements PipeTransform {
  transform(
    url: string | null | undefined,
    platform: 'facebook' | 'twitter' | 'linkedin',
    overrideUrl?: string | null,
    text?: string | null
  ): string {
    if (overrideUrl) {
      return overrideUrl;
    }

    const shareUrl = url || '';
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case 'twitter':
        const tweetText = text ? `&text=${encodeURIComponent(text)}` : '';
        return `https://twitter.com/intent/tweet?url=${encodedUrl}${tweetText}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      default:
        return shareUrl;
    }
  }
}
