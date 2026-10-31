// Primary user journeys, ordered by search intent and day-to-day usefulness.
// Each slug appears in exactly one group. Homepage ordering follows these groups.
export const toolTopics=[
 {id:'prayer',label:'Prayer & daily essentials',description:'Prayer times, Qibla, today’s Hijri date and daily Salah tools.',slugs:['prayer-times','qibla-finder','hijri-converter','tahajjud-time','duha-prayer-time','printable-prayer-chart','prayer-times-widget','salah-tracker','qada-prayer-calculator','prayer-rakats-chart','travel-prayer-guide']},
 {id:'ramadan',label:'Ramadan & fasting',description:'Suhoor, Iftar, Ramadan planning and White Days fasting.',slugs:['fasting-times','ramadan-timetable','ramadan-countdown','laylatul-qadr-nights','white-days-calendar','fasting-tracker','sunnah-fasting-planner']},
 {id:'zakat',label:'Zakat & giving',description:'Zakat, Nisab, Fitrana, Fidya and Kaffarah estimates.',slugs:['zakat-calculator','fitrana-calculator','gold-zakat-calculator','nisab-calculator','fidya-calculator','kaffarah-calculator','zakat-anniversary-calculator','zakat-stocks-crypto']},
 {id:'dates',label:'Islamic dates & calendars',description:'Important lunar dates, printable calendars and Hijri age.',slugs:['islamic-events-calendar','printable-hijri-calendar','islamic-age','hijama-date-planner','dhul-hijjah-planner']},
 {id:'pilgrimage',label:'Hajj & Umrah',description:'Practical Hajj and Umrah journey tools.',slugs:['umrah-packing-checklist','tawaf-sai-counter']},
 {id:'everyday',label:'Qur’an, dhikr & everyday life',description:'Quran learning, remembrance and practical Islamic living.',slugs:['quran-planner','quran-juz-finder','hifz-tracker','daily-adhkar','tasbih-counter','istikhara-guide','friday-sunnah-checklist','qurbani-share-calculator','aqiqah-planner','halal-additives-checker','islamic-will-planner']}
] as const;
export const toolTopicBySlug:Record<string,string>=Object.fromEntries(toolTopics.flatMap(topic=>topic.slugs.map(slug=>[slug,topic.id])));
