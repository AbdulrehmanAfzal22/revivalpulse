# 99 Names of Allah — data & audio attribution

Text (Arabic, transliteration, meaning, description) and the per-name MP3
recitations in this directory and in `public/data/namesOfAllah.json` are
sourced from [soachishti/Asma-ul-Husna](https://github.com/soachishti/Asma-ul-Husna)
("Text, Quran References and Audio of Asma ul Husna", collected 2015),
distributed under a BSD-style license (see the repository's `README.txt`)
that permits redistribution in source and binary form with attribution.

Files are named by position (1.mp3 = Ar-Rahman ... 99.mp3 = As-Sabur), matching
`number` in `namesOfAllah.json`. The source repository's index 0 ("Allah"
itself) is intentionally excluded — this feature covers the 99 Beautiful
Names, not the greatest name.

Arabic text was decoded from the source's HTML numeric character references
into plain Unicode; no other content was altered. Self-hosted (not hotlinked)
so the feature doesn't depend on a GitHub repository never intended as a
media CDN — see prep script referenced in this project's Phase 13 history.
