// Progress storage: everything the tracker remembers lives in this browser's
// localStorage, under versioned keys, and can be exported to a file and imported
// back. Nothing is sent anywhere.
const EARNED_KEY = 'leonida-platinum-earned-v1';
const CHECKLIST_KEY = 'leonida-platinum-checklist-v1';

export function loadEarned() {
  return loadSet(EARNED_KEY);
}

export function saveEarned(earned) {
  saveSet(EARNED_KEY, earned);
}

export function loadChecklist() {
  return loadSet(CHECKLIST_KEY);
}

export function saveChecklist(done) {
  saveSet(CHECKLIST_KEY, done);
}

function loadSet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const values = JSON.parse(raw);
    return new Set(Array.isArray(values) ? values : []);
  } catch {
    return new Set();
  }
}

function saveSet(key, values) {
  localStorage.setItem(key, JSON.stringify([...values].sort()));
}

// The demo set used by ?demo=1 (and by the screenshots): 13 earned trophies
// spread across the story, activities and robberies, so the views show progress.
export function demoEarned() {
  return new Set([2, 3, 4, 5, 8, 15, 16, 20, 21, 30, 35, 42, 52]);
}

export function downloadProgress(earned, checklist) {
  const payload = { app: 'leonida-platinum', earned: [...earned].sort(), checklist: [...checklist].sort() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'leonida-platinum-progress.json';
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

export async function readProgressFile(file) {
  const text = await file.text();
  const payload = JSON.parse(text);
  const earned = new Set(Array.isArray(payload.earned) ? payload.earned : []);
  const checklist = new Set(Array.isArray(payload.checklist) ? payload.checklist : []);
  return { earned, checklist };
}
