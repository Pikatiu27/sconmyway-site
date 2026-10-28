/* Date-based archive: one sheet for the list, outing and secondary details. */
(() => {
  'use strict';
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA',{
    timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit'
  }).formatToParts(new Date()).filter(part=>part.type!=='literal').map(part=>[part.type,part.value]));
  const today = `${parts.year}-${parts.month}-${parts.day}`;
  const el = (tag,className) => { const node=document.createElement(tag); node.className=className; return node; };
  const pair = (zh,en,tag='span',className='') => {
    const node=el(tag,className);
    for(const [language,value] of [['zh',zh],['en',en]]) { const span=el('span',language); span.textContent=value; node.append(span); }
    return node;
  };
  const icon = name => { const node=el('img','fn-icon'); node.src=`assets/icons/${name}.svg`; node.alt=''; node.setAttribute('aria-hidden','true'); return node; };
  document.querySelectorAll('.cards[data-view-panel="events"]').forEach(section => {
    const cards=[...section.children].filter(node=>node.matches('.card'));
    const ended=cards.filter(card=>/^\d{4}-\d{2}-\d{2}$/.test(card.dataset.endsOn) && card.dataset.endsOn<today);
    const count=cards.length-ended.length;
    if(ended.length) {
      const archive=el('section','ended-events');
      const row=el('div','ended-row');
      const caption=pair(`本周已结束 · ${ended.length} 条`, `Finished this week · ${ended.length}`,'p','ended-count');
      const trigger=el('button','ended-open detail-link');
      trigger.type='button';
      trigger.append(pair('查看','View'));
      trigger.setAttribute('aria-haspopup','dialog');
      row.append(caption,trigger);
      const store=el('div','ended-list');
      store.hidden=true;
      ended.forEach(card=>store.append(card));
      const dialog=el('dialog','ended-dialog');
      dialog.id=`ended-${section.dataset.cityPanel}`;
      trigger.setAttribute('aria-controls',dialog.id);
      const head=el('div','ended-head');
      const heading=pair('本周已结束','Finished this week','h2');
      heading.id=dialog.id+'-title';
      dialog.setAttribute('aria-labelledby',heading.id);
      const back=el('button','ended-back detail-link');
      back.type='button';
      back.hidden=true;
      const close=el('button','icon-button ended-close');
      close.type='button';
      close.append(icon('x'),pair('关闭','Close','span','sr-only'));
      head.append(heading,back,close);
      const body=el('div','ended-body');
      const index=el('ul','ended-index');
      const detail=el('div','ended-detail');
      detail.hidden=true;
      const finished=pair('已结束，仅供回看','Finished — for reference only','p','ended-status');
      detail.append(finished);
      const secondary=el('div','ended-secondary half-day-route');
      secondary.hidden=true;
      body.append(index,detail,secondary);
      dialog.append(head,body);
      archive.append(row,store,dialog);
      section.append(archive);
      let selected=null;
      let secondaryOwner=null;
      const restoreSecondary=()=>{
        if(secondaryOwner) { secondaryOwner.append(secondary.querySelector('.outing-dialog-body')); secondaryOwner=null; }
        secondary.hidden=true;
      };
      const restoreCard=()=>{
        restoreSecondary();
        ended.forEach(card=>store.append(card));
        selected=null;
      };
      const renderList=()=>{
        index.replaceChildren();
        ended.filter(card=>!card.hidden).forEach(card=>{
          const item=el('li','ended-index-item');
          const button=el('button','ended-item-open');
          button.type='button';
          button.dataset.eventId=card.id;
          button.append(pair(card.querySelector('h3 .zh').textContent,card.querySelector('h3 .en').textContent,'span','ended-item-title'));
          const date=card.querySelector('.date-ticket .sr-only')||card.querySelector('.date-ticket');
          const region=card.querySelector('.event-region');
          button.append(pair(
            [date.querySelector('.zh')?.textContent,region?.querySelector('.zh')?.textContent].filter(Boolean).join(' · '),
            [date.querySelector('.en')?.textContent,region?.querySelector('.en')?.textContent].filter(Boolean).join(' · '),
            'span','ended-item-meta'
          ));
          button.addEventListener('click',()=>showCard(card));
          item.append(button);
          index.append(item);
        });
      };
      const showList=()=>{
        restoreCard();
        heading.replaceChildren(pair('本周已结束','Finished this week'));
        index.hidden=false;
        detail.hidden=true;
        back.hidden=true;
        renderList();
        body.scrollTop=0;
      };
      const showCard=card=>{
        restoreCard();
        selected=card;
        detail.append(card);
        heading.replaceChildren(pair('活动详情','Outing details'));
        back.replaceChildren(pair('返回列表','Back to list'));
        back.hidden=false;
        index.hidden=true;
        detail.hidden=false;
        body.scrollTop=0;
      };
      trigger.addEventListener('click',()=>{ showList(); dialog.showModal(); });
      back.addEventListener('click',()=>{
        if(secondaryOwner) {
          restoreSecondary();
          detail.hidden=false;
          heading.replaceChildren(pair('活动详情','Outing details'));
          back.replaceChildren(pair('返回列表','Back to list'));
          body.scrollTop=0;
        } else {
          const id=selected?.id;
          showList();
          [...index.querySelectorAll('button')].find(button=>button.dataset.eventId===id)?.focus();
        }
      });
      close.addEventListener('click',()=>dialog.close());
      dialog.addEventListener('close',()=>{ restoreCard(); index.hidden=false; detail.hidden=true; });
      dialog.addEventListener('click',event=>{
        if(event.target!==dialog) return;
        const box=dialog.getBoundingClientRect();
        if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom) dialog.close();
      });
      archive.addEventListener('kids:archive-filter',()=>{ if(!selected) renderList(); });
      archive.addEventListener('kids:open-ended',event=>{
        const card=ended.find(card=>card.id===event.detail.id);
        if(!card) return;
        if(selected!==card) showCard(card);
        if(!dialog.open) dialog.showModal();
      });
      archive.addEventListener('kids:ended-detail',event=>{
        if(!selected||!dialog.open) return;
        restoreSecondary();
        secondaryOwner=event.detail.dialog;
        const content=secondaryOwner.querySelector('.outing-dialog-body');
        secondary.append(content);
        heading.replaceChildren(...[...secondaryOwner.querySelector('h2').childNodes].map(node=>node.cloneNode(true)));
        back.replaceChildren(pair('返回活动','Back to outing'));
        detail.hidden=true;
        secondary.hidden=false;
        body.scrollTop=0;
      });
    }
    section.querySelector('.event-count')?.replaceChildren(pair(`还能去的 ${count} 条`, `${count} events still to enjoy`));
    if(!count && !section.querySelector('.empty-events')) {
      const empty=pair('本周活动已结束，请查看下一期更新。',"This week's events have finished. Please check the next edition.",'p','empty-events');
      section.querySelector('.event-count').after(empty);
    }
  });
  const target=document.getElementById(new URLSearchParams(location.search).get('event'));
  target?.closest('.ended-events')?.dispatchEvent(new CustomEvent('kids:open-ended',{detail:{id:target.id}}));
})();
