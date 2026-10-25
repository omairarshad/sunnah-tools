// Primary user journeys, ordered by search intent and day-to-day usefulness.
// Every slug belongs to exactly one group; homepage CMS ordering follows these groups.
export const toolTopics=[
 {id:'prayer',label:'Prayer & daily essentials',description:'Prayer times, Qibla, today’s Hijri date and daily Salah tools.',slugs:['prayer-times','qibla-finder','hijri-converter','tahajjud-time','printable-prayer-chart','prayer-times-widget','salah-tracker','qada-prayer-calculator','prayer-rakats-chart','travel-prayer-guide']},
 {id:'ramadan',label:'Ramadan & fasting',description:'Suhoor, Iftar, Ramadan planning and White Days fasting.',slugs:['fasting-times','ramadan-timetable','ramadan-countdown','laylatul-qadr-nights','white-days-calendar','fasting-tracker',]},
 {id:'zakat',label:'Zakat & giving',description:'Zakat, Nisab, Fitrana, Fidya and Kaffarah estimates.',slugs:['zakat-calculator','fitrana-calculator','gold-zakat-calculator','nisab-calculator','fidya-calculator','kaffarah-calculator','zakat-anniversary-calculator','zakat-stocks-crypto']},
 {id:'dates',label:'Islamic dates & calendars',description:'Important lunar dates, printable calendars and Hijri age.',slugs:['islamic-events-calendar','printable-hijri-calendar','islamic-age','dhul-hijjah-planner']},
 {id:'everyday',label:'Hajj, Umrah & worship',description:'Hajj, Umrah, Qurbani, dhikr and Quran plans.',slugs:['umrah-packing-checklist','tasbih-counter','quran-planner','qurbani-share-calculator','tawaf-sai-counter','daily-adhkar','quran-juz-finder','hifz-tracker','halal-additives-checker']}
] as const;
export const toolTopicBySlug:Record<string,string>=Object.fromEntries(toolTopics.flatMap(topic=>topic.slugs.map(slug=>[slug,topic.id])));
