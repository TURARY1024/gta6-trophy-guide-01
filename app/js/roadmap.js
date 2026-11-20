// The roadmap to the platinum: three stages, the full 35-item 100% Completion
// checklist (PowerPyx's list, confirmed by The Gamers Hub), the missables page
// and the sources page. The checklist lines are checkable and saved in the
// browser, like the trophies.
import { SOURCES } from './data.js';

export const ROADMAP_STAGES = [
  {
    title: 'Stage 1 — Story, 60–80 hours',
    intro: 'Play the story and pick up what you pass. Do the Chapter 1 balcony meditation (see Missables) and scan vehicles and animals as you go — progress already counts toward 100% even though the checklist only appears after the credits.',
    bullets: [
      'Finish all 5 chapters and the final mission — 13 story trophies unlock on the way.',
      'After Chapter 2: Coffee Break, you can play as Jason and Lucia together; call your partner with Right + Triangle for the partner trophies.',
      'Do optional missions as they appear (black icons with pink letters); you need any 100 for the 100% checklist and there are far more than 100.',
      'Scan new vehicles with the WAiNK app (hold Up, then R1) and study animals through the binoculars — 200 of 277 vehicles and 100 of 255 animals count toward 100%.',
      'Keep a manual save at the start and end of each chapter: there is no mission replay, and 15 manual save slots are available.',
    ],
  },
  {
    title: 'Stage 2 — 100% Completion, about 100 hours',
    intro: 'After the credits, open Progress > Stats > 100% Completion. The list is lenient — closer to 60% true completion — and nothing on it is missable. Do the lines that need everything first, then the long collecting lines.',
    bullets: [
      'Robberies first: all 39 Gang Operations, 22 Bank Jobs, 7 Payday Loan Jobs and 8 vaults — these allow no skips.',
      'Then the full-requirement lines: 33 Underwater Discoveries, 42 Shooting Range gold medals, 42 Drone Time Trials, 15 Bret Target Decks, 4 video games, 2 playlists.',
      'Then the partial lines: 15 of 18 card sets, 100 WAiNK locations, 100 of 125 flamingos, 300 of 397 stunts, 70 of 80 challenges.',
      'Finish Discovery last: 200 scanned vehicles, 50 of 66 weapons held, 100 studied animals.',
    ],
  },
  {
    title: 'Stage 3 — Cleanup, about 10 hours',
    intro: 'With 100% done, most trophies are already unlocked. Clean up the Strangers & Freaks strands (they are not needed for 100%), the remaining challenges, and any misc trophies left.',
    bullets: [
      'Complete 8 Strangers & Freaks strands — Kirk, Kyle, Yago and Pilot Pete count, among others.',
      'Finish the 5 stranger questlines (Andy, Kenton, Billy, Randy, Tyrone) and Bret’s hunting quests if any are left.',
      'Pick the easiest remaining challenges until 50 are done (70 for 100% should already be done).',
      'Check the checklist: any trophy still locked is listed there with its guide.',
    ],
  },
];

// The 35 lines of the in-game 100% Completion checklist, in its three groups.
// "need" is what the checklist asks for; "of" is the total where the game tracks one.
export const CHECKLIST_100 = [
  { group: 'Story & Tasks', text: 'Story completion', need: 'Finish the story' },
  { group: 'Story & Tasks', text: 'Optional tasks completed', need: '100' },
  { group: 'Story & Tasks', text: 'Gang Operations cleared', need: '39 of 39' },
  { group: 'Story & Tasks', text: 'Bank Jobs fully completed', need: '22 of 22' },
  { group: 'Story & Tasks', text: 'Payday Loan Jobs fully completed', need: '7 of 7' },
  { group: 'Story & Tasks', text: 'Smash ’N’ Grabs fully completed', need: '34 of 35' },
  { group: 'Story & Tasks', text: 'Stick Ups fully completed', need: '50 of 91' },
  { group: 'Story & Tasks', text: 'Narcotics fenced', need: '$100,000' },
  { group: 'Story & Tasks', text: 'Jewelry fenced', need: '$100,000' },
  { group: 'Story & Tasks', text: 'Marked Bills fenced', need: '$250,000' },
  { group: 'Story & Tasks', text: 'Vaults hit', need: '8 of 8' },
  { group: 'Story & Tasks', text: 'Vehicles fenced', need: '$200,000' },
  { group: 'Exploration & Activities', text: 'Kenton sets completed', need: '5 of 7' },
  { group: 'Exploration & Activities', text: 'Collectible Card Sets found', need: '15 of 18' },
  { group: 'Exploration & Activities', text: 'WAiNK locations scanned', need: '100' },
  { group: 'Exploration & Activities', text: 'Underwater Discoveries found', need: '33 of 33' },
  { group: 'Exploration & Activities', text: 'Magazines, Books & Comics found', need: '30 of 34' },
  { group: 'Exploration & Activities', text: 'Meditation Spots completed', need: '15 of 18' },
  { group: 'Exploration & Activities', text: 'Cocaine Flamingos destroyed', need: '100 of 125' },
  { group: 'Exploration & Activities', text: 'Unique Playlists completed', need: '2 of 2' },
  { group: 'Exploration & Activities', text: 'Discovered Styles', need: '70 of 79' },
  { group: 'Exploration & Activities', text: 'Unique Races won', need: '30 of 40' },
  { group: 'Exploration & Activities', text: 'Race Challenge gold medals', need: '10 of 13' },
  { group: 'Exploration & Activities', text: 'Shooting Range gold medals', need: '42 of 42' },
  { group: 'Exploration & Activities', text: 'Video Games played', need: '4 of 4' },
  { group: 'Exploration & Activities', text: 'Pool opponents defeated', need: '5 of 7' },
  { group: 'Exploration & Activities', text: 'Mini Golf locations played', need: '2 of 3' },
  { group: 'Exploration & Activities', text: 'Basketball hoops', need: '90 of 100' },
  { group: 'Exploration & Activities', text: 'Drone Time Trials completed', need: '42 of 42' },
  { group: 'Exploration & Activities', text: 'Stunts completed', need: '300 of 397' },
  { group: 'Exploration & Activities', text: 'Challenges completed', need: '70 of 80' },
  { group: 'Exploration & Activities', text: 'Bret’s Target Decks', need: '15 of 15' },
  { group: 'Discovery', text: 'Base Model Vehicles scanned', need: '200 of 277' },
  { group: 'Discovery', text: 'Standard Issue Weapons found', need: '50 of 66' },
  { group: 'Discovery', text: 'Animals studied', need: '100 of 255' },
];

export function renderRoadmap(container, checklist, onToggle) {
  container.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const card = document.createElement('div');
    card.className = 'stage';
    const title = document.createElement('h2');
    title.textContent = stage.title;
    card.append(title);
    const intro = document.createElement('p');
    intro.textContent = stage.intro;
    card.append(intro);
    const list = document.createElement('ul');
    for (const bullet of stage.bullets) {
      const item = document.createElement('li');
      item.textContent = bullet;
      list.append(item);
    }
    card.append(list);
    container.append(card);
  }

  const head = document.createElement('h2');
  head.textContent = '100% Completion checklist — 35 lines';
  container.append(head);
  const note = document.createElement('p');
  note.textContent = 'Unlocks after the story under Progress > Stats > 100% Completion. Nothing on it is missable. Tick lines off as you finish them — your ticks are saved in this browser.';
  container.append(note);

  const table = document.createElement('table');
  table.className = 'checklist-100';
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  for (const label of ['Done', 'Requirement', 'Needed']) {
    const th = document.createElement('th');
    th.textContent = label;
    headerRow.append(th);
  }
  thead.append(headerRow);
  table.append(thead);
  const tbody = document.createElement('tbody');
  let group = null;
  CHECKLIST_100.forEach((item, index) => {
    if (item.group !== group) {
      group = item.group;
      const groupRow = document.createElement('tr');
      groupRow.className = 'group-head';
      const cell = document.createElement('td');
      cell.colSpan = 3;
      cell.textContent = group;
      groupRow.append(cell);
      tbody.append(groupRow);
    }
    const row = document.createElement('tr');
    if (checklist.has(index)) row.className = 'done';
    const boxCell = document.createElement('td');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = checklist.has(index);
    box.setAttribute('aria-label', `Mark ${item.text} as done`);
    box.addEventListener('change', () => onToggle(index, box.checked));
    boxCell.append(box);
    const textCell = document.createElement('td');
    textCell.textContent = item.text;
    const needCell = document.createElement('td');
    needCell.textContent = item.need;
    row.append(boxCell, textCell, needCell);
    tbody.append(row);
  });
  table.append(tbody);
  container.append(table);
}

export function renderMissables(container) {
  container.replaceChildren();
  const note = document.createElement('div');
  note.className = 'note';
  const noteText = document.createElement('p');
  noteText.textContent = 'Only one trophy can pass you by. Everything else is still available after the story in free-roam — including every stranger questline, which returns after any temporary unavailability.';
  note.append(noteText);
  container.append(note);

  const card = document.createElement('div');
  card.className = 'stage';
  const title = document.createElement('h2');
  title.textContent = 'Positive Mental Attitude — possibly missable';
  card.append(title);
  const body = document.createElement('p');
  body.textContent = 'Meditate at every spot across Leonida: 18 meditation spots at 10 locations. Meditating with both Jason and Lucia at the same spot counts twice. Track progress under Progress > Collections > Exploration > Meditations.';
  card.append(body);
  const list = document.createElement('ol');
  const steps = [
    'During Chapter 1, after the main mission Down to Earth, talk to Lucia in the kitchen at Jason’s house in the morning.',
    'She says she is going to meditate and walks to the balcony. Follow her and choose “Accept” when prompted.',
    'She shows you how to meditate. This raises the meditation counter by 1 — do it before Chapter 1 ends.',
    'After Chapter 2: Coffee Break you can play as both characters; meditate at the remaining 18 spots with each of them.',
  ];
  for (const step of steps) {
    const item = document.createElement('li');
    item.textContent = step;
    list.append(item);
  }
  card.append(list);
  const warn = document.createElement('p');
  warn.className = 'conf-note';
  warn.textContent = 'Partly unconfirmed: the Chapter 1 balcony meditation raises the counter but is not marked as a “Meditation Spot” like the rest, so it is still unclear whether it is required for the trophy. PowerPyx earned the trophy after doing it; do it anyway — it costs a minute and can never be repeated. Sources: PowerPyx, KeenGamer.';
  card.append(warn);
  container.append(card);

  const safe = document.createElement('div');
  safe.className = 'stage';
  const safeTitle = document.createElement('h2');
  safeTitle.textContent = 'Why nothing else is missable';
  safe.append(safeTitle);
  const safeList = document.createElement('ul');
  const safeItems = [
    'Story trophies unlock automatically as you finish chapters and missions.',
    'Stranger quest-givers (Andy, Kenton, Billy, Randy, Tyrone, Bret) can be temporarily unavailable during the story, but all of them return and their quests stay available after the story.',
    'Optional missions that disappear after a while do not matter for trophies: far more than the 100 needed exist.',
    'Fences that disappear are replaced by new ones; magazine collectibles in story buildings also spawn elsewhere.',
    'Cheats disable trophies and saving — do not use them on a trophy run. (PowerPyx)',
  ];
  for (const item of safeItems) {
    const li = document.createElement('li');
    li.textContent = item;
    safeList.append(li);
  }
  safe.append(safeList);
  container.append(safe);
}

export function renderSources(container) {
  container.replaceChildren();
  const intro = document.createElement('p');
  intro.textContent = 'Every guide in this tracker names its sources beside the trophy. The list below is everything the guides draw on. Official names, descriptions and grades come from the PlayStation trophy list as published by Exophase and PSNProfiles.';
  container.append(intro);

  const list = document.createElement('ul');
  list.className = 'sources-list';
  for (const key of Object.keys(SOURCES)) {
    const source = SOURCES[key];
    const item = document.createElement('li');
    if (source.url) {
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = source.label;
      item.append(link);
    } else {
      item.textContent = source.label;
    }
    list.append(item);
  }
  container.append(list);

  const legend = document.createElement('div');
  legend.className = 'stage';
  const legendTitle = document.createElement('h2');
  legendTitle.textContent = 'How confidence is marked';
  legend.append(legendTitle);
  const legendList = document.createElement('ul');
  const legendItems = [
    'Verified — at least two independent guides agree on the method.',
    'Reported — one guide so far (PowerPyx) has published the method.',
    'Partly unconfirmed — the method is partly known, but one detail (which animal, whether one meditation counts) is still open.',
    'Method unconfirmed — no verified unlock exists yet; the guide gives the best lead and says so.',
  ];
  for (const item of legendItems) {
    const li = document.createElement('li');
    li.textContent = item;
    legendList.append(li);
  }
  legend.append(legendList);
  container.append(legend);

  const honesty = document.createElement('div');
  honesty.className = 'note';
  const honestyText = document.createElement('p');
  honestyText.textContent = 'The game released 19 November 2026 — a day before this guide was written. Where the community is still confirming a trophy, this guide says so instead of guessing. Check the sources above for the newest reports.';
  honesty.append(honestyText);
  container.append(honesty);
}
