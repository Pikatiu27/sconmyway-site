/* Shared family-journal interactions. Event-specific copy is generated from weekly metadata. */
(() => {
  'use strict';
  const root = document.body;
  const lang = () => root.dataset.lang === 'en' ? 'en' : 'zh';
  const text = (zh, en) => lang() === 'zh' ? zh : en;
  const el = (tag, className, content) => {
    const node = document.createElement(tag);
    node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  };
  const pair = (zh, en, className = '', tag = 'span') => {
    const node = el(tag, className);
    node.append(el('span', 'zh', zh), el('span', 'en', en));
    return node;
  };
  const icon = name => {
    const image = el('img', 'fn-icon');
    image.src = name === 'bookmark' ? 'assets/icons/bookmark.svg' : `assets/icons/${name}.svg`;
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    return image;
  };
  const detailDialog = (card, kind, titleZh, titleEn, content) => {
    const dialog = el('dialog', 'outing-dialog');
    dialog.dataset.kind = kind;
    dialog.id = `${card.id}-${kind}-dialog`;
    const head = el('div', 'outing-dialog-head');
    const title = pair(titleZh, titleEn, '', 'h2');
    title.id = `${dialog.id}-title`;
    dialog.setAttribute('aria-labelledby', title.id);
    const close = el('button', 'icon-button');
    close.type = 'button';
    close.append(icon('x'),pair('关闭', 'Close', 'sr-only'));
    close.addEventListener('click', () => dialog.close());
    head.append(title,close);
    const body = el('div', 'outing-dialog-body');
    const heading = card.querySelector('h3');
    body.append(pair(heading.querySelector('.zh').textContent,heading.querySelector('.en').textContent,'outing-dialog-caption','p'),content);
    dialog.append(head,body);
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    return dialog;
  };
  for (const card of document.querySelectorAll('.cards .card[data-share-key]')) {
    const schedule = card.querySelector('.schedule-details');
    if (schedule) {
      const copy = schedule.querySelector('.schedule-copy');
      const wrapper = el('div','schedule-details');
      const button = el('button','detail-link schedule-open');
      button.type = 'button';
      button.append(pair('完整时间','Full opening hours'));
      const dialog = detailDialog(card,'schedule','日期与开放时刻','Dates and opening hours',copy);
      button.setAttribute('aria-haspopup','dialog');
      button.setAttribute('aria-controls',dialog.id);
      button.addEventListener('click',() => openDetail(card,dialog));
      wrapper.append(button,dialog);
      schedule.replaceWith(wrapper);
    }
    const route = card.querySelector('.half-day-route');
    if (!route) continue;
    route.querySelector('.route-expanded > p')?.classList.add('route-evidence-note');
    route.querySelector('ol').after(pair('附近站点按体力选去，不必走完全程。','Choose the extra stops to suit your family; there is no need to do the whole route.','route-flexibility','p'));
    const preview = el('div','half-day-route');
    const summary = el('div','route-preview');
    const path = route.querySelector('.route-short-path');
    path.querySelectorAll('span').forEach(span => { span.textContent = span.textContent.replaceAll(' → ',' · '); });
    const button = el('button','detail-link route-open');
    button.type = 'button';
    button.append(icon('map-pin'),pair('看路线','View route'));
    const dialog = detailDialog(card,'route','半日路线','Half-day plan',route.querySelector('.route-expanded'));
    button.setAttribute('aria-haspopup','dialog');
    button.setAttribute('aria-controls',dialog.id);
    button.addEventListener('click',() => openDetail(card,dialog));
    summary.append(pair('半日路线','Half-day plan','route-preview-title','strong'),button,path);
    preview.append(summary,dialog);
    route.replaceWith(preview);
  }
  function openDetail(card,dialog) {
    const archive = card.closest('.ended-events');
    if (archive?.querySelector('.ended-dialog')?.open) {
      archive.dispatchEvent(new CustomEvent('kids:ended-detail',{detail:{dialog}}));
    } else dialog.showModal();
  }

  const storageKey = 'sconmyway-kids-saved-v1';
  const validItem = item => item && typeof item.id === 'string' && ['sydney','melbourne'].includes(item.city) && ['events','playgrounds'].includes(item.view) && typeof item.titleZh === 'string' && typeof item.titleEn === 'string';
  const readSaved = () => {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || 'null');
      return value?.version === 1 && Array.isArray(value.items) ? value.items.filter(validItem) : [];
    } catch { return []; }
  };
  let saved = readSaved();
  const itemKey = item => `${item.city}:${item.view}:${item.id}`;
  const items = [...document.querySelectorAll('.cards .card,.area-directory .playground-spot')].map(card => {
    const view = card.classList.contains('playground-spot') ? 'playgrounds' : 'events';
    const section = card.closest('[data-city-panel]');
    const heading = card.querySelector(view === 'events' ? 'h3' : '.spot-title');
    return { card, id:card.id, city:section.dataset.cityPanel, view,
      titleZh:heading.querySelector('.zh')?.textContent || heading.textContent,
      titleEn:heading.querySelector('.en')?.textContent || heading.textContent,
      endsOn:card.dataset.endsOn || '' };
  });
  const registry = new Map(items.map(item => [itemKey(item), item]));
  const today = () => {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).filter(part => part.type !== 'literal').map(part => [part.type,part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  };
  const toast = el('p', 'save-toast');
  toast.hidden = true;
  toast.setAttribute('role', 'status');
  root.append(toast);
  let toastTimer;
  const announce = (zh, en) => {
    (document.querySelector('dialog[open]') || root).append(toast);
    toast.replaceChildren(pair(zh, en));
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
  };
  const dialog = el('dialog', 'saved-dialog');
  dialog.id = 'saved-outings';
  dialog.setAttribute('aria-labelledby', 'saved-title');
  const head = el('div', 'saved-head');
  const title = pair('我的收藏', 'Saved outings', '', 'h2');
  title.id = 'saved-title';
  const close = el('button', 'icon-button');
  close.type = 'button';
  close.append(icon('x'));
  head.append(title, close);
  const list = el('ul', 'saved-list');
  const empty = pair('还没有收藏的活动或游乐场。', 'No saved outings yet.', 'saved-empty', 'p');
  const saveError = pair('无法保存到浏览器，收藏未更改。', 'Could not save to this browser. Your saved list has not changed.', 'saved-error', 'p');
  saveError.hidden = true;
  saveError.setAttribute('role','alert');
  dialog.append(head, saveError, empty, list);
  root.append(dialog);
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  const entry = el('button', 'saved-entry');
  entry.type = 'button';
  entry.setAttribute('aria-haspopup','dialog');
  entry.setAttribute('aria-controls',dialog.id);
  entry.append(icon('bookmark'));
  const count = el('span', 'saved-count');
  entry.append(count);
  document.querySelector('.header-tools').prepend(entry);
  entry.addEventListener('click', () => { render(); dialog.showModal(); });
  const change = item => {
    const key = itemKey(item);
    const removing = saved.some(value => itemKey(value) === key);
    const {card, button, ...record} = item;
    const next = removing ? saved.filter(value => itemKey(value) !== key) : [...saved, record];
    try { localStorage.setItem(storageKey,JSON.stringify({version:1,items:next})); }
    catch {
      saveError.hidden = false;
      announce('无法保存到浏览器，收藏未更改。', 'Could not save to this browser. Your saved list has not changed.');
      return;
    }
    saveError.hidden = true;
    saved = next;
    render();
    announce(removing ? '已取消收藏' : '已收藏', removing ? 'Removed from saved outings' : 'Outing saved');
  };
  for (const item of items) {
    const button = el('button', 'save-outing');
    button.type = 'button';
    button.append(icon('bookmark'));
    item.button = button;
    item.card.append(button);
    button.addEventListener('click', () => change(item));
  }
  function render() {
    const keys = new Set(saved.map(itemKey));
    entry.setAttribute('aria-label',text(`我的收藏，${saved.length}项`, `Saved outings, ${saved.length} items`));
    entry.title = text('我的收藏','Saved outings');
    count.textContent = String(saved.length);
    count.hidden = saved.length === 0;
    close.setAttribute('aria-label',text('关闭收藏','Close saved outings'));
    for (const item of items) {
      const pressed = keys.has(itemKey(item));
      item.button.setAttribute('aria-pressed',String(pressed));
      item.button.setAttribute('aria-label', text(`${pressed ? '取消收藏' : '收藏'}：${item.titleZh}`,`${pressed ? 'Unsave' : 'Save'}: ${item.titleEn}`));
      item.button.title = text(pressed ? '取消收藏' : '收藏',pressed ? 'Unsave' : 'Save');
    }
    const focusedKey = document.activeElement?.dataset.removeSaved;
    const focusedIndex = focusedKey ? saved.findIndex(item => itemKey(item) === focusedKey) : -1;
    list.replaceChildren();
    empty.hidden = saved.length !== 0;
    list.hidden = saved.length === 0;
    for (const snapshot of saved) {
      const current = registry.get(itemKey(snapshot));
      const item = current || snapshot;
      const row = el('li','saved-item');
      const copy = el('div','saved-item-copy');
      const caption = lang() === 'zh' ? item.titleZh : item.titleEn;
      const heading = el(current ? 'a' : 'span','saved-item-title',caption);
      if (current) {
        const url = new URL(location.href);
        url.searchParams.set('city',item.city);
        url.searchParams.set('lang',lang());
        url.searchParams.set('view',item.view);
        url.searchParams.set('event',item.id);
        url.hash = '';
        heading.href = url.href;
      }
      const city = item.city === 'sydney' ? text('悉尼','Sydney') : text('墨尔本','Melbourne');
      const type = item.view === 'events' ? text('活动','Event') : text('游乐场','Playground');
      const status = !current ? text('本期未收录','Not in this edition') : item.endsOn && item.endsOn < today() ? text('已结束','Finished') : '';
      copy.append(heading,el('p','saved-item-meta',[city,type,status].filter(Boolean).join(' · ')));
      const remove = el('button','saved-remove');
      remove.type = 'button';
      remove.dataset.removeSaved = itemKey(snapshot);
      remove.setAttribute('aria-label',text(`取消收藏：${item.titleZh}`,`Unsave: ${item.titleEn}`));
      remove.title = text('取消收藏','Unsave');
      remove.append(icon('x'));
      remove.addEventListener('click', () => {
        const index = saved.findIndex(value => itemKey(value) === itemKey(snapshot));
        change(snapshot);
        if (dialog.open) (list.querySelectorAll('.saved-remove')[Math.max(0,Math.min(index,saved.length-1))] || close).focus();
      });
      row.append(copy,remove);
      list.append(row);
    }
    if (focusedIndex >= 0 && dialog.open) (list.querySelectorAll('.saved-remove')[focusedIndex] || close).focus();
  }
  new MutationObserver(() => render()).observe(root,{attributes:true,attributeFilter:['data-lang']});
  window.addEventListener('storage',event => { if (event.key === storageKey || event.key === null) { saved = readSaved(); render(); } });
  render();
  root.dataset.familyToolsReady = 'true';
})();
