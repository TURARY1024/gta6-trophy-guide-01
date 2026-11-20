// Views: everything the reader sees. The checklist with its detail
// pane, and the roadmap, missables and sources pages. All rendering
// is plain DOM built from the trophy data — no templates, no network.

import { GRADE_LABELS, KIND_LABELS, STATUS_LABELS } from './data.js';
import { KIND_FILTERS, filterTrophies, isMasked, countByGrade } from './filters.js';
import { ROADMAP_STAGES, COMPLETION_CHECKLIST } from './roadmap.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function gradeMedal(trophy) {
  const medal = el('span', `medal ${trophy.grade}`, trophy.grade[0].toUpperCase());
  medal.title = GRADE_LABELS[trophy.grade];
  medal.setAttribute('aria-label', GRADE_LABELS[trophy.grade]);
  return medal;
}

function statusTag(trophy) {
  if (trophy.status === 'verified') return null;
  const tag = el('span', `tag status-${trophy.status}`, STATUS_LABELS[trophy.status]);
  return tag;
}

function trophyTags(trophy) {
  const wrap = el('span', 'trophy-tags');
  wrap.appendChild(el('span', 'tag', KIND_LABELS[trophy.kind] || trophy.kind));
  if (trophy.missable) wrap.appendChild(el('span', 'tag missable', 'Missable'));
  if (trophy.hidden) wrap.appendChild(el('span', 'tag hidden-t', 'Hidden'));
  const status = statusTag(trophy);
  if (status) wrap.appendChild(status);
  if (trophy.target && trophy.targetLabel) {
    wrap.appendChild(el('span', 'tag', `Target: ${trophy.targetLabel}`));
  }
  return wrap;
}

/** One checklist row: checkbox, medal, name, description, tags. */
export function trophyRow(trophy, state, handlers) {
  const earned = state.earned.has(trophy.id);
  const masked = isMasked(trophy, state.earned, state.spoilersOn);
  const row = el('li');
  const button = el('button', `trophy-row${earned ? ' earned' : ''}${state.selectedId === trophy.id ? ' selected' : ''}`);
  button.type = 'button';
  button.setAttribute('aria-label', masked ? 'Hidden trophy' : `${trophy.name}, ${GRADE_LABELS[trophy.grade]}`);
  button.addEventListener('click', (event) => {
    if (event.target.closest('.check')) return;
    handlers.select(trophy.id);
  });

  const check = el('button', 'check', earned ? '✓' : '');
  check.type = 'button';
  check.setAttribute('aria-label', earned ? `Mark ${trophy.name} as not earned` : `Mark ${trophy.name} as earned`);
  check.setAttribute('aria-pressed', earned ? 'true' : 'false');
  check.addEventListener('click', (event) => {
    event.stopPropagation();
    handlers.toggle(trophy.id);
  });
  button.appendChild(check);
  button.appendChild(gradeMedal(trophy));

  const main = el('span', 'trophy-main');
  main.appendChild(el('span', 'trophy-name', masked ? 'Hidden trophy — earn it to reveal' : trophy.name));
  main.appendChild(el('span', 'trophy-desc', masked ? 'This trophy is hidden on PlayStation until earned.' : trophy.description));
  main.appendChild(trophyTags(trophy));
  button.appendChild(main);
  row.appendChild(button);
  return row;
}

/** The detail pane beside the checklist: guide, steps, sources. */
export function trophyDetail(trophy, state, handlers) {
  const pane = el('aside', 'detail');
  if (!trophy) {
    pane.classList.add('detail-empty');
    pane.appendChild(el('h2', null, 'Pick a trophy'));
    pane.appendChild(el('p', null, 'Select any trophy in the checklist to see its full guide, its sources and whether it can be missed. Tick the box on a row — or the button below — when you have earned it.'));
    return pane;
  }
  const earned = state.earned.has(trophy.id);
  const masked = isMasked(trophy, state.earned, state.spoilersOn);

  pane.appendChild(el('h2', null, masked ? 'Hidden trophy' : trophy.name));
  pane.appendChild(el('p', 'official-desc', masked ? 'Hidden on PlayStation until earned.' : trophy.description));
  const meta = el('p', 'meta-line');
  meta.innerHTML = '';
  meta.appendChild(document.createTextNode(GRADE_LABELS[trophy.grade]));
  if (KIND_LABELS[trophy.kind] && KIND_LABELS[trophy.kind] !== GRADE_LABELS[trophy.grade]) {
    meta.appendChild(document.createTextNode(` · ${KIND_LABELS[trophy.kind]}`));
  }
  if (trophy.chapter) meta.appendChild(document.createTextNode(` · ${trophy.chapter}`));
  if (trophy.hidden) meta.appendChild(document.createTextNode(' · Hidden on PSN'));
  pane.appendChild(meta);

  if (trophy.missable) {
    const warn = el('div', 'callout danger');
    warn.appendChild(el('strong', null, 'Potentially missable. '));
    warn.appendChild(document.createTextNode('See the Missables page before you leave Chapter 1 — there is no mission replay.'));
    pane.appendChild(warn);
  }
  if (trophy.status === 'unconfirmed') {
    const note = el('div', 'callout danger');
    note.appendChild(el('strong', null, 'Method unconfirmed. '));
    note.appendChild(document.createTextNode('No guide has verified how to unlock this trophy yet. The guide below gives the best lead and labels it as speculation — don’t plan around it.'));
    pane.appendChild(note);
  } else if (trophy.status === 'reported') {
    const note = el('div', 'callout');
    note.appendChild(el('strong', null, 'Reported, not yet confirmed. '));
    note.appendChild(document.createTextNode('One guide has published this method; no second guide has confirmed it yet.'));
    pane.appendChild(note);
  } else if (trophy.status === 'partial') {
    const note = el('div', 'callout info');
    note.appendChild(el('strong', null, 'Partly unconfirmed. '));
    note.appendChild(document.createTextNode('The broad method is confirmed, but one detail is still being checked — the guide says which.'));
    pane.appendChild(note);
  }

  if (masked) {
    pane.appendChild(el('p', null, 'Turn the spoiler setting off, or earn this trophy, to read its guide.'));
  } else {
    pane.appendChild(el('h3', null, 'How to unlock it'));
    pane.appendChild(el('p', 'guide-body', trophy.guide || ''));
    if (trophy.steps && trophy.steps.length) {
      const list = el('ol');
      for (const step of trophy.steps) list.appendChild(el('li', null, step));
      pane.appendChild(list);
    }
    if (trophy.sources && trophy.sources.length) {
      pane.appendChild(el('h3', null, 'Sources'));
      const list = el('ul', 'source-list');
      for (const source of trophy.sources) {
        const item = el('li');
        const link = el('a', null, source.label);
        link.href = source.url;
        link.target = '_blank';
        link.rel = 'noopener';
        item.appendChild(link);
        list.appendChild(item);
      }
      pane.appendChild(list);
    }
  }

  const actions = el('div', 'detail-actions');
  const toggle = el('button', `btn ${earned ? '' : 'primary'}`, earned ? '✓ Earned — mark as not earned' : 'Mark as earned');
  toggle.type = 'button';
  toggle.addEventListener('click', () => handlers.toggle(trophy.id));
  actions.appendChild(toggle);
  pane.appendChild(actions);
  return pane;
}

/** The checklist view: toolbar plus the trophy list and detail pane. */
export function checklistView(trophies, state, handlers) {
  const root = el('div', 'page checklist-page');

  const toolbar = el('div', 'toolbar');
  const search = el('input', 'search');
  search.type = 'search';
  search.placeholder = 'Search trophies, guides, missions…';
  search.value = state.query || '';
  search.setAttribute('aria-label', 'Search trophies');
  search.addEventListener('input', () => handlers.search(search.value));
  toolbar.appendChild(search);

  const chips = el('div', 'chip-row');
  for (const kind of KIND_FILTERS) {
    const chip = el('button', `chip${state.kind === kind.value ? ' on' : ''}`, kind.label);
    chip.type = 'button';
    chip.setAttribute('aria-pressed', state.kind === kind.value ? 'true' : 'false');
    chip.addEventListener('click', () => handlers.kind(kind.value));
    chips.appendChild(chip);
  }
  toolbar.appendChild(chips);

  const gradeSelect = el('select', 'select');
  gradeSelect.setAttribute('aria-label', 'Filter by grade');
  for (const [value, label] of [['all', 'All grades'], ['platinum', 'Platinum'], ['gold', 'Gold'], ['silver', 'Silver'], ['bronze', 'Bronze']]) {
    const option = el('option', null, label);
    option.value = value;
    if (state.grade === value) option.selected = true;
    gradeSelect.appendChild(option);
  }
  gradeSelect.addEventListener('change', () => handlers.grade(gradeSelect.value));
  toolbar.appendChild(gradeSelect);

  const earnedSelect = el('select', 'select');
  earnedSelect.setAttribute('aria-label', 'Filter by earned state');
  for (const [value, label] of [['all', 'Earned + remaining'], ['remaining', 'Remaining only'], ['earned', 'Earned only']]) {
    const option = el('option', null, label);
    option.value = value;
    if (state.earnedFilter === value) option.selected = true;
    earnedSelect.appendChild(option);
  }
  earnedSelect.addEventListener('change', () => handlers.earnedFilter(earnedSelect.value));
  toolbar.appendChild(earnedSelect);

  const spoiler = el('label', 'spoiler-toggle');
  const spoilerBox = document.createElement('input');
  spoilerBox.type = 'checkbox';
  spoilerBox.checked = state.spoilersOn;
  spoilerBox.addEventListener('change', () => handlers.spoilers(spoilerBox.checked));
  spoiler.appendChild(spoilerBox);
  spoiler.appendChild(document.createTextNode('Spoiler-free: hide story trophies until earned'));
  toolbar.appendChild(spoiler);

  const exportButton = el('button', 'btn', 'Export progress');
  exportButton.type = 'button';
  exportButton.addEventListener('click', handlers.exportProgress);
  toolbar.appendChild(exportButton);

  const importLabel = el('label', 'btn ghost', 'Import progress');
  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.accept = 'application/json,.json';
  importInput.hidden = true;
  importInput.addEventListener('change', () => {
    if (importInput.files && importInput.files[0]) handlers.importProgress(importInput.files[0]);
    importInput.value = '';
  });
  importLabel.appendChild(importInput);
  toolbar.appendChild(importLabel);

  const resetButton = el('button', 'btn ghost', 'Reset progress');
  resetButton.type = 'button';
  resetButton.addEventListener('click', handlers.resetProgress);
  toolbar.appendChild(resetButton);

  const shown = filterTrophies(trophies, {
    query: state.query,
    kind: state.kind,
    grade: state.grade,
    earned: state.earnedFilter,
    earnedSet: state.earned,
  });
  const { counts, totals } = countByGrade(trophies, state.earned);
  const note = el('p', 'toolbar-note');
  note.innerHTML = '';
  note.appendChild(document.createTextNode(`Showing ${shown.length} of 55 trophies · `));
  const strong = el('strong', null, `${state.earned.size} earned`);
  note.appendChild(strong);
  note.appendChild(document.createTextNode(
    ` (${counts.platinum}/${totals.platinum} platinum, ${counts.gold}/${totals.gold} gold, ${counts.silver}/${totals.silver} silver, ${counts.bronze}/${totals.bronze} bronze) · All 55 are offline; there are no online trophies.`,
  ));
  toolbar.appendChild(note);
  root.appendChild(toolbar);

  const layout = el('div', 'checklist-layout');
  const list = el('ul', 'trophy-list');
  if (shown.length === 0) {
    const empty = el('li', 'empty-note', 'No trophies match those filters. Clear the search or pick another kind.');
    list.appendChild(empty);
  } else {
    for (const trophy of shown) list.appendChild(trophyRow(trophy, state, handlers));
  }
  layout.appendChild(list);
  const selected = trophies.find((t) => t.id === state.selectedId) || null;
  layout.appendChild(trophyDetail(selected, state, handlers));
  root.appendChild(layout);
  return root;
}

/** The roadmap view: three stages plus the 35-item 100% checklist. */
export function roadmapView(trophies, state) {
  const root = el('div', 'page roadmap-page');
  root.appendChild(el('h2', null, 'Roadmap to the platinum'));
  const lede = el('p', 'lede', 'About 200 hours, difficulty 4/10, one playthrough, all offline. The story takes 60–80 hours; the 100% Completion checklist takes about 100 more; cleanup takes about 10. Cheats disable trophies and saving, so leave them off for the whole run.');
  root.appendChild(lede);

  const grid = el('div', 'stage-grid');
  for (const stage of ROADMAP_STAGES) {
    const card = el('section', 'stage-card');
    card.appendChild(el('h3', null, stage.title));
    card.appendChild(el('p', 'stage-time', stage.time));
    card.appendChild(el('p', null, stage.intro));
    const list = el('ul');
    for (const item of stage.items) list.appendChild(el('li', null, item));
    card.appendChild(list);
    grid.appendChild(card);
  }
  root.appendChild(grid);

  root.appendChild(el('h3', null, 'The 100% Completion checklist — A Long Road'));
  root.appendChild(el('p', null, 'The 35 requirements below appear in-game under Progress > Stats > 100% Completion after the story. Progress made during the story already counts. Only the items marked “all” need everything; the rest need a share of the total.'));
  for (const group of COMPLETION_CHECKLIST) {
    root.appendChild(el('h3', null, group.group));
    const table = el('table', 'data-table');
    const head = el('tr');
    head.appendChild(el('th', null, 'Requirement'));
    head.appendChild(el('th', null, 'Needed'));
    head.appendChild(el('th', null, 'Total in game'));
    table.appendChild(head);
    for (const [name, need, total] of group.rows) {
      const row = el('tr');
      row.appendChild(el('td', null, name));
      row.appendChild(el('td', null, need));
      row.appendChild(el('td', null, total || '—'));
      table.appendChild(row);
    }
    root.appendChild(table);
  }
  const sourceNote = el('p', 'kbd-note', 'Checklist figures: PowerPyx — GTA 6 Trophy Guide & Roadmap; Insider Gaming — GTA 6 100% Completion Walkthrough; Alcast — GTA 6 100% Completion Checklist.');
  root.appendChild(sourceNote);
  return root;
}

/** The missables view: the one trophy that can pass you by. */
export function missablesView() {
  const root = el('div', 'page missables-page');
  root.appendChild(el('h2', null, 'Missable trophies'));
  root.appendChild(el('p', 'lede', 'Good news: as far as any guide can confirm, only one trophy can pass you by — and even that one is not proven to be required. There is no mission replay in GTA VI, so the advice below is the whole safety net.'));
  const hero = el('div', 'missable-hero');
  hero.appendChild(el('h3', null, 'Positive Mental Attitude — the Chapter 1 meditation'));
  hero.appendChild(el('p', null, 'Meditate at every spot across Leonida. The first meditation happens at Jason’s house in Chapter 1: after the mission Down to Earth, talk to Lucia in the kitchen in the morning. She says she is going to meditate, walks to the balcony — follow her and choose Accept. That session adds +1 to your meditation counter but is not marked as a meditation spot like the others, and it is still unconfirmed whether it is required for the trophy. Do it anyway: it takes a minute, and there is no way back after Chapter 1 ends.'));
  hero.appendChild(el('p', null, 'Every other meditation spot stays available in free-roam forever, and the final Ascent spot on Mount Kalaga only appears after the rest are done. The 100% checklist needs 15 of the 18 meditations; the trophy needs all 18.'));
  hero.appendChild(el('p', 'kbd-note', 'Sources: PowerPyx — GTA 6 Trophy Guide & Roadmap; Beebom — All GTA 6 Meditation Spots Locations; GameTrek — All Meditation Spot Locations.'));
  root.appendChild(hero);

  root.appendChild(el('h3', null, 'Everything else is safe'));
  const list = el('ul');
  for (const item of [
    'All story and mission trophies unlock automatically and cannot be missed.',
    'Every side-character questline (Andy, Kenton, Billy, Randy, Tyrone, Bret) stays available after the story, even if a quest giver goes quiet for a stretch.',
    'Nothing on the 100% Completion checklist is missable — it can all be done in free-roam after the story.',
    'Some optional missions disappear after a while and some quest givers are temporarily unavailable, but PowerPyx confirms none of that affects trophies or 100%.',
    'A few magazine collectibles sit in story buildings that later become inaccessible, but they also spawn elsewhere and you don’t need all of them.',
    'Keep manual saves anyway: 15 manual slots plus one autosave. PowerPyx recommends a save at the start and end of each chapter, then rotating the remaining five for cleanup.',
  ]) list.appendChild(el('li', null, item));
  root.appendChild(list);
  return root;
}

/** The sources view: every source the guides draw on, and the honesty note. */
export function sourcesView() {
  const root = el('div', 'page sources-page');
  root.appendChild(el('h2', null, 'Sources & method'));
  root.appendChild(el('p', 'lede', 'Every trophy guide in this app names its sources beside the guide. The guides are written in our own words — a source is cited, never copied. The official trophy names, descriptions and grades are shown exactly as PlayStation publishes them.'));
  root.appendChild(el('h3', null, 'How we mark confidence'));
  const list = el('ul');
  for (const item of [
    'Verified — confirmed by at least two independent guides, or by one guide plus the official list.',
    'Reported — one guide has published a method, and no second guide has confirmed it yet. Four trophies sit here: In The Beginning…, Capital Offense, Ten Pin and The Truth Is Out There.',
    'Partly unconfirmed — the broad method is confirmed but one detail is still being checked: Positive Mental Attitude (whether the Chapter 1 meditation is required) and Fair Game (which animal unlocks it).',
    'Method unconfirmed — no guide has verified a method yet. One trophy sits here: Bad Luck, I Guess. Its guide gives the best lead and labels it as speculation.',
  ]) list.appendChild(el('li', null, item));
  root.appendChild(list);

  root.appendChild(el('h3', null, 'Sources used'));
  const cards = el('div', 'source-cards');
  const sources = [
    ['PowerPyx — GTA 6 Trophy Guide & Roadmap', 'The main source for unlock methods, the roadmap, the 100% checklist and the missable warning. Updated daily since launch.', 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/'],
    ['Exophase — GTA VI trophy list', 'The official trophy list as published: all 55 names, descriptions, grades and hidden flags.', 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/'],
    ['PSNProfiles — Grand Theft Auto VI trophies', 'The official list with PSN progress targets (for example 42 Shooting Range challenges).', 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi'],
    ['Insider Gaming — GTA 6 100% Completion Walkthrough', 'The 35-item 100% checklist behind A Long Road.', 'https://insider-gaming.com/gta-6-100-completion-a-long-road-trophy/'],
    ['Alcast — GTA 6 100% Completion Checklist', 'A second listing of the 35 checklist items and how each is done.', 'https://alcasthq.com/gta-6-completion-100/'],
    ['Beebom — All GTA 6 Meditation Spots Locations', 'All 18 meditation spots and the Chapter 1 missable warning.', 'https://beebom.com/gta-6-meditation-spots-locations/'],
    ['GameTrek — All Meditation Spot Locations', 'A second meditation-spot listing, with the same Chapter 1 warning.', 'https://gmtreks.com/gta6/page/01M7QVDV9V6SV9W03RH60W1P4B'],
    ['KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap', 'A second full trophy guide; it still lists the hidden-trophy methods as unconfirmed.', 'https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/'],
    ['Leonida Interactive — GTA 6 Trophies and Achievements', 'A second full list with per-trophy unlock notes.', 'https://leonidainteractive.com/wiki/guides/trophies-achievements/'],
    ['GTA Zone — GTA 6 Trophy List', 'A second list confirming the 55 names, grades and the PowerPyx roadmap figures.', 'https://gta-zone.com/news/gta-6-trophies-achievements/'],
    ['DamnModz — GTA 6 Trophy Guide', 'Confirms every unlock except Bad Luck, I Guess, and labels the guide’s confidence per trophy.', 'https://damnmodz.com/wiki/playstation-trophies/gta-6/'],
    ['Push Square — GTA 6 Trophy Guide & Roadmap', 'A second roadmap source; confirms the story trophies and the spending trophy.', 'https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap'],
  ];
  for (const [label, note, url] of sources) {
    const card = el('div', 'source-card');
    card.appendChild(el('h4', null, label));
    card.appendChild(el('p', null, note));
    const link = el('a', null, url);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    card.appendChild(link);
    cards.appendChild(card);
  }
  root.appendChild(cards);
  root.appendChild(el('p', 'kbd-note', 'Guide data current as of 20 November 2026 — the day after Grand Theft Auto VI released (19 November 2026). Methods for the hidden trophies are still being confirmed by the community; this guide will be wrong in places and says so where it might be.'));
  return root;
}
