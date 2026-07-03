import { mkdir, readFile, writeFile } from "node:fs/promises";

const siteDir = "kids";
const indexPath = `${siteDir}/index.html`;
const dataDir = `${siteDir}/data`;
const usageReportPath = `${siteDir}/TOKEN_USAGE.md`;
const candidateReportPath = `${siteDir}/CANDIDATE_POOL.md`;
const now = new Date();
const weekPeriod = getSydneyWeekPeriod(now);

const cityConfigs = [
  {
    key: "melbourne",
    name: "Melbourne",
    marker: "MELBOURNE_EVENTS",
    moreMarker: "MELBOURNE_MORE",
    dataPath: `${dataDir}/melbourne-events.json`,
    sources: [
      { name: "City of Melbourne", url: "https://whatson.melbourne.vic.gov.au/things-to-do/family-and-kids", tier: "A" },
      { name: "Melbourne Museum", url: "https://museumsvictoria.com.au/melbournemuseum/whats-on/", tier: "B" },
      { name: "Scienceworks", url: "https://museumsvictoria.com.au/scienceworks/whats-on/", tier: "B" },
      { name: "NGV Kids", url: "https://www.ngv.vic.gov.au/kids/", tier: "B" },
      { name: "ACMI", url: "https://www.acmi.net.au/whats-on/", tier: "B" },
      { name: "State Library Victoria", url: "https://www.slv.vic.gov.au/whats-on", tier: "B" },
      { name: "Royal Botanic Gardens Victoria", url: "https://www.rbg.vic.gov.au/whats-on/", tier: "B" },
      { name: "City of Yarra", url: "https://www.yarracity.vic.gov.au/things-to-do/events", tier: "A" },
      { name: "City of Port Phillip", url: "https://www.portphillip.vic.gov.au/explore-the-city/events-and-activities", tier: "A" },
      { name: "Merri-bek City Council", url: "https://www.merri-bek.vic.gov.au/exploring-merri-bek/events/", tier: "A" },
      { name: "City of Stonnington", url: "https://www.stonnington.vic.gov.au/Whats-On", tier: "A" },
      { name: "City of Boroondara", url: "https://www.boroondara.vic.gov.au/events", tier: "A" },
      { name: "City of Monash", url: "https://www.monash.vic.gov.au/Things-to-Do/Festivals-and-Events/Events", tier: "A" },
      { name: "Darebin City Council", url: "https://www.darebin.vic.gov.au/Events-and-facilities/Events", tier: "A" },
      { name: "Bunnings Kids DIY", url: "https://bookings.bunnings.com.au/events/au", tier: "B" },
      { name: "Fire Rescue Victoria", url: "https://www.frv.vic.gov.au/community-events", tier: "B" },
      { name: "CFA Events", url: "https://www.cfa.vic.gov.au/about-us/cfa-events/whats-on", tier: "B" },
      { name: "Zoos Victoria", url: "https://www.zoo.org.au/melbourne/whats-on", tier: "B" },
      { name: "Moonee Valley City Council", url: "https://mvcc.vic.gov.au/play/my-news-and-events/events/", tier: "A" },
      { name: "Maribyrnong City Council", url: "https://www.maribyrnong.vic.gov.au/arts-and-culture/Events", tier: "A" },
      { name: "Hobsons Bay City Council", url: "https://www.hobsonsbay.vic.gov.au/Community/Whats-on", tier: "A" },
      { name: "Brimbank City Council", url: "https://events.brimbank.vic.gov.au/", tier: "A" },
      { name: "Wyndham City Council", url: "https://www.wyndham.vic.gov.au/events-experiences/whats", tier: "A" },
      { name: "City of Kingston", url: "https://www.kingston.vic.gov.au/community/events/upcoming-events", tier: "A" },
      { name: "Banyule City Council", url: "https://www.banyule.vic.gov.au/Events-activities", tier: "A" },
      { name: "Whitehorse City Council", url: "https://www.whitehorse.vic.gov.au/things-do/whats-on", tier: "A" },
      { name: "Manningham Council", url: "https://www.manningham.vic.gov.au/events", tier: "A" },
      { name: "Maroondah City Council", url: "https://www.maroondah.vic.gov.au/Explore/Whats-on-in-Maroondah", tier: "A" },
      { name: "Knox City Council", url: "https://www.knox.vic.gov.au/whats-on", tier: "A" },
      { name: "City of Casey", url: "https://www.casey.vic.gov.au/events", tier: "A" },
      { name: "Greater Dandenong", url: "https://www.greaterdandenong.vic.gov.au/events", tier: "A" },
      { name: "Frankston City", url: "https://www.discoverfrankston.com/events", tier: "A" },
      { name: "Arts Centre Melbourne Families", url: "https://www.artscentremelbourne.com.au/whats-on/families", tier: "B" },
      { name: "Fed Square", url: "https://fedsquare.com/whats-on", tier: "B" },
      { name: "Immigration Museum", url: "https://museumsvictoria.com.au/immigrationmuseum/whats-on/", tier: "B" },
      { name: "Puffing Billy", url: "https://puffingbillyrailway.org.au/whats-on/", tier: "B" },
      { name: "CERES", url: "https://ceres.org.au/whats-on/", tier: "B" },
      { name: "Collingwood Children's Farm", url: "https://www.farm.org.au/whats-on", tier: "B" },
      { name: "Open House Melbourne", url: "https://openhousemelbourne.org/", tier: "B" },
      { name: "City of Melbourne Libraries", url: "https://www.melbourne.vic.gov.au/libraries/whats-on", tier: "B" },
      { name: "Melbourne Recital Centre", url: "https://www.melbournerecital.com.au/events/", tier: "B" },
    ]
  },
  {
    key: "sydney",
    name: "Sydney",
    marker: "EVENTS",
    moreMarker: "SYDNEY_MORE",
    dataPath: `${dataDir}/events.json`,
    sources: [
      { name: "City of Sydney", url: "https://whatson.cityofsydney.nsw.gov.au/categories/kids-and-family", tier: "A" },
      { name: "Darling Harbour", url: "https://www.darlingharbour.com/whats-on", tier: "B" },
      { name: "Sydney Opera House", url: "https://www.sydneyoperahouse.com/kids-families", tier: "B" },
      { name: "Australian Museum", url: "https://australian.museum/whats-on/", tier: "B" },
      { name: "Powerhouse Museum", url: "https://powerhouse.com.au/program", tier: "B" },
      { name: "Art Gallery NSW", url: "https://www.artgallery.nsw.gov.au/whats-on/", tier: "B" },
      { name: "Museum of Contemporary Art Australia", url: "https://www.mca.com.au/whats-on/", tier: "B" },
      { name: "State Library NSW", url: "https://www.sl.nsw.gov.au/whats-on", tier: "B" },
      { name: "Australian National Maritime Museum", url: "https://www.sea.museum/whats-on", tier: "B" },
      { name: "Sydney Olympic Park", url: "https://www.sydneyolympicpark.com.au/Things-to-Do/Events", tier: "B" },
      { name: "Taronga Zoo Sydney", url: "https://taronga.org.au/sydney-zoo/whats-on", tier: "B" },
      { name: "Luna Park Sydney", url: "https://www.lunaparksydney.com/whats-on", tier: "B" },
      { name: "Sydney Zoo", url: "https://sydneyzoo.com/whats-on/", tier: "B" },
      { name: "Harry Potter: The Exhibition Sydney", url: "https://harrypotterexhibition.com/locations/sydney/", tier: "B", directEvent: true },
      { name: "Children\'s International Film Festival", url: "https://whatson.cityofsydney.nsw.gov.au/events/childrens-international-film-festival", tier: "B", directEvent: true },
      { name: "Inner West", url: "https://www.innerwest.nsw.gov.au/explore/whats-on", tier: "A" },
      { name: "Waverley Council", url: "https://www.waverley.nsw.gov.au/recreation/events", tier: "A" },
      { name: "North Sydney Council", url: "https://www.northsydney.nsw.gov.au/events", tier: "A" },
      { name: "Willoughby City Council", url: "https://www.willoughby.nsw.gov.au/Events", tier: "A" },
      { name: "Mosman Council", url: "https://www.mosman.nsw.gov.au/events", tier: "A" },
      { name: "Woollahra Council", url: "https://www.woollahra.nsw.gov.au/Events", tier: "A" },
      { name: "Randwick", url: "https://www.randwick.nsw.gov.au/about-council/news/events", tier: "A" },
      { name: "Parramatta", url: "https://atparramatta.com/whats-on", tier: "A" },
      { name: "Canada Bay", url: "https://www.canadabay.nsw.gov.au/lifestyle/events", tier: "A" },
      { name: "Burwood Council", url: "https://www.burwood.nsw.gov.au/For-Residents/Events-and-Activities", tier: "A" },
      { name: "City of Ryde", url: "https://www.ryde.nsw.gov.au/Events", tier: "A" },
      { name: "Strathfield Council", url: "https://www.strathfield.nsw.gov.au/Play/Events-Calendar", tier: "A" },
      { name: "Cumberland City Council", url: "https://www.cumberland.nsw.gov.au/whats-on", tier: "A" },
      { name: "Bayside Council", url: "https://www.bayside.nsw.gov.au/whats-on", tier: "A" },
      { name: "Canterbury-Bankstown", url: "https://www.cbcity.nsw.gov.au/events", tier: "A" },
      { name: "Georges River Council", url: "https://www.georgesriver.nsw.gov.au/Community/Events", tier: "A" },
      { name: "Hornsby Shire Council", url: "https://www.hornsby.nsw.gov.au/lifestyle/events", tier: "A" },
      { name: "Ku-ring-gai Council", url: "https://www.krg.nsw.gov.au/Things-to-do/Whats-on", tier: "A" },
      { name: "Lane Cove Council", url: "https://www.lanecove.nsw.gov.au/Events", tier: "A" },
      { name: "Liverpool City Council", url: "https://www.liverpool.nsw.gov.au/community/major-events", tier: "A" },
      { name: "Blacktown City Council", url: "https://www.blacktown.nsw.gov.au/Events-and-activities", tier: "A" },
      { name: "Penrith City Council", url: "https://www.penrithcity.nsw.gov.au/upcoming-events", tier: "A" },
      { name: "Northern Beaches Council", url: "https://www.northernbeaches.nsw.gov.au/things-to-do/whats-on", tier: "A" },
      { name: "Bunnings Kids DIY", url: "https://bookings.bunnings.com.au/events/au", tier: "B" },
      { name: "Fire and Rescue NSW Open Day", url: "https://www.fire.nsw.gov.au/media/events/open-day", tier: "B" },
      { name: "NSW National Parks", url: "https://www.nationalparks.nsw.gov.au/things-to-do", tier: "B" },
      { name: "Museums of History NSW", url: "https://mhnsw.au/whats-on/", tier: "B" },
      { name: "Centennial Parklands", url: "https://www.centennialparklands.com.au/whatson", tier: "B" },
      { name: "Botanic Gardens of Sydney", url: "https://www.botanicgardens.org.au/whats-on", tier: "B" }
    ]
  }
];

const accents = [
  ["#bdf3d2", "rgba(189,243,210,.78)"],
  ["#ffcdbb", "rgba(255,205,187,.78)"],
  ["#bfe3ff", "rgba(191,227,255,.8)"],
  ["#ffe985", "rgba(255,233,133,.78)"],
  ["#d4c8ff", "rgba(212,200,255,.78)"],
  ["#ffcae2", "rgba(255,202,226,.78)"],
  ["#aeece8", "rgba(174,236,232,.78)"],
  ["#ffc978", "rgba(255,201,120,.78)"]
];

const kidsKeywords = ["kids", "children", "family", "families", "school holiday", "workshop", "story", "play", "craft", "baby", "toddler", "all ages", "free"];
const rejectKeywords = ["whisky", "wine", "cocktail", "bar", "18+", "adults only", "gambling", "race day", "nightclub"];
const genericTitlePattern = /^(free|program|event|family and kids|kindergarten|playgroups?|support for parents|child and family hub)$/i;
const scraperNoisePattern = /Client Challenge|JavaScript is disabled|outdated browser|required part of this site|Enfield Council Cham|Corrard\/Haeremai|Industrial Chemists/i;
const staleContentPattern = /\bSpring Festival 2024\b|\b5 June 1937\b/i;

function isGenericTitle(title = "") {
  return genericTitlePattern.test(String(title).trim());
}

function containsOldYear(text = "") {
  return (String(text).match(/\b(20\d{2})\b/g) || []).map(Number).some((year) => year < Number(weekPeriod.periodStart.slice(0, 4)));
}

function isBadCandidate(candidate) {
  const title = String(candidate?.title || "");
  const text = `${title} ${candidate?.text || ""} ${candidate?.detailText || ""}`;
  if (isGenericTitle(title)) return true;
  if (scraperNoisePattern.test(text) || staleContentPattern.test(text)) return true;
  if (containsOldYear(text)) return true;
  if (/\b6 June\b/i.test(text) && weekPeriod.periodStart.startsWith("2026-07")) return true;
  return false;
}

function isValidEvent(event) {
  const titles = [event?.titleZh || "", event?.titleEn || ""].map((value) => String(value).trim());
  const text = Object.values(event || {}).join(" ");
  if (!event?.url || !/^https?:\/\//i.test(event.url)) return false;
  if (titles.some(isGenericTitle)) return false;
  if (scraperNoisePattern.test(text) || staleContentPattern.test(text)) return false;
  if (containsOldYear(text)) return false;
  if (/\b6 June\b/i.test(`${event?.timeZh || ""} ${event?.timeEn || ""}`) && weekPeriod.periodStart.startsWith("2026-07")) return false;
  return true;
}

function getSydneyWeekPeriod(date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Australia/Sydney",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short"
    }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );
  const weekdayIndex = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[parts.weekday];
  const start = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)));
  start.setUTCDate(start.getUTCDate() - ((weekdayIndex + 7 - 5) % 7));
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 7);
  return {
    periodStart: start.toISOString().slice(0, 10),
    periodEnd: end.toISOString().slice(0, 10)
  };
}

function updatePeriodMeta(html, period) {
  return html.replace(
    /<section class="meta-bar" aria-label="Page status"(?: data-period-start="[^"]*" data-period-end="[^"]*")?>/,
    `<section class="meta-bar" aria-label="Page status" data-period-start="${period.periodStart}" data-period-end="${period.periodEnd}">`
  );
}

function decodeHtml(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}

function stripTags(value) {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
}

async function fetchText(url, city) {
  const response = await fetch(url, { headers: { "user-agent": `${city} Kids Finder weekly updater (+https://github.com/Pikatiu27/sconmyway-site)` } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

function scoreCandidate(text, source) {
  const lower = text.toLowerCase();
  if (rejectKeywords.some((word) => lower.includes(word))) return -50;
  if (scraperNoisePattern.test(text) || staleContentPattern.test(text) || containsOldYear(text)) return -50;
  let score = source.tier === "A" ? 8 : 5;
  for (const word of kidsKeywords) if (lower.includes(word)) score += 6;
  if (/\b(free|\$|ticket|book|register)\b/i.test(text)) score += 2;
  if (/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}:\d{2}|am|pm)\b/i.test(text)) score += 3;
  return score;
}

function extractLinks(html, source) {
  const links = [];
  if (source.directEvent) {
    const text = stripTags(html);
    links.push({ title: source.name, url: source.url, source: source.name, score: scoreCandidate(text, source) + 20, text });
    return links;
  }
  const anchorPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchorPattern.exec(html))) {
    const label = stripTags(match[2]);
    if (!label || label.length < 4) continue;
    const url = new URL(match[1], source.url).href.split("#")[0];
    if (!url.startsWith("http")) continue;
    const context = stripTags(html.slice(Math.max(0, match.index - 450), Math.min(html.length, match.index + 950)));
    const text = `${label}. ${context}`;
    const score = scoreCandidate(text, source);
    if (score > 8) links.push({ title: label, url, source: source.name, score, text });
  }
  return links;
}

function uniqueCandidates(candidates) {
  const seen = new Set();
  return candidates.filter((item) => !isBadCandidate(item)).sort((a, b) => b.score - a.score).filter((item) => {
    const key = item.url.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractDate(text) {
  const match = text.match(/\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)?\s*\d{1,2}\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:[^.]{0,28}(?:am|pm))?/i);
  return match ? match[0].trim() : "See official page";
}

function extractPrice(text) {
  if (/\bfree\b/i.test(text)) return "Free / see official page";
  const match = text.match(/\$\s?\d+(?:\.\d{2})?/);
  return match ? `${match[0]} / see official page` : "See official page";
}

function summarizeFallback(candidate, city) {
  const sentences = candidate.detailText.split(/(?<=[.!?])\s+/).filter((line) => line.length > 40 && line.length < 220);
  return sentences.slice(0, 2).join(" ") || `Family-friendly activity from an official ${city} source. Check the official page before heading out.`;
}

async function enrichWithOpenAI(candidates, city) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const payload = candidates.map(({ title, url, source, detailText }) => ({ title, url, source, text: detailText.slice(0, 4500) }));
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        { role: "system", content: `Create accurate bilingual family event JSON for ${city}. Use only the supplied official page text. Every field ending in En must be entirely in English with no Chinese characters, including referenceEn. If a fact is missing, say 'See official page'. Never invent details. Exclude expired events. Put newly starting, one-off, or short-date events first, then ongoing long-run activities.` },
        { role: "user", content: `The publication week is ${weekPeriod.periodStart} to ${weekPeriod.periodEnd} in Australia/Sydney time. Select the best 8 kid-friendly ${city} activities active during this Friday-to-Friday week. Delete expired events, add the newest relevant activities, rank new or short-date activities first, and place still-running ongoing activities later. Return only a JSON object with key events. Each event needs: tagZh, tagEn, titleZh, titleEn, summaryZh, summaryEn, timeZh, timeEn, placeZh, placeEn, priceZh, priceEn, url, mapQuery, referenceZh, referenceEn.\n\n${JSON.stringify(payload)}` }
      ],
      text: { format: { type: "json_object" } }
    })
  });
  if (!response.ok) throw new Error(`OpenAI ${response.status}: ${await response.text()}`);
  const data = await response.json();
  const output = data.output_text || data.output?.flatMap((item) => item.content || []).map((part) => part.text || "").join("");
  const parsed = JSON.parse(output);
  return {
    events: Array.isArray(parsed) ? parsed : parsed.events,
    usage: data.usage || null
  };
}

function fallbackEvents(candidates, city) {
  return candidates.filter((candidate) => !isBadCandidate(candidate)).slice(0, 8).map((candidate) => ({
    tagZh: `${candidate.source} · 亲子`, tagEn: `${candidate.source} · Family`,
    titleZh: candidate.title, titleEn: candidate.title,
    summaryZh: `来自 ${city} 官方活动来源的亲子友好候选。出发前请点击官网确认最新时间、票价和年龄要求。`,
    summaryEn: summarizeFallback(candidate, city),
    timeZh: extractDate(candidate.detailText), timeEn: extractDate(candidate.detailText),
    placeZh: candidate.source, placeEn: candidate.source,
    priceZh: extractPrice(candidate.detailText), priceEn: extractPrice(candidate.detailText),
    url: candidate.url, mapQuery: `${candidate.source} ${city}`,
    referenceZh: `${candidate.source} 官方活动页面。`, referenceEn: `${candidate.source} official event listing.`
  }));
}

function esc(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderEvent(event, index) {
  const [accent, soft] = accents[index % accents.length];
  const featured = index === 0 ? " featured" : "";
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery || event.placeEn || event.titleEn)}`;
  return `        <article class="card${featured}" style="--accent:${accent};--accent-soft:${soft};">
          <div class="card-top"><span class="tag zh">${esc(event.tagZh)}</span><span class="tag en">${esc(event.tagEn)}</span><span class="score">${index < 3 ? "★★★★★" : "★★★★☆"}</span></div>
          <h2><span class="zh">${esc(event.titleZh)}</span><span class="en">${esc(event.titleEn)}</span></h2>
          <p class="summary zh">${esc(event.summaryZh)}</p><p class="summary en">${esc(event.summaryEn)}</p>
          <div class="facts"><div class="fact"><span>⏰</span><span class="zh">${esc(event.timeZh)}</span><span class="en">${esc(event.timeEn)}</span></div><div class="fact"><span>📍</span><span class="zh">${esc(event.placeZh)}</span><span class="en">${esc(event.placeEn)}</span></div><div class="fact"><span>🎟️</span><span class="zh">${esc(event.priceZh)}</span><span class="en">${esc(event.priceEn)}</span></div></div>
          <div class="actions"><a class="action primary" href="${esc(event.url)}" target="_blank" rel="noreferrer"><span class="zh">官网</span><span class="en">Official</span></a><a class="action" href="${esc(map)}" target="_blank" rel="noreferrer"><span class="zh">导航</span><span class="en">Map</span></a></div>
          <div class="reference"><b>Reference:</b> <span class="zh">${esc(event.referenceZh)}</span><span class="en">${esc(event.referenceEn)}</span></div>
        </article>`;
}

function renderMoreLink(candidate) {
  const title = esc(candidate.title || candidate.source || "More activity");
  const source = esc(candidate.source || "Official source");
  const url = esc(candidate.url);
  return `          <a href="${url}" target="_blank" rel="noreferrer">
            <span class="zh">${title} · ${source}</span>
            <span class="en">${title} · ${source}</span>
          </a>`;
}

function renderMoreGroups(moreLinks) {
  const current = moreLinks.filter((item) => item.kind !== "backup").slice(0, 3);
  const currentLinks = current.length ? current : moreLinks.slice(0, 2);
  const currentUrls = new Set(currentLinks.map((item) => item.url));
  const backupLinks = moreLinks.filter((item) => item.kind === "backup" && !currentUrls.has(item.url)).slice(0, 3);
  const fallbackBackupLinks = moreLinks.filter((item) => !currentUrls.has(item.url) && !backupLinks.some((backup) => backup.url === item.url)).slice(0, 3 - backupLinks.length);
  const sourceLinks = [...backupLinks, ...fallbackBackupLinks];
  return `          <div class="more-group">
            <p class="more-heading"><span aria-hidden="true">📌</span><span class="zh">本周候选</span><span class="en">More this week</span></p>
${currentLinks.map(renderMoreLink).join("\n")}
          </div>
          <div class="more-group">
            <p class="more-heading"><span aria-hidden="true">🗂️</span><span class="zh">备用入口</span><span class="en">Backup sources</span></p>
${sourceLinks.map(renderMoreLink).join("\n")}
          </div>`;
}

async function buildCity(config) {
  const candidates = [];
  for (const source of config.sources) {
    try {
      candidates.push(...extractLinks(await fetchText(source.url, config.name), source));
    } catch (error) {
      console.warn(`${config.name} source skipped: ${source.name}: ${error.message}`);
    }
  }
  const selected = uniqueCandidates(candidates).slice(0, 18);
  for (const candidate of selected) {
    try { candidate.detailText = stripTags(await fetchText(candidate.url, config.name)).slice(0, 7000); }
    catch { candidate.detailText = candidate.text; }
  }
  let enrichment = null;
  try { enrichment = await enrichWithOpenAI(selected, config.name); }
  catch (error) { console.warn(`${config.name} AI enrichment skipped: ${error.message}`); }
  let events = enrichment?.events || null;
  if (!Array.isArray(events) || events.length < 3) events = fallbackEvents(selected, config.name);
  events = events.filter(isValidEvent).slice(0, 8);
  if (events.length !== 8) throw new Error(`Not enough valid ${config.name} event candidates; refusing to publish stale or generic content.`);
  const eventUrls = new Set(events.map((event) => String(event.url || "").toLowerCase()));
  const moreLinks = selected
    .filter((candidate) => candidate.url && !eventUrls.has(candidate.url.toLowerCase()))
    .slice(0, 5)
    .map(({ title, url, source }) => ({ title, url, source }));
  if (moreLinks.length < 3) {
    for (const source of config.sources) {
      if (moreLinks.length >= 5) break;
      if (!source.url || eventUrls.has(source.url.toLowerCase())) continue;
      if (moreLinks.some((item) => item.url.toLowerCase() === source.url.toLowerCase())) continue;
      moreLinks.push({ title: source.name, url: source.url, source: "Official source", kind: "backup" });
    }
  }
  return { events, moreLinks, candidates: selected, usage: enrichment?.usage || null };
}

function usageNumbers(result) {
  const input = Number(result?.usage?.input_tokens || 0);
  const output = Number(result?.usage?.output_tokens || 0);
  const total = Number(result?.usage?.total_tokens || input + output);
  return { input, output, total };
}

async function writeUsageReport(results) {
  const melbourne = usageNumbers(results.get("melbourne"));
  const sydney = usageNumbers(results.get("sydney"));
  const total = melbourne.total + sydney.total;
  const model = total > 0 ? (process.env.OPENAI_MODEL || "gpt-4.1-mini") : "Fallback (no API tokens)";
  const runTime = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date()).replace(",", "");
  const newRow = `| ${runTime} | ${model} | ${melbourne.input} | ${melbourne.output} | ${sydney.input} | ${sydney.output} | ${total} |`;
  const header = `| Run time (Sydney) | Model / mode | Melbourne input | Melbourne output | Sydney input | Sydney output | Total tokens |\n| --- | --- | ---: | ---: | ---: | ---: | ---: |`;
  let existing = "";
  try { existing = await readFile(usageReportPath, "utf8"); } catch {}
  const oldRows = [...existing.matchAll(/^\| (?!Run time|---|No recorded)(.+) \|$/gm)].map((match) => match[0]);
  const rows = [...oldRows, newRow].slice(-26);
  const report = `# Kids Finder Token Usage\n\nThis report tracks OpenAI API tokens used by the weekly Sydney and Melbourne event updater.\n\nIt does **not** include Codex/ChatGPT conversation tokens, GitHub Actions runtime, GitHub Pages visits, map clicks, official-site clicks, or shared-link visits.\n\n<!-- TOKEN_USAGE_ROWS_START -->\n${header}\n${rows.join("\n")}\n<!-- TOKEN_USAGE_ROWS_END -->\n\nOnly the latest 26 runs are retained. Token counts come directly from the OpenAI Responses API \`usage\` object.\n`;
  await writeFile(usageReportPath, report, "utf8");
}

async function writeCandidateReport(results) {
  const lines = [
    "# Kids Finder Candidate Pool",
    "",
    "This report is regenerated by the weekly updater. It records the current candidate pool before the page is reduced to 8 main picks plus More links.",
    "",
    `Publication week: ${weekPeriod.periodStart} to ${weekPeriod.periodEnd}`,
    ""
  ];
  for (const config of cityConfigs) {
    const result = results.get(config.key);
    const candidates = result?.candidates || [];
    lines.push(`## ${config.name}`, "");
    lines.push("| Rank | Source | Candidate | URL | Score |");
    lines.push("| ---: | --- | --- | --- | ---: |");
    candidates.slice(0, 24).forEach((candidate, index) => {
      lines.push(`| ${index + 1} | ${candidate.source} | ${String(candidate.title || "").replace(/\|/g, "/")} | ${candidate.url} | ${candidate.score} |`);
    });
    lines.push("");
    lines.push("Selection notes: shortlist from this pool, verify B/C/D tips against official organiser pages, keep new or short-date events ahead of ongoing activities, and remove expired items.");
    lines.push("");
  }
  await writeFile(candidateReportPath, `${lines.join("\n")}\n`, "utf8");
}

async function main() {
  await mkdir(dataDir, { recursive: true });
  let index = await readFile(indexPath, "utf8");
  const results = new Map();
  for (const config of cityConfigs) {
    const result = await buildCity(config);
    const { events, moreLinks } = result;
    results.set(config.key, result);
    await writeFile(config.dataPath, `${JSON.stringify({ city: config.name, updatedAt: new Date().toISOString(), ...weekPeriod, events }, null, 2)}\n`, "utf8");
    const start = `<!-- ${config.marker}_START -->`;
    const end = `<!-- ${config.marker}_END -->`;
    const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
    if (!pattern.test(index)) throw new Error(`Missing ${config.name} event markers in ${indexPath}`);
    index = index.replace(pattern, `${start}\n${events.map(renderEvent).join("\n\n")}\n        ${end}`);
    const moreStart = `<!-- ${config.moreMarker}_START -->`;
    const moreEnd = `<!-- ${config.moreMarker}_END -->`;
    const morePattern = new RegExp(`${moreStart}[\\s\\S]*?${moreEnd}`);
    if (!morePattern.test(index)) throw new Error(`Missing ${config.name} more markers in ${indexPath}`);
    index = index.replace(morePattern, `${moreStart}\n${renderMoreGroups(moreLinks)}\n          ${moreEnd}`);
  }
  await writeFile(indexPath, updatePeriodMeta(index, weekPeriod), "utf8");
  await writeUsageReport(results);
  await writeCandidateReport(results);
}

main().catch((error) => { console.error(error); process.exit(1); });
