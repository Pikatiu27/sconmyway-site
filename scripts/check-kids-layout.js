// Run with Playwright CLI after opening the intended local or public /kids/ page.
async page => {
  const base = new URL('./', page.url()).href;
  const screenshots = 'kids/output';
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let combinations = 0;
  let assertions = 0;
  const check = (ok, message) => { assertions++; if (!ok) throw new Error(message); };
  const ready = async () => {
    await page.waitForFunction(() => document.body.dataset.fieldNotesReady === 'true');
    await page.evaluate(() => document.fonts.ready);
  };
  await ready();
  const snapshot = await page.evaluate(async () => {
    const read = async path => (await fetch(path, {cache:'no-store'})).json();
    const [sydney,melbourne,presentation] = await Promise.all([read('data/events.json'),read('data/melbourne-events.json'),read('data/event-presentation.json')]);
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
    return {sydney,melbourne,presentation,today:`${parts.year}-${parts.month}-${parts.day}`};
  });
  for (const language of ['zh','en']) for (const city of ['sydney','melbourne']) {
    await page.goto(`${base}?lang=${language}&city=${city}`); await ready();
    for (const width of [320,360,375,390,393,412,430,1280]) {
      await page.setViewportSize({width,height:844});
      for (const view of ['events','playgrounds']) {
        await page.locator(`[data-set-view="${view}"]`).click();
        if (view === 'events') await page.locator(`.cards[data-city-panel="${city}"] .ended-events`).evaluateAll(items => items.forEach(item => item.open = true));
        const shape = await page.evaluate(() => {
          const visible = item => !!item.getClientRects().length && getComputedStyle(item).visibility !== 'hidden';
          const select = document.querySelector('#city-select');
          const style = getComputedStyle(select);
          const ctx = document.createElement('canvas').getContext('2d');
          ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          const cityFits = ctx.measureText(select.selectedOptions[0].textContent).width <= select.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
          const badActions = [...document.querySelectorAll('.actions,.spot-actions')].filter(visible).filter(row => {
            const boxes = [...row.children].filter(visible).map(item=>item.getBoundingClientRect());
            return boxes.some(box => Math.abs(box.top-boxes[0].top)>1 || box.height<44);
          }).length;
          const overflow = [...document.querySelectorAll('h1,.event-heading,.facts,.summary,.actions,.spot-actions,.half-day-route,.more-panel')].filter(visible).filter(item => item.getBoundingClientRect().right>innerWidth+1 || item.scrollWidth>item.clientWidth+1).map(item=>item.className);
          const range = document.createRange();
          range.selectNodeContents(document.querySelector(`h1 .${document.body.dataset.lang}`));
          const photos = [...document.images].filter(item => !item.classList.contains('fn-icon') && !item.classList.contains('route-chevron')).length;
          const phoneFactsStacked = innerWidth>600 || [...document.querySelectorAll('.facts')].filter(visible).every(facts => {
            const rows = [...facts.children].map(item=>item.getBoundingClientRect());
            return rows.every((row,index)=>index===0 || row.top>=rows[index-1].bottom);
          });
          return {width:innerWidth,scroll:document.documentElement.scrollWidth,cityFits,badActions,overflow,titleLines:range.getClientRects().length,photos,phoneFactsStacked};
        });
        check(shape.width===shape.scroll, `Page overflow ${language}/${city}/${view}/${width}`);
        check(shape.cityFits, `City label wraps ${language}/${city}/${width}`);
        check(shape.badActions===0, `Actions wrap/undersize ${language}/${city}/${view}/${width}`);
        check(shape.overflow.length===0, `Component overflow: ${shape.overflow}`);
        check(shape.titleLines===1, `H1 wraps ${language}/${width}`);
        check(shape.photos===0, 'No published photographs');
        check(shape.phoneFactsStacked, 'Phone time/place/cost must use separate full-width rows');
        if (language==='en') {
          const visibleCopy = await page.evaluate(()=>document.body.innerText.replace('中文',''));
          check(!/[\u3400-\u9fff]/.test(visibleCopy), 'English view contains no Chinese copy except its language switch');
        }
        combinations++;
      }
    }
  }
  await page.goto(`${base}?lang=zh`); await ready();
  await page.setViewportSize({width:393,height:852});
  const section = page.locator('.cards[data-city-panel="sydney"]');
  const active = snapshot.sydney.events.filter(event=>!event.endsOn || event.endsOn>=snapshot.today);
  check(await section.locator(':scope > .card:not([hidden])').count()===active.length, 'Current-day ended folding matches facts');
  await page.locator('#events-free').check();
  check(await section.locator(':scope > .card:not([hidden])').count()===active.filter(event=>/^Free\b/i.test(event.priceEn)).length, 'Free entry filter matches actual entry prices');
  await page.getByRole('button',{name:'清除筛选',exact:true}).click();
  await page.getByRole('button',{name:'日期',exact:true}).click();
  const selectedDate = snapshot.sydney.periodStart;
  await page.locator(`input[name="date"][value="${selectedDate}"]`).check();
  await page.getByRole('button',{name:'查看活动',exact:true}).click();
  const expected = await page.evaluate(async ({feed,presentation,date}) => {
    const {matchEvent} = await import('./event-filters.mjs');
    return feed.events.filter(event=>matchEvent(event,{area:'',date,free:false},feed,presentation).match).length;
  },{feed:snapshot.sydney,presentation:snapshot.presentation,date:selectedDate});
  check(await section.locator('.card:not([hidden])').count()===expected, 'Date filter uses current reviewed dates including uncertain calendars');
  await page.locator('#city-select').selectOption('melbourne');
  check(await page.locator('.filter-status').isHidden(), 'Filter state does not leak between cities');
  await page.locator('#city-select').selectOption('sydney');
  check(await page.locator('.filter-status').isVisible(), 'Returning city retains its filters');
  await page.getByRole('button',{name:'清除筛选',exact:true}).click();
  const linkedId = await section.locator('.card').count() ? await section.locator('.card').first().getAttribute('id') : null;
  if (linkedId) {
    await page.goto(`${base}?lang=zh&city=sydney&event=${linkedId}`); await ready();
    const card = page.locator(`[id="${linkedId}"]`);
    check(await card.isVisible(), 'Shared deep link expands ended disclosure when required');
    await page.context().grantPermissions(['clipboard-read','clipboard-write']);
    await card.locator('.share-action').click();
    const shareUrl = new URL(await page.evaluate(()=>navigator.clipboard.readText()));
    check(shareUrl.origin===new URL(base).origin && shareUrl.pathname===new URL(base).pathname, 'Share stays on the current deployment');
    check(shareUrl.searchParams.get('event')===linkedId && shareUrl.searchParams.get('city')==='sydney' && shareUrl.searchParams.get('lang')==='zh', 'Share target is exact and bilingual');
  }
  for (const language of ['zh','en']) for (const city of ['sydney','melbourne']) {
    await page.goto(`${base}?lang=${language}&city=${city}`); await ready();
    await page.locator(`.cards[data-city-panel="${city}"] .ended-events`).evaluateAll(items=>items.forEach(item=>item.open=true));
    const routes = page.locator(`.cards[data-city-panel="${city}"] .half-day-route`);
    for (let i=0;i<await routes.count();i++) {
      const route = routes.nth(i);
      await route.locator('summary').click();
      check(await route.getAttribute('open')!==null, 'Route expands');
      const stops = await route.locator('li').evaluateAll(rows=>rows.map(row=>({gap:row.querySelector('a').getBoundingClientRect().left-row.querySelector('small').getBoundingClientRect().right,url:row.querySelector('a').href})));
      check(stops.length>0 && stops.every(stop=>stop.gap>=11 && stop.url.startsWith('https://www.google.com/maps/search/?api=1')), 'Route phase/place alignment and map links');
      await route.locator('summary').click();
      check(await route.getAttribute('open')===null, 'Route collapses');
    }
  }
  await page.goto(`${base}?lang=zh`); await ready();
  for (const [width,height] of [[320,568],[375,667],[393,852],[412,915]]) {
    await page.setViewportSize({width,height});
    await page.getByRole('button',{name:'日期',exact:true}).click();
    const sheet = await page.getByRole('dialog').boundingBox();
    const submit = await page.getByRole('button',{name:'查看活动',exact:true}).boundingBox();
    check(sheet.x>=-1 && sheet.y>=-1 && sheet.x+sheet.width<=width+1 && sheet.y+sheet.height<=height+1, 'Phone bottom sheet fits viewport');
    check(submit.y>=0 && submit.y+submit.height<=height, 'Apply always reachable on short phone screens');
    await page.keyboard.press('Escape');
    check(!await page.getByRole('dialog').isVisible(), 'Escape closes filter sheet');
  }
  for (const language of ['zh','en']) for (const city of ['sydney','melbourne']) {
    await page.goto(`${base}?lang=${language}&city=${city}`); await ready();
    await page.setViewportSize({width:393,height:852});
    await page.screenshot({path:`${screenshots}/mobile-release-${city}-${language}.png`,fullPage:true});
  }
  await page.goto(`${base}?lang=zh`); await ready();
  await page.route('**/data/events.json',route=>route.abort());
  await page.reload();
  await page.waitForFunction(()=>document.body.dataset.fieldNotesReady==='fallback');
  check(await page.locator('.cards[data-city-panel="sydney"] .card').count()===snapshot.sydney.events.length, 'Network failure preserves complete static fallback');
  await page.unroute('**/data/events.json');
  await page.reload(); await ready();
  check(errors.length===0, `Browser errors: ${errors.join('; ')}`);
  return {combinations,assertions,errors,period:snapshot.sydney.periodStart,counts:[snapshot.sydney.events.length,snapshot.melbourne.events.length],status:'passed'};
}
