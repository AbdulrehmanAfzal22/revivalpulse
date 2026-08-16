import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
p.on('crash', () => console.log('PAGE CRASHED'));
await p.goto('http://localhost:4173/kids/games/easy/memory', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
await p.waitForTimeout(2500);
const hiddenSel = '[aria-label^="Hidden card"]';
const hiddenCount = () => p.locator(hiddenSel).count();
const cardLabel = async (loc) => {
  const a = await loc.getAttribute('aria-label').catch(() => null);
  return a && !a.startsWith('Hidden') ? a : null;
};
const BYNAME = {};
const until = Date.now() + 240000;
let budget = 200;
while ((await hiddenCount()) > 0 && budget-- > 0 && Date.now() < until) {
  const anchor = p.locator(hiddenSel).first();
  if ((await anchor.count()) === 0) break;
  await anchor.click({ timeout: 3000 }).catch(() => {});
  await p.waitForTimeout(350);
  const aLabel = await cardLabel(anchor);
  const isFace = aLabel && aLabel.charCodeAt(0) > 0x0600;
  if (!aLabel) { await p.waitForTimeout(800); continue; }
  let found = false;
  for (let k = 0; k < 10 && !found; k++) {
    const cand = p.locator(hiddenSel).nth(k === 0 ? 1 : 0);
    if ((await cand.count()) === 0) break;
    const candPre = await hiddenCount();
    await cand.click({ timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(550);
    const cLabel = await cardLabel(cand);
    const mate = isFace ? aLabel : null;
    if (!isFace && cLabel && cLabel.length === 1 && cLabel.charCodeAt(0) > 0x0600) {
      // anchor is a NAME; candidate is Arabic FACE — need data to verify pairing
    }
    if (cLabel === aLabel) { found = true; break; }
    if (candPre === 2) continue;
    const t0 = Date.now();
    while (Date.now() - t0 < 2200 && (await hiddenCount()) !== candPre) await p.waitForTimeout(150);
    await anchor.click({ timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(350);
  }
  if (found) await p.waitForTimeout(500);
  if ((await p.getByText('You did it!').count()) > 0) { console.log('WIN'); break; }
}
console.log('hidden left:', await hiddenCount(), 'budget left:', budget);
await b.close();
