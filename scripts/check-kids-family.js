// Run via Playwright CLI on local /kids/ or the authorised public release.
async page => {
  const base=new URL('./',page.url()).href;
  const key='sconmyway-kids-saved-v1';
  let assertions=0;
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const check=(ok,message)=>{ assertions++; if(!ok) throw new Error(message); };
  const ready=async()=>{ await page.waitForFunction(()=>document.body.dataset.familyToolsReady==='true'&&document.body.dataset.fieldNotesReady==='true'); await page.evaluate(()=>document.fonts.ready); };
  const go=async query=>{ await page.goto(`${base}?${query}`); await ready(); };
  await go('lang=zh&city=sydney');
  const backup=await page.evaluate(key=>localStorage.getItem(key),key);
  let second;
  try {
    await page.evaluate(key=>localStorage.removeItem(key),key); await page.reload(); await ready();
    const integrity=await page.evaluate(async()=>{
      const read=async path=>(await fetch(new URL(path,document.baseURI))).json();
      const [a,b,p]=await Promise.all([read('data/events.json'),read('data/melbourne-events.json'),read('data/event-presentation.json')]);
      const failures=[];
      for(const feed of [a,b]) for(const event of feed.events) {
        const card=[...document.querySelectorAll('.card[data-share-key]')].find(card=>card.dataset.shareKey===event.shareKey);
        if(!card) { failures.push('Missing '+event.shareKey); continue; }
        const row=card.querySelector('.fact:first-child');
        if(row.dataset.originalTimeZh!==event.timeZh||row.dataset.originalTimeEn!==event.timeEn) failures.push('Time facts '+event.shareKey);
        const route=p.items[event.shareKey]?.route;
        if(route) {
          const rows=[...card.querySelectorAll('.route-expanded li')];
          if(rows.length!==route.steps.length) failures.push('Route count '+event.shareKey);
          rows.forEach((row,i)=>{ if(new URL(row.querySelector('a').href).searchParams.get('query')!==route.steps[i][4]) failures.push('Map '+event.shareKey); });
          for(const [lang,suffix] of [['zh','Zh'],['en','En']]) if(card.querySelector('.route-evidence-note .'+lang).textContent!==route['note'+suffix]) failures.push('Route note '+event.shareKey);
        }
      }
      return failures;
    });
    check(integrity.length===0,integrity.join('; '));
    const firstId=await page.locator('.cards[data-city-panel="sydney"] .card').first().getAttribute('id');
    const first=page.locator(`[id="${firstId}"]`);
    if(!await first.isVisible()) await go(`lang=zh&city=sydney&event=${firstId}`);
    await first.locator('.save-outing').click();
    check(await first.locator('.save-outing').getAttribute('aria-pressed')==='true','Save current outing');
    await page.reload(); await ready();
    check(await first.locator('.save-outing').getAttribute('aria-pressed')==='true','Save persists');
    if(await page.locator('dialog[open]').count()) await page.keyboard.press('Escape');
    await page.locator('[data-set-view="playgrounds"]').click();
    const spot=page.locator('.area-directory[data-city-panel="sydney"] .playground-spot').first();
    const spotId=await spot.getAttribute('id');
    await spot.locator('.save-outing').click();
    await go('lang=en&city=melbourne');
    const melbourne=page.locator('.cards[data-city-panel="melbourne"] > .card').first();
    if(await melbourne.count()) await melbourne.locator('.save-outing').click();
    const savedCount=Number(await page.locator('.saved-count').textContent());
    check(savedCount>1,'Saves span views and cities');
    await page.locator('.saved-entry').click();
    check(!/[\u3400-\u9fff]/.test(await page.locator('.saved-dialog').innerText()),'English saved list');
    const link=page.locator(`.saved-item-title[href*="event=${firstId}"]`);
    await link.click(); await ready();
    check(await page.locator(`[id="${firstId}"]`).isVisible(),'Saved link targets exact card');
    await page.locator(`[id="${firstId}"] .save-outing`).click();
    check(Number(await page.locator('.saved-count').textContent())===savedCount-1,'Unsave');
    await page.locator('.saved-entry').click();
    await page.locator(`.saved-item-title[href*="event=${spotId}"]`).click(); await ready();
    check(new URL(page.url()).searchParams.get('view')==='playgrounds'&&await page.locator(`[id="${spotId}"]`).isVisible(),'Saved playground target');
    await go('lang=zh&city=sydney');
    const archive=page.locator('.cards[data-city-panel="sydney"] .ended-events');
    if(await archive.count()) {
      check(await archive.locator(':scope > summary').count()===0,'Archive entry has no arrow');
      await archive.locator('.ended-open').click();
      const targetId=await archive.locator('.ended-item-open').first().getAttribute('data-event-id');
      await archive.locator('.ended-item-open').first().click();
      check(await page.locator(`[id="${targetId}"]`).isVisible()&&await page.locator('dialog[open]').count()===1,'Ended detail uses one sheet');
      check((await archive.locator('.ended-status').innerText()).includes('已结束'),'Finished status explicit');
      await archive.locator('.ended-back').click();
      check(await archive.locator('.ended-index').isVisible(),'Back to finished list');
      await page.keyboard.press('Escape');
      check(await archive.locator('.ended-open').evaluate(node=>node===document.activeElement),'Archive focus restored');
      await go(`lang=en&city=sydney&event=${targetId}`);
      check(await page.locator(`[id="${targetId}"]`).isVisible()&&await page.locator('dialog[open]').count()===1,'Old share opens ended detail directly');
      await page.keyboard.press('Escape');
    }
    for(const language of ['zh','en']) for(const city of ['sydney','melbourne']) {
      await go(`lang=${language}&city=${city}`);
      const section=page.locator(`.cards[data-city-panel="${city}"]`);
      const ids=await section.locator('.card').evaluateAll(cards=>cards.map(card=>card.id));
      for(const [width,height] of [[320,568],[375,667],[393,852],[430,900]]) {
        await page.setViewportSize({width,height});
        check(await page.evaluate(()=>document.querySelector('header').getBoundingClientRect().height<=48&&document.documentElement.scrollWidth===innerWidth),'Compact header');
        for(const id of ids) {
          const card=page.locator(`[id="${id}"]`);
          const ended=await card.evaluate(card=>Boolean(card.closest('.ended-events')));
          if(ended) { await section.locator('.ended-open').click(); await page.locator(`.ended-item-open[data-event-id="${id}"]`).click(); }
          check(await card.locator('details,summary,.route-chevron').count()===0,'No inline card arrow controls');
          const shape=await card.evaluate(card=>{
            const box=card.getBoundingClientRect();
            const actions=[...card.querySelector('.actions').children].map(node=>node.getBoundingClientRect());
            return box.right<=innerWidth+1&&card.scrollWidth<=card.clientWidth+1&&actions.every(node=>Math.abs(node.top-actions[0].top)<1&&node.height>=44);
          });
          check(shape,`Card fits ${language}/${city}/${width}/${id}`);
          const controls=card.locator('.route-open,.schedule-open');
          for(let i=0;i<await controls.count();i++) {
            const control=controls.nth(i);
            await control.click();
            check(await page.locator('dialog[open]').count()===1,'No nested modals');
            const modal=page.locator('dialog[open]');
            const bounds=await modal.boundingBox();
            const close=modal.locator('.ended-close,.outing-dialog-head .icon-button').first();
            const closeBox=await close.boundingBox();
            check(bounds.x>=-1&&bounds.y>=-1&&bounds.x+bounds.width<=width+1&&bounds.y+bounds.height<=height+1&&closeBox.y>=0&&closeBox.y+closeBox.height<=height,'Sheet and close reachable');
            check(await modal.evaluate(node=>node.scrollWidth<=node.clientWidth+1),'Sheet has no horizontal overflow');
            if(language==='en') check(!/[\u3400-\u9fff]/.test(await modal.innerText()),'English detail sheet');
            if(ended) await modal.locator('.ended-back').click(); else await page.keyboard.press('Escape');
            check(await card.isVisible(),'Returns to same card');
          }
          if(ended) await page.keyboard.press('Escape');
        }
      }
    }
    await go('lang=zh&city=sydney'); await page.setViewportSize({width:393,height:852});
    await page.screenshot({path:'kids/output/published-family-phone.png',animations:'disabled'});
    if(await page.locator('.cards[data-city-panel="sydney"] .ended-open').count()) {
      await page.locator('.cards[data-city-panel="sydney"] .ended-open').click();
      await page.screenshot({path:'kids/output/published-ended-list.png',animations:'disabled'});
      await page.locator('.ended-dialog[open] .ended-item-open').first().click();
      await page.screenshot({path:'kids/output/published-ended-detail.png',animations:'disabled'});
      await page.keyboard.press('Escape');
    }
    const stale={id:'test-not-in-current-edition',city:'sydney',view:'events',titleZh:'历史活动',titleEn:'Earlier outing'};
    await page.evaluate(({key,stale})=>localStorage.setItem(key,JSON.stringify({version:1,items:[stale]})),{key,stale}); await page.reload(); await ready();
    await page.locator('.saved-entry').click();
    check(await page.locator('.saved-item-title').getAttribute('href')===null,'Missing-edition favourite is not a broken link');
    await page.locator('.saved-remove').click();
    check(await page.locator('.saved-empty').isVisible(),'Removing last saved item gives empty state');
    await page.keyboard.press('Escape');
    await page.evaluate(key=>localStorage.setItem(key,'{invalid'),key); await page.reload(); await ready();
    check(await page.locator('.saved-count').isHidden(),'Corrupt storage does not break page');
    check(errors.length===0,errors.join('; '));
    return {status:'passed',assertions,pageErrors:errors};
  } finally {
    if(second) await second.close();
    await page.evaluate(({key,backup})=>backup===null?localStorage.removeItem(key):localStorage.setItem(key,backup),{key,backup});
    await go('lang=zh&city=sydney');
  }
}
