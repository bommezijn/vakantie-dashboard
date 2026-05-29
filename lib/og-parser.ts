export interface OgMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url?: string;
}

// Lightweight regex-based parser — sufficient for typical travel-deal pages.
// Handles both <meta property="og:..."> and <meta name="og:..."> (some sites use name).
export function parseOgMetadata(html: string): OgMetadata {
  const meta: OgMetadata = {};

  const tagRe = /<meta\s+([^>]+?)\/?>/gi;
  for (const match of html.matchAll(tagRe)) {
    const attrs = parseAttrs(match[1]);
    const key = attrs.property ?? attrs.name;
    const content = attrs.content;
    if (!key || !content) continue;

    switch (key.toLowerCase()) {
      case "og:title":
        meta.title ??= decode(content);
        break;
      case "og:description":
      case "description":
        meta.description ??= decode(content);
        break;
      case "og:image":
      case "og:image:url":
        meta.image ??= normalizeUrl(decode(content));
        break;
      case "og:site_name":
        meta.siteName ??= decode(content);
        break;
      case "og:url":
        meta.url ??= decode(content);
        break;
    }
  }

  if (!meta.title) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) meta.title = decode(titleMatch[1].trim());
  }

  return meta;
}

function parseAttrs(s: string): Record<string, string> {
  const result: Record<string, string> = {};
  const re = /(\w[\w:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  for (const m of s.matchAll(re)) {
    result[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? "";
  }
  return result;
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// Protocol-relative URLs (//example.com/img.jpg) are valid HTML but Next/Image
// requires an absolute URL. Always upgrade to https.
function normalizeUrl(url: string): string {
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

export function inferProviderFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    if (host.includes("tui")) return "TUI";
    if (host.includes("sunweb")) return "Sunweb";
    if (host.includes("corendon")) return "Corendon";
    if (host.includes("byjune")) return "ByJune";
    return "Anders";
  } catch {
    return "Anders";
  }
}
