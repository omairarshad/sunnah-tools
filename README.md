# Sunnah Tools

Free Islamic tools for everyday life — https://sunnah.tools

## Preview branch

Source work is merged into `feature/initial-site-and-tools`; the successful GitHub Actions workflow generates the static `hostinger-live` branch connected to Hostinger. Changes must pass tests and review before merging. Religious methods remain informational.

## Included

The current SEO/UX release has **22 interactive tools**: prayer times, Qibla, Tahajjud, Ramadan timetable, Ramadan countdown, Zakat, Nisab, two-way Hijri conversion, Hijri age, Tasbih, Quran reading planner, fasting tracker, Salah tracker, suhoor/iftar live countdown, gold Zakat calculator, Islamic events calendar, and printable Salah chart.

Search strategy and next-tool research: [docs/SEO_ROADMAP.md](docs/SEO_ROADMAP.md).

## Initial release

Worldwide astronomical prayer times (select major cities or input any coordinates and timezone), Qibla bearing, Tahajjud calculator, 29/30-day printable Ramadan timetable, Zakat estimate (manual metal prices), Gregorian-to-Hijri conversion, Hijri age, browser-local Tasbih counter, and Quran reading planner.

## Local commands

Requires Node.js 22.12+:

```bash
npm install
npm test
npm run check
npm run build
```

Hostinger Web App build command: `npm run build`; static output directory: `dist`.

## Important limitations

- Calculated prayer-start times are not necessarily your local mosque's prayer/jamaat times. Different regional, Asr and high-latitude conventions may apply.
- Default timezone and dates should be verified across daylight-saving transitions and hemispheres.
- The city list is curated; worldwide coordinates can be entered manually or retrieved via optional device location permission.
- Qibla displays bearing from **true north**, not a calibrated moving compass.
- Hijri dates use the `Intl` Umm al-Qura calendar and may differ from local moon-sighting announcements.
- The Zakat result is an educational estimate, not a scholarly ruling; no live commodity price API is used, and eligibility/hawl must be checked independently.
- Ramadan first day is entered by the visitor pending local moon sighting.
- No visitor accounts or subscriptions are required. The optional AdSense integration is disabled unless complete publisher, consent and ad-slot settings are activated.

## Before launch

Check CI, verify user flows with real devices, validate regional prayer examples and religious explanations, check accessibility, review privacy/hosting logs, and only then approve the pull request to `main`.

## Phase 3 (24 October 2026)

- Added four focused tool pages: gold Zakat, today's suhoor/iftar with live next-event countdown, upcoming Islamic events, and printable 7/14/30-day Salah charts.
- Prayer calculations now expose additional regional and high-latitude conventions, with a polar fallback option and explicit caution that local mosque methods may differ.
- Google Search Console: submit `https://sunnah.tools/sitemap-index.xml`, then inspect the homepage and highest-priority pages. Search Console setup requires the domain owner's action; it is not automatic.
- GitHub checks validate calendar/gold calculations, basic prayer-time sanity, TypeScript and the static Astro build. These are not a substitute for regional mosque or scholarly validation.

## Worldwide city search (October 2026)

The global city search uses the open GeoNames `cities15000` dataset, generated locally during the CI build. To develop locally:

```bash
npm install
npm run prepare:cities
npm run check
npm test
npm run build
```

City data is sourced from https://www.geonames.org/ (CC BY 4.0; https://creativecommons.org/licenses/by/4.0/). The generated dataset contains cities with approximately 15,000+ inhabitants plus capitals; smaller settlements can be entered using GPS coordinates. Visitors' typed searches are filtered in the browser. The first search downloads an approximately 2.1 MiB file once, then reuses the browser cache. No commercial geocoder API keys are required.

Worldwide city search suggests a regional calculation convention when the visitor chooses a city, but users must confirm their preferred method and compare the resulting prayer times with their local mosque. High latitude conventions require additional review.

### Search Console

See [Indexing & sitemap diagnostics](docs/INDEXING_RECOVERY.md). The Google Search Console sitemap status belongs to the owner's Google account and cannot be changed by a GitHub release alone.

## Colour-coded tools and new calendars

The utility directory now uses a consistent multi-colour accent scheme per tool. Four new pages are available: White Days fasting calendar (.ics export), printable Hijri calendar, prayer-times iframe generator and Hajj/Umrah packing checklist. They retain clear moon-sighting, Tashreeq and religious-method qualifications. See [docs/TOOL_BATCH_2.md](docs/TOOL_BATCH_2.md) for detailed implementation and validation notes.
\n## SEO & monetisation phase (October 2026)\n\n- 22nd tool: Fitrana calculator using explicitly user-entered verified local rate, not a fabricated current figure.\n- Ramadan timetable supports 29/30 days, print and downloadable CSV.\n- Original method guides cover prayer time conventions and Ramadan date/timetable caveats.\n- AdSense configuration is OFF by default and is controlled through GitHub Actions variables and certified consent setup. See [AdSense launch checklist](docs/ADSENSE_SETUP.md).\n
## Streamlined home and full-bleed project banners

The redundant “Start here” mini-tool row is removed. Three independently linked, accessible, self-hosted illustrated banners now sit directly between the compact introduction and searchable tool directory. ArabicAlphabet.app is the main wide banner, followed by IslamReact and Meem & Moon. The banner images and links are editable through Pages CMS using the `image` / `imageAlt` fields in `src/data/homepage.json`. Initial artwork is a brand-inspired placeholder, not a copy of official media; owners can upload official assets later. See [Analytics and CMS setup](docs/ANALYTICS_AND_CMS.md).
