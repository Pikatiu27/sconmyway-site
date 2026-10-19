(() => {
  "use strict";
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Sydney", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date()).filter(part => part.type !== "literal").map(part => [part.type, part.value]));
  const today = `${parts.year}-${parts.month}-${parts.day}`;
  function pair(zh, en, tag = "span") {
    const element = document.createElement(tag);
    [["zh", zh], ["en", en]].forEach(([lang, value]) => {
      const span = document.createElement("span");
      span.className = lang;
      span.textContent = value;
      element.append(span);
    });
    return element;
  }
  document.querySelectorAll('.cards[data-view-panel="events"]').forEach(section => {
    const cards = [...section.children].filter(item => item.matches(".card"));
    const ended = cards.filter(card => /^\d{4}-\d{2}-\d{2}$/.test(card.dataset.endsOn) && card.dataset.endsOn < today);
    const count = cards.length - ended.length;
    if (ended.length) {
      const archive = document.createElement("details");
      archive.className = "ended-events";
      archive.append(pair(`本周已结束 · ${ended.length} 条`, `Finished this week · ${ended.length}`, "summary"));
      const list = document.createElement("div");
      list.className = "ended-list";
      ended.forEach(card => list.append(card));
      archive.append(list);
      section.append(archive);
    }
    section.querySelector(".event-count")?.replaceChildren(pair(`还能去的 ${count} 条`, `${count} events still to enjoy`));
    if (!count && !section.querySelector(".empty-events")) {
      const empty = pair("本周活动已结束，请查看下一期更新。", "This week's events have finished. Please check the next edition.", "p");
      empty.className = "empty-events";
      section.querySelector(".event-count").after(empty);
    }
  });
  const target = document.getElementById(new URLSearchParams(location.search).get("event"));
  if (target?.closest(".ended-events")) {
    target.closest(".ended-events").open = true;
    target.scrollIntoView({ block: "start" });
  }
})();
