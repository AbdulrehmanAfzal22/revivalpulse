# -*- coding: utf-8 -*-
"""Deterministic bilingual merge for KidsStoryV2 story files.

Next-session workflow (Urdu pass):
 1. Author translations in the session as SHORT ur strings only.
 2. Build JSON inputs:
      scripts/kidsbilingual/ur_PARAS_<story>.json  -> [{"en": <exact english>, "ur": <urdu>}]
      scripts/kidsbilingual/ur_LABELS_<story>.json -> [{"ref": <exact reference>, "en": <label en>, "ur": <label ur>}]
 3. Run:  node scripts/kidsbilingual/verifyUrdu.cjs <file>
          python scripts/kidsbilingual/merge_ur.py <story>   (story like "adam")
    Merge NEVER alters English/reference values; it only inserts ur and label.
 4. Confirm with: npx tsc --noEmit  +  CI=true npx react-scripts test src/data/kids/storyValidation.test.ts

The script verifies every en/ref it was given matches exactly once; any miss
aborts with the offending strings so you can fix the JSON before merging.
"""
import json, re, os, sys

TMP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ur_jsons")
BASE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    "src", "data", "kids")


def load(story, kind):
    with open(os.path.join(TMP, "ur_%s_%s.json" % (kind, story)), encoding="utf-8") as f:
        return json.load(f)


def merge(path, paras, labels):
    lines = open(path, encoding="utf-8").read().split("\n")
    ur_by_en = {p["en"]: p["ur"] for p in paras}
    lbl_by_ref = {l["ref"]: l for l in labels}
    used_en, used_ref = set(), set()
    out = []
    for line in lines:
        mref = re.search(r'reference:\s*"([^"]*)"', line)
        if mref and line.lstrip().startswith("{") and "label:" not in line:
            ref = mref.group(1)
            if ref not in lbl_by_ref:
                raise SystemExit("UNKNOWN ref %r on line:\n  %s" % (ref, line))
            lbl = lbl_by_ref[ref]
            line = re.sub(r'\}\s*[,\;]?\s*$',
                          ', label: { en: "%s", ur: "%s" } },' % (lbl["en"], lbl["ur"]), line)
            used_ref.add(ref)
        else:
            men = re.search(r'en:\s*"((?:[^"\\]|\\.)*)"', line)
            if men:
                val = men.group(1).replace('\\"', '"')
                if val in ur_by_en and val not in used_en:
                    used_en.add(val)
                    tail = line[men.end():]
                    if re.match(r'\s*,\s*$', tail) or tail.strip() == "":
                        indent = line[: len(line) - len(line.lstrip())]
                        line = line + "\n" + indent + '          ur: "' + ur_by_en[val] + '",'
                    else:
                        line = line[:men.end()] + ', ur: "' + ur_by_en[val] + '"' + tail
        out.append(line)
    miss_en = set(ur_by_en) - used_en
    miss_ref = set(lbl_by_ref) - used_ref
    if miss_en or miss_ref:
        raise SystemExit(
            "MISSING story=%s en=%d ref=%d\n  en_examples=%s\n  ref_examples=%s\n  (fix ur_jsons and re-run)" %
            (os.path.basename(path), len(miss_en), len(miss_ref),
             [x[:70] for x in list(miss_en)[:3]], list(miss_ref)[:3]))
    open(path, "w", encoding="utf-8").write("\n".join(out))
    print("OK  story=%s paras=%d labels=%d" % (os.path.basename(path), len(used_en), len(used_ref)))


def main():
    story = sys.argv[1]
    if story == "adam":
        path = os.path.join(BASE, "storiesV2", "adam.ts")
    else:
        if os.path.exists(os.path.join(BASE, "sahabiV2", story + ".ts")):
            path = os.path.join(BASE, "sahabiV2", story + ".ts")
        elif os.path.exists(os.path.join(BASE, "sahabiV2", story + ".tsx")):
            path = os.path.join(BASE, "sahabiV2", story + ".tsx")
        else:
            raise SystemExit("story not found: %s" % story)
    paras = load(story, "PARAS")
    labels = load(story, "LABELS")
    merge(path, paras, labels)


if __name__ == "__main__":
    main()