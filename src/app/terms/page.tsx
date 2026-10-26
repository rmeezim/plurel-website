import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Terms of Service — Plurel",
  description:
    "The terms that govern use of the Plurel website, plainly stated.",
  path: "/terms/",
});

const SECTIONS = [
  {
    heading: "Agreement",
    body: [
      "These terms govern your use of this website, operated by Plurel. By using the site you accept them. Engagements are governed by their own written agreements; these terms cover the website itself.",
    ],
  },
  {
    heading: "Use of the site",
    body: [
      "You may browse, link to, and share this site freely. You may not misuse it: no attempting to breach security, scrape at abusive volume, misrepresent affiliation with Plurel, or use the site in any unlawful way.",
    ],
  },
  {
    heading: "Our content",
    body: [
      "The Plurel name, marks, methodology names (including MTD·04, SYS·09, and SIG·06), site design, and content are owned by Plurel. You're welcome to quote reasonably with attribution; wholesale reproduction or use of our marks requires written permission.",
    ],
  },
  {
    heading: "Informational only",
    body: [
      "Content on this site, including the method, the sample Diagnostic and the sample engagements, is provided for general information. It isn't professional advice for your specific situation. Samples are illustrative, labelled as samples, and describe no real client; no outcome on this site is promised.",
    ],
  },
  {
    heading: "No warranties",
    body: [
      "The site is provided as-is. We work to keep it accurate, available, and secure, but we can't warrant that it will always be error-free or uninterrupted.",
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "To the fullest extent permitted by law, Plurel isn't liable for indirect, incidental, or consequential damages arising from use of this website. Nothing in these terms limits liability that can't lawfully be limited.",
    ],
  },
  {
    heading: "Third-party links",
    body: [
      "Where the site links to third-party sites, those remain the responsibility of their owners. A link isn't an endorsement, and their terms apply on their sites.",
    ],
  },
  {
    heading: "Governing law and changes",
    body: [
      "These terms are governed by the laws of the State of New York, USA. We may update them from time to time; material changes update the date above. Questions: hello@plurel.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="October 2026"
      sections={SECTIONS}
    />
  );
}
