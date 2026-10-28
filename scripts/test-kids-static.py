"""Offline regression checks; these do not replace browser or source verification."""
import importlib.util
import json
import re
import sys
import unittest
from datetime import date, timedelta
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
SPEC = importlib.util.spec_from_file_location("kids_sync", ROOT / "scripts/sync-kids-static.py")
SYNC = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(SYNC)


class Tags(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.tags = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


class KidsStaticTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "kids/index.html").read_text(encoding="utf-8")
        cls.presentation = json.loads(SYNC.PRESENTATION_PATH.read_text(encoding="utf-8"))
        cls.cities = [(city, marker, more, json.loads(path.read_text(encoding="utf-8")))
                      for city, marker, more, path in SYNC.CITY_CONFIGS]

    def test_counts_periods_and_fields(self):
        for city, _, _, data in self.cities:
            with self.subTest(city=city):
                self.assertTrue(0 <= len(data["events"]) <= 8)
                self.assertTrue(0 <= len(data["moreLinks"]) <= 5)
                start, end = map(date.fromisoformat, [data["periodStart"], data["periodEnd"]])
                self.assertEqual(start.weekday(), 4)
                self.assertEqual((end - start).days, 7)
                for event in data["events"]:
                    self.assertIsInstance(event["longTerm"], bool)
                    self.assertTrue(event["mapQuery"])
                    self.assertEqual(urlsplit(event["url"]).scheme, "https")
                    for prefix in ["tag", "title", "summary", "time", "place", "price", "reference"]:
                        self.assertTrue(event[prefix + "Zh"])
                        self.assertTrue(event[prefix + "En"])
                        self.assertNotRegex(event[prefix + "En"], r"[\u3400-\u9fff\ufffd]")
                self.assertFalse(any(e["longTerm"] for e in data["events"][:4]))

    def test_generated_blocks_match_data(self):
        for city, marker, more, data in self.cities:
            cards = "\n".join(SYNC.card(event, index, city, SYNC.presentation_for(data, event, self.presentation)) for index, event in enumerate(data["events"]))
            self.assertIn(cards, self.html)
            self.assertIn(SYNC.more_links(data), self.html)

    def test_status_is_independent_of_position(self):
        event = dict(self.cities[0][3]["events"][0])
        for index in [0, 4, 7]:
            event["longTerm"] = False
            self.assertIn("This week", SYNC.card(event, index, "sydney"))
            self.assertNotIn("More picks", SYNC.card(event, index, "sydney"))
            event["longTerm"] = True
            self.assertIn("Ongoing", SYNC.card(event, index, "sydney"))

    def test_titles_and_escaping(self):
        event = dict(self.cities[0][3]["events"][0])
        event["titleZh"] = '<unsafe> & "title"'
        rendered = SYNC.card(event, 0, "sydney")
        self.assertIn("&lt;unsafe&gt; &amp; &quot;title&quot;", rendered)
        self.assertNotIn("<unsafe>", rendered)
        self.assertNotIn('class="official-title', rendered)
        self.assertIn('class="date-ticket"', rendered)

    def test_presentation_is_scoped_to_publication_week(self):
        data = self.cities[0][3]
        event = data["events"][1]
        self.assertTrue(SYNC.presentation_for(data, event, self.presentation))
        next_week = {**data, **{key: (date.fromisoformat(data[key]) + timedelta(days=7)).isoformat()
                               for key in ("periodStart", "periodEnd")}}
        self.assertEqual(SYNC.presentation_for(next_week, event, self.presentation), {})
        self.assertEqual(SYNC.presentation_for(data, {**event, "shareKey": "new-event"}, self.presentation), {})

    def test_routes_and_no_published_event_photographs(self):
        for item in self.presentation["items"].values():
            for key, value in item.items():
                if key.endswith("En"):
                    self.assertNotRegex(value, r"[\u3400-\u9fff\ufffd]")
            route = item.get("route")
            if not route:
                continue
            self.assertTrue(route["checkedAt"])
            self.assertNotRegex(route["summaryEn"] + route["noteEn"], r"[\u3400-\u9fff\ufffd]")
            rendered = SYNC.route_html(route)
            self.assertIn('<details class="half-day-route">', rendered)
            self.assertEqual(rendered.count('class="route-place"'), len(route["steps"]))
            for step in route["steps"]:
                self.assertEqual(len(step), 5)
                self.assertNotRegex(step[1] + step[3], r"[\u3400-\u9fff\ufffd]")
            for _, url in route["sources"]:
                self.assertTrue(url.startswith("https://"))
        self.assertNotIn("preview/", self.html)
        self.assertNotIn("event-photo", self.html)
        self.assertNotIn("harry-potter.webp", self.html)

    def test_more_title_and_source_are_separate_bilingual_elements(self):
        for _, _, _, data in self.cities:
            rendered = SYNC.more_links(data)
            self.assertEqual(rendered.count('class="more-title"'), len(data["moreLinks"]))
            self.assertEqual(rendered.count("<small>"), len(data["moreLinks"]))
            for item in data["moreLinks"]:
                for field in ["titleZh", "titleEn", "sourceZh", "sourceEn"]:
                    self.assertTrue(item[field])
                self.assertNotRegex(item["titleEn"] + item["sourceEn"], r"[\u3400-\u9fff]")

    def test_unique_share_targets(self):
        for city, _, _, data in self.cities:
            keys = [e.get("shareKey") or e["url"] for e in data["events"]]
            self.assertEqual(len(keys), len(set(keys)), city)
        self.assertIn("card.dataset.shareKey || official?.href", self.html)

    def test_without_official_link(self):
        event = dict(self.cities[0][3]["events"][0], url="")
        rendered = SYNC.card(event, 0, "sydney")
        self.assertNotIn('class="action primary"', rendered)
        self.assertIn("google.com/maps/search/?api=1", rendered)

    def test_page_structure(self):
        tags = Tags(self.html).tags
        ids = [attrs["id"] for _, attrs in tags if "id" in attrs]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertEqual(sum(tag == "h1" for tag, _ in tags), 1)
        self.assertEqual(sum(tag == "article" and "-event" in attrs.get("class", "") for tag, attrs in tags), sum(len(data["events"]) for _, _, _, data in self.cities))
        self.assertTrue(any(tag == "link" and attrs.get("href") == "notebook.css" for tag, attrs in tags))
        self.assertNotIn("\ufffd", self.html)
        for tag, attrs in tags:
            if tag == "a":
                self.assertTrue(attrs.get("href"))
        self.assertEqual(self.html.count('timeZone: "Australia/Sydney"'), 6)

    def test_mobile_template_and_assets(self):
        total = sum(len(data["events"]) for _, _, _, data in self.cities)
        self.assertEqual(self.html.count('class="event-heading"'), total)
        self.assertIn('id="city-select"', self.html)
        self.assertIn('viewport-fit=cover', self.html)
        self.assertLess(self.html.index('<section class="meta-bar"'), self.html.index('<section class="finder-controls"'))
        self.assertIn('href="field-notes.css?v=20261026"', self.html)
        self.assertIn('src="field-notes.js?v=20261029"', self.html)
        for _, attrs in Tags(self.html).tags:
            if attrs.get("class") == "fn-icon":
                self.assertTrue((ROOT / "kids" / attrs["src"]).exists())
        for filename in ["field-notes.css", "field-notes.js", "event-filters.mjs", "family-journal.css", "family-journal.js", "journal.js"]:
            self.assertNotIn("preview/", (ROOT / "kids" / filename).read_text(encoding="utf-8"))
        fonts = (ROOT / "kids/assets/fonts.css").read_text(encoding="utf-8")
        self.assertIn("unicode-range:", fonts)
        self.assertNotIn("https://", fonts)
        for path in re.findall(r"url\(([^)]+)\)", fonts):
            self.assertTrue((ROOT / "kids/assets" / path).exists(), path)

    def test_date_ticket_all_months_and_fallback(self):
        for number, name in enumerate(SYNC.month_abbr):
            if not name:
                continue
            rendered = SYNC.date_ticket(f"{number}月25日", f"25 {name.upper()}")
            self.assertIn('class="date-number"', rendered)
            self.assertIn(f"{number}月", rendered)
        self.assertIn('class="date-number date-range"', SYNC.date_ticket("1月24–25日", "24–25 JAN"))
        for label in ["On now", "UNTIL 2 NOV", "This week", "30 OCT–2 NOV"]:
            self.assertNotIn('class="date-number', SYNC.date_ticket("核实标签", label))
        self.assertIn('date-prelude', SYNC.date_ticket("至11月2日", "UNTIL 2 NOV"))
        self.assertIn('date-state', SYNC.date_ticket("持续展出", "On now"))

    def test_family_copy_and_time_fallback(self):
        event = self.cities[0][3]["events"][0]
        metadata = {"introZh": "简短介绍", "introEn": "Short introduction",
                    "familyFitZh": "须成人陪同", "familyFitEn": "Adult required",
                    "noteZh": "预约后入场", "noteEn": "Booking required",
                    "timeShortZh": "查看场次", "timeShortEn": "Check sessions", "showFullTime": True}
        rendered = SYNC.card(event, 0, "sydney", metadata)
        for value in ["family-fit", "outing-note", "schedule-copy", event["timeEn"], "Short introduction"]:
            self.assertIn(value, rendered)
        fallback = SYNC.card(event, 0, "sydney")
        self.assertIn(SYNC.pair(event["summaryEn"]), fallback)
        self.assertNotIn("family-fit", fallback)


if __name__ == "__main__":
    unittest.main()
