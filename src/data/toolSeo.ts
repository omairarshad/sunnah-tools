// Individually edited, search-intent aligned content for Sunnah Tools.
// Keep dates, religious caveats, and capabilities accurate; do not fabricate live feeds.
export type ToolSeoEntry={title:string;h1:string;description:string;summary:string;details:string;caution:string;faqs:{question:string;answer:string}[]};
export const toolSeo:Record<string,ToolSeoEntry> = {
  "prayer-times": {
    "title": "Prayer Times Today – Fajr, Dhuhr, Asr, Maghrib, Isha",
    "h1": "Prayer Times for Your Location",
    "description": "Find today's prayer times for your city, compare Fajr and Isha calculation methods, download a 7-day timetable and learn the five prayer windows and Asr differences.",
    "summary": "See the calculated starts of the five daily prayers and sunrise, compare methods for Fajr and Isha, and download a dated weekly timetable.",
    "details": "Choose a location, calculation convention and Asr school to see today's estimates. The expanded guide explains the five prayer windows, shadow-based Asr differences, dawn and dusk angles, UK summer high-latitude adjustments and the difference between prayer starts and mosque jama'ah times.",
    "caution": "Calculated prayer starts are not an official local mosque timetable or a guarantee of the last permissible moment for worship. Fajr and Isha conventions and high-latitude rulings can differ; use the guidance followed by your local mosque.",
    "faqs": [
      {
        "question": "Why does Fajr change each day?",
        "answer": "Earth’s position relative to the Sun changes with the seasons, moving the calculated dawn time."
      },
      {
        "question": "Do these times work worldwide?",
        "answer": "Use accurate coordinates and the right timezone. High-latitude locations may need special calculation settings."
      },
      {
        "question": "Why do two prayer applications show different Fajr times?",
        "answer": "They may use different dawn angles or local timetable adjustments. Check each calculation setting against the timetable followed by your local mosque."
      },
      {
        "question": "What is the difference between prayer start and jama'ah time?",
        "answer": "The calculated start shows when a prayer's window opens. Jama'ah or iqamah is the congregation time set by the mosque, often later than the prayer start and not available from an astronomical calculator."
      },
      {
        "question": "Why does the Hanafi Asr time come later?",
        "answer": "The Hanafi calculation commonly uses a shadow length of twice the object's length plus its noon shadow, rather than the earlier one-length standard rule. Select the school followed by your mosque."
      },
      {
        "question": "Why can Fajr and Isha be difficult to calculate in UK summer?",
        "answer": "In northern areas summer twilight may persist all night. Apps use high-latitude approximation rules such as one-seventh of the night or a fraction based on the twilight angle. Verify locally."
      },
      {
        "question": "Does sunrise mean I should start Fajr prayer?",
        "answer": "No. Sunrise is displayed as the end boundary for Fajr, not its start and not a separate sixth obligatory prayer. The Fajr window begins at true dawn, with its estimated opening shown in the Fajr entry."
      },
      {
        "question": "Can I download weekly prayer times?",
        "answer": "Open Next 7 days beneath today's timetable and choose Download 7-day CSV. The export includes the selected location, time zone, calculation convention, Asr setting, date and six daily solar and prayer-time values."
      }
    ]
  },
  "qibla-finder": {
    "title": "Qibla Finder – Direction, Compass Bearing & Guide",
    "h1": "Qibla Finder Online",
    "description": "Find the Qibla direction from your city or location. See the true-north bearing, compass direction, approximate distance to the Kaaba, magnetic correction and step-by-step guidance.",
    "summary": "Calculate your Qibla bearing from true north, see the approximate compass direction and distance to the Kaaba, and learn how to use a map or magnetic compass.",
    "details": "Choose a city, allow location permission or enter your coordinates. The finder uses the initial great-circle bearing towards the Kaaba, explains how to correct an independently verified magnetic compass heading and includes a guide for finding Qibla without a phone sensor.",
    "caution": "The numerical bearing is relative to geographic north. Magnetic declination differs by place and date; only use a verified value when converting a compass heading. Phones can be disturbed by magnets or metal; city-centre presets are approximate.",
    "faqs": [
      {
        "question": "Can I find Qibla without location permission?",
        "answer": "Yes. Enter a city or geographic coordinates instead of sharing device location."
      },
      {
        "question": "Why does my compass point somewhere else?",
        "answer": "Physical compasses measure magnetic north and can be affected by declination and local interference."
      },
      {
        "question": "Does the Qibla bearing use my phone's compass heading?",
        "answer": "The fixed great-circle bearing is calculated from your location and geographic north. An optional device heading needs compatible sensors and correction for magnetic declination."
      },
      {
        "question": "How do I find Qibla without a compass?",
        "answer": "Select a city or coordinates, read the great-circle bearing, then use a map with a trustworthy north reference or another verified direction to orient yourself. A fixed sunrise direction is not a reliable substitute."
      },
      {
        "question": "Does the Qibla bearing use true north or magnetic north?",
        "answer": "It is measured clockwise from geographic true north. A physical magnetic compass needs a location- and date-specific declination correction unless it already displays a true-north heading."
      },
      {
        "question": "Why might my phone show the wrong Qibla direction?",
        "answer": "A sensor can be affected by nearby magnets and metal, poor calibration, unsupported browser access, or confusion between true and magnetic north. Compare against a reliable map or local reference."
      },
      {
        "question": "Can I find Qibla without giving GPS permission?",
        "answer": "Yes. Search for a city, select a city preset or enter latitude and longitude manually. Browser location permission is optional, although a city-centre coordinate is less precise than a building's position."
      },
      {
        "question": "Why does Qibla point south-east from the United Kingdom?",
        "answer": "For many UK locations the initial great-circle bearing towards Makkah lies broadly to the east-south-east or south-east. The actual angle depends on geographic coordinates and is read clockwise from true north."
      },
      {
        "question": "What is the difference between bearing and distance to Makkah?",
        "answer": "The bearing is the initial direction from true north. The distance is the approximate shortest surface route on a globe, not a road distance or a measurement of device compass accuracy."
      }
    ]
  },
  "tahajjud-time": {
    "title": "Tahajjud Time Calculator, How to Pray & Duas",
    "h1": "Tahajjud Time Calculator",
    "description": "Calculate Tahajjud time and the last third of the night. Learn how to pray Tahajjud step by step, how many rak'ahs, Witr guidance and Quranic duas with sources.",
    "summary": "Calculate tonight’s last third, then read a step-by-step guide to Tahajjud prayer, rak'ahs, Witr, and four Quranic duas with Arabic and meanings.",
    "details": "Choose your city and calculation method or use your mosque’s Maghrib and following Fajr times. Below the timing calculator, learn the sequence of voluntary night prayer, the place of two-rak'ah units and Witr, and sourced supplications for guidance, repentance and wellbeing.",
    "caution": "Tahajjud is voluntary and the last third is a recommended period, not its only valid time. Schools differ on details of Witr. Use your mosque’s Fajr method and check the scholarly guidance you follow.",
    "faqs": [
      {
        "question": "What is the last third of the night?",
        "answer": "The final third of the period between sunset and the next Fajr, not simply the final hours before midnight."
      },
      {
        "question": "Can I pray Tahajjud earlier?",
        "answer": "Night prayer is not limited to the last third. This calculator identifies a commonly preferred period, not a rule for every circumstance."
      },
      {
        "question": "Can I enter Maghrib and Fajr directly from my mosque?",
        "answer": "Yes. Manual mode accepts tonight's Maghrib and the following morning's Fajr and divides that overnight interval into three equal portions."
      },
      {
        "question": "How do you pray Tahajjud step by step?",
        "answer": "After Isha, prepare with wudu, face the Qibla and pray two voluntary rak'ahs in the familiar form of Salah, reciting al-Fatihah and Quran you know. Finish with salam; you may add more pairs and make personal dua afterward."
      },
      {
        "question": "How many rak'ahs should I pray for Tahajjud?",
        "answer": "Two voluntary rak'ahs are an accessible starting point. Night prayer is described as being performed two at a time in Sahih al-Bukhari 1137; no single number should be presented as an obligation for everyone."
      },
      {
        "question": "Which dua should I recite after Tahajjud?",
        "answer": "There is no single required Tahajjud-only dua. You may ask Allah sincerely for your needs. Examples of Quranic supplication include Quran 2:201 for goodness, 3:8 for steadfastness, 21:87 for repentance and 20:114 for knowledge."
      },
      {
        "question": "Should I pray Witr before or after Tahajjud?",
        "answer": "If you expect to wake for night prayer, Witr is often planned toward its end; if you fear sleeping through, praying Witr earlier is supported by a narration in Sahih Muslim 755b. Witr details differ by school, and it should not be repeated twice in the same night."
      }
    ]
  },
  "fasting-times": {
    "title": "Suhoor & Iftar Times – Fajr Cutoff, Duas & Guide",
    "h1": "Suhoor & Iftar Times Today",
    "description": "Find Suhoor and Iftar times for your city using Fajr and Maghrib. Check the live countdown, 7-day timetable, optional imsak reminder and sourced fasting duas.",
    "summary": "Find the calculated Fajr cutoff for Suhoor and Maghrib start for Iftar, see the next-event countdown, compare your mosque's method, and read a detailed guide.",
    "details": "Choose a city, calculation method, timezone and day. See the estimated dawn and sunset, an approximate fasting interval, an optional pre-Fajr reminder clearly separated from the fast's starting time, and a seven-day downloadable timetable. Learn authentic fasting duas and why UK summer timetables may differ.",
    "caution": "Fasting begins at true dawn, not at a universal precautionary imsak time, and ends at sunset. Calculation conventions and special high-latitude rules vary. Check your local mosque before using these estimates for worship.",
    "faqs": [
      {
        "question": "Is imsak the same as Fajr?",
        "answer": "Not always. Imsak may be an earlier precautionary time, while Fajr is the dawn prayer start reference."
      },
      {
        "question": "Why does Iftar change every day?",
        "answer": "Sunset shifts through the year and depends on your location and timezone."
      },
      {
        "question": "Does imsak always mean Fajr has begun?",
        "answer": "No. Some calendars show an earlier precautionary imsak time. Check which entry your local religious authority uses as the beginning of the daily fast."
      },
      {
        "question": "When exactly should I stop eating before Fajr?",
        "answer": "The fast begins at true dawn (Fajr), as described in Quran 2:187. A timetable may show imsak earlier as a precaution, but the optional reminder in this tool does not create a different religious cutoff."
      },
      {
        "question": "Can I break my fast immediately at Maghrib?",
        "answer": "Iftar begins at sunset, which is the start of Maghrib. Sahih al-Bukhari 1957 encourages breaking the fast promptly once its ending is established; verify local sunset timings where a calculation is uncertain."
      },
      {
        "question": "Which dua is narrated after breaking the fast?",
        "answer": "The remembrance beginning Dhahaba adh-dhama'u, about thirst passing and reward being established if Allah wills, is reported in Sunan Abi Dawud 2357. The page includes Arabic, transliteration and a link to its grading and context."
      },
      {
        "question": "Do I have to wake for Suhoor to fast?",
        "answer": "Suhoor is encouraged and described as blessed in Sahih al-Bukhari 1923, but it is not compulsory for a fast to be valid. Relevant intentions and exemptions can involve further scholarly rulings."
      },
      {
        "question": "Why does the Iftar countdown differ from the date I selected?",
        "answer": "The date selector displays calculated times for that chosen day. The live countdown is explicitly for the selected location's current date and updates approximately every 30 seconds, so it does not count down to a historical or future date."
      },
      {
        "question": "Can I download a week's Suhoor and Iftar times?",
        "answer": "Yes. Expand Next 7 days from selected date, then download the CSV file. It includes dates, estimated Fajr, Maghrib, duration, location, timezone and method. Confirm the settings and local mosque timetable before sharing."
      },
      {
        "question": "Why does Fajr look unusual during summer in northern Britain?",
        "answer": "At high latitudes the Sun may not reach some twilight angles during summer nights. Different authorities use alternative calculation rules; the calculator offers configurable approximations rather than an official ruling."
      }
    ]
  },
  "ramadan-timetable": {
    "title": "Ramadan Timetable – 29/30-Day Suhoor & Iftar Calendar",
    "h1": "Ramadan Timetable",
    "description": "Make a printable Ramadan calendar with 29 or 30 days of Suhoor (Fajr) and Iftar (Maghrib) estimates. Compare methods and export CSV, PDF or .ics.",
    "summary": "Plan the whole Ramadan month with calculated dawn and sunset estimates for your chosen place and time zone.",
    "details": "Choose a location, method and first fasting day, then generate all 29 or 30 dated entries. See approximate durations, optional preparation reminders, high-latitude settings, day-by-day DST-aware clocks and downloadable exports.",
    "caution": "An Umm al-Qura calendar suggestion is not a confirmed moon sighting. Check the first and last day of Ramadan, local Fajr conventions and Maghrib estimates with the recognised authority you follow.",
    "faqs": [
      {
        "question": "Does the timetable tell me when Ramadan officially starts?",
        "answer": "No. You can edit the algorithmic suggested date to match your recognised local moon-sighting or calendar announcement."
      },
      {
        "question": "What is the difference between Fajr and imsak?",
        "answer": "Fajr estimates true dawn and the start of fasting. An optional earlier reminder may help with meal preparation but does not establish another universal religious cutoff."
      },
      {
        "question": "Can Ramadan be 29 rather than 30 days?",
        "answer": "Yes. Select either length, then update it after your local Shawwal announcement confirms the end of the month."
      },
      {
        "question": "Does the printable calendar show daylight-saving time changes?",
        "answer": "Yes. Each day's actual calculated UTC instants are displayed in the selected place's timezone, including relevant clock changes."
      },
      {
        "question": "Can I save a Ramadan timetable as PDF?",
        "answer": "Use Print / Save PDF and choose Save as PDF in your browser's print dialog. The print layout contains the month and its settings."
      },
      {
        "question": "What is included in the Ramadan CSV?",
        "answer": "All dates, Fajr, Maghrib, estimated fasting duration, optional reminder and the calculation location, time zone and method are included. Unavailable times are identified."
      },
      {
        "question": "Can I download an ICS Ramadan calendar?",
        "answer": "Yes, when all daily times are valid. Calendar events contain actual UTC instants, but imported events do not update when a sighting announcement or setting changes."
      },
      {
        "question": "Why does my mosque's Fajr differ from the table?",
        "answer": "It may use a different twilight angle, local observation, high-latitude convention or adjustment. Select the matching convention and consult your mosque for authoritative times."
      },
      {
        "question": "How does this work at high latitudes?",
        "answer": "You can select an astronomical fallback, but impossible or inconsistent results are labelled unavailable. Follow local scholarly guidance for polar or persistent-twilight situations."
      },
      {
        "question": "Is my Ramadan timetable saved online?",
        "answer": "No. Calculations run in your browser. Shared location and method preferences may be stored locally, while calendar and CSV downloads happen only when you choose them."
      }
    ]
  },
  "ramadan-countdown": {
    "title": "Ramadan Countdown – Time Until First Sunset & Fast",
    "h1": "Ramadan Countdown",
    "description": "Countdown to the estimated sunset before your first Ramadan fast. Choose your city, date and time zone, compare one-day alternatives and learn about moon sightings.",
    "summary": "Count down to the calculated Maghrib sunset marking Ramadan's first evening, before the first daytime fast.",
    "details": "Enter an expected first Gregorian fast date and actual location. A UTC-based sunset countdown updates in the browser and separates the first evening from the following Fajr. Compare possible neighbouring dates and download an estimated calendar event.",
    "caution": "An algorithmic Umm al-Qura calendar estimate or calculated sunset is not an observed crescent or a binding local announcement. Confirm dates and Fajr/Maghrib with a recognised authority.",
    "faqs": [
      {"question":"Does Ramadan start at midnight or sunset?","answer":"A new Hijri day begins at sunset. If Monday is the first daytime fast, the first Ramadan evening begins at local sunset on Sunday."},
      {"question":"Is this an official Ramadan moon-sighting countdown?","answer":"No. It counts to a calculated sunset before your entered first fast; local crescent announcements may change that date."},
      {"question":"Why does Ramadan begin on different days in different places?","answer":"Communities may follow different crescent observations or calendar criteria, and sunrise/sunset vary by location. Follow your recognised local authority."},
      {"question":"How is Ramadan sunset calculated?","answer":"The Adhan astronomical calculation yields a UTC Maghrib instant for the chosen location. It is displayed in the selected IANA timezone."},
      {"question":"When is Ramadan 2027 expected?","answer":"Calendar calculations suggest possible dates, but they are not an official announcement. Enter the first fasting date recognised by your local community before relying on the countdown."},
      {"question":"What if my community announces the first fast a day later?","answer":"Change the entered Gregorian first fasting day. Update any previously downloaded calendar event; it does not change automatically."},
      {"question":"Does the countdown adjust for daylight saving time?","answer":"Yes. It counts to an absolute UTC instant, displayed using the selected location's IANA timezone."},
      {"question":"Why might sunset be unavailable?","answer":"Invalid coordinates/timezone or unusual polar conditions may prevent a valid calculation. The tool does not replace an unavailable result with an invented time."},
      {"question":"Does reaching zero prove Ramadan started?","answer":"No. It only means the chosen estimated sunset instant passed. It cannot observe the crescent or establish a religious date."}
    ]
  },
  "zakat-calculator": {
    "title": "Zakat Calculator UK – Nisab, Gold, Savings & Guide",
    "h1": "Zakat Calculator",
    "description": "Estimate Zakat on cash, savings, gold, silver, investments and business assets. Compare gold or silver Nisab, review deductible liabilities and learn how Zakat works.",
    "summary": "Estimate conditional Zakat on qualifying wealth, with separate inputs for savings, gold and silver, trade stock, investments and eligible liabilities.",
    "details": "Choose a currency and Nisab benchmark, enter your current metal prices and eligible holdings, then review a full breakdown. The calculator supports metal weights or independently assessed values, a worked example, and an optional downloadable estimate without saving your financial details.",
    "caution": "This is a planning tool, not a ruling. Hawl, jewellery, pension ownership, debts, investments, Nisab choice and business valuations differ by school and circumstances. Verify them with a qualified adviser.",
    "faqs": [
      {
        "question": "Is Zakat always 2.5%?",
        "answer": "The familiar 2.5% rate applies to many qualifying forms of wealth, but not all assets or obligations follow the same rule."
      },
      {
        "question": "Which Nisab should I use?",
        "answer": "Gold and silver give different thresholds. Apply the approach recommended by a trusted scholar or your relevant institution."
      },
      {
        "question": "Should I enter every pension balance as cash?",
        "answer": "Not necessarily. Pension ownership, access and the guidance you follow can affect its Zakat treatment. Review those factors before entering a qualifying amount."
      },
      {
        "question": "How do I calculate Zakat on my savings?",
        "answer": "Include qualifying cash and bank balances, then assess other relevant assets and permitted debts. Compare net wealth with the applicable gold- or silver-based Nisab; where the lunar-year and other conditions apply, 2.5% is the common rate for qualifying money."
      },
      {
        "question": "Is Zakat due on the full mortgage balance?",
        "answer": "Do not automatically deduct the entire balance of a long-term mortgage. Debt deductibility can depend on when amounts are due and the legal school followed; only enter liabilities allowed by qualified guidance."
      },
      {
        "question": "How do I calculate Zakat on gold jewellery?",
        "answer": "First determine whether the jewellery is included under the guidance you follow. When it is included, use a reliable qualifying value or the correct fine-gold content and appropriate price; do not value lower-carat jewellery as if all its weight were pure 24-carat gold."
      },
      {
        "question": "Do stocks and pensions count towards Zakat?",
        "answer": "Their treatment depends on factors such as ownership, access, investment purpose and underlying assets. The tool asks for the qualifying value as determined under the guidance you use, rather than assuming an entire pension balance or portfolio market value is automatically zakatable."
      },
      {
        "question": "Is Zakat automatically due every Ramadan?",
        "answer": "No. Zakat al-Mal is tied to the relevant lunar-year (hawl) conditions for the individual. Ramadan is not a universal anniversary date. If you are unsure, seek guidance on the start and continuity of your Zakat year."
      },
      {
        "question": "Can I download my Zakat calculation without saving it online?",
        "answer": "Yes. The summary is generated on your device when you choose to download it. The calculator does not use browser storage for the financial amounts entered; protect any downloaded file as you would another personal financial document."
      }
    ]
  },
  "fitrana-calculator": {
    "title": "Fitrana Calculator – Zakat al-Fitr for Your Household",
    "h1": "Fitrana Calculator",
    "description": "Calculate a Fitrana total for your household using your mosque or charity's current Zakat al-Fitr rate per person. No assumed worldwide fixed amount.",
    "summary": "Calculate Zakat al-Fitr for multiple people using a verified local rate.",
    "details": "Multiply the number of eligible people by the rate per person published by your selected mosque or charity. Add any optional extra gift separately.",
    "caution": "Fitrana rules, accepted forms of payment and deadlines can differ across communities. This is a budget calculation, not a religious ruling.",
    "faqs": [
      {
        "question": "How do I find the correct Fitrana rate?",
        "answer": "Check the amount and payment deadline published for this Ramadan by your mosque or intended charity."
      },
      {
        "question": "Can I calculate Fitrana for my whole household?",
        "answer": "Yes. Enter the number of people and the local rate to estimate your household total."
      },
      {
        "question": "Can I use last year's Fitrana rate?",
        "answer": "Check the current locally advised amount. Food prices and the rate selected by your mosque or charity may change between Ramadan seasons."
      }
    ]
  },
  "gold-zakat-calculator": {
    "title": "Gold Zakat Calculator – 9K, 18K, 22K & 24K",
    "h1": "Gold Zakat Calculator",
    "description": "Estimate the pure gold content and conditional Zakat value of 9k, 18k, 21k, 22k or 24k jewellery and bullion using a price you enter.",
    "summary": "Estimate your gold's pure-metal value before checking Zakat eligibility.",
    "details": "Multiply jewellery weight by purity divided by 24, then multiply by the market price of pure gold per gram you provide.",
    "caution": "Gemstones and non-gold parts should not be counted as gold weight. Different schools of thought treat personal jewellery differently.",
    "faqs": [
      {
        "question": "Does 18-karat gold count as pure gold?",
        "answer": "No. 18k is approximately 75% gold by mass; use the calculator's purity conversion."
      },
      {
        "question": "Is Zakat obligatory on all jewellery?",
        "answer": "Not universally. Views differ on personally worn jewellery; confirm your situation with a qualified scholar."
      },
      {
        "question": "Why does jewellery purity affect the estimate?",
        "answer": "Carat measures the proportion of fine gold in an item. Its market value can vary with purity even when gross weight is the same."
      }
    ]
  },
  "nisab-calculator": {
    "title": "Nisab Calculator – Gold & Silver Zakat Thresholds",
    "h1": "Nisab Calculator",
    "description": "Compare the monetary Nisab thresholds for gold and silver by entering current metal prices per gram. Understand when Zakat may become applicable.",
    "summary": "Compare gold-based and silver-based Nisab amounts in your currency.",
    "details": "Use the traditional thresholds of approximately 87.48 g gold and 612.36 g silver with the prices you enter to estimate each value.",
    "caution": "Metal prices move continuously. The tool does not fetch verified live prices, and Nisab alone does not settle hawl or asset-treatment questions.",
    "faqs": [
      {
        "question": "Why is silver Nisab often lower?",
        "answer": "The monetary price of 612.36 g of silver is often below that of 87.48 g of gold."
      },
      {
        "question": "Does the threshold automatically mean I owe Zakat?",
        "answer": "No. Holding qualifying wealth, the passing of a lunar year, and other conditions still matter."
      },
      {
        "question": "Why are gold and silver Nisab amounts so different?",
        "answer": "The benchmark weights and market prices differ, giving different monetary amounts. Your school or trusted adviser can help determine which threshold to use."
      }
    ]
  },
  "hijri-converter": {
    "title": "Hijri Date Converter – Today, Umm al-Qura & Civil Calendar",
    "h1": "Hijri Date Today & Islamic Date Converter",
    "description": "Convert Gregorian and Hijri dates both ways. Compare Umm al-Qura with tabular Islamic calendars, inspect lunar month lengths, and learn about sunset and moon sighting.",
    "summary": "Check today's calculated Hijri date, convert in both directions, compare Umm al-Qura with civil Hijri, and explore the date's lunar month boundaries.",
    "details": "Choose a Gregorian day or a Hijri year, named month and day. The converter explicitly compares two calendar conventions, rejects impossible lunar dates and offers an optional illustrative after-sunset view. Its sourced guide covers the twelve months, 29/30-day cycles, calendar variants and local crescent announcements.",
    "caution": "Neither calculated method establishes a local crescent sighting, the actual sunset at your location, or official Ramadan and Eid dates. Umm al-Qura comparisons are limited to the supported 1300–1600 AH range. Check relevant announcements with a trusted religious authority.",
    "faqs": [
      {
        "question": "What is the Hijri date today?",
        "answer": "The date shown uses your device's current local civil day and the calculated Umm al-Qura system. The converter also shows tabular Hijri. After sunset or under local sighting conventions, the religious date may differ."
      },
      {
        "question": "What is the difference between Umm al-Qura and civil Hijri?",
        "answer": "Umm al-Qura uses a defined calculated month sequence, while civil/tabular Hijri follows a mathematical leap-year and month-length cycle. Neither is a live local crescent report."
      },
      {
        "question": "Why might a Hijri conversion be one day different?",
        "answer": "Different month-start algorithms, local sighting decisions, and the traditional sunset rather than midnight boundary can all affect the result."
      },
      {
        "question": "When does the Islamic date change?",
        "answer": "In traditional Islamic reckoning a new religious day begins at sunset. The optional switch illustrates the next lunar day but does not calculate sunset for your location."
      },
      {
        "question": "Can I convert Hijri to Gregorian?",
        "answer": "Yes. Select Hijri to Gregorian, then enter the year, named month and day. The reverse converter validates the date under the chosen calculation system."
      },
      {
        "question": "Can a Hijri month have 30 days?",
        "answer": "Yes. In the converter a calculated lunar month has either 29 or 30 days. A non-existent 30th day is rejected instead of being silently moved to the next month."
      },
      {
        "question": "Does Umm al-Qura confirm Ramadan and Eid?",
        "answer": "No. It is useful for planning, but lunar month announcements and the religious guidance adopted by a local community may differ."
      },
      {
        "question": "Which historical dates are supported?",
        "answer": "The two-way comparison is limited to 1300–1600 AH, roughly late 1882 through 2174 CE, the defined Umm al-Qura data range."
      },
      {
        "question": "Can I compare calendar methods?",
        "answer": "Yes. The result shows Umm al-Qura and civil/tabular Hijri side by side, and the month panel shows the selected method's first and last Gregorian dates."
      },
      {
        "question": "Are my entered dates saved?",
        "answer": "No. Conversion inputs stay in the current browser page. Copy comparison or Download text summary creates an export only when you request it."
      }
    ]
  },
  "islamic-events-calendar": {
    "title": "Islamic Events Calendar – Ramadan, Eid & Hajj Dates",
    "h1": "Islamic Events Calendar",
    "description": "See estimated Islamic calendar dates for Ramadan, Eid al-Fitr, Eid al-Adha, Ashura, Arafah and Hajj using the Umm al-Qura calculation.",
    "summary": "Browse upcoming major Islamic dates in a single calendar.",
    "details": "Important observances use Hijri dates and therefore move through the Gregorian year. The calendar converts them under the Umm al-Qura system.",
    "caution": "Estimated festival dates should not be interpreted as official announcements. Confirm Eid and Ramadan with relevant local authorities.",
    "faqs": [
      {
        "question": "Why do Islamic holidays move each year?",
        "answer": "The lunar Hijri year is shorter than the Gregorian solar year, so observances shift earlier on the Gregorian calendar."
      },
      {
        "question": "Can I book travel using these dates?",
        "answer": "Use them only for planning estimates until official dates and travel arrangements are confirmed."
      },
      {
        "question": "Do major Islamic events fall on the same Gregorian day every year?",
        "answer": "No. Islamic dates follow lunar months, which move through the solar year. Some observances can also differ locally because of moon-sighting conventions."
      }
    ]
  },
  "white-days-calendar": {
    "title": "White Days Fasting Calendar – 13, 14, 15 Hijri Dates",
    "h1": "White Days Fasting Calendar",
    "description": "Find the next 3, 6 or 12 months of White Days (Ayyam al-Bid): Hijri 13, 14 and 15. Check Ramadan and Tashreeq exceptions, print or export dates.",
    "summary": "View the 13th, 14th and 15th days of upcoming Hijri months, with relevant fasting exceptions and Gregorian date conversions.",
    "details": "Choose a reference date, number of months and optional illustrative ±1 day comparison. Each month shows the full set of days, passed dates and fasting status. Download a complete CSV, eligible all-day calendar markers or a PDF printout.",
    "caution": "Umm al-Qura calculations do not establish local moon sightings. Ramadan fasts are obligatory, and the 13th of Dhul Hijjah falls during Tashreeq, not an ordinary optional fast.",
    "faqs": [
      {"question":"Which Hijri dates are the White Days?","answer":"The 13th, 14th and 15th of each lunar Hijri month, not the corresponding dates of the Gregorian month."},
      {"question":"Is White Days fasting compulsory?","answer":"It is ordinarily a recommended voluntary practice outside Ramadan and dates with separate rulings. The calendar does not decide personal eligibility."},
      {"question":"Can I fast any three days of the month?","answer":"Sahih Muslim 1160 discusses monthly three-day fasting without making a specific set of days exclusive; White Days form a named recommended pattern."},
      {"question":"Should I fast on 13 Dhul Hijjah?","answer":"It is a day of Tashreeq, not an ordinary voluntary fast. Specific Hajj-related circumstances may need separate qualified guidance."},
      {"question":"What about White Days during Ramadan?","answer":"The 13th–15th remain Hijri calendar dates, but those fasts belong to obligatory Ramadan fasting, not an additional optional routine."},
      {"question":"Why do White Days move across Gregorian dates?","answer":"Hijri months follow a lunar calendar and contain 29 or 30 days. Local sighting conventions can also shift corresponding civil dates."},
      {"question":"What does the ±1 day selector mean?","answer":"It displays neighbouring Gregorian dates for comparison and does not confirm a local moon sighting or decree the correct calendar."},
      {"question":"Can I download 12 months as a CSV?","answer":"Yes. The full CSV includes each month’s three dates and labels for Ramadan, Tashreeq, past and potential voluntary days."},
      {"question":"Does the .ics file include prohibited or obligatory fasts?","answer":"It exports only upcoming dates labelled potential ordinary voluntary days; Ramadan and Dhul Hijjah 13 are excluded."},
      {"question":"Does the calendar tell me Fajr and iftar times?","answer":"No. It produces all-day date markers. Use Suhoor & Iftar Times for local dawn and sunset estimates."}
    ]
  },
  "islamic-age": {
    "title": "Islamic Age Calculator – Age in Hijri Lunar Years",
    "h1": "Islamic Age Calculator",
    "description": "Calculate your age in completed Hijri lunar years from your Gregorian birth date using the Umm al-Qura Islamic calendar.",
    "summary": "Compare your completed lunar Hijri years with your Gregorian age.",
    "details": "The tool converts your birthday and today's date to a Hijri calendar and checks whether the relevant lunar anniversary has occurred.",
    "caution": "Age-based legal or religious thresholds may follow rules not captured by this calendar comparison. Treat the result as informational.",
    "faqs": [
      {
        "question": "Why is my Islamic age higher?",
        "answer": "A Hijri lunar year is roughly 11 days shorter than a solar year, so more lunar years can pass."
      },
      {
        "question": "Does my birthday fall on the same date every year?",
        "answer": "A Hijri birthday falls on a different Gregorian date as lunar months move through the solar year."
      },
      {
        "question": "Why is my Hijri age higher than my Gregorian age?",
        "answer": "Hijri years are roughly eleven days shorter than Gregorian years, so more lunar anniversaries can have passed over the same lifetime."
      }
    ]
  },
  "printable-hijri-calendar": {
    "title": "Printable Hijri Calendar – Islamic Month PDF",
    "h1": "Printable Hijri Calendar",
    "description": "Create and print a monthly Hijri calendar with corresponding Gregorian dates and highlighted White Days. Free Islamic calendar PDF via browser printing.",
    "summary": "Create a Hijri month view that is easy to print or save as PDF.",
    "details": "Choose a Hijri month and year, preview the matching Gregorian dates, then print the resulting layout from your browser.",
    "caution": "Dates use the Umm al-Qura convention and may differ from regional moon-sighting declarations.",
    "faqs": [
      {
        "question": "Can I save the calendar as a PDF?",
        "answer": "Yes. Use your browser's Print option and choose Save as PDF."
      },
      {
        "question": "Why do some Islamic months have 29 days?",
        "answer": "The lunar calendar alternates between months of 29 and 30 days according to its calendar rules and month-start determination."
      },
      {
        "question": "Can a calculated calendar confirm Eid for my area?",
        "answer": "Not by itself. Actual month starts may follow local moon sightings or an authorised religious calendar, which can differ from the printed estimate."
      }
    ]
  },
  "tasbih-counter": {
    "title": "Online Tasbih Counter – Free Digital Dhikr Counter",
    "h1": "Online Tasbih Counter",
    "description": "Count dhikr or tasbih online with a free digital tally, optional goals of 33 or 99 and saved progress on the same device.",
    "summary": "Tap or use your keyboard to track a dhikr tally at your own pace.",
    "details": "Your count is saved locally in the browser, with optional target reminders. You do not need to register or upload prayer records.",
    "caution": "Your count may disappear if you erase browser storage or switch devices; it is not automatically backed up.",
    "faqs": [
      {
        "question": "Can I use the tasbih counter on mobile?",
        "answer": "Yes. The interactive counter works on mobile screens as well as desktop browsers."
      },
      {
        "question": "Does the counter store my dhikr on a server?",
        "answer": "No. The tally is stored locally in your browser, not in a user account."
      },
      {
        "question": "What happens to my Tasbih count if I clear browser data?",
        "answer": "Counts saved locally can be lost when site storage is deleted or a private session ends. A different device does not automatically share that progress."
      }
    ]
  },
  "quran-planner": {
    "title": "Quran Reading Planner – Daily Pages, Khatm & Catch-Up Schedule",
    "h1": "Quran Reading Planner & Khatm Schedule",
    "description": "Make a flexible Quran reading plan with daily page ranges, optional buffer days and short sessions. Track progress privately, download a timetable and read the sourced guide.",
    "summary": "Turn your remaining Quran pages into a dated daily schedule with optional catch-up days, session splits, on-device progress and downloadable CSV or JSON.",
    "details": "Enter your own Mushaf's page count, completed pages, civil start date and target duration. The planner allocates whole-page ranges over active days, allows one or two buffer days per seven-day block, and exports a full dated schedule while preserving earlier saved plans. The guide covers page-count differences, juz boundaries, sustainable recitation, missed days and privacy.",
    "caution": "604 pages is common but not universal, and page splits do not identify exact ayah or juz boundaries. The plan neither tracks reading automatically nor prescribes a religious completion deadline. Verify Ramadan dates locally and choose a sustainable pace.",
    "faqs": [
      {
        "question": "How many Quran pages should I read daily?",
        "answer": "Divide unread pages in your chosen Mushaf by your active reading days. The planner distributes whole pages evenly and shows the exact dated ranges."
      },
      {
        "question": "Can I use this planner during Ramadan?",
        "answer": "Yes. Select a civil start date and duration after checking the Ramadan announcement followed by your community. The planner does not determine the start or end of Ramadan."
      },
      {
        "question": "Can I enter a Quran edition with fewer than 604 pages?",
        "answer": "Yes. Your own Mushaf's page total is editable, because editions and typesetting differ. The schedule does not assert universal page-to-ayah or juz boundaries."
      },
      {
        "question": "What are buffer or catch-up days?",
        "answer": "You can leave the last one or two days of every seven-day plan block free of new pages for review or catch-up. The finish date stays the same, so active reading days carry more pages."
      },
      {
        "question": "Can I split a daily reading target into sessions?",
        "answer": "Yes. Divide active days into one, three or five optional reading slots. These are practical divisions, not an obligation to read separately after prayers."
      },
      {
        "question": "What should I do when I miss a reading day?",
        "answer": "Enter the pages you have actually completed and use Replan remaining pages from today to set new dates. The planner never marks a missed page as read automatically."
      },
      {
        "question": "Is finishing the Quran in thirty days required?",
        "answer": "No. A thirty-day khatm is a possible personal goal. The source-linked guide discusses measured recitation and a hadith about differing completion intervals; the tool does not impose a religious pace."
      },
      {
        "question": "Will my Quran progress sync across devices?",
        "answer": "No automatic sync. Progress and settings stay in this browser. Download a JSON backup and restore it on another device if needed."
      },
      {
        "question": "Can I download the entire Quran reading timetable?",
        "answer": "Yes. The CSV includes every planned civil date, buffer or active status, page range and optional session ranges. The on-screen preview may show fewer days."
      },
      {
        "question": "Can I restore my old Quran reading plan backup?",
        "answer": "Yes. Earlier four-field JSON backups are accepted and upgraded to the new format with default session and buffer settings, without deleting the original browser data."
      }
    ]
  },
  "fasting-tracker": {
    "title": "Fasting Tracker – Qada and Make-Up Fasts",
    "h1": "Fasting Tracker",
    "description": "Track voluntary or make-up fasting days privately in your browser. Set a target, record completed days and see how many remain.",
    "summary": "Organise planned or make-up fasts with a private progress counter.",
    "details": "Enter your own target number of days and mark each completed fast as you go. The counter stores your progress on this device.",
    "caution": "The tool does not determine qada obligations or whether fidya or kaffarah applies; seek individual qualified advice.",
    "faqs": [
      {
        "question": "Will it tell me how many fasts I owe?",
        "answer": "No. You supply the target; it simply tracks your progress."
      },
      {
        "question": "Can I use it without an account?",
        "answer": "Yes. No sign-in is required, and progress is kept in local browser storage."
      },
      {
        "question": "Does every missed fast require a Fidya payment?",
        "answer": "No. Many missed fasts need to be made up instead; the appropriate treatment depends on why the fast was missed and qualified religious guidance."
      }
    ]
  },
  "printable-prayer-chart": {
    "title": "Printable Prayer Chart – Free Salah Checklist PDF",
    "h1": "Printable Prayer Chart",
    "description": "Create a 7-, 14- or 30-day prayer checklist with Fajr, Dhuhr, Asr, Maghrib and Isha. Print your free Salah chart or save as PDF.",
    "summary": "Create a clean five-prayer table you can print for yourself or your family.",
    "details": "Choose a starting date and number of days, then print a blank checklist for marking each prayer by hand.",
    "caution": "The blank chart does not record personal prayer data online. Use the separate daily tracker if you prefer on-device checkmarks.",
    "faqs": [
      {
        "question": "Can I print a prayer chart for children?",
        "answer": "Yes. The printable chart has simple daily spaces to tick, suitable for family routines."
      },
      {
        "question": "How do I save the chart as a PDF?",
        "answer": "Open your browser's Print dialogue and select Save as PDF."
      },
      {
        "question": "Can children use this Salah chart?",
        "answer": "A printed chart may help learners practise and remember prayer. It should not be treated as a ruling that all ages have identical obligations."
      }
    ]
  },
  "salah-tracker": {
    "title": "Daily Salah Tracker – Five Prayers Checklist",
    "h1": "Daily Salah Tracker",
    "description": "Keep a private daily Salah checklist for Fajr, Dhuhr, Asr, Maghrib and Isha. Tick off your prayers and start fresh each local day.",
    "summary": "Track your five daily prayers with a straightforward on-device checklist.",
    "details": "Tick prayers as completed throughout the day. The tracker stores data in your browser and uses the local date to start a new checklist.",
    "caution": "It does not prove prayer validity, show jamaat times or sync data between phones and computers.",
    "faqs": [
      {
        "question": "Will my checkmarks reset tomorrow?",
        "answer": "Yes. The daily tracker creates a separate checklist for each local day."
      },
      {
        "question": "Is my Salah history private?",
        "answer": "The checklist remains in browser storage on your device unless you share or clear it."
      },
      {
        "question": "Can I transfer my Salah history between devices?",
        "answer": "You can export a JSON backup and restore it on another device. Review the replacement prompt because importing can overwrite the saved local history."
      }
    ]
  },
  "prayer-times-widget": {
    "title": "Prayer Times Widget – Embed Salah Times on Your Site",
    "h1": "Prayer Times Website Widget",
    "description": "Create a free embeddable daily prayer times widget for your mosque, school or Islamic website. Configure city, method, timezone and display theme.",
    "summary": "Set up an iframe timetable showing daily calculated prayer starts.",
    "details": "Choose your location and calculation convention, preview the widget and copy the generated embed code into your site.",
    "caution": "The widget is for calculated prayer starts rather than official mosque jamaat times. Test it on your website and verify frame and timezone settings.",
    "faqs": [
      {
        "question": "Can I add the widget to WordPress?",
        "answer": "Usually yes. Paste the iframe into a Custom HTML block where your site permits embeds."
      },
      {
        "question": "Will it show congregation times?",
        "answer": "No. It displays estimated prayer beginnings, not your mosque's scheduled congregation times."
      },
      {
        "question": "Will a website widget show our mosque's iqamah schedule?",
        "answer": "Not unless that information is separately configured. A calculation-based widget cannot know congregation times set by the mosque."
      }
    ]
  },
  "umrah-packing-checklist": {
    "title": "Hajj & Umrah Packing List – Printable Checklist",
    "h1": "Hajj & Umrah Packing List",
    "description": "Plan what to pack for Hajj or Umrah with a free printable travel checklist. Tick essentials and organise documents, comfort and worship items.",
    "summary": "Prepare for your journey with a practical checklist you can adjust.",
    "details": "Review items by category, mark what is packed and print a copy before you travel.",
    "caution": "Travel-entry, permit, vaccination and airline requirements change and depend on your journey. Always follow official current instructions.",
    "faqs": [
      {
        "question": "Does this checklist include current visa rules?",
        "answer": "No. Verify requirements from official government sources and your licensed travel provider."
      },
      {
        "question": "Can I print my Hajj or Umrah list?",
        "answer": "Yes. Use the print option for a physical copy to check before leaving."
      },
      {
        "question": "Does a packing checklist verify my Hajj permit?",
        "answer": "No. It helps organise belongings and documents but does not check eligibility, visa validity, or official travel authorisations."
      }
    ]
  },
  "laylatul-qadr-nights": {
    "title": "Laylatul Qadr Dates – Last Ten & Odd Nights Planner",
    "h1": "Laylatul Qadr & Last Ten Nights Planner",
    "description": "Plan the last ten Ramadan nights, highlight 21, 23, 25, 27 and 29, compare 29/30-night months and learn the authentic Laylatul Qadr dua.",
    "summary": "Work out the civil evenings of all ten final Ramadan nights, with odd-numbered highlights and explicit 29- versus 30-night planning differences.",
    "details": "Enter the locally announced first fasting date and choose provisional month length. The tool lists when every numbered Islamic night begins at sunset, with printable and calendar-marker exports. A source-linked guide covers Quran 97, authentic hadith, the dua and practical worship.",
    "caution": "Laylatul Qadr cannot be predicted for a specific numbered or Gregorian night. The 27th is not guaranteed. Moon sightings and month length can change dates; all-day event markers are not sunset alarms.",
    "faqs": [
      {"question":"When is Laylatul Qadr in 2027?","answer":"No calendar can identify it with certainty. Enter your locally announced Ramadan start to see the potential final ten evenings and commonly highlighted odd-numbered nights."},
      {"question":"Is Laylatul Qadr always on the 27th night?","answer":"No. Sahih al-Bukhari 2017 encourages seeking it in the odd nights of the final ten; a particular numbered night is not guaranteed."},
      {"question":"Which are the five odd-numbered Ramadan nights?","answer":"When numbered from the beginning: nights 21, 23, 25, 27 and 29. Worship throughout the final ten rather than only these five."},
      {"question":"When does the 21st night start?","answer":"It starts at local sunset after the twentieth daytime fast, before the civil daytime date of Ramadan 21."},
      {"question":"How do the final ten differ in a 29-day Ramadan?","answer":"In a 29-night month the final ten are nights 20–29; in a 30-night month they are nights 21–30."},
      {"question":"What does counting odd nights from the end mean?","answer":"Some hadith wording refers to nights remaining until the end. Parity can differ from numbering forward, depending on whether the month has 29 or 30 nights."},
      {"question":"Which Laylatul Qadr dua is reported?","answer":"Jami at-Tirmidhi 3513 reports a dua asking Allah for pardon; the guide gives a sourced Arabic text, transliteration and meaning."},
      {"question":"Can I download all the last ten nights?","answer":"Yes. Export all ten or only the five odd-numbered evening markers, but these are all-day dates rather than accurate sunset-time alarms."},
      {"question":"Do I need my local Ramadan first fast date?","answer":"Yes. The planner uses that date to count nights; a computed Umm al-Qura suggestion cannot establish your community's moon-sighting decision."}
    ]
  },
  "fidya-calculator": {
    "title": "Fidya Calculator – Missed Ramadan Fast Estimate",
    "h1": "Fidya Calculator for Missed Ramadan Fasts",
    "description": "Calculate a Fidya estimate for eligible missed fasts. Enter the number of fasting days, a verified local per-day rate and your currency.",
    "summary": "Estimate possible Fidya for eligible missed Ramadan fasting days using a locally verified rate, without a misleading worldwide default.",
    "details": "Enter the days for which a qualified authority has determined Fidya applies and the current per-day amount from a trusted local charity or scholar. The result is days multiplied by your entered rate, displayed in your selected currency. The calculator does not fetch rates or collect payments.",
    "caution": "Fidya is not owed for every missed fast and is not an automatic alternative to making up days. Health circumstances, ability to fast later and differences between scholarly schools affect the ruling and form of payment. Confirm your eligibility and local rate before acting.",
    "faqs": [
      {
        "question": "How much Fidya should I pay per day?",
        "answer": "The amount depends on locally applicable food costs and the guidance you follow. This tool intentionally requires you to enter a verified current rate instead of making one up."
      },
      {
        "question": "Do I pay Fidya or make up missed Ramadan fasts?",
        "answer": "It depends on why you missed them, whether you can fast later and the rulings you follow. Consult a qualified authority for your circumstances."
      },
      {
        "question": "Are Fidya, Fitrana and Kaffarah the same?",
        "answer": "No. These are distinct Islamic giving or expiation categories with different conditions and methods."
      },
      {
        "question": "Is Fidya due for every fast I missed in Ramadan?",
        "answer": "No. Many missed fasts must be made up instead. Circumstances and the school you follow determine when Fidya is appropriate."
      }
    ]
  },
  "qada-prayer-calculator": {
    "title": "Missed Salah Calculator – Qada / Qaza Prayer Tracker",
    "h1": "Missed Salah (Qada) Calculator",
    "description": "Estimate Qada or Qaza prayers by days, years or date range. Set Fajr-to-Isha targets, optionally include Witr, and track make-up progress privately.",
    "summary": "Create a private plan for potentially missed Salah, with editable prayer targets and saved on-device progress.",
    "details": "Choose a number of days, approximate years or an inclusive start and end date. Exclude days only after checking applicable exemptions and adjust Fajr, Dhuhr, Asr, Maghrib and Isha individually. You can optionally add Witr, which has school-specific treatment. Mark completed make-up prayers and use Undo for corrections. Completion counts are stored in your browser only.",
    "caution": "This is a planning estimate rather than a determination of religious liability. Rulings differ regarding deliberately missed prayers, exemption periods, Witr and how to make up prayers. Only enter obligations established through qualified guidance.",
    "faqs": [
      {
        "question": "How do I calculate years of missed Salah?",
        "answer": "Select approximate years and then review the estimated number of days. Adjust the target for each prayer to reflect your circumstances, rather than treating the estimate as a ruling."
      },
      {
        "question": "Should I include Witr when counting missed prayers?",
        "answer": "Witr is treated differently across schools of law. The option is off by default; include it only if it fits the guidance you follow."
      },
      {
        "question": "Does the Qada tracker save my prayer records?",
        "answer": "It stores completed counts in local storage on that browser. There is no account or synchronisation, and clearing browser data may erase progress."
      },
      {
        "question": "Does every make-up prayer plan have to include Witr?",
        "answer": "Not necessarily. Different schools classify Witr and its make-up differently. Enable Witr only if it matches guidance you have chosen to follow."
      }
    ]
  },
  "qurbani-share-calculator": {
    "title": "Qurbani Share Calculator – Cow, Sheep & Udhiyah Costs",
    "h1": "Qurbani Share Calculator",
    "description": "Split Qurbani (Udhiyah) costs for a cow, camel, buffalo, sheep or goat. Work out each participant's contribution with up to seven shares.",
    "summary": "Calculate the equal contribution for each participant in a Qurbani using your actual quoted animal cost.",
    "details": "Select an animal, number of participating shares and quoted total price. For a sheep or goat, the calculator allows a single share. For cattle, buffalo or camel, it allows up to seven participants under a commonly cited ruling. It divides your entered total cost by the number selected and shows the result in your chosen currency.",
    "caution": "Payment splitting is not proof that a sacrifice is valid. Animal age, eligibility, ownership, intention and allocation of shares depend on scholarly guidance and local arrangements. Prices are entered by you and not checked against a provider.",
    "faqs": [
      {
        "question": "How many Qurbani shares can be in a cow?",
        "answer": "Under a commonly cited ruling, a cow may be shared by up to seven participants. Check eligibility and intentions with a qualified authority."
      },
      {
        "question": "Can seven people split a sheep as seven Qurbani shares?",
        "answer": "The calculator uses the common distinction that a sheep or goat represents one sacrificial share. Sharing payment informally is not the same as establishing seven separate shares."
      },
      {
        "question": "Does this calculator include animal prices?",
        "answer": "No. Enter the actual total quoted by your chosen provider, including any costs you want to divide."
      },
      {
        "question": "Can every Qurbani animal be split into seven shares?",
        "answer": "No. The common seven-share arrangement applies to qualifying larger animals under relevant rulings, rather than every sheep or goat."
      }
    ]
  },
  "kaffarah-calculator": {
    "title": "Kaffarah Calculator – Broken Oath & Ramadan Estimate",
    "h1": "Kaffarah Calculator",
    "description": "Explore a conditional Kaffarah feeding-cost estimate for a broken oath or Ramadan fast violation. Enter a locally verified cost per person.",
    "summary": "Review distinct Kaffarah scenarios and an illustrative cost to feed eligible people, where feeding is applicable.",
    "details": "Kaffarah for a broken oath and for specific Ramadan violations are not the same obligation. For an oath, Quran 5:89 describes feeding ten needy people or clothing them, with fasting when unable. For certain Ramadan cases, remedies can include freeing a slave, consecutive fasting or feeding sixty people according to relevant rulings and circumstances. The calculator displays only a conditional feeding scenario using a local rate you provide; it does not prescribe a payment.",
    "caution": "Not every missed or broken fast creates Kaffarah. Whether feeding, fasting or another remedy applies, and whether monetary substitution is permitted, depends on the case and school of law. Confirm the obligation and its order with a qualified scholar before taking action.",
    "faqs": [
      {
        "question": "How many people should be fed for Kaffarah of an oath?",
        "answer": "Quran 5:89 refers to feeding ten needy people, or clothing them, with fasting three days if unable. The applicable feeding method requires local guidance."
      },
      {
        "question": "Is there a fixed Kaffarah amount in the UK?",
        "answer": "There is no universal amount suitable for every case. Enter a verified locally applicable cost per eligible person for an illustration, not as an automatic payment instruction."
      },
      {
        "question": "Do all broken Ramadan fasts require Kaffarah?",
        "answer": "No. The act, intention, exemptions and rulings followed determine whether expiation applies. Ask a qualified scholar about your situation."
      },
      {
        "question": "Is Kaffarah always payable in money?",
        "answer": "No. Depending on the type of case and applicable ruling, expiation can involve alternatives such as fasting or feeding. A cash estimate is conditional."
      }
    ]
  },
  "tawaf-sai-counter": {
    "title": "Tawaf & Sa’i Counter – Seven Rounds for Umrah & Hajj",
    "h1": "Tawaf & Sa’i Counter",
    "description": "Free Tawaf and Sa'i counters for Umrah and Hajj. Track seven Kaaba circuits and seven Safa–Marwah lengths with undo, reset and private progress.",
    "summary": "Keep separate seven-round counts for Tawaf circuits and Sa'i one-way lengths with simple tap controls.",
    "details": "For Tawaf, increment the counter after finishing each complete circuit around the Kaaba, beginning and ending at the Black Stone. For Sa'i, count one length from Safa to Marwah as one, then the return from Marwah to Safa as two; seven lengths finish at Marwah. You can undo accidental taps or reset either counter. Both are stored locally in your browser.",
    "caution": "This counter is only a practical reminder. It does not authenticate the validity of Hajj or Umrah rites and cannot replace guidance for starting points, intentions or special circumstances. Progress may be lost if you clear data or switch devices.",
    "faqs": [
      {
        "question": "How many circuits are there in Tawaf?",
        "answer": "Seven complete circuits around the Kaaba. Tap the counter once after completing each circuit."
      },
      {
        "question": "Is Safa to Marwah and back one Sa'i round?",
        "answer": "No. Safa to Marwah is one length and Marwah back to Safa is two. The seventh length finishes at Marwah."
      },
      {
        "question": "Will my Tawaf count stay if I close the tab?",
        "answer": "The counters are saved to browser storage on the current device, subject to your storage settings. You can also reset them manually."
      },
      {
        "question": "Does seven Sa'i lengths mean seven round trips?",
        "answer": "No. Each trip from Safa to Marwah or back counts as one length. Starting at Safa, the seventh length finishes at Marwah."
      }
    ]
  },
  "prayer-rakats-chart": {
    "title": "Prayer Rakats Chart – Fajr to Isha | Printable",
    "h1": "Prayer Rakats Chart",
    "description": "See how many obligatory (Fard) rakats are in Fajr, Dhuhr, Asr, Maghrib and Isha. Compare the five daily prayers and print a concise reference chart.",
    "summary": "The five daily obligatory prayers have different numbers of Fard rakats, and additional Sunnah or Witr prayers require separate explanation.",
    "details": "The reference displays Fard rakats: Fajr two, Dhuhr four, Asr four, Maghrib three and Isha four. Extra prayers are not treated as universally interchangeable.",
    "caution": "Optional Sunnah and Witr practices differ by school and circumstance. This chart explains common obligatory counts only, not a complete fatwa on every prayer.",
    "faqs": [
      {
        "question": "How many Fard rakats are in Fajr?",
        "answer": "The obligatory Fajr prayer has two Fard rakats. Additional recommended units are separate from those two."
      },
      {
        "question": "Does the chart include Witr and all Sunnah prayers?",
        "answer": "No. It lists the five obligatory prayers. Witr and recommended prayers require additional school-specific guidance."
      },
      {
        "question": "Does the chart include every Sunnah prayer?",
        "answer": "No. It displays the Fard units for the five obligatory prayers, rather than a complete schedule of recommended or Witr prayers."
      }
    ]
  },
  "daily-adhkar": {
    "title": "Quranic Duas & Adhkar – Arabic, Meaning & Sources",
    "h1": "Quranic Duas and Adhkar",
    "description": "Read a curated collection of short Quranic supplications in Arabic with transliteration, English meaning and linked Quran references.",
    "summary": "Read a small selection of Quranic prayers for forgiveness, knowledge, guidance and steadfastness, with clear verse references.",
    "details": "Every supplication has its Quran reference and an English meaning. A voluntary repetition counter helps you read at your own pace, without prescribing unsupported counts.",
    "caution": "This is a short collection of Quranic duas, not a complete authenticated morning/evening Sunnah litany. Transliterations are aids, not substitutes for accurate recitation.",
    "faqs": [
      {
        "question": "Are these morning and evening adhkar?",
        "answer": "They are Quranic supplications suitable for personal remembrance. This collection does not claim a prescribed morning or evening repetition schedule."
      },
      {
        "question": "Can I set my own repetition count?",
        "answer": "Yes. The counter is only a reading aid; it does not establish a Sunnah number of repetitions for any verse."
      },
      {
        "question": "Is the Quranic Dua tool a complete morning and evening collection?",
        "answer": "No. It currently contains a limited set of Quranic supplications, not a comprehensive authenticated daily adhkar compilation."
      }
    ]
  },
  "halal-additives-checker": {
    "title": "Halal E-Number Checker – Ingredient Source Guide",
    "h1": "Halal E-Number Checker",
    "description": "Search common E-numbers, including E471, E120 and E322. Learn which additives may have animal, plant or synthetic sources and need verification.",
    "summary": "Search a limited starter directory of common food additives and examine what their production sources may be.",
    "details": "An E-number identifies an additive rather than its animal or plant origin. Manufacturer sourcing, processing and regional regulations can all affect assessment.",
    "caution": "No entry is a halal certification or product verdict. Ingredients such as E471 and glycerol can have different sources. Check the supplier and a trusted halal certifier.",
    "faqs": [
      {
        "question": "Is E471 always halal?",
        "answer": "No. Mono- and diglycerides can come from plant or animal fats; the E-number alone does not confirm their origin or a product's halal status."
      },
      {
        "question": "Does an E-number prove a food is haram?",
        "answer": "No. A code may identify a substance with multiple production sources. The finished food and relevant certification need checking."
      },
      {
        "question": "Does the E471 code prove a product is forbidden?",
        "answer": "No. That emulsifier can come from different sources. The code alone cannot establish origin or certify the complete finished product."
      }
    ]
  },
  "zakat-anniversary-calculator": {
    "title": "Zakat Anniversary Calculator – Hawl Date",
    "h1": "Zakat Anniversary Calculator",
    "description": "Estimate when one Islamic lunar year has passed after a selected date using the Umm al-Qura Hijri calendar, for Zakat planning.",
    "summary": "Enter a reference date to estimate the next anniversary in the Islamic lunar calendar and help organise a Zakat review.",
    "details": "The tool converts your selected Gregorian date to Umm al-Qura Hijri, advances one Hijri year and converts back. Exceptional month lengths can change the matching day.",
    "caution": "The calculator does not decide when you became liable for Zakat, how interrupted Nisab affects hawl, or which method of reckoning applies to you.",
    "faqs": [
      {
        "question": "Is a Zakat year twelve Gregorian months?",
        "answer": "A lunar year is shorter than a Gregorian year, so a Hijri anniversary generally falls earlier in the civil calendar."
      },
      {
        "question": "Does this date tell me exactly when I must pay Zakat?",
        "answer": "No. Nisab, ownership, hawl and school-specific rules determine liability. Use the date as a reminder and seek qualified guidance."
      },
      {
        "question": "Is a Zakat anniversary always 365 days later?",
        "answer": "No. Hijri years are around 354 or 355 days. Nisab and hawl conditions require separate religious assessment."
      }
    ]
  },
  "dhul-hijjah-planner": {
    "title": "Dhul Hijjah & Arafah Dates – Islamic Calendar",
    "h1": "Dhul Hijjah and Arafah Dates",
    "description": "Find estimated Gregorian dates for the first ten days of Dhul Hijjah, Arafah and Eid al-Adha with a printable planner.",
    "summary": "Explore the first ten days of the twelfth Hijri month and the calculated dates for Arafah and Eid al-Adha.",
    "details": "The tool uses the Umm al-Qura calendar to convert 1–10 Dhul Hijjah into Gregorian dates. The expected day of Arafah is 9 Dhul Hijjah.",
    "caution": "Actual beginning dates and major observances depend on official religious announcements. Eid is not an ordinary voluntary fasting day.",
    "faqs": [
      {
        "question": "When is the Day of Arafah?",
        "answer": "Arafah corresponds to 9 Dhul Hijjah. Its Gregorian date changes each year and should be confirmed locally."
      },
      {
        "question": "Can I fast on Eid al-Adha?",
        "answer": "No. Eid al-Adha, 10 Dhul Hijjah, is not a day for voluntary fasting. Seek guidance for special circumstances."
      },
      {
        "question": "Does Arafah always fall on the same weekday?",
        "answer": "No. The ninth of Dhul Hijjah moves through the Gregorian year, so its civil date and weekday change."
      }
    ]
  },
  "travel-prayer-guide": {
    "title": "Travel Prayer & Qasr Guide – Salah While Travelling",
    "h1": "Travel Prayer and Qasr Guide",
    "description": "Review Qasr prayer basics for travel, including the four-rakat prayers that may be shortened and differences between Islamic schools.",
    "summary": "Understand which prayers may be shortened during qualifying journeys and what information affects a traveller's prayer arrangements.",
    "details": "Qasr ordinarily concerns shortening qualifying four-rakat obligatory prayers to two while travelling. Thresholds and duration rules vary by school and circumstances.",
    "caution": "This is educational guidance, not an automatic eligibility ruling. Travel distance, stay length, intention and madhhab-specific details require religious review.",
    "faqs": [
      {
        "question": "Are Fajr and Maghrib shortened when travelling?",
        "answer": "No. Under the common Qasr framework Fajr remains two Fard rakats and Maghrib remains three; qualifying four-rakat prayers may be shortened."
      },
      {
        "question": "Does a particular travel distance always qualify for Qasr?",
        "answer": "No. Schools use differing measures and conditions. Check the criteria you follow, including when the journey begins and how long you intend to stay."
      },
      {
        "question": "Is Maghrib shortened to two rakats while travelling?",
        "answer": "No. Under the common Qasr framework Maghrib remains three Fard rakats. The shortening applies to qualifying four-rakat obligatory prayers."
      }
    ]
  },
  "quran-juz-finder": {
    "title": "Quran Juz Finder – All 30 Parts and Starting Verses",
    "h1": "Quran Juz Finder",
    "description": "Browse the thirty Juz of the Quran, find where each part begins by Surah and Ayah, and open the reference for reading.",
    "summary": "Find the first Surah and verse of every one of the Quran's thirty equal reading divisions.",
    "details": "The index records the starting Surah and Ayah of each Juz. Printed Mushaf pagination depends on your edition and is not inferred from these references.",
    "caution": "This is a starting-reference index, not an Arabic manuscript or a Tajwid guide. Check the chosen Mushaf or trusted Quran text for precise boundaries.",
    "faqs": [
      {
        "question": "How many Juz are in the Quran?",
        "answer": "The Quran is conventionally divided into thirty Juz to help organise reading and recitation."
      },
      {
        "question": "Is one Juz always twenty pages long?",
        "answer": "No. Page counts vary with the printing and layout of a Mushaf. This index uses Surah and verse references."
      },
      {
        "question": "Does every Juz begin at the start of a Surah?",
        "answer": "No. Many Juz begin partway through a chapter. The tool provides starting verse references for navigating a Quran copy."
      }
    ]
  },
  "zakat-stocks-crypto": {
    "title": "Zakat on Shares & Crypto – Conditional 2.5% Estimate",
    "h1": "Shares and Crypto Zakat Estimate",
    "description": "Calculate a conditional 2.5 percent Zakat estimate from entered share and cryptocurrency values, with clear warnings about differing scholarly treatments.",
    "summary": "Enter investments and digital asset values yourself to see a conditional estimate after any deductible liabilities.",
    "details": "The calculator sums the values you enter and subtracts an eligible debt amount, then shows 2.5% of the nonnegative balance for illustration.",
    "caution": "Business ownership, intention, trading stock, investment funds, pensions and cryptocurrency have school- and asset-specific rules. This is not a definitive amount due.",
    "faqs": [
      {
        "question": "Do I pay Zakat on every share in the same way?",
        "answer": "Not necessarily. Some approaches distinguish active trading holdings from long-term investments and underlying business assets."
      },
      {
        "question": "Does the calculator fetch live Bitcoin or share prices?",
        "answer": "No. Enter current valuations in the same currency from a source you trust. The calculation stays in your browser."
      },
      {
        "question": "Is Zakat on long-term investments always the same as cash?",
        "answer": "Not universally. Some approaches distinguish trading holdings and long-term investments or account for underlying assets. Check the method you follow."
      }
    ]
  },
  "hifz-tracker": {
    "title": "Hifz Tracker – Quran Memorisation Planner",
    "h1": "Quran Hifz Memorisation Tracker",
    "description": "Set a Quran memorisation goal by Surah and verse range, log progress privately and estimate a daily memorisation pace.",
    "summary": "Plan an achievable memorisation range and track the verses you have reviewed or memorised over time.",
    "details": "The tracker uses your own entered goal and progress, then estimates the remaining verses per day for a chosen number of days.",
    "caution": "A numerical goal does not measure recitation quality or mastery. Review memorisation with a qualified teacher and use appropriate revision.",
    "faqs": [
      {
        "question": "Can I keep my Hifz progress without an account?",
        "answer": "Yes. The tracker stores the current plan on this device, so clear-browser-data actions may remove it."
      },
      {
        "question": "Does a verse count mean I have mastered a Surah?",
        "answer": "No. Memorisation and revision need careful listening, repetition and correction with a teacher or reliable reciter."
      },
      {
        "question": "Should I memorise a fixed number of verses every day?",
        "answer": "Choose a sustainable target that includes revision. This tracker estimates progress but does not assess Tajwid, fluency or memorisation accuracy."
      }
    ]
  }
};
