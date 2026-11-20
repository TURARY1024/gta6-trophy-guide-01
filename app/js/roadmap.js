// The roadmap to the platinum: three stages, and the 35 items of the
// in-game 100% Completion checklist (A Long Road), as PowerPyx,
// Insider Gaming and Alcast list them. The checklist only appears in
// the game after the story, under Progress > Stats > 100% Completion.

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — Play the story',
    time: '60–80 hours',
    intro:
      'Finish all five chapters and pick up the side questlines as they open. Do the optional missions as they appear — they introduce robberies, fishing, hunting and the other systems the platinum needs.',
    items: [
      'Chapter trophies (Chapters 1–4) and the final-mission gold, earned automatically.',
      'Mission trophies: Gone Fishing, Breakfast Run, The Cartel Heist, Child’s Play, Headliners, VCIA Takedown, Operation Savage Glory.',
      'Side questlines as they open: Kenton (Ch. 1), Billy (Ch. 2), Andy, Randy and Tyrone (Ch. 3), Bret (Ch. 2).',
      'Chapter 1 balcony meditation for Positive Mental Attitude — the only possibly missable moment.',
      'Scan vehicles and study animals with WAiNK and the binoculars as you travel; both count toward the 100% checklist.',
    ],
  },
  {
    stage: 2,
    title: 'Stage 2 — 100% Completion',
    time: 'About 100 hours',
    intro:
      'After the credits, the 100% Completion checklist appears. It is the longest stage and the backbone of the platinum: most of the remaining trophies fall out of it. The list is forgiving — closer to 60% true completion — and nothing on it is missable.',
    items: [
      'Robberies first: 39 gang operations, 22 bank jobs, 7 payday loan jobs, 8 bank vaults.',
      'Collectibles: 15 card sets, 100 WAiNK scans, 33 underwater discoveries, 100 cocaine flamingos, 30 magazines/books/comics.',
      'Activities: 42 shooting-range golds, 42 drone time trials, 300 stunts, 70 of 80 challenges, 15 Target Decks.',
      'Discovery: 200 base-model vehicles, 50 standard weapons, 100 animals studied.',
    ],
  },
  {
    stage: 3,
    title: 'Stage 3 — Cleanup',
    time: 'About 10 hours',
    intro:
      'Whatever is left after the checklist: the stranger strands that don’t count toward 100%, the one-off stunt trophies, and the last few miscellaneous pops. Then the platinum is yours.',
    items: [
      'Strangers & Freaks: 8 counting strands (Kirk, Kyle, Yago, Pilot Pete).',
      'One-off trophies: Catch Me If You Can, Challenging Tank, Ten Pin, Capital Offense, In The Beginning…',
      'Grinds that finish last: Actions Speak Louder (500 profile actions), One Last Thing (50 challenges).',
      'Check the one unconfirmed trophy, Bad Luck, I Guess, against the newest reports before you call the run done.',
    ],
  },
];

// The 35 requirements of the 100% Completion checklist, grouped the
// way the game groups them. "Need" is what the checklist asks for;
// "of" is the total in the game where a guide has published one.
export const COMPLETION_CHECKLIST = [
  {
    group: 'Story & tasks',
    rows: [
      ['Story completion', 'Finish the story', ''],
      ['Optional tasks completed', '100', '200+ available'],
      ['Gang operations cleared', '39', '39'],
      ['Bank jobs fully completed', '22', '22'],
      ['Payday loan jobs fully completed', '7', '7'],
      ['Smash ’N’ Grabs fully completed', '34', '35'],
      ['Stick ups fully completed', '50', '91'],
      ['Narcotics fenced', '$100,000', ''],
      ['Jewelry fenced', '$100,000', ''],
      ['Marked bills fenced', '$250,000', ''],
      ['Vaults hit', '8', '8'],
      ['Vehicles fenced', '$200,000', ''],
    ],
  },
  {
    group: 'Exploration & activities',
    rows: [
      ['Kenton sets completed', '5', ''],
      ['Collectible card sets found', '15', '18'],
      ['WAiNK locations scanned', '100', '100+'],
      ['Underwater discoveries found', '33', '33'],
      ['Magazines, books & comics found', '30', ''],
      ['Meditation spots completed', '15', '18'],
      ['Cocaine flamingos destroyed', '100', '100'],
      ['Unique playlists completed', '2', ''],
      ['Discovered styles', '70', ''],
      ['Unique races won', '30', '40'],
      ['Race challenge gold medals', '10', ''],
      ['Shooting range gold medals', '42', '42'],
      ['Video games played', '4', '4'],
      ['Pool opponents defeated', '5', ''],
      ['Mini golf locations played', '2', ''],
      ['Basketball hoops', '90', ''],
      ['Drone time trials completed', '42', '42'],
      ['Stunts completed', '300', '397'],
      ['Challenges completed', '70', '80'],
      ['Bret’s Target Decks', '15', '15'],
    ],
  },
  {
    group: 'Discovery',
    rows: [
      ['Base model vehicles', '200', '277'],
      ['Standard issue weapons', '50', ''],
      ['Animals', '100', '255'],
    ],
  },
];
