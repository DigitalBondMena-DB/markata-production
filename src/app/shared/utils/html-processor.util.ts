export interface HeadingItem {
  id: string;
  text: string;
}

export interface ProcessedHtmlResult {
  html: string;
  headings: HeadingItem[];
}

const htmlProcessingCache = new Map<string, ProcessedHtmlResult>();

/**
 * Parses raw HTML, injects unique IDs into <h2> tags, and returns the modified HTML
 * along with the list of heading texts and their IDs for Table of Contents generation.
 * This operation is memoized using a local Map cache to optimize performance on heavy HTML.
 */
export function processHtmlHeadings(rawHtml: string | null | undefined): ProcessedHtmlResult {
  if (!rawHtml) {
    return { html: '', headings: [] };
  }

  const cached = htmlProcessingCache.get(rawHtml);
  if (cached) {
    return cached;
  }

  const headingsList: HeadingItem[] = [];
  let headingIndex = 0;

  const modifiedHtml = rawHtml.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match: string, attrs: string, content: string) => {
    headingIndex++;
    const id = `heading-${headingIndex}`;
    const text = content.replace(/<[^>]*>/g, '').trim() || `Heading ${headingIndex}`;

    headingsList.push({ id, text });

    let cleanAttrs = attrs.replace(/\bid\s*=\s*['"][^'"]*['"]/i, '').trim();
    if (cleanAttrs) {
      cleanAttrs = ' ' + cleanAttrs;
    }

    return `<h2 id="${id}"${cleanAttrs}>${content}</h2>`;
  });

  const result: ProcessedHtmlResult = { html: modifiedHtml, headings: headingsList };

  // Cache the result to prevent recalculating on subsequent renders of the same content
  htmlProcessingCache.set(rawHtml, result);

  // Keep the cache bounded (e.g. max 100 entries)
  if (htmlProcessingCache.size > 100) {
    const firstKey = htmlProcessingCache.keys().next().value;
    if (firstKey !== undefined) {
      htmlProcessingCache.delete(firstKey);
    }
  }

  return result;
}
