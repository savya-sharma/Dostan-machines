import { FESTIVALS, FESTIVAL_PREVIEW, TIME_ZONE } from "@/config/festivals";

// The active festival is exposed as <html data-festival="<id>">. Every
// festival style and effect keys off that one attribute, so the default
// site is untouched whenever it's absent.
export const FESTIVAL_ATTRIBUTE = "data-festival";
// Set alongside it (development only) when a preview override is in play.
export const FESTIVAL_PREVIEW_ATTRIBUTE = "data-festival-preview";
// Development-only preview override ("auto" = follow the dates, a festival
// id, or "none"); the settings themselves live in src/config/festivals.js.
export const PREVIEW_STORAGE_KEY = FESTIVAL_PREVIEW.storageKey;
export const PREVIEW_QUERY_PARAM = FESTIVAL_PREVIEW.queryParam;

// Pure activation rule — the one implementation used both by the <head>
// boot script (stringified below) and by any JS that needs it. Kept
// self-contained (no imports, no outer variables) so it survives
// Function.prototype.toString().
export function resolveFestival(festivals, timeZone, now) {
  // Current time in the festival time zone as "YYYY-MM-DDTHH:mm" (24-hour),
  // the same shape as the config, so plain string comparison is correct.
  var parts = {};
  new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(now)
    .forEach(function (p) {
      parts[p.type] = p.value;
    });
  var current = parts.year + "-" + parts.month + "-" + parts.day + "T" + parts.hour + ":" + parts.minute;
  for (var i = 0; i < festivals.length; i++) {
    var windows = festivals[i].windows || [];
    for (var j = 0; j < windows.length; j++) {
      // Start inclusive, end exclusive (see src/config/festivals.js).
      if (current >= windows[j].start && current < windows[j].end) return festivals[i].id;
    }
  }
  return null;
}

// Development-only override, read from ?festival=<id|none|auto> (which is
// then remembered) or from localStorage. Same self-contained rule as above.
function readPreview(storageKey, queryParam, festivalIds) {
  var allowed = festivalIds.concat(["none", "auto"]);
  var fromUrl = new URLSearchParams(window.location.search).get(queryParam);
  if (fromUrl && allowed.indexOf(fromUrl) !== -1) {
    if (fromUrl === "auto") localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, fromUrl);
  }
  var stored = localStorage.getItem(storageKey);
  return stored && allowed.indexOf(stored) !== -1 && stored !== "auto" ? stored : null;
}

// Inline script for <head>: sets data-festival before first paint, so a
// festival never flashes in after the default site has rendered. The
// preview branch is only emitted into development HTML — production pages
// don't contain any code that could read an override.
export function festivalBootScript() {
  const config = JSON.stringify(FESTIVALS.map(({ id, windows }) => ({ id, windows })));
  const allowPreview = process.env.NODE_ENV === "development";
  return `(function(){try{
var festivals=${config};
var active=(${resolveFestival.toString()})(festivals,${JSON.stringify(TIME_ZONE)},new Date());
${
  allowPreview
    ? `var preview=(${readPreview.toString()})(${JSON.stringify(PREVIEW_STORAGE_KEY)},${JSON.stringify(PREVIEW_QUERY_PARAM)},festivals.map(function(f){return f.id}));
if(preview){active=preview==="none"?null:preview;document.documentElement.setAttribute(${JSON.stringify(FESTIVAL_PREVIEW_ATTRIBUTE)},preview);}`
    : ""
}
if(active)document.documentElement.setAttribute(${JSON.stringify(FESTIVAL_ATTRIBUTE)},active);
}catch(e){}})();`;
}
