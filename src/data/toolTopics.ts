// Primary user journeys, ordered by search intent and day-to-day usefulness.
// Every slug belongs to exactly one group; homepage CMS ordering follows these groups.
export const toolTopics=[
 {id:'prayer',label:'Prayer & daily essentials',description:'Prayer times, Qibla, today’s Hijri date and daily Salah tools.',slugs:['prayer-times','qibla-finder','hijri-converter','tahajjud-time','printable-prayer-chart','prayer-times-widget','salah-tracker']},
 {id:'ramadan',label:'Ramadan & fasting',description:'Suhoor, Iftar, Ramadan planning and White Days fasting.',slugs:['fasting-times','ramadan-timetable','ramadan-countdown','white-days-calendar','fasting-tracker']},
 {id:'zakat',label:'Zakat & giving',description:'Zakat on savings, Fitrana, gold and Nisab thresholds.',slugs:['zakat-calculator','fitrana-calculator','gold-zakat-calculator','nisab-calculator']},
 {id:'dates',label:'Islamic dates & calendars',description:'Important lunar dates, printable calendars and Hijri age.',slugs:['islamic-events-calendar','printable-hijri-calendar','islamic-age']},
 {id:'everyday',label:'Hajj, Umrah & worship',description:'Packing, dhikr and daily Quran reading plans.',slugs:['umrah-packing-checklist','tasbih-counter','quran-planner']}
] as const;
export const toolTopicBySlug:Record<string,string>=Object.fromEntries(toolTopics.flatMap(topic=>topic.slugs.map(slug=>[slug,topic.id])));
