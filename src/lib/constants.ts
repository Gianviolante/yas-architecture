// Navigation labels
export const NAV_LABELS = {
  PROGETTI: "Progetti",
  STUDIO: "Studio",
  TEAM: "Team",
  CONTATTI: "Contatti",
} as const;

// Project statuses and types
export const PROJECT_STATUS = {
  IN_PROGRESS: "In corso",
  PENDING_APPROVAL: "In approvazione",
  COMPLETED: "Realizzato",
} as const;

export const PROJECT_TYPOLOGY = {
  ARCHITECTURE: "Architettura",
  INTERIOR_DESIGN: "Interior Design",
  RESIDENTIAL: "Residenziale",
  COMMERCIAL: "Commerciale",
  OTHER: "Altro",
} as const;

// Event types
export const EVENT_TYPES = {
  NEWS: "News",
  EVENT: "Evento",
} as const;

// Site branding
export const SITE_NAME = "YAS Architecture";
export const SITE_DESCRIPTION = "Studio di architettura e design — Brindisi, Italia";
export const SITE_ADDRESS = "Piazza Marco Antonio Cavalerio, 21, 72100 Brindisi, Italia";
export const SITE_EMAIL = "studio@yas-arc.com";

// Colors (use Tailwind classes instead, but keeping hex references for reference)
export const COLORS = {
  BLACK: "#000000",
  DARK_GRAY: "#1a1a1a",
  LIGHT_GRAY: "#d9d9d9",
  TEXT_GRAY: "#282828",
  BORDER_GRAY: "#9d9d9d",
} as const;

// Navigation paths
export const ROUTES = {
  HOME: "/",
  PROGETTI: "/progetti",
  STUDIO: "/studio",
  TEAM: "/team",
  CONTATTI: "/contatti",
  ADMIN: "/admin",
} as const;
