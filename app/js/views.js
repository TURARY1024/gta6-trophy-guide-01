// Renders the checklist rows and the trophy detail pane.
import { CONFIDENCE_LABELS, SOURCES } from './data.js';
import { KIND_LABELS, displayDescription, displayName, isConcealed } from './filters.js';

export function gradeBadge(grade) {
  const span = document.createElement('span');
  span.className = `badge ${grade}`;
  span.textContent = grade;
  return span;
}

export function confidenceBadge(confidence) {
  const span = document.createElement('span');
  span.className = `badge conf-${confidence}`;
  span.textContent = CONFIDENCE_LABELS[confidence] ?? confidence;
  return span;
}

function tag(text, className) {
  const span = document.createElement('span');
  span.className = `badge ${className}`;
  span.textContent = text;
  return span;
}

export function renderChecklist(container, trophies, state, callbacks) {
  container.replaceChildren();
  for (const trophy of trophies) {
    const row = document.createElement('div');
    row.className = 'trophy' + (state.earned.has(trophy.id) ? ' earned' : '');
    if (state.selectedId === trophy.id) row.classList.add('selected');
    row.setAttribute('role', 'listitem');
    row.addEventListener('click', () => callbacks.onSelect(trophy.id));

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = state.earned.has(trophy.id);
    box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    box.addEventListener('click', (event) => event.stopPropagation());
    box.addEventListener('change', () => callbacks.onToggle(trophy.id, box.checked));
    row.append(box);

    const body = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = displayName(trophy, state.earned, state.spoilerFree);
    body.append(title);
    const desc = document.createElement('p');
    desc.textContent = displayDescription(trophy, state.earned, state.spoilerFree);
    body.append(desc);
    const meta = document.createElement('div');
    meta.className = 'meta';
    if (!isConcealed(trophy, state.earned, state.spoilerFree)) meta.append(gradeBadge(trophy.grade));
    meta.append(tag(KIND_LABELS[trophy.kind] ?? trophy.kind, 'kind'));
    if (trophy.hidden) meta.append(tag('Hidden', 'hidden'));
    if (trophy.missable) meta.append(tag('Possibly missable', 'missable'));
    body.append(meta);
    row.append(body);

    const side = document.createElement('div');
    side.append(confidenceBadge(trophy.confidence));
    row.append(side);
    container.append(row);
  }
  if (trophies.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No trophies match these filters.';
    container.append(empty);
  }
}

export function renderDetail(container, trophy, state) {
  container.replaceChildren();
  if (!trophy) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'Select a trophy to see its guide, steps and sources.';
    container.append(empty);
    return;
  }
  const title = document.createElement('h2');
  title.textContent = trophy.name;
  container.append(title);

  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = trophy.description;
  container.append(official);

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.append(gradeBadge(trophy.grade));
  meta.append(tag(KIND_LABELS[trophy.kind] ?? trophy.kind, 'kind'));
  if (trophy.hidden) meta.append(tag('Hidden', 'hidden'));
  if (trophy.missable) meta.append(tag('Possibly missable', 'missable'));
  meta.append(confidenceBadge(trophy.confidence));
  container.append(meta);

  const guideHead = document.createElement('h4');
  guideHead.textContent = 'Guide';
  container.append(guideHead);
  for (const paragraph of trophy.guide.split('\n')) {
    const p = document.createElement('p');
    p.textContent = paragraph;
    container.append(p);
  }

  if (Array.isArray(trophy.steps) && trophy.steps.length > 0) {
    const stepsHead = document.createElement('h4');
    stepsHead.textContent = 'Steps';
    container.append(stepsHead);
    const list = document.createElement('ol');
    for (const step of trophy.steps) {
      const item = document.createElement('li');
      item.textContent = step;
      list.append(item);
    }
    container.append(list);
  }

  if (trophy.confidence_note) {
    const note = document.createElement('p');
    note.className = 'conf-note';
    note.textContent = trophy.confidence_note;
    container.append(note);
  }

  const sourcesHead = document.createElement('h4');
  sourcesHead.textContent = 'Sources';
  container.append(sourcesHead);
  const sources = document.createElement('p');
  sources.className = 'sources';
  for (const key of trophy.sources) {
    const source = SOURCES[key];
    if (!source) continue;
    if (source.url) {
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = source.label;
      sources.append(link);
    } else {
      const text = document.createElement('span');
      text.textContent = source.label;
      sources.append(text);
    }
    sources.append(document.createElement('br'));
  }
  container.append(sources);
}
