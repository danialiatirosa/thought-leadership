const WIDTH = 640;
const HEIGHT = 460;
const CENTER_X = WIDTH / 2 - 20;
const TOP_Y = 56;
const BOTTOM_Y = 400;
const TURNS = 3.1;
const SAMPLES = 90;
const MAX_RADIUS = 168;

/**
 * A tapering vortex tube, side-view: several helical strands sharing one
 * axis, radius shrinking from bottom to top. This is what the singularity
 * in a forced Navier-Stokes blow-up looks like schematically (a filament
 * that spins faster and thins toward a point as it stretches), not a
 * literal fluid-dynamics rendering.
 */
function strandPath(phase: number, radiusScale: number, turns: number, topClamp = 0) {
  const points: string[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const y = BOTTOM_Y - t * (BOTTOM_Y - TOP_Y);
    const radius = Math.max(topClamp, radiusScale * MAX_RADIUS * (1 - t) ** 1.15);
    const theta = phase + t * turns * Math.PI * 2;
    const x = CENTER_X + radius * Math.cos(theta) * 0.62;
    const yWobble = radius * Math.sin(theta) * 0.16;
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${(y + yWobble).toFixed(1)}`);
  }
  return points.join(' ');
}

function looseStrandPath(phase: number, startRadius: number, endRadius: number, yStart: number, yEnd: number, turns: number) {
  const points: string[] = [];
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const radius = startRadius + (endRadius - startRadius) * t;
    const y = yStart + (yEnd - yStart) * t;
    const theta = phase + t * turns * Math.PI * 2;
    const x = CENTER_X + radius * Math.cos(theta) * 0.62;
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(' ');
}

const MAIN_STRANDS = [
  { phase: 0, color: 'var(--color-tamkeen-deep)', opacity: 0.85, width: 2 },
  { phase: Math.PI / 3, color: 'var(--color-teal)', opacity: 0.7, width: 1.6 },
  { phase: (2 * Math.PI) / 3, color: 'var(--color-teal-mid)', opacity: 0.6, width: 1.6 },
  { phase: Math.PI, color: 'var(--color-tamkeen)', opacity: 0.75, width: 1.8 },
  { phase: (4 * Math.PI) / 3, color: 'var(--color-teal)', opacity: 0.55, width: 1.4 },
  { phase: (5 * Math.PI) / 3, color: 'var(--color-lime)', opacity: 0.85, width: 2.2 },
];

const LOOSE_STRANDS = [
  { phase: 0.4, startRadius: 250, endRadius: 60, yStart: 392, yEnd: 210, turns: 1.1 },
  { phase: 2.1, startRadius: 270, endRadius: 70, yStart: 388, yEnd: 190, turns: 1.0 },
  { phase: 3.6, startRadius: 240, endRadius: 55, yStart: 398, yEnd: 220, turns: 1.2 },
  { phase: 5.0, startRadius: 260, endRadius: 65, yStart: 384, yEnd: 200, turns: 1.05 },
];

export function VortexDiagram() {
  return (
    <div className="my-2">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label="Schematic of a tapering vortex tube: streamlines spiral inward at the base and stretch along the axis toward a thinning point at top, illustrating a Navier-Stokes blow-up."
      >
        <title>A vortex that thins and speeds up as it stretches</title>

        {/* axis */}
        <line
          x1={CENTER_X}
          y1={TOP_Y - 24}
          x2={CENTER_X}
          y2={BOTTOM_Y + 8}
          stroke="var(--color-rule-soft)"
          strokeWidth={1}
          strokeDasharray="2,4"
        />
        <path
          d={`M ${CENTER_X - 5} ${TOP_Y - 14} L ${CENTER_X} ${TOP_Y - 26} L ${CENTER_X + 5} ${TOP_Y - 14}`}
          fill="none"
          stroke="var(--color-ink-soft)"
          strokeWidth={1.4}
        />

        {/* loose inward-spiraling streamlines feeding the base */}
        <g fill="none" strokeLinecap="round">
          {LOOSE_STRANDS.map((s, i) => (
            <path
              key={`loose-${i}`}
              d={looseStrandPath(s.phase, s.startRadius, s.endRadius, s.yStart, s.yEnd, s.turns)}
              stroke="var(--color-teal-mid)"
              strokeWidth={1.3}
              opacity={0.45}
            />
          ))}
        </g>

        {/* main tapering vortex strands */}
        <g fill="none" strokeLinecap="round">
          {MAIN_STRANDS.map((s, i) => (
            <path
              key={`main-${i}`}
              d={strandPath(s.phase, 1, TURNS, 3)}
              stroke={s.color}
              strokeWidth={s.width}
              opacity={s.opacity}
            />
          ))}
        </g>

        {/* axial stretching label */}
        <line x1={CENTER_X + 44} y1={TOP_Y - 10} x2={CENTER_X + 14} y2={TOP_Y + 2} stroke="var(--color-rule)" strokeWidth={1} />
        <text
          x={CENTER_X + 50}
          y={TOP_Y - 14}
          style={{ fontSize: 14, fontFamily: 'var(--font-sans)', fill: 'var(--color-ink)', fontWeight: 600 }}
        >
          Axial stretching
        </text>
        <text
          x={CENTER_X + 50}
          y={TOP_Y + 4}
          style={{ fontSize: 12, fontFamily: 'var(--font-sans)', fill: 'var(--color-mute)' }}
        >
          the tube thins and spins faster
        </text>

        {/* inward spiral label */}
        <line x1={CENTER_X - 190} y1={310} x2={CENTER_X - 118} y2={340} stroke="var(--color-rule)" strokeWidth={1} />
        <text
          x={CENTER_X - 260}
          y={298}
          style={{ fontSize: 14, fontFamily: 'var(--font-sans)', fill: 'var(--color-ink)', fontWeight: 600 }}
        >
          Inward spiral
        </text>
        <text
          x={CENTER_X - 260}
          y={316}
          style={{ fontSize: 12, fontFamily: 'var(--font-sans)', fill: 'var(--color-mute)' }}
        >
          fluid feeds toward the axis
        </text>
      </svg>
    </div>
  );
}
