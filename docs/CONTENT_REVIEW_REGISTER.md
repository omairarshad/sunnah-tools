# Religious content and calculation review

Updated: 25 October 2026

This is an internal review register for the publicly available tools. It is not a certification or scholarly endorsement. Technical tests confirm computations and website routes; they do **not** validate a religious ruling or product certification.

## Pending qualified review

| Tool or topic | Review needed | Current guardrail |
| --- | --- | --- |
| Tahajjud prayer guide and duas | Check step-by-step Salah wording, Witr differences between schools, Arabic spelling and transliteration of four Quranic duas and the waking supplication | Sources linked to Quran.com and numbered hadith; no prescribed Tahajjud-only dua or compulsory rak’ah total claimed |
| Prayer Rakats Chart | Fard/Sunnah/Witr scope and different schools | Fard counts displayed; school-specific Sunnah not inferred |
| Travel Prayer (Qasr) | Madhhab differences: distance, beginning of travel, length of stay, joining prayers | Education only, no yes/no travel eligibility verdict |
| Zakat Calculator and Stocks/Crypto | Ownership, pensions, shares, investment funds, qualifying debts, Nisab and hawl | Illustrative entered values, no binding Zakat determination |
| Halal Additives Checker | Ingredient origin, manufacture, country, certification and scholarly interpretations | E-number identity and possible sources only; never a product-level halal verdict |
| Quranic Duas & Adhkar | Independently check Arabic against a vetted Quran edition; validate translation licence and source references | Small Quranic verse selection only; no prescribed morning/evening repetition counts |
| Juz Finder | Independent check of all 30 division boundaries against an authoritative Quran edition | Surah/Ayah starts only; no assumed Mushaf page counts |
| High-latitude prayer times | Local authority's seasonal Fajr/Isha methods in northern latitudes and polar conditions | Configurable calculation, caveats, and no claim of mosque approval |
| Qibla phone sensor | Device-specific accuracy and magnetic declination; verify iOS/browser support | Requires an explicit tap, optional local declination, shows uncertainty and never replaces true-north bearing |

## Reference trail

- Quranic references on each tool link to the relevant verse at [Quran.com](https://quran.com/).
- Food E-number identification is contextualised by the [UK Food Standards Agency](https://www.food.gov.uk/safety-hygiene/food-additives). That agency does not assign halal rulings.
- The phone-heading APIs are documented by [Apple WebKit](https://developer.apple.com/documentation/webkitjs/deviceorientationevent) and [MDN](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static). Magnetic-north sensor readings do not automatically equal a true-north bearing.
- The implementation of astronomical prayer times is based on the pinned `adhan` package. A calculated timetable is distinct from the mosque's iqamah schedule.

## Release checklist for content changes

1. Identify the exact primary reference and its date; distinguish scholarly opinion from established data.
2. Verify Arabic text and transliteration with a qualified reviewer. Check copyright and translation permissions.
3. Avoid an unconditional halal/haram label when source or processing is unknown; explain how to verify with a supplier.
4. Add tests for date boundaries, DST, input range, local storage migration and source-link formatting.
5. Keep personal worship and financial plans on-device; backups should be opt-in and locally validated.
6. Obtain a named human reviewer where fiqh-sensitive instructions could guide real obligations.
7. Track Search Console impressions/indexing for useful location pages. Never add auto-generated doorway pages purely for traffic.

**Status:** Engineering additions released separately from external religious, legal or certification review. Human review remains outstanding and should not be marked complete until it happens.
