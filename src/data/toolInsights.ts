export type ToolInsight={example:string;check:string;benchmark:{site:string;url:string;match:string};faq:{question:string;answer:string}};
export const toolInsights:Record<string,ToolInsight> = {
  "prayer-times": {
    "example": "Compare two calculation conventions for the same city to see why Fajr or Isha estimates differ.",
    "check": "Confirm the convention used by your mosque, not just the location.",
    "benchmark": {
      "site": "IslamicFinder",
      "url": "https://www.islamicfinder.org/world/united-kingdom/2643743/london-prayer-times/",
      "match": "direct"
    },
    "faq": {
      "question": "Why do two prayer applications show different Fajr times?",
      "answer": "They may use different dawn angles or local timetable adjustments. Check each calculation setting against the timetable followed by your local mosque."
    }
  },
  "fasting-times": {
    "example": "Choose your city before checking Fajr as the suhoor cutoff and Maghrib for iftar.",
    "check": "An earlier imsak entry may be precautionary rather than the start of Fajr.",
    "benchmark": {
      "site": "Humble Halal",
      "url": "https://www.humblehalal.com/tools",
      "match": "direct"
    },
    "faq": {
      "question": "Does imsak always mean Fajr has begun?",
      "answer": "No. Some calendars show an earlier precautionary imsak time. Check which entry your local religious authority uses as the beginning of the daily fast."
    }
  },
  "qibla-finder": {
    "example": "A Qibla bearing of 118 degrees means turning clockwise from geographic north by 118 degrees.",
    "check": "Physical compasses may show magnetic rather than true north.",
    "benchmark": {
      "site": "Falah",
      "url": "https://falah.io/en/",
      "match": "direct"
    },
    "faq": {
      "question": "Does the Qibla bearing use my phone's compass heading?",
      "answer": "The fixed great-circle bearing is calculated from your location and geographic north. An optional device heading needs compatible sensors and correction for magnetic declination."
    }
  },
  "tahajjud-time": {
    "example": "For Maghrib at 18:00 and following Fajr at 05:00, the last third begins at about 01:20.",
    "check": "Use the next morning's Fajr, not sunrise or civil midnight.",
    "benchmark": {
      "site": "Time of Tahajjud",
      "url": "https://timeoftahajjud.com/",
      "match": "direct"
    },
    "faq": {
      "question": "Can I enter Maghrib and Fajr directly from my mosque?",
      "answer": "Yes. Manual mode accepts tonight's Maghrib and the following morning's Fajr and divides that overnight interval into three equal portions."
    }
  },
  "ramadan-timetable": {
    "example": "Enter an illustrative first fast on 8 February 2027: a 29-day table ends on 8 March and a 30-day table on 9 March. Neither is an official moon-sighting announcement.",
    "check": "Compare your mosque's calendar method and high-latitude practice. Check every exported date against announcements; imported calendar files do not update automatically.",
    "benchmark": {
      "site": "IslamicFinder",
      "url": "https://www.islamicfinder.org/world/united-kingdom/2643743/london-prayer-times/",
      "match": "direct"
    },
    "faq": {
      "question": "Can I download Ramadan dates for my calendar?",
      "answer": "Yes. The timetable exports estimated Fajr and Maghrib reminders as calendar events. Confirm the location, calculation settings and announced fasting dates first."
    }
  },
  "ramadan-countdown": {
    "example": "An illustrative first daytime fast on 8 February 2027 puts the opening Ramadan evening at sunset on 7 February; the actual sunset clock time depends on the place.",
    "check": "The calculated UTC countdown target is not an observed crescent. Confirm the date locally, and replace an exported event if an announcement changes it.",
    "benchmark": {
      "site": "Falah",
      "url": "https://falah.io/en/",
      "match": "direct"
    },
    "faq": {
      "question": "Why can Ramadan countdowns disagree by a day?",
      "answer": "Calendars and local moon-sighting decisions may establish different starting dates. Set the countdown to the announced date recognised by your community."
    }
  },
  "zakat-calculator": {
    "example": "Enter cash, investments, business assets and qualifying debts separately before reviewing net assets.",
    "check": "Pensions, business interests and liabilities can require additional scholarly assessment.",
    "benchmark": {
      "site": "Islamic Relief Zakat",
      "url": "https://www.islamic-relief.org.uk/giving/islamic-giving/zakat/zakat-calculator/",
      "match": "direct"
    },
    "faq": {
      "question": "Should I enter every pension balance as cash?",
      "answer": "Not necessarily. Pension ownership, access and the guidance you follow can affect its Zakat treatment. Review those factors before entering a qualifying amount."
    }
  },
  "fitrana-calculator": {
    "example": "For a family of four, multiply four by the rate per person confirmed by your chosen charity.",
    "check": "Rates can vary by locality, date and accepted method.",
    "benchmark": {
      "site": "ToolNova",
      "url": "https://www.toolnova.org/islamic-tools",
      "match": "direct"
    },
    "faq": {
      "question": "Can I use last year's Fitrana rate?",
      "answer": "Check the current locally advised amount. Food prices and the rate selected by your mosque or charity may change between Ramadan seasons."
    }
  },
  "gold-zakat-calculator": {
    "example": "Value 22-carat jewellery at its actual gold purity and a current appropriate price.",
    "check": "Whether personal jewellery is included can depend on school and ownership circumstances.",
    "benchmark": {
      "site": "Islamic Relief Zakat",
      "url": "https://www.islamic-relief.org.uk/giving/islamic-giving/zakat/zakat-calculator/",
      "match": "direct"
    },
    "faq": {
      "question": "Why does jewellery purity affect the estimate?",
      "answer": "Carat measures the proportion of fine gold in an item. Its market value can vary with purity even when gross weight is the same."
    }
  },
  "nisab-calculator": {
    "example": "Compare current gold and silver prices against 87.48g and 612.36g reference weights.",
    "check": "Use prices in the same currency and the benchmark appropriate to your circumstances.",
    "benchmark": {
      "site": "Islamic Relief Nisab",
      "url": "https://www.islamic-relief.org.uk/giving/islamic-giving/zakat/nisab/",
      "match": "direct"
    },
    "faq": {
      "question": "Why are gold and silver Nisab amounts so different?",
      "answer": "The benchmark weights and market prices differ, giving different monetary amounts. Your school or trusted adviser can help determine which threshold to use."
    }
  },
  "islamic-events-calendar": {
    "example": "Find an estimated date for Ashura or Arafah, then check your local announcement closer to the event.",
    "check": "Regional lunar month starts may differ from precomputed dates.",
    "benchmark": {
      "site": "timeanddate",
      "url": "https://www.timeanddate.com/calendar/islamic-calendar.html",
      "match": "related"
    },
    "faq": {
      "question": "Do major Islamic events fall on the same Gregorian day every year?",
      "answer": "No. Islamic dates follow lunar months, which move through the solar year. Some observances can also differ locally because of moon-sighting conventions."
    }
  },
  "hijri-converter": {
    "example": "Choose 14 October 2017: Umm al-Qura gives 24 Muharram 1439 AH, while the civil/tabular method gives 23 Muharram 1439 AH. Both are calculated conventions, not local sighting reports.",
    "check": "Check the calendar convention, sunset boundary and community announcement. The after-sunset switch is an illustration and cannot detect sunset or confirm a crescent.",
    "benchmark": {
      "site": "Falah",
      "url": "https://falah.io/en/",
      "match": "direct"
    },
    "faq": {
      "question": "Why might a Hijri conversion be one day different?",
      "answer": "Published calendars may use different lunar month starts, and the Islamic day changes at sunset. A calculated date is not proof of a local moon sighting."
    }
  },
  "islamic-age": {
    "example": "Compare your age in lunar years with the age shown on your Gregorian birthday.",
    "check": "Lunar-year age is not itself a religious or legal adulthood ruling.",
    "benchmark": {
      "site": "Falah",
      "url": "https://falah.io/en/",
      "match": "direct"
    },
    "faq": {
      "question": "Why is my Hijri age higher than my Gregorian age?",
      "answer": "Hijri years are roughly eleven days shorter than Gregorian years, so more lunar anniversaries can have passed over the same lifetime."
    }
  },
  "tasbih-counter": {
    "example": "Set a count target, tap to record dhikr, then undo any accidental extra tap.",
    "check": "A counter assists memory; it does not establish a prescribed repetition number.",
    "benchmark": {
      "site": "Humble Halal",
      "url": "https://www.humblehalal.com/tools",
      "match": "direct"
    },
    "faq": {
      "question": "What happens to my Tasbih count if I clear browser data?",
      "answer": "Counts saved locally can be lost when site storage is deleted or a private session ends. A different device does not automatically share that progress."
    }
  },
  "quran-planner": {
    "example": "A 604-page Mushaf over 30 active days requires 20 or 21 pages per day. Reserving four buffer days in a 30-day plan leaves 26 active days and raises the target to about 23–24 pages.",
    "check": "Page totals and juz boundaries vary by edition. A date-based plan does not record recitation automatically, prescribe a religious pace or confirm Ramadan dates.",
    "benchmark": {
      "site": "Quran.com",
      "url": "https://quran.com/",
      "match": "related"
    },
    "faq": {
      "question": "Can I enter a Quran edition with fewer than 604 pages?",
      "answer": "Yes. The plan uses your chosen total page count, completed pages and target duration rather than assuming that every edition has the same layout."
    }
  },
  "fasting-tracker": {
    "example": "With a self-established Qada target of 12, four older undated completions and three newly recorded Qada dates, five remain. Two voluntary dates do not reduce that five.",
    "check": "Dates reflect self-reported completions; browser storage can be lost, so download a backup. Qualified guidance determines the true Qada target, not the tracker.",
    "benchmark": {
      "site": "Humble Halal",
      "url": "https://www.humblehalal.com/tools",
      "match": "direct"
    },
    "faq": {
      "question": "Does every missed fast require a Fidya payment?",
      "answer": "No. Many missed fasts need to be made up instead; the appropriate treatment depends on why the fast was missed and qualified religious guidance."
    }
  },
  "printable-prayer-chart": {
    "example": "Print a two-week chart and tick prayers on paper as a private reminder.",
    "check": "The chart does not judge whether a prayer has been performed correctly.",
    "benchmark": {
      "site": "IslamTools",
      "url": "https://www.islamtools.com/",
      "match": "related"
    },
    "faq": {
      "question": "Can children use this Salah chart?",
      "answer": "A printed chart may help learners practise and remember prayer. It should not be treated as a ruling that all ages have identical obligations."
    }
  },
  "salah-tracker": {
    "example": "Record your daily prayers and inspect the history before downloading a backup.",
    "check": "The record reflects only what you choose to enter.",
    "benchmark": {
      "site": "Humble Halal",
      "url": "https://www.humblehalal.com/tools",
      "match": "direct"
    },
    "faq": {
      "question": "Can I transfer my Salah history between devices?",
      "answer": "You can export a JSON backup and restore it on another device. Review the replacement prompt because importing can overwrite the saved local history."
    }
  },
  "white-days-calendar": {
    "example": "Plan six Hijri months, review every 13th–15th date and notice that Ramadan is obligatory and Dhul Hijjah 13 is Tashreeq, not an ordinary optional fast.",
    "check": "Umm al-Qura and ±1-day alternatives are not observed sightings; only future, potential voluntary dates enter the .ics download.",
    "benchmark": {
      "site": "Falah",
      "url": "https://falah.io/en/",
      "match": "direct"
    },
    "faq": {
      "question": "Do the White Days mean the 13th to 15th of every Gregorian month?",
      "answer": "No. They refer to days 13, 14 and 15 of each lunar Hijri month, which move through the Gregorian calendar."
    }
  },
  "printable-hijri-calendar": {
    "example": "Print a Hijri month alongside Gregorian dates for home or community planning.",
    "check": "A printed estimate is not an official Eid declaration.",
    "benchmark": {
      "site": "Falah",
      "url": "https://falah.io/en/",
      "match": "direct"
    },
    "faq": {
      "question": "Can a calculated calendar confirm Eid for my area?",
      "answer": "Not by itself. Actual month starts may follow local moon sightings or an authorised religious calendar, which can differ from the printed estimate."
    }
  },
  "prayer-times-widget": {
    "example": "Preview a city timetable on your website before adding the embed code.",
    "check": "Calculated start times are not automatically mosque jamaat times.",
    "benchmark": {
      "site": "IslamicFinder",
      "url": "https://www.islamicfinder.org/world/united-kingdom/2643743/london-prayer-times/",
      "match": "direct"
    },
    "faq": {
      "question": "Will a website widget show our mosque's iqamah schedule?",
      "answer": "Not unless that information is separately configured. A calculation-based widget cannot know congregation times set by the mosque."
    }
  },
  "umrah-packing-checklist": {
    "example": "Group documents, medicines and worship essentials before your journey.",
    "check": "Verify current official visa, permit, airline and health rules.",
    "benchmark": {
      "site": "QiblaWeb",
      "url": "https://qiblaweb.com/en",
      "match": "related"
    },
    "faq": {
      "question": "Does a packing checklist verify my Hajj permit?",
      "answer": "No. It helps organise belongings and documents but does not check eligibility, visa validity, or official travel authorisations."
    }
  },
  "qada-prayer-calculator": {
    "example": "Set missed-prayer estimates by period, adjust prayer counts and save a backup of progress.",
    "check": "Exemptions and Witr treatment vary by school and circumstance.",
    "benchmark": {
      "site": "IslamTools",
      "url": "https://www.islamtools.com/",
      "match": "related"
    },
    "faq": {
      "question": "Does every make-up prayer plan have to include Witr?",
      "answer": "Not necessarily. Different schools classify Witr and its make-up differently. Enable Witr only if it matches guidance you have chosen to follow."
    }
  },
  "laylatul-qadr-nights": {
    "example": "With an illustrative 8 February first fast, night 21 begins at sunset on 27 February; a 29-night month includes night 20 in its final ten.",
    "check": "No calculator can identify Laylatul Qadr with certainty. Calendar files mark civil evenings only; they do not know local Maghrib times.",
    "benchmark": {
      "site": "Falah",
      "url": "https://falah.io/en/",
      "match": "related"
    },
    "faq": {
      "question": "Why does the 21st night begin the evening before its daytime date?",
      "answer": "An Islamic night begins at sunset, so a night's Gregorian evening precedes the corresponding daytime date. Check your locally announced Ramadan count."
    }
  },
  "fidya-calculator": {
    "example": "For a purely hypothetical £6 rate, seven eligible days for Person 1 and three for Person 2 produce £42 + £18 = £60, if Fidya was independently confirmed as applicable.",
    "check": "The £6 example is not a verified current rate, and eligibility, recipient rules and cash substitution cannot be determined by arithmetic.",
    "benchmark": {
      "site": "ToolNova",
      "url": "https://www.toolnova.org/islamic-tools",
      "match": "direct"
    },
    "faq": {
      "question": "Is Fidya due for every fast I missed in Ramadan?",
      "answer": "No. Many missed fasts must be made up instead. Circumstances and the school you follow determine when Fidya is appropriate."
    }
  },
  "kaffarah-calculator": {
    "example": "Two hypothetical distinct oath-feeding cases involve 20 recipients; at an illustrative £7 each, the arithmetic is £140. A particular 60-recipient Ramadan feeding case would be £420 at that same invented rate.",
    "check": "Neither scenario confirms liability, the correct alternative, distinctness of repeated oaths or permissibility of a monetary payment. Ramadan fasting in Bukhari 1936 is two successive lunar months, not a flat 60-day rule.",
    "benchmark": {
      "site": "Islamic Relief Kaffarah",
      "url": "https://www.islamic-relief.org.uk/giving/islamic-giving/ramadan/kaffarah/kaffarah-calculator/",
      "match": "direct"
    },
    "faq": {
      "question": "Is Kaffarah always payable in money?",
      "answer": "No. Depending on the type of case and applicable ruling, expiation can involve alternatives such as fasting or feeding. A cash estimate is conditional."
    }
  },
  "qurbani-share-calculator": {
    "example": "Enter the price of a qualifying shared animal and split contributions among participants.",
    "check": "Animal type, intention and eligibility for shared shares need checking.",
    "benchmark": {
      "site": "SalahOne",
      "url": "https://salahone.com/tools",
      "match": "direct"
    },
    "faq": {
      "question": "Can every Qurbani animal be split into seven shares?",
      "answer": "No. The common seven-share arrangement applies to qualifying larger animals under relevant rulings, rather than every sheep or goat."
    }
  },
  "tawaf-sai-counter": {
    "example": "Count seven Tawaf circuits separately from the seven lengths of Sa'i.",
    "check": "A counter cannot check the proper conditions or sequence of rites.",
    "benchmark": {
      "site": "QiblaWeb",
      "url": "https://qiblaweb.com/en",
      "match": "related"
    },
    "faq": {
      "question": "Does seven Sa'i lengths mean seven round trips?",
      "answer": "No. Each trip from Safa to Marwah or back counts as one length. Starting at Safa, the seventh length finishes at Marwah."
    }
  },
  "prayer-rakats-chart": {
    "example": "Use the five Fard rakat counts as a learning reference, not a complete list of voluntary prayers.",
    "check": "Sunnah and Witr units require separate school-specific guidance.",
    "benchmark": {
      "site": "IslamTools",
      "url": "https://www.islamtools.com/",
      "match": "related"
    },
    "faq": {
      "question": "Does the chart include every Sunnah prayer?",
      "answer": "No. It displays the Fard units for the five obligatory prayers, rather than a complete schedule of recommended or Witr prayers."
    }
  },
  "daily-adhkar": {
    "example": "Read a short Quranic supplication and open its verse reference for context.",
    "check": "Do not assume a repetition number without an appropriate source.",
    "benchmark": {
      "site": "Quran.com",
      "url": "https://quran.com/",
      "match": "related"
    },
    "faq": {
      "question": "Is the Quranic Dua tool a complete morning and evening collection?",
      "answer": "No. It currently contains a limited set of Quranic supplications, not a comprehensive authenticated daily adhkar compilation."
    }
  },
  "halal-additives-checker": {
    "example": "Search E471, then ask a manufacturer whether the material used is plant- or animal-derived.",
    "check": "An E-number by itself is not a halal certification.",
    "benchmark": {
      "site": "TaqwaTools",
      "url": "https://taqwatools.com/",
      "match": "direct"
    },
    "faq": {
      "question": "Does the E471 code prove a product is forbidden?",
      "answer": "No. That emulsifier can come from different sources. The code alone cannot establish origin or certify the complete finished product."
    }
  },
  "zakat-anniversary-calculator": {
    "example": "Set a reference date, then use its next Hijri anniversary as a reminder to review Zakat.",
    "check": "The date is not an automatic determination of liability.",
    "benchmark": {
      "site": "Islamic Relief Nisab",
      "url": "https://www.islamic-relief.org.uk/giving/islamic-giving/zakat/nisab/",
      "match": "related"
    },
    "faq": {
      "question": "Is a Zakat anniversary always 365 days later?",
      "answer": "No. Hijri years are around 354 or 355 days. Nisab and hawl conditions require separate religious assessment."
    }
  },
  "dhul-hijjah-planner": {
    "example": "Print estimated dates for the first ten days, then confirm Arafah and Eid nearer the time.",
    "check": "Do not treat a calculated calendar as an announcement.",
    "benchmark": {
      "site": "timeanddate",
      "url": "https://www.timeanddate.com/calendar/islamic-calendar.html",
      "match": "related"
    },
    "faq": {
      "question": "Does Arafah always fall on the same weekday?",
      "answer": "No. The ninth of Dhul Hijjah moves through the Gregorian year, so its civil date and weekday change."
    }
  },
  "travel-prayer-guide": {
    "example": "Review the four-rakat prayers that may be shortened on a qualifying journey.",
    "check": "Distance and stay entries do not decide legal eligibility.",
    "benchmark": {
      "site": "IslamTools",
      "url": "https://www.islamtools.com/",
      "match": "related"
    },
    "faq": {
      "question": "Is Maghrib shortened to two rakats while travelling?",
      "answer": "No. Under the common Qasr framework Maghrib remains three Fard rakats. The shortening applies to qualifying four-rakat obligatory prayers."
    }
  },
  "quran-juz-finder": {
    "example": "Locate Juz 30 by its first Surah and Ayah rather than assuming a page number.",
    "check": "Printed Quran page layouts vary across editions.",
    "benchmark": {
      "site": "Quran.com",
      "url": "https://quran.com/",
      "match": "direct"
    },
    "faq": {
      "question": "Does every Juz begin at the start of a Surah?",
      "answer": "No. Many Juz begin partway through a chapter. The tool provides starting verse references for navigating a Quran copy."
    }
  },
  "zakat-stocks-crypto": {
    "example": "Enter current investment valuations in one currency for a conditional estimate.",
    "check": "Different investment holdings can have different scholarly treatments.",
    "benchmark": {
      "site": "Islamic Relief Zakat",
      "url": "https://www.islamic-relief.org.uk/giving/islamic-giving/zakat/zakat-calculator/",
      "match": "related"
    },
    "faq": {
      "question": "Is Zakat on long-term investments always the same as cash?",
      "answer": "Not universally. Some approaches distinguish trading holdings and long-term investments or account for underlying assets. Check the method you follow."
    }
  },
  "hifz-tracker": {
    "example": "Record a small verse target and schedule revision before adding new material.",
    "check": "The number completed does not measure retention or recitation quality.",
    "benchmark": {
      "site": "Quran.com",
      "url": "https://quran.com/",
      "match": "related"
    },
    "faq": {
      "question": "Should I memorise a fixed number of verses every day?",
      "answer": "Choose a sustainable target that includes revision. This tracker estimates progress but does not assess Tajwid, fluency or memorisation accuracy."
    }
  }
};
