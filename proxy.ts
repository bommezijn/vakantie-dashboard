import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 hernoemde "middleware" naar "proxy" — zelfde functionaliteit,
// nieuwe naam. De oude middleware.ts convention is deprecated en lijkt
// runtime-bugs te hebben op Vercel's Edge (MIDDLEWARE_INVOCATION_FAILED
// op module init, vóór de functie zelf draait).
//
// Alle supabase-interactie staat in een try/catch zodat een fout in
// session refresh nooit alle requests met 500 platlegt.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    await supabase.auth.getUser();
  } catch (err) {
    // Log maar laat de request doorgaan — proxy crash mag nooit de site
    // platleggen. Worst case: cookies worden niet ge-refreshed en de user
    // moet opnieuw aanmelden bij de volgende interactie.
    console.error("[proxy] supabase session refresh failed:", err);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
