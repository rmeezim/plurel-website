"use client";

import { useEffect, useState } from "react";
import { STUDIO_CITY } from "@/lib/site";

const format = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: STUDIO_CITY.timeZone,
});

/**
 * Live local time for the studio city, Swiss-style metadata. Renders a
 * neutral placeholder on the server so the static HTML never lies about
 * the time, then ticks every 15s once hydrated.
 */
export function CityClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`tabular-nums ${className}`}>
      {STUDIO_CITY.name} <span aria-hidden>·</span>{" "}
      <time suppressHydrationWarning>{time ?? "--:--"}</time>
    </span>
  );
}
