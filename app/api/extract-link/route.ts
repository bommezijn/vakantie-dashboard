import { NextResponse } from "next/server";
import { inferProviderFromUrl, parseOgMetadata } from "@/lib/og-parser";

const MAX_BYTES = 1_000_000;

export async function POST(req: Request) {
  let url: string;
  try {
    const body = (await req.json()) as { url?: unknown };
    if (typeof body.url !== "string" || !body.url) {
      return NextResponse.json({ error: "url ontbreekt" }, { status: 400 });
    }
    url = body.url.trim();
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Ongeldige URL" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "nl-NL,nl;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(12_000),
      redirect: "follow",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Bron antwoordde met ${res.status}` },
        { status: 400 }
      );
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return NextResponse.json({ error: "URL is geen HTML pagina" }, { status: 400 });
    }

    // Cap body size — guard against huge responses
    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: "Pagina te groot om te parsen" }, { status: 400 });
    }
    const html = new TextDecoder("utf-8").decode(buf);

    const meta = parseOgMetadata(html);
    const provider = inferProviderFromUrl(meta.url ?? url);

    return NextResponse.json({
      title: meta.title ?? "",
      description: meta.description ?? "",
      image: meta.image ?? "",
      providerUrl: meta.url ?? url,
      provider,
      siteName: meta.siteName ?? "",
    });
  } catch (err) {
    // Give readable messages for the two most common failure modes
    const name = err instanceof Error ? err.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      return NextResponse.json(
        { error: "De website reageerde niet op tijd (timeout)" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Ophalen mislukt" }, { status: 500 });
  }
}
