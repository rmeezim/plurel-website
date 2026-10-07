import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Mona_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// One family carries everything. Its width axis gives the display style
// (wide, at 110%) and the reading style (normal) from the same face.
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

export const metadata: Metadata = {
  title: "Plurel — Marketing and distribution, rebuilt as one system",
  description:
    "Plurel is Northeon's distribution engineering company. Narrative, brand, website, AI search and SEO, content, creators, paid, PR and measurement, run as one system for growth-stage companies.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Plurel — Marketing and distribution, rebuilt as one system",
    description:
      "Your marketing shouldn't be ten companies. One narrative, one creative engine, one set of numbers, one accountable team across every relevant channel.",
    type: "website",
    siteName: "Plurel",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Plurel — We build the visible layer of growth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plurel — Marketing and distribution, rebuilt as one system",
    description:
      "Your marketing shouldn't be ten companies. It should be one system.",
    images: ["/og.png"],
  },
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
        "Plurel is Northeon's distribution engineering company: narrative, brand identity, website design, AI search visibility (AEO/SEO), content, creators and UGC, paid media, PR, and measurement, run as one marketing system.",
      email: "hello@plurel.com",
      image: `${SITE_URL}/og.png`,
      parentOrganization: { "@type": "Organization", name: "Northeon" },
      knowsAbout: [
        "Website design",
        "Brand identity",
        "AI search optimization (AEO)",
        "SEO",
        "Content marketing",
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
      /* The inline script below adds data-js before first paint, so the
         services fold can size its track in CSS with no layout shift */
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
            the previous scroll position. Also marks html[data-js] so
            scroll-driven layout (the services fold) is sized in CSS
            before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(e){}document.documentElement.setAttribute('data-js','')",
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
