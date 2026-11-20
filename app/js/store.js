// Saved progress: the earned set lives in localStorage only, under one
// key, and can be exported to a JSON file and imported back. Nothing
// here touches the network.

export const STORAGE_KEY = 'leonida-platinum-progress-v1';
export const SPOILER_KEY = 'leonida-platinum-spoilers-v1';

/** Read the earned set from localStorage. Returns a Set of trophy ids. */
export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id) => typeof id === 'string'));
  } catch {
    return new Set();
  }
}

/** Write the earned set to localStorage. */
export function saveEarned(earned) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
  } catch {
    // Storage full or unavailable: progress just won't persist.
  }
}

/** Toggle one trophy's earned state. Returns the new earned set. */
export function toggleEarned(earned, id) {
  const next = new Set(earned);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  saveEarned(next);
  return next;
}

/** Replace the earned set wholesale (used by import). */
export function setEarned(earned) {
  saveEarned(earned);
  return new Set(earned);
}

/** Serialize the earned set for export. */
export function exportProgress(earned) {
  return JSON.stringify(
    { app: 'leonida-platinum', version: 1, earned: [...earned].sort() },
    null,
    2,
  );
}

/** Parse an imported progress file. Returns a Set, or throws a message. */
export function parseImportedProgress(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  const ids = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(ids)) {
    throw new Error('That file has no earned list in it.');
  }
  return new Set(ids.filter((id) => typeof id === 'string'));
}

/** Download a text file from the browser. Used for progress export. */
export function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Spoiler setting: true hides un-earned story/hidden trophies. */
export function loadSpoilers() {
  try {
    return localStorage.getItem(SPOILER_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveSpoilers(on) {
  try {
    localStorage.setItem(SPOILER_KEY, on ? '1' : '0');
  } catch {
    // Ignore: the setting just won't persist.
  }
}
