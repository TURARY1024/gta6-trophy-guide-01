// Filtering and the spoiler rule: which trophies a list shows, and
// what a reader is allowed to see of a trophy they haven't earned.

export const KIND_FILTERS = [
  { value: 'all', label: 'All kinds' },
  { value: 'story', label: 'Story' },
  { value: 'side', label: 'Side quests' },
  { value: 'activities', label: 'Activities' },
  { value: 'collectibles', label: 'Collectibles' },
  { value: 'exploration', label: 'Exploration' },
  { value: 'robbery', label: 'Robberies' },
  { value: 'misc', label: 'Misc' },
  { value: 'missable', label: 'Missable' },
];

/** A trophy counts as story-spoiler material while it is hidden on
    PlayStation or tied to the story, until the player earns it. */
export function isSpoilerTrophy(trophy) {
  return trophy.hidden === true || trophy.kind === 'story';
}

/** Should this trophy's name and description be masked right now?
    Only when the spoiler setting is on, the trophy is spoiler
    material, and the player hasn't earned it yet. */
export function isMasked(trophy, earned, spoilersOn) {
  return spoilersOn && isSpoilerTrophy(trophy) && !earned.has(trophy.id);
}

/** Apply the toolbar's search text, kind, grade and earned filters. */
export function filterTrophies(trophies, options) {
  const query = (options.query || '').trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (options.kind === 'missable') {
      if (!trophy.missable) return false;
    } else if (options.kind && options.kind !== 'all') {
      if (trophy.kind !== options.kind) return false;
    }
    if (options.grade && options.grade !== 'all') {
      if (trophy.grade !== options.grade) return false;
    }
    if (options.earned === 'earned' && !options.earnedSet.has(trophy.id)) return false;
    if (options.earned === 'remaining' && options.earnedSet.has(trophy.id)) return false;
    if (query) {
      const haystack = [
        trophy.name,
        trophy.description,
        trophy.guide || '',
        (trophy.steps || []).join(' '),
      ].join(' ').toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

/** Count earned trophies by grade, for the progress header. */
export function countByGrade(trophies, earned) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  const totals = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) {
    totals[trophy.grade] += 1;
    if (earned.has(trophy.id)) counts[trophy.grade] += 1;
  }
  return { counts, totals };
}
