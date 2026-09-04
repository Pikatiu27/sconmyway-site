import { appendFile, readFile, writeFile } from "node:fs/promises";

const [, , command = "validate", dataPath = "kids/data/events.json"] = process.argv;
const timeZone = "Australia/Sydney";

function localParts(date = new Date()) {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );
}

function localDateKey(date) {
  const parts = localParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function isoWeekday(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid ISO date: ${isoDate}`);
  return date.getUTCDay();
}

function daysBetween(startIso, endIso) {
  return (new Date(`${endIso}T00:00:00Z`) - new Date(`${startIso}T00:00:00Z`)) / 86400000;
}

function isFreshLeadEvent(event) {
  const text = `${event.tagZh || ""} ${event.tagEn || ""} ${event.titleZh || ""} ${event.titleEn || ""} ${event.summaryZh || ""} ${event.summaryEn || ""} ${event.timeZh || ""} ${event.timeEn || ""}`.toLowerCase();
  if (/\b(ongoing|long-run|permanent|venue entry|what's on|see official page)\b|持续开放|长期|场馆入口|以官网为准/.test(text)) return false;
  return /\b(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|\d{1,2}\s*-\s*\d{1,2}\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec))\b|周[一二三四五六日天]|星期[一二三四五六日天]|\d+月\d+日/.test(text);
}

const libraryActivityPattern = /\b(library|libraries|storytime|story time|rhyme time|baby rhyme|book club)\b|\u56fe\u4e66\u9986|\u6545\u4e8b\u4f1a/i;
const lowAgeOnlyPattern = /\b(baby rhyme|rhyme time|storytime|story time|playgroup|toddler time|0\s*-\s*3|0 to 3|0-3|babies only|toddlers only)\b|\bunder 3\b(?!\s+free)/i;

function isLibraryActivity(event) {
  return libraryActivityPattern.test(Object.values(event || {}).join(" "));
}

function isLowAgeOnlyActivity(event) {
  return lowAgeOnlyPattern.test(Object.values(event || {}).join(" "));
}

async function readData() {
  const bytes = await readFile(dataPath);
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (text.includes("\uFFFD")) throw new Error(`${dataPath} contains invalid replacement characters`);
  const data = JSON.parse(text);
  if (!data.updatedAt || !Array.isArray(data.events)) {
    throw new Error(`${dataPath} is missing updatedAt or valid events`);
  }
  if (data.events.length > 8 && command !== "prepare") {
    throw new Error(`${dataPath} may contain at most 8 main event recommendations`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.periodStart || "") || !/^\d{4}-\d{2}-\d{2}$/.test(data.periodEnd || "")) {
    throw new Error(`${dataPath} is missing Friday-to-Friday periodStart/periodEnd`);
  }
  if (isoWeekday(data.periodStart) !== 5 || daysBetween(data.periodStart, data.periodEnd) !== 7) {
    throw new Error(`${dataPath} period must run from Friday to the next Friday`);
  }
  const accepted = [];
  const rejected = [];
  for (const [index, event] of data.events.entries()) {
    try {
    const review = event.linkReview;
    if (!review || review.status !== "verified" || review.url !== event.url || !review.checkedAt || review.checkedAt < data.periodStart || !review.evidence) {
      throw new Error("Missing current official content verification, or URL does not match verified page");
    }
    if (!/^https:\/\//.test(event.url || "") || !["official", "announcement", "tickets"].includes(event.linkType || "official")) {
      throw new Error("Invalid official link or button type");
    }
    if (event.cancelled || (event.endsOn && event.endsOn < data.periodStart)) throw new Error("Event is cancelled or outside the publication week");
    const titleText = [event.titleZh || "", event.titleEn || ""].map((value) => String(value).trim());
    if (titleText.some((value) => /^(free|program|event|family and kids|kindergarten|playgroups?|support for parents|child and family hub)$/i.test(value))) {
      throw new Error(`events[${index}] is a generic directory/category page: ${titleText.join(" / ")}`);
    }
    for (const field of ["titleZh", "summaryZh", "timeZh", "placeZh", "referenceZh"]) {
      if (typeof event[field] !== "string" || !event[field].trim()) {
        throw new Error(`events[${index}].${field} is missing`);
      }
    }
    const qualityText = `${event.tagZh || ""} ${event.tagEn || ""} ${event.titleZh || ""} ${event.titleEn || ""} ${event.summaryZh || ""} ${event.summaryEn || ""} ${event.timeZh || ""} ${event.timeEn || ""} ${event.placeZh || ""} ${event.placeEn || ""} ${event.referenceZh || ""} ${event.referenceEn || ""}`;
    const timeText = qualityText;
    if (/\b(expired|ended|cancelled|canceled)\b|已结束|活动取消/u.test(timeText)) {
      throw new Error(`events[${index}] appears expired or cancelled`);
    }
    const oldYear = timeText.match(/\b(20\d{2})\b/g)?.map(Number).find((year) => year < Number(data.periodStart.slice(0, 4)));
    if (oldYear) throw new Error(`events[${index}] contains old year ${oldYear}`);
    if (/Client Challenge|JavaScript is disabled|outdated browser|required part of this site|Enfield Council Cham|Corrard\/Haeremai|Industrial Chemists/i.test(qualityText)) {
      throw new Error(`events[${index}] contains scraper noise instead of event content`);
    }

    if (isLibraryActivity(event)) {
      throw new Error(`events[${index}] is a library/storytime/rhyme-time activity and must be in More, not main cards`);
    }
    if (isLowAgeOnlyActivity(event)) {
      throw new Error(`events[${index}] is a baby/toddler-only activity and must be in More, not main cards`);
    }
    if (/\bSpring Festival 2024\b|\b5 June 1937\b/i.test(qualityText)) {
      throw new Error(`events[${index}] contains known stale content`);
    }
    if (/\b6 June\b/i.test(`${event.timeZh || ""} ${event.timeEn || ""}`) && data.periodStart.startsWith("2026-07")) {
      throw new Error(`events[${index}] contains a June date during the July publication week`);
    }
    for (const field of ["tagEn", "titleEn", "summaryEn", "timeEn", "placeEn", "priceEn", "referenceEn"]) {
      if (typeof event[field] !== "string" || !event[field].trim()) {
        throw new Error(`events[${index}].${field} is missing`);
      }
      if (/\p{Script=Han}/u.test(event[field])) {
        throw new Error(`events[${index}].${field} contains Chinese text`);
      }
    }
    accepted.push(event);
    } catch (error) {
      if (command !== "prepare") throw error;
      rejected.push({ title: event.titleEn || event.titleZh || `Item ${index + 1}`, reason: error.message });
    }
  }
  if (command === "prepare") {
    accepted.sort((a, b) => Number(isFreshLeadEvent(b) && !b.longTerm) - Number(isFreshLeadEvent(a) && !a.longTerm));
    data.events = accepted.slice(0, 8);
  }
  const more = [];
  for (const item of data.moreLinks || []) {
    const review = item.linkReview;
    const valid = /^https:\/\//.test(item.url || "") && review?.status === "verified" && review.url === item.url && review.checkedAt >= data.periodStart && review.evidence;
    if (valid) more.push(item);
    else if (command === "prepare") rejected.push({ title: item.titleEn || item.title || "More link", reason: "More link has no current matching content verification" });
    else throw new Error("More link has no current matching content verification");
  }
  if (command === "prepare") {
    data.moreLinks = more.slice(0, 5);
    await writeFile(dataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
    await writeFile(dataPath.replace(/\.json$/, ".review.json"), JSON.stringify({ checkedAt: new Date().toISOString(), rejected, mainCount: data.events.length, moreCount: data.moreLinks.length }, null, 2) + "\n", "utf8");
  }
  const freshCount = data.events.slice(0, 4).filter(e => !e.longTerm && isFreshLeadEvent(e)).length;
  if (data.events.length < 8 || freshCount < 4 || data.moreLinks.length < 3) console.warn(`Reduced coverage: ${data.events.length} main, ${freshCount} fresh leads, ${data.moreLinks.length} More; publish verified items without padding`);
  return data;
}

function extractCheckedLinks(html) {
  const regions = [
    ...html.matchAll(/<section class="cards"[\s\S]*?<\/section>/g),
    ...html.matchAll(/<details class="more-panel"[^>]*data-city-panel="(?:sydney|melbourne)"[\s\S]*?<\/details>/g)
  ].map((match) => match[0]);
  const links = [];
  for (const region of regions) {
    if (region.includes("source-panel")) continue;
    for (const match of region.matchAll(/href="(https?:\/\/[^"]+)"/g)) links.push(match[1].replace(/&amp;/g, "&"));
  }
  return [...new Set(links)].filter((url) => !url.startsWith("https://www.google.com/maps/"));
}

async function checkLinks(htmlPath) {
  const html = await readFile(htmlPath, "utf8");
  const links = extractCheckedLinks(html);
  const failures = [];
  for (const url of links) {
    try {
      let response;
      for (let attempt = 0; attempt < 2; attempt++) {
        response = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(12000) });
        if (response.ok || response.status === 404 || response.status === 410) break;
        await response.body?.cancel();
      }
      if (!response.ok) failures.push(`${response.status} ${url}`);
      if (new URL(response.url).pathname === "/" && new URL(url).pathname !== "/") failures.push(`Redirected to homepage: ${url}`);
      await response.body?.cancel();
    } catch (error) {
      failures.push(`${error.message} ${url}`);
    }
  }
  if (failures.length) console.warn(`::warning::Links need individual re-review; do not roll back healthy content:\n${failures.join("\n")}`);
  console.log(`Transport-checked ${links.length} links; content relevance requires recorded official-source review`);
}

async function writeOutput(values) {
  if (!process.env.GITHUB_OUTPUT) return;
  await appendFile(process.env.GITHUB_OUTPUT, Object.entries(values).map(([key, value]) => `${key}=${value}\n`).join(""), "utf8");
}

if (command === "gate") {
  if (process.env.GITHUB_EVENT_NAME === "workflow_dispatch") {
    await writeOutput({ should_run: "true", reason: "manual run" });
  } else {
    const parts = localParts();
    const shouldRun = parts.weekday === "Fri" && parts.hour === "08" && parts.minute === "30";
    const reason = shouldRun ? "Friday 08:30 final publication audit" : "outside final audit window";

    await writeOutput({ should_run: String(shouldRun), reason });
  }
} else if (["validate", "prepare", "validate-content"].includes(command)) {
  const data = await readData();
  const today = localDateKey(new Date());
  if (command === "validate" && !(data.periodStart <= today && today < data.periodEnd && data.updatedAt >= data.periodStart)) {
    throw new Error(`${dataPath} was not refreshed for the current Australia/Sydney week`);
  }
  console.log(`Validated ${data.events.length} events and UTF-8 JSON written at ${data.updatedAt}`);
} else if (command === "validate-links") {
  await checkLinks(dataPath);
} else {
  throw new Error(`Unknown command: ${command}`);
}
