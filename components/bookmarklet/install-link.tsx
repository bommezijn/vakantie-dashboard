"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

/**
 * Build the bookmarklet at runtime on the install page so the target origin
 * is automatically the user's current host (works in dev + prod without
 * hardcoded URLs). Output is a `javascript:`-URL that the user drags to
 * their bookmark bar.
 *
 * The script:
 *  1. Extracts OG meta tags (title, image, description, url)
 *  2. Heuristically grabs the first €-price from the page text
 *  3. Maps hostname to a provider name (TUI, Sunweb, ...)
 *  4. Opens /voeg-toe on this app with all fields as query params
 */
function buildBookmarklet(origin: string): string {
  // Keep this minified — bookmark managers truncate long URLs in some browsers.
  // The placeholder __ORIGIN__ is replaced at the very end.
  const source = `void function(){var m=function(p,a){var e=document.querySelector('meta[property="'+p+'"]')||document.querySelector('meta[name="'+p+'"]');return e?e.getAttribute(a||'content'):''};var t=m('og:title')||document.title.replace(/\\s*[|\\-–—].*$/,'').trim(),i=m('og:image')||'',d=m('og:description')||m('description')||'',u=m('og:url')||location.href,p='',re=/€\\s?(\\d{1,3}(?:[.,]\\d{3})*(?:[.,]\\d{2})?)/g,b=(document.body.innerText||'').slice(0,8000),ma=re.exec(b);if(ma)p=ma[1].replace(/\\./g,'').replace(',','.');var h=location.hostname.replace(/^www\\./,''),pr='Anders';if(/tui/.test(h))pr='TUI';else if(/sunweb/.test(h))pr='Sunweb';else if(/corendon/.test(h))pr='Corendon';else if(/byjune/.test(h))pr='ByJune';else if(/prijsvrij/.test(h))pr='Prijsvrij';else if(/vakantiediscounter/.test(h))pr='Vakantiediscounter';var qs=new URLSearchParams({url:u,title:t,image:i,description:d,price:p,provider:pr});window.open('__ORIGIN__/voeg-toe?'+qs.toString(),'_blank')}()`;

  return `javascript:${source.replace("__ORIGIN__", origin)}`;
}

export function InstallLink() {
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // SSR: show a placeholder; the real href requires window.location.
  const href = origin ? buildBookmarklet(origin) : "#";
  const disabled = !origin;

  return (
    <a
      href={href}
      onClick={(e) => {
        // Clicking does nothing useful — users must DRAG it to their bookmark bar.
        // Show a helpful message instead of triggering the bookmarklet on this page.
        e.preventDefault();
        alert(
          "Sleep deze knop naar je bookmark bar. Klik er daarna op terwijl je op een vakantiesite bent."
        );
      }}
      draggable
      className={
        "inline-flex cursor-grab items-center gap-2 rounded-lg bg-[#2b438d] px-5 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-[#2b438d]/90 active:cursor-grabbing " +
        (disabled ? "pointer-events-none opacity-50" : "")
      }
    >
      <Bookmark className="size-5" />
      Save to Vakantieplanner
    </a>
  );
}
