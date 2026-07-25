# Kids alphabet audio attribution

Per-letter pronunciation clips are sourced from
[awahids/belajar-ngaji](https://github.com/awahids/belajar-ngaji) ("simple
website for learning basic Quran from Hijaiyah with audio and animations"),
MIT licensed. Self-hosted here (not hotlinked) for the same reason as the
99 Names audio — a GitHub repo isn't a media CDN.

Letter Arabic script, standard order, and English transliteration in
`public/data/kidsAlphabet.json` are the fixed 28-letter Arabic alphabet plus
hamza — basic linguistic fact, not sourced content. The source repo's
filenames use Indonesian/Malay spelling conventions (e.g. `tsa.mp3` for ث,
`kho.mp3` for خ, `dhzo.mp3` for ظ); the mapping from those filenames to the
standard letters is in the Phase 14 build script referenced in this
project's history, not guessed at runtime.
