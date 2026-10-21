"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ARTBOARD, REPORT_MONTH, REPORTS, type Report, type ReportKey, type Spot } from "@/lib/reports";
import s from "./supplier-reports.module.css";

/*
  The manifesto's table: ten supplier reports on the red desk (data in
  lib/reports.ts, drawing in supplier-reports.module.css).

  Each report is a small document in the house style its sender would
  use, drawn at a fixed size in design pixels and placed by hand on an
  artboard that scales to the container. The pile is a list of ten
  buttons: each is named by its supplier, title and number, and
  described by the question Plurel writes in its margin.

  Hover (mouse and pen), focus or a tap picks a report up: it
  straightens, rises to the top of the pile, and a red pen circles its
  number and writes the question beside it. A tap, a click, Enter or
  Space holds it; Escape, a press anywhere else, or focus leaving the
  pile puts it back. One report is up at a time.

  The finished table is server-rendered. With motion allowed, a table
  that starts below the fold is dealt onto the desk once as it scrolls
  in, bottom card first, fanning out from the table's near edge. Until this component is live (no JS, or before
  hydration) CSS alone lifts a report on hover and focus. Reduced motion
  gets the same table and the same notes, without movement.
*/

/** A hand-drawn loop, overshooting where it closes (stretched to the number it circles) */
const LOOP =
  "M15 8.5C33 2 75 1.5 90 9C99.5 14 100 27 87.5 33.5C69 41.5 27 41 10.5 33.5C0.5 28.5 1 14.5 12.5 9.5C21 5.5 35 3.5 47 3.2";

function Pen({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`${s.pen} ${className}`}>
      {children}
      <svg className={s.loop} viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d={LOOP} />
      </svg>
    </span>
  );
}

function Note({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`${s.note} ${className}`}>{children}</span>;
}

/** A dashboard's delta triangle */
function Tri({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 8 8" className={`${s.tri} ${className}`}>
      <path d="M4 1.2 7.4 6.8H0.6Z" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 10 10" className={s.check}>
      <path d="M1.8 5.4 4 7.5 8.4 2.6" />
    </svg>
  );
}

/* ---------- small drawings ---------- */

/** Points for a polyline across w x h, values scaled between lo and hi */
function line(values: readonly number[], w: number, h: number, lo: number, hi: number, pad = 2) {
  const step = w / (values.length - 1);
  return values
    .map((v, i) => `${(i * step).toFixed(1)},${(pad + (1 - (v - lo) / (hi - lo)) * (h - pad * 2)).toFixed(1)}`)
    .join(" ");
}

/* Daily clicks in September, as a share of the best day: a good month for the ads agency */
const ADS_DAYS = [
  0.62, 0.68, 0.71, 0.66, 0.55, 0.5, 0.74, 0.77, 0.8, 0.75, 0.69, 0.57, 0.53, 0.8, 0.84, 0.87, 0.83,
  0.73, 0.62, 0.58, 0.86, 0.9, 0.93, 0.89, 0.8, 0.66, 0.63, 0.95, 0.98, 1,
];

/* Daily sessions (thousands), September and August */
const SESSIONS = [
  2.6, 3.0, 3.1, 2.9, 2.8, 2.1, 1.9, 2.7, 3.1, 3.2, 3.0, 2.9, 2.2, 2.0, 2.9, 3.3, 3.4, 3.1, 3.0, 2.3,
  2.1, 3.0, 3.4, 3.5, 3.3, 3.1, 2.4, 2.2, 3.1, 3.6,
];
const SESSIONS_PREV = [
  2.4, 2.7, 2.8, 2.7, 2.5, 1.9, 1.8, 2.5, 2.8, 2.9, 2.8, 2.6, 2.0, 1.9, 2.6, 2.9, 3.0, 2.8, 2.7, 2.1,
  1.9, 2.7, 3.0, 3.1, 2.9, 2.8, 2.2, 2.0, 2.7, 3.0,
];

/* Daily views (thousands): one video took off on the 8th */
const VIEWS = [
  31, 33, 32, 34, 36, 35, 38, 66, 71, 58, 49, 45, 44, 46, 45, 47, 49, 48, 50, 51, 50, 52, 54, 53, 55,
  56, 55, 57, 58, 60,
];

/* Followers gained per week */
const WEEKS = [0.46, 0.58, 0.52, 0.71, 1];

/* ---------- the ten reports ---------- */

function Ads({ note }: { note: string }) {
  return (
    <>
      <span className={s.adsBar}>
        <span className={s.adsTitle}>Paid media performance</span>
        <span className={s.adsRange}>1–30 Sep</span>
      </span>
      <span className={s.adsSub}>Ads agency · All campaigns</span>
      <span className={s.adsBody}>
        <span className={s.adsHero}>
          <span className={s.adsLabel}>Click-through rate</span>
          <span className={s.adsNumRow}>
            <Pen className={s.adsNum}>2.1%</Pen>
            <span className={s.adsDelta}>
              <Tri />
              0.3 pts
            </span>
          </span>
        </span>
        <span className={s.adsKpis}>
          <span className={s.adsKpi}>
            Impressions<b>1.21M</b>
          </span>
          <span className={s.adsKpi}>
            Clicks<b>25.4K</b>
          </span>
          <span className={s.adsKpi}>
            Cost per click<b>£0.84</b>
          </span>
        </span>
      </span>
      <svg className={s.adsChart} viewBox="0 0 286 40">
        <line x1="0" y1="39.5" x2="286" y2="39.5" />
        {ADS_DAYS.map((v, i) => (
          <rect key={i} x={i * 9.6 + 1} y={40 - v * 38} width="6" height={v * 38} />
        ))}
      </svg>
      <span className={s.adsAxis}>
        <span>Clicks per day</span>
        <span>Best month on record</span>
      </span>
      <Note className={s.adsNote}>{note}</Note>
    </>
  );
}

function Seo({ note }: { note: string }) {
  return (
    <>
      <span className={s.seoTop}>
        <span>SEO agency</span>
        <span>1 / 22</span>
      </span>
      <span className={s.seoTitle}>
        <span>Monthly</span> <span>SEO report</span>
      </span>
      <span className={s.seoMonth}>{REPORT_MONTH}</span>
      <span className={s.seoLabel}>Organic traffic</span>
      <span className={s.seoNumRow}>
        <Pen className={s.seoNum}>+12%</Pen>
        <span className={s.seoUp}>↑</span>
      </span>
      <span className={s.seoDetail}>41 keywords in the top three, up 6 on August.</span>
      <span className={s.seoFoot}>
        <span>Prepared for Halden</span>
        <span>Confidential</span>
      </span>
      <Note className={s.seoNote}>{note}</Note>
    </>
  );
}

const SWATCHES = ["#1f2b2f", "#5f7a72", "#c7b48f", "#e6dccb", "#ffffff"];

function Brand({ note }: { note: string }) {
  return (
    <>
      <span className={s.brandHead}>Brand audit</span>
      <span className={s.brandSub}>Brand studio · {REPORT_MONTH}</span>
      <span className={s.brandNumRow}>
        <Pen className={s.brandNum}>94%</Pen>
        <span className={s.brandUp}>↑</span>
      </span>
      <span className={s.brandLabel}>of assets on-brand</span>
      <span className={s.brandSwatches}>
        {SWATCHES.map((c) => (
          <i key={c} style={{ "--c": c } as CSSProperties} />
        ))}
      </span>
      <span className={s.brandList}>
        {["Logo use", "Colour", "Typography", "Tone of voice"].map((t) => (
          <span key={t} className={s.brandRow}>
            {t}
            <Check />
          </span>
        ))}
      </span>
      <span className={s.brandFoot}>212 of 226 assets reviewed</span>
      <Note className={s.brandNote}>{note}</Note>
    </>
  );
}

function Social({ note }: { note: string }) {
  return (
    <>
      <span className={s.socialTop}>
        <span className={s.socialTitle}>Social snapshot</span>
        <span className={s.socialChip}>{REPORT_MONTH}</span>
      </span>
      <span className={s.socialSub}>Social team · All channels</span>
      <span className={s.socialLabel}>Followers</span>
      <span className={s.socialNumRow}>
        <span className={s.socialNumWrap}>
          <Pen className={s.socialNum}>+8%</Pen>
          <span className={s.socialUp}>↑</span>
        </span>
        <span className={s.socialBars}>
          {WEEKS.map((v, i) => (
            <i key={i} style={{ "--v": v } as CSSProperties} />
          ))}
        </span>
      </span>
      <span className={s.socialStats}>
        <span>
          <b>4.6%</b> engagement
        </span>
        <span>
          <b>31</b> posts
        </span>
        <span>
          <b>12.8K</b> followers
        </span>
      </span>
      <Note className={s.socialNote}>{note}</Note>
    </>
  );
}

/** A press clipping, drawn small: headline, a picture on some, columns of text */
function Clip({ pic, k }: { pic: boolean; k: number }) {
  const w = [44, 50, 38, 47, 42, 49][k];
  return (
    <svg className={s.clip} viewBox="0 0 64 48">
      <rect className={s.clipHead} x="5" y="5" width={w} height="3.2" />
      <rect className={s.clipHead} x="5" y="10.5" width={w * 0.62} height="3.2" />
      {pic && <rect className={s.clipPic} x="5" y="17.5" width="24" height="17" />}
      {[18, 22, 26, 30, 34, 38, 42].map((y) => (
        <g key={y}>
          {(!pic || y > 35) && <rect className={s.clipText} x="5" y={y} width="25" height="1.4" />}
          <rect className={s.clipText} x="33" y={y} width="26" height="1.4" />
        </g>
      ))}
    </svg>
  );
}

function Pr({ note }: { note: string }) {
  return (
    <>
      <span className={s.prHead}>Coverage report</span>
      <span className={s.prSub}>PR firm · {REPORT_MONTH}</span>
      <span className={s.prRule} />
      <span className={s.prNumRow}>
        <Pen className={s.prNum}>38</Pen>
        <span className={s.prUnit}>mentions ↑</span>
      </span>
      <span className={s.prReach}>Estimated readership 6.1M</span>
      <span className={s.prClips}>
        {[true, false, false, true, false, true].map((pic, k) => (
          <Clip key={k} pic={pic} k={k} />
        ))}
      </span>
      <span className={s.prMix}>
        <span>National 4</span>
        <span>Trade 21</span>
        <span>Online 13</span>
      </span>
      <span className={s.prFoot}>
        <span>Halden</span>
        <span>Page 1</span>
      </span>
      <Note className={s.prNote}>{note}</Note>
    </>
  );
}

function Site({ note }: { note: string }) {
  /* the ring: 96 of 100, from twelve o'clock */
  const c = 2 * Math.PI * 40;
  return (
    <>
      <span className={s.siteTop}>
        <span>Site health</span>
        <span>Sep</span>
      </span>
      <span className={s.siteSub}>Web team · Mobile</span>
      <Pen className={s.siteGauge}>
        <svg className={s.siteRing} viewBox="0 0 92 92">
          <circle cx="46" cy="46" r="40" className={s.siteTrack} />
          <circle
            cx="46"
            cy="46"
            r="40"
            className={s.siteArc}
            strokeDasharray={`${(c * 0.96).toFixed(1)} ${c.toFixed(1)}`}
            transform="rotate(-90 46 46)"
          />
        </svg>
        <span className={s.siteNum}>96</span>
      </Pen>
      <span className={s.siteLabel}>
        Performance
        <span className={s.siteUp}>↑ from 89</span>
      </span>
      <span className={s.siteRows}>
        {[
          ["LCP", "1.4 s"],
          ["CLS", "0.02"],
          ["TBT", "40 ms"],
        ].map(([k, v]) => (
          <span key={k} className={s.siteRow}>
            <span>
              <i />
              {k}
            </span>
            <b>{v}</b>
          </span>
        ))}
      </span>
      <Note className={s.siteNote}>{note}</Note>
    </>
  );
}

function Creator({ note }: { note: string }) {
  return (
    <>
      <span className={s.crTitle}>campaign recap</span>
      <span className={s.crNumRow}>
        <Pen className={s.crNum}>
          <span className={s.crHi} />
          2.4M
        </Pen>
        <span className={s.crUp}>↑</span>
      </span>
      <span className={s.crLabel}>total reach</span>
      <span className={s.crMeta}>12 creators · 41 posts · 3 platforms</span>
      <span className={s.crFoot}>
        <span>Creator agency · {REPORT_MONTH}</span>
        <span>4 / 18</span>
      </span>
      <Note className={s.crNote}>{note}</Note>
    </>
  );
}

const ARTICLES: readonly [string, string][] = [
  ["Are heat pumps noisy?", "1,450"],
  ["Heat pump grants, explained", "1,210"],
  ["Air or ground source?", "1,820"],
  ["How long do heat pumps last?", "1,330"],
  ["Heat pumps for terraced houses", "1,640"],
];

function Content({ note }: { note: string }) {
  return (
    <>
      <span className={s.shBar}>
        <span className={s.shTitle}>Content tracker · {REPORT_MONTH}</span>
        <span className={s.shRole}>Writers · edited 30 Sep</span>
      </span>
      <span className={s.shBody}>
        <span className={s.shSum}>
          <span className={s.shSumLabel}>Published</span>
          <span className={s.shSumRow}>
            <Pen className={s.shSumNum}>24</Pen>
            <span className={s.shUp}>↑</span>
          </span>
          <span className={s.shSumSub}>articles, target 20</span>
        </span>
        <span className={s.shGrid}>
          <span className={s.shCorner} />
          {["A", "B", "C"].map((c) => (
            <span key={c} className={s.shCol}>
              {c}
            </span>
          ))}
          <span className={s.shRowNum}>1</span>
          <span className={s.shHead}>Title</span>
          <span className={s.shHead}>Status</span>
          <span className={`${s.shHead} ${s.shNum}`}>Words</span>
          {ARTICLES.map(([t, w], i) => (
            <Fragment key={t}>
              <span className={s.shRowNum}>{i + 2}</span>
              <span>{t}</span>
              <span>
                <span className={s.shChip}>Published</span>
              </span>
              <span className={s.shNum}>{w}</span>
            </Fragment>
          ))}
        </span>
      </span>
      <span className={s.shTabs}>
        <span className={s.shTab} data-on="">
          Sep
        </span>
        <span className={s.shTab}>Aug</span>
        <span className={s.shTab}>Jul</span>
      </span>
      <Note className={s.shNote}>{note}</Note>
    </>
  );
}

function Video({ note }: { note: string }) {
  const pts = line(VIEWS, 252, 40, 25, 75);
  return (
    <>
      <span className={s.vdTop}>
        <span className={s.vdTitle}>Channel analytics</span>
        <span className={s.vdRange}>1–30 Sep</span>
      </span>
      <span className={s.vdSub}>Video studio</span>
      <span className={s.vdTabs}>
        <span className={s.vdTab} data-on="">
          Overview
        </span>
        <span className={s.vdTab}>Content</span>
        <span className={s.vdTab}>Audience</span>
      </span>
      <span className={s.vdLabel}>Views</span>
      <span className={s.vdNumRow}>
        <Pen className={s.vdNum}>1.4M</Pen>
        <span className={s.vdUp}>
          <Tri />
          32%
        </span>
      </span>
      <svg className={s.vdChart} viewBox="0 0 252 40">
        <polygon className={s.vdArea} points={`0,40 ${pts} 252,40`} />
        <polyline className={s.vdLine} points={pts} />
      </svg>
      <span className={s.vdStats}>
        <span>
          Watch time <b>38.2K h</b>
        </span>
        <span>
          Avg. view <b>1:38</b>
        </span>
      </span>
      <Note className={s.vdNote}>{note}</Note>
    </>
  );
}

function Analytics({ note }: { note: string }) {
  const now = line(SESSIONS, 200, 64, 1.5, 3.8);
  const prev = line(SESSIONS_PREV, 200, 64, 1.5, 3.8);
  return (
    <>
      <span className={s.anTitle}>Monthly analytics report</span>
      <span className={s.anSub}>Analytics partner · {REPORT_MONTH}</span>
      <span className={s.anRule} />
      <span className={s.anLabel}>Sessions</span>
      <span className={s.anNumRow}>
        <Pen className={s.anNum}>84K</Pen>
      </span>
      <span className={s.anUp}>
        <Tri />
        9% on August
      </span>
      <span className={s.anChart}>
        <span className={s.anYAxis}>
          <span>3K</span>
          <span>2K</span>
        </span>
        <svg viewBox="0 0 200 64">
          {[12, 32, 52].map((y) => (
            <line key={y} className={s.anGrid} x1="0" x2="200" y1={y} y2={y} />
          ))}
          <polyline className={s.anPrev} points={prev} />
          <polyline className={s.anNow} points={now} />
        </svg>
      </span>
      <span className={s.anAxis}>
        <span>1 Sep</span>
        <span>15 Sep</span>
        <span>30 Sep</span>
      </span>
      <span className={s.anTable}>
        {[
          ["Channel", "Sessions"],
          ["Organic search", "31.2K"],
          ["Paid social", "22.4K"],
          ["Direct", "14.1K"],
          ["Other", "16.3K"],
        ].map(([k, v]) => (
          <span key={k} className={s.anRow}>
            <span>{k}</span>
            <span>{v}</span>
          </span>
        ))}
      </span>
      <span className={s.anFoot}>Page 2 of 9</span>
      <Note className={s.anNote}>{note}</Note>
    </>
  );
}

const DOCS: Record<ReportKey, (p: { note: string }) => ReactNode> = {
  ads: Ads,
  seo: Seo,
  brand: Brand,
  social: Social,
  pr: Pr,
  site: Site,
  creator: Creator,
  content: Content,
  video: Video,
  analytics: Analytics,
};

const DOC_CLASS: Record<ReportKey, string> = {
  ads: s.ads,
  seo: s.seo,
  brand: s.brand,
  social: s.social,
  pr: s.pr,
  site: s.site,
  creator: s.creator,
  content: s.sheet,
  video: s.video,
  analytics: s.analytics,
};

/* Deal order per artboard: bottom of the pile first */
function dealOrder(at: "phone" | "sm" | "lg") {
  const shown = REPORTS.filter((r) => r[at]);
  const order = [...shown].sort((a, b) => a[at]!.z - b[at]!.z || a[at]!.x - b[at]!.x);
  return new Map(order.map((r, i) => [r.key, i]));
}
const DEAL = { phone: dealOrder("phone"), sm: dealOrder("sm"), lg: dealOrder("lg") };

/*
  Dealt from the near edge of the table: each report starts a little way
  back along the line from the bottom centre of its artboard to where it
  lands, turned a few degrees further, so the pile fans out from one hand.
*/
function dealFrom(r: Report, s: Spot, art: { w: number; h: number }) {
  const cx = s.x + r.w / 2;
  const cy = s.y + r.h / 2;
  return {
    x: `${Math.round((art.w / 2 - cx) * 0.14)}px`,
    y: `${Math.round((art.h + 240 - cy) * 0.14)}px`,
    r: `${(s.r < 0 ? -1 : 1) * 6}deg`,
  };
}

/** Position, size and deal-in variables for one report, per artboard */
function slotStyle(r: Report): CSSProperties {
  const v: Record<string, string | number> = { "--w": r.w, "--h": r.h };
  const spots: [string, Spot | undefined, { w: number; h: number }, Map<ReportKey, number>][] = [
    ["0", r.phone, ARTBOARD.phone, DEAL.phone],
    ["1", r.sm, ARTBOARD.sm, DEAL.sm],
    ["2", r.lg, ARTBOARD.lg, DEAL.lg],
  ];
  for (const [k, s, art, order] of spots) {
    if (!s) continue;
    const from = dealFrom(r, s, art);
    v[`--i${k}`] = order.get(r.key) ?? 0;
    v[`--x${k}`] = `${s.x}px`;
    v[`--y${k}`] = `${s.y}px`;
    v[`--r${k}`] = `${s.r}deg`;
    v[`--z${k}`] = s.z;
    v[`--fx${k}`] = from.x;
    v[`--fy${k}`] = from.y;
    v[`--fr${k}`] = from.r;
  }
  /* on a phone a lifted report grows toward the middle of the screen */
  if (r.phone) v["--o0"] = r.phone.x + r.w / 2 < ARTBOARD.phone.w / 2 ? "0% 40%" : "100% 40%";
  return v as CSSProperties;
}

/* Built once: the reports never change, so picking one up re-renders only
   the slots, never the paper */
const STYLE = new Map(REPORTS.map((r) => [r.key, slotStyle(r)]));
const PAPER = new Map(
  REPORTS.map((r) => {
    const Doc = DOCS[r.key];
    return [
      r.key,
      <span key={r.key} aria-hidden className={`${s.doc} ${DOC_CLASS[r.key]}`}>
        <Doc note={r.note} />
      </span>,
    ];
  }),
);

export function SupplierReports({
  labelledBy,
  className = "",
}: {
  labelledBy?: string;
  className?: string;
}) {
  /* the report that is up, and whether a tap or click is holding it */
  const [up, setUp] = useState<{ i: number; held: boolean } | null>(null);
  const board = useRef<HTMLDivElement>(null);

  // Go live, and deal the pile in once if it starts below the fold
  useEffect(() => {
    const el = board.current;
    if (!el) return;
    el.setAttribute("data-live", "");
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.setAttribute("data-deal", "armed");
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        el.setAttribute("data-deal", "in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // While a report is up: Escape, or a press anywhere but a report, puts it back
  const isUp = up !== null;
  useEffect(() => {
    if (!isUp) return;
    const drop = () => setUp(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") drop();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target;
      if (t instanceof Element && t.closest("[data-report]") && board.current?.contains(t)) return;
      drop();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [isUp]);

  return (
    <div ref={board} className={`${s.board} ${className}`}>
      <ul className={s.art} aria-labelledby={labelledBy}>
        {REPORTS.map((r, i) => {
          const on = up?.i === i;
          return (
            <li
              key={r.key}
              data-report={r.key}
              data-phone={r.phone ? "" : undefined}
              data-on={on ? "" : undefined}
              className={s.slot}
              style={STYLE.get(r.key)}
              onPointerEnter={(e) => {
                if (e.pointerType === "touch") return;
                setUp((u) => (u?.i === i ? u : { i, held: false }));
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === "touch") return;
                setUp((u) => (u?.i === i && !u.held ? null : u));
              }}
            >
              <span className={s.deal}>
                <button
                  type="button"
                  className={s.lift}
                  aria-label={`${r.role}, ${r.title}, ${REPORT_MONTH}: ${r.metric}`}
                  aria-describedby={`report-note-${r.key}`}
                  aria-pressed={up?.i === i && up.held}
                  onFocus={() => setUp((u) => (u?.i === i ? u : { i, held: false }))}
                  onBlur={(e) => {
                    // a held report stays up while focus moves within the pile
                    const within = e.relatedTarget instanceof Node && board.current?.contains(e.relatedTarget);
                    setUp((u) => (u?.i === i && (!u.held || !within) ? null : u));
                  }}
                  onClick={() => setUp((u) => (u?.i === i && u.held ? null : { i, held: true }))}
                >
                  {PAPER.get(r.key)}
                  <span id={`report-note-${r.key}`} className="sr-only">
                    Margin note: {r.note}
                  </span>
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
