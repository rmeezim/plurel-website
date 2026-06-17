import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ArrowDownRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 7 17 17" />
      <path d="M17 8v9H8" />
    </svg>
  );
}

/** Plurel mark — an eight-ray asterisk / spark */
export function Spark(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="M4.9 4.9 19.1 19.1" />
      <path d="M19.1 4.9 4.9 19.1" />
    </svg>
  );
}

export function Globe(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.6 2.6 15.4 0 18" />
      <path d="M12 3c-2.6 2.6-2.6 15.4 0 18" />
    </svg>
  );
}

/** Overlapping panels — content systems */
export function Layers(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

/** Up-and-to-the-right trend line — paid media */
export function Trend(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M14 8h6v6" />
    </svg>
  );
}

export function Megaphone(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 14v-3a1 1 0 0 1 .7-.96l11-3.3A1 1 0 0 1 17 7.7v8.6a1 1 0 0 1-1.3.96l-11-3.3" />
      <path d="M7 15.2V18a1.5 1.5 0 0 0 3 0v-1.9" />
      <path d="M20 10a3 3 0 0 1 0 4" />
    </svg>
  );
}

/** Circled X — used as a generic studio mark inside mockups */
export function CircledX(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" />
    </svg>
  );
}

/** Circled chevron — small "view" affordance inside mockups */
export function CircledArrow(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.5 8.5 14 12l-3.5 3.5" />
    </svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
