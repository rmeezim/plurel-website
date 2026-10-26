import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy — Plurel",
  description:
    "How Plurel collects, uses and protects the information you share with us, plainly stated.",
  path: "/privacy/",
});

const SECTIONS = [
  {
    heading: "What this covers",
    body: [
      "This policy explains what information Plurel collects through this website, how we use it, and the choices you have. We keep it short on purpose, and we hold ourselves to what it says.",
    ],
  },
  {
    heading: "Information you give us",
    body: [
      "The forms on this site, including the Diagnostic request, store nothing: they open your email app with what you typed, addressed to us. When you send it, or write to us directly, we receive what you include: your name, email address, company, and your message. We use it to respond, to prepare the read or the conversation you asked for, and to run any engagement that follows.",
      "We never sell this information, and we don't add you to a mailing list you didn't ask for.",
    ],
  },
  {
    heading: "Information collected automatically",
    body: [
      "Like most websites, we use privacy-conscious analytics to understand how the site is used: pages visited, approximate region, device type, and how visitors arrive. We use this to improve the site, not to profile you.",
      "Analytics cookies or identifiers may be set for this purpose. You can block them in your browser without breaking the site.",
    ],
  },
  {
    heading: "How we use information",
    body: [
      "To answer your messages and deliver services you request; to operate, secure, and improve this website; to understand which content is useful; and to meet legal obligations. That's the list.",
    ],
  },
  {
    heading: "Who we share it with",
    body: [
      "Service providers who help us run the website and our operations, such as hosting, analytics and email, bound to use your information only on our behalf. We may also share information if the law requires it, or as part of a corporate transaction involving Plurel.",
    ],
  },
  {
    heading: "Retention",
    body: [
      "We keep what you send us for as long as we're in an active conversation or engagement with you, plus a reasonable period after, and then we delete it. Analytics data is retained in aggregate.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can ask us what we hold about you, ask us to correct it, or ask us to delete it: email hello@plurel.com and we'll act on it promptly. Depending on where you live, you may have additional rights under laws such as the GDPR or CCPA, and we honor them.",
    ],
  },
  {
    heading: "Changes and contact",
    body: [
      "If this policy changes materially, we'll update the date above. Questions, requests or concerns go to hello@plurel.com, where a person reads them.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 2026"
      sections={SECTIONS}
    />
  );
}
