/*
  Homepage content. One source for the chapters in src/components/home/
  and the FAQ structured data.
*/

/**
 * Client names for a future logo list inside Proof. Real clients only, and
 * only with their permission: until there are some, the list is empty and
 * ClientsStrip renders nothing.
 */
export const CLIENTS: string[] = [];

/*
  The four phases. Phase 01 is the Diagnostic itself, named so the
  closing can pay it off. The homepage shows each as a name, a tagline and
  what it delivers; the full method lives on /method. `ai` is one
  line in a fixed shape for "Where AI helps, and where a person decides":
  what the machine does, then what a person decides. No tool names until
  the real stack is confirmed.
*/
export const PHASES = [
  {
    number: "1",
    name: "Diagnose",
    tagline: "The Diagnostic: find where it breaks",
    outputs: ["Six-part scorecard", "Narrative & positioning read", "Search & AI baseline", "Priority roadmap"],
    ai: "Assistants are asked who they name. A strategist reads why.",
  },
  {
    number: "2",
    name: "Design",
    tagline: "Rebuild the story, then what carries it",
    outputs: ["Narrative & messaging", "Brand identity", "Website & landing pages", "Asset library"],
    ai: "Machines draft many directions. A creative director keeps one.",
  },
  {
    number: "3",
    name: "Deploy",
    tagline: "Launch where your buyers already are",
    outputs: ["Site build & QA", "Channel launch plan", "Tracking & attribution", "Launch PR"],
    ai: "Follow-up runs on its own. A person checks it before launch.",
  },
  {
    number: "4",
    name: "Compound",
    tagline: "Run the work, read the numbers",
    outputs: ["Content program", "Paid & search", "PR & reputation", "Quarterly reallocation"],
    ai: "Models flag where budget leaks. A person moves it each quarter.",
  },
];

/*
  The FAQ, in the order a buyer's doubts arrive: what this is, whether it
  can make them go viral, how much of it they need, what happens to the
  suppliers they have, cost, fit, and who does the work. The Diagnostic
  is answered by the closing chapter and the sample. The first sentence
  of each answer is the takeaway (set in full paper on the page).
*/
export const FAQS = [
  {
    q: "How is this different from a full-service agency?",
    a: "We sell the integration, not the menu. A full-service agency puts many services under one roof, and each still reports its own number. We run your marketing from one story, with one team and one report, across every relevant channel, and we answer for one number, agreed with you on day one.",
  },
  {
    q: "Can you make us go viral?",
    a: "No one can promise a viral moment, and anyone who does is selling luck. We build the conditions for one: a story worth repeating, cut for creators and short-form, with paid behind it. When something takes off, the system turns the spike into searches and into the number you run on.",
  },
  {
    q: "Do we need every channel?",
    a: "No, only the relevant ones, and the Diagnostic decides which. A software company may need AI answers and a founder’s voice; a consumer brand, creators and paid social; a product on shelves, reviews and marketplace pages; an app, its store listing and referral loops. We run creators and UGC inside Content Marketing and Paid Ads. Whatever the mix, it all works from the same brief.",
  },
  {
    q: "We already have an in-house team or agency. Where do you fit?",
    a: "Usually alongside them. We diagnose the whole setup, then either run parts of it end to end or direct your team and suppliers from one plan. Good people stay. What changes is that someone answers for the result.",
  },
  {
    q: "What does it cost?",
    a: "Focused sprints start in the low five figures. Partnerships are monthly, scoped to the work, never per channel. You are buying an external marketing department, so the work can move from web to film to search without a new contract.",
  },
  {
    q: "Do you work with companies like ours?",
    a: "Our best fit is growth-stage companies whose marketing has outgrown one person and split across suppliers. We work with consumer brands and physical products, and with B2B and consumer technology. The industry matters less than the symptom: everything works, and nothing works together.",
  },
  {
    q: "Who actually does the work?",
    a: "A senior Plurel team covering strategy, narrative, design, film, web and distribution. The people who run your Diagnostic are the people who run the work.",
  },
];
