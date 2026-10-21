import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Mona_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HOME } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// One family carries everything, at normal width: display set firm and
// tight, reading set plain. Its width axis gives the services chapter its
// eight supplier voices.
const mona = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-mona",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

/* Defaults only: every page sets its own title, canonical and social card
   through pageMetadata (lib/metadata.ts), so none inherits the homepage's */
export const metadata: Metadata = {
  title: HOME.title,
  description: HOME.description,
  metadataBase: new URL(SITE_URL),
};

/** Organization + WebSite structured data — the AEO company, machine-readable */
const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Plurel",
      url: `${SITE_URL}/`,
      description:
        "Plurel is a distribution engineering firm. One team runs narrative, brand identity, website design, AI search visibility (AEO/SEO), content, creators and UGC, paid media, PR and measurement as one system, for consumer brands, physical products, B2B technology and apps, and answers for one number agreed on day one.",
      email: "hello@plurel.com",
      image: `${SITE_URL}/og.png`,
      knowsAbout: [
        "Website design",
        "Brand identity",
        "AI search optimization (AEO)",
        "SEO",
        "Content marketing",
        "Creator and UGC programs",
        "Paid media",
        "PR and reputation",
        "Marketing technology",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Plurel",
      url: `${SITE_URL}/`,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      /* The inline script below adds data-js before first paint, so
         the pinned chapter (Services) can size its track in CSS with no layout shift */
      suppressHydrationWarning
      /* Lets the router force an instant jump to top on page navigations
         while keeping smooth scrolling for in-page anchors */
      data-scroll-behavior="smooth"
      className={`${mona.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}
    >
      <body id="top" className="min-h-screen">
        <a
          href="#main"
          className="sr-only z-[70] bg-ink px-4 py-3 text-sm text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {/* Reloads always start at the top — pages open on the headline
            cascade, never mid-scroll. Runs before the browser restores
            the previous scroll position. An internal link switches the
            mode to auto, so Back returns the reader to where they left. Also marks html[data-js] so
            scroll-driven layout (the pinned Services chapter) is sized in CSS
            before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if('scrollRestoration' in history){history.scrollRestoration='manual';document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^=\"/\"]');if(a)history.scrollRestoration='auto'},true)}}catch(e){}document.documentElement.setAttribute('data-js','')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <SiteHeader />
        <div id="main" tabIndex={-1} className="outline-none">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
