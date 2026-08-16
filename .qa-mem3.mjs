import { chromium } from 'playwright-core';
import fs from 'node:fs';
const T = '/var/folders/4f/qtbp9jr54rb_kqccmd3jhdc00000gp/T/opencode';
const BYNAME = JSON.parse(fs.readFileSync(T + '/byname.json', 'utf8'));
const NAME_BY_FACE = {};
for (const [n, v] of Object.entries(BYNAME)) NAME_BY_FACE[v.face] = n;
const roundToken = async (page) => (await page.locator('body').innerText()).split('\n').filter(Boolean).slice(0, 5).join('|');
const isWin = async (page) => (await page.getByText('You did it!').count()) > 0;
const clickOnce = async (loc) => { await loc.click({ timeout: 3000 }).catch(() => {}); };
const changed = async (page) => { await page.waitForTimeout(400); return true; };
const clickOptsUntilChanged = async () => {};

async function solveMemory(page) {
  const before = await roundToken(page);
  const CARD_DATA = { nameKeys: Object.keys(BYNAME), faceKeys: Object.keys(NAME_BY_FACE) };
  const isCard = (a, d) => a && (a.startsWith('Hidden') || a in d.nameKeys || a in d.faceKeys);
  const deckSnapshot = async () => {
    return await page.$$eval('button', (els, d) =>
      els.map((e) => e.getAttribute('aria-label')).filter((a) => a && (a.startsWith('Hidden') || a in d.nameKeys || a in d.faceKeys)), CARD_DATA);
  };
  const fullIndexes = await page.$$eval('button', (els, d) =>
    els.map((e, i) => [i, e.getAttribute('aria-label')]).filter(([, a]) => a && (a.startsWith('Hidden') || a in d.nameKeys || a in d.faceKeys)).map(([i]) => i), CARD_DATA);
  const n = fullIndexes.length;
  if (!n) { await clickOptsUntilChanged(page); return; }
  const known = {};
  const btnAt = (fullIdx) => page.locator('button').nth(fullIdx);
  const clickIdx = async (fullIdx) => { if (fullIdx !== undefined) await clickOnce(btnAt(fullIdx)); };
  // REVEAL phase: click cards pairwise; record which label sits at which full index
  for (let k = 0; k < n; k += 2) {
    const cur = await deckSnapshot();
    if (cur.every((l) => !l.startsWith('Hidden'))) break;
    const hidden = [];
    for (let t = 0; t < n; t++) {
      const f = fullIndexes[t];
      if (!(f in known) && cur[t] && cur[t].startsWith('Hidden')) hidden.push(f);
    }
    if (hidden.length < 2) break;
    await clickIdx(hidden[0]);
    await clickIdx(hidden[1]);
    await page.waitForTimeout(380);
    const fresh = await page.$$eval('button', (els, fIdx) => {
      const labels = els.map((e) => e.getAttribute('aria-label'));
      const res = {};
      for (const i of fIdx) if (labels[i] && !labels[i].startsWith('Hidden')) res[i] = labels[i];
      return res;
    }, hidden);
    for (const [i, l] of Object.entries(fresh)) known[i] = l;
    await page.waitForTimeout(420);
    if (await isWin(page)) return;
  }
  // MATCH phase: click the exact mate pair for every known label
  for (const [p, label] of Object.entries(known)) {
    const mate = label in NAME_BY_FACE ? NAME_BY_FACE[label] : label in BYNAME ? BYNAME[label].face : null;
    if (!mate) continue;
    const q = Object.entries(known).find(([i, l]) => i !== p && l === mate);
    if (!q) continue;
    const cur = await deckSnapshot();
    if (cur.every((l) => !l.startsWith('Hidden'))) break;
    await clickIdx(Number(p));
    await page.waitForTimeout(250);
    await clickIdx(Number(q[0]));
    await page.waitForTimeout(450);
    if (await isWin(page)) break;
  }
  await changed(page, before, 400);
}

const b = await chromium.launch({ channel: "chrome", headless: true });
const p = await b.newPage();
p.on("crash", () => console.log("CRASHED"));
for (const tier of ["easy", "medium", "hard"]) {
  await p.goto(`http://localhost:4173/kids/games/${tier}/memory`, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(2200);
  const t0 = Date.now();
  let guards = 0;
  while (!(await isWin(p)) && Date.now() - t0 < 120000 && guards++ < 30) { await solveMemory(p); }
  console.log(`${tier}: win=${await isWin(p)} ms=${Date.now() - t0} guards=${guards}`);
}
await b.close();
