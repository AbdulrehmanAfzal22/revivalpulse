import { chromium } from 'playwright-core';
import fs from 'node:fs';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
const ids = ['matching', 'memory', 'balloon-pop', 'spot-same', 'letter-hunt', 'word-finder', 'prophet-timeline'];
const out = {};
for (const id of ids) {
  await p.goto(`http://localhost:4173/kids/games/easy/${id}`, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(2500);
  out[id] = await p.evaluate(() => {
    const bodyTxt = document.body.innerText.split('\n').map(s => s.trim()).filter(Boolean);
    const cards = [...document.querySelectorAll('[draggable="true"]')].slice(0, 6).map(e => (e.innerText || '').replace(/\n/g, '|'));
    return { bodyTxt, cards };
  });
}
fs.writeFileSync('/var/folders/4f/qtbp9jr54rb_kqccmd3jhdc00000gp/T/opencode/domdump2.json', JSON.stringify(out, null, 1));
await b.close();
console.log('done');
