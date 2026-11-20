// Leonida Platinum — GTA VI trophy guide & tracker.
// The entry program (Node 22, standard library only). It hands the
// guide in: it copies this repository's app/ (the static guide) and
// screenshots/ (its renders) into the output directory and writes
// /output/dossier.json, the summary the judge reads, with the vendored
// make.fun library. vendor/makefun-frontend.ts stays exactly as the
// kit shipped it — the scorer rebuilds the dossier with its own copy
// and the two must match byte for byte.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const appDir = join(repoRoot, 'app');
const shotsDir = join(repoRoot, 'screenshots');

mkdirSync(outputDir, { recursive: true });
cpSync(appDir, join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's caps for this competition: at most 4 screenshots, each
// at most 256 KiB; app/ at most 993 files and directories and 48 MiB;
// the dossier text at most 163,840 bytes. buildDossier refuses an
// entry past those limits, so a failure here is a failure the
// scorer would report too.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);

const shotNames = existsSync(shotsDir) ? readdirSync(shotsDir).sort() : [];
console.log(`Leonida Platinum handed in: app/ + ${shotNames.length} screenshot(s) + dossier.json -> ${outputDir}`);
