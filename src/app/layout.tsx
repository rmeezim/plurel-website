import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plurel — We build the visible layer of growth",
  description:
    "Plurel turns outdated business presence into premium digital brand experiences. Website design, AEO/SEO, brand identity, content marketing, paid ads, PR & reputation, and creative direction.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Plurel — We build the visible layer of growth",
    description:
      "One team accountable for how you're found, trusted, chosen, and remembered — brand, web, AI search, content, campaigns, and the martech underneath.",
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
    title: "Plurel — We build the visible layer of growth",
    description:
      "One team accountable for how you're found, trusted, chosen, and remembered.",
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
        "Plurel is Northeon's creative and growth division — brand identity, website design, AI search visibility (AEO/SEO), content, paid media, PR, and martech, built as one compounding growth system.",
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
      className={`${inter.variable} ${fraunces.variable} antialiased`}
    >
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
