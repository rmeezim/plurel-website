"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import {
  CLOCKWISE,
  FOLD_QUERY,
  clamp,
  frameAt,
  markRects,
  planRects,
  roomRects,
  type Band,
  type Frame,
  type Layout,
  type Rect,
} from "@/lib/fold";
import { MARK_CELLS } from "@/lib/mark";

/*
  The services fold: the manifesto's red room folds into the Plurel mark
  as the visitor scrolls. The markup and copy are server-rendered by
  ServicesChapter; this component owns the behavior only.

  Sticky breaks silently if main, #main, body or this section ever gets
  overflow:hidden/clip or a transform. Do not wrap anything inside the
  stage in Reveal.

  How it runs
  - CSS sizes the track and pins the stage before first paint (the gate in
    globals.css, keyed off html[data-js] and FOLD_QUERY), so there is no
    layout shift. Until this arms, the pinned stage shows the finished
    composition.
  - Arming measures everything once (stage, the ChapterHead ticks that are
    the GRID columns, the resting mark), then the hot path reads only
    scrollY and writes cached transform/opacity strings.
  - It moves only with the visitor's own scroll. Reduced motion, forced
    colors, short or narrow windows, and a failed fit check all leave the
    static chapter in place.
*/

const px = (v: number) => v.toFixed(2);
const sc = (v: number) => v.toFixed(4);
const op = (v: number) => v.toFixed(3);

type Prop = "transform" | "opacity" | "width" | "height";

export function ServicesFold({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = ref.current;
    const section = track?.closest<HTMLElement>(".fold");
    if (!track || !section) return;

    const one = (sel: string) => track.querySelector<HTMLElement>(sel);
    const all = (sel: string) => Array.from(track.querySelectorAll<HTMLElement>(sel));

    const stage = one("[data-fold-stage]");
    const content = one("[data-fold-content]");
    const backdrop = one("[data-fold-backdrop]");
    const room = one("[data-fold-room]");
    const center = one("[data-fold-center]");
    const head = one("[data-fold-head]");
    const h2 = one("[data-fold-h2]");
    const art = one("[data-fold-art]");
    const caption = one("[data-fold-caption]");
    const foot = one("[data-fold-foot]");
    const markCenter = one("[data-fold-mark-center]");
    const cells = all("[data-fold-cell]");
    const labels = all("[data-fold-label]");
    const names = all("[data-fold-name]");
    const markLabels = all("[data-fold-mark-label]");
    if (
      !stage || !content || !backdrop || !room || !center || !head || !h2 ||
      !art || !caption || !foot || !markCenter ||
      cells.length !== 9 || labels.length !== 8 || markLabels.length !== 8
    ) {
      return;
    }

    const mq = window.matchMedia(FOLD_QUERY);
    const driven = [backdrop, room, center, head, h2, art, caption, foot, ...cells, ...labels, ...names];

    let L: Layout | null = null;
    let top = 0;
    let travel = 1;
    let lastP = -1;
    let armed = false;
    let listening = false;
    let restOn = false;
    let raf = 0;
    let measureRaf = 0;

    // Every write goes through a cache of the last value per node and
    // property, so unchanged values never touch the DOM.
    const written = new Map<HTMLElement, Partial<Record<Prop, string>>>();
    const put = (el: HTMLElement, prop: Prop, v: string) => {
      let rec = written.get(el);
      if (!rec) {
        rec = {};
        written.set(el, rec);
      }
      if (rec[prop] === v) return;
      rec[prop] = v;
      el.style[prop] = v;
    };
    const clearInline = () => {
      for (const el of driven) {
        el.style.transform = "";
        el.style.opacity = "";
      }
      for (const el of cells) {
        el.style.width = "";
        el.style.height = "";
      }
      center.style.width = "";
      written.clear();
    };

    /** All layout reads happen here, never on scroll */
    const measure = (): boolean => {
      const sr = stage.getBoundingClientRect();
      const rel = (el: Element): Rect => {
        const r = el.getBoundingClientRect();
        return { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height };
      };

      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const Hs = content.clientHeight;
      top = track.getBoundingClientRect().top + window.scrollY;
      travel = Math.max(1, track.offsetHeight - H);
      const dpr = window.devicePixelRatio || 1;
      const pad = parseFloat(getComputedStyle(section).getPropertyValue("--fold-pad")) || 8;

      // The visible ChapterHead ticks are the GRID columns
      const cols = Array.from(head.querySelectorAll<HTMLElement>("[data-ticks] > span"))
        .filter((t) => t.getClientRects().length > 0)
        .map(rel);
      if (cols.length < 4) return false;
      const left = (c: Rect) => c.x;
      const right = (c: Rect) => c.x + c.w;
      const g = cols[1].x - right(cols[0]);

      let xs: Band[];
      if (cols.length >= 12) {
        xs = [
          [left(cols[0]), right(cols[2])],
          [left(cols[3]), right(cols[8])],
          [left(cols[9]), right(cols[11])],
        ];
      } else if (cols.length >= 6) {
        const x0 = left(cols[0]);
        const u = (right(cols[5]) - x0 - 2 * g) / 8;
        xs = [
          [x0, x0 + 2 * u],
          [x0 + 2 * u + g, x0 + 6 * u + g],
          [x0 + 6 * u + 2 * g, x0 + 8 * u + 2 * g],
        ];
      } else {
        xs = [
          [left(cols[0]), right(cols[0])],
          [left(cols[1]), right(cols[2])],
          [left(cols[3]), right(cols[3])],
        ];
      }

      const yTop = rel(head).y;
      const yBot = rel(foot).y - 16;
      const v = (yBot - yTop - 2 * g) / 8;
      const ys: Band[] = [
        [yTop, yTop + 2 * v],
        [yTop + 2 * v + g, yTop + 6 * v + g],
        [yTop + 6 * v + 2 * g, yBot],
      ];

      const artRect = rel(art);
      const R0 = roomRects(W, Hs, H, MARK_CELLS);
      const R1 = planRects(xs, ys, MARK_CELLS);
      const R2 = markRects(artRect, MARK_CELLS);
      const off = CLOCKWISE.map((c, k) => {
        const r = rel(markLabels[k]);
        return { x: r.x - R2[c].x, y: r.y - R2[c].y };
      });
      const rc = rel(markCenter);

      center.style.width = `${markCenter.offsetWidth}px`;
      cells.forEach((el, i) => {
        put(el, "width", `${R0[i].w}px`);
        put(el, "height", `${R0[i].h}px`);
      });

      L = {
        dpr,
        pad,
        R0,
        R1,
        R2,
        off,
        offC: { x: rc.x - R2[4].x, y: rc.y - R2[4].y },
        room: { w: room.offsetWidth, h: room.offsetHeight },
      };

      const fits =
        artRect.w >= 120 &&
        caption.getBoundingClientRect().bottom <= content.getBoundingClientRect().bottom + 0.5;
      return fits;
    };

    const apply = (f: Frame, layout: Layout) => {
      f.cells.forEach((c, i) => {
        const r0 = layout.R0[i];
        put(
          cells[i],
          "transform",
          `translate3d(${px(c.rect.x)}px,${px(c.rect.y)}px,0) scale(${sc(c.rect.w / r0.w)},${sc(c.rect.h / r0.h)})`,
        );
        put(cells[i], "opacity", op(c.opacity));
      });
      put(backdrop, "opacity", op(f.backdrop));
      f.labels.forEach((l, k) => {
        put(labels[k], "transform", `translate3d(${px(l.x)}px,${px(l.y)}px,0)`);
        put(labels[k], "opacity", op(l.opacity));
      });
      for (const n of names) put(n, "opacity", op(f.nameOpacity));
      put(center, "transform", `translate3d(${px(f.center.x)}px,${px(f.center.y)}px,0)`);
      put(center, "opacity", op(f.center.opacity));
      put(
        room,
        "transform",
        `translate3d(${px(f.roomLine.x)}px,${px(f.roomLine.y)}px,0) scale(${sc(f.roomLine.s)})`,
      );
      put(room, "opacity", op(f.roomLine.opacity));
      put(foot, "opacity", op(f.foot));
      put(head, "opacity", op(f.head));
      put(h2, "opacity", op(f.h2.opacity));
      put(h2, "transform", `translate3d(0,${px(f.h2.y)}px,0)`);
      put(art, "opacity", op(f.art));
      put(caption, "opacity", op(f.caption));
      if (f.rest !== restOn) {
        restOn = f.rest;
        section.toggleAttribute("data-rest", f.rest);
      }
    };

    /** The hot path: one scrollY read, then cached writes */
    const tick = (force = false) => {
      if (!L) return;
      const p = clamp((window.scrollY - top) / travel);
      if (!force) {
        if (p === lastP) return;
        if (Math.abs(p - lastP) < 0.0005 && p > 0 && p < 1) return;
      }
      lastP = p;
      apply(frameAt(p, L), L);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        tick();
      });
    };

    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("scroll", onScroll, { passive: true });
        section.setAttribute("data-active", "");
      } else {
        window.removeEventListener("scroll", onScroll);
        section.removeAttribute("data-active");
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    // Only listen to scroll while the track is within a viewport of view
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry || !armed) return;
        tick(true);
        listen(entry.isIntersecting);
      },
      { rootMargin: "100% 0px" },
    );

    // Re-measure when the stage or the page above it changes size
    const ro = new ResizeObserver(() => {
      if (!armed || measureRaf) return;
      measureRaf = requestAnimationFrame(() => {
        measureRaf = 0;
        remeasure();
      });
    });

    const disarm = () => {
      armed = false;
      L = null;
      lastP = -1;
      restOn = false;
      io.unobserve(track);
      ro.disconnect();
      listen(false);
      cancelAnimationFrame(measureRaf);
      measureRaf = 0;
      section.removeAttribute("data-armed");
      section.removeAttribute("data-rest");
      clearInline();
    };

    /** Collapse to the static chapter until the next media change or reload */
    const goStatic = () => {
      disarm();
      section.setAttribute("data-off", "");
    };

    const remeasure = () => {
      if (!armed) return;
      if (!measure()) {
        goStatic();
        return;
      }
      lastP = -1;
      tick(true);
    };

    const arm = () => {
      if (armed) return;
      if (!mq.matches || !document.documentElement.hasAttribute("data-js")) return;
      section.removeAttribute("data-off");
      section.setAttribute("data-armed", "");
      if (!measure()) {
        clearInline();
        section.removeAttribute("data-armed");
        section.setAttribute("data-off", "");
        return;
      }
      armed = true;
      lastP = -1;
      tick(true);
      io.observe(track);
      ro.observe(stage);
      ro.observe(document.body);
    };

    const onMedia = () => {
      if (mq.matches) {
        section.removeAttribute("data-off");
        arm();
      } else {
        disarm();
      }
    };
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) remeasure();
    };

    mq.addEventListener("change", onMedia);
    window.addEventListener("pageshow", onShow);
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) remeasure();
    });

    arm();

    return () => {
      alive = false;
      mq.removeEventListener("change", onMedia);
      window.removeEventListener("pageshow", onShow);
      disarm();
      io.disconnect();
      section.removeAttribute("data-off");
    };
  }, []);

  return (
    <div ref={ref} className="fold-track relative">
      {children}
    </div>
  );
}
