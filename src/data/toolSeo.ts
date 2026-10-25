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
  }
};
