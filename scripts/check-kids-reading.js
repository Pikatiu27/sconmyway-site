// Run through Playwright CLI on the local or published kids page.
async page => {
  const base=new URL('./',page.url()).href;
  let assertions=0;
  const check=(ok,message)=>{assertions++;if(!ok)throw new Error(message);};
  for(const city of ['sydney','melbourne']) for(const language of ['zh','en']) {
    await page.goto(`${base}?city=${city}&lang=${language}`);
    await page.waitForFunction(()=>document.body.dataset.familyToolsReady==='true'&&document.body.dataset.fieldNotesReady==='true');
    await page.evaluate(()=>document.fonts.ready);
    for(const width of [320,375,393,430]) {
      await page.setViewportSize({width,height:852});
      const result=await page.evaluate(async({city,language})=>{
        const feed=await(await fetch(`data/${city==='sydney'?'events':'melbourne-events'}.json`,{cache:'no-store'})).json();
        const p=await(await fetch('data/event-presentation.json',{cache:'no-store'})).json();
        const section=document.querySelector(`.cards[data-city-panel="${city}"]`);
        const failures=[];
        for(const event of feed.events) {
          const card=[...section.querySelectorAll('.card')].find(card=>card.dataset.shareKey===event.shareKey);
          if(!card){failures.push('missing card');continue;}
          const item=p.items[event.shareKey]||{};
          const suffix=language==='zh'?'Zh':'En';
          const css=selector=>getComputedStyle(card.querySelector(selector));
          if(card.querySelectorAll(':scope > [role="group"]').length!==3)failures.push('groups');
          if(card.querySelector(`.summary.${language}`).textContent!==(item['intro'+suffix]||event['summary'+suffix]))failures.push('intro changed');
          if(css('.summary').fontSize!=='15px'||css('.summary').fontWeight!=='400'||css('.summary').color!==css('h3').color)failures.push('body role');
          const family=card.querySelector('.family-fit');
          if(family) {
            const style=getComputedStyle(family);
            if(style.fontSize!=='14px'||style.fontWeight!=='400'||!(card.querySelector('.summary').compareDocumentPosition(family)&Node.DOCUMENT_POSITION_FOLLOWING))failures.push('family role');
            if(family.querySelector('.'+language).textContent!==item['familyFit'+suffix])failures.push('family copy');
          }
          const note=card.querySelector(`.outing-note.${language}`);
          if(note) {
            const style=getComputedStyle(note);
            if(style.borderLeftWidth!=='0px'||style.paddingLeft!=='0px'||style.fontSize!=='14px')failures.push('reminder rail');
            if(note.textContent!==item['note'+suffix])failures.push('reminder changed');
            const expected=item.noteEmphasis?.[language]||[];
            if(JSON.stringify([...note.querySelectorAll('strong')].map(node=>node.textContent))!==JSON.stringify([...expected].sort((a,b)=>note.textContent.indexOf(a)-note.textContent.indexOf(b))))failures.push('emphasis');
          }
          if(css('.reference').fontSize!=='12px'||css('.reference').borderTopWidth!=='1px')failures.push('source role');
          const current=card.querySelector('.summary.'+language);
          if(!current.getClientRects().length&&card.getClientRects().length)failures.push('hidden current language');
          const other=card.querySelector('.summary.'+(language==='zh'?'en':'zh'));
          if(other.getClientRects().length)failures.push('other language visible');
          for(const group of card.querySelectorAll(':scope > [role="group"]'))if(group.getAttribute('aria-label')!==group.dataset[language==='zh'?'labelZh':'labelEn'])failures.push('group language');
          const time=card.querySelector('.reading-time-copy');
          if(time&&time.querySelector(':scope > .'+(language==='zh'?'en':'zh')).getClientRects().length)failures.push('time language');
          for(const node of card.querySelectorAll('.summary,.family-fit,.outing-note,.reference'))if(node.getClientRects().length&&node.scrollWidth>node.clientWidth+1)failures.push('overflow');
        }
        return {failures,count:feed.events.length};
      },{city,language});
      check(result.failures.length===0,`${city}/${language}/${width}: ${result.failures.join(',')}`);
    }
  }
  // Future browser time exercises the same grouped card inside the finished sheet.
  const audit=await page.evaluate(async()=>{
    const read=async file=>(await fetch('data/'+file,{cache:'no-store'})).json();
    const p=await read('event-presentation.json');
    const feeds=[await read('events.json'),await read('melbourne-events.json')];
    return feeds.map(feed=>({city:feed.city.toLowerCase(),event:feed.events.find(event=>p.items[event.shareKey]?.route&&event.endsOn&&event.endsOn<feed.periodEnd)})).filter(item=>item.event);
  });
  for(const {city,event} of audit) {
    const context=await page.context().browser().newContext({viewport:{width:320,height:568}});
    try {
      const historic=await context.newPage();
      const next=new Date(event.endsOn+'T12:00:00+11:00');next.setUTCDate(next.getUTCDate()+1);
      await historic.clock.install({time:next});
      await historic.goto(`${base}?city=${city}&lang=en`);
      await historic.waitForFunction(()=>document.body.dataset.familyToolsReady==='true'&&document.body.dataset.fieldNotesReady==='true');
      const section=historic.locator(`.cards[data-city-panel="${city}"]`);
      const card=section.locator('.card').filter({has:historic.locator(`a.action.primary[href="${event.url}"]`)});
      const id=await card.getAttribute('id');
      await section.locator('.ended-open').click();
      await historic.locator(`.ended-item-open[data-event-id="${id}"]`).click();
      check(await card.locator('.reading-experience').isVisible(),'Finished card keeps reading groups');
      const note=card.locator('.outing-note.en');
      check(!await note.count()||await note.evaluate(node=>getComputedStyle(node).borderLeftWidth==='0px'),'Finished note has no rail');
      await card.locator('.route-open').click();
      check(await historic.locator('dialog[open]').count()===1&&await historic.locator('.ended-dialog[open] .ended-secondary').isVisible(),'Finished route uses one modal');
      await historic.locator('.ended-dialog[open] .ended-back').click();
      check(await card.isVisible(),'Return from route restores original card');
      await historic.keyboard.press('Escape');
      await historic.goto(`${base}?city=${city}&lang=en&event=${encodeURIComponent(id)}`);
      await historic.waitForSelector('.ended-dialog[open]');
      check(await historic.locator('.ended-detail .card').getAttribute('id')===id,'Finished share opens exact grouped outing');
    } finally {await context.close();}
  }
  await page.goto(base+'?lang=zh&city=sydney');
  await page.setViewportSize({width:393,height:852});
  await page.screenshot({path:'kids/output/reading-release-phone.png',animations:'disabled'});
  return {status:'passed',assertions,combinations:16};
}
