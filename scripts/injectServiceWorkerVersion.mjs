/**
 * CRA copies public/ verbatim into build/, so a static service-worker.js can
 * never know which build it shipped with — a redeploy used to leave visiting
 * browsers serving the previous bundle's cached files ("the false alarm"):
 * the old and new worker files were byte-identical, so browsers never
 * replaced the running worker, and its fixed cache name kept serving stale
 * cached JS/CSS via stale-while-revalidate.
 *
 * This post-build step hashes build/asset-manifest.json (a file whose content
 * changes whenever ANY built asset does) and rewrites the __SW_BUILD_VERSION__
 * token inside build/service-worker.js with that hash. Each deploy therefore
 * ships a byte-different worker that installs fresh, opens a fresh
 * version-named cache, and the old cache is deleted on activate.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SW_PATH = 'build/service-worker.js';
const MANIFEST_PATH = 'build/asset-manifest.json';
const TOKEN = '__SW_BUILD_VERSION__';

const manifest = JSON.parse(readFileSync(resolve(MANIFEST_PATH), 'utf8'));
const version = createHash('sha256')
  .update(JSON.stringify(manifest))
  .digest('hex')
  .slice(0, 12);

const swPath = resolve(SW_PATH);
let sw = readFileSync(swPath, 'utf8');
if (!sw.includes(TOKEN)) {
  console.error(`[sw-version] ${SW_PATH} does not contain ${TOKEN} — check public/service-worker.js; skipping.`);
  process.exit(1);
}
sw = sw.split(TOKEN).join(version);
writeFileSync(swPath, sw);
console.log(`[sw-version] injected ${version} into ${SW_PATH}`);