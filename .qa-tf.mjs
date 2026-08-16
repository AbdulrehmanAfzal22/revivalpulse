import { chromium } from 'playwright-core';
import fs from 'node:fs';
const QMAP = JSON.parse(fs.readFileSync('/var/folders/4f/qtbp9jr54rb_kqccmd3jhdc00000gp/T/opencode/qmap.json', 'utf8'));
const tfMap = new Map(QMAP.tf.map(x => [x[0], x[1]]));
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
for (const tier of ['easy','medium','hard']) {
  await p.goto(`http://localhost:4173/kids/games/${tier}/true-false`, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(2200);
  const ls = (await p.locator('body').innerText()).split('\n').map(l => l.trim()).filter(Boolean);
  const stmt = ls.find(l => tfMap.has(l));
  const raw = stmt && tfMap.get(stmt);
  const answer = raw === true || raw === 'True' ? 'True' : 'False';
  console.log(`== ${tier}: stmt=${stmt ? stmt.slice(0, 40) : 'NONE'} raw=${raw} answer=${answer}`);
  const tb = await p.getByRole('button', { name: answer }).count();
  console.log(`   getByRole buttons: ${tb}`);
  if (tb) await p.getByRole('button', { name: answer }).first().click({ timeout: 3000 }).catch(e => console.log('   click err', String(e).slice(0, 80)));
  await p.waitForTimeout(800);
  const l2 = (await p.locator('body').innerText()).split('\n').map(l => l.trim()).filter(Boolean).find(l => /Round \d+ of \d+/.test(l));
  console.log(`   token now: ${l2}`);
}
await b.close();
