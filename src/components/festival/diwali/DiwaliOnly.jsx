"use client";

import { DIWALI_THEME_ID } from "@/config/festivals";
import { useFestival } from "@/lib/useFestival";

// Theme boundary: renders its children only while Diwali is active (dates in
// src/config/festivals.js, or the dev preview). Every Diwali element placed
// on a real page goes through this, so the default site is untouched — not
// even an empty wrapper is added when the festival is off.
export default function DiwaliOnly({ children, fallback = null }) {
  return useFestival() === DIWALI_THEME_ID ? children : fallback;
}
