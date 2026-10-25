// Individually edited, search-intent aligned content for Sunnah Tools.
// Keep dates, religious caveats, and capabilities accurate; do not fabricate live feeds.
export type ToolSeoEntry={title:string;h1:string;description:string;summary:string;details:string;caution:string;faqs:{question:string;answer:string}[]};
export const toolSeo:Record<string,ToolSeoEntry> = {
  "prayer-times": {
    "title": "Prayer Times for Your Location – Fajr to Isha",
    "h1": "Prayer Times for Your Location",
    "description": "Check prayer times today for your chosen city or coordinates. View Fajr, sunrise, Dhuhr, Asr, Maghrib and Isha with adjustable calculation methods.",
    "summary": "Choose a location and calculation method to see today's estimated prayer beginnings.",
    "details": "Prayer times depend on the Sun's position, your latitude and longitude, your timezone and the calculation method. Fajr and Isha angles vary between authorities.",
    "caution": "These are estimated start times, not the congregational (jamaat) schedule posted by your local mosque.",
    "faqs": [
      {
        "question": "Why does Fajr change each day?",
        "answer": "Earth’s position relative to the Sun changes with the seasons, moving the calculated dawn time."
      },
      {
        "question": "Do these times work worldwide?",
        "answer": "Use accurate coordinates and the right timezone. High-latitude locations may need special calculation settings."
      }
    ]
  },
  "qibla-finder": {
    "title": "Qibla Finder Online – Find Direction from Your Location",
    "h1": "Qibla Finder Online",
    "description": "Find the Qibla direction online using your location or entered coordinates. See the great-circle bearing to the Kaaba from true north, without a compass sensor.",
    "summary": "Use your coordinates to calculate your Qibla bearing towards Makkah.",
    "details": "This tool calculates the shortest path over the Earth's surface, known as the great-circle bearing, rather than a straight line on a flat map.",
    "caution": "The bearing is measured clockwise from geographic north. A magnetic compass or phone sensor may point differently until properly calibrated.",
    "faqs": [
      {
        "question": "Can I find Qibla without location permission?",
        "answer": "Yes. Enter a city or geographic coordinates instead of sharing device location."
      },
      {
        "question": "Why does my compass point somewhere else?",
        "answer": "Physical compasses measure magnetic north and can be affected by declination and local interference."
      }
    ]
  },
  "tahajjud-time": {
    "title": "Tahajjud Time Calculator – Last Third of the Night",
    "h1": "Tahajjud Time Calculator",
    "description": "Calculate the last third of the night between Maghrib and Fajr to plan Tahajjud prayer. Free, location-aware night prayer time calculator.",
    "summary": "Find when the final third of tonight begins using local sunset and dawn estimates.",
    "details": "The Islamic night is measured from sunset (Maghrib) to the next dawn (Fajr). Divide that interval into three equal lengths to find the last third.",
    "caution": "Your calculated start can change if your mosque follows a different Fajr angle or local timetable.",
    "faqs": [
      {
        "question": "What is the last third of the night?",
        "answer": "The final third of the period between sunset and the next Fajr, not simply the final hours before midnight."
      },
      {
        "question": "Can I pray Tahajjud earlier?",
        "answer": "Night prayer is not limited to the last third. This calculator identifies a commonly preferred period, not a rule for every circumstance."
      }
    ]
  },
  "fasting-times": {
    "title": "Suhoor & Iftar Times Today – Fajr and Maghrib",
    "h1": "Suhoor & Iftar Times Today",
    "description": "Check today's estimated Suhoor cutoff and Iftar time for your location using Fajr and Maghrib. Choose a city, calculation method and timezone.",
    "summary": "Find today's Fajr reference for ending Suhoor and Maghrib reference for Iftar.",
    "details": "The start of the fast is associated with true dawn (Fajr) and the fast ends at sunset (Maghrib). The calculator uses your location and chosen astronomical convention.",
    "caution": "Some communities publish a precautionary imsak time before Fajr. Use your local mosque's verified Ramadan timetable where available.",
    "faqs": [
      {
        "question": "Is imsak the same as Fajr?",
        "answer": "Not always. Imsak may be an earlier precautionary time, while Fajr is the dawn prayer start reference."
      },
      {
        "question": "Why does Iftar change every day?",
        "answer": "Sunset shifts through the year and depends on your location and timezone."
      }
    ]
  },
  "ramadan-timetable": {
    "title": "Ramadan Timetable – Printable Suhoor & Iftar Times",
    "h1": "Ramadan Timetable",
    "description": "Generate a free printable Ramadan timetable for your city with daily Fajr and Maghrib estimates. Choose an expected start date and calculation method.",
    "summary": "Create a day-by-day Ramadan timetable for your selected location.",
    "details": "Enter the anticipated Ramadan start and location to see Fajr and Maghrib estimates across the following 30 days. Print the results or save them as a PDF.",
    "caution": "The first day and month length depend on local moon sighting. Recheck official announcements and mosque schedules before relying on a printed copy.",
    "faqs": [
      {
        "question": "Can I print a timetable for my city?",
        "answer": "Yes. Choose your city and method, generate the timetable, then use your browser print or save-as-PDF option."
      },
      {
        "question": "Will Ramadan always be 30 days?",
        "answer": "No. Lunar months are 29 or 30 days. Treat the 30-day output as a planning grid until local announcements confirm the month."
      }
    ]
  },
  "ramadan-countdown": {
    "title": "Ramadan Countdown – Days Until Ramadan",
    "h1": "Ramadan Countdown",
    "description": "See how many days remain until an estimated Ramadan start date. Adjust the expected first day to match your local moon-sighting announcement.",
    "summary": "Track the days remaining until your estimated first day of Ramadan.",
    "details": "The countdown works from the Gregorian date selected in your browser and decreases as the date approaches.",
    "caution": "Because Ramadan begins after a lunar month is confirmed, estimated start dates can differ by country and religious authority.",
    "faqs": [
      {
        "question": "Is the countdown an official Ramadan announcement?",
        "answer": "No. It is an editable estimate; follow local lunar-sighting announcements."
      },
      {
        "question": "Why might two countries start on different days?",
        "answer": "Religious authorities may follow different moon-sighting criteria and announcements."
      }
    ]
  },
  "zakat-calculator": {
    "title": "Zakat Calculator UK – Cash, Gold & Savings",
    "h1": "Zakat Calculator",
    "description": "Use our UK-friendly Zakat calculator for cash, gold, savings and investments. Enter your currency, asset values and metal prices to estimate conditional Zakat.",
    "summary": "Estimate Zakat payable on qualifying net wealth, subject to Nisab and hawl.",
    "details": "Add qualifying assets and permitted liabilities, then compare net wealth with a gold- or silver-based Nisab threshold using the prices you provide.",
    "caution": "The tool cannot determine whether jewellery, investments or every debt is included for your circumstances. Verify these treatments with qualified local guidance.",
    "faqs": [
      {
        "question": "Is Zakat always 2.5%?",
        "answer": "The familiar 2.5% rate applies to many qualifying forms of wealth, but not all assets or obligations follow the same rule."
      },
      {
        "question": "Which Nisab should I use?",
        "answer": "Gold and silver give different thresholds. Apply the approach recommended by a trusted scholar or your relevant institution."
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
      }
    ]
  },
  "hijri-converter": {
    "title": "Hijri Date Today – Islamic Date Converter",
    "h1": "Hijri Date Today",
    "description": "Check today's Hijri date and convert Gregorian dates to Islamic dates or back. Free Umm al-Qura Hijri date converter with local moon-sighting caveats.",
    "summary": "See today's calculated Islamic date, then convert any Gregorian or Hijri date.",
    "details": "The Hijri calendar follows lunar months of 29 or 30 days. This converter uses the Umm al-Qura convention available in modern browsers.",
    "caution": "Different countries may observe a lunar month beginning on another civil date. Local religious dates are not guaranteed by a computed calendar.",
    "faqs": [
      {
        "question": "What is the Hijri date today?",
        "answer": "The date shown above uses your device's current local date and the Umm al-Qura calendar; check your local mosque for sighting-based differences."
      },
      {
        "question": "Is the Hijri date the same worldwide?",
        "answer": "Not always. Regional observations and authorities may declare a different beginning to a lunar month."
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
      }
    ]
  },
  "white-days-calendar": {
    "title": "White Days Calendar – 13th, 14th & 15th Hijri",
    "h1": "White Days Fasting Calendar",
    "description": "Find the next White Days fasting dates (13, 14 and 15 of the Hijri month), with calculated Gregorian dates, exceptions and calendar export.",
    "summary": "Find upcoming White Days for optional fasting and save the dates.",
    "details": "The calculator identifies the thirteenth, fourteenth and fifteenth dates of Hijri months in the Umm al-Qura calendar.",
    "caution": "Certain dates, such as the days of Tashreeq, need special treatment. Moon-sighting differences can also shift the civil dates.",
    "faqs": [
      {
        "question": "What are the White Days?",
        "answer": "They are the 13th, 14th and 15th days of each lunar Hijri month, traditionally associated with voluntary fasting."
      },
      {
        "question": "Should I fast on the 13th of Dhul Hijjah?",
        "answer": "The 13th of Dhul Hijjah is among the days of Tashreeq. Ordinary voluntary fasting is generally not performed then."
      }
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
      }
    ]
  },
  "quran-planner": {
    "title": "Quran Reading Planner – Daily Khatm Schedule",
    "h1": "Quran Reading Planner",
    "description": "Plan daily Quran reading to finish in a chosen number of days. Enter your mushaf page count and reading progress for a practical khatm schedule.",
    "summary": "Work out how many Quran pages to read each day to meet your goal.",
    "details": "Enter the total pages in your mushaf, pages completed and available days. The planner divides remaining pages into daily and optional per-prayer goals.",
    "caution": "Mushaf layouts vary; do not assume 604 pages unless that matches your edition. Progress is a planning estimate.",
    "faqs": [
      {
        "question": "How many Quran pages should I read daily?",
        "answer": "Divide the remaining pages in your own mushaf by the number of days you have set aside."
      },
      {
        "question": "Can I use this planner during Ramadan?",
        "answer": "Yes. Select the days remaining in Ramadan or any other personal goal period."
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
      }
    ]
  },
  "laylatul-qadr-nights": {
    "title": "Laylatul Qadr Odd Nights Calculator – Ramadan Dates",
    "h1": "Laylatul Qadr Odd Nights Calculator",
    "description": "Find Ramadan's 21st, 23rd, 25th, 27th and 29th nights from your local start date. View, print and export dates for the last ten nights.",
    "summary": "Choose your community's announced first fasting day to work out when the odd-numbered nights in the last ten nights of Ramadan begin.",
    "details": "The Islamic night begins at sunset before its corresponding daytime fast. Our calculator places the 21st night on the civil evening after the 20th day of fasting, then lists the 23rd, 25th, 27th and 29th nights. Add the dates to your calendar with a downloadable ICS file or print them for your Ramadan plan.",
    "caution": "This is not an official Ramadan start announcement or a predictor of Laylatul Qadr. Night dates can change with local moon sighting. Worship throughout the last ten nights, not solely the odd-numbered ones. Sunset varies by location and is not calculated on this page.",
    "faqs": [
      {
        "question": "When is the 27th night of Ramadan 2027?",
        "answer": "It starts at sunset after the 26th daytime fast. Enter the first Ramadan fasting day announced by your local community to see the corresponding civil evening; it can differ between locations."
      },
      {
        "question": "Does the 21st night begin on the 21st day?",
        "answer": "The 21st Islamic night begins the previous civil evening, after the 20th daytime fast, because Islamic dates change at sunset."
      },
      {
        "question": "Can I add Ramadan odd nights to my calendar?",
        "answer": "Yes. Download the calendar file to add all five evening dates, or print the result. Use your local sunset time when planning."
      }
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
      }
    ]
  }
};
