import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

const base = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconChevronDown = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconChevronRight = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const IconChevronLeft = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const IconCheck = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconX = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const IconPlus = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconTrash = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.1a2 2 0 0 1-2 1.9H9.8a2 2 0 0 1-2-1.9L7 7h10Z" />
  </svg>
);

export const IconPencil = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

export const IconPin = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 2v6.5M8 8.5h8l1 4H7l1-4Z" />
    <path d="M12 12.5V22" />
  </svg>
);

export const IconArrowUp = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

export const IconArrowDown = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

export const IconLoader = (props: IconProps) => (
  <svg
    {...base}
    {...props}
    className={`animate-spin ${props.className ?? ""}`}
  >
    <path d="M12 2v4" />
    <path d="M12 18v4" opacity={0.3} />
    <path d="m4.93 4.93 2.83 2.83" opacity={0.5} />
    <path d="m16.24 16.24 2.83 2.83" opacity={0.8} />
    <path d="M2 12h4" opacity={0.4} />
    <path d="M18 12h4" opacity={0.9} />
    <path d="m4.93 19.07 2.83-2.83" opacity={0.6} />
    <path d="m16.24 7.76 2.83-2.83" opacity={0.7} />
  </svg>
);

export const IconAlertTriangle = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M10.3 3.9 1.8 18a1.5 1.5 0 0 0 1.3 2.3h17.8a1.5 1.5 0 0 0 1.3-2.3L13.7 3.9a1.5 1.5 0 0 0-2.6 0Z" />
    <path d="M12 9v4M12 16.5v.01" />
  </svg>
);

export const IconInfo = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8v.01" />
  </svg>
);

export const IconExternalLink = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
    <path d="M15 3h6v6M10 14 21 3" />
  </svg>
);

export const IconLogOut = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const IconSparkles = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    <path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z" />
  </svg>
);

export const IconBookOpen = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 6.5c-1.5-1.3-3.6-2-6.5-2v13c2.9 0 5 .7 6.5 2 1.5-1.3 3.6-2 6.5-2v-13c-2.9 0-5 .7-6.5 2Z" />
    <path d="M12 6.5v13" />
  </svg>
);

export const IconClipboardList = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1Z" />
    <path d="M9 11h6M9 15h6M8 11h.01M8 15h.01" />
  </svg>
);

export const IconCalendar = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3.5 10h17" />
  </svg>
);

export const IconBuilding = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="4" y="3" width="10" height="18" rx="1" />
    <path d="M14 8h6v13h-6M7 7h.01M7 11h.01M7 15h.01M10.5 7h.01M10.5 11h.01M10.5 15h.01" />
  </svg>
);

export const IconListChecks = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m4 6 1.5 1.5L8 5" />
    <path d="m4 12 1.5 1.5L8 11" />
    <path d="m4 18 1.5 1.5L8 17" />
    <path d="M12 6h8M12 12h8M12 18h8" />
  </svg>
);

export const IconUser = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c1.4-3.5 4.3-5.5 7.5-5.5s6.1 2 7.5 5.5" />
  </svg>
);

export const IconMail = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 6.5 8 6 8-6" />
  </svg>
);

export const IconLock = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="5" y="10.5" width="14" height="10" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);

export const IconLayers = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </svg>
);

export const IconRefresh = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M20 11a8 8 0 0 0-14.6-4.6M4 5v5h5" />
    <path d="M4 13a8 8 0 0 0 14.6 4.6M20 19v-5h-5" />
  </svg>
);

export const IconSearch = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const IconTarget = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </svg>
);

export const IconClock = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);
