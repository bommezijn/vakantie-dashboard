"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export function AnonymousBootstrap() {
  useEffect(() => {
    const supabase = supabaseBrowser();
    if (!supabase) return;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
          // Most likely cause: "Anonymous sign-ins are disabled" (enable in
          // Supabase dashboard → Authentication → Providers → Anonymous).
          console.error("[auth] Anonymous sign-in failed:", error.message);
        }
      }
    });
  }, []);

  return null;
}
