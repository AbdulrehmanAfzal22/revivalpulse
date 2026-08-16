import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { execSync, spawn } from 'node:child_process';

const T = '/var/folders/4f/qtbp9jr54rb_kqccmd3jhdc00000gp/T/opencode';
const REPO = process.argv[2] ?? '.';
const BASE = 'http://localhost:4173';
const TIERS = ['easy', 'medium', 'hard'];

const QMAP = JSON.parse(fs.readFileSync(`${T}/qmap.json`, 'utf8'));
const WUDU_MAP = JSON.parse(fs.readFileSync(`${T}/wudu.json`, 'utf8'));
const MAPS2 = JSON.parse(fs.readFileSync(`${T}/maps2.json`, 'utf8'));
const BYNAME = JSON.parse(fs.readFileSync(`${T}/byname.json`, 'utf8'));
const TIMELINE = JSON.parse(fs.readFileSync(`${T}/timeline.json`, 'utf8'));

const tfMap = new Map(QMAP.tf.map((x) => [x[0], x[1]]));
const qzMap = new Map(QMAP.qz.map((x) => [x[0], x[1]]));
const tfDiff = new Map(QMAP.tf.map((x) => [x[0], x[2]]));
const { ce, dm, mm, nm, hh } = MAPS2;
const FACE_TO_ORDER = {};
for (const v of Object.values(BYNAME)) FACE_TO_ORDER[v.face] = v.order;
const NAME_BY_FACE = {};
for (const [n, v] of Object.entries(BYNAME)) NAME_BY_FACE[v.face] = n;

const regText = fs.readFileSync(`${REPO}/src/features/kids/games/gameRegistry.ts`, 'utf8');
const ids = [...new Set([...regText.matchAll(/id:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]))];
const colorById = {};
for (const m of regText.matchAll(/id:\s*'([a-z0-9-]+)'([\s\S]*?)color:\s*'([^']+)'/g)) colorById[m[1]] = m[3];
const EXPECTED = 20;

const esc = (s) => s.replace(/["\\[\]]/g, '\\$&');
const errs = new Set();

const out = { hub: {}, oneTap: [], playAll: [], variety: {}, consoleErrors: [] };

async function ensureServer() {
  try { execSync('curl -sf -o /dev/null ' + BASE); return; } catch {}
  const srv = spawn('python3', ['-m', 'http.server', '4173'], { cwd: `${REPO}/build`, detached: true, stdio: 'ignore' });
  srv.unref();
  await new Promise((r) => setTimeout(r, 1500));
}

const winLoc = (page) => page.getByText('You did it!');
const playAgainLoc = (page) => page.getByText('Play again');
const isWin = async (page) => (await winLoc(page).count()) > 0;
const opts = (page) => page.locator('button[class*="option"]:not([disabled])');

async function lines(page) {
  return (await page.locator('body').innerText()).split('\n').map((l) => l.trim()).filter(Boolean);
}
function findMapLine(ls, map) {
  if (map instanceof Map) { for (const l of ls) if (map.has(l)) return l; return null; }
  for (const l of ls) if (l in map) return l;
  return null;
}
async function roundToken(page) {
  const n = await page.locator('text=/Round \\d+ of \\d+/').first().count();
  if (n) return await page.locator('text=/Round \\d+ of \\d+/').first().textContent();
  return (await lines(page)).slice(0, 6).join('|');
}
const changed = async (page, before, wait = 500) => {
  await page.waitForTimeout(wait);
  const after = await roundToken(page).catch(() => '');
  return after !== before || (await isWin(page));
};
const clickOnce = async (loc, timeout = 3000) => {
  await loc.click({ timeout }).catch(() => {});
};
const dragOnce = async (from, to) => {
  await Promise.race([
    from.dragTo(to, { force: true, timeout: 6000 }),
    new Promise((r) => setTimeout(r, 9000)),
  ]).catch(() => {});
};

async function clickOptsUntilChanged(page, max = 8) {
  const before = await roundToken(page);
  for (let i = 0; i < max; i++) {
    const pool = page.locator('button[class*="option"]:not([disabled])');
    const list = await pool.all();
    if (!list.length) break;
    await clickOnce(list[i % list.length]);
    if (await changed(page, before, 400)) return true;
  }
  return false;
}

function promptLine(ls, re = /Find(?: all \d+)?:?\s*(.+)/i) {
  for (const l of ls) { const m = l.match(re); if (m) return m[1].trim(); }
  return null;
}

/* ---------------- exact solvers ---------------- */

async function solveTrueFalse(page, collect = null) {
  const before = await roundToken(page);
  const ls = await lines(page);
  const stmt = findMapLine(ls, tfMap);
  if (!stmt) return clickOptsUntilChanged(page);
  const raw = tfMap.get(stmt);
  if (collect) collect.push([stmt, raw, tfDiff.get(stmt)]);
  const answer = raw === true || raw === 'True' ? 'True' : 'False';
  await page.getByRole('button', { name: answer }).first().click({ timeout: 3000 }).catch(() => {});
  await changed(page, before, 350);
}

async function solveStoryQuiz(page, collect = null) {
  const before = await roundToken(page);
  const ls = await lines(page);
  let prompt = findMapLine(ls, qzMap);
  if (!prompt) { await clickOptsUntilChanged(page); return; }
  if (collect) collect.push([prompt, qzMap.get(prompt)]);
  const idx = qzMap.get(prompt);
  const list = await opts(page).all();
  if (idx < list.length) await clickOnce(list[idx]);
  await changed(page, before, 350);
}

async function solveMatching(page) {
  const before = await roundToken(page);
  const labels = await page.$$eval('button[aria-label],a[aria-label]', (els) =>
    els.map((e) => e.getAttribute('aria-label')).filter(Boolean));
  for (const label of labels) {
    const mate = label in NAME_BY_FACE ? NAME_BY_FACE[label] : BYNAME[label] ? BYNAME[label].face : null;
    if (!mate) continue;
    const a = page.locator(`[aria-label="${esc(label)}"]`).first();
    const b = page.locator(`[aria-label="${esc(mate)}"]`).first();
    if ((await a.count()) && (await b.count())) {
      await clickOnce(a);
      await page.waitForTimeout(300);
      await clickOnce(b);
      if (await changed(page, before, 400)) return;
    }
  }
  await clickOptsUntilChanged(page);
}

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

async function solvePopOrSpot(page, kind) {
  const before = await roundToken(page);
  const ls = await lines(page);
  let face = null;
  let count = null;
  if (kind === 'spot') {
    const m = promptLine(ls);
    if (m && BYNAME[m]) face = BYNAME[m].face;
    if (!face) {
      const cardTxt = await page.locator('[aria-label]:not([class*="option"])').first().getAttribute('aria-label').catch(() => null);
      if (cardTxt && cardTxt in FACE_TO_ORDER) face = cardTxt;
    }
  } else {
    const full = ls.map((l) => l.match(/Find(?: all (\d+))?:\s*(.+)/)).find(Boolean);
    if (full) { count = full[1] ? parseInt(full[1], 10) : 1; const name = full[2].trim(); if (BYNAME[name]) face = BYNAME[name].face; }
    if (!face) {
      const m = promptLine(ls, /Find(?: all \d+)?:\s*(.+)/i);
      if (m && BYNAME[m]) face = BYNAME[m].face;
    }
  }
  if (face) {
    const loc = page.locator(`[aria-label="${esc(face)}"]`);
    const n = await loc.count();
    const wanted = count === null ? 1 : Math.min(count, n);
    for (let i = 0; i < wanted; i++) {
      if (await isWin(page)) break;
      await loc.nth(i).click({ force: true, timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(260);
    }
    await changed(page, before, 350);
    return;
  }
  await clickOptsUntilChanged(page);
}

async function solveHunt(page) {
  const before = await roundToken(page);
  const ls = await lines(page);
  let target = promptLine(ls, /Look for:\s*(.+)/);
  let count = null;
  if (!target) {
    const full = ls.map((l) => l.match(/Find all (\d+) (.+)/)).find(Boolean);
    if (full) { count = parseInt(full[1], 10); target = full[2].trim(); }
  }
  let face = null;
  if (target) {
    if (BYNAME[target]) face = BYNAME[target].face;
    else if (target in FACE_TO_ORDER) face = target;
  }
  if (!face) return clickOptsUntilChanged(page);
  let guard = 0;
  let clicked = 0;
  while (guard < 16) {
    const found = page.locator(`[aria-label="${esc(face)}"]`);
    const n = await found.count();
    if (!n) break;
    await clickOnce(found.first());
    await page.waitForTimeout(420);
    guard++;
    clicked++;
    if (count !== null && clicked >= count) break;
  }
  await changed(page, before, 400);
}

async function solveFindWord(page) {
  const before = await roundToken(page);
  const ls = await lines(page);
  const m = promptLine(ls, /means:\s*(.+)/);
  if (!m || !BYNAME[m]) return clickOptsUntilChanged(page);
  const loc = page.locator(`[aria-label="${esc(m)}"]`).first();
  if ((await loc.count())) {
    await clickOnce(loc);
    await changed(page, before, 350);
    return;
  }
  await clickOptsUntilChanged(page);
}

async function solveOrder(page) {
  const before = await roundToken(page);
  const list = await page.locator('button[aria-label],button[class*="option"]').all();
  const items = [];
  for (const el of list) {
    const a = await el.getAttribute('aria-label').catch(() => null);
    if (a && a in FACE_TO_ORDER) items.push({ el, o: FACE_TO_ORDER[a] });
  }
  items.sort((x, y) => x.o - y.o);
  for (const it of items) {
    if (await isWin(page)) break;
    await clickOnce(it.el);
  }
  await changed(page, before, 400);
}

async function solveBuildWord(page) {
  const before = await roundToken(page);
  const ls = await lines(page);
  const labels = await page.$$eval('button[aria-label]:not([disabled])', (els) =>
    els.map((e) => e.getAttribute('aria-label')).filter((a) => a && a.length === 1));
  const isArabic = labels.length > 0 && labels[0].charCodeAt(0) > 0x0600;
  let target = null;
  for (const [n, v] of Object.entries(BYNAME)) {
    const needle = isArabic ? v.face : n;
    if (ls.some((l) => l === needle || l.includes(needle))) { target = needle.replace(/\s+/g, ''); break; }
  }
  if (!target) return clickOptsUntilChanged(page);
  for (const ch of [...target]) {
    const loc = page.locator(`button[aria-label="${esc(ch)}"]:not([disabled])`).first();
    if ((await loc.count())) await clickOnce(loc);
    await page.waitForTimeout(220);
  }
  await changed(page, before, 400);
}

async function solveCountStars(page) {
  const before = await roundToken(page);
  const star = await page.locator('[role="img"][aria-label]').first().getAttribute('aria-label').catch(() => null);
  const n = parseInt(star || '', 10);
  if (Number.isNaN(n)) return clickOptsUntilChanged(page);
  const loc = page.locator(`button[aria-label="${n}"]`).first();
  if ((await loc.count())) await clickOnce(loc);
  await changed(page, before, 350);
}

async function solveLetterCount(page) {
  const before = await roundToken(page);
  const ls = await lines(page);
  let word = ls.find((l) => l in FACE_TO_ORDER && !/^(Easy|Medium|Hard)$/.test(l));
  if (!word) word = ls.find((l) => /^[\u0600-\u06FF0-9 ]+$/.test(l) && l.replace(/\s/g, '').length > 1);
  if (!word) return clickOptsUntilChanged(page);
  const count = [...word.replace(/\s/g, '')].length;
  const loc = page.locator(`button[aria-label="${count}"]`).first();
  if ((await loc.count())) await clickOnce(loc);
  await changed(page, before, 350);
}

async function solveMapGame(page, kind) {
  const before = await roundToken(page);
  const map = kind === 'ce' ? ce : kind === 'dm' ? dm : mm;
  const ls = await lines(page);
  const key = findMapLine(ls, map);
  if (!key) return clickOptsUntilChanged(page);
  const correct = map[key];
  if (kind === 'dm') {
    const opt = page.locator('button:has([class*="optionTranslation"])').filter({ hasText: correct }).first();
    if ((await opt.count())) { await clickOnce(opt); await changed(page, before, 350); return; }
  } else {
    const opt = page.locator('button:has([class*="optionText"])').filter({ hasText: correct }).first();
    if ((await opt.count())) { await clickOnce(opt); await changed(page, before, 350); return; }
  }
  await clickOptsUntilChanged(page);
}

async function solveNames(page) {
  const before = await roundToken(page);
  const ls = await lines(page);
  const tr = ls.find((l) => l in nm && !/^\d+$/.test(l));
  if (!tr) return clickOptsUntilChanged(page);
  const meaning = nm[tr];
  const opt = page.locator('button:has([class*="optionText"])').filter({ hasText: meaning }).first();
  if ((await opt.count())) { await clickOnce(opt); await changed(page, before, 350); return; }
  await clickOptsUntilChanged(page);
}

async function solveLetterSound(page) {
  const before = await roundToken(page);
  const pool = page.locator('button[class*="option"]:not([disabled])');
  const n = await pool.count();
  for (let i = 0; i < n; i++) {
    await clickOnce(pool.nth(i));
    await page.waitForTimeout(120);
  }
  await changed(page, before, 250);
}

async function solveTimeline(page) {
  const before = await roundToken(page);
  const cards = page.locator('[draggable="true"]');
  const slots = page.locator('[class*="slot"]');
  const nCards = await cards.count();
  const nSlots = await slots.count();
  if (!nCards || !nSlots) return clickOptsUntilChanged(page);
  const orderMap = {};
  for (const t of TIMELINE) { orderMap[t.e.split(' ')[0]] = t.o; orderMap[t.n] = t.o; }
  const items = [];
  for (let i = 0; i < nCards; i++) {
    const txt = await cards.nth(i).innerText().catch(() => '');
    let o = null;
    for (const key in orderMap) if (txt.includes(key)) { o = orderMap[key]; break; }
    if (o !== null) items.push({ i, o });
  }
  items.sort((a, b) => a.o - b.o);
  const slotIdx = (o) => {
    const rel = items.findIndex((x) => x.o === o);
    return rel >= 0 && rel < nSlots ? rel : null;
  };
  for (const it of items) {
    if (await isWin(page)) break;
    const idx = slotIdx(it.o);
    if (idx === null) continue;
    await dragOnce(cards.nth(it.i), slots.nth(idx));
    await page.waitForTimeout(450);
  }
  await changed(page, before, 500);
}

async function solveWudu(page) {
  const before = await roundToken(page);
  const ls = await lines(page);
  const m = ls.map((l) => l.match(/Step (\d+) of \d+/)).find(Boolean);
  if (!m) return clickOptsUntilChanged(page);
  const stepIdx = parseInt(m[1], 10) - 1;
  const stepNames = await page.$$eval('[aria-label]', (els) =>
    els.map((e) => e.getAttribute('aria-label')).filter((a) => a && /^\d+\./.test(a)));
  const thisName = (stepNames[stepIdx] || '').replace(/^\d+\.\s*/, '');
  const part = WUDU_MAP[thisName];
  const hotspot = part ? page.locator(`[data-step="${part}"]`).first() : null;
  if (hotspot && (await hotspot.count())) await hotspot.click({ force: true, timeout: 4000 }).catch(() => {});
  await changed(page, before, 400);
}

async function solveHalalHaram(page) {
  const before = await roundToken(page);
  const ls = await lines(page);
  let prompt = null;
  for (const l of ls) {
    const m = l.match(/(.+?) – (حلال|حرام)/);
    if (m) { prompt = m[1].trim(); break; }
  }
  if (!prompt) {
    for (const l of ls) {
      const m = l.match(/Is (.+?) (halal|haram)\?/i);
      if (m) { prompt = m[1].trim(); break; }
    }
  }
  if (prompt) {
    const opts = page.locator('[aria-label]');
    const n = await opts.count();
    for (let i = 0; i < n; i++) {
      const v = await opts.nth(i).getAttribute('aria-label').catch(() => '');
      const clean = v.replace(/^\d+\.\s*/, '').replace(/\s*\d+\s*$/, '').trim();
      if (clean === prompt) {
        await clickOnce(opts.nth(i));
        await changed(page, before, 400);
        return;
      }
    }
  }
  await clickOptsUntilChanged(page);
}

const SOLVERS = {
  'true-false': solveTrueFalse,
  'story-quiz': solveStoryQuiz,
  matching: solveMatching,
  memory: solveMemory,
  'balloon-pop': (p) => solvePopOrSpot(p, 'pop'),
  'spot-same': (p) => solvePopOrSpot(p, 'spot'),
  'letter-hunt': solveHunt,
  'word-finder': solveFindWord,
  'order-line': solveOrder,
  'build-word': solveBuildWord,
  'count-stars': solveCountStars,
  'letter-count': solveLetterCount,
  'good-manners': (p) => solveMapGame(p, 'mm'),
  'cause-effect': (p) => solveMapGame(p, 'ce'),
  'dua-moment': (p) => solveMapGame(p, 'dm'),
  'names-meaning': solveNames,
  'letter-sound': solveLetterSound,
  'prophet-timeline': solveTimeline,
  'wudu-order': solveWudu,
  'halal-haram': solveHalalHaram,
};

/* ---------------- phases ---------------- */

async function playSession(page, tier, gameId, collect) {
  const url = `${BASE}/kids/games/${tier}/${gameId}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  if (page.isClosed()) return { url, tier, gameId, won: false, played: false, rounds: 0, ms: 0, closed: true };
  await page.waitForTimeout(1300);
  const solve = SOLVERS[gameId] || (async (p) => { await clickOptsUntilChanged(p); });
  const started = Date.now();
  const maxMs = gameId === 'memory' ? 240000 : 90000;
  let rounds = 0;
  let restarts = 0;
  while (Date.now() - started < maxMs) {
    if (await isWin(page)) break;
    if ((await page.getByText('Time is up!').count())) {
      if (++restarts > 3) break;
      await playAgainLoc(page).first().click({ timeout: 2500 }).catch(() => {});
      await page.waitForTimeout(1300);
      continue;
    }
    await solve(page, collect);
    rounds++;
    if (rounds > 40) break;
  }
  const won = await isWin(page);
  console.log(`  [session] ${gameId}/${tier} won=${won} rounds=${rounds} restarts=${restarts} ms=${Date.now() - started}`);
  return { url, tier, gameId, won, played: won, rounds, ms: Date.now() - started };
}

async function hubCheck(page, tier) {
  await page.goto(`${BASE}/kids/games/${tier}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1500);
  const tiles = page.locator('a[href*="/kids/games/' + tier + '/"]');
  const n = await tiles.count();
  const hrefs = [];
  for (let i = 0; i < n; i++) hrefs.push(await tiles.nth(i).getAttribute('href'));
  const bad = hrefs.filter((h) => !ids.some((id) => h && h.endsWith('/' + id)));
  const geom = {};
  for (const [vw, hgt] of [[375, 812], [768, 1024], [1366, 768], [1920, 1080]]) {
    await page.setViewportSize({ width: vw, height: hgt });
    await page.waitForTimeout(450);
    geom[vw] = await page.evaluate(() => {
      const g = document.querySelector('[class*="grid"]');
      return {
        cols: g ? getComputedStyle(g).gridTemplateColumns.split(' ').length : null,
        gridW: g ? Math.round(g.getBoundingClientRect().width) : null,
        winW: window.innerWidth,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
  }
  const palette = {};
  for (const id of ids) {
    const t = page.locator(`a[href*="/kids/games/${tier}/${id}"]`).first();
    if ((await t.count()) === 0) { palette[id] = 'missing'; continue; }
    palette[id] = await t.evaluate((el, c) => {
      const s = getComputedStyle(el);
      const bg = (s.backgroundImage || '') + ' ' + (s.backgroundColor || '');
      return { bg, borderColor: s.borderColor, expected: c };
    }, colorById[id]);
  }
  return { tier, count: n, bad, geom, palette };
}

async function oneTapCheck(page, tier, gameId) {
  await page.goto(`${BASE}/kids/games/${tier}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1200);
  const tile = page.locator(`a[href*="/kids/games/${tier}/${gameId}"]`).first();
  const href = await tile.getAttribute('href');
  await tile.click();
  await page.waitForTimeout(1600);
  const { pathname } = new URL(page.url());
  const direct = pathname === `/kids/games/${tier}/${gameId}`
    && (await playAgainLoc(page).count()) === 0
    && !/\/start|play-setup|pick$/.test(pathname);
  return { tier, gameId, direct, pathname, href };
}

async function collectVariety(page, tier, gameId, sessions) {
  const all = [];
  for (let s = 0; s < sessions; s++) {
    const seq = [];
    const r = await playSession(page, tier, gameId, seq);
    all.push({ seq: seq.slice(0, 24), win: r.won });
    if (!r.won) break;
    if (s < sessions - 1) {
      await playAgainLoc(page).first().click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(1400);
    }
  }
  return all;
}

async function main() {
  await ensureServer();
  const CHROME_ARGS = ['--disable-gpu', '--disable-extensions', '--no-first-run', '--disable-background-networking'];
  let browser = await chromium.launch({ channel: 'chrome', headless: true, args: CHROME_ARGS });
  let ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  let page = await ctx.newPage();
  const attach = (pg) => {
    pg.on('console', (m) => { if (m.type() === 'error') errs.add(m.text().slice(0, 220)); });
    pg.on('pageerror', (e) => errs.add('PAGEERROR: ' + String(e).slice(0, 220)));
    pg.on('crash', () => { console.log('  [session] PAGE CRASHED'); });
  };
  attach(page);

  for (const tier of TIERS) out.hub[tier] = await hubCheck(page, tier);

  for (const id of ids) {
    for (const tier of TIERS) {
      try { out.oneTap.push(await oneTapCheck(page, tier, id)); }
      catch (e) { out.oneTap.push({ tier, id, direct: false, error: String(e).slice(0, 120) }); }
    }
  }

  for (const id of ids) {
    for (const tier of TIERS) {
      console.log(`[session] starting ${id}/${tier}`);
      let s = null;
      for (let attempt = 0; attempt < 3 && !(s && s.won); attempt++) {
        try {
          s = await playSession(page, tier, id);
          if (s.closed) throw new Error('browser closed');
        } catch (e) {
          s = { tier, id, won: false, error: String(e).slice(0, 160), closed: /closed/i.test(String(e)) };
          console.log(`  [session] ${id}/${tier} ERROR attempt=${attempt} ${String(e).slice(0, 120)}`);
        }
        if (s.closed) {
          try { await browser.close(); } catch {}
          browser = await chromium.launch({ channel: 'chrome', headless: true, args: CHROME_ARGS });
          ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
          page = await ctx.newPage();
          attach(page);
        }
      }
      out.playAll.push(s);
    }
  }

  for (const gameId of ['true-false', 'story-quiz']) {
    out.variety[gameId] = {};
    for (const tier of TIERS) {
      try { out.variety[gameId][tier] = await collectVariety(page, tier, gameId, 3); }
      catch (e) { out.variety[gameId][tier] = [{ seq: [], win: false, error: String(e).slice(0, 120) }]; }
    }
  }

  out.consoleErrors = [...errs];
  await browser.close();
  fs.writeFileSync(`${T}/report.json`, JSON.stringify(out, null, 1));
  console.log('REPORT WRITTEN');
  console.log(JSON.stringify(stats(out), null, 1));
}

function stats(o) {
  const oneBad = o.oneTap.filter((x) => !x.direct);
  const won = o.playAll.filter((x) => x.won);
  const noWin = o.playAll.filter((x) => !x.won);
  const tfBad = {}; const sqBad = {};
  for (const g of ['true-false', 'story-quiz']) {
    for (const t of TIERS) {
      const sess = o.variety[g][t];
      const dup = sess.some((s) => s.seq.some((x, i) => s.seq.indexOf(x) !== i));
      const cross = sess.length > 1 && sess.slice(1).every((s) => JSON.stringify(s.seq) === JSON.stringify(sess[0].seq));
      (g === 'true-false' ? tfBad : sqBad)[t] = { sessions: sess.length, inSessionDup: dup, allSameAcross: cross };
    }
  }
  return {
    oneTap: { pass: o.oneTap.length - oneBad.length, fail: oneBad.length, failures: oneBad.map((x) => `${x.tier}/${x.id}`).slice(0, 8) },
    playAll: { won: won.length, total: o.playAll.length, noWin: noWin.map((x) => `${x.tier}/${x.id}:${x.error || 'timeout'}`) },
    variety: { tf: tfBad, sq: sqBad },
    consoleErrors: o.consoleErrors.length,
  };
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });