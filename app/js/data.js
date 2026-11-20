// Trophy data access: loads app/data/trophies.json (a file of this app,
// fetched over the app's own server, never the network) and gives the
// rest of the app one shared, sorted copy of the 55 trophies.

export const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

export const GRADE_LABELS = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export const KIND_LABELS = {
  story: 'Story',
  side: 'Side quests',
  activities: 'Activities',
  collectibles: 'Collectibles',
  exploration: 'Exploration',
  robbery: 'Robberies',
  misc: 'Misc',
  platinum: 'Platinum',
  completion: '100% completion',
};

export const STATUS_LABELS = {
  verified: 'Verified',
  reported: 'Reported — single source',
  partial: 'Partly unconfirmed',
  unconfirmed: 'Method unconfirmed',
};

let cachedTrophies = null;

/** Fetch the trophy list once and cache it. Returns the array of trophies. */
export async function loadTrophies() {
  if (cachedTrophies) return cachedTrophies;
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('Could not load data/trophies.json');
  const data = await response.json();
  const list = Array.isArray(data) ? data : data.trophies;
  cachedTrophies = list.slice().sort(compareTrophies);
  return cachedTrophies;
}

/** Official-list order: platinum first, then gold, silver, bronze,
    each group in the order PlayStation lists the trophies. */
export function compareTrophies(a, b) {
  const byGrade = GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade];
  if (byGrade !== 0) return byGrade;
  return 0; // stable sort keeps the file's order inside a grade
}

export function trophyById(trophies, id) {
  return trophies.find((trophy) => trophy.id === id) || null;
}

/** A short, stable key for a trophy, used in saved progress. */
export function trophyKey(trophy) {
  return trophy.id;
}
