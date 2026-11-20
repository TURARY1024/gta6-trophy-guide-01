// Bootstrap: loads the trophy data, reads the URL (?view=, ?demo=1, ?trophy=<id>,
// ?spoilers=on), wires the controls and renders the current view. The demo flag
// seeds 13 earned trophies so the screenshots show progress; it never changes
// the saved progress of a real reader.
import { loadTrophies } from './data.js';
import { demoEarned, downloadProgress, loadChecklist, loadEarned, readProgressFile, saveChecklist, saveEarned } from './store.js';
import { applyFilters } from './filters.js';
import { renderChecklist, renderDetail } from './views.js';
import { renderMissables, renderRoadmap, renderSources } from './roadmap.js';

const params = new URLSearchParams(location.search);
const trophies = await loadTrophies();

const state = {
  trophies,
  earned: loadEarned(),
  checklist: loadChecklist(),
  view: params.get('view') ?? 'checklist',
  query: '',
  kind: 'all',
  grade: 'all',
  status: 'all',
  spoilerFree: params.get('spoilers') === 'on',
  selectedId: params.get('trophy') ? Number(params.get('trophy')) : null,
};
if (params.get('demo') === '1') state.earned = demoEarned();

const listEl = document.getElementById('list');
const detailEl = document.getElementById('detail');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const countLine = document.getElementById('countLine');

function updateProgress() {
  const done = state.earned.size;
  const total = state.trophies.length;
  progressFill.style.width = `${Math.round((done / total) * 100)}%`;
  progressText.textContent = `${done} of ${total} earned — ${Math.round((done / total) * 100)}% to the platinum`;
}

function currentFilters() {
  return {
    query: state.query,
    kind: state.kind,
    grade: state.grade,
    status: state.status,
    earned: state.earned,
  };
}

function renderChecklistView() {
  const shown = applyFilters(state.trophies, currentFilters());
  countLine.textContent = `Showing ${shown.length} of ${state.trophies.length} trophies`;
  renderChecklist(listEl, shown, state, {
    onSelect: (id) => {
      state.selectedId = id;
      renderChecklistView();
    },
    onToggle: (id, checked) => {
      if (checked) state.earned.add(id);
      else state.earned.delete(id);
      saveEarned(state.earned);
      updateProgress();
      renderChecklistView();
    },
  });
  const selected = state.trophies.find((trophy) => trophy.id === state.selectedId) ?? null;
  renderDetail(detailEl, selected, state);
}

function toggleChecklistItem(index, checked) {
  if (checked) state.checklist.add(index);
  else state.checklist.delete(index);
  saveChecklist(state.checklist);
  renderRoadmap(document.getElementById('view-roadmap'), state.checklist, toggleChecklistItem);
}

function showView(view) {
  state.view = view;
  for (const button of document.querySelectorAll('#tabs button')) {
    button.classList.toggle('active', button.dataset.view === view);
  }
  for (const section of document.querySelectorAll('.view')) {
    section.hidden = section.id !== `view-${view}`;
  }
  if (view === 'roadmap') {
    renderRoadmap(document.getElementById('view-roadmap'), state.checklist, toggleChecklistItem);
  }
  if (view === 'missables') renderMissables(document.getElementById('view-missables'));
  if (view === 'sources') renderSources(document.getElementById('view-sources'));
  if (view === 'checklist') renderChecklistView();
}

document.getElementById('search').addEventListener('input', (event) => {
  state.query = event.target.value;
  renderChecklistView();
});
document.getElementById('kind').addEventListener('change', (event) => {
  state.kind = event.target.value;
  renderChecklistView();
});
document.getElementById('grade').addEventListener('change', (event) => {
  state.grade = event.target.value;
  renderChecklistView();
});
document.getElementById('status').addEventListener('change', (event) => {
  state.status = event.target.value;
  renderChecklistView();
});
const spoilersBox = document.getElementById('spoilers');
spoilersBox.checked = state.spoilerFree;
spoilersBox.addEventListener('change', () => {
  state.spoilerFree = spoilersBox.checked;
  renderChecklistView();
});
document.getElementById('export').addEventListener('click', () => {
  downloadProgress(state.earned, state.checklist);
});
document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const progress = await readProgressFile(file);
    state.earned = progress.earned;
    state.checklist = progress.checklist;
    saveEarned(state.earned);
    saveChecklist(state.checklist);
    updateProgress();
    showView(state.view);
  } catch {
    alert('That file is not a Leonida Platinum progress export.');
  }
  event.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies and checklist ticks in this browser?')) return;
  state.earned = new Set();
  state.checklist = new Set();
  saveEarned(state.earned);
  saveChecklist(state.checklist);
  updateProgress();
  showView(state.view);
});
for (const button of document.querySelectorAll('#tabs button')) {
  button.addEventListener('click', () => showView(button.dataset.view));
}

updateProgress();
showView(['checklist', 'roadmap', 'missables', 'sources'].includes(state.view) ? state.view : 'checklist');
