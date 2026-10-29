"use client";

import { useSyncExternalStore } from "react";
import { FESTIVAL_ATTRIBUTE } from "@/lib/festival";

// The attribute is set once by the <head> boot script before hydration and
// never changes during the page's life (the dev preview switch reloads), so
// there's nothing to subscribe to.
const subscribe = () => () => {};

// Active festival id ("diwali", …) or null. Always null during the server
// render and hydration, so festival-only UI mounts after hydration without
// a mismatch; CSS keyed off html[data-festival] applies from first paint.
export function useFestival() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute(FESTIVAL_ATTRIBUTE),
    () => null
  );
}
