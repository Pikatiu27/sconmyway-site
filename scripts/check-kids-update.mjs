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

async function readData() {
  const bytes = await readFile(dataPath);
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (text.includes("\uFFFD")) throw new Error(`${dataPath} contains invalid replacement characters`);
  const data = JSON.parse(text);
  if (!data.updatedAt || !Array.isArray(data.events) || data.events.length < 3) {
    throw new Error(`${dataPath} is missing updatedAt or valid events`);
  }
  for (const [index, event] of data.events.entries()) {
    for (const field of ["titleZh", "summaryZh", "timeZh", "placeZh", "referenceZh"]) {
      if (typeof event[field] !== "string" || !event[field].trim()) {
        throw new Error(`events[${index}].${field} is missing`);
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
    let shouldRun = parts.weekday === "Fri" && parts.hour === "06";
    let reason = shouldRun ? "Friday 06:00 primary refresh" : "outside refresh window";

    if (parts.weekday === "Fri" && parts.hour === "07") {
      try {
        const data = await readData();
        shouldRun = localDateKey(new Date(data.updatedAt)) !== localDateKey(new Date());
        reason = shouldRun ? "Friday 07:00 recovery retry" : "06:00 refresh already confirmed";
      } catch {
        shouldRun = true;
        reason = "Friday 07:00 recovery retry after missing or invalid data";
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
