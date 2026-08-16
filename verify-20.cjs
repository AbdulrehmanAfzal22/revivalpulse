const puppeteer = require('puppeteer-core');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://127.0.0.1:4173';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const GAMES = [
  'matching', 'memory', 'balloon-pop', 'halal-haram', 'good-manners',
  'spot-same', 'letter-hunt', 'order-line', 'wudu-order', 'build-word',
  'names-meaning', 'count-stars', 'true-false', 'prophet-timeline',
  'cause-effect', 'letter-count', 'dua-moment', 'story-quiz',
  'letter-sound', 'word-finder',
];

const NAV_LABELS = /back to games|go home|home|restart|play again|back|more|next chapter|skip/i;

function makeProfile() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'kids-real-browser-'));
}

async function launchBrowser(profileDir) {
  return puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    args: [
      '--user-data-dir=' + profileDir,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--window-size=1400,950',
    ],
  });
}

(async () => {
  let profileDir = makeProfile();
  let browser = await launchBrowser(profileDir);
  console.log('Browser launched (real, visible, fresh profile). PID: ' + browser.process()?.pid);
  console.log('>>> IMPORTANT: keep the Chrome window open until the sweep finishes. <<<');

  const results = [];
  let restartCount = 0;

  for (const game of GAMES) {
    if (results.some(r => r.game === game)) continue;
    let page;
    try {
      if (!browser.connected) throw new Error('browser disconnected');
      page = await browser.newPage();
      const logs = [];
      page.on('console', (msg) => { const t = msg.type(); if (t === 'error' || t === 'warning') logs.push(`[${t}] ${msg.text()}`); });
      page.on('pageerror', (err) => logs.push(`[pageerror] ${err.message}`));

      const url = `${BASE}/kids/games/easy/${game}`;
      let loadOk = false, errorScreen = false, noGameFound = false;
      let lastText = '';
      try {
        const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await sleep(1800);
        lastText = await page.evaluate(() => document.body.innerText).catch(() => '');
        loadOk = resp.status() === 200;
        errorScreen = /try again/i.test(lastText);
        noGameFound = /game not found|gameNotFound/i.test(lastText);
      } catch (e) {
        logs.push('[nav] ' + e.message);
      }

      let advanced = false;
      let probeDetail = '';
      if (loadOk && !errorScreen && !noGameFound) {
        const before = lastText.length;
        for (let i = 0; i < 12; i++) {
          let clicked = 'eval-failed';
          try {
            clicked = await page.evaluate((navRe) => {
              const els = Array.from(document.querySelectorAll('button, [role="button"], .card, .itemCard, .hotspot, [draggable="true"], [data-step]'));
              const visible = els.filter(e => {
                if (e.offsetParent === null) return false;
                const l = (e.innerText || e.getAttribute('aria-label') || '').trim();
                if (navRe.test(l)) return false;
                if (e.closest('a')) return false;
                return true;
              });
              if (!visible.length) return 'none-found';
              const el = visible[Math.floor(Math.random() * visible.length)];
              const tag = el.tagName.toLowerCase();
              const label = (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 25) || el.className || '';
              try {
                el.click();
              } catch {
                el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
              }
              return `${tag}:${label}`;
            }, NAV_LABELS);
          } catch { clicked = 'eval-failed'; }
          await sleep(900);
          let after = -1;
          try { after = await page.evaluate(() => document.body.innerText.length); } catch { after = -1; }
          if (after !== -1 && after !== before) { advanced = true; probeDetail = clicked + ' (state changed)'; break; }
          if (clicked === 'none-found') { probeDetail = probeDetail || clicked; break; }
          if (clicked === 'eval-failed') { probeDetail = probeDetail || clicked + ' (context lost)'; break; }
        }
        if (!advanced) probeDetail = probeDetail || 'clicks did not change page';
      }

      const roundInfo = await page.evaluate(() => {
        const m = document.body.innerText.match(/Round (\d+) of (\d+)/);
        return m ? `${m[1]}/${m[2]}` : '';
      }).catch(() => '');

      results.push({ game, loadOk, errorScreen, noGameFound, advanced, roundInfo, probeDetail, logs });
    } catch (e) {
      console.log(`[${game}] RUNNER ERROR: ${e.message} (will retry)`);
      try { if (page) await page.close(); } catch {}
      try { await browser.close(); } catch {}
      restartCount++;
      if (restartCount > 3) { console.log('Too many browser restarts, aborting.'); break; }
      profileDir = makeProfile();
      await sleep(1500);
      browser = await launchBrowser(profileDir);
      console.log('Browser relaunched. PID: ' + browser.process()?.pid);
      const index = GAMES.indexOf(game);
      if (index >= 0) {
        for (const earlier of GAMES.slice(0, index)) {
          if (!results.some(r => r.game === earlier)) results.push({ game: earlier, loadOk: false, errorScreen: false, noGameFound: false, advanced: false, roundInfo: '', probeDetail: 'SKIPPED (browser restart)', logs: [] });
        }
      }
    }
  }

  console.log('\n==================== PHASE 1 RESULTS (real browser, fresh profile, :4173) ====================\n');
  let failCount = 0;
  for (const r of results) {
    const verdict = r.errorScreen ? 'ERROR-SCREEN' : !r.loadOk ? 'LOAD-FAIL' : r.noGameFound ? 'NOT-FOUND' : r.advanced ? 'PLAYS' : 'RENDERS-BUT-STUCK';
    if (verdict !== 'PLAYS') failCount++;
    console.log(`[${verdict.padEnd(20)}] ${r.game.padEnd(16)} round=${(r.roundInfo || '-').padEnd(6)} ${r.probeDetail ? '| probe: ' + r.probeDetail : ''}`);
    if (r.logs.length) console.log(`        LOGS: ${r.logs.join(' ;; ')}`);
  }
  console.log(`\nSummary: ${results.length - failCount}/${results.length} fully playable, ${failCount} not fully playable`);
  await browser.close().catch(() => {});
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
