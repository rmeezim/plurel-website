"use client";

import { useMemo, useRef, useState } from "react";
import { Console, useSim } from "@/components/console/console";
import { Chip, Controls, Figure, Key } from "@/components/console/parts";
import { rng } from "@/lib/sim";

/*
  Reputation: the consensus. Thirty-two places a buyer checks before they
  trust you, from your own site to reviews, press, forums and lists, each
  saying the story, saying something else, or saying nothing. Week by
  week the work turns them: your own facts first, then reviews, then
  press, then the places that repeat what others say. AI answers, which
  buyers check last, agree only once enough of the rest does. Run it as
  press alone and the stories land, but the rest keeps saying something
  else, and the answers stay mixed: press works when it says what
  everything else already says. Illustrative model and timings.
*/

type State = "agree" | "differ" | "silent";
type Place = { kind: string; group: string; start: State; system: number | null; press: number | null; says: [string, string] };

const WEEKS = 26;
const RAW: [string, string, State, [number, number] | null, boolean, string, string][] = [
  // kind, group, start, flip window in the system, also in press alone, says before, says after
  ["Your site", "Yours", "differ", [1, 2], false, "Two products ago, and a price that changed", "What you do, for whom, at what price"],
  ["Your about page", "Yours", "differ", [1, 2], false, "A founding story that differs from the press", "The same story the press tells"],
  ["Founder profile", "Yours", "differ", [2, 3], false, "A job title and a pitch from last year", "The story, in the founder’s words"],
  ["Your help pages", "Yours", "silent", [2, 4], false, "Nothing on delivery times", "Delivery times, answered plainly"],
  ["Business directory", "Facts", "differ", [2, 4], false, "An old address and the wrong category", "The right category and facts"],
  ["Company database", "Facts", "differ", [3, 5], false, "Headcount and founding year wrong", "Corrected facts"],
  ["Map listing", "Facts", "silent", [3, 5], false, "Unclaimed", "Claimed, with hours and photos"],
  ["Encyclopedia entry", "Facts", "silent", [16, 22], false, "No entry", "A short entry citing the press"],
  ["Review site", "Reviews", "differ", [4, 9], false, "Complaints about slow replies, unanswered", "Recent reviews, every one answered"],
  ["Review site", "Reviews", "differ", [5, 10], false, "A low score from a handful of reviews", "A fair score from many more"],
  ["Marketplace reviews", "Reviews", "silent", [5, 11], false, "Too few reviews to show a rating", "A rating, from verified buyers"],
  ["Comparison site", "Reviews", "differ", [8, 13], false, "Compares an old version", "Compares what you sell now"],
  ["Review roundup", "Reviews", "silent", [10, 15], false, "Not included", "Included, with the reason to choose you"],
  ["Customer case", "Reviews", "silent", [6, 10], false, "None published", "Two published, with numbers they agreed to"],
  ["National press", "Press", "silent", [10, 16], true, "No coverage", "A story on what you found"],
  ["Trade press", "Press", "silent", [6, 9], true, "No coverage", "The original research, covered"],
  ["Trade press", "Press", "differ", [7, 12], true, "An old story about a recall", "A new story that answers it"],
  ["Local news", "Press", "silent", [9, 14], true, "No coverage", "A profile of the team"],
  ["Newsletter", "Press", "silent", [7, 11], true, "Not mentioned", "Linked as the example"],
  ["Podcast", "Press", "silent", [8, 13], true, "No episode", "An episode with the founder"],
  ["Forum thread", "Community", "differ", [11, 18], false, "“Avoid, they never reply”", "“They sorted it within a day”"],
  ["Forum thread", "Community", "silent", [12, 19], false, "Not mentioned", "Recommended in the replies"],
  ["Q&A answer", "Community", "differ", [13, 20], false, "Recommends a rival", "Names you next to the rival"],
  ["Social thread", "Community", "differ", [9, 16], false, "A complaint that went round", "The reply, and the fix"],
  ["Creator video", "Community", "silent", [8, 14], false, "No mention", "An honest review"],
  ["Creator video", "Community", "silent", [12, 18], false, "No mention", "Answers the honest review"],
  ["Analyst list", "Lists", "silent", [18, 24], false, "Not listed", "Listed, from the research"],
  ["Best-of list", "Lists", "silent", [14, 20], false, "Not listed", "Listed, from reviews and press"],
  ["Best-of list", "Lists", "differ", [16, 22], false, "Listed for the wrong use", "Listed for the right one"],
  ["Awards page", "Lists", "silent", [19, 25], false, "Not entered", "Shortlisted"],
  ["Trade directory", "Lists", "silent", [4, 8], false, "Not listed", "Listed, with the case studies"],
  ["Partner page", "Lists", "silent", [10, 15], false, "Not mentioned", "Named as a partner"],
];

const ANSWERS = [
  { q: "Is it any good?", at: 0.55, before: "Opinions are mixed: reviewers mention slow replies.", after: "Well reviewed, with replies within a day." },
  { q: "What is it best for?", at: 0.62, before: "It is unclear what it is best for.", after: "Best for the use its press and lists describe." },
  { q: "How does it compare?", at: 0.7, before: "Most sources recommend the rival.", after: "Named next to the rival, for a clear reason." },
  { q: "Can I trust it?", at: 0.78, before: "There is an old recall story.", after: "The recall story, and how it was answered." },
];

function places(): Place[] {
  const r = rng(30883);
  return RAW.map(([kind, group, start, win, inPress, a, b]) => {
    const flip = win ? win[0] + Math.round(r() * (win[1] - win[0])) : null;
    return { kind, group, start, system: flip, press: inPress ? flip : null, says: [a, b] };
  });
}

export function ConsensusConsole() {
  const frame = useRef<HTMLElement>(null);
  const all = useMemo(() => places(), []);
  const [mode, setMode] = useState<"system" | "press">("system");
  const sim = useSim(frame, { end: WEEKS, rate: 1.4, by: 1 });
  const [hot, setHot] = useState<number | null>(null);
  const w = Math.floor(sim.t);

  const state = (p: Place): State => {
    const flip = mode === "system" ? p.system : p.press;
    return flip != null && w >= flip ? "agree" : p.start;
  };
  const states = all.map(state);
  const agree = states.filter((s) => s === "agree").length;
  const differ = states.filter((s) => s === "differ").length;
  const silent = states.length - agree - differ;
  const ratio = agree + differ ? agree / (agree + differ) : 0;
  const answered = ANSWERS.filter((a) => ratio >= a.at).length;
  const hp = hot != null ? all[hot] : null;

  return (
    <Console
      sim={sim}
      frameRef={frame}
      title="The consensus"
      clock={`Week ${String(w).padStart(2, "0")} of ${WEEKS}`}
      label="A simulated half year of reputation work: thirty-two places buyers check, each saying the story, something else or nothing, turning week by week; AI answers agree only once enough of the rest does. Run as press alone, the answers stay mixed."
      stepLabel="Step one week"
      readout={`Week ${w}: ${agree} of ${all.length} places say the story, ${differ} say something else, ${silent} say nothing. ${answered} of ${ANSWERS.length} AI answers agree. ${
        mode === "press" && w >= 14 ? "The stories ran, but reviews, forums and your own facts still say something else." : ""
      }`}
      note="Illustrative model and timings, not a client’s results. Which places your buyers check, and what each says today, is read in the Diagnostic."
    >
      <Controls>
        <div role="group" aria-label="What runs" className="flex gap-1.5">
          <Chip on={mode === "system"} onClick={() => setMode("system")}>
            The whole system
          </Chip>
          <Chip on={mode === "press"} onClick={() => setMode("press")}>
            Press alone
          </Chip>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 sm:ml-auto">
          <Key swatch="paper">Says the story</Key>
          <Key swatch="signal">Says something else</Key>
          <Key swatch="hollow">Says nothing</Key>
        </div>
      </Controls>
      <div className="grid lg:grid-cols-12">
        <div className="border-b border-paper/12 p-3 sm:p-4 lg:col-span-8 lg:border-b-0 lg:border-r">
          <ol aria-label="The places buyers check" className="grid grid-cols-3 gap-[3px] sm:grid-cols-4 lg:grid-cols-8">
            {all.map((p, i) => {
              const s = states[i];
              return (
                <li key={i}>
                  <button
                    type="button"
                    onPointerEnter={() => setHot(i)}
                    onPointerLeave={() => setHot((h) => (h === i ? null : h))}
                    onFocus={() => setHot(i)}
                    onBlur={() => setHot((h) => (h === i ? null : h))}
                    aria-label={`${p.kind}: ${s === "agree" ? p.says[1] : p.says[0]}`}
                    className={`flex h-[56px] w-full flex-col justify-between border p-2 text-left sm:h-[64px] transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-paper lg:h-[72px] ${
                      s === "agree" ? "border-paper/30 bg-paper/[0.07]" : s === "differ" ? "border-signal/45 bg-signal/[0.06]" : "border-paper/10"
                    } ${hot === i ? "outline outline-1 outline-paper" : ""}`}
                  >
                    <span
                      aria-hidden
                      className={`size-[8px] transition-colors duration-500 ${s === "agree" ? "bg-paper" : s === "differ" ? "bg-signal" : "border border-paper/50"}`}
                    />
                    <span className={`truncate text-[13px] leading-none ${s === "silent" ? "text-fog" : "text-paper"}`}>{p.kind}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-3 min-h-[44px] text-[14px] leading-[1.4]">
            {hp ? (
              <p>
                <span className="text-fog">{hp.kind}, {hp.group.toLowerCase()}: </span>
                {states[hot!] === "agree" ? hp.says[1] : hp.says[0]}
                {states[hot!] !== "agree" && (mode === "system" ? hp.system : hp.press) != null && (
                  <span className="text-fog"> · turns in week {mode === "system" ? hp.system : hp.press}</span>
                )}
                {states[hot!] !== "agree" && mode === "press" && hp.press == null && <span className="text-fog"> · press alone doesn’t reach it</span>}
              </p>
            ) : (
              <p className="text-fog">Point at a place to read what it says now.</p>
            )}
          </div>
        </div>
        <div className="flex flex-col lg:col-span-4">
          <div className="border-b border-paper/12 px-3 py-4 sm:px-4">
            <Figure label="Of those that say anything, saying the story" value={`${Math.round(ratio * 100)}%`} tone={ratio >= 0.7 ? "signal" : "paper"} />
            <div aria-hidden className="mt-3 flex h-[6px] w-full">
              <span className="bg-paper transition-[width] duration-500" style={{ width: `${(agree / all.length) * 100}%` }} />
              <span className="bg-signal transition-[width] duration-500" style={{ width: `${(differ / all.length) * 100}%` }} />
              <span className="flex-1 border border-paper/20" />
            </div>
          </div>
          <div className="px-3 py-3 sm:px-4">
            <p className="text-[13px] text-fog">What AI answers say, last of all</p>
            <ol className="mt-2">
              {ANSWERS.map((a) => {
                const ok = ratio >= a.at;
                return (
                  <li key={a.q} className="border-b border-paper/10 py-2.5 last:border-b-0">
                    <p className="flex items-center justify-between gap-3 text-[13px]">
                      <span className="text-paper">“{a.q}”</span>
                      <span className={`font-mono ${ok ? "text-paper" : "text-signal"}`}>{ok ? "Agrees" : "Mixed"}</span>
                    </p>
                    <p className={`mt-1 text-[14px] leading-[1.4] transition-colors duration-500 ${ok ? "text-paper" : "text-fog"}`}>{ok ? a.after : a.before}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </Console>
  );
}
