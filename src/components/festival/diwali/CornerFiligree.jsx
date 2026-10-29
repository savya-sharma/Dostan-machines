import { DIWALI } from "./palette";

// Corner filigree: a double rule running along two edges from a corner,
// ending in small lotus finials, with a quarter-rosette set into the corner.
// Drawn for the top-left corner; `corner` rotates it into place. Every
// stroked line has pathLength="1" and data-group="corner" so a timeline can
// draw it in from the edge.

const line = (width, alpha, draw) => ({
  fill: "none",
  stroke: DIWALI.gold,
  strokeWidth: width,
  strokeOpacity: alpha,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  // No non-scaling stroke: the dash-offset draw-in needs user units.
  pathLength: 1,
  "data-group": "corner",
  ...(draw && { strokeDasharray: 1, strokeDashoffset: 1 }),
});

// Lotus finial pointing along +x at (x, y).
const finialX = (x, y) => `M${x} ${y}c3-3.2 7-3.2 9 0c-2 3.2-6 3.2-9 0zM${x + 9} ${y}h4`;
const finialY = (x, y) => `M${x} ${y}c-3.2 3-3.2 7 0 9c3.2-2 3.2-6 0-9zM${x} ${y + 9}v4`;

const ROTATION = { "top-left": 0, "top-right": 90, "bottom-right": 180, "bottom-left": 270 };

/**
 * @param {object} props
 * @param {"top-left"|"top-right"|"bottom-right"|"bottom-left"} props.corner
 * @param {number|string} [props.size=200]
 * @param {"draw"|"static"} [props.mode="static"]
 */
export default function CornerFiligree({ corner = "top-left", size = 200, mode = "static", className = "", style }) {
  const draw = mode === "draw";
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ transform: `rotate(${ROTATION[corner]}deg)`, overflow: "visible", ...style }}
    >
      {/* Double rules along both edges */}
      <path d="M14 26H170" {...line(1, 0.9, draw)} />
      <path d="M26 14V170" {...line(1, 0.9, draw)} />
      <path d="M22 32H120" {...line(0.6, 0.5, draw)} />
      <path d="M32 22V120" {...line(0.6, 0.5, draw)} />
      {/* Finials */}
      <path d={finialX(170, 26)} {...line(0.9, 0.85, draw)} />
      <path d={finialY(26, 170)} {...line(0.9, 0.85, draw)} />
      {/* Quarter rosette in the corner */}
      <path d="M26 66A40 40 0 0 0 66 26" {...line(1, 0.85, draw)} />
      <path d="M26 52A26 26 0 0 0 52 26" {...line(0.7, 0.6, draw)} />
      <path d="M26 26L54 54" {...line(0.7, 0.6, draw)} />
      <path d="M26 26c10 2 16 8 18 18c-10-2-16-8-18-18z" {...line(0.8, 0.8, draw)} />
      <path d="M40 66c2-8 6-12 12-14M66 40c-8 2-12 6-14 12" {...line(0.7, 0.6, draw)} />
      {/* Bead points */}
      {[
        [90, 26],
        [130, 26],
        [26, 90],
        [26, 130],
        [58, 58],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" fill={DIWALI.gold} data-group="corner-dot" opacity={draw ? 0 : 1} />
      ))}
    </svg>
  );
}
