# Religious content and calculation review

Updated: 25 October 2026

This is an internal review register for the publicly available tools. It is not a certification or scholarly endorsement. Technical tests confirm computations and website routes; they do **not** validate a religious ruling or product certification.

## Pending qualified review

| Tool or topic | Review needed | Current guardrail |
| --- | --- | --- |
| Suhoor & Iftar Times comprehensive guide | Verify dawn cutoff vs precautionary imsak, prompt sunset iftar, authentic wording and grading of Abi Dawud 2357, and UK high-latitude guidance with a qualified scholar | Quran 2:187 and numbered hadith links; no binding imsak rule, explicit calculation-method disclaimers, optional reminder cannot change Fajr, no fake live mosque integration |
| Ramadan Timetable comprehensive guide and export workflow | Review moon-sighting versus algorithmic first-fast dates, sunset start of the Hijri day, 29/30 day endings, imsak and dawn wording, and high-latitude fasting conventions | Source-linked Quran/hadith guidance, strict dates and timezone, full 29/30-day rows, no automatic moon-sighting claim, unresolved days visibly marked, no fabricated calendar entries, DST-aware UTC events; human scholarly review remains pending |
| Hijri Converter comprehensive guide and two-method comparison | Confirm religious-day sunset explanation, local crescent practices, twelve-month and sacred-month content, and how calendar differences should be communicated | Strict date validation, named Umm al-Qura and civil calendar algorithms, transparent 1300–1600 AH scope, source-linked guide, no claim of a live moon-sighting result or automatic sunset detection |
| Quran Planner comprehensive guide and flexible completion schedule | Review the interpretation of measured recitation, Sahih al-Bukhari 5054's individual context, and any language on khatm timing, Ramadan reading and stopping at page boundaries | Source-linked educational content, flexible self-chosen dates and pace, no prescribed completion deadline, no claimed universal 604-page or juz mapping, private local progress and opt-in exports |
| Prayer Times comprehensive guide | Verify five prayer window explanations, Asr standard/Hanafi comparison, UK high-latitude approximation advice and seasonal Umm al-Qura Isha caveat with a qualified reviewer | Links to Quran 4:103, Muslim 612a, FCNA, Adhan and PrayTimes; no claim to provide official mosque iqamah times |
| Tahajjud prayer guide and duas | Check step-by-step Salah wording, Witr differences between schools, Arabic spelling and transliteration of four Quranic duas and the waking supplication | Sources linked to Quran.com and numbered hadith; no prescribed Tahajjud-only dua or compulsory rak’ah total claimed |
| Prayer Rakats Chart | Fard/Sunnah/Witr scope and different schools | Fard counts displayed; school-specific Sunnah not inferred |
| Travel Prayer (Qasr) | Madhhab differences: distance, beginning of travel, length of stay, joining prayers | Education only, no yes/no travel eligibility verdict |
| Zakat Calculator comprehensive guide and detailed estimator | Verify gold/silver threshold assumptions, hawl, eligibility, personal jewellery, debts, pensions, business and investment treatment against scholarly schools | Conditional estimates only; user supplies current metal prices and qualifying asset portions; no financial values saved; source-linked guide, technical tests passed separately from scholarly review |
| Zakat Calculator and Stocks/Crypto | Ownership, pensions, shares, investment funds, qualifying debts, Nisab and hawl | Illustrative entered values, no binding Zakat determination |
| Halal Additives Checker | Ingredient origin, manufacture, country, certification and scholarly interpretations | E-number identity and possible sources only; never a product-level halal verdict |
| Quranic Duas & Adhkar | Independently check Arabic against a vetted Quran edition; validate translation licence and source references | Small Quranic verse selection only; no prescribed morning/evening repetition counts |
| Juz Finder | Independent check of all 30 division boundaries against an authoritative Quran edition | Surah/Ayah starts only; no assumed Mushaf page counts |
| High-latitude prayer times | Local authority's seasonal Fajr/Isha methods in northern latitudes and polar conditions | Configurable calculation, caveats, and no claim of mosque approval |
| Qibla Finder comprehensive guide and magnetic conversion | Independently check spherical Qibla bearings, very near-Kaaba and antipodal limits, compass orientation and fiqh of reasonable directional effort | Uses Google Qibla Finder reference coordinates, NOAA declination convention and Quran 2:144; verified user-entered correction; independent religious review pending |
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
