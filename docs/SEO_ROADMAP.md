# Sunnah Tools: search growth and product roadmap

Created 24 October 2026. This is a prioritisation hypothesis, **not paid keyword-volume research**. No rankings or search-volume estimates have been verified. Measure actual impressions and clicks with Google Search Console.

## Search foundation (first)

1. Verify the `sunnah.tools` Domain property in Google Search Console (DNS TXT on the authoritative nameservers).
2. Submit `https://sunnah.tools/sitemap-index.xml`. Inspect all 13 tool URLs for indexing and mobile behaviour.
3. Check that only HTTPS and one preferred www/non-www variant resolve as canonical. Check mobile layout, Core Web Vitals and 404 responses.
4. Use one useful, indexable page per genuinely different calculator, with clear calculation methods, explanatory copy, source references and human review.
5. Collect Search Console impressions, click-through rates and queries after a few weeks. Refine page titles and tool features from real query data, not speculation.

## Implemented since this roadmap

- Gold Zakat calculator — karat-aware metal-value estimate, explicit Nisab/hawl qualifications.
- Suhoor and Iftar times — calculated times and next-event countdown.
- Islamic events calendar — approximate Hijri events with moon-sighting caveats.
- Printable Salah chart — blank 7/14/30-day A4 checklists.

## New tools to research next

| Priority | Idea | Value | Conditions before publishing |
|---|---|---|---|
| P1 | Islamic events calendar & downloadable calendar | Year-round dates, Ramadan, Eid, Hajj | Label astronomical predictions; allow regional month variations |
| P1 | Ramadan fasting time finder with next-event countdown | Frequent repeat visits during Ramadan | Reliable timezones; clearly distinguish calculated Fajr/Maghrib from local mosque timings |
| P1 | Prayer times embed/widget generator for mosque/community sites | Helps sites serve visitors and may bring editorial links | Accessibility, transparent source settings, no spam backlinks |
| P1 | Gold Zakat / jewellery estimator | Distinct user task, more specific than full Zakat form | Gold karats/purity, market pricing, differences in scholarly treatment |
| P2 | Printable Salah tracker and Ramadan kids' chart | Shareable and genuinely usable downloads | Clear print templates and privacy |
| P2 | Qurbani/Udhiyah share calculator | Seasonal helpful utility | Scholarly review of animal and participant rules |
| P2 | Fidya & Kaffarah estimate by country | People searching for support | Verified local authority amounts and jurisprudential differences |
| P2 | Umrah/Hajj preparation checklist | Practical reference and return visits | Official sources and up-to-date documentation |
| P3 | Halal additives checker | Product discovery/search potential | Professionally validated, jurisdiction-aware ingredients and ambiguous-source flags |
| P3 | Islamic inheritance estimator | Complex financial/religious planning | Specialist fiqh review and extensive edge-case tests; not fast-launch material |

## Trust and SEO guidelines

- Never create thousands of synthetic city pages with near-identical copy merely to capture search queries.
- Prefer true utility, original examples, meaningful date/location context and explicit calculation conventions.
- Do not include affiliate banners above calculators or obstruct tools with pop-ups.
- Provide source/methodology references for high-stakes religious or financial topics.
- Don't claim prayer times are exactly mosque jamaat times, or that Hijri dates are moon-sighting announcements.
- Don't invent review stars or FAQ rich-result eligibility. Google retired FAQ rich results in 2026.
- Keep pages server-rendered/static in Astro, with React hydration only for interactions.
- Add analytics only after updating privacy disclosures; never silently transmit private Zakat/fasting inputs.

## Reference material

Google people-first guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

Google SEO starter guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

Search Console setup: https://support.google.com/webmasters/answer/34592

AlAdhan methods reference: https://aladhan.com/calculation-methods

Islamic Relief Nisab guidance: https://www.islamic-relief.org.uk/giving/islamic-giving/zakat/nisab/

## Updated implementation priorities

1. **Worldwide city search:** searchable city database with coordinates and IANA timezones; explicit source attribution and locality checks. Manual coordinates remain supported.
2. **Prayer time validation:** compare methods in UK (including high latitude), Gulf, Pakistan, North America, Malaysia, Australia and polar regions against recognised official timetables; include seasonal DST tests and adjust only with evidence.
3. **Ramadan 2027 preparation:** tested region-sensitive city guides rather than mass doorway pages; practical printable timetable layout.
4. **Editorial review and site trust:** transparent ownership, author/reviewer information where warranted, documented methodology, privacy and correction policy, and independent scholarly review for Zakat / fasting rulings.
5. **Performance monitoring:** PageSpeed Insights and Search Console Core Web Vitals; prioritise real user mobile loading and tool task completion.

Official SEO reference: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
Prayer methods reference: https://github.com/batoulapps/adhan-js/blob/develop/METHODS.md
