import { readFile, writeFile, mkdir } from "node:fs/promises";

const siteDir = "kids";
const indexPath = `${siteDir}/index.html`;
const dataDir = `${siteDir}/data`;
const dataPath = `${dataDir}/events.json`;

const sources = [
  { name: "City of Sydney", url: "https://whatson.cityofsydney.nsw.gov.au/categories/kids-and-family", tier: "A" },
  { name: "Darling Harbour", url: "https://www.darlingharbour.com/whats-on", tier: "B" },
  { name: "Sydney Opera House", url: "https://www.sydneyoperahouse.com/kids-families", tier: "B" },
  { name: "Australian Museum", url: "https://australian.museum/whats-on/", tier: "B" },
  { name: "Art Gallery NSW", url: "https://www.artgallery.nsw.gov.au/whats-on/", tier: "B" },
  { name: "State Library NSW", url: "https://www.sl.nsw.gov.au/whats-on", tier: "B" },
  { name: "Sydney Olympic Park", url: "https://www.sydneyolympicpark.com.au/Things-to-Do/Events", tier: "B" },
  { name: "Inner West", url: "https://www.innerwest.nsw.gov.au/explore/whats-on", tier: "A" },
  { name: "Randwick", url: "https://www.randwick.nsw.gov.au/about-council/news/events", tier: "A" },
  { name: "Parramatta", url: "https://atparramatta.com/whats-on", tier: "A" },
  { name: "Canada Bay", url: "https://www.canadabay.nsw.gov.au/lifestyle/events", tier: "A" }
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

const kidsKeywords = ["kids", "children", "family", "families", "school holiday", "workshop", "story", "play", "craft", "baby", "toddler", "all ages", "free", "小朋友", "亲子", "儿童", "家庭"];
const rejectKeywords = ["whisky", "wine", "cocktail", "bar", "18+", "adults only", "gambling", "race day", "nightclub"];
const now = new Date();

function decodeHtml(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}

function stripTags(value) {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": "Sydney Kids Finder weekly updater (+https://github.com/Pikatiu27/sconmyway-site)" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

function scoreCandidate(text, source) {
  const lower = text.toLowerCase();
  if (rejectKeywords.some((word) => lower.includes(word))) return -50;
  let score = source.tier === "A" ? 8 : 5;
  for (const word of kidsKeywords) if (lower.includes(word)) score += 6;
  if (/\b(free|\$|ticket|book|register)\b/i.test(text)) score += 2;
  if (/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\s*[–-]\s*\d{1,2}|\d{1,2}:\d{2}|am|pm)\b/i.test(text)) score += 3;
  return score;
}

function extractLinks(html, source) {
  const links = [];
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
    if (score > 8) links.push({ title: label, url, source: source.name, sourceUrl: source.url, score, text });
  }
  return links;
}

function uniqueCandidates(candidates) {
  const seen = new Set();
  return candidates.sort((a, b) => b.score - a.score).filter((item) => {
    const key = item.url.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractDate(text) {
  const match = text.match(/\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)?\s*\d{1,2}\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*(?:[–-]\s*\d{1,2}\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*)?(?:,\s*\d{4})?(?:[^.]{0,28}(?:am|pm))?/i);
  return match ? match[0].trim() : "See official page";
}

function extractPrice(text) {
  if (/\bfree\b/i.test(text)) return "Free / see official page";
  const match = text.match(/\$\s?\d+(?:\.\d{2})?/);
  return match ? `${match[0]} / see official page` : "See official page";
}

function summarizeFallback(candidate, detailText) {
  const sentences = (detailText || candidate.text).split(/(?<=[.!?])\s+/).filter((line) => line.length > 40 && line.length < 220);
  return sentences.slice(0, 2).join(" ") || "Family-friendly activity found from an official Sydney event source. Check the official page before heading out.";
}

async function enrichWithOpenAI(candidates) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const payload = candidates.map((candidate) => ({ title: candidate.title, url: candidate.url, source: candidate.source, text: candidate.detailText.slice(0, 4500) }));
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        { role: "system", content: "You turn Sydney family event page text into accurate bilingual JSON. Use only provided text. If time, venue, price, or age are missing, say 'See official page'. Do not invent." },
        { role: "user", content: `Today is ${now.toISOString().slice(0, 10)}. Select the best 8 kid/family-friendly Sydney activities for the next 7 days. Return only JSON object with key events. Each event: tagZh, tagEn, titleZh, titleEn, summaryZh, summaryEn, timeZh, timeEn, placeZh, placeEn, priceZh, priceEn, url, mapQuery, referenceZh, referenceEn.\n\n${JSON.stringify(payload)}` }
      ],
      text: { format: { type: "json_object" } }
    })
  });
  if (!response.ok) throw new Error(`OpenAI ${response.status}: ${await response.text()}`);
  const data = await response.json();
  const text = data.output_text || data.output?.flatMap((item) => item.content || []).map((part) => part.text || "").join("");
  const parsed = JSON.parse(text);
  return Array.isArray(parsed) ? parsed : parsed.events;
}

function fallbackEvents(candidates) {
  return candidates.slice(0, 8).map((candidate) => ({
    tagZh: `${candidate.source} · 亲子`,
    tagEn: `${candidate.source} · Family`,
    titleZh: candidate.title,
    titleEn: candidate.title,
    summaryZh: "从官方活动来源筛选出的亲子友好候选。出发前请点官网确认最新时间、票价和年龄要求。",
    summaryEn: summarizeFallback(candidate, candidate.detailText),
    timeZh: extractDate(candidate.detailText),
    timeEn: extractDate(candidate.detailText),
    placeZh: candidate.source,
    placeEn: candidate.source,
    priceZh: extractPrice(candidate.detailText),
    priceEn: extractPrice(candidate.detailText),
    url: candidate.url,
    mapQuery: candidate.source,
    referenceZh: `${candidate.source} official event listing.`,
    referenceEn: `${candidate.source} official event listing.`
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
          <div class="card-top">
            <span class="tag zh">${esc(event.tagZh)}</span>
            <span class="tag en">${esc(event.tagEn)}</span>
            <span class="score">${index < 3 ? "★★★★★" : "★★★★☆"}</span>
          </div>
          <h2>
            <span class="zh">${esc(event.titleZh)}</span>
            <span class="en">${esc(event.titleEn)}</span>
          </h2>
          <p class="summary zh">${esc(event.summaryZh)}</p>
          <p class="summary en">${esc(event.summaryEn)}</p>
          <div class="facts">
            <div class="fact"><span>⏰</span><span class="zh">${esc(event.timeZh)}</span><span class="en">${esc(event.timeEn)}</span></div>
            <div class="fact"><span>📍</span><span class="zh">${esc(event.placeZh)}</span><span class="en">${esc(event.placeEn)}</span></div>
            <div class="fact"><span>🎟️</span><span class="zh">${esc(event.priceZh)}</span><span class="en">${esc(event.priceEn)}</span></div>
          </div>
          <div class="actions">
            <a class="action primary" href="${esc(event.url)}" target="_blank" rel="noreferrer"><span class="zh">官网</span><span class="en">Official</span></a>
            <a class="action" href="${esc(map)}" target="_blank" rel="noreferrer"><span class="zh">导航</span><span class="en">Map</span></a>
          </div>
          <div class="reference"><b>Reference:</b> <span class="zh">${esc(event.referenceZh)}</span><span class="en">${esc(event.referenceEn)}</span></div>
        </article>`;
}

async function main() {
  const candidates = [];
  for (const source of sources) {
    try {
      const html = await fetchText(source.url);
      candidates.push(...extractLinks(html, source));
    } catch (error) {
      console.warn(`Source skipped: ${source.name}: ${error.message}`);
    }
  }

  const selected = uniqueCandidates(candidates).slice(0, 14);
  for (const candidate of selected) {
    try {
      candidate.detailText = stripTags(await fetchText(candidate.url)).slice(0, 7000);
    } catch {
      candidate.detailText = candidate.text;
    }
  }

  let events = null;
  try {
    events = await enrichWithOpenAI(selected);
  } catch (error) {
    console.warn(`OpenAI enrichment skipped: ${error.message}`);
  }
  if (!Array.isArray(events) || events.length < 3) events = fallbackEvents(selected);
  events = events.slice(0, 8);
  if (events.length === 0) throw new Error("No candidate events found; leaving site unchanged.");

  await mkdir(dataDir, { recursive: true });
  await writeFile(dataPath, `${JSON.stringify({ updatedAt: new Date().toISOString(), events }, null, 2)}\n`, "utf8");

  const index = await readFile(indexPath, "utf8");
  const start = "<!-- EVENTS_START -->";
  const end = "<!-- EVENTS_END -->";
  const next = index.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${events.map(renderEvent).join("\n\n")}\n        ${end}`);
  await writeFile(indexPath, next, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
