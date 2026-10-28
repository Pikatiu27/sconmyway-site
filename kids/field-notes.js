import { weekDates, regionKey, matchEvent } from './event-filters.mjs';

const root = document.body;
const state = { sydney: { area: '', date: '', free: false }, melbourne: { area: '', date: '', free: false } };
const feeds = {};
let availability;
const lang = () => root.dataset.lang === 'en' ? 'en' : 'zh';
const city = () => root.dataset.city;
const text = (zh, en) => lang() === 'zh' ? zh : en;
const element = (tag, className, content) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
};
function pair(zh, en, tag = 'span', className = '') {
  const node = element(tag, className);
  node.append(element('span', 'zh', zh), element('span', 'en', en));
  return node;
}
function icon(name) {
  const image = element('img', 'fn-icon');
  image.src = `assets/icons/${name}.svg`;
  image.alt = '';
  image.setAttribute('aria-hidden', 'true');
  return image;
}
const toolbar = element('div', 'event-toolbar');
toolbar.hidden = true;
const areaButton = element('button', 'filter-button');
const dateButton = element('button', 'filter-button');
const areaCaption = element('span');
const dateCaption = element('span');
for (const button of [areaButton, dateButton]) {
  button.type = 'button';
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', 'event-filters');
}
areaButton.append(icon('map-pin'), areaCaption);
dateButton.append(icon('calendar'), dateCaption);
const freeLabel = element('label', 'free-toggle');
const freeInput = element('input');
freeInput.type = 'checkbox';
freeInput.id = 'events-free';
freeLabel.append(freeInput, pair('只看免费', 'Free only'));
toolbar.append(areaButton, dateButton, freeLabel);
const status = element('div', 'filter-status');
status.hidden = true;
status.setAttribute('role', 'status');
status.setAttribute('aria-live', 'polite');
document.querySelector('.finder-controls').after(toolbar, status);
const dialog = element('dialog', 'filter-dialog');
dialog.id = 'event-filters';
dialog.setAttribute('aria-labelledby', 'filter-dialog-title');
const form = element('form');
const drawerHead = element('div', 'drawer-head');
const drawerTitle = pair('筛选活动', 'Filter events', 'h2');
drawerTitle.id = 'filter-dialog-title';
const close = element('button', 'icon-button');
close.type = 'button';
close.append(icon('x'));
drawerHead.append(drawerTitle, close);
const drawerBody = element('div', 'drawer-body');
const drawerFoot = element('div', 'drawer-foot');
const reset = element('button', 'text-button');
reset.type = 'button';
reset.append(pair('重置', 'Reset'));
const apply = element('button', 'apply-button');
apply.type = 'submit';
apply.append(pair('查看活动', 'Show events'));
drawerFoot.append(reset, apply);
form.append(drawerHead, drawerBody, drawerFoot);
dialog.append(form);
document.body.append(dialog);
close.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) {
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
} });

function regions(feed) {
  const result = new Map();
  feed.events.forEach(event => result.set(regionKey(event), { zh: event.tagZh.split(' · ')[0], en: regionKey(event) }));
  return result;
}
function dateLabel(date, short = false) {
  return new Intl.DateTimeFormat(lang() === 'zh' ? 'zh-CN' : 'en-AU', {
    timeZone: 'Australia/Sydney', month: short ? 'numeric' : 'short', day: 'numeric', ...(short ? {} : { weekday: 'short' })
  }).format(new Date(`${date}T12:00:00+11:00`));
}
function radio(name, value, caption, selected) {
  const label = element('label', 'choice-label');
  const input = element('input');
  input.type = 'radio'; input.name = name; input.value = value; input.checked = value === selected;
  label.append(input, element('span', '', caption));
  return label;
}
function buildDrawer(values) {
  drawerBody.replaceChildren();
  const areas = element('fieldset');
  areas.dataset.field = 'area';
  areas.append(pair('地区', 'Area', 'legend'));
  const areaGrid = element('div', 'choice-grid');
  areaGrid.append(radio('area', '', text('全部地区', 'All areas'), values.area));
  regions(feeds[city()]).forEach((labels, value) => areaGrid.append(radio('area', value, labels[lang()], values.area)));
  areas.append(areaGrid);
  const dates = element('fieldset');
  dates.dataset.field = 'date';
  dates.append(pair('日期', 'Date', 'legend'));
  const dateGrid = element('div', 'choice-grid date-options');
  dateGrid.append(radio('date', '', text('本周全部', 'Whole publication week'), values.date));
  weekDates(feeds[city()].periodStart, feeds[city()].periodEnd).forEach(date => dateGrid.append(radio('date', date, dateLabel(date), values.date)));
  dates.append(dateGrid);
  const price = element('fieldset');
  price.append(pair('费用', 'Cost', 'legend'));
  const label = element('label', 'choice-label');
  const input = element('input'); input.type = 'checkbox'; input.name = 'free'; input.checked = values.free;
  label.append(input, pair('免费入场（餐饮及附加项目可能收费）', 'Free entry (food and extras may cost more)'));
  price.append(label);
  drawerBody.append(areas, dates, price);
}
function openDrawer(field) {
  buildDrawer(state[city()]);
  dialog.showModal();
  const target = drawerBody.querySelector(`[data-field="${field}"]`);
  target.querySelector('input:checked').focus();
  drawerBody.scrollTop += target.getBoundingClientRect().top - drawerBody.getBoundingClientRect().top - 12;
}
areaButton.addEventListener('click', () => openDrawer('area'));
dateButton.addEventListener('click', () => openDrawer('date'));
reset.addEventListener('click', () => buildDrawer({ area: '', date: '', free: false }));
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  state[city()] = { area: data.get('area') || '', date: data.get('date') || '', free: data.has('free') };
  dialog.close();
  refresh();
});
freeInput.addEventListener('change', () => { state[city()].free = freeInput.checked; refresh(); });

function renderCount(section, count, filtered, historical) {
  const heading = pair('本周值得出门', 'Worth heading out for', 'strong');
  const caption = filtered
    ? pair(`找到 ${count} 条${historical ? '（含已结束）' : ''}`, `${count} matches${historical ? ' (including finished)' : ''}`)
    : pair(`还能去的 ${count} 条`, `${count} still to enjoy`);
  section.querySelector('.event-count').replaceChildren(heading, caption);
}
function refresh() {
  const currentCity = city();
  const language = lang();
  close.setAttribute('aria-label', text('关闭筛选', 'Close filters'));
  if (!feeds[currentCity]) return;
  const filters = state[currentCity];
  const filtered = Boolean(filters.area || filters.date || filters.free);
  const region = regions(feeds[currentCity]).get(filters.area);
  areaCaption.textContent = region ? region[language] : text('地区', 'Area');
  dateCaption.textContent = filters.date ? dateLabel(filters.date, true) : text('日期', 'Date');
  areaButton.dataset.active = String(Boolean(filters.area));
  dateButton.dataset.active = String(Boolean(filters.date));
  freeInput.checked = filters.free;
  // A selected region can be long; keep the toolbar controls predictable.
  areaButton.setAttribute('aria-label', text('地区筛选：', 'Area filter: ') + (region ? region[language] : text('全部', 'All')));
  areaCaption.textContent = filters.area ? text('地区 · 1', 'Area · 1') : text('地区', 'Area');
  status.replaceChildren();
  status.hidden = !filtered;
  if (filtered) {
    const selections = [region?.[language], filters.date && dateLabel(filters.date), filters.free && text('免费入场', 'Free entry')].filter(Boolean);
    status.append(element('span', '', selections.join(' · ')));
    const clear = element('button', 'text-button', text('清除筛选', 'Clear filters'));
    clear.type = 'button';
    clear.addEventListener('click', () => { state[currentCity] = { area: '', date: '', free: false }; refresh(); });
    status.append(clear);
  }
  document.querySelectorAll('.cards[data-view-panel="events"]').forEach(section => {
    const sectionCity = section.dataset.cityPanel;
    if (!feeds[sectionCity]) return;
    const localFilters = state[sectionCity];
    const activeFilters = Boolean(localFilters.area || localFilters.date || localFilters.free);
    const byKey = new Map(feeds[sectionCity].events.map(event => [event.shareKey || event.url, event]));
    let activeCount = 0;
    let endedCount = 0;
    section.querySelectorAll('.card[data-kind]').forEach(card => {
      const event = byKey.get(card.dataset.shareKey);
      const result = event ? matchEvent(event, localFilters, feeds[sectionCity], availability) : { match: true, uncertain: false };
      card.hidden = !result.match;
      if (result.match) { if (card.closest('.ended-events')) endedCount++; else activeCount++; }
      let note = card.querySelector('.session-note');
      if (result.match && result.uncertain) {
        if (!note) { note = pair('该日期场次待确认，请查看预约日历。', 'Check the booking calendar for sessions on this date.', 'p', 'session-note'); card.querySelector('.actions').before(note); }
        note.hidden = false;
      } else if (note) note.hidden = true;
    });
    const archive = section.querySelector('.ended-events');
    if (archive) {
      archive.hidden = endedCount === 0;
      archive.querySelector('.ended-count').replaceChildren(pair(`本周已结束 · ${endedCount} 条`, `Finished this week · ${endedCount}`));
      archive.dispatchEvent(new Event('kids:archive-filter'));
    }
    const includeEnded = Boolean(localFilters.date);
    renderCount(section, activeCount + (includeEnded ? endedCount : 0), activeFilters, includeEnded && endedCount > 0);
    let empty = section.querySelector('.empty-events');
    const noMatches = activeCount + (includeEnded ? endedCount : 0) === 0;
    if (noMatches && !empty) { empty = element('p', 'empty-events'); section.querySelector('.event-count').after(empty); }
    if (empty) {
      empty.hidden = !noMatches;
      empty.replaceChildren(activeFilters
        ? pair('没有符合条件的可参加活动，试试其他日期或清除筛选。', 'No available events match. Try another date or clear the filters.')
        : pair('本周活动已结束，请查看下一期更新。', 'This week’s events have finished. Please check the next edition.'));
    }
  });
}
new MutationObserver(() => {
  if (dialog.open) dialog.close();
  refresh();
}).observe(root, { attributes: true, attributeFilter: ['data-city', 'data-lang', 'data-view'] });
refresh();
try {
  const load = async url => {
    const response = await fetch(new URL(url, document.baseURI), { cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Unable to read ${url}: ${response.status}`);
    return response.json();
  };
  const [sydney, melbourne, dates] = await Promise.all([load('data/events.json'), load('data/melbourne-events.json'), load('data/event-presentation.json')]);
  const period = document.querySelector('.meta-bar').dataset;
  if ([sydney, melbourne].some(feed => feed.periodStart !== period.periodStart || feed.periodEnd !== period.periodEnd)) {
    throw new Error('Static fallback and event feeds belong to different publication weeks.');
  }
  feeds.sydney = sydney; feeds.melbourne = melbourne; availability = dates;
  toolbar.hidden = false;
  root.dataset.fieldNotesReady = 'true';
  refresh();
  const target = document.getElementById(new URLSearchParams(location.search).get('event'));
  if (target?.closest('.ended-events')) target.closest('.ended-events').dispatchEvent(new CustomEvent('kids:open-ended',{detail:{id:target.id}}));
  else if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
} catch (error) {
  // The original full static list remains usable when the optional filters cannot load.
  root.dataset.fieldNotesReady = 'fallback';
  console.warn('Optional filters unavailable; preserved static event content.', error);
}
