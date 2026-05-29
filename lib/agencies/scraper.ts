import "server-only";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const MAX_BYTES = 2_000_000;

/**
 * Fetch an HTML page with a real browser UA — many travel sites silently hang
 * or return 403 for obvious bot UAs (axios/node-fetch defaults).
 *
 * Throws on HTTP error, non-HTML content-type, or oversized payload.
 * Caller is responsible for the AbortSignal (typically wired to a parent timeout).
 */
export async function fetchHtml(url: string, signal: AbortSignal): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "user-agent": BROWSER_UA,
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "nl-NL,nl;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
    },
    signal,
    redirect: "follow",
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("html")) throw new Error("Not HTML");

  const buf = await res.arrayBuffer();
  if (buf.byteLength > MAX_BYTES) throw new Error("Response too large");

  return new TextDecoder("utf-8").decode(buf);
}

/**
 * Pulls every `<script type="application/ld+json">` block from the HTML
 * and returns the parsed JSON. Items that fail to parse are skipped silently —
 * travel sites occasionally emit malformed JSON-LD and we don't want a single
 * broken block to nuke the whole search.
 */
export function extractJsonLd(html: string): unknown[] {
  const out: unknown[] = [];
  const re =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(re)) {
    try {
      const data = JSON.parse(m[1].trim());
      if (Array.isArray(data)) out.push(...data);
      else if (data && typeof data === "object") {
        // @context wrappers with @graph array
        const graph = (data as { "@graph"?: unknown[] })["@graph"];
        if (Array.isArray(graph)) out.push(...graph);
        else out.push(data);
      }
    } catch {
      // skip malformed block
    }
  }
  return out;
}

/**
 * Extracts the JSON blob from a Next.js __NEXT_DATA__ script tag.
 * Returns null if not present or unparseable.
 */
export function extractNextData(html: string): unknown {
  const m = html.match(
    /<script\s+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i
  );
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

/**
 * Protocol-relative → https:// (TUI's CDN emits //media.tuicontent.nl/...).
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}
