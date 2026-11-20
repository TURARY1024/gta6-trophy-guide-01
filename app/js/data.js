// Loads the trophy data and names the sources every guide cites. A source is
// cited, never copied: the guides in trophies.json are written in our own words,
// and each trophy names the guides its facts come from.
export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('Could not load data/trophies.json');
  const doc = await response.json();
  return doc.trophies;
}

export const CONFIDENCE_LABELS = {
  verified: 'Verified — 2+ guides agree',
  reported: 'Reported — single source',
  partly: 'Partly unconfirmed',
  unconfirmed: 'Method unconfirmed',
};

// Every source the guides draw on. URLs are the pages as published; the guide
// itself fetches nothing at run time — a link opens only when the reader follows it.
export const SOURCES = {
  'PowerPyx': {
    label: 'PowerPyx — GTA 6 Trophy Guide & Roadmap',
    url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/',
  },
  'PowerPyx 100%': {
    label: 'PowerPyx — GTA 6 100% Completion Checklist & Guide',
    url: 'https://www.powerpyx.com/gta-6-100-completion-checklist-guide/',
  },
  'Push Square': {
    label: 'Push Square — GTA 6 Trophy Guide & Roadmap',
    url: 'https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap',
  },
  KeenGamer: {
    label: 'KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap',
    url: 'https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/',
  },
  'games.gg': {
    label: 'games.gg — GTA 6 Trophy List',
    url: 'https://www.games.gg/grand-theft-auto-vi/guides/complete-grand-theft-auto-6-trophy-list/',
  },
  'The Gamers Hub': {
    label: 'The Gamers Hub — GTA 6 100% Completion Checklist',
    url: 'https://www.thegamershub.co/gta-6/checklist/',
  },
  'Exophase / PSNProfiles': {
    label: 'Exophase / PSNProfiles — the official trophy list (names, descriptions, grades)',
    url: null,
  },
};
