import { DIWALI } from "./palette";

// Precision rangoli: rangoli-inspired geometry drawn as fine metallic
// linework (no fills, no colour blocks). Built on a 200×200 viewBox centred
// at 0,0. Strokes don't scale with the SVG, so the lines stay hairline-fine
// at every size.

const deg = (d) => (d * Math.PI) / 180;
const polar = (r, a) => [r * Math.sin(deg(a)), -r * Math.cos(deg(a))];
const f = (n) => Math.round(n * 100) / 100;
const range = (n, step, offset = 0) => Array.from({ length: n }, (_, i) => offset + i * step);

// Lens-shaped petal between two radii, pointing along angle `a`.
function petal(r1, r2, width, a) {
  const [x1, y1] = polar(r1, a);
  const [x2, y2] = polar(r2, a);
  const mid = (r1 + r2) / 2;
  const [cx1, cy1] = polar(Math.hypot(mid, width), a + (Math.atan2(width, mid) * 180) / Math.PI);
  const [cx2, cy2] = polar(Math.hypot(mid, width), a - (Math.atan2(width, mid) * 180) / Math.PI);
  return `M${f(x1)} ${f(y1)}Q${f(cx1)} ${f(cy1)} ${f(x2)} ${f(y2)}Q${f(cx2)} ${f(cy2)} ${f(x1)} ${f(y1)}Z`;
}

// Arch rising off a circle of radius r, spanning a±half, peaking towards `peak`.
function scallop(r, half, peak, a) {
  const [x1, y1] = polar(r, a - half);
  const [x2, y2] = polar(r, a + half);
  const [cx, cy] = polar(peak, a);
  return `M${f(x1)} ${f(y1)}Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}`;
}

const RAYS = range(8, 45, 22.5).map((a) => {
  const [x1, y1] = polar(8, a);
  const [x2, y2] = polar(20, a);
  return `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`;
});
const PETALS = range(8, 45).map((a) => petal(25, 60, 9, a));
const MINOR_PETALS = range(8, 45, 22.5).map((a) => petal(31, 47, 4.5, a));
const SCALLOPS = range(8, 45).map((a) => scallop(63, 22.5, 92, a));
const SCALLOP_DOTS = range(8, 45).map((a) => polar(83, a));
const TICKS = range(32, 11.25, 5.625).map((a) => {
  const [x1, y1] = polar(91, a);
  const [x2, y2] = polar(95, a);
  return `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`;
});

/**
 * @param {object} props
 * @param {number|string} [props.size=240]       Rendered width/height (px or any CSS length).
 * @param {string} [props.color]                  Stroke colour (antique gold by default).
 * @param {number} [props.strokeWidth=1]          Line weight in screen pixels.
 * @param {number} [props.strokeOpacity=0.85]     Overall line opacity.
 * @param {"none"|"draw"|"spin"|"draw-spin"|"manual"} [props.animate="none"]
 *   draw: lines trace in once; spin: very slow rotation. Both are switched
 *   off automatically for prefers-reduced-motion. manual: lines start
 *   undrawn (pathLength 1, dashoffset 1) for the caller to animate — the
 *   stroked lines carry [data-rangoli-line], the filled points
 *   [data-rangoli-dot].
 * @param {boolean} [props.hollow=false]          Leave the centre (bindu and rays) empty, e.g. to frame a logo.
 * @param {number} [props.drawDuration=2.4]       Seconds for the draw-in.
 * @param {number} [props.spinDuration=140]       Seconds per full turn.
 * @param {string} [props.title]                  Accessible name; omit for decoration (hidden from assistive tech).
 */
export default function RangoliMotif({
  size = 240,
  color = DIWALI.gold,
  strokeWidth = 1,
  strokeOpacity = 0.85,
  animate = "none",
  drawDuration = 2.4,
  spinDuration = 140,
  hollow = false,
  title,
  className = "",
  style,
}) {
  const draw = animate === "draw" || animate === "draw-spin";
  const spin = animate === "spin" || animate === "draw-spin";
  const manual = animate === "manual";
  const line = {
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    vectorEffect: "non-scaling-stroke",
    "data-rangoli-line": "",
    ...(draw && { pathLength: 1, className: "diwali-draw" }),
    ...(manual && { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 }),
  };
  const dot = { fill: color, "data-rangoli-dot": "", ...(manual && { opacity: 0 }) };

  return (
    <svg
      viewBox="-100 -100 200 200"
      width={size}
      height={size}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={className}
      style={{
        overflow: "visible",
        "--diwali-draw-duration": `${drawDuration}s`,
        "--diwali-spin-duration": `${spinDuration}s`,
        ...style,
      }}
    >
      <g opacity={strokeOpacity} className={spin ? "diwali-spin" : undefined}>
        <circle r="96" {...line} strokeOpacity={0.45} />
        {TICKS.map((d) => (
          <path key={d} d={d} {...line} strokeOpacity={0.6} />
        ))}
        {SCALLOPS.map((d) => (
          <path key={d} d={d} {...line} />
        ))}
        <circle r="63" {...line} />
        {PETALS.map((d) => (
          <path key={d} d={d} {...line} />
        ))}
        {MINOR_PETALS.map((d) => (
          <path key={d} d={d} {...line} strokeOpacity={0.7} />
        ))}
        <circle r="22" {...line} />
        {!hollow &&
          RAYS.map((d) => <path key={d} d={d} {...line} strokeOpacity={0.8} />)}
        {!hollow && <circle r="4.5" {...line} />}
        {/* Bindu and scallop points: the only filled marks, kept tiny. */}
        {!hollow && <circle r="1.6" {...dot} />}
        {SCALLOP_DOTS.map(([x, y]) => (
          <circle key={`${x}${y}`} cx={f(x)} cy={f(y)} r="1.4" {...dot} />
        ))}
      </g>
    </svg>
  );
}
