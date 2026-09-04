# Local Layout Review - 5 September 2026

## Scope

Local changes only. No commit, push, deployment or automation schedule changes.
The publication period remains 4-11 September 2026; a layout correction is not a new weekly refresh.

## Changes

- Week first; update date smaller underneath. Dates use Australia/Sydney formatting.
- Chinese short event titles with smaller official English names; English mode has one title.
- Event status comes from researched `longTerm`, not its index in the list.
- More link title and source are separate bilingual elements; one disclosure icon.
- One-row Official / Map / Share actions, restrained body weights and visible keyboard focus.
- Keep unique existing share identities when replacing directory URLs with event detail URLs.
- Separate previously colliding Melbourne market / Inside Out and Bigge Park / Casula share identities. Old ambiguous links cannot identify which of the two cards the sender intended.

## Information Corrections

- [Harry Potter venue](https://harrypotterexhibition.com/locations/sydney/): Paddington Pavilion, Sydney Showground, not Darling Harbour; Olympic Boulevard entrance.
- [Cheer Challenge](https://whatson.melbourne.vic.gov.au/things-to-do/the-melbourne-cheer-challenge): Fed Square, not Melbourne Park; 6 September, 11:30am-2pm.
- [Lygon Street Market](https://whatson.melbourne.vic.gov.au/things-to-do/the-lygon-street-market): Piazza Italia, Argyle Square; 6 September, 10am-3pm.
- [Inside Out](https://whatson.melbourne.vic.gov.au/things-to-do/inside-out): ArtPlay, ages 2-7 with an adult; 4-6 September, 10:30am-12:30pm.
- Direct event pages and more precise locations for Imaginator, Fitzroy Gardens Outdoor Adventure, NGV Children's Play and Alchemy of a Rainforest.
- [Chatswood StreetFair](https://www.emergefestival.com.au/Chatswood-StreetFair): 5 September, 10am-6pm; parade at 2pm.

## Verification

- Eight offline regression tests: `py -3 scripts/test-kids-static.py`.
- UTF-8, bilingual event fields, 8+8 event cards and 4+4 More links.
- Generated event and More blocks match JSON; synchronising twice does not change HTML.
- Inline JavaScript syntax and CSS stylesheet parsing checked.
- More URLs researched: seven pages opened successfully; Lane Cove direct fetch returned 403, with festival details verified through the official indexed page. This is not proof of unrestricted access for every visitor.
- Source-level review covers 35 playground cards; it does not reverify every playground's facilities or opening conditions.
- Actual 320/375/390/430px screenshots and interaction tests remain pending: browser policy blocked the user-opened local file. Static checks do not prove no clipping, overlap or interaction defects.

## Before Publication

Inspect both languages, both cities and both views on a phone-sized viewport. Expand More, switch every region filter, and test a copied share link. Do not mark visual or deployment verification complete from the offline tests alone.
