# Colour-coded tools & second tool batch
Date: 24 October 2026

## Reference and design decision

The owner supplied a utilities-directory screenshot with distinct per-tool colours. We borrowed the **interaction principle** (visual categorisation using colour, labels and icons) rather than copying the third-party branding, layout or artwork.

- Nine restrained colours: teal, blue, violet, coral, rose, amber, emerald, mint, indigo.
- Accents are explicit per tool in `src/data/toolTones.ts` rather than arbitrary classes. Both home cards and tool-detail pages share the same identity.
- Colours never replace text, icons or category names; usability is preserved in monochrome, high contrast and screen readers.
- Mobile layout, focus indicators, print styles and legacy calculator inputs remain supported.

## Four added tools (21 total)

1. `/tools/white-days-calendar/` — six-month forward White Days planner, print and voluntary-day .ics export. Specifically does **not** recommend a voluntary fast on 13 Dhul Hijjah (day of Tashreeq), and identifies Ramadan fasting as obligatory rather than a separate voluntary White Days fast. Source: https://sunnah.com/abudawud/14/137 and https://www.islamic-relief.org.uk/giving/islamic-giving/qurbani/dhul-hijjah/days-of-tashreeq/
2. `/tools/printable-hijri-calendar/` — monthly print/save-as-PDF Gregorian/Hijri calendar generated from month boundaries; 29/30-day month calculations. Moon sighting can differ.
3. `/tools/prayer-times-widget/` — configurable builder and shareable iframe code pointing at `/embed/prayer-times/`. Config includes city/coordinates, IANA timezone, calculation method, Asr school, light/dark theme. Calculated prayer starts, **not** mosque jamaat times. External iframe inclusion additionally depends on Hostinger/proxy frame headers; do not claim cross-origin embedding works until live validation.
4. `/tools/umrah-packing-checklist/` — print-friendly checklist for Umrah or Hajj preparations, with local-only progress. It is **not** official permit, airline, visa or health requirements.

The embed-only page has a noindex meta directive and is excluded from the Astro sitemap; the indexable builder page has original explanation and configurable functionality.

## Required QA and post-deploy checks

- Unit test lunar calendar boundaries, chronological White Days, the Dhul Hijjah 13 exception and Ramadan qualification.
- Astro type-check and full static build; verify all 21 tool pages in `sitemap-0.xml`.
- Chromium desktop/mobile smoke test verifies colour spread, saved tools, Hijri default, calendar, checklist, and iframe preview.
- Verify actual iframe framing from an external origin after Hostinger publishes. If Hostinger sets `X-Frame-Options: SAMEORIGIN` or restrictive `Content-Security-Policy: frame-ancestors`, support configuration adjustment or a non-iframe distribution method instead. Do **not** weaken security headers without an explicit reviewed change.
- Spot-check regional prayer times against trusted local timetables. High latitude and DST cases require dedicated review.

## Future tool candidates

- Ramadan 2027 personalised timetable with more substantial print controls (29/30 days, local sighting, artwork/download layout).
- Hijri birthday and anniversary reminder export.
- Dua collection with Arabic and rigorously verified citations/transliteration (higher editorial and rights burden).
- Fitrana calculator for a specific verified country and charity amount (do not invent live amounts).
- Optional export/backup of locally saved trackers and a print-ready Hajj/Umrah journey plan.
- Mosque timetable uploads (different from calculated prayer beginnings), requiring authenticated mosque ownership and validation.

Do not mass-produce per-city doorway pages. Prefer useful tools supported by accurate and clearly qualified religious methods.
