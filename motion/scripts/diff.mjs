// Pixel diff: node scripts/diff.mjs <a.png> <b.png> <diff.png> [side-by-side.png]
import fs from "node:fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const [a, b, out, sbs] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
if (A.width !== B.width || A.height !== B.height) {
  console.error(`size mismatch: ${A.width}x${A.height} vs ${B.width}x${B.height}`);
  process.exit(1);
}
const { width, height } = A;
const diff = new PNG({ width, height });
const n = pixelmatch(A.data, B.data, diff.data, width, height, { threshold: 0.1 });
fs.writeFileSync(out, PNG.sync.write(diff));
console.log(`${n} differing pixels of ${width * height} = ${((100 * n) / (width * height)).toFixed(3)}%`);

if (sbs) {
  const gap = 20;
  const S = new PNG({ width: width * 2 + gap, height });
  S.data.fill(255);
  PNG.bitblt(A, S, 0, 0, width, height, 0, 0);
  PNG.bitblt(B, S, 0, 0, width, height, width + gap, 0);
  fs.writeFileSync(sbs, PNG.sync.write(S));
}
