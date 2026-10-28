from __future__ import annotations

import json
import re
from calendar import month_abbr
from datetime import date
from html import escape
from pathlib import Path
from urllib.parse import quote_plus


ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "kids" / "index.html"
PRESENTATION_PATH = ROOT / "kids" / "data" / "event-presentation.json"

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


def icon(name: str) -> str:
    return f'<img class="fn-icon" src="assets/icons/{name}.svg" alt="" aria-hidden="true">'


def action(url: str, label_zh: str, label_en: str, class_name: str = "action", icon_name: str | None = None) -> str:
    glyph = icon(icon_name) if icon_name else ""
    return (
        f'<a class="{class_name}" href="{escape(url, quote=True)}" '
        f'target="_blank" rel="noreferrer">{glyph}<span class="zh">{label_zh}</span>'
        f'<span class="en">{label_en}</span></a>'
    )


def presentation_for(data: dict, event: dict, presentation: dict) -> dict:
    if (presentation.get("periodStart"), presentation.get("periodEnd")) != (data["periodStart"], data["periodEnd"]):
        return {}
    return presentation.get("items", {}).get(event.get("shareKey") or event.get("url"), {})


def bilingual(zh: object, en: object) -> str:
    return f'<span class="zh">{pair(zh)}</span><span class="en">{pair(en)}</span>'


def date_ticket(zh: str, en: str) -> str:
    until = re.fullmatch(r"至(\d{1,2})月(\d{1,2})日", zh)
    if until:
        month, day = map(int, until.groups())
        if 1 <= month <= 12:
            return (f'<span class="sr-only">{bilingual(zh, en)}</span>'
                    f'<span class="date-prelude" aria-hidden="true">{bilingual("至", "UNTIL")}</span>'
                    f'<span class="date-number" aria-hidden="true">{day}</span>'
                    f'<span class="date-caption" aria-hidden="true">{bilingual(str(month) + "月", month_abbr[month].upper())}</span>')
    if zh in {"持续展出", "持续开放"}:
        return (f'<span class="sr-only">{bilingual(zh, en)}</span>'
                f'<span class="zh" aria-hidden="true"><span class="date-state"><span>持续</span><span>{zh[2:]}</span></span></span>'
                '<span class="en" aria-hidden="true"><span class="date-state date-state-en"><span>ON</span><span>NOW</span></span></span>')
    match = re.fullmatch(r"(\d{1,2}(?:[–-]\d{1,2})?) ([A-Z]{3})", en)
    months = {name.upper(): number for number, name in enumerate(month_abbr) if name}
    if not match or match[2] not in months:
        return bilingual(zh, en)
    number = match[1]
    number_class = "date-number date-range" if len(number) > 2 else "date-number"
    return (f'<span class="sr-only">{bilingual(zh, en)}</span>'
            f'<span class="{number_class}" aria-hidden="true">{pair(number)}</span>'
            f'<span class="date-caption" aria-hidden="true">{bilingual(str(months[match[2]]) + "月", match[2])}</span>')


def route_html(route: dict | None) -> str:
    if not route or not route.get("steps"):
        return ""
    steps = []
    for index, (phase_zh, phase_en, place_zh, place_en, query) in enumerate(route["steps"]):
        url = f"https://www.google.com/maps/search/?api=1&query={quote_plus(query)}"
        purposes = route.get("purposes", [])
        purpose = f'<span class="route-stop-purpose">{bilingual(*purposes[index])}</span>' if index < len(purposes) else ""
        steps.append(f'<li><small>{bilingual(phase_zh, phase_en)}</small>{action(url, pair(place_zh), pair(place_en), "route-place")}{purpose}</li>')
    sources = " · ".join(f'<a href="{pair(url)}" target="_blank" rel="noreferrer">{pair(label)}</a>' for label, url in route.get("sources", []))
    return f'''<details class="half-day-route"><summary><span class="route-summary-copy"><strong>{bilingual("半日路线", "Half-day plan")}</strong><span class="route-short-path">{bilingual(route.get("summaryZh"), route.get("summaryEn"))}</span></span><img class="route-chevron" src="assets/icons/chevron-down.svg" alt="" aria-hidden="true"></summary><div class="route-expanded"><ol>{"".join(steps)}</ol><p>{bilingual(route.get("noteZh"), route.get("noteEn"))}</p><span class="route-sources">{bilingual("路线地点：", "Route places: ")}{sources}</span></div></details>'''


def card(event: dict, index: int, city: str, presentation: dict | None = None) -> str:
    presentation = presentation or {}
    display = {**event, **{key: value for key, value in presentation.items() if key.endswith(("Zh", "En")) and not key.startswith("date")}}
    class_names = ["card", f"{city}-event"]
    if event.get("longTerm"):
        class_names.append("long-term")

    status_zh = presentation.get("dateZh") or ("持续活动" if event.get("longTerm") else "本周活动")
    status_en = presentation.get("dateEn") or ("Ongoing" if event.get("longTerm") else "This week")
    map_query = text(event.get("mapQuery") or event.get("placeEn") or event.get("placeZh") or event.get("titleEn"))
    map_url = f"https://www.google.com/maps/search/?api=1&query={quote_plus(map_query)}"
    official = text(event.get("url"))
    event_id = f"{city}-event-{index + 1}"
    share_key = pair(event.get("shareKey") or official)
    kind = presentation.get("kind", "event")
    if kind not in {"event", "festival", "outdoor", "show", "exhibition"}:
        raise ValueError(f"Unknown event presentation kind: {kind}")
    region_zh = text(event.get("tagZh")).split(" · ")[0]
    region_en = text(event.get("tagEn")).split(" · ")[0]
    time_zh = presentation.get("timeShortZh") or display.get("timeZh")
    time_en = presentation.get("timeShortEn") or display.get("timeEn")
    full_time = (f'<details class="schedule-details"><summary>{bilingual("完整时间", "Full opening hours")}</summary>'
                 f'<p class="schedule-copy">{bilingual(display.get("timeZh"), display.get("timeEn"))}</p></details>') if presentation.get("showFullTime") else ""
    family_fit = f'<p class="family-fit">{bilingual(presentation["familyFitZh"], presentation["familyFitEn"])}</p>' if presentation.get("familyFitZh") and presentation.get("familyFitEn") else ""
    intro_zh = presentation.get("introZh") or display.get("summaryZh")
    intro_en = presentation.get("introEn") or display.get("summaryEn")
    note = (f'<p class="outing-note zh">{pair(presentation["noteZh"])}</p>'
            f'<p class="outing-note en">{pair(presentation["noteEn"])}</p>') if presentation.get("noteZh") and presentation.get("noteEn") else ""
    ticket_class = "date-ticket date-until" if re.fullmatch(r"至\d{1,2}月\d{1,2}日", status_zh) else "date-ticket"

    actions = []
    if official:
        labels = {"official": ("官网", "Official"), "announcement": ("官方公告", "Announcement"), "tickets": ("官方购票", "Tickets")}
        label_zh, label_en = labels.get(event.get("linkType", "official"), labels["official"])
        actions.append(action(official, label_zh, label_en, "action primary" + (" announcement" if event.get("linkType") == "announcement" else ""), "external-link"))
    actions.append(action(map_url, "导航", "Map", icon_name="map-pin"))

    rendered = f"""        <article class="{' '.join(class_names)}" id="{event_id}" data-city="{city}" data-kind="{kind}" data-ends-on="{pair(event.get('endsOn'))}" data-share-key="{share_key}">
          <div class="event-heading"><div class="card-top"><div class="{ticket_class}">{date_ticket(status_zh, status_en)}</div></div><div class="event-heading-copy"><h3>{bilingual(display.get('titleZh'), display.get('titleEn'))}</h3><p class="event-region">{bilingual(region_zh, region_en)}</p></div></div>
          <div class="facts"><div class="fact" data-original-time-zh="{pair(display.get('timeZh'))}" data-original-time-en="{pair(display.get('timeEn'))}"><span aria-hidden="true">{icon('calendar')}</span>{bilingual(time_zh, time_en)}</div><div class="fact"><span aria-hidden="true">{icon('map-pin')}</span>{bilingual(display.get('placeZh'), display.get('placeEn'))}</div><div class="fact"><span aria-hidden="true">{icon('ticket')}</span>{bilingual(display.get('priceZh'), display.get('priceEn'))}</div></div>
          {full_time}{family_fit}
          <p class="summary zh">{pair(intro_zh)}</p><p class="summary en">{pair(intro_en)}</p>{note}
          {route_html(presentation.get('route'))}
          <div class="actions">{''.join(actions)}</div>
          <p class="reference"><b><span class="zh">参考来源：</span><span class="en">Reference:</span></b> <span class="zh">{pair(event.get('referenceZh'))}</span><span class="en">{pair(event.get('referenceEn'))}</span></p>
        </article>"""
    return "\n".join(line.rstrip() for line in rendered.splitlines())


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
    presentation = json.loads(PRESENTATION_PATH.read_text(encoding="utf-8")) if PRESENTATION_PATH.exists() else {}
    first_data = None

    for city, event_marker, more_marker, data_path in CITY_CONFIGS:
        data = json.loads(data_path.read_text(encoding="utf-8"))
        if first_data and (data["periodStart"], data["periodEnd"]) != (first_data["periodStart"], first_data["periodEnd"]):
            raise ValueError("City publication periods do not match; refusing to generate mixed-week HTML")
        first_data = first_data or data
        total = len(data["events"])
        count = f'<p class="event-count"><span class="zh">本周 {total} 条活动</span><span class="en">{total} activities this week</span></p>'
        cards = count + "\n" + "\n".join(card(event, index, city, presentation_for(data, event, presentation)) for index, event in enumerate(data["events"]))
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
