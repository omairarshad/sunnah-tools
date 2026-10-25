// Curated city-centre locations. Avoid synthetic pages for places without distinct practical guidance.
export const cityPrayerPages = [
  {
    "slug": "london",
    "name": "London",
    "region": "England",
    "lat": 51.5072,
    "lon": -0.1276,
    "tz": "Europe/London",
    "method": "mwl",
    "note": "London prayer times vary throughout the year as daylight length changes. Local mosque Fajr and Isha timetables may follow different calculations; compare your chosen method before relying on a calculated time."
  },
  {
    "slug": "birmingham",
    "name": "Birmingham",
    "region": "England",
    "lat": 52.4797,
    "lon": -1.9027,
    "tz": "Europe/London",
    "method": "mwl",
    "note": "Birmingham is served by mosques using more than one prayer timetable convention. This page calculates city-centre times rather than any one mosque’s jamaat schedule."
  },
  {
    "slug": "manchester",
    "name": "Manchester",
    "region": "England",
    "lat": 53.4808,
    "lon": -2.2426,
    "tz": "Europe/London",
    "method": "mwl",
    "note": "Manchester’s northern latitude produces long summer evenings and short winter days. In summer, compare calculated twilight times with local mosque advice."
  },
  {
    "slug": "bradford",
    "name": "Bradford",
    "region": "England",
    "lat": 53.795,
    "lon": -1.7594,
    "tz": "Europe/London",
    "method": "mwl",
    "note": "Bradford’s local prayer timetables can differ in their Fajr and Isha rules. Choose a method used by your community rather than assuming every mosque posts the same start time."
  },
  {
    "slug": "leicester",
    "name": "Leicester",
    "region": "England",
    "lat": 52.6386,
    "lon": -1.13169,
    "tz": "Europe/London",
    "method": "mwl",
    "note": "Leicester’s prayer times follow its coordinates and the UK seasonal clock change. Congregational prayer schedules are set separately by each mosque."
  },
  {
    "slug": "leeds",
    "name": "Leeds",
    "region": "England",
    "lat": 53.8008,
    "lon": -1.5491,
    "tz": "Europe/London",
    "method": "mwl",
    "note": "Leeds has pronounced seasonal changes in dawn and nightfall. Fajr and Isha can depend strongly on the chosen twilight calculation convention."
  },
  {
    "slug": "newcastle",
    "name": "Newcastle upon Tyne",
    "region": "England",
    "lat": 54.9783,
    "lon": -1.6178,
    "tz": "Europe/London",
    "method": "mwl",
    "note": "Newcastle’s northern position makes summer twilight particularly important. Compare a calculated Fajr and Isha estimate with the timetable used in your neighbourhood."
  },
  {
    "slug": "glasgow",
    "name": "Glasgow",
    "region": "Scotland",
    "lat": 55.8642,
    "lon": -4.2518,
    "tz": "Europe/London",
    "method": "mwl",
    "note": "Glasgow experiences extended summer twilight. Some local authorities use special Fajr and Isha arrangements at high latitudes; confirm the convention with your mosque."
  },
  {
    "slug": "edinburgh",
    "name": "Edinburgh",
    "region": "Scotland",
    "lat": 55.9533,
    "lon": -3.1883,
    "tz": "Europe/London",
    "method": "mwl",
    "note": "Edinburgh’s summer dawn and nightfall may need high-latitude treatment. The calculated values on this page are not an official mosque timetable."
  },
  {
    "slug": "cardiff",
    "name": "Cardiff",
    "region": "Wales",
    "lat": 51.4816,
    "lon": -3.1791,
    "tz": "Europe/London",
    "method": "mwl",
    "note": "Cardiff times use the city-centre coordinates and UK daylight-saving changes. Check the calculation convention used by your local Cardiff mosque."
  },
  {
    "slug": "makkah",
    "name": "Makkah",
    "region": "Saudi Arabia",
    "lat": 21.4225,
    "lon": 39.8262,
    "tz": "Asia/Riyadh",
    "method": "makkah",
    "note": "Makkah uses the Saudi timezone throughout the year, without a seasonal clock change. This estimate is not a verified current Haram iqamah schedule."
  },
  {
    "slug": "karachi",
    "name": "Karachi",
    "region": "Pakistan",
    "lat": 24.8607,
    "lon": 67.0011,
    "tz": "Asia/Karachi",
    "method": "karachi",
    "note": "Karachi’s local calculation conventions often differ from international Muslim World League settings. Choose the method appropriate to your mosque and distinguish prayer starts from jamaat times."
  },
  {
    "slug": "dubai",
    "name": "Dubai",
    "region": "United Arab Emirates",
    "lat": 25.2048,
    "lon": 55.2708,
    "tz": "Asia/Dubai",
    "method": "dubai",
    "note": "Dubai is in the Gulf timezone and does not change clocks for summer. Official UAE prayer announcements can differ from a general-purpose astronomical calculation."
  },
  {
    "slug": "toronto",
    "name": "Toronto",
    "region": "Canada",
    "lat": 43.6532,
    "lon": -79.3832,
    "tz": "America/Toronto",
    "method": "na",
    "note": "Toronto changes between standard and daylight-saving time. The displayed clock times are adjusted for the local timezone, but twilight methodology may differ between mosques."
  },
  {
    "slug": "new-york",
    "name": "New York City",
    "region": "United States",
    "lat": 40.7128,
    "lon": -74.006,
    "tz": "America/New_York",
    "method": "na",
    "note": "New York’s boroughs span a broad area, so this page uses central-city coordinates. Check your exact location and preferred mosque’s Fajr and Isha calculation policy."
  }
] as const;
export type CityPrayerPage=typeof cityPrayerPages[number];
