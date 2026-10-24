# Sunnah Tools

Free Islamic tools for everyday life — https://sunnah.tools

## Preview branch

The initial Astro + React + TypeScript site is on `feature/initial-site-and-tools`. **Do not deploy this branch to the public domain until checks and religious-method review are complete.**

## Included

The current SEO/UX release has **13 interactive tools**: prayer times, Qibla, Tahajjud, Ramadan timetable, Ramadan countdown, Zakat, Nisab, two-way Hijri conversion, Hijri age, Tasbih, Quran reading planner, fasting tracker and Salah tracker.

Search strategy and next-tool research: [docs/SEO_ROADMAP.md](docs/SEO_ROADMAP.md).

## Initial release

Worldwide astronomical prayer times (select major cities or input any coordinates and timezone), Qibla bearing, Tahajjud calculator, 30-day printable Ramadan timetable, Zakat estimate (manual metal prices), Gregorian-to-Hijri conversion, Hijri age, browser-local Tasbih counter, and Quran reading planner.

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
- No accounts, subscriptions or advertising are present.

## Before launch

Check CI, verify user flows with real devices, validate regional prayer examples and religious explanations, check accessibility, review privacy/hosting logs, and only then approve the pull request to `main`.
