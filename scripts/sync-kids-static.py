from __future__ import annotations

import json
import re
from datetime import date
from html import escape
from pathlib import Path
from urllib.parse import quote_plus


ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "kids" / "index.html"

ACCENTS = [
    ("#ffcdbd", "#fff9ea"),
    ("#d7f8e4", "#f1fbff"),
    ("#d8ecff", "#fff3f9"),
    ("#ffe8a8", "#f4edff"),
    ("#f8d6e7", "#effbf4"),
    ("#d9f2ff", "#fff5df"),
    ("#e6defc", "#f7fff0"),
    ("#ffe1cc", "#eff7ff"),
]

LONG_ACCENTS = [
    ("#ece8ff", "#f9fff0"),
    ("#e4f3ff", "#fff6e7"),
    ("#fff0ca", "#f1f8ff"),
]

CITY_CONFIGS = [
    ("sydney", "EVENTS", "SYDNEY_MORE", ROOT / "kids" / "data" / "events.json"),
    ("melbourne", "MELBOURNE_EVENTS", "MELBOURNE_MORE", ROOT / "kids" / "data" / "melbourne-events.json"),
]


def text(value: object) -> str:
    return "" if value is None else str(value)


def pair(value: object) -> str:
    if isinstance(value, str):
        return escape(value, quote=True)
    return escape(text(value), quote=True)


def action(url: str, label_zh: str, label_en: str, class_name: str = "action") -> str:
    return (
        f'<a class="{class_name}" href="{escape(url, quote=True)}" '
        f'target="_blank" rel="noreferrer"><span class="zh">{label_zh}</span>'
        f'<span class="en">{label_en}</span></a>'
    )


def card(event: dict, index: int, city: str) -> str:
    accent, wash = LONG_ACCENTS[index % len(LONG_ACCENTS)] if event.get("longTerm") else ACCENTS[index % len(ACCENTS)]
    class_names = ["card", f"{city}-event"]
    if index == 0:
        class_names.append("featured")
    if event.get("longTerm"):
        class_names.append("long-term")

    status_zh = "持续活动" if event.get("longTerm") else "本周精选"
    status_en = "Ongoing" if event.get("longTerm") else "Weekly pick"
    map_query = text(event.get("mapQuery") or event.get("placeEn") or event.get("placeZh") or event.get("titleEn"))
    map_url = f"https://www.google.com/maps/search/?api=1&query={quote_plus(map_query)}"
    official = text(event.get("url"))
    event_id = f"{city}-event-{index + 1}"
    share_key = pair(event.get("shareKey") or official)
    official_title = (
        f'<p class="official-title zh" lang="en">{pair(event.get("titleEn"))}</p>'
        if event.get("titleZh") != event.get("titleEn") else ""
    )

    actions = []
    if official:
        labels = {"official": ("官网", "Official"), "announcement": ("官方公告", "Announcement"), "tickets": ("官方购票", "Tickets")}
        label_zh, label_en = labels.get(event.get("linkType", "official"), labels["official"])
        actions.append(action(official, label_zh, label_en, "action primary" + (" announcement" if event.get("linkType") == "announcement" else "")))
    actions.append(action(map_url, "导航", "Map"))

    return f"""        <article class="{' '.join(class_names)}" id="{event_id}" data-city="{city}" data-share-key="{share_key}" style="--accent:{accent};--wash:{wash};">
          <div class="card-top"><span class="tag"><span class="zh">{pair(event.get('tagZh'))}</span><span class="en">{pair(event.get('tagEn'))}</span></span><span class="status"><span class="zh">{status_zh}</span><span class="en">{status_en}</span></span></div>
          <h3><span class="zh">{pair(event.get('titleZh'))}</span><span class="en">{pair(event.get('titleEn'))}</span></h3>
          {official_title}
          <p class="summary zh">{pair(event.get('summaryZh'))}</p><p class="summary en">{pair(event.get('summaryEn'))}</p>
          <div class="facts"><div class="fact"><span>&#128337;</span><span class="zh">{pair(event.get('timeZh'))}</span><span class="en">{pair(event.get('timeEn'))}</span></div><div class="fact"><span>&#128205;</span><span class="zh">{pair(event.get('placeZh'))}</span><span class="en">{pair(event.get('placeEn'))}</span></div><div class="fact"><span>&#127915;</span><span class="zh">{pair(event.get('priceZh'))}</span><span class="en">{pair(event.get('priceEn'))}</span></div></div>
          <div class="actions">{''.join(actions)}</div>
          <p class="reference"><b><span class="zh">参考来源：</span><span class="en">Reference:</span></b> <span class="zh">{pair(event.get('referenceZh'))}</span><span class="en">{pair(event.get('referenceEn'))}</span></p>
        </article>"""


def more_links(data: dict) -> str:
    links = data.get("moreLinks") or []
    if not links:
        return ""

    current = [item for item in links if item.get("kind") != "backup"]
    backup = [item for item in links if item.get("kind") == "backup"]

    def group(items: list[dict], zh: str, en: str) -> str:
        if not items:
            return ""
        body = "".join(
            f'            <a href="{escape(text(item.get("url")), quote=True)}" target="_blank" rel="noreferrer">'
            f'<span class="more-title"><span class="zh">{pair(item.get("titleZh") or item.get("title"))}</span>'
            f'<span class="en">{pair(item.get("titleEn") or item.get("title"))}</span></span>'
            f'<small><span class="zh">{pair(item.get("sourceZh") or item.get("source"))}</span>'
            f'<span class="en">{pair(item.get("sourceEn") or item.get("source"))}</span></small></a>\n'
            for item in items
        ).rstrip()
        return f"""          <div class="more-group">
            <p class="more-heading"><span class="zh">{zh}</span><span class="en">{en}</span></p>
{body}
          </div>"""

    return "\n".join(
        block
        for block in [
            group(current, "更多本周候选", "More current options"),
            group(backup, "备用查找入口", "Backup source links"),
        ]
        if block
    )


def replace_block(html: str, marker: str, content: str) -> str:
    pattern = re.compile(
        rf"        <!-- {re.escape(marker)}_START -->.*?        <!-- {re.escape(marker)}_END -->",
        re.DOTALL,
    )
    replacement = f"        <!-- {marker}_START -->\n{content}\n        <!-- {marker}_END -->"
    new_html, count = pattern.subn(replacement, html)
    if count != 1:
        raise RuntimeError(f"Could not replace marker block: {marker}")
    return new_html


def main() -> None:
    html = INDEX.read_text(encoding="utf-8")
    first_data = None

    for city, event_marker, more_marker, data_path in CITY_CONFIGS:
        data = json.loads(data_path.read_text(encoding="utf-8"))
        if first_data and (data["periodStart"], data["periodEnd"]) != (first_data["periodStart"], first_data["periodEnd"]):
            raise ValueError("City publication periods do not match; refusing to generate mixed-week HTML")
        first_data = first_data or data
        total = len(data["events"])
        count = f'<p class="event-count"><span class="zh">本周 {total} 条活动</span><span class="en">{total} activities this week</span></p>'
        cards = count + "\n" + "\n".join(card(event, index, city) for index, event in enumerate(data["events"]))
        if not total:
            cards += '<p class="empty-events"><span class="zh">本周暂无已核实活动。</span><span class="en">No verified events for this week yet.</span></p>'
        html = replace_block(html, event_marker, cards)
        html = replace_block(html, more_marker, more_links(data))

    assert first_data is not None
    html, count = re.subn(
        r'<section class="meta-bar" aria-label="Page status" data-period-start="[^"]*" data-period-end="[^"]*">',
        f'<section class="meta-bar" aria-label="Page status" data-period-start="{first_data["periodStart"]}" data-period-end="{first_data["periodEnd"]}">',
        html,
        count=1,
    )
    if count != 1:
        raise RuntimeError("Could not update period metadata")

    period_start = date.fromisoformat(first_data["periodStart"])
    period_end = date.fromisoformat(first_data["periodEnd"])
    fallback_replacements = {
        r'periodMeta\?\.dataset\.periodStart \|\| "\d{4}-\d{2}-\d{2}"': (
            f'periodMeta?.dataset.periodStart || "{first_data["periodStart"]}"'
        ),
        r'periodMeta\?\.dataset\.periodEnd \|\| "\d{4}-\d{2}-\d{2}"': (
            f'periodMeta?.dataset.periodEnd || "{first_data["periodEnd"]}"'
        ),
    }
    for pattern, replacement in fallback_replacements.items():
        html, count = re.subn(pattern, replacement, html, count=1)
        if count != 1:
            raise RuntimeError(f"Could not update fallback period: {pattern}")

    month_en = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]
    visible_replacements = {
        r'<span data-today-zh>.*?</span>': f'<span data-today-zh>{period_start.year} 年 {period_start.month} 月 {period_start.day} 日</span>',
        r'<span data-week-zh>.*?</span>': f'<span data-week-zh>{period_start.month} 月 {period_start.day} 日至 {period_end.month} 月 {period_end.day} 日</span>',
        r'<span data-today-en>.*?</span>': f'<span data-today-en>{period_start.day} {month_en[period_start.month - 1]} {period_start.year}</span>',
        r'<span data-week-en>.*?</span>': f'<span data-week-en>{period_start.day} {month_en[period_start.month - 1]} to {period_end.day} {month_en[period_end.month - 1]}</span>',
    }
    for pattern, replacement in visible_replacements.items():
        html, count = re.subn(pattern, replacement, html, count=1)
        if count != 1:
            raise RuntimeError(f"Could not update visible period text: {pattern}")

    INDEX.write_text(html, encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
