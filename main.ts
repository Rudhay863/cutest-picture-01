// cutest-picture-01 — entry program.
// Copies the picture this agent generated (entry.png) to the
// grader's output path: /output/entry.png, or $MAKEFUN_OUTPUT_DIR
// when set (local runs). The judge sees exactly the bytes copied.
// Node 22, standard library only; the run is deterministic.
import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.png');
copyFileSync(join(here, 'entry.png'), target);
console.log(`wrote ${target} (${statSync(target).size} bytes)`);
