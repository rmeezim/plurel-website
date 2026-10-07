"use client";

import { useEffect, useState } from "react";
import { STUDIO_CITY } from "@/lib/site";

/** IANA names whose city segment isn't the name people use today */
const RENAMED: Record<string, string> = {
  Calcutta: "Kolkata",
  Kiev: "Kyiv",
  Saigon: "Ho Chi Minh City",
  Rangoon: "Yangon",
  Katmandu: "Kathmandu",
  Sao_Paulo: "São Paulo",
};

/** "America/Los_Angeles" -> "Los Angeles"; UTC reads "UTC", other zones without a city "Local" */
export function cityOf(timeZone: string): string {
  if (timeZone === "UTC" || timeZone === "Etc/UTC") return "UTC";
  const parts = timeZone.split("/");
  if (parts.length < 2 || parts[0] === "Etc") return "Local";
  const city = parts[parts.length - 1];
  return RENAMED[city] ?? city.replace(/_/g, " ");
}

/**
 * Live 24-hour time as Swiss metadata. `studio` (default) is the studio
 * city; `visitor` follows the visitor's own time zone, labelled with its
 * city (someone in Dubai sees "Dubai", someone in San Francisco "Los
 * Angeles"), with no permission prompt. The server renders a neutral
 * placeholder so static HTML never lies about the time, then it ticks
 * every 15s once hydrated.
 */
export function CityClock({ visitor = false, className = "" }: { visitor?: boolean; className?: string }) {
  const [now, setNow] = useState<{ city: string; time: string } | null>(null);

  useEffect(() => {
    const zone = visitor ? Intl.DateTimeFormat().resolvedOptions().timeZone || STUDIO_CITY.timeZone : STUDIO_CITY.timeZone;
    const city = visitor ? cityOf(zone) : `${STUDIO_CITY.name} studio`;
    const format = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: zone });
    const tick = () => setNow({ city, time: format.format(new Date()) });
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [visitor]);

  return (
    <span
      className={`tabular-nums transition-opacity duration-500 ${visitor && !now ? "opacity-0" : ""} ${className}`}
    >
      {now?.city ?? (visitor ? "Local" : `${STUDIO_CITY.name} studio`)} <span aria-hidden>·</span>{" "}
      <time suppressHydrationWarning>{now?.time ?? "--:--"}</time>
    </span>
  );
}
