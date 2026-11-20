// Boot and routing for the Leonida Platinum guide. Hash routes:
//   #/                       the checklist
//   #/trophy/<id>            the checklist with one trophy open
//   #/roadmap                the roadmap to the platinum
//   #/missables              the missable trophies
//   #/sources                sources & method
// A ?demo=1 query seeds a sample of 13 earned trophies when no
// progress is saved yet, so the guide can be previewed and
// screenshotted in its earned state. It never overwrites real saves.

import { loadTrophies } from './data.js';
import {
  loadEarned,
  saveEarned,
  toggleEarned,
  setEarned,
  exportProgress,
  parseImportedProgress,
  downloadText,
  loadSpoilers,
  saveSpoilers,
} from './store.js';
import { checklistView, roadmapView, missablesView, sourcesView } from './views.js';

// A fixed sample of 13 earned trophies for previews and screenshots:
// the story so far plus a few early activities.
const DEMO_EARNED = [
  'just-like-paradise',
  'paradise-lost',
  't-ass-drug-money',
  'trust',
  'break-the-bank',
  'baited-my-tackle',
  'stick-fiddler',
  'whip-it-good',
  'treat-yo-self',
  'the-goodtime-state',
  'one-last-thing',
  'master-of-none',
  'on-the-spot',
];

const state = {
  trophies: [],
  earned: new Set(),
  spoilersOn: false,
  query: '',
  kind: 'all',
  grade: 'all',
  earnedFilter: 'all',
  selectedId: null,
  route: 'checklist',
};

const viewRoot = document.getElementById('view');
const earnedCount = document.getElementById('earnedCount');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const progressSub = document.getElementById('progressSub');

/** Seed demo progress only when the URL asks for it and nothing is saved. */
function maybeSeedDemo() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('demo')) return;
  if (state.earned.size > 0) return;
  state.earned = new Set(DEMO_EARNED);
  saveEarned(state.earned);
  const spoilerParam = params.get('spoilers');
  if (spoilerParam === 'on' || spoilerParam === '1') {
    state.spoilersOn = true;
    saveSpoilers(true);
  }
}

/** Read the hash route into state. */
function readRoute() {
  const hash = window.location.hash || '#/';
  const parts = hash.slice(2).split('/');
  if (parts[0] === 'roadmap') {
    state.route = 'roadmap';
    state.selectedId = null;
  } else if (parts[0] === 'missables') {
    state.route = 'missables';
    state.selectedId = null;
  } else if (parts[0] === 'sources') {
    state.route = 'sources';
    state.selectedId = null;
  } else if (parts[0] === 'trophy' && parts[1]) {
    state.route = 'checklist';
    state.selectedId = decodeURIComponent(parts[1]);
  } else {
    state.route = 'checklist';
    state.selectedId = null;
  }
}

/** Update the header progress display from the earned set. */
function renderProgress() {
  const earned = state.earned.size;
  const total = state.trophies.length || 55;
  const percent = Math.round((earned / total) * 100);
  earnedCount.textContent = String(earned);
  progressFill.style.width = `${percent}%`;
  progressBar.setAttribute('aria-valuenow', String(earned));
  progressSub.textContent =
    earned === total
      ? '100% — platinum earned. You’re a Leonida Legend.'
      : `${percent}% — the platinum is ${total - earned} trophies away`;
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const name = link.getAttribute('data-nav');
    link.classList.toggle('active', name === state.route);
  });
}

function render() {
  renderProgress();
  // Remember whether the reader was typing in the search box, so a
  // re-render while they type doesn't steal or lose the caret.
  const searchWasFocused =
    viewRoot.querySelector('.search') === document.activeElement;
  viewRoot.innerHTML = '';
  if (state.route === 'roadmap') {
    viewRoot.appendChild(roadmapView(state.trophies, state));
  } else if (state.route === 'missables') {
    viewRoot.appendChild(missablesView());
  } else if (state.route === 'sources') {
    viewRoot.appendChild(sourcesView());
  } else {
    viewRoot.appendChild(checklistView(state.trophies, state, handlers));
  }
  if (searchWasFocused) {
    const searchInput = viewRoot.querySelector('.search');
    if (searchInput) {
      searchInput.focus();
      searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
    }
  }
}

const handlers = {
  select(id) {
    state.selectedId = id;
    window.location.hash = `#/trophy/${encodeURIComponent(id)}`;
    render();
    const detail = viewRoot.querySelector('.detail');
    if (detail) detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },
  toggle(id) {
    state.earned = toggleEarned(state.earned, id);
    render();
  },
  search(value) {
    state.query = value;
    render();
  },
  kind(value) {
    state.kind = value;
    render();
  },
  grade(value) {
    state.grade = value;
    render();
  },
  earnedFilter(value) {
    state.earnedFilter = value;
    render();
  },
  spoilers(on) {
    state.spoilersOn = on;
    saveSpoilers(on);
    render();
  },
  exportProgress() {
    downloadText('leonida-platinum-progress.json', exportProgress(state.earned));
  },
  async importProgress(file) {
    try {
      const text = await file.text();
      const imported = parseImportedProgress(text);
      const known = new Set(state.trophies.map((t) => t.id));
      const kept = new Set([...imported].filter((id) => known.has(id)));
      state.earned = setEarned(kept);
      render();
      alert(`Imported progress for ${kept.size} trophies.`);
    } catch (error) {
      alert(`Could not import that file: ${error.message}`);
    }
  },
  resetProgress() {
    if (window.confirm('Clear all earned trophies? This cannot be undone. Export first if you want a backup.')) {
      state.earned = setEarned(new Set());
      render();
    }
  },
};

window.addEventListener('hashchange', () => {
  readRoute();
  render();
});

async function boot() {
  state.earned = loadEarned();
  state.spoilersOn = loadSpoilers();
  maybeSeedDemo();
  try {
    state.trophies = await loadTrophies();
  } catch (error) {
    viewRoot.innerHTML = '';
    const note = document.createElement('p');
    note.textContent = 'The trophy data could not be loaded. Serve this folder over HTTP (for example, node serve.ts) and reload.';
    viewRoot.appendChild(note);
    return;
  }
  readRoute();
  render();
}

boot();
