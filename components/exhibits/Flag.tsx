/**
 * Small inline vector flags, drawn as plain SVG shapes rather than Unicode
 * flag emoji. Flag emoji rely on the viewer's OS having colour flag glyphs
 * in its emoji font; many Windows configurations don't, and render a
 * two-letter code or a blank box instead. Vector shapes render identically
 * everywhere. These are deliberately simplified (no fine heraldic detail)
 * since every use is a ~14-20px inline icon next to a text label.
 */

const VIEWBOX = '0 0 30 20';

const BODIES: Record<string, React.ReactNode> = {
  'United States': (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#FFFFFF" />
      {[0, 2, 4].map((i) => (
        <rect key={i} x={0} y={i * 4} width={30} height={4} fill="#B22234" />
      ))}
      <rect x={0} y={0} width={13} height={8} fill="#3C3B6E" />
    </>
  ),
  'United Kingdom': (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#00247D" />
      <polygon points="0,0 6,0 30,17 30,20 24,20 0,3" fill="#FFFFFF" />
      <polygon points="24,0 30,0 30,3 6,20 0,20 0,17" fill="#FFFFFF" />
      <polygon points="0,0 3,0 30,18.5 30,20 27,20 0,1.5" fill="#CF142B" />
      <polygon points="27,0 30,0 30,1.5 3,20 0,20 0,18.5" fill="#CF142B" />
      <rect x={12} y={0} width={6} height={20} fill="#FFFFFF" />
      <rect x={0} y={7} width={30} height={6} fill="#FFFFFF" />
      <rect x={13.5} y={0} width={3} height={20} fill="#CF142B" />
      <rect x={0} y={8.5} width={30} height={3} fill="#CF142B" />
    </>
  ),
  Switzerland: (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#D52B1E" />
      <rect x={13} y={5} width={4} height={10} fill="#FFFFFF" />
      <rect x={10} y={8} width={10} height={4} fill="#FFFFFF" />
    </>
  ),
  Canada: (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#FFFFFF" />
      <rect x={0} y={0} width={7.5} height={20} fill="#D52B1E" />
      <rect x={22.5} y={0} width={7.5} height={20} fill="#D52B1E" />
      <polygon
        points="15,4.5 16.3,8 20,7.3 17.6,10 20,12.3 16.5,12 17,16 15,13.3 13,16 13.5,12 10,12.3 12.4,10 10,7.3 13.7,8"
        fill="#D52B1E"
      />
    </>
  ),
  'United Arab Emirates': (
    <>
      <rect x={0} y={0} width={30} height={6.67} fill="#00732F" />
      <rect x={0} y={6.67} width={30} height={6.67} fill="#FFFFFF" />
      <rect x={0} y={13.33} width={30} height={6.67} fill="#000000" />
      <rect x={0} y={0} width={8} height={20} fill="#FF0000" />
    </>
  ),
  'Saudi Arabia': (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#006C35" />
      <rect x={6} y={13} width={18} height={1.6} fill="#FFFFFF" />
    </>
  ),
  Qatar: (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#8D1B3D" />
      <rect x={0} y={0} width={8} height={20} fill="#FFFFFF" />
    </>
  ),
  China: (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#DE2910" />
      <polygon
        points="7,4 8.2,7.6 12,7.6 9,9.8 10.1,13.4 7,11.2 3.9,13.4 5,9.8 2,7.6 5.8,7.6"
        fill="#FFDE00"
      />
    </>
  ),
  'Hong Kong': (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#DE2910" />
      <circle cx={15} cy={10} r={5.5} fill="#FFFFFF" />
      <circle cx={15} cy={10} r={1.3} fill="#DE2910" />
    </>
  ),
  'Korea, Republic of': (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#FFFFFF" />
      <path d="M15,4.5 A5.5,5.5 0 0 1 15,15.5 A2.75,2.75 0 0 1 15,10 A2.75,2.75 0 0 0 15,4.5 Z" fill="#CD2E3A" />
      <path d="M15,4.5 A5.5,5.5 0 0 0 15,15.5 A2.75,2.75 0 0 0 15,10 A2.75,2.75 0 0 1 15,4.5 Z" fill="#0047A0" />
    </>
  ),
  Germany: (
    <>
      <rect x={0} y={0} width={30} height={6.67} fill="#000000" />
      <rect x={0} y={6.67} width={30} height={6.67} fill="#DD0000" />
      <rect x={0} y={13.33} width={30} height={6.67} fill="#FFCE00" />
    </>
  ),
  Sweden: (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#006AA7" />
      <rect x={9} y={0} width={4} height={20} fill="#FECC00" />
      <rect x={0} y={8} width={30} height={4} fill="#FECC00" />
    </>
  ),
  Australia: (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#00247D" />
      <rect x={0} y={0} width={13} height={9} fill="#00247D" />
      <polygon points="0,0 2.6,0 13,7.3 13,9 10.4,9 0,1.6" fill="#FFFFFF" />
      <polygon points="10.4,0 13,0 13,1.6 2.6,9 0,9 0,7.3" fill="#FFFFFF" />
      <rect x={5.2} y={0} width={2.6} height={9} fill="#FFFFFF" />
      <rect x={0} y={3.2} width={13} height={2.6} fill="#FFFFFF" />
      <rect x={5.85} y={0} width={1.3} height={9} fill="#CF142B" />
      <rect x={0} y={3.85} width={13} height={1.3} fill="#CF142B" />
      {[
        [21, 5],
        [25, 9],
        [23, 14],
        [18, 15],
        [20.5, 11],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={0.9} fill="#FFFFFF" />
      ))}
    </>
  ),
  Italy: (
    <>
      <rect x={0} y={0} width={10} height={20} fill="#009246" />
      <rect x={10} y={0} width={10} height={20} fill="#FFFFFF" />
      <rect x={20} y={0} width={10} height={20} fill="#CE2B37" />
    </>
  ),
  Spain: (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#AA151B" />
      <rect x={0} y={5} width={30} height={10} fill="#F1BF00" />
    </>
  ),
  France: (
    <>
      <rect x={0} y={0} width={10} height={20} fill="#0055A4" />
      <rect x={10} y={0} width={10} height={20} fill="#FFFFFF" />
      <rect x={20} y={0} width={10} height={20} fill="#EF4135" />
    </>
  ),
  Japan: (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#FFFFFF" />
      <circle cx={15} cy={10} r={5.5} fill="#BC002D" />
    </>
  ),
  Netherlands: (
    <>
      <rect x={0} y={0} width={30} height={6.67} fill="#AE1C28" />
      <rect x={0} y={6.67} width={30} height={6.67} fill="#FFFFFF" />
      <rect x={0} y={13.33} width={30} height={6.67} fill="#21468B" />
    </>
  ),
  Malaysia: (
    <>
      <rect x={0} y={0} width={30} height={20} fill="#FFFFFF" />
      {[0, 2.86, 5.71, 8.57, 11.43].map((yy, i) => (
        <rect key={i} x={0} y={yy} width={30} height={1.43} fill="#CC0001" />
      ))}
      <rect x={0} y={0} width={15} height={14.3} fill="#010066" />
      <circle cx={6.5} cy={7} r={3.6} fill="#FFCC00" />
      <circle cx={7.8} cy={7} r={3.1} fill="#010066" />
      <polygon points="9,7 12,5.6 10.6,7 12,8.4" fill="#FFCC00" />
    </>
  ),
};

/** Aliases so callers can use whichever country-name spelling they already have. */
const ALIASES: Record<string, string> = {
  'South Korea': 'Korea, Republic of',
  Korea: 'Korea, Republic of',
  UAE: 'United Arab Emirates',
  UK: 'United Kingdom',
  USA: 'United States',
};

interface FlagProps {
  /** Country name, e.g. "United States". A few common aliases are accepted. */
  country: string;
  /** Rendered width in px (HTML) or local SVG units (nested inside another SVG). Default 18. */
  width?: number;
  /** Rendered height in px/units. Default width * 2/3 to keep the 3:2 flag ratio. */
  height?: number;
  x?: number;
  y?: number;
  className?: string;
  opacity?: number;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: (e: React.MouseEvent) => void;
}

export function Flag({
  country,
  width = 18,
  height,
  x,
  y,
  className,
  opacity,
  style,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: FlagProps) {
  const key = ALIASES[country] ?? country;
  const body = BODIES[key];
  if (!body) return null;
  const h = height ?? (width * 2) / 3;
  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={h}
      viewBox={VIEWBOX}
      className={className}
      opacity={opacity}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      aria-hidden
      focusable="false"
    >
      {body}
      <rect x={0.4} y={0.4} width={29.2} height={19.2} fill="none" stroke="var(--color-ink)" strokeOpacity={0.15} strokeWidth={0.8} />
    </svg>
  );
}

/** True if a vector flag exists for this country name (after alias resolution). */
export function hasFlag(country: string): boolean {
  const key = ALIASES[country] ?? country;
  return key in BODIES;
}
