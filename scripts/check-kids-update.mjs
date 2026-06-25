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

async function readData() {
  const bytes = await readFile(dataPath);
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (text.includes("\uFFFD")) throw new Error(`${dataPath} contains invalid replacement characters`);
  const data = JSON.parse(text);
  if (!data.updatedAt || !Array.isArray(data.events) || data.events.length < 3) {
    throw new Error(`${dataPath} is missing updatedAt or valid events`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.periodStart || "") || !/^\d{4}-\d{2}-\d{2}$/.test(data.periodEnd || "")) {
    throw new Error(`${dataPath} is missing Friday-to-Friday periodStart/periodEnd`);
  }
  if (isoWeekday(data.periodStart) !== 5 || daysBetween(data.periodStart, data.periodEnd) !== 7) {
    throw new Error(`${dataPath} period must run from Friday to the next Friday`);
  }
  for (const [index, event] of data.events.entries()) {
    for (const field of ["titleZh", "summaryZh", "timeZh", "placeZh", "referenceZh"]) {
      if (typeof event[field] !== "string" || !event[field].trim()) {
        throw new Error(`events[${index}].${field} is missing`);
      }
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

async function writeOutput(values) {
  if (!process.env.GITHUB_OUTPUT) return;
  await appendFile(process.env.GITHUB_OUTPUT, Object.entries(values).map(([key, value]) => `${key}=${value}\n`).join(""), "utf8");
}

if (command === "gate") {
  if (process.env.GITHUB_EVENT_NAME === "workflow_dispatch") {
    await writeOutput({ should_run: "true", reason: "manual run" });
  } else {
    const parts = localParts();
    let shouldRun = parts.weekday === "Fri" && parts.hour === "00";
    let reason = shouldRun ? "Friday 00:00 primary refresh" : "outside refresh window";

    if (parts.weekday === "Fri" && parts.hour === "01") {
      try {
        const data = await readData();
        shouldRun = localDateKey(new Date(data.updatedAt)) !== localDateKey(new Date());
        reason = shouldRun ? "Friday 01:00 recovery retry" : "00:00 refresh already confirmed";
      } catch {
        shouldRun = true;
        reason = "Friday 01:00 recovery retry after missing or invalid data";
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
} else {
  throw new Error(`Unknown command: ${command}`);
}
