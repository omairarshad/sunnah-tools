# Sunnah Tools — UX/UI redesign and tool expansion study
Date: 2026-10-24

## Competitor research, grounded in live public interfaces

- **Falah** https://falah.io/en/ — searchable, category-filtered tool directory; useful clear descriptions and instant access to each tool. It offers 20 tools, so just adding quantity is not a differentiator.
- **IslamicFinder** https://www.islamicfinder.org/ — strong prayer-time/calendar visibility and broad link navigation, but multiple app/promotional sections create a different experience from our focused utility site.
- **IslamTools** https://www.islamtools.com/ — focused short list of browser tools, clear regional prayer methods and phone-first practical copy.
- **Noor** https://noor.towfique.com/ — glanceable prayer information, quick navigation and a substantial suite of tools without sign-up.

Observations are qualitative UX interpretation; no paid user research or live keyword volume measurements were available. Do not copy artwork, brand assets, site markup or competitors' religious claims.

## Decision: a searchable utility directory, not an ad-filled dashboard

Sunnah Tools needs to succeed on two arrival paths:
1. A visitor arrives at the homepage and needs to locate a tool in seconds.
2. A visitor arrives at a specific calculator from Google and should see the working interaction above the methodology and related links.

### Implemented in V2
- Warm ivory, deep forest-green and restrained brass accents; modern sans typography with a literary serif for limited editorial headings; custom, consistent outline tool iconography.
- Small navigation bar with links to the most common tasks.
- Compact introduction with four useful quick links rather than a tall promotional banner.
- Search and category filters, saved tools and recently visited tools, all device-local and registration-free; a useful no-results recovery state.
- Refined calculator pages with the interactive tool ahead of the methodology, share link and save action, concise accurate content, contextual related links and strong mobile spacing.
- Responsive two-column and single-column layouts, 44px-friendly form controls and legible typography.
- Reduced-motion CSS, keyboard search focus shortcut, skip link, visible focus outlines and accessible labels.
- Print-oriented CSS for timetables and prayer charts.
- Correct canonical links, semantic page headings and meaningful crawler-readable context retained.

### Acceptance gates
- Run full unit checks, Astro type check and static build.
- Validate generated homepage and all 17 tool routes, robots/sitemap, mobile viewport meta and tool JS bundles.
- Manually review desktop and mobile screenshots, keyboard/VoiceOver flow, legibility and actual form interactions after deployment. CI alone cannot replace a real-device UI test.

## New tool candidates after design work

These are **relative opportunities**, not quantified Google keyword search volume.

| Priority | Tool | Rationale | Build risk |
| --- | --- | --- | --- |
| P1 | **White Days (Ayyam al-Bid) calendar + reminders** | Distinct monthly repeat-visit intent; 13, 14, 15 of each Hijri month | Require local moon-sighting caveat and timezone conventions |
| P1 | **Hijri monthly calendar generator (printable)** | Evergreen, genuinely useful PDF output without registration | Month adjustments and printable layout |
| P1 | **Islamic prayer-times embed/widget for blogs & mosques** | Helps community websites and may earn editorial backlinks | Performance, correctness, method configuration; no forced backlinks |
| P1 | **Ramadan 2027 personalised A4 timetable** | Likely seasonal utility; shareable print/download | Timezone, high latitude, daylight saving, moon sighting |
| P2 | **Zakat al-Fitr / Fitrana calculator** | Seasonal specific need; suitable existing Zakat architecture | Jurisdiction-aware per-person rates, commodity or charity policy; review |
| P2 | **Sadaqah / donation tracker** | Private, repeat-use local data; no account needed | Export/backup optional |
| P2 | **Hajj / Umrah packing checklist** | Useful pre-travel checklist with print and reset | Official requirements differ year to year |
| P2 | **Islamic inheritance share explainer** | High intent but important nuances | Needs specialist scholarly + legal review; do NOT rush an automated authoritative estimator |
| P3 | **Verified daily duas** | Likely repeat visits, links to prayer and travel tools | Source/authenticity audit, Arabic text and translations rights |
| P3 | **Islamic names & meanings search** | Potential broad search interest | Names, meanings, spelling and authenticity research |
| P3 | **Halal ingredients / E-number checker** | Search opportunity and practical value | Regional manufacturing sources, ambiguous substances; data upkeep |

## Sequencing

1. Finish and deploy design system; verify no page regressions.
2. Implement White Days calendar and printable month view.
3. Improve Ramadan calendar printing and region-specific verification.
4. Build embeddable prayer widget with optional attribution (not coercive SEO links).
5. Collect Search Console query data and use actual user search/click results to set the next roadmap.

## Source references

- https://falah.io/en/
- https://www.islamicfinder.org/
- https://www.islamtools.com/
- https://noor.towfique.com/
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

Google's guidance prioritises useful original content, clear author/site ownership and strong page experience. We should not create large numbers of thin pages to pursue keyword count.
