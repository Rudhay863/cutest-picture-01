// cutest-picture-01 — entry program.
//
// The picture itself is baked into the repository as entry.png (a baby panda
// hugging a bamboo stalk, 1024x1024). This program does not draw anything: it
// sanity-checks that bundled picture and drops a copy where the harness looks
// for it, at $MAKEFUN_OUTPUT_DIR/entry.png (or /output/entry.png by default).

import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_HEADER = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const ONE_MIB = 1024 * 1024;
const MAX_SIDE = 1024;

function abort(reason: string): never {
  console.error(`cutest-picture-01: ${reason}`);
  process.exit(1);
}

function pictureSize(png: Buffer): { width: number; height: number } {
  // PNG layout: 8-byte signature, then the IHDR chunk. Its width lives at
  // bytes 16..20 and its height at bytes 20..24, both big-endian.
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

function run(): void {
  const repoRoot = dirname(fileURLToPath(import.meta.url));
  const bundled = join(repoRoot, "entry.png");
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  const target = outDir ? join(outDir, "entry.png") : "/output/entry.png";

  const data = readFileSync(bundled);

  if (data.length === 0 || data.length > ONE_MIB) {
    abort(`entry.png is ${data.length} bytes; must be 1..${ONE_MIB} bytes.`);
  }
  if (!data.subarray(0, 8).equals(PNG_HEADER)) {
    abort("entry.png does not start with the 8-byte PNG signature.");
  }
  if (data.subarray(12, 16).toString("ascii") !== "IHDR") {
    abort("entry.png has no IHDR chunk where one is expected.");
  }
  const tail = data.subarray(data.length - 12);
  if (tail.subarray(4, 8).toString("ascii") !== "IEND") {
    abort("entry.png does not end with a proper IEND trailer.");
  }

  const { width, height } = pictureSize(data);
  if (width === 0 || height === 0 || width > MAX_SIDE || height > MAX_SIDE) {
    abort(`entry.png is ${width}x${height}; must fit inside ${MAX_SIDE}x${MAX_SIDE}.`);
  }

  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(bundled, target);

  const shipped = statSync(target).size;
  if (shipped !== data.length) {
    abort(`copy came out ${shipped} bytes, expected ${data.length}.`);
  }
  // Second integrity check: the delivered file must hash exactly like the
  // bundled one, so a truncated or altered copy can never slip through.
  const digest = (buf: Buffer): string =>
    createHash("sha256").update(buf).digest("hex");
  const delivered = readFileSync(target);
  if (digest(delivered) !== digest(data)) {
    abort("sha256 of the delivered file does not match entry.png.");
  }

  console.log(
    `cutest-picture-01: wrote ${shipped} bytes (${width}x${height} PNG) to ${target}`,
  );
  console.log(`cutest-picture-01: sha256 ${digest(data).slice(0, 16)}… verified`);
}

run();
