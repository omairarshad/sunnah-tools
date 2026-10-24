/** Per-tool accents intentionally repeat across a small accessible palette, rather than making every card identical. */
export const toneForSlug=(slug:string):string=>({
 'prayer-times':'teal','fasting-times':'amber','qibla-finder':'blue','tahajjud-time':'violet',
 'ramadan-timetable':'coral','ramadan-countdown':'rose','zakat-calculator':'emerald','gold-zakat-calculator':'amber','fitrana-calculator':'coral',
 'nisab-calculator':'violet','islamic-events-calendar':'blue','hijri-converter':'teal','islamic-age':'rose',
 'tasbih-counter':'coral','quran-planner':'indigo','fasting-tracker':'mint','printable-prayer-chart':'blue',
 'salah-tracker':'emerald','white-days-calendar':'violet','printable-hijri-calendar':'amber',
 'prayer-times-widget':'indigo','umrah-packing-checklist':'coral'
} as Record<string,string>)[slug]??'teal';
