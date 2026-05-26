import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Inlined in plaats van import uit lib/supabase/middleware omdat Vercel's
// Edge bundler de @/ path-alias niet resolvet bij middleware-builds.
//
// Database typing wordt hier weggelaten — de middleware roept alleen
// supabase.auth.getUser() aan om de session-cookies te refreshen, geen
// queries die typing nodig hebben.
//
// Alle supabase-interactie staat in een try/catch zodat een fout in
// session refresh nooit de hele site neerhaalt (de matcher raakt alle
// routes — een crash hier = 500 op iedere request).
export async function middleware(request: NextRequest) {
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
    // Log maar laat de request doorgaan — middleware crash mag nooit de site
    // platleggen. Worst case: cookies worden niet ge-refreshed en de user
    // moet opnieuw aanmelden bij de volgende interactie.
    console.error("[middleware] supabase session refresh failed:", err);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
