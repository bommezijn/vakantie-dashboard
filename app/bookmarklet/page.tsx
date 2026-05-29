import { SiteHeader } from "@/components/layout/site-header";
import { InstallLink } from "@/components/bookmarklet/install-link";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Bookmarklet — Vakantieplanner",
};

// SiteHeader gebruikt useQueryState (nuqs) wat een runtime context vereist —
// forceer dynamic rendering om de Suspense-prerender check te omzeilen.
export const dynamic = "force-dynamic";

export default function BookmarkletPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 lg:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold leading-tight">
            Voeg deals toe met één klik
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sleep onderstaande knop naar je bookmark-bar. Open daarna een
            vakantiepagina op TUI, Sunweb, Corendon of een andere site, klik
            de bookmark, en de gegevens worden automatisch overgenomen.
          </p>
        </div>

        <Card className="flex flex-col items-center gap-4 p-8 text-center">
          <InstallLink />
          <p className="text-xs text-muted-foreground">
            ↑ Sleep deze knop naar je bookmark-bar (Ctrl+Shift+B in Chrome om die te tonen)
          </p>
        </Card>

        <div className="mt-8 grid gap-4">
          <Section
            n={1}
            title="Toon je bookmark-bar"
            body="In Chrome: Ctrl+Shift+B. In Firefox: rechtermuisknop op de adresbalk → Bookmarks Toolbar."
          />
          <Section
            n={2}
            title="Sleep de blauwe knop"
            body="Klik en houd de knop hierboven vast, sleep hem naar je bookmark-bar en laat los."
          />
          <Section
            n={3}
            title="Browse naar een vakantiesite"
            body="Open een hotelpagina op TUI, Sunweb, of welke reissite dan ook. Wacht tot de pagina volledig geladen is."
          />
          <Section
            n={4}
            title="Klik op de bookmark"
            body="Een nieuw tabblad opent met een formulier waarin titel, prijs, afbeelding en aanbieder al ingevuld zijn. Controleer, vul aan (land, duur), en sla op."
          />
        </div>

        <Card className="mt-8 border-amber-200 bg-amber-50/50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-semibold text-amber-900 dark:text-amber-200">Waarom een bookmarklet?</p>
          <p className="mt-1 text-amber-800 dark:text-amber-300">
            Moderne reissites laden hun deals via JavaScript ná het laden van
            de pagina, en blokkeren server-side scrapers. De bookmarklet leest
            data uit de al-geladen pagina in je eigen browser — dus geen
            bot-protection issues, en het werkt op elke site.
          </p>
        </Card>
      </main>
    </div>
  );
}

function Section({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex gap-4 rounded-lg border bg-card p-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e8fd94] text-sm font-bold text-[#1a2d5a]">
        {n}
      </span>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
