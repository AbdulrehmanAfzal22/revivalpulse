import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
import fs from 'node:fs';
const reg = fs.readFileSync('src/features/kids/games/gameRegistry.ts', 'utf8');
const ids = [...new Set([...reg.matchAll(/id:\s*'([a-z0-9-]+)'/g)].map(m => m[1]))];
let out = {};
for (const id of ids) {
  await p.goto(`http://localhost:4173/kids/games/easy/${id}`, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(2500);
  const info = await p.evaluate(() => {
    const labels = [...document.querySelectorAll('[aria-label]')].slice(0, 14).map(e => e.tagName + '[' + e.getAttribute('aria-label') + ']');
    const btns = [...document.querySelectorAll('button')].slice(0, 14).map(e => (e.innerText || 'EMPTY').replace(/\n/g, '|').slice(0, 60));
    const bodyTxt = document.body.innerText.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 30);
    const draggables = document.querySelectorAll('[draggable="true"]').length;
    const slots = document.querySelectorAll('[class*="slot"]').length;
    return { labels, btns, bodyTxt, draggables, slots };
  });
  out[id] = info;
}
fs.writeFileSync('/var/folders/4f/qtbp9jr54rb_kqccmd3jhdc00000gp/T/opencode/domdump.json', JSON.stringify(out, null, 1));
await b.close();
console.log('dumped');
