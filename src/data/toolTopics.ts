// User-oriented categories. Keep the homepage's CMS order aligned with these groups.
export const toolTopics=[
 {id:'prayer',label:'Prayer & daily Salah',description:'Prayer times, Qibla and tracking your daily prayers.',slugs:['prayer-times','qibla-finder','tahajjud-time','salah-tracker','printable-prayer-chart','prayer-times-widget']},
 {id:'dates',label:'Hijri dates & calendars',description:'Today’s Islamic date, lunar months and important events.',slugs:['hijri-converter','islamic-events-calendar','white-days-calendar','printable-hijri-calendar','islamic-age']},
 {id:'ramadan',label:'Ramadan & fasting',description:'Suhoor, Iftar, Ramadan dates and fasting progress.',slugs:['fasting-times','ramadan-timetable','ramadan-countdown','fasting-tracker']},
 {id:'zakat',label:'Zakat & giving',description:'Calculate Zakat, Nisab, gold and Fitrana.',slugs:['zakat-calculator','nisab-calculator','gold-zakat-calculator','fitrana-calculator']},
 {id:'everyday',label:'Worship & travel',description:'Dhikr, Quran reading and Hajj or Umrah preparation.',slugs:['tasbih-counter','quran-planner','umrah-packing-checklist']}
] as const;
export const toolTopicBySlug:Record<string,string>=Object.fromEntries(toolTopics.flatMap(topic=>topic.slugs.map(slug=>[slug,topic.id])));
