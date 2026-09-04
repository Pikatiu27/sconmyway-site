"""Offline regression checks; these do not replace browser or source verification."""
import importlib.util
import json
import re
import sys
import unittest
from datetime import date
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
            cards = "\n".join(SYNC.card(event, index, city) for index, event in enumerate(data["events"]))
            self.assertIn(cards, self.html)
            self.assertIn(SYNC.more_links(data), self.html)

    def test_status_is_independent_of_position(self):
        event = dict(self.cities[0][3]["events"][0])
        for index in [0, 4, 7]:
            event["longTerm"] = False
            self.assertIn("Weekly pick", SYNC.card(event, index, "sydney"))
            self.assertNotIn("More picks", SYNC.card(event, index, "sydney"))
            event["longTerm"] = True
            self.assertIn("Ongoing", SYNC.card(event, index, "sydney"))

    def test_titles_and_escaping(self):
        event = dict(self.cities[0][3]["events"][0])
        event["titleZh"] = '<unsafe> & "title"'
        rendered = SYNC.card(event, 0, "sydney")
        self.assertIn("&lt;unsafe&gt; &amp; &quot;title&quot;", rendered)
        self.assertNotIn("<unsafe>", rendered)
        self.assertIn('class="official-title zh" lang="en"', rendered)

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


if __name__ == "__main__":
    unittest.main()
