import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — Plurel",
  description:
    "How Plurel collects, uses, and protects the information you share with us — plainly stated.",
  alternates: { canonical: "/privacy/" },
};

const SECTIONS = [
  {
    heading: "What this covers",
    body: [
      "This policy explains what information Plurel (a Northeon division) collects through this website, how we use it, and the choices you have. We keep it short on purpose — and we hold ourselves to what it says.",
    ],
  },
  {
    heading: "Information you give us",
    body: [
      "When you contact us, book a strategy call, or request a growth audit, we collect what you provide: your name, email address, company, and anything you include in your message. We use it to respond, to prepare for conversations you've asked for, and to run any engagement that follows.",
      "We never sell this information, and we don't add you to a mailing list you didn't ask for.",
    ],
  },
  {
    heading: "Information collected automatically",
    body: [
      "Like most websites, we use privacy-conscious analytics to understand how the site is used — pages visited, approximate region, device type, and how visitors arrive. We use this to improve the site, not to profile you.",
      "Analytics cookies or identifiers may be set for this purpose. You can block them in your browser without breaking the site.",
    ],
  },
  {
    heading: "How we use information",
    body: [
      "To respond to inquiries and deliver services you request; to operate, secure, and improve this website; to understand which content is useful; and to meet legal obligations. That's the list.",
    ],
  },
  {
    heading: "Who we share it with",
    body: [
      "Service providers who help us run the website and our operations — hosting, analytics, email, and scheduling tools — bound to use your information only on our behalf. We may also share information if the law requires it, or as part of a corporate transaction involving Northeon.",
    ],
  },
  {
    heading: "Retention",
    body: [
      "We keep inquiry information for as long as we're in an active conversation or engagement with you, plus a reasonable period after — then we delete it. Analytics data is retained in aggregate.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can ask us what we hold about you, ask us to correct it, or ask us to delete it — email hello@plurel.com and we'll act on it promptly. Depending on where you live, you may have additional rights under laws such as the GDPR or CCPA, and we honor them.",
    ],
  },
  {
    heading: "Changes and contact",
    body: [
      "If this policy changes materially, we'll update the date above. Questions, requests, or concerns: hello@plurel.com — a person reads it.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      kicker="Legal — privacy"
      title="Privacy Policy"
      updated="July 2026"
      sections={SECTIONS}
    />
  );
}
