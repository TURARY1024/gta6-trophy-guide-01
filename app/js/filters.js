// Search and filter logic for the checklist. Spoiler-free mode hides the name
// and description of story and hidden trophies until they are earned; the grade
// is hidden with them, so an unearned hidden trophy shows only as "Hidden trophy".

export function applyFilters(trophies, options) {
  const query = (options.query ?? '').trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (options.kind !== 'all' && trophy.kind !== options.kind) return false;
    if (options.grade !== 'all' && trophy.grade !== options.grade) return false;
    if (options.status === 'earned' && !options.earned.has(trophy.id)) return false;
    if (options.status === 'remaining' && options.earned.has(trophy.id)) return false;
    if (query) {
      const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function isConcealed(trophy, earned, spoilerFree) {
  if (!spoilerFree) return false;
  if (earned.has(trophy.id)) return false;
  return trophy.hidden || trophy.kind === 'story';
}

export function displayName(trophy, earned, spoilerFree) {
  return isConcealed(trophy, earned, spoilerFree) ? 'Hidden trophy' : trophy.name;
}

export function displayDescription(trophy, earned, spoilerFree) {
  if (isConcealed(trophy, earned, spoilerFree)) {
    return 'Earn this trophy to reveal its name and description.';
  }
  return trophy.description;
}

export const KIND_LABELS = {
  story: 'Story',
  side: 'Side quests',
  activities: 'Activities',
  collectibles: 'Collectibles',
  exploration: 'Exploration',
  robberies: 'Robberies',
  misc: 'Misc',
};
