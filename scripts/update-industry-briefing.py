from __future__ import annotations

import argparse
import json
import shutil
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo


REPO = Path(__file__).resolve().parents[1]
ROOT = REPO.parent.parent if REPO.parent.name == "outputs" else REPO.parent
LIVE_DIR = REPO / "industry"
LIVE_HTML = LIVE_DIR / "index.html"
LIVE_JSON = LIVE_DIR / "daily-data.json"
GUIDE = LIVE_DIR / "INDUSTRY_BRIEFING_GUIDE.md"

LEGACY_OUTPUTS = ROOT / "outputs"
MIRROR_TARGETS = (
    (LIVE_HTML, LEGACY_OUTPUTS / "industry" / "index.html"),
    (LIVE_JSON, LEGACY_OUTPUTS / "industry" / "daily-data.json"),
    (LIVE_HTML, LEGACY_OUTPUTS / "index.html"),
    (LIVE_JSON, LEGACY_OUTPUTS / "daily-data.json"),
) if LEGACY_OUTPUTS.exists() else ()

TODAY = datetime.now(ZoneInfo("Australia/Sydney")).date().isoformat()


def extract_fallback_block(html: str) -> tuple[int, int]:
    marker = "const fallback = "
    start = html.index(marker) + len(marker)
    brace_start = html.index("{", start)
    depth = 0
    in_string = False
    escape = False

    for index in range(brace_start, len(html)):
        char = html[index]
        if in_string:
            if escape:
                escape = False
            elif char == "\\":
                escape = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                end = index + 1
                if html[end:end + 1] == ";":
                    end += 1
                return brace_start, end
    raise ValueError("Could not locate end of fallback JSON block")


def replace_fallback(html: str, data: dict) -> str:
    start, end = extract_fallback_block(html)
    fallback = json.dumps(data, ensure_ascii=False, indent=6)
    return html[:start] + fallback + html[end:]


def safe_url(url: str) -> bool:
    return url.startswith("https://")


def assert_no_mojibake(text: str, label: str) -> None:
    bad_markers = ["锟", "脙", "脗", "冒鸥", "鈥�"]
    if any(marker in text for marker in bad_markers):
        raise AssertionError(f"{label} appears to contain mojibake")


def validate_bilingual(value: dict, label: str) -> None:
    if not isinstance(value, dict) or not value.get("zh") or not value.get("en"):
        raise AssertionError(f"{label} requires zh and en")


def validate_references(item: dict, label: str) -> None:
    links = item.get("referenceLinks", [])
    if not links:
        raise AssertionError(f"{label} is missing referenceLinks")
    for link in links:
        if not link.get("label"):
            raise AssertionError(f"{label} has a reference link without label")
        if not safe_url(link.get("url", "")):
            raise AssertionError(f"{label} has a non-HTTPS reference URL: {link}")


def validate_data(data: dict, html_text: str, *, require_today: bool) -> None:
    if require_today and data.get("date") != TODAY:
        raise AssertionError(f"Expected Sydney date {TODAY}, got {data.get('date')}")
    if len(data.get("liveUpdates", [])) != 3:
        raise AssertionError("Expected exactly 3 live updates")
    if len(data.get("insights", [])) != 3:
        raise AssertionError("Expected exactly 3 insights")
    if not data.get("classroom"):
        raise AssertionError("Classroom section is required")

    seen_titles: set[str] = set()
    for index, item in enumerate(data["liveUpdates"], start=1):
        validate_bilingual(item.get("topic"), f"liveUpdates[{index}].topic")
        validate_bilingual(item.get("title"), f"liveUpdates[{index}].title")
        validate_bilingual(item.get("summary"), f"liveUpdates[{index}].summary")
        validate_references(item, f"liveUpdates[{index}]")
        seen_titles.add(item["title"]["zh"])

    for index, item in enumerate(data["insights"], start=1):
        validate_bilingual(item.get("area"), f"insights[{index}].area")
        validate_bilingual(item.get("title"), f"insights[{index}].title")
        validate_bilingual(item.get("summary"), f"insights[{index}].summary")
        validate_references(item, f"insights[{index}]")
        seen_titles.add(item["title"]["zh"])

    if len(seen_titles) != 6:
        raise AssertionError("Live updates and insights must not duplicate item titles")

    classroom = data["classroom"]
    validate_bilingual(classroom.get("title"), "classroom.title")
    validate_bilingual(classroom.get("text"), "classroom.text")
    validate_references(classroom, "classroom")
    if len(classroom.get("comparisonPoints", [])) != 3:
        raise AssertionError("Expected exactly 3 classroom comparison points")

    equations = classroom.get("example", {}).get("equations", [])
    if len(equations) < 3:
        raise AssertionError("Expected at least 3 classroom equations")
    for index, equation in enumerate(equations, start=1):
        if not equation.get("formulaTokens"):
            raise AssertionError(f"equations[{index}] requires formulaTokens")
        validate_bilingual(equation.get("citation"), f"equations[{index}].citation")

    fallback_start, fallback_end = extract_fallback_block(html_text)
    fallback_text = html_text[fallback_start:fallback_end].rstrip(";")
    fallback = json.loads(fallback_text)
    if fallback != data:
        raise AssertionError("Embedded fallback does not match JSON data")

    required_html = [
        "#today",
        "formatDate(dailyData.date)",
        "@media (max-width: 520px)",
        '${equation.citation ? `<p class="equation-citation">',
    ]
    for snippet in required_html:
        if snippet not in html_text:
            raise AssertionError(f"Expected HTML snippet is missing: {snippet}")

    assert_no_mojibake(json.dumps(data, ensure_ascii=False), "data")
    assert_no_mojibake(html_text, "HTML")


def load_data(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise AssertionError("daily-data.json must contain a JSON object")
    return data


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Sync industry/daily-data.json into index.html fallback and validate it. "
            "This script intentionally does not generate daily briefing content."
        )
    )
    parser.add_argument(
        "--allow-non-today",
        action="store_true",
        help="Allow validation for a date other than today's Australia/Sydney date.",
    )
    args = parser.parse_args()

    if not GUIDE.exists():
        raise FileNotFoundError(
            "Missing industry guide. Expected industry/INDUSTRY_BRIEFING_GUIDE.md"
        )

    data = load_data(LIVE_JSON)
    html_text = LIVE_HTML.read_text(encoding="utf-8")
    LIVE_HTML.write_text(replace_fallback(html_text, data), encoding="utf-8")

    synced_html = LIVE_HTML.read_text(encoding="utf-8")
    validate_data(data, synced_html, require_today=not args.allow_non_today)

    for source, target in MIRROR_TARGETS:
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)

    print(
        "Synced industry briefing fallback for "
        f"{data.get('date')} from {LIVE_JSON.relative_to(REPO)}"
    )
    print("Content generation must happen before this script runs.")


if __name__ == "__main__":
    main()
