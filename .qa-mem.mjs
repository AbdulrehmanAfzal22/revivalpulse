import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE:', m.text().slice(0, 150)); });
p.on('pageerror', e2 => console.log('PAGEERROR:', String(e2).slice(0, 150)));
p.on('crash', () => console.log('PAGE CRASHED'));
p.on('close', () => console.log('PAGE CLOSED'));
b.on('disconnected', () => console.log('BROWSER DISCONNECTED'));
for (let i = 0; i < 3; i++) {
  await p.goto('http://localhost:4173/kids/games/easy/memory', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => console.log('goto err', String(e).slice(0, 80)));
  await p.waitForTimeout(2500);
  console.log('loaded, url', p.url());
  const hiddenSel = '[aria-label^="Hidden card"]';
  for (let r = 0; r < 6; r++) {
    const hc = await p.locator(hiddenSel).count();
    if (!hc) { console.log('no hidden cards'); break; }
    const pre = hc;
    await p.locator(hiddenSel).first().click({ timeout: 4000 }).catch(e => console.log('clickA err', String(e).slice(0, 60)));
    await p.waitForTimeout(350);
    const labels = await p.$$eval('[aria-label]', els => els.map(e => e.getAttribute('aria-label')).filter(a => a && !a.startsWith('Hidden'))).catch(() => []);
    console.log(` round${r} pre=${pre} now=${await p.locator(hiddenSel).count()} labels=${labels.join(',')}`);
    await p.locator(hiddenSel).first().click({ timeout: 4000 }).catch(e => console.log('clickB err', String(e).slice(0, 60)));
    await p.waitForTimeout(1100);
    console.log(`   after B: hidden=${await p.locator(hiddenSel).count()}`);
    if ((await p.getByText('You did it!').count()) > 0) { console.log('WIN'); break; }
  }
}
await b.close();
