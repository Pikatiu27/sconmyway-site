import { appendFile, readFile } from "node:fs/promises";

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

async function readData() {
  const bytes = await readFile(dataPath);
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (text.includes("\uFFFD")) throw new Error(`${dataPath} contains invalid replacement characters`);
  const data = JSON.parse(text);
  if (!data.updatedAt || !Array.isArray(data.events)) {
    throw new Error(`${dataPath} is missing updatedAt or valid events`);
  }
  if (data.events.length !== 8) {
    throw new Error(`${dataPath} must contain exactly 8 main event recommendations`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.periodStart || "") || !/^\d{4}-\d{2}-\d{2}$/.test(data.periodEnd || "")) {
    throw new Error(`${dataPath} is missing Friday-to-Friday periodStart/periodEnd`);
  }
  if (isoWeekday(data.periodStart) !== 5 || daysBetween(data.periodStart, data.periodEnd) !== 7) {
    throw new Error(`${dataPath} period must run from Friday to the next Friday`);
  }
  for (const [index, event] of data.events.entries()) {
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
    if (/\b(expired|ended|closed|cancelled|canceled)\b|已结束|取消/u.test(timeText)) {
      throw new Error(`events[${index}] appears expired or cancelled`);
    }
    const oldYear = timeText.match(/\b(20\d{2})\b/g)?.map(Number).find((year) => year < Number(data.periodStart.slice(0, 4)));
    if (oldYear) throw new Error(`events[${index}] contains old year ${oldYear}`);
    if (/Client Challenge|JavaScript is disabled|outdated browser|required part of this site|Enfield Council Cham|Corrard\/Haeremai|Industrial Chemists/i.test(qualityText)) {
      throw new Error(`events[${index}] contains scraper noise instead of event content`);
    }
    if (/\bSpring Festival 2024\b|\b5 June 1937\b/i.test(qualityText)) {
      throw new Error(`events[${index}] contains known stale content`);
    }
    if (/\b6 June\b/i.test(`${event.timeZh || ""} ${event.timeEn || ""}`) && data.periodStart.startsWith("2026-07")) {
      throw new Error(`events[${index}] contains a June date during the July publication week`);
    }
    if (index < 4 && !isFreshLeadEvent(event)) {
      throw new Error(`events[${index}] must be a new or short-date current-week lead activity`);
    }
    for (const field of ["tagEn", "titleEn", "summaryEn", "timeEn", "placeEn", "priceEn", "referenceEn"]) {
      if (typeof event[field] !== "string" || !event[field].trim()) {
        throw new Error(`events[${index}].${field} is missing`);
      }
      if (/\p{Script=Han}/u.test(event[field])) {
        throw new Error(`events[${index}].${field} contains Chinese text`);
      }
    }
  }
  return data;
}

function extractCheckedLinks(html) {
  const regions = [
    ...html.matchAll(/<section class="cards"[\s\S]*?<\/section>/g),
    ...html.matchAll(/<details class="more-panel" data-city-panel="(?:sydney|melbourne)"[\s\S]*?<\/details>/g)
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
  if (links.length < 12) throw new Error(`${htmlPath} has too few card and More links to validate`);
  const failures = [];
  for (const url of links) {
    try {
      let response = await fetch(url, { method: "HEAD", redirect: "follow" });
      if ([405, 403].includes(response.status)) response = await fetch(url, { method: "GET", redirect: "follow" });
      if ([404, 410].includes(response.status) || response.status >= 500) failures.push(`${response.status} ${url}`);
    } catch (error) {
      failures.push(`${error.message} ${url}`);
    }
  }
  if (failures.length) throw new Error(`Broken card/More links:\n${failures.join("\n")}`);
  console.log(`Checked ${links.length} card and More links from ${htmlPath}`);
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
    let shouldRun = parts.weekday === "Fri" && parts.hour === "05";
    let reason = shouldRun ? "Friday 05:00 primary refresh" : "outside refresh window";

    if (parts.weekday === "Fri" && parts.hour === "06") {
      try {
        const data = await readData();
        shouldRun = localDateKey(new Date(data.updatedAt)) !== localDateKey(new Date());
        reason = shouldRun ? "Friday 06:00 recovery retry" : "05:00 refresh already confirmed";
      } catch {
        shouldRun = true;
        reason = "Friday 06:00 recovery retry after missing or invalid data";
      }
    }

    await writeOutput({ should_run: String(shouldRun), reason });
  }
} else if (command === "validate") {
  const data = await readData();
  if (localDateKey(new Date(data.updatedAt)) !== localDateKey(new Date())) {
    throw new Error(`${dataPath} was not refreshed today in ${timeZone}`);
  }
  console.log(`Validated ${data.events.length} events and UTF-8 JSON written at ${data.updatedAt}`);
} else if (command === "validate-links") {
  await checkLinks(dataPath);
} else {
  throw new Error(`Unknown command: ${command}`);
}
