// Leonida Platinum — a GTA VI trophy guide and tracker (Node 22, standard library only).
//
// The guide itself is app/: plain static files (index.html, CSS, ES modules, JSON data)
// that any static server can serve with app/ at its root, offline, no build step. This
// program is the hand-in step: it copies app/ and screenshots/ from beside this file
// into /output (or MAKEFUN_OUTPUT_DIR outside the grader) and writes /output/dossier.json,
// the summary the judge reads, using the vendored make.fun library. The library file
// vendor/makefun-frontend.ts is the kit's copy, unchanged — the scorer rebuilds the
// dossier with its own copy and requires a byte-for-byte match.
//
// Run it after rendering the screenshots:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the guide locally with `node serve.ts` (http://localhost:8080).

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

mkdirSync(outDir, { recursive: true });
copyTree(join(repoRoot, 'app'), join(outDir, 'app'));
if (existsSync(join(repoRoot, 'screenshots'))) {
  copyTree(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'));
}

// The scorer's own caps (reference/gate.json): text_max_bytes shapes the bytes;
// the others refuse an entry the scorer would refuse (more than 4 screenshots or
// one over 256 KiB; more than 993 files and directories in app/, or 48 MiB of app
// files — app/ counts beside /output's own 1000-entry cap, its screenshots/ and
// dossier.json, so keep room).
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
