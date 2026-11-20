# Leonida Platinum — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/TURARY1024/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/TURARY1024/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)

An offline, open-source guide and tracker for all **55 PlayStation 5 trophies** of
*Grand Theft Auto VI* (released 19 November 2026): 1 platinum, 2 gold, 6 silver,
46 bronze — 28 of them hidden on PlayStation, all offline, about 200 hours to
the platinum at difficulty 4/10, in a single playthrough.

## What it does

- **Checklist tracker** — every trophy with its official name, description and
  grade; tick trophies off and progress is saved in the browser (localStorage),
  with export to a JSON file and import back.
- **Search & filters** — search across names, descriptions and guides; filter by
  kind (story, side quests, activities, collectibles, exploration, robberies,
  misc, missable), by grade, and by earned / remaining.
- **Spoiler-free mode** — hides the names and descriptions of story and hidden
  trophies until you earn them.
- **Trophy detail pane** — a guide in our own words for every trophy, with steps
  where they help, and the sources each fact comes from.
- **Roadmap to the platinum** — three stages (story 60–80 h, 100% Completion
  ~100 h, cleanup ~10 h) plus the full 35-item 100% Completion checklist.
- **Missables page** — the one trophy that can pass you by (Positive Mental
  Attitude, Chapter 1 balcony meditation) and why everything else is safe.
- **Sources page** — every source the guides draw on, and how we mark
  confidence: verified, reported (single source), partly unconfirmed, and
  method unconfirmed.

## Honesty about the hidden trophies

The game is a day old and the community is still confirming the hidden
trophies. This guide says plainly where it stands:

- **48 trophies** — verified by at least two independent guides.
- **4 trophies** — reported by one guide so far (In The Beginning…, Capital
  Offense, Ten Pin, The Truth Is Out There). The method is given, labelled as
  reported, with its source.
- **2 trophies** — partly unconfirmed (Positive Mental Attitude: whether the
  Chapter 1 meditation is required; Fair Game: which animal unlocks it).
- **1 trophy** — method unconfirmed (Bad Luck, I Guess). No verified unlock
  exists yet; the guide gives the best lead and labels it as speculation.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

`app/` is plain static files — no build step, no network at run time. Open
`app/index.html` in desktop Chrome from any static server with `app/` at its
root.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22) copies `app/` and `screenshots/` to the output directory
and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts`.

## Screenshots

Four renders of the app's own code in a headless browser, seeded with a
sample of 13 earned trophies (`?demo=1`):

1. `1-checklist.jpg` — checklist with the Positive Mental Attitude guide open
2. `2-roadmap.jpg` — the roadmap to the platinum
3. `3-missables.jpg` — the missables page
4. `4-spoilers.jpg` — checklist with spoiler-free mode on

## License

MIT. Unofficial fan guide — not affiliated with Rockstar Games, Take-Two
Interactive or PlayStation. No Rockstar artwork, logos or game screenshots are
used. Trophy names, descriptions and grades are the official PlayStation list.
