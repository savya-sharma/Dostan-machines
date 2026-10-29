import { DIWALI } from "./palette";

// Fine section-boundary ornament: two hairlines fading in towards a small
// geometric centre motif. The motif keeps its proportions at any width; only
// the lines stretch. Purely decorative, so it's a presentational separator.

// pathLength="1" lets callers draw the strokes in with a dash offset of 1→0.
const line = {
  fill: "none",
  strokeWidth: 1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
};

function LotusMotif({ color }) {
  return (
    <svg viewBox="-24 -12 48 24" width="48" height="24" aria-hidden="true" focusable="false">
      <g stroke={color} {...line}>
        {/* Central petal and two side petals, geometric rather than drawn */}
        <path pathLength="1" d="M0 6C-4.2 1.6-4.2-4.4 0-9c4.2 4.6 4.2 10.6 0 15z" />
        <path pathLength="1" d="M-1.6 6C-7.8 5.2-11.6 1.2-12.4-4.6c5 .4 9 3.4 10.8 8" />
        <path pathLength="1" d="M1.6 6C7.8 5.2 11.6 1.2 12.4-4.6c-5 .4-9 3.4-10.8 8" />
        <path pathLength="1" d="M-15 8h30" opacity="0.7" />
      </g>
      <circle cx="0" cy="-1" r="1.1" fill={color} />
      <circle cx="-19" cy="8" r="0.9" fill={color} />
      <circle cx="19" cy="8" r="0.9" fill={color} />
    </svg>
  );
}

function FacetMotif({ color }) {
  return (
    <svg viewBox="-20 -10 40 20" width="40" height="20" aria-hidden="true" focusable="false">
      <g stroke={color} {...line}>
        <path pathLength="1" d="M0-8 8 0 0 8-8 0z" />
        <path pathLength="1" d="M0-4 4 0 0 4-4 0z" opacity="0.7" />
      </g>
      <circle cx="0" cy="0" r="1" fill={color} />
      <circle cx="-14" cy="0" r="0.9" fill={color} />
      <circle cx="14" cy="0" r="0.9" fill={color} />
    </svg>
  );
}

/**
 * @param {object} props
 * @param {"lotus"|"facet"} [props.variant="lotus"]
 * @param {string} [props.color]           Line colour (antique gold by default).
 * @param {number} [props.opacity=0.8]
 * @param {string} [props.className]       Width/margins come from the caller.
 */
export default function FestiveDivider({ variant = "lotus", color = DIWALI.gold, opacity = 0.8, className = "" }) {
  const fade = (dir) => ({
    background: `linear-gradient(to ${dir}, transparent, ${color})`,
  });
  const Motif = variant === "facet" ? FacetMotif : LotusMotif;

  return (
    <div role="presentation" aria-hidden="true" className={`flex items-center gap-4 ${className}`} style={{ opacity }}>
      <span className="h-px flex-1" style={fade("right")} />
      <Motif color={color} />
      <span className="h-px flex-1" style={fade("left")} />
    </div>
  );
}
