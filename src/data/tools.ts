export const tools = [
 {slug:'prayer-times',name:'Prayer Times',desc:'Find Fajr, Dhuhr, Asr, Maghrib and Isha for your location.',icon:'◷',category:'Prayer',keywords:'salah namaz daily prayer timetable'},
 {slug:'qibla-finder',name:'Qibla Finder',desc:'Calculate the direction of the Kaaba from anywhere.',icon:'➤',category:'Prayer',keywords:'mecca compass direction'},
 {slug:'tahajjud-time',name:'Last Third of Night',desc:'See when the final third of the night begins.',icon:'☾',category:'Prayer',keywords:'tahajjud time night prayer calculator'},
 {slug:'ramadan-timetable',name:'Ramadan Timetable',desc:'Generate and print Fajr and Maghrib timings.',icon:'▦',category:'Ramadan',keywords:'suhoor iftar calendar pdf 2027'},
 {slug:'ramadan-countdown',name:'Ramadan Countdown',desc:'Count down to an estimated first day of Ramadan.',icon:'◴',category:'Ramadan',keywords:'ramadan 2027 days remaining'},
 {slug:'zakat-calculator',name:'Zakat Calculator',desc:'Estimate Zakat on savings, gold and investments.',icon:'◈',category:'Zakat',keywords:'zakat calculator gold cash business'},
 {slug:'nisab-calculator',name:'Nisab Calculator',desc:'Compare the gold and silver wealth thresholds.',icon:'◇',category:'Zakat',keywords:'gold silver nisab current value price'},
 {slug:'hijri-converter',name:'Hijri Date Converter',desc:'Check the Islamic date for a Gregorian date.',icon:'◉',category:'Dates',keywords:'islamic date today hijri calendar'},
 {slug:'islamic-age',name:'Islamic Age Calculator',desc:'Find your age in Islamic lunar years.',icon:'✧',category:'Dates',keywords:'hijri birthday lunar age'},
 {slug:'tasbih-counter',name:'Digital Tasbih',desc:'Count dhikr and save progress on this device.',icon:'◎',category:'Everyday',keywords:'online dhikr counter'},
 {slug:'quran-planner',name:'Quran Reading Planner',desc:'Plan your daily reading to finish the Quran.',icon:'▤',category:'Everyday',keywords:'quran khatm ramadan reading pages'},
 {slug:'fasting-tracker',name:'Fasting Tracker',desc:'Track completed and remaining make-up fasts.',icon:'✓',category:'Ramadan',keywords:'qada missed fasts Ramadan'},
 {slug:'salah-tracker',name:'Daily Salah Tracker',desc:'Tick off your five daily prayers privately.',icon:'□',category:'Everyday',keywords:'daily prayer tracker checklist'}
] as const;
export type ToolSlug = typeof tools[number]['slug'];
export const toolBySlug = Object.fromEntries(tools.map(tool=>[tool.slug,tool])) as Record<ToolSlug,typeof tools[number]>;
