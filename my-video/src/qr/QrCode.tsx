import { C } from "../brand";

const N = 25;

// Deterministic, decorative QR-style pattern (not a scannable code).
const MODULES: boolean[] = (() => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
  const cells: boolean[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      cells.push(!inFinder(x, y) && rand() > 0.5);
    }
  }
  return cells;
})();

const Finder: React.FC<{ readonly x: number; readonly y: number; readonly color: string }> = ({ x, y, color }) => (
  <>
    <rect x={x} y={y} width={7} height={7} rx={1.4} fill={color} />
    <rect x={x + 1} y={y + 1} width={5} height={5} rx={0.9} fill={C.white} />
    <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.6} fill={color} />
  </>
);

export const QrCode: React.FC<{
  readonly size: number;
  readonly color?: string;
  // 0..1: how many modules are drawn (for build-on animations)
  readonly reveal?: number;
}> = ({ size, color = C.ink, reveal = 1 }) => (
  <svg width={size} height={size} viewBox={`-1 -1 ${N + 2} ${N + 2}`}>
    <rect x={-1} y={-1} width={N + 2} height={N + 2} rx={2} fill={C.white} />
    {MODULES.map((on, i) =>
      on && (i * 0.6180339) % 1 < reveal ? (
        <rect key={i} x={i % N} y={Math.floor(i / N)} width={1} height={1} fill={color} />
      ) : null,
    )}
    <Finder x={0} y={0} color={color} />
    <Finder x={N - 7} y={0} color={color} />
    <Finder x={0} y={N - 7} color={color} />
  </svg>
);
