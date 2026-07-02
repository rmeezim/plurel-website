import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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
  metadataBase: new URL("https://plurel.com"),
  openGraph: {
    title: "Plurel — We build the visible layer of growth",
    description:
      "Premium digital brand experiences: web design, brand identity, AEO/SEO, content, paid media, and PR.",
    type: "website",
  },
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
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
