// ─────────────────────────────────────────────────────────────────────────
// FESTIVAL CONFIGURATION — the one place festival dates, theme ids and the
// development preview settings live. Nothing else in the codebase holds a
// date or decides whether a festival is on.
// ─────────────────────────────────────────────────────────────────────────
//
// ACTIVATION RULE
// A festival is active when the current date and time *in TIME_ZONE* falls
// inside one of its windows ("YYYY-MM-DDTHH:mm", 24-hour clock):
//   start <= now < end      (start INCLUSIVE, end EXCLUSIVE)
// i.e. the theme switches on at exactly `start` and off at exactly `end`.
// Outside every window the site renders exactly as it does today.
//
// The check runs in the visitor's browser (see src/lib/festival.js): every
// page is prerendered as static HTML at build time, so a server-side date
// check would freeze whatever was true on deploy day. No redeploy is needed
// for a festival to switch on or off.
//
// To add a new year: append a window to the festival's `windows` list.
// To add a new festival: add an entry here, then scope its styles under
// html[data-festival="<id>"] (see src/styles/festivals/).
//
// Dates for lunar-calendar festivals move every year — confirm each new
// window against the official panchang before adding it.

// Dostan Machines is based in Greater Noida, so "now" is Indian time (IST)
// for every visitor, wherever they are.
export const TIME_ZONE = "Asia/Kolkata";

// Theme identifier: exposed as <html data-festival="diwali"> while active,
// and the value every Diwali component and style checks against.
export const DIWALI_THEME_ID = "diwali";

export const FESTIVALS = [
  {
    id: DIWALI_THEME_ID,
    name: "Diwali",
    windows: [
      // Diwali 2026: from 6 November 00:00:00 IST through 11 November
      // 23:59:59 IST (inclusive). The end is exclusive, so "through the 11th"
      // is written as midnight starting the 12th.
      { start: "2026-11-06T00:00", end: "2026-11-12T00:00" },
    ],
  },
];

// DEVELOPMENT PREVIEW (never active in production)
// Locally (`next dev`), force a festival on or off without touching the
// dates above: add ?festival=<id|none|auto> to any URL. The choice is
// remembered in localStorage until ?festival=auto. Production builds
// contain no code that reads these settings, so public visitors always get
// the date-based result.
export const FESTIVAL_PREVIEW = {
  queryParam: "festival",
  storageKey: "dostan:festival-preview",
};
