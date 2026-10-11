/*
  The People section (components/home/people-chapter.tsx): who a client
  works with. It renders nothing while this list is empty.

  Add only real people, with their consent: the strategist who reads the
  Diagnostic first, then the team. `name` is shown by first name only (the
  full name stays in alt text); `photo` is a path under public/ (a real
  portrait, never generated), shown at 4:5; `line` is one plain sentence in
  their own words or about what they do on an engagement.
*/

export type Person = {
  name: string;
  role: string;
  line: string;
  /** e.g. "/people/firstname.jpg" (public/), a real portrait at 4:5 or taller */
  photo?: string;
  email?: string;
};

export const PEOPLE: readonly Person[] = [];
