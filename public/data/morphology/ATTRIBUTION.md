# Morphology data attribution

Per-word root, lemma, part of speech, and grammar data in this directory is
derived from the **Quranic Arabic Corpus** (Kais Dukes, corpus.quran.com),
via the [mustafa0x/quran-morphology](https://github.com/mustafa0x/quran-morphology)
fork (v0.4 base, with fixes). The source repository does not declare a
license; the corpus itself is published for free non-commercial research and
educational use. Attribute the Quranic Arabic Corpus if redistributing.

Generated (not hand-authored) by a build script that parses the corpus's
tab-delimited segment format and aggregates it to one entry per Quran.com
word position — see `scripts/` in this project's history for the generator.
Not bundled into the app's JS — fetched on demand per surah, the same way
translations are.
