import { SiteHeader } from "@/components/layout/site-header";
import { QuickAddDealForm } from "@/components/deals/quick-add-deal-form";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function asString(v: string | string[] | undefined): string {
  if (!v) return "";
  return Array.isArray(v) ? v[0] : v;
}

export default async function VoegToePage({ searchParams }: PageProps) {
  const sp = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 lg:px-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold leading-tight">Nieuwe deal toevoegen</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gegevens automatisch ingelezen via de bookmarklet. Controleer, vul aan, en sla op.
          </p>
        </div>
        <QuickAddDealForm
          initial={{
            url: asString(sp.url),
            title: asString(sp.title),
            image: asString(sp.image),
            description: asString(sp.description),
            price: asString(sp.price),
            provider: asString(sp.provider),
            country: asString(sp.country),
          }}
        />
      </main>
    </div>
  );
}
