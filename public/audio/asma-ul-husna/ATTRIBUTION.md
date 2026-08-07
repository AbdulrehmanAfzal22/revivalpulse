# 99 Names of Allah — data & audio attribution

Text (Arabic, transliteration, meaning, description) and the per-name MP3
recitations in this directory and in `public/data/namesOfAllah.json` are
sourced from [soachishti/Asma-ul-Husna](https://github.com/soachishti/Asma-ul-Husna)
("Text, Quran References and Audio of Asma ul Husna", collected 2015),
distributed under a BSD-style license (see the repository's `README.txt`)
that permits redistribution in source and binary form with attribution.

**Immersive feature status (Aug 2026):** the immersive recitation is wired to
the melodic nasheed `99names.mp4` (below) — the speech track section documents
the byte-exact speech alternative and its provably drift-free timestamps.

Files are named by position (1.mp3 = Ar-Rahman ... 99.mp3 = As-Sabur), matching
`number` in `namesOfAllah.json`. The source repository's index 0 ("Allah"
itself) is intentionally excluded — this feature covers the 99 Beautiful
Names, not the greatest name.

Arabic text was decoded from the source's HTML numeric character references
into plain Unicode; no other content was altered. Self-hosted (not hotlinked)
so the feature doesn't depend on a GitHub repository never intended as a
media CDN — see prep script referenced in this project's Phase 13 history.

`asma-ul-husna-full.mp3` is a byte-exact concatenation of the 99 per-name
files above (in position order 1.mp3..99.mp3), with each file's leading
ID3v2 tag stripped so the result is one contiguous MPEG-1 Layer III CBR
stream (96 kbps, 44.1 kHz, 303.054s / ~5.05 minutes). It is derived from the
same BSD-style licensed source and carries the same attribution.
`namesTimestamps.json` contains each name's start time in seconds, computed as
cumulative bytes of the stripped stream divided by the CBR byte rate — 96 000
bits/s = **12 000 bytes/second** — so timestamps always match the file exactly
(frame-accurate: every MP3 frame is 417 bytes; the decoder's `currentTime`
steps through those same frames, so the derived timestamps cannot drift).
Regenerate with `npm run timestamps:speech`
(`scripts/generateSpeechTrackTimestamps.mjs`, which also self-verifies the
on-disk file is byte-equal to the recomputed concatenation).

This speech track was briefly the active immersive audio (Aug 2026) but the
feature is currently wired back to the melodic nasheed below
(`ACTIVE_RECITER.style: 'nasheed'`).

## Melodic full recitation (`99names.mp4`)

`99names.mp4` is the melodic nasheed rendition that previously served as the
immersive audio (`ACTIVE_RECITER.style: 'nasheed'`). It was sourced per the
project owner's Phase 1 decision from a developer-facing licensed Islamic
audio library. The owner MUST attach the vendor's written commercial-use
confirmation here, along with the track title, performer, and library name,
before any CDN/production deployment. The file's 17-second instrumental
opening was hidden from the user by the normalized timeline
(`src/features/immersiveRecitation/utils/timeline.ts`); the nasheed has no
machine-readable per-name timing, so if it is ever re-wired as the active
track, `namesTimestamps.json` must be re-measured against it (real seconds)
— first name ≥ 17 s, strictly ascending, last name before the end of the
169.018-second track (via the `/dev/timestamp-editor` tool).

## Why this is possible (seekability of the speech track)

The speech track has no ID3v2/Xing front matter, and the previous nasheed
troubleshooting proved Chromium collapses `seekable` to `[0..0]` for AAC-in-
MP4 and for MP3 with ID3/Xing front matter, while headerless CBR MP3 streams
as `duration = Infinity`, `seekable = [0..Infinity]` and honors `currentTime`
writes immediately. The engine handles `Infinity` duration through
`ReciterConfig.durationSeconds`. The 99names.* files are retained (nasheed
master + its playable encode) — repoint `ACTIVE_RECITER.audioUrl` if the
nasheed is ever preferred again.
