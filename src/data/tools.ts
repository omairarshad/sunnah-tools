export const tools = [
 {slug:'prayer-times',name:'Prayer Times',desc:'Find Fajr, Dhuhr, Asr, Maghrib and Isha for your location.',icon:'◷',category:'Prayer',keywords:'salah namaz daily prayer timetable'},
 {slug:'fasting-times',name:'Suhoor & Iftar Times',desc:'See calculated fasting start, iftar and the next countdown.',icon:'◴',category:'Ramadan',keywords:'sehri imsak iftar maghrib fajr times fasting'},
 {slug:'qibla-finder',name:'Qibla Finder',desc:'Calculate the direction of the Kaaba from anywhere.',icon:'➤',category:'Prayer',keywords:'mecca compass direction'},
 {slug:'tahajjud-time',name:'Tahajjud Time Calculator',desc:'See when the final third of the night begins.',icon:'☾',category:'Prayer',keywords:'tahajjud time night prayer calculator'},
 {slug:'ramadan-timetable',name:'Ramadan Timetable',desc:'Generate and print Fajr and Maghrib timings.',icon:'▦',category:'Ramadan',keywords:'suhoor iftar calendar pdf 2027'},
 {slug:'ramadan-countdown',name:'Ramadan Countdown',desc:'Count down to an estimated first day of Ramadan.',icon:'◴',category:'Ramadan',keywords:'ramadan 2027 days remaining'},
 {slug:'zakat-calculator',name:'Zakat Calculator',desc:'Estimate Zakat on savings, gold and investments.',icon:'◈',category:'Zakat',keywords:'zakat calculator gold cash business'},
 {slug:'fitrana-calculator',name:'Fitrana Calculator',desc:'Estimate Zakat al-Fitr for your household using a verified local rate.',icon:'◈',category:'Zakat',keywords:'fitrana zakat al fitr amount household calculator 2027 ramadan'},
 {slug:'gold-zakat-calculator',name:'Gold Zakat Calculator',desc:'Estimate the value of 9k–24k gold and conditional Zakat.',icon:'◈',category:'Zakat',keywords:'22k 18k 24k jewellery gold zakat gram purity'},
 {slug:'nisab-calculator',name:'Nisab Calculator',desc:'Compare the gold and silver wealth thresholds.',icon:'◇',category:'Zakat',keywords:'gold silver nisab current value price'},
 {slug:'islamic-events-calendar',name:'Islamic Events Calendar',desc:'Explore estimated dates for Ramadan, Eid, Ashura and Hajj.',icon:'▦',category:'Dates',keywords:'muslim islamic holidays religious dates eid 2027'},
 {slug:'hijri-converter',name:'Hijri Date Converter',desc:'Check the Islamic date for a Gregorian date.',icon:'◉',category:'Dates',keywords:'islamic date today hijri calendar'},
 {slug:'islamic-age',name:'Islamic Age Calculator',desc:'Find your age in Islamic lunar years.',icon:'✧',category:'Dates',keywords:'hijri birthday lunar age'},
 {slug:'tasbih-counter',name:'Digital Tasbih',desc:'Count dhikr and save progress on this device.',icon:'◎',category:'Everyday',keywords:'online dhikr counter'},
 {slug:'quran-planner',name:'Quran Reading Planner',desc:'Plan your daily reading to finish the Quran.',icon:'▤',category:'Everyday',keywords:'quran khatm ramadan reading pages'},
 {slug:'fasting-tracker',name:'Fasting Tracker',desc:'Track completed and remaining make-up fasts.',icon:'✓',category:'Ramadan',keywords:'qada missed fasts Ramadan'},
 {slug:'printable-prayer-chart',name:'Printable Prayer Chart',desc:'Make a free 7, 14 or 30 day Salah checklist PDF.',icon:'☷',category:'Everyday',keywords:'prayer tracker chart printable kids daily prayer pdf'},
 {slug:'salah-tracker',name:'Daily Salah Tracker',desc:'Tick off your five daily prayers privately.',icon:'□',category:'Everyday',keywords:'daily prayer tracker checklist'},
 {slug:'white-days-calendar',name:'White Days Fasting Calendar',desc:'See the upcoming 13th–15th Hijri dates and export reminders.',icon:'☾',category:'Dates',keywords:'ayyam al bid white days fasting calendar 13 14 15'},
 {slug:'printable-hijri-calendar',name:'Printable Hijri Calendar',desc:'Create an Islamic monthly calendar to print or save as PDF.',icon:'▦',category:'Dates',keywords:'islamic month calendar hijri printable pdf'},
 {slug:'prayer-times-widget',name:'Prayer Times Website Widget',desc:'Create an embeddable timetable for a mosque or community site.',icon:'◷',category:'Prayer',keywords:'mosque embed salah namaz prayer times iframe'},
 {slug:'umrah-packing-checklist',name:'Hajj & Umrah Packing List',desc:'Plan, tick off and print a practical journey checklist.',icon:'✓',category:'Everyday',keywords:'hajj umrah travel packing checklist printable'}
] as const;
export type ToolSlug = typeof tools[number]['slug'];
export const toolBySlug = Object.fromEntries(tools.map(tool=>[tool.slug,tool])) as Record<ToolSlug,typeof tools[number]>;
