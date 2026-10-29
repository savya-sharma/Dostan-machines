import { DIWALI } from "./palette";

// Yantra-mandala: the main Diwali artwork. An original composition that
// combines a yantra's gated square frame (bhupura) with rangoli lotus rings,
// paisley flourishes and an eight-point star centre, drawn as fine metallic
// linework in layered weights and opacities.
//
// Built on a 256×256 viewBox centred at 0,0. Every stroked element carries
// pathLength="1" (so it can be drawn with a dash offset) and a data-group
// attribute naming its layer, so a timeline can draw the layers in turn:
//   gate · rings · ticks · outer-lotus · flourish · inner-lotus · star · dots
// `highlightPaths` exposes three continuous paths (outer ring, gate outline,
// outer lotus) for light to travel along.

const deg = (d) => (d * Math.PI) / 180;
const polar = (r, a) => [r * Math.sin(deg(a)), -r * Math.cos(deg(a))];
const f = (n) => Math.round(n * 100) / 100;
const pt = (r, a) => polar(r, a).map(f).join(" ");
const range = (n, step, offset = 0) => Array.from({ length: n }, (_, i) => offset + i * step);

// Pointed lotus petal from r1 to r2 along angle a, half-width w (degrees at
// the widest point), with an S-shaped flank for a carved feel.
function lotusPetal(r1, r2, w, a) {
  const mid = r1 + (r2 - r1) * 0.45;
  return (
    `M${pt(r1, a)}` +
    `C${pt(mid, a - w)} ${pt(r2 - (r2 - r1) * 0.2, a - w * 0.6)} ${pt(r2, a)}` +
    `C${pt(r2 - (r2 - r1) * 0.2, a + w * 0.6)} ${pt(mid, a + w)} ${pt(r1, a)}Z`
  );
}

// Midrib for a petal: a short inner line that gives it depth.
const midrib = (r1, r2, a) => `M${pt(r1 + (r2 - r1) * 0.22, a)}L${pt(r1 + (r2 - r1) * 0.7, a)}`;

// Paisley-style curl rising from r1 towards r2 near angle a.
function flourish(r1, r2, a) {
  return (
    `M${pt(r1, a - 6)}` +
    `C${pt(r1 + (r2 - r1) * 0.55, a - 14)} ${pt(r2, a - 4)} ${pt(r2 - 2, a + 6)}` +
    `C${pt(r2 - 6, a + 12)} ${pt(r1 + (r2 - r1) * 0.45, a + 10)} ${pt(r1 + (r2 - r1) * 0.5, a + 3)}`
  );
}

// Gated square frame (bhupura): square of half-size s with a stepped T-gate
// centred on each side.
function gatedSquare(s, gw, gd) {
  const side = (rot) => {
    const R = (x, y) => {
      const c = Math.cos(deg(rot));
      const si = Math.sin(deg(rot));
      return `${f(x * c - y * si)} ${f(x * si + y * c)}`;
    };
    return [
      R(-s, -s),
      R(-gw, -s),
      R(-gw, -s - gd),
      R(-gw * 0.45, -s - gd),
      R(-gw * 0.45, -s - gd * 1.6),
      R(gw * 0.45, -s - gd * 1.6),
      R(gw * 0.45, -s - gd),
      R(gw, -s - gd),
      R(gw, -s),
    ];
  };
  const pts = [0, 90, 180, 270].flatMap(side);
  return `M${pts.join("L")}Z`;
}

// Lines here are drawn with a dash offset over pathLength=1, which only
// works in user units: non-scaling strokes would apply the dash in screen
// pixels and stop short. So widths are in viewBox units instead — one
// design pixel at ~640px rendered size.
const UNIT = 0.4;

const circle = (r) => `M0 ${-r}A${r} ${r} 0 1 1 0 ${r}A${r} ${r} 0 1 1 0 ${-r}`;

const GATE = gatedSquare(104, 22, 8);
const GATE_INNER = gatedSquare(97, 16, 6);
const RING_OUTER = circle(90);
const RINGS = [circle(86), circle(64), circle(44), circle(24), circle(13)];
const TICKS = range(72, 5).map((a) => `M${pt(87.5, a)}L${pt(a % 15 === 0 ? 82 : 84, a)}`);
const OUTER_PETALS = range(16, 22.5).map((a) => lotusPetal(64, 84, 7, a));
const OUTER_RIBS = range(16, 22.5).map((a) => midrib(64, 84, a));
// The 16 outer petals as one continuous path, for light to travel along.
const OUTER_LOTUS_PATH = OUTER_PETALS.join("");
const FLOURISHES = range(8, 45, 22.5).map((a) => flourish(45, 62, a));
const FLOURISHES_MIRROR = range(8, 45, 22.5).map((a) => flourish(45, 62, a).replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, x, y) => `${f(-x)} ${y}`));
const INNER_PETALS = range(8, 45).map((a) => lotusPetal(24, 43, 11, a));
const INNER_MINOR = range(8, 45, 22.5).map((a) => lotusPetal(26, 36, 6, a));
const STAR = [
  `M${[0, 90, 180, 270].map((a) => pt(21, a)).join("L")}Z`,
  `M${[45, 135, 225, 315].map((a) => pt(21, a)).join("L")}Z`,
];
const DOT_RING = range(48, 7.5).map((a) => polar(75.5, a));
const PETAL_TIPS = range(16, 22.5).map((a) => polar(88.5, a));
const GATE_DOTS = [0, 90, 180, 270].map((a) => polar(117.5, a));

/**
 * @param {object} props
 * @param {number|string} [props.size="76vmin"]
 * @param {"draw"|"static"} [props.mode="static"]  draw: every line starts undrawn (dash offset 1) for a timeline to reveal.
 * @param {boolean} [props.hollow=true]            Leave the centre medallion empty (for a logo).
 * @param {boolean} [props.highlights=false]       Render the three light-travel overlay paths ([data-highlight]).
 * @param {number} [props.opacity=1]
 * @param {string} [props.title]                   Accessible name; omit for decoration.
 */
export default function YantraMandala({
  size = "76vmin",
  mode = "static",
  hollow = true,
  highlights = false,
  opacity = 1,
  color = DIWALI.gold,
  title,
  className = "",
  style,
}) {
  const draw = mode === "draw";
  const line = (group, width, alpha = 1) => ({
    fill: "none",
    stroke: color,
    // Widths are design pixels at ~640px; scaled into the 256-unit viewBox.
    strokeWidth: width * UNIT,
    strokeOpacity: alpha,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    pathLength: 1,
    "data-group": group,
    ...(draw && { strokeDasharray: 1, strokeDashoffset: 1 }),
  });
  const dot = (group) => ({ fill: color, "data-group": group, ...(draw && { opacity: 0 }) });
  const comet = {
    fill: "none",
    strokeLinecap: "round",
    pathLength: 1,
    strokeDasharray: "0.045 0.955",
    strokeDashoffset: 0,
    opacity: 0,
  };

  return (
    <svg
      viewBox="-128 -128 256 256"
      width={size}
      height={size}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={className}
      style={{ overflow: "visible", ...style }}
    >
      <g opacity={opacity}>
        <path d={GATE} {...line("gate", 1.3, 0.95)} />
        <path d={GATE_INNER} {...line("gate", 0.7, 0.55)} />
        <path d={RING_OUTER} {...line("rings", 1.2)} />
        {RINGS.map((d, i) => (
          <path key={d} d={d} {...line("rings", i === 0 ? 0.6 : 0.9, i === 0 ? 0.6 : 0.85)} />
        ))}
        {TICKS.map((d) => (
          <path key={d} d={d} {...line("ticks", 0.6, 0.55)} />
        ))}
        {OUTER_PETALS.map((d) => (
          <path key={d} d={d} {...line("outer-lotus", 1)} />
        ))}
        {OUTER_RIBS.map((d) => (
          <path key={d} d={d} {...line("outer-lotus", 0.6, 0.6)} />
        ))}
        {FLOURISHES.map((d) => (
          <path key={d} d={d} {...line("flourish", 0.9, 0.85)} />
        ))}
        {FLOURISHES_MIRROR.map((d) => (
          <path key={d} d={d} {...line("flourish", 0.9, 0.85)} />
        ))}
        {INNER_PETALS.map((d) => (
          <path key={d} d={d} {...line("inner-lotus", 1)} />
        ))}
        {INNER_MINOR.map((d) => (
          <path key={d} d={d} {...line("inner-lotus", 0.6, 0.65)} />
        ))}
        {!hollow && STAR.map((d) => <path key={d} d={d} {...line("star", 0.8)} />)}
        {DOT_RING.map(([x, y]) => (
          <circle key={`d${x}${y}`} cx={f(x)} cy={f(y)} r="0.9" {...dot("dots")} />
        ))}
        {PETAL_TIPS.map(([x, y]) => (
          <circle key={`t${x}${y}`} cx={f(x)} cy={f(y)} r="1.5" {...dot("dots")} />
        ))}
        {GATE_DOTS.map(([x, y]) => (
          <circle key={`g${x}${y}`} cx={f(x)} cy={f(y)} r="2" {...dot("dots")} />
        ))}
      </g>

      {highlights && (
        <g aria-hidden="true">
          {[RING_OUTER, GATE, OUTER_LOTUS_PATH].map((d, i) => (
            <g key={i} data-highlight={i}>
              {/* Soft halo under a bright core: depth without blur filters. */}
              <path d={d} {...comet} stroke={DIWALI.amber} strokeWidth={7 * UNIT} strokeOpacity="0.22" data-highlight-glow="" />
              <path d={d} {...comet} stroke="#fff1cc" strokeWidth={2 * UNIT} data-highlight-core="" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
