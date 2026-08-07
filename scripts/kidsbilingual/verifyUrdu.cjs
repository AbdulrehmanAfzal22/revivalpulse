const fs = require("fs");
const path = process.argv[2];
if (!path) { console.error("usage: node verifyUrdu.js <file>"); process.exit(2); }
const t = fs.readFileSync(path, "utf8");

// Extract all ur: "..." string literals conservatively (handles escaped quotes).
const matches = [...t.matchAll(/ur:\s*"((?:[^"\\]|\\.)*)"/g)];
let issues = 0;
const hasUrdu = (s) => /[\u0600-\u06FF]/.test(s);

if (matches.length === 0) {
  console.log("NO ur fields found");
} else {
  for (const m of matches) {
    const s = m[1];
    // strip escapes for analysis
    const val = s.replace(/\\(["\\])/g, "$1");
    let why = [];
    if (!val.trim()) why.push("EMPTY");
    if (!hasUrdu(val)) why.push("NO-BIDI-PRESENT");
    // Latin run > 8 chars that is not transliteration-like is suspicious
    const latinRuns = val.match(/[A-Za-z]{5,}/g) || [];
    if (latinRuns.some((r) => !/^\s*khai|allah/i.test(r) && !/qur'an/i.test(r))) {
      why.push("LATIN-RUN=" + latinRuns.join(","));
    }
    if (0xdc00 > 0) {} // noop
    if (why.length) {
      issues.push({ len: val.length, why, snippet: val.slice(0, 120) });
    }
  }
  console.log(`checked ${matches.length} ur fields`);
  if (issues.length) {
    console.log("ISSUES:");
    issues.slice(0, 40).forEach((i) => console.log(`  len=${i.len} ${i.why.join(" | ")} :: "${i.snippet}"`));
    process.exitCode = 2;
  } else {
    console.log("all ur fields look clean");
  }
}

// count en/label presence
const en = (t.match(/en:\s*"/g) || []).length;
const ur = (t.match(/ur:\s*"/g) || []).length;
const refs = (t.match(/reference:\s*"/g) || []).length;
const labels = (t.match(/label:\s*\{/g) || []).length;
console.log(`en=${en} ur=${ur} reference=${refs} label=${labels}`);
if (ur > 0 && ur !== en) console.log("!! ur count does not match en count");